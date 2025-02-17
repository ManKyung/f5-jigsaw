<template>
  <div style="display:flex; flex-direction: column; flex: 1;">
    <div
      class="game-background game-container"
      ref="gameContainer"
      :style="`background:url('${backgroundImage}'); padding-top:${paddingTop}px`">
      <div
        class="pa-5 preview-wrap"
        :class="[isVisiblePreview ? 'on' : '', isClearImage ? 'on clear' : '']">
        <img
          ref="preview"
          class="w-100 previewImage"
          :class="[isVisiblePreview ? 'on' : '',
                   isClearImage ? 'on clear' : '']"
          :src="imageSrc"
        />
      </div>
      <div ref="boardWrap" class="pa-5 board-wrap">
        <draggable
          id="board"
          ref="board"
          group="board"
          :list="boardItems"
          @add="boardAdd"
          @start="boardStart"
          @choose="boardChoose"
          @update="boardUpdate"
          :move="boardMove"
          :style="`max-height:${boardHeight}px; `"
        >
          <div
            v-for="(item, index) in boardItems"
            :key="index"
            :id="`board-${index}`"
            class="board-item"
            :class="item.success === 'Y' ? 'success' : ''"
            :style="`width: ${pWidth}px; height:${pHeight}px; `"
          >
            <div v-if="item.style" :style="item.style"></div>
          </div>
        </draggable>
      </div>
      <div class="pa-5 board-real-wrap">
        <div id="board-real" :style="`max-height:${boardHeight}px; overflow:hidden; box-shadow: 0 0 1px 0.4px ${backgroundBorder} inset`">
          <div
            v-for="(item, index) in realBoardItems"
            :key="index"
            class="border"
            :style="`width: ${pWidth}px; height:${pHeight}px; box-shadow: 0 0 1px 0.3px ${backgroundBorder} inset`"
          >
            <div v-if="item.style" :style="item.style"></div>
          </div>
        </div>
      </div>
    </div>

    <div id="board-piece-wrap" class="game-bottom">
      <draggable
        id="board-piece"
        group="board"
        :list="pieceItems"
        @add="pieceAdd"
        @choose="pieceChoose"
        @update="pieceUpdate"
        @remove="pieceRemove"
        :move="checkMove"
        v-hammer:pan="(event)=> panStart(event)"
        v-dragscroll.x="{ active: isDragScroll }"
      >
        <div
          class="piece-item"
          v-for="(item, index) in pieceItems"
          :key="index"
        >
          <div class="piece" :id="`piece-${index}`" :style="item.style"></div>
        </div>
      </draggable>
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
<style>
#board-real .border{
  box-shadow: none !important;
}

/* width */
#board-piece::-webkit-scrollbar {
  height:8px;
	background-color: #ddd;
}
/* Track */
#board-piece::-webkit-scrollbar-track {
  background: #ddd;
}
/* Handle */
#board-piece {
  --scrollbar-bgImage: url('');
}
#board-piece::-webkit-scrollbar-thumb {
  background: #333;
  background-image: var(--scrollbar-bgImage);
  -webkit-border-radius: 10px;
  border-radius: 10px;
  /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); */ 
}
#board-piece .piece-item {
  padding:30px 20px 10px 20px; 
}
/* @media (min-width: 320px) and (max-width: 480px) {
  #board-piece .piece-item {
    transform: scale(0.6);
  }
} */
  
</style>
<script>
import { showRewardVideo } from "@/assets/js/admob.js";
import draggable from "@/assets/js/vuedraggable";
import { dragscroll } from 'vue-dragscroll'
export default {
  directives: {
    dragscroll
  },
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
      default: 4
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
    isSwap: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    background: {
      type: String,
      default: 'default',
    },
    backgroundBorder: {
      type: String,
      default: '#000',
    }
  },
  name: "jigsaw-play",
  components: {
    draggable,
  },
  data() {
    return {
      isDragScroll: true,
      previewImage: null,
      imageSrc: "",
      pieceItems: [],
      boardItems: [],
      realBoardItems: [],
      selectedPiece: {},
      pieceCount: 0,
      pWidth: 0,
      pHeight: 0,
      boardHeight: 0,
      isBoardAdd: false,
      paddingTop: 0,
      isMoveStart: false,

      backgroundImage: '',
      backgroundBorderColor: '',
      modalClear: false,
      isClearOn: false,
      isClearImage: false,
      prevNumber: [],
      length: 0,
    };
  },
  created() {
    this.pieceCount = this.pCount;
    this.imageSrc = require(`../../assets/img/${this.category}/${this.src}`);
    this.setBackground(this.background);
    this.setBackgroundBorder(this.backgroundBorder);
  },
  mounted() {
    setTimeout(() => {
      this.setBoard();
      this.setPieceItem();
    }, 200);
    setTimeout(() => {
      this.setUI();
    }, 300);
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
    isSwap(){
      this.$ons.notification.confirm(`Clean up puzzle pieces that don't fit`, { title: "" }).then((response) => {
        if (response) {
          this.getSwap();
        }
      });
    },
    isHint(){
      showRewardVideo();
      // this.getReward();
    },
    background(value){
      this.setBackground(value)
    },
    backgroundBorder(value){
      this.setBackgroundBorder(value)
    }
  },
  methods: {
    getSwap(){
      for(let i = 0 ; i < this.length ; i++){
        if(this.realBoardItems[i] !== 0 && i !== this.realBoardItems[i].id) {
          this.pieceItems.unshift(this.realBoardItems[i]);
          this.$set(this.realBoardItems, i, 0)
        }
      }
    },
    getReward(){
      this.getSwap();
      for(let i = 0 ; i < this.pieceItems.length / 2 ; i++){
        this.$set(this.realBoardItems, this.pieceItems[i].id, this.pieceItems[i]);
        this.pieceItems.splice(i, 1)
      }
      setTimeout(() => {
        this.isClear();
      }, 100)
    },
    panStart(e){
      if(e.additionalEvent === 'panup') {
        this.isDragScroll = false;
      } else {
      this.isDragScroll = true;
      }
    },
    panStop(e){
      this.isDragScroll = true;
    },
    setUI(){
      let gameContainer = this.$refs.gameContainer;
      let boardWrap = this.$refs.boardWrap;
      this.paddingTop = (gameContainer.clientHeight - boardWrap.clientHeight) / 2;
    },
    setBackground(value){
      this.backgroundImage = require(`../../assets/img/background/${value}.jpg`);

      setTimeout(() => {
        let dom = document.getElementById("board-piece");
        if(dom !== null){
          document.getElementById("board-piece").style.setProperty('--scrollbar-bgImage', `url(${this.backgroundImage})`);
        }
      }, 100)
    },
    setBackgroundBorder(value){
      this.backgroundBorderColor = value;
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
    },
    boardChoose(e) {
      this.isMoveStart = false;
      if(this.realBoardItems[e.oldIndex].success === 'Y'){
        this.selectedPiece = -1;
        this.isBoardMove = false;
        return false;
      }
      if (this.realBoardItems[e.oldIndex] === 0) {
        this.isBoardMove = false;
        return false;
      }
      this.isBoardMove = true;
      let dom = document.getElementById(`board-${e.oldIndex}`);

      dom.style.opacity = "1";
      if (dom.children[0] !== undefined) {
        dom.children[0].style.opacity = "0.5";
      }
      setTimeout(() => {
        if(!this.isMoveStart){
          dom.style.opacity = "0";
          if (dom.children[0] !== undefined) {
            dom.children[0].style.opacity = "0";
          }
        }
      }, 500)

      this.selectedPiece = this.realBoardItems[e.oldIndex];
    },
    boardAdd(e) {
      this.isBoardAdd = false;
      if (this.realBoardItems[e.newIndex] === 0) {
        this.$set(this.realBoardItems, e.newIndex, this.selectedPiece);
        this.boardItems = this.objClone(this.realBoardItems);
        this.isBoardAdd = true;
        this.isClear();

        if(e.newIndex === this.boardItems[e.newIndex].id){
          this.$store.commit('gameSet/setSuccessSound');
          this.boardItems[e.newIndex].success = 'Y';
        }
      }
    },
    boardUpdate(e) {
      if(this.realBoardItems[e.newIndex].success === 'Y'){
        let dom = document.getElementById(`board-${e.oldIndex}`);
        dom.style.opacity = "0";
        if (dom.children[0] !== undefined) {
          dom.children[0].style.opacity = "0.5";
        }
        this.boardItems = this.objClone(this.realBoardItems);
        return false;
      } else if (this.realBoardItems[e.newIndex] === 0) { // 처음 들어오는 경우
        this.$set(this.realBoardItems, e.newIndex, this.selectedPiece);
        this.$set(this.realBoardItems, e.oldIndex, 0);
      } else if(this.realBoardItems[e.newIndex].success === 'N'){
        let temp = this.realBoardItems[e.oldIndex]; 
        this.$set(this.realBoardItems, e.oldIndex, this.realBoardItems[e.newIndex]);
        this.$set(this.realBoardItems, e.newIndex, temp);
      }
      let dom = document.getElementById(`board-${e.oldIndex}`);
 
      dom.style.opacity = "0";
      if (dom.children[0] !== undefined) {
        dom.children[0].style.opacity = "0.5";
      }
      this.boardItems = this.objClone(this.realBoardItems);
      
      if(e.newIndex === this.boardItems[e.newIndex].id){
        this.$store.commit('gameSet/setSuccessSound');
        this.boardItems[e.newIndex].success = 'Y';
        this.realBoardItems[e.newIndex].success = 'Y';
      }
      this.isClear();
    },
    boardMove(e) {
      if (!this.isBoardMove || this.selectedPiece === -1) {
        return false;
      }
    },
    boardStart(e){
      this.isMoveStart = true;
    },
    pieceChoose(e) {
      this.selectedPiece = this.pieceItems[e.oldIndex];
    },
    pieceAdd(e) {
      this.$set(this.pieceItems, e.newIndex, this.selectedPiece);
      this.$set(this.realBoardItems, e.oldIndex, 0);

      this.boardItems = this.objClone(this.realBoardItems);
    },
    pieceUpdate(e) {
    },
    pieceRemove(e) {
      if (!this.isBoardAdd) {
        // 중복으로 추가되지 않은 경우 롤백처리
        this.pieceItems.splice(e.oldIndex, 0, this.selectedPiece);
      }
    },
    checkMove(e) {},
    setBoard() {
      this.previewImage = this.$refs.preview;
      this.pWidth = this.previewImage.clientWidth / this.pieceCount;
      this.pHeight = this.previewImage.clientHeight / this.pieceCount;
      this.boardHeight = this.previewImage.clientHeight;

      for (let i = 0; i < this.pieceCount * this.pieceCount; i++) {
        this.realBoardItems.push(0);
        this.boardItems.push(0);
      }
      this.length = this.realBoardItems.length;
    },
    setPieceItem() {
      let temp = [];
      for (let i = 0; i < this.pieceCount; i++) {
        for (let j = 0; j < this.pieceCount; j++) {
          let item = {};
          item.id = i * this.pieceCount + j;
          item.success = 'N';
          item.class = "piece-item";
          item.style = this.setStyle(i, j, item.id);

          temp.push(item);
        }
      }
      this.pieceItems = this.shuffle(temp);
      // this.pieceItems = temp;
    },
    getNumber(i, j, id){
      let number = '';
      let top = 0;
      let right = 0;
      let bottom = 0;
      let left = 0;
      // top 0
      // right 1
      // bottom 2
      // left 3

      let prevIdx = id - 1;
      let rowPrevIdx = id - this.pCount;

      if(i === 0 && j === 0){ //
        top = 0;
        right = this.getRandom(1, 3);
        bottom = this.getRandom(1, 3);
        left = 0;
      } else if (i === 0 && j === this.pCount - 1){ //
        top = 0;
        right = 0;
        bottom = this.getRandom(1, 3);
        left = this.prevNumber[prevIdx][1] === '2' ? 1 : 2;
      } else if (i === this.pCount - 1 && j === 0){
        top = this.prevNumber[rowPrevIdx][2] === '2' ? 1 : 2;
        right = this.getRandom(1, 3);
        bottom = 0;
        left = 0;
      } else if (i === this.pCount - 1 && j === this.pCount - 1){
        top = this.prevNumber[rowPrevIdx][2] === '2' ? 1 : 2;;
        right = 0;
        bottom = 0;
        left = this.prevNumber[prevIdx][1] === '2' ? 1 : 2;;
      } else if (i === 0){
        top = 0;
        right = this.getRandom(1, 3);
        bottom = this.getRandom(1, 3);
        left = this.prevNumber[prevIdx][1] === '2' ? 1 : 2;
      } else if (j === 0){
        top = this.prevNumber[rowPrevIdx][2] === '2' ? 1 : 2;
        right = this.getRandom(1, 3);
        bottom = this.getRandom(1, 3);
        left = 0;
      } else if (i === this.pCount - 1){
        top = this.prevNumber[rowPrevIdx][2] === '2' ? 1 : 2;
        right = this.getRandom(1, 3);
        bottom = 0
        left = this.prevNumber[prevIdx][1] === '2' ? 1 : 2;
      } else if (j === this.pCount - 1){
        top = this.prevNumber[rowPrevIdx][2] === '2' ? 1 : 2;
        right = 0;
        bottom = this.getRandom(1, 3);
        left = this.prevNumber[prevIdx][1] === '2' ? 1 : 2;
      } else {
        top = this.prevNumber[rowPrevIdx][2] === '2' ? 1 : 2;
        right = this.getRandom(1, 3);
        bottom = this.getRandom(1, 3);
        left = this.prevNumber[prevIdx][1] === '2' ? 1 : 2;
      }
      number = `${top}${right}${bottom}${left}`;
      this.prevNumber.push(number); // string 으로 넣어줘야 함

      return number;
    },
    setStyle(i, j, id){
      let number = this.getNumber(i, j, id);

      let maskImage = require(`../../assets/img/puzzle/${number}.png`);

      let ratio = 0.35;
      // let topRatio = 0;
      // let rightRatio = 0;
      // let bottomRatio = 0;
      // let leftRatio = 0;
      let widthRatio = 0;
      let heightRatio = 0;
      let marginLeftRatio = 0;
      let marginTopRatio = 0;
      if(number[0] === '2') { // top
        heightRatio += this.pHeight * ratio;
        marginTopRatio = this.pHeight * ratio;
      }
      if(number[1] === '2'){ // right
        widthRatio += this.pWidth * ratio;
      }
      if(number[2] === '2'){ // bottom
        heightRatio += this.pHeight * ratio;
      }
      if(number[3] === '2'){ // left
        widthRatio += this.pWidth * ratio;
        marginLeftRatio = this.pWidth * ratio;
      }

      let style = `width: ${this.pWidth + widthRatio}px; 
          height: ${this.pHeight + heightRatio}px; 
          background: url(${this.imageSrc}); 
          background-size:${this.previewImage.clientWidth}px ${this.previewImage.clientHeight}px; 
          background-position: -${j * this.pWidth - marginLeftRatio}px -${i * this.pHeight - marginTopRatio}px;
          mask-image: url(${maskImage});
          mask-position: center center;
          mask-size: 100%;
          mask-repeat: no-repeat;
          margin-left:-${marginLeftRatio}px;
          margin-top:-${marginTopRatio}px;
          `;
      return style;
    },
    getRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    shuffle(a){
      for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    objClone(obj) {
      if (obj === null || typeof obj !== "object") return obj;
      var copy = obj.constructor();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = obj[attr];
        }
      }
      return copy;
    }
  }
};
</script>
