<template>
  <v-ons-page>
    <v-ons-toolbar class="primary">
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="center white--text">JigSaw Puzzle</div>
      <div class="right">
        <v-ons-toolbar-button @click="actionSheetVisible = true">
          <v-ons-icon icon="md-image-o" class="white--text"></v-ons-icon>
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <v-ons-action-sheet
      :visible.sync="actionSheetVisible"
      cancelable
      title="JigSaw Puzzle Preview Image"
    >
    <div>
      <img ref="preview" :src="dImage" class="w-100 h-100" />
    </div>
    </v-ons-action-sheet>
    <div id="board-real" :style="`position:absolute; max-height:${boardHeight}px; overflow:hidden`">
      <div
        v-for="(item, index) in realBoardItems"
        :key="index"
        :style="`width: ${pWidth}px; height:${pHeight}px`"
        :board-id="`${index}`"
      >
        <div :id="item.id" :style="item.style"></div>
      </div>
    </div>
    <draggable
      id="board"
      ref="board"
      group="board"
      :list="boardItems"
      @add="boardAdd"
      @choose="boardChoose"
      @update="boardUpdate"
      :move="checkMove"
      :style="`opacity:0; max-height:${boardHeight}px; overflow:hidden;`"
    >
      <div
        v-for="(item, index) in boardItems"
        :key="index"
        :style="`width: ${pWidth}px; height:${pHeight}px`"
        :board-id="`${index}`"
      >
        <div :id="item.id" :style="item.style"></div>
      </div>
    </draggable>

    <draggable
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
    </draggable>
    
  </v-ons-page>
</template>

<script>
import dImage from "@/assets/images/2.jpg";
import draggable from "@/assets/js/vuedraggable";
export default {
  name: "play",
  components: {
    draggable
  },
  data() {
    return {
      dImage,
      pieceItems: [],
      boardItems: [],
      realBoardItems: [],
      selectedPiece: {},
      pieceNumber: 8,
      pWidth: 0,
      pHeight: 0,
      boardHeight: 0,
      moveIndex: 0,
      moveItem: {},
      actionSheetVisible: true,
    };
  },
  mounted() {
    setTimeout(() => {
      this.setBoard();
      this.setPieceItem();
      document.body._gestureDetector.dispose();
    }, 100);
  },
  methods: {
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
      console.log('add', this.selectedPiece)
      if(this.realBoardItems[e.newIndex] === 0){
        this.$set(this.realBoardItems, e.newIndex, this.selectedPiece);
        this.boardItems = this.objClone(this.realBoardItems);
      } else {

      }
    },
    boardUpdate(e) {
      console.log('boardUpdate', e)
      if(this.realBoardItems[e.newIndex] === 0){
        this.$set(this.realBoardItems, e.newIndex, this.selectedPiece);
        this.$set(this.realBoardItems, e.oldIndex, 0);
        this.boardItems = this.objClone(this.realBoardItems);
      }
    },
    pieceChoose(e) {
      this.selectedPiece = this.pieceItems[e.oldIndex];
    },
    pieceAdd(e) {
      this.$set(this.pieceItems, e.newIndex, this.selectedPiece);
      this.$set(this.realBoardItems, e.oldIndex, 0);

      this.boardItems = this.objClone(this.realBoardItems);
      // this.boardItems = this.objClone(this.realBoardItems);
      // this.selectedPiece = this.boardItems[e.oldIndex];
      console.log('pieceAdd', this.selectedPiece)
    },
    pieceUpdate(e) {
      // this.selectedPiece = this.pieceItems[e.oldIndex];
      // console.log('pieceUpdate', this.selectedPiece)
    },
    pieceRemove(e){
      console.log(e)
    },
    checkMove(e) {},
    previewImage() {},
    // dragover(e) {
    //   e.preventDefault();
    // },
    // dragleave(e) {
    //   e.srcElement.classList.remove("hover");
    // },
    // dragenter(e) {
    //   e.srcElement.classList.add("hover");
    //   e.preventDefault();
    // },
    // boardDrag(e) {
    //   let boardId = e.srcElement.parentElement.getAttribute("board-id");
    //   e.dataTransfer.setData("isBoardMove", true);
    //   e.dataTransfer.setData("board-move-id", boardId);
    // },
    // pieceDrag(e) {
    //   console.log(e.detail);
    //   if (e.detail === undefined) {
    //     return;
    //   }
    //   let targetId = e.target.id;
    //   let style = this.pieceItems[targetId].style;

    //   console.log(style);
    //   e.dataTransfer.setData("piece-id", targetId);
    //   e.dataTransfer.setData("style", style);
    // },
    // drop(e) {
    //   console.log(e);
    //   e.srcElement.classList.remove("hover");
    //   let boardId = e.srcElement.getAttribute("board-id");

    //   let pieceId = e.dataTransfer.getData("piece-id");
    //   let isBoardMove = e.dataTransfer.getData("isBoardMove");
    //   let style = e.dataTransfer.getData("style");

    //   if (isBoardMove) {
    //     let boardMoveId = e.dataTransfer.getData("board-move-id");
    //     if (boardId !== null) {
    //       this.boardItems[boardId] = this.boardItems[boardMoveId];
    //       this.boardItems[boardMoveId] = {};
    //       this.$set(this.boardItems, boardMoveId, {});
    //     }
    //   } else {
    //     if (boardId) {
    //       this.boardItems[boardId] = {
    //         style: style,
    //         id: pieceId
    //       };
    //     } else {
    //       return;
    //     }
    //     this.pieceItems.splice(Number(pieceId), 1);
    //   }

    //   console.log(this.boardItems);

    //   //

    //   // console.log(e)
    //   e.preventDefault();
    //   // let targetId = e.dataTransfer.getData("target-id");
    //   // e.target.appendChild(document.getElementById(targetId));

    //   // let wrapId = e.dataTransfer.getData("target-wrap-id");
    //   // if(wrapId !== ''){
    //   //   document.getElementById(wrapId).classList.add('d-none')
    //   // }
    // },
    setBoard() {
      this.perviewImage = this.$refs.preview;
      this.pWidth = this.perviewImage.clientWidth / this.pieceNumber;
      this.pHeight = this.perviewImage.clientHeight / this.pieceNumber;
      this.boardHeight = this.perviewImage.clientHeight;
      for (let i = 0; i < this.pieceNumber * this.pieceNumber; i++) {
        this.realBoardItems.push(0);
        this.boardItems.push(0);
      }
    },
    setPieceItem() {
      // let board = document.getElementById("board-piece");
      let temp = [];
      for (let i = 0; i < this.pieceNumber; i++) {
        for (let j = 0; j < this.pieceNumber; j++) {
          let item = {};
          item.class = "piece-item";
          item.style = `width: ${this.pWidth}px; height: ${
            this.pHeight
          }px; background: url(${dImage}); background-size:${
            this.perviewImage.clientWidth
          }px ${this.perviewImage.clientHeight}px; background-position: -${j *
            this.pWidth}px -${i * this.pHeight}px;`;

          temp.push(item);
        }
      }
      this.pieceItems = temp;
    }
  }
};
</script>
