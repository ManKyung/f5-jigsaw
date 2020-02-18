<template>
  <div style="display:flex; flex-direction: column; flex: 1;">
    <div
      class="game-background game-container"
      ref="gameContainer"
      :style="`background:url('${backgroundImage}'); padding-top:${paddingTop}px`"
    >
      <div
        class="pa-5 preview-wrap"
        :class="[isVisiblePreview ? 'on' : '', isClearImage ? 'on clear' : '']"c>
        <img
          ref="preview"
          class="w-100 previewImage"
          :class="[isVisiblePreview ? 'on' : '',
        isClearImage ? 'on clear' : '']"
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
            :style="`width: ${pWidth}px; height:${pHeight}px; box-shadow: 0 0 1px 0 ${backgroundBorder} inset`"
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
          v-long-press="200"
          @long-press-start="onLongPressStart"
          @long-press-stop="onLongPressStop"
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
        <v-ons-button modifier="large" @click="next">NEXT</v-ons-button>
      </div>
      </div>
    </v-ons-modal>

  </div>
</template>
<style>
.preview-wrap {
  position: absolute;
  z-index: 100;
}
.piece{
  /* clip-path: circle(40%); */
/* clip-path: circle(50px at 0 100px); */
  clip-path: polygon(0.7763157894736841 0.35526315789473684 0.7236842105263157 0.2894736842105263 0.6578947368421053 0.22368421052631576 0.5921052631578947 0.3157894736842105 0.5526315789473684 0.39473684210526316 0.5526315789473684 0.47368421052631576 0.5526315789473684 0.5657894736842105 0.5921052631578947 0.5 0.6578947368421053 0.43421052631578944 0.7236842105263157 0.4605263157894737 0.7763157894736841 0.5526315789473684 0.7763157894736841H0.7763157894736842V0.5526315789473684C0.7763157894736842 0.4605263157894737 0.8289473684210525 0.4342105263157894 0.894736842105263 0.5 0.9605263157894737 0.5657894736842106 1 0.4736842105263157 1 0.39473684210526305 1 0.3157894736842106 0.9605263157894737 0.2236842105263157 0.894736842105263 0.2894736842105263 0.8289473684210525 0.3552631578947367 0.7763157894736842 0.32894736842105265 0.7763157894736842);
}
.board-wrap {
  position: absolute;
  z-index: 103;
}
.board-real-wrap {
  position: absolute;
  z-index: 102;
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
    },
    backgroundBorder: {
      type: String,
      default: '#000',
    }
  },
  // props: ["category", "id", "src", "pCount"],
  name: "jigsaw-play",
  components: {
    draggable
  },
  data() {
    return {
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
      isMove: true,
      longpress: false,
      presstimer: null,
      longtarget: null,
      isBoardAdd: false,
      paddingTop: 0,

      backgroundImage: '',
      backgroundBorderColor: '',
      modalClear: false,
      isClearOn: false,
      isClearImage: false,
    };
  },
  created() {
    this.pieceCount = this.pCount;
    this.imageSrc = require(`../../assets/img/${this.category}/${this.src}`);
    this.setBackground(this.background);
    this.setBackgroundBorder(this.backgroundBorder);
    // this.background = require(`../../assets/img/background/default.jpg`);
  },
  mounted() {
    setTimeout(() => {
      this.setBoard();
      this.setPieceItem();
    }, 200);
  },
  watch: {
    background(value){
      this.setBackground(value)
    },
    backgroundBorder(value){
      this.setBackgroundBorder(value)
    }
  },
  methods: {
    setBackground(value){
      this.backgroundImage = require(`../../assets/img/background/${value}.jpg`);
    },
    setBackgroundBorder(value){
      this.backgroundBorderColor = value;
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
        if(i !== this.realBoardItems[i].id) {
          return false;
        }
      }
      this.isClearImage = true;
      setTimeout(() => {
        this.modalClear = true;
      }, 1000)
      setTimeout(() => {
        this.isClearOn = true;
      }, 1300)
    },
    onLongPressStart() {
      this.isMove = false;
      // triggers after 300ms of mousedown
    },
    onLongPressStop() {
      this.isMove = true;
      // triggers on mouseup of document
    },
    boardChoose(e) {
      if (this.realBoardItems[e.oldIndex] === 0) {
        this.isBoardMove = false;
        return false;
      }
      this.isBoardMove = true;
      let dom = document.getElementById(`board-${e.oldIndex}`);

      dom.classList.add("on");
      dom.style.opacity = "1";
      if (dom.children[0] !== undefined) {
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
        this.isClear();
      }
    },
    boardUpdate(e) {
      if (this.realBoardItems[e.newIndex] === 0) {
        this.$set(this.realBoardItems, e.newIndex, this.selectedPiece);
        this.$set(this.realBoardItems, e.oldIndex, 0);
      }
      let dom = document.getElementById(`board-${e.oldIndex}`);
 
      dom.style.opacity = "0";
      if (dom.children[0] !== undefined) {
        dom.children[0].style.opacity = "0.5";
      }
      this.boardItems = this.objClone(this.realBoardItems);
      this.isClear();
    },
    boardMove(e) {
      if (!this.isBoardMove) {
        return false;
      }
    },
    pieceChoose(e) {
      console.log("choose");

      e.item.children[0].classList.add("on");
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
      this.paddingTop =
        gameContainer.clientHeight / 2 - (this.boardHeight + 40) / 2;
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
