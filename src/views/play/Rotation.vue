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
      <div class="pa-5 board-real-wrap" ref="boardWrap">
        <div id="board-real" :style="`max-height:${boardHeight}px; overflow:hidden`">
          <div
            v-for="(item, index) in realBoardItems"
            :key="index"
            :style="`width: ${pWidth}px; height:${pHeight}px`"
            v-hammer:tap="(event)=> transPiece(event, index)"
            v-hammer:pan="(event)=> transPiece(event, index)"
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
            <v-ons-button class="w-100 text-center next-text" 
            v-hammer:tap="next"
            v-hammer:press="next"
            v-hammer:pressup="next"
          >NEXT</v-ons-button>
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
import { showRewardVideo } from "@/assets/js/admob.js";
export default {
  props: {
    gameType: {
      type: String,
      default: 'jigsaw'
    },
    level: {
      type: Number,
      default: 1
    },
    category: {
      type: String,
      default: "cats"
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
    isHint: {
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
      length: 0,
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
    setTimeout(() => {
      this.setUI();
    }, 1000);
    document.addEventListener(
      "admob.rewardvideo.events.REWARD",
      this.getReward
    );
  },
  destroyed() {
    document.removeEventListener(
      "admob.rewardvideo.events.REWARD",
      this.getReward
    );
  },
  watch: {
    isHint(){
      showRewardVideo();
      // this.getReward();
    },
    background(value){
      this.setBackground(value)
    }
  },
  methods: {
    getReward(){
      let len = this.realBoardItems.length / 2;
      for(let i = 0 ; i < len ; i++){
        this.realBoardItems[i].style = `${this.realBoardItems[i].style}; transform:rotate(0deg);`;
      }
    },
    setUI(){
      let gameContainer = this.$refs.gameContainer;
      let boardWrap = this.$refs.boardWrap;
      this.paddingTop = (gameContainer.clientHeight - boardWrap.clientHeight) / 2;
    },
    setBackground(value){
      this.backgroundImage = require(`../../assets/img/background/${value}.jpg`);
    },
    next(e){
      if(e.type === 'tap' || e.type === 'pressup'){
        setTimeout(() => {
          this.isClearOn = false;
        }, 100)
        setTimeout(() => {
          this.modalClear = false;
          this.$emit('goMainPage');
        }, 400)
      }
    },
    isClear(){
      this.getPercent();
      for(let i = 0 ; i < this.length ; i++){
        if(this.realBoardItems[i].angle !== 0) {
          return false;
        }
      }

      let params = {
        gameType: this.gameType,
        category: this.category,
        id: this.id,
        src: this.src,
        pCount: this.pieceCount,
        level: this.level
      };
      this.$store.dispatch("gameSet/setGameClear", params);

      return true;
    },
    getPercent(){
      let count = this.realBoardItems.filter(item => {
        return item.angle === 0;
      }).length;

      let percent = count * 100 / this.length;
      this.$emit('setPercent', percent)
    },
    transPiece(e, i){
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

      let clientWidth = this.previewImage.clientWidth;
      this.pWidth = this.pHeight = clientWidth / this.pieceCount;
      this.boardHeight = clientWidth;

      let temp = [];
      for (let i = 0; i < this.pieceCount; i++) {
        for (let j = 0; j < this.pieceCount; j++) {
          let angle = 90 * this.getRandom(1, 4);
          let item = {};
          item.class = "piece-item";
          item.style = `width: ${this.pWidth}px; height: ${this.pHeight}px; transform:rotate(${angle}deg); background: url(${this.imageSrc}); background-size:${this.previewImage.clientWidth}px ${this.previewImage.clientHeight}px; background-position: -${j * this.pWidth}px -${i * this.pHeight}px;`;
          item.angle = angle
          temp.push(item);
        }
      }
      this.realBoardItems = temp;
      this.length = this.realBoardItems.length;
    },
    getRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
  }
};
</script>
