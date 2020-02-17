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
            @click="sliderPiece(index)"
          >
            <div v-if="item.style" :style="item.style"></div>
          </div>
        </div>
      </div>

      <v-ons-modal :visible="modalClear" @click="modalClear = false">
        <div class="clear-wrap w-100" :class="isClearOn ? 'on' : ''">
        <v-ons-row>
          <v-ons-col class="c-text"></v-ons-col>
          <v-ons-col class="c-text">C</v-ons-col>
          <v-ons-col class="c-text">L</v-ons-col>
          <v-ons-col class="c-text">E</v-ons-col>
          <v-ons-col class="c-text">A</v-ons-col>
          <v-ons-col class="c-text">R</v-ons-col>
          <v-ons-col class="c-text"></v-ons-col>
        </v-ons-row>
        <div class="pt-12 px-4">
          <v-ons-button modifier="large">NEXT</v-ons-button>
        </div>
        </div>
      </v-ons-modal>
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
// import clearPage from '@/views/play/Clear';
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
  name: "slider-play",
  data() {
    return {
      previewImage: null,
      imageSrc: "",
      realBoardItems: [],
      emptyItem: {},
      pieceCount: 0,
      pWidth: 0,
      pHeight: 0,
      boardHeight: 0,
      actionSheetVisible: true,
      paddingTop: 0,
      background: this.$store.state.gameSet.background,
      borderColor: this.$store.state.gameSet.backgroundBorder,
      emptyIndex: 0,
      modalClear: false,
      isClearOn: false
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
      if(this.emptyIndex !== len - 1) {
        return false;
      }

      for(let i = 0 ; i < len - 1 ; i++){
        if(i !== this.realBoardItems[i].id) {
          return false;
        }
      }

      this.realBoardItems[len - 1] = this.emptyItem;
      return true;
    },
    getNearIndex(i){
      let pieceCount = this.pieceCount

      let left = -1;
      let right = -1;
      let top = -1;
      let bottom = -1;

      left = i % pieceCount !== 0 ? i - 1 : -1;
      right = i % pieceCount !== pieceCount - 1 ? i + 1 : -1;
      top = i - pieceCount >= 0 ? i - pieceCount : -1;
      bottom = i + pieceCount < Math.pow(pieceCount, 2) ? i + pieceCount : -1;

      return {
        top: top,
        right: right,
        bottom: bottom,
        left: left,
      }
    },
    sliderPiece(i) {
      if(this.emptyIndex === i){ return ; }
      let nearIndex = this.getNearIndex(i)

      for(const key in nearIndex){
        if(nearIndex[key] === this.emptyIndex){
          this.$set(this.realBoardItems, this.emptyIndex, this.realBoardItems[i])
          this.$set(this.realBoardItems, i, {})
          this.emptyIndex = i;
        }
      }

      if(this.isClear()) {
        setTimeout(() => {
          this.modalClear = true;
        }, 1000)
        setTimeout(() => {
          this.isClearOn = true;
        }, 1200)
        
        // this.$emit("push-page", {
        //   ...clearPage,
        //   onsNavigatorProps: {
        //     category: this.category,
        //     id: this.id,
        //   }
        // });
      }
    },
    setBoard() {
      this.previewImage = this.$refs.preview;
      let gameContainer = this.$refs.gameContainer;

      let clientWidth = this.previewImage.clientWidth;

      this.pWidth = this.pHeight = clientWidth / this.pieceCount;
      this.boardHeight = clientWidth;
      this.paddingTop =
        gameContainer.clientHeight / 2 - (this.boardHeight + 40) / 2;

      let temp = [];
      for (let i = 0; i < this.pieceCount; i++) {
        for (let j = 0; j < this.pieceCount; j++) {
          let item = {};

          item.id = i * this.pieceCount + j;
          item.class = "piece-item";
          item.style = `width: ${this.pWidth}px; height: ${
            this.pHeight
          }px; background: url(${this.imageSrc}); background-size:${
            this.previewImage.clientWidth
          }px ${this.previewImage.clientHeight}px; background-position: -${j *
            this.pWidth}px -${i * this.pHeight}px;`;

          if (i === this.pieceCount - 1 && j === this.pieceCount - 1) {
            temp.push({});
            this.emptyItem = item;
          } else {
            temp.push(item);
          }
        }
      }
      // this.realBoardItems = this.shuffle(temp);
      this.realBoardItems = temp;

      for(const i in this.realBoardItems){
        if(this.realBoardItems[i].class === undefined){
          this.emptyIndex = Number(i);
          break;
        }
      }
    },
    shuffle(a){
      for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
  }
};
</script>
