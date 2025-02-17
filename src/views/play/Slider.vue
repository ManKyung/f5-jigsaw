<template>
  <div
    class="game-background game-container"
    ref="gameContainer"
    :style="`background:url('${backgroundImage}'); padding-top:${paddingTop}px`"
  >
    <div ref="previewWrap" class="pa-5 preview-wrap" :class="[isVisiblePreview ? 'on' : '', isClearImage ? 'on clear' : '']">
      <img
        ref="preview"
        class="w-100 previewImage"
        :class="[isVisiblePreview ? 'on' : '',
        isClearImage ? 'on clear' : '']"
        :src="imageSrc"
      />
    </div>
    <div class="pa-5 board-real-wrap" ref="boardWrap">
      <div id="board-real" :style="`max-height:${boardHeight}px; overflow:hidden;`">
        <div
          v-for="(item, index) in realBoardItems"
          class="board-item slider-piece"
          :key="index"
          :style="`${item.style}; transition: all 0.08s; position:absolute;`"
          :data-id="`${index}`"
          v-hammer:pan.start="(event)=> sliderPiece(event, item)"
          :id="`piece-${index}`" 
        >
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
    },
    isLight: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
  },
  name: "slider-play",
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
      emptyIndex: 0,

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
      this.setBoard(true);
      this.setUI();
      this.getPercent();
    }, 500);
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
    isLight(value){
      this.getLight(value);
    },
    isHint(){
      showRewardVideo();
      // this.getReward();
    },
    background(value){
      this.setBackground(value)
    }
  },
  methods: {
    getLight(value){
      for(let i = 0 ; i < this.length ; i++){
        if(this.realBoardItems[i].id !== undefined && i !== this.realBoardItems[i].id && i !== this.emptyIndex) {
          let curDom = document.querySelectorAll(`[data-id="${i}"]`)
          if(value) {
            curDom[0].classList.add('search')
          } else {
            curDom[0].classList.remove('search')
          }
        }
      }
    },
    getReward(){
      if(this.isLight){
        this.getLight(false);
        this.$emit('isUpdateLight', false)
      }
      this.realBoardItems = [];
      setTimeout(() => {
        this.setBoard(false);
        this.getPercent();
      }, 10)
    },
    setUI(){
      let gameContainer = this.$refs.gameContainer;
      let previewWrap = this.$refs.previewWrap;
      this.paddingTop = (gameContainer.clientHeight - previewWrap.clientHeight) / 2;
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
          this.$emit('goPopPage');
        }, 400)
      }
    },
    isClear(){
      this.getPercent();
      if(this.emptyIndex !== this.length - 1) {
        return false;
      }

      for(let i = 0 ; i < this.length - 1 ; i++){
        if(i !== this.realBoardItems[i].id) {
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
        TOP: top,
        RIGHT: right,
        BOTTOM: bottom,
        LEFT: left,
      }
    },
    getPercent(){
      let count = 0;
      for(let i = 0 ; i < this.length ; i++){
        if(i === this.realBoardItems[i].id) {
          count++;
        }
      }

      let percent = count * 100 / this.length;
      if(this.length - 1 === count) {
        percent = 100;
      }

      this.$emit('setPercent', percent)
    },
    sliderPiece(e, item) {
      if(this.isLight){
        this.getLight(false);
        this.$emit('isUpdateLight', false)
      }
      let i = Number(e.target.getAttribute('data-id'));
      let nearIndex = this.getNearIndex(i);
      if(e.additionalEvent === undefined || this.emptyIndex === i){
        return ;
      }

      if(nearIndex.TOP !== this.emptyIndex && nearIndex.BOTTOM !== this.emptyIndex && nearIndex.LEFT !== this.emptyIndex && nearIndex.RIGHT !== this.emptyIndex){
        return ;
      }
      let target = e.target;
      this.realBoardItems[this.emptyIndex].id = -1;
      if(e.additionalEvent === 'panup' && nearIndex.TOP === this.emptyIndex){
        target.style.marginTop = `${item.mt - this.pHeight}px`;
        item.mt = item.mt - this.pHeight;
        e.target.setAttribute('data-id', this.emptyIndex);
        if(this.emptyIndex === item.originalId){
          this.realBoardItems[this.emptyIndex].id = item.originalId;
        }
        this.emptyIndex = i;
      } else if(e.additionalEvent === 'pandown' && nearIndex.BOTTOM === this.emptyIndex){
        target.style.marginTop = `${item.mt + this.pHeight}px`;
        item.mt = item.mt + this.pHeight;
        e.target.setAttribute('data-id', this.emptyIndex);
        if(this.emptyIndex === item.originalId){
          this.realBoardItems[this.emptyIndex].id = item.originalId;
        }
        this.emptyIndex = i;
      } else if(e.additionalEvent === 'panleft' && nearIndex.LEFT === this.emptyIndex){
        target.style.marginLeft = `${item.ml - this.pWidth}px`;
        item.ml = item.ml - this.pWidth;
        e.target.setAttribute('data-id', this.emptyIndex);
        if(this.emptyIndex === item.originalId){
          this.realBoardItems[this.emptyIndex].id = item.originalId;
        }
        this.emptyIndex = i;
      } else if(e.additionalEvent === 'panright' && nearIndex.RIGHT === this.emptyIndex){
        target.style.marginLeft = `${item.ml + this.pWidth}px`;
        item.ml = item.ml + this.pWidth;
        e.target.setAttribute('data-id', this.emptyIndex);
        if(this.emptyIndex === item.originalId){
          this.realBoardItems[this.emptyIndex].id = item.originalId;
        }
        this.emptyIndex = i;
      }

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
    setBoard(isShuffle = true) {
      this.previewImage = this.$refs.preview;
      let clientWidth = this.previewImage.clientWidth;
      this.pWidth = this.pHeight = clientWidth / this.pieceCount;
      this.boardHeight = clientWidth;

      this.realBoardItems = [];
      let temp = [];
      for (let i = 0; i < this.pieceCount; i++) {
        for (let j = 0; j < this.pieceCount; j++) {
          let item = {};

          item.id = i * this.pieceCount + j;
          item.originalId = i * this.pieceCount + j;
          item.class = "piece-item";
          item.style = this.setStyle(i, j);
          
          if (i === this.pieceCount - 1 && j === this.pieceCount - 1) {
            temp.push({});
          } else {
            temp.push(item);
          }
        }
      }

      if(isShuffle){
        temp = this.shuffle(temp);
      }
      
      for (let i = 0; i < this.pieceCount; i++) {
        for (let j = 0; j < this.pieceCount; j++) {
          let id = i * this.pieceCount + j;
          
          temp[id].style = `${temp[id].style} margin-left: ${j * this.pWidth}px; margin-top: ${i * this.pHeight}px `;
          temp[id].ml = j * this.pWidth;
          temp[id].mt = i * this.pHeight;
        }
      }
      this.realBoardItems = temp;
      this.length = this.realBoardItems.length;

      for(const i in this.realBoardItems){
        if(this.realBoardItems[i].class === undefined){
          this.emptyIndex = Number(i);
          break;
        }
      }
    },
    setStyle(i, j){
      let style = `width: ${this.pWidth}px; 
                  height: ${this.pHeight}px; 
                  background: url(${this.imageSrc}); 
                  background-size:${this.previewImage.clientWidth}px ${this.previewImage.clientHeight}px; 
                  background-position: -${j * this.pWidth}px -${i * this.pHeight}px;`;
      return style;
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
