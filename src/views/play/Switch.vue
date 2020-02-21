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
          <v-ons-button modifier="large" @click="next">NEXT</v-ons-button>
        </div>
        </div>
      </v-ons-modal>
    </div>
</template>
<style>
.switch-piece.on {
  -webkit-box-shadow: inset 0px 0px 0px 3px #6c5ce7 !important;
  -moz-box-shadow: inset 0px 0px 0px 3px #6c5ce7 !important;
  box-shadow: inset 0px 0px 0px 3px #6c5ce7 !important;
}
</style>
<script>
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
  },
  watch: {
    isHint(){
      let len = this.realBoardItems.length;

      let correctTemp = [];
      let shuffleTemp = [];
      for(let i = 0 ; i < len ; i++){
        if(this.realBoardItems[i].id < len / 2){
          correctTemp[this.realBoardItems[i].id] = this.realBoardItems[i];
        } else {
          shuffleTemp.push(this.realBoardItems[i])
        }
      }
      this.realBoardItems = [];
      for(let i = 0 ; i < correctTemp.length ; i++){
        this.realBoardItems.push(correctTemp[i])
      }
      for(let i = 0 ; i < shuffleTemp.length ; i++){
        if(shuffleTemp[i] && shuffleTemp[i].id === undefined){
          this.emptyIndex = correctTemp.length + i
        }
        this.realBoardItems.push(shuffleTemp[i])
      }
    },
    background(value){
      this.setBackground(value)
    }
  },
  methods: {
    setUI(){
      let gameContainer = this.$refs.gameContainer;
      let boardWrap = this.$refs.boardWrap;
      this.paddingTop = (gameContainer.clientHeight - boardWrap.clientHeight) / 2;
    },
    setBackground(value){
      this.backgroundImage = require(`../../assets/img/background/${value}.jpg`);
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

      return true;
    },
    changePiece(e, i) {
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
          
        if(this.isClear()) {
          this.isClearImage = true;
          setTimeout(() => {
            this.modalClear = true;
          }, 1000)
          setTimeout(() => {
            this.isClearOn = true;
          }, 1300)
        }
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
