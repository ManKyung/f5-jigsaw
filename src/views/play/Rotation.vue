<template>
  <v-ons-page class="game-page">
    <v-ons-toolbar class="game-top white" style="min-height:64px; background-image: none;">
      <div class="left pt-2 w-100">
        <v-ons-back-button class="pl-4"></v-ons-back-button>
      </div>
      <div class="right pt-2">
        <v-ons-toolbar-button
          :style="actionSheetVisible ? 'color:#6c5ce7' : 'color:#111'"
          @click="actionSheetVisible = !actionSheetVisible"
        >
          <v-ons-icon icon="ion-ios-image"></v-ons-icon>
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <div
      class="game-background game-container"
      ref="gameContainer"
      :style="`background:url('${background}'); padding-top:${paddingTop}px`"
    >
      <div class="pa-5 preview-wrap" :class="actionSheetVisible ? 'on' : ''">
        <img
          ref="preview"
          class="w-100 previewImage"
          :class="actionSheetVisible ? 'on' : ''"
          :src="imageSrc"
        />
      </div>
      <div class="pa-5 board-real-wrap">
        <div id="board-real" :style="`max-height:${boardHeight}px; overflow:hidden`">
          <div
            v-for="(item, index) in realBoardItems"
            :key="index"
            :style="`width: ${pWidth}px; height:${pHeight}px`"
            @click="transPiece(index)"
          >
            <div v-if="item.style" :style="item.style"></div>
          </div>
        </div>
      </div>
    </div>
  </v-ons-page>
</template>

<style scoped>
#board-real div {
  box-shadow: none;
}
#board-real div:hover {
  background: none;
}
</style>

<script>
import clearPage from '@/views/play/Clear';
export default {
  props: {
    category: {
      type: String,
      default: "animal"
    },
    src: {
      type: String,
      default: "1.jpg"
    },
    pCount: {
      type: Number,
      default: 3
    },
    id: {
      type: Number,
      default: 1
    }
  },
  name: "rotation-play",
  data() {
    return {
      previewImage: null,
      imageSrc: "",
      realBoardItems: [],
      pieceCount: 0,
      pWidth: 0,
      pHeight: 0,
      boardHeight: 0,
      actionSheetVisible: true,
      paddingTop: 0,
      background: this.$store.state.gameSet.background,
      borderColor: this.$store.state.gameSet.backgroundBorder
    };
  },
  created() {
    this.imageSrc = require(`../../assets/img/${this.category}/${this.src}`);
    this.pieceCount = this.pCount;
    this.background = require(`../../assets/img/background/${this.background}.jpg`);
  },
  mounted() {
    setTimeout(() => {
      this.setBoard();
      document.body._gestureDetector.dispose();
    }, 200);

    setTimeout(() => {
      this.actionSheetVisible = false;
    }, 1000);
  },
  methods: {
    isClear(){
      let len = this.realBoardItems.length;

      for(let i = 0 ; i < len ; i++){
        if(this.realBoardItems[i].angle !== 0) {
          return false;
        }
      }

      return true;
    },
    transPiece(i){
      let angle = this.realBoardItems[i].angle + 90;
      angle = angle / 360 === 1 ? 0 : angle;
      this.realBoardItems[i].angle = angle;
      this.realBoardItems[i].style = `${this.realBoardItems[i].style}; transform:rotate(${angle}deg);`;

      if(this.isClear()){
        this.$emit("push-page", {
          ...clearPage,
          onsNavigatorProps: {
            category: this.category,
            id: this.id,
          }
        });
      }
    },
    setBoard() {
      this.previewImage = this.$refs.preview;
      let gameContainer = this.$refs.gameContainer;

      // let rest = this.previewImage.clientWidth % this.pieceCount;
      let clientWidth = this.previewImage.clientWidth;

      this.pWidth = this.pHeight = clientWidth / this.pieceCount;
      this.boardHeight = clientWidth;
      this.paddingTop =
        gameContainer.clientHeight / 2 - (this.boardHeight + 40) / 2;

      let temp = [];
      for (let i = 0; i < this.pieceCount; i++) {
        for (let j = 0; j < this.pieceCount; j++) {
          let angle = 90 * Math.floor(Math.random() * 4);
          let item = {};
          item.class = "piece-item";
          item.style = `width: ${this.pWidth}px; height: ${this.pHeight}px; transform:rotate(${angle}deg); background: url(${this.imageSrc}); background-size:${this.previewImage.clientWidth}px ${this.previewImage.clientHeight}px; background-position: -${j * this.pWidth}px -${i * this.pHeight}px;`;
          item.angle = angle
          temp.push(item);
        }
      }
      this.realBoardItems = temp;
    }
  }
};
</script>
