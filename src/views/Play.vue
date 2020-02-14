<template>
  <v-ons-page>
    <v-ons-toolbar class="white" style="min-height:64px; background-image: none;">
      <div class="left pt-2 w-100">
      <v-ons-back-button class="pl-4">
      </v-ons-back-button></div>
      <div class="right pt-2">
        <v-ons-toolbar-button :style="actionSheetVisible ? 'color:#6c5ce7' : 'color:#111'" @click="actionSheetVisible = !actionSheetVisible">
          <v-ons-icon icon="ion-ios-image"></v-ons-icon>
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <div class="left pt-2">
    </div>
      <div class="right pt-2">
    </div>
    <!-- <v-ons-action-sheet
      :visible.sync="actionSheetVisible"
      cancelable
      title="JigSaw Puzzle Preview Image"
    >
      <div>
        <img ref="preview" class="w-100" :src="`/src/assets/img/${category}/${src}`" />
      </div>
    </v-ons-action-sheet>-->
    <div class="gameboard-wrap pt-5">
      <div>
        <img
          ref="preview"
          class="w-100 previewImage"
          :class="actionSheetVisible ? 'on' : ''"
          style="position:absolute;"
          :src="imageSrc"
        />

        <draggable
          id="board"
          ref="board"
          group="board"
          :list="boardItems"
          @add="boardAdd"
          @choose="boardChoose"
          @update="boardUpdate"
          :move="boardMove"
          @click="aaa"
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

        <div id="board-real" :style="`max-height:${boardHeight}px; overflow:hidden`">
          <div
            v-for="(item, index) in realBoardItems"
            :key="index"
            :style="`width: ${pWidth}px; height:${pHeight}px`"
          >
            <div v-if="item.style" :style="item.style"></div>
          </div>
        </div>

        <!-- <draggable
          id="board-piece"
          group="board"
          :list="pieceItems"
          @add="pieceAdd"
          @choose="pieceChoose"
          @update="pieceUpdate"
          :move="checkMove"
        >
          <div class="piece-item" v-for="(item, index) in pieceItems" :key="index">
            <div :id="`${index}`" :style="item.style"></div>
          </div>
        </draggable>-->
      </div>
    </div>
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
      <div class="piece-item" v-for="(item, index) in pieceItems" :key="index"
      v-long-press="300"
    @long-press-start="onLongPressStart"
    @long-press-stop="onLongPressStop">
        <div :id="`${index}`" :style="item.style"></div>
      </div>
    </draggable>
  </v-ons-page>
</template>
<style>
#board-real div:hover {
  background: tomato;
}
</style>
<script>
import draggable from "@/assets/js/vuedraggable";
import { dragscroll } from "vue-dragscroll";
import LongPress from 'vue-directive-long-press'
export default {
  directives: {
    dragscroll,
    'long-press': LongPress
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
  name: "play",
  components: {
    draggable,
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
      isBoardAdd: false
    };
  },
  created() {
    this.imageSrc = require(`../assets/img/${this.category}/${this.src}`);
    this.pieceCount = this.pCount;
  },
  mounted() {
    console.log("mounted");
    setTimeout(() => {
      this.setBoard();
      this.setPieceItem();
      document.body._gestureDetector.dispose();
    }, 200);

    setTimeout(() => {
      this.actionSheetVisible = false;

      // let boardItemDom = document.getElementsByClassName("board-item");
      // for (let i = 0; i < boardItemDom.length; i++) {
      //   boardItemDom[i].addEventListener("mousemove", () => {
      //     console.log(12)
      //   });
      // }
      //   pieceDom[i].addEventListener("mouseout", this.cancel);
      //   pieceDom[i].addEventListener("touchend", this.cancel);
      //   // pieceDom[i].addEventListener("touchleave", this.cancel);
      //   pieceDom[i].addEventListener("touchcancel", this.cancel);
      // }
    }, 1000);
  },
  beforeDestroy(){
    // let pieceDom = document.getElementsByClassName("piece-item");
    // for (let i = 0; i < pieceDom.length; i++) {
    //   pieceDom[i].addEventListener("mousedown", this.start);
    //   pieceDom[i].addEventListener("touchstart", this.start);

    //   // pieceDom[i].addEventListener("mouseup", this.cancel);
    //   // pieceDom[i].addEventListener("touchend", this.cancel);
    //   // pieceDom[i].addEventListener("touchleave", this.cancel);
    //   // pieceDom[i].addEventListener("touchcancel", this.cancel);
    // }
    console.log('destory')
  },
  methods: {
    aaa(){
      console.log(12)
    },
    onLongPressStart () {
      console.log('ep start')
      this.isMove = false;
      // triggers after 300ms of mousedown
    },
    onLongPressStop () {
      this.isMove = true;
      console.log('ep stop')
     // triggers on mouseup of document
    },
    start(e) {
      if (e.type === "click" && e.button !== 0) {
        return;
      }
      this.isMove = true;
      // var _vm = this;
      e.srcElement.classList.add("on");
      if (this.presstimer === null) {
        this.presstimer = setTimeout(function() {
        }, 200);
      }

      return false;
    },
    cancel(e) {
      if (this.presstimer !== null) {
        clearTimeout(this.presstimer);
        this.isMove = true;
        e.srcElement.classList.remove("on");
        this.presstimer = null;
      }
    },
    boardChoose(e) {
      let a = document.getElementById(`board-${e.oldIndex}`);
      a.style.opacity = '1';
      a.children[0].style.opacity = '0.5';

      this.selectedPiece = this.realBoardItems[e.oldIndex];
    },
    boardAdd(e) {
      this.isBoardAdd = false;
      if (this.realBoardItems[e.newIndex] === 0) {
        this.$set(this.realBoardItems, e.newIndex, this.selectedPiece);
        this.boardItems = this.objClone(this.realBoardItems);
        this.isBoardAdd = true;
      }
    },
    boardUpdate(e) {
      if (this.realBoardItems[e.newIndex] === 0) {
        this.$set(this.realBoardItems, e.newIndex, this.selectedPiece);
        this.$set(this.realBoardItems, e.oldIndex, 0);
        this.boardItems = this.objClone(this.realBoardItems);
      }
    },
    boardMove(e){
      // console.log(e.relatedContext.index)
    },
    pieceChoose(e) {
      console.log('choose')
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
      this.pWidth = this.previewImage.clientWidth / this.pieceCount;
      this.pHeight = this.previewImage.clientHeight / this.pieceCount;
      this.boardHeight = this.previewImage.clientHeight;
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
