<template>

    <div
      class="game-background game-container"
      ref="gameContainer"
      :style="`background:url('${backgroundImage}'); padding-top:${paddingTop}px`"
    >
    <div class="pa-5 preview-wrap" :class="[isVisiblePreview ? 'on' : '', isClearImage ? 'on clear' : '']">
      <img
        ref="preview"
        class="w-100 previewImage"
        :class="[isVisiblePreview ? 'on' : '',
        isClearImage ? 'on clear' : '']"
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

      <v-ons-modal :visible="modalClear">
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
          <v-ons-button modifier="large" @click="next">NEXT</v-ons-button>
        </div>
        </div>
      </v-ons-modal>
    </div>
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
    },
    isVisiblePreview: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    background: {
      type: String,
      default: 'default',
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
      paddingTop: 0,

      backgroundImage: '',
      modalClear: false,
      isClearOn: false,
      isClearImage: false,
    };
  },
  created() {
    this.pieceCount = this.pCount;
    this.imageSrc = require(`../../assets/img/${this.category}/${this.src}`);
    this.setBackground(this.background);
  },
  mounted() {
    setTimeout(() => {
      this.setBoard();
    }, 200);
  },
  watch: {
    background(value){
      this.setBackground(value)
    }
  },
  methods: {
    setBackground(value){
      this.backgroundImage = require(`../../assets/img/background/${value}.jpg`);
    },
    next(){
      setTimeout(() => {
        this.isClearOn = false;
      }, 100)
      setTimeout(() => {
        this.modalClear = false;
        this.$emit('goMainPage');
      }, 400)
    },
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
      
      if(this.isClear()) {
        this.isClearImage = true;
        setTimeout(() => {
          this.modalClear = true;
        }, 1000)
        setTimeout(() => {
          this.isClearOn = true;
        }, 1300)
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
