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
    <div class="game-background game-container" ref="gameContainer" :style="`background:url('${background}'); padding-top:${paddingTop}px`">
      <div class="pa-5 preview-wrap">
        <img
          ref="preview"
          class="w-100 previewImage"
          :class="actionSheetVisible ? 'on' : ''"
          :src="imageSrc"
        />
      </div>
      <div class="pa-5 board-wrap">
        <draggable
          id="board"
          ref="board"
          group="board"
          :list="boardItems"
          @add="boardAdd"
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
            :style="`width: ${pWidth}px; height:${pHeight}px;`"
          >
            <div v-if="item.style" :style="item.style"></div>
          </div>
        </draggable>
      </div>
      <div class="pa-5 board-real-wrap">

        <div id="board-real" :style="`max-height:${boardHeight}px; overflow:hidden`">
          <div
            v-for="(item, index) in realBoardItems"
            :key="index"
            :style="`width: ${pWidth}px; height:${pHeight}px; box-shadow: 0 0 1px 0 ${borderColor} inset`"
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
      v-dragscroll.x="{ active: isMove }"
    >
      <div
        class="piece-item"
        v-for="(item, index) in pieceItems"
        :key="index"
        v-long-press="300"
        @long-press-start="onLongPressStart"
        @long-press-stop="onLongPressStop"
      >
        <div :id="`piece-${index}`" :style="item.style"></div>
      </div>
    </draggable>
    </div>
  </v-ons-page>
</template>
<style>
.preview-wrap{
  position:absolute; z-index:100
}
.board-wrap{
  position:absolute; z-index:103
}
.board-real-wrap{
  position:absolute; z-index:102
}
</style>
<script>
import draggable from "@/assets/js/vuedraggable";
import { dragscroll } from "vue-dragscroll";
import LongPress from "vue-directive-long-press";
export default {
  directives: {
    dragscroll,
    "long-press": LongPress
  },
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
      default: 4
    },
    id: {
      type: Number,
      default: 1
    }
  },
  // props: ["category", "id", "src", "pCount"],
  name: "jigsaw-play",
  components: {
    draggable
  },
  data() {
    return {
      carouselIndex: 0,
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
      moveIndex: 0,
      moveItem: {},
      actionSheetVisible: true,
      isMove: true,
      longpress: false,
      presstimer: null,
      longtarget: null,
      isBoardAdd: false,
      paddingTop: 0,
      background: localStorage["background"],
      borderColor: localStorage["background-border"]
    };
  },
  created() {
    this.imageSrc = require(`../../assets/img/${this.category}/${this.src}`);
    this.pieceCount = this.pCount;
    this.background = require(`../../assets/img/background/${this.background}.jpg`);
    // this.background = require(`../../assets/img/background/default.jpg`);
  },
  mounted() {
    setTimeout(() => {
      this.setBoard();
      this.setPieceItem();
      document.body._gestureDetector.dispose();
    }, 200);

    setTimeout(() => {
      this.actionSheetVisible = false;
    }, 1000);
  },
  methods: {
    initScale(){
      let dom = document.getElementsByClassName('piece-item')
      let len = dom.length;
      for(let i = 0 ; i < len ; i++){
        dom[i].children[0].classList.remove('on')
      }
    },
    onLongPressStart() {
      console.log("long start");
      this.isMove = false;
      // triggers after 300ms of mousedown
    },
    onLongPressStop() {
      this.isMove = true;
      console.log("long stop");
      this.initScale();
      // triggers on mouseup of document
    },
    boardChoose(e) {
      if(this.realBoardItems[e.oldIndex] === 0){
        console.log('false')
        this.isBoardMove = false;
        return false;
      }
      this.isBoardMove = true;
      let dom = document.getElementById(`board-${e.oldIndex}`);

      dom.classList.add('on')
      dom.style.opacity = "1";
      if(dom.children[0] !== undefined){
        dom.children[0].style.opacity = "0.5";
      }

      this.selectedPiece = this.realBoardItems[e.oldIndex];
    },
    boardAdd(e) {
      this.isBoardAdd = false;
      if (this.realBoardItems[e.newIndex] === 0) {
        this.$set(this.realBoardItems, e.newIndex, this.selectedPiece);
        this.boardItems = this.objClone(this.realBoardItems);
        this.isBoardAdd = true;
      }
      this.initScale();
    },
    boardUpdate(e) {
      if (this.realBoardItems[e.newIndex] === 0) {
        this.$set(this.realBoardItems, e.newIndex, this.selectedPiece);
        this.$set(this.realBoardItems, e.oldIndex, 0);
      }
      let dom = document.getElementById(`board-${e.oldIndex}`);
      console.log('update', dom)
      dom.style.opacity = "0";
      if(dom.children[0] !== undefined){
        dom.children[0].style.opacity = "0.5";
      }
        this.boardItems = this.objClone(this.realBoardItems);
    },
    boardMove(e) {
      if(!this.isBoardMove){
        return false;
      }
    },
    pieceChoose(e) {
      console.log("choose");

      e.item.children[0].classList.add('on')
      this.selectedPiece = this.pieceItems[e.oldIndex];
    },
    pieceAdd(e) {
      this.$set(this.pieceItems, e.newIndex, this.selectedPiece);
      this.$set(this.realBoardItems, e.oldIndex, 0);

      this.boardItems = this.objClone(this.realBoardItems);
      this.isMove = true;
    },
    pieceUpdate(e) {
      this.isMove = true;
    },
    pieceRemove(e) {
      if (!this.isBoardAdd) {
        // 중복으로 추가되지 않은 경우 롤백처리
        this.pieceItems.splice(e.oldIndex, 0, this.selectedPiece);
      }
      this.isMove = true;
    },
    checkMove(e) {},
    setBoard() {
      this.previewImage = this.$refs.preview;
      let gameContainer = this.$refs.gameContainer;
      this.pWidth = this.previewImage.clientWidth / this.pieceCount;
      this.pHeight = this.previewImage.clientHeight / this.pieceCount;
      this.boardHeight = this.previewImage.clientHeight;
      this.paddingTop = (gameContainer.clientHeight / 2) - ((this.boardHeight + 40) / 2);
      for (let i = 0; i < this.pieceCount * this.pieceCount; i++) {
        this.realBoardItems.push(0);
        this.boardItems.push(0);
      }
    },
    setPieceItem() {
      let temp = [];
      for (let i = 0; i < this.pieceCount; i++) {
        for (let j = 0; j < this.pieceCount; j++) {
          let item = {};
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
      this.pieceItems = temp;
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
