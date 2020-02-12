<template>
  <v-ons-page>
    <v-ons-toolbar class="primary">
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="right">
        <v-ons-toolbar-button @click="actionSheetVisible = !actionSheetVisible">
          <v-ons-icon icon="md-image-o" class="white--text"></v-ons-icon>
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <!-- <v-ons-action-sheet
      :visible.sync="actionSheetVisible"
      cancelable
      title="JigSaw Puzzle Preview Image"
    >
      <div>
        <img ref="preview" class="w-100" :src="`/src/assets/img/${category}/${src}`" />
      </div>
    </v-ons-action-sheet>-->
    <div class="gameboard-wrap">
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
          :move="checkMove"
          :style="`max-height:${boardHeight}px; `"
        >
          <div
            v-for="(item, index) in boardItems"
            :key="index"
            :style="`width: ${pWidth}px; height:${pHeight}px`"
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
      :move="checkMove"
      v-dragscroll.x="{ active: isMove }"
    >
      <div
        class="piece-item"
        v-for="(item, index) in pieceItems"
        :key="index"
      >
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
export default {
  directives: {
    dragscroll
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
      longtarget: null
    };
  },
  created() {
    this.imageSrc = require(`../assets/img/${this.category}/${this.src}`);
    this.pieceCount = this.pCount;
  },
  mounted() {
    setTimeout(() => {
      this.setBoard();
      this.setPieceItem();
      document.body._gestureDetector.dispose();
    }, 100);

    setTimeout(() => {
      this.actionSheetVisible = false;

      let pieceDom = document.getElementsByClassName("piece-item");
      for (let i = 0; i < pieceDom.length; i++) {
        pieceDom[i].addEventListener("mousedown", this.start);
        pieceDom[i].addEventListener("touchstart", this.start);

        pieceDom[i].addEventListener("mouseout", this.cancel);
        pieceDom[i].addEventListener("touchend", this.cancel);
        pieceDom[i].addEventListener("touchleave", this.cancel);
        pieceDom[i].addEventListener("touchcancel", this.cancel);
      }
    }, 1000);
  },
  methods: {
    start(e) {
      if (e.type === "click" && e.button !== 0) {
        return;
      }

      var _vm = this;
      e.srcElement.classList.add('on')
      if (this.presstimer === null) {
        this.presstimer = setTimeout(function() {
          _vm.isMove = false;
        }, 300);
      }

      return false;
    },
    cancel(e) {
      if (this.presstimer !== null) {
        clearTimeout(this.presstimer);
          this.isMove = true;
          e.srcElement.classList.remove('on')
        this.presstimer = null;
      }
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
    },
    boardChoose(e) {
      this.selectedPiece = this.realBoardItems[e.oldIndex];
    },
    boardAdd(e) {
      if (this.realBoardItems[e.newIndex] === 0) {
        this.$set(this.realBoardItems, e.newIndex, this.selectedPiece);
        this.boardItems = this.objClone(this.realBoardItems);
      }
    },
    boardUpdate(e) {
      if (this.realBoardItems[e.newIndex] === 0) {
        this.$set(this.realBoardItems, e.newIndex, this.selectedPiece);
        this.$set(this.realBoardItems, e.oldIndex, 0);
        this.boardItems = this.objClone(this.realBoardItems);
      }
    },
    pieceChoose(e) {
      // this.isMove = true;
      this.selectedPiece = this.pieceItems[e.oldIndex];
      // setTimeout(() => {
      //   this.isMove = true
      // }, 3000)
      // console.log(this.isMove, e)
    },
    pieceAdd(e) {
      this.$set(this.pieceItems, e.newIndex, this.selectedPiece);
      this.$set(this.realBoardItems, e.oldIndex, 0);

      this.boardItems = this.objClone(this.realBoardItems);
    },
    pieceUpdate(e) {},
    pieceRemove(e) {},
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
    }
  }
};
</script>
