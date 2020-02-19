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
        <div id="board-real" :style="`max-height:${boardHeight}px; overflow:hidden; box-shadow: 0 0 1px 0.4px ${backgroundBorder} inset`">
          <div
            v-for="(item, index) in realBoardItems"
            :key="index"
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
        :style="`::-webkit-scrollbar-thumb:width:50px;`"
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
.board-wrap {
  position: absolute;
  z-index: 103;
}
.board-real-wrap {
  position: absolute;
  z-index: 102;
}

/* width */
#board-piece::-webkit-scrollbar {
  height:30px;
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

</style>
<script>
import draggable from "@/assets/js/vuedraggable";
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
    draggable,
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
    // this.pieceCount = this.pCount;
    this.pieceCount = 3;
    this.imageSrc = require(`../../assets/img/${this.category}/${this.src}`);
    this.setBackground(this.background);
    this.setBackgroundBorder(this.backgroundBorder);
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

      setTimeout(() => {
        document.getElementById("board-piece").style.setProperty('--scrollbar-bgImage', `url(${this.backgroundImage})`);
      }, 100)
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
      this.pieceItems = this.shuffle(temp);
      // this.pieceItems = temp;
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
