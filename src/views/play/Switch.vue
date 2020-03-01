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
            v-hammer:tap="(event)=> changePiece(event, index)"
            v-hammer:pan="(event)=> changePiece(event, index)"
          >
            <div class="switch-piece" :id="`piece-${index}`" :style="item.style"></div>
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
  name: "switch-play",
  data() {
    return {
      previewImage: null,
      imageSrc: "",
      realBoardItems: [],
      selectedIndex: -1,
      pieceCount: 0,
      pWidth: 0,
      pHeight: 0,
      boardHeight: 0,
      paddingTop: 0,
      
      backgroundImage: '',
      modalClear: false,
      isClearOn: false,
      isClearImage: false,
      length: 0
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
      this.getPercent();
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
        if(this.realBoardItems[i].id !== i){
          let curDom = document.getElementById(`piece-${i}`);
          if(value) {
            curDom.classList.add('search')
          } else {
            curDom.classList.remove('search')
          }
        }
      }
    },
    getCorrect(index){
      for(const i in this.realBoardItems){
        if(this.realBoardItems[i].id === index){
          return this.realBoardItems[i];
        }
      }
      return false;
    },
    getReward(){
      if(this.isLight){
        this.getLight(false);
        this.$emit('isUpdateLight', false)
      }

      let i = 0;
      let correctTemp = [];
      let shuffleTemp = [];
      let restCount = this.realBoardItems.filter(item => {
        return item.id !== i++;
      }).length;

      let cnt = 0;
      let flag = true;
      let orderShuffle = [];
      for(let i = 0 ; i < this.length ; i++){
        if(flag && this.realBoardItems[i].id !== i) {
          correctTemp.push(this.getCorrect(i));
          cnt++;
          flag = cnt === Math.ceil(restCount / 2) ? false : true;
        } else if(!flag && this.realBoardItems[i].id !== i){
          let d = this.getCorrect(i);
          orderShuffle.push(d.id)
          shuffleTemp.push(d);
        }
      }

      let tempItems = [];

      for(let i = 0 ; i < correctTemp.length ; i++){
        tempItems[correctTemp[i].id] = correctTemp[i];
      }
      for(const i in orderShuffle){
        tempItems[orderShuffle[i]] = shuffleTemp[shuffleTemp.length - 1 - i];
      }
      for(const i in tempItems){
        if(tempItems[i] !== undefined){
          this.$set(this.realBoardItems, i, tempItems[i])
        }
      }

      this.getPercent();
      this.isClear();
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
          this.$emit('goPopPage');
        }, 400)
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
      this.$emit('setPercent', percent)
    },
    isClear(){
      this.getPercent();
      for(let i = 0 ; i < this.length ; i++){
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

      this.isClearImage = true;
      setTimeout(() => {
        this.modalClear = true;
      }, 1000)
      setTimeout(() => {
        this.isClearOn = true;
      }, 1300)
      return true;
    },
    changePiece(e, i) {
      if(this.isLight){
        this.getLight(false);
        this.$emit('isUpdateLight', false)
      }
      let curDom = document.getElementById(`piece-${i}`);
      if (this.selectedIndex === i) {
        curDom.classList.remove("on");
        this.selectedIndex = -1;
      } else if (this.selectedIndex === -1) {
        this.selectedIndex = i;
        curDom.classList.add("on");
      } else {
        let selecDom = document.getElementById(`piece-${this.selectedIndex}`);
        let temp = this.realBoardItems[this.selectedIndex];

        this.$set(
          this.realBoardItems,
          this.selectedIndex,
          this.realBoardItems[i]
        );
        this.$set(this.realBoardItems, i, temp);

        this.selectedIndex = -1;
        curDom.classList.remove("on");
        selecDom.classList.remove("on");
          
        this.isClear();
      }
    },
    setBoard() {
      this.previewImage = this.$refs.preview;
      this.pWidth = this.previewImage.clientWidth / this.pieceCount;
      this.pHeight = this.previewImage.clientHeight / this.pieceCount;
      this.boardHeight = this.previewImage.clientHeight;

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
          temp.push(item);
        }
      }
      this.realBoardItems = this.shuffle(temp);
      this.length = this.realBoardItems.length;
    },
    shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
  }
};
</script>
