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
    <div
      class="game-background game-container"
      ref="gameContainer"
      :style="`background:url('${background}'); padding-top:${paddingTop}px`"
    >
      <div class="pa-5 preview-wrap" :class="actionSheetVisible ? 'on' : ''">
        <img
          ref="preview"
          class="w-100 previewImage"
          :class="actionSheetVisible ? 'on' : ''"
          :src="imageSrc"
        />
      </div>
      <div class="pa-5 board-real-wrap">
        <div id="board-real" :style="`max-height:${boardHeight}px; overflow:hidden`">
          <div
            v-for="(item, index) in realBoardItems"
            :key="index"
            :style="`width: ${pWidth}px; height:${pHeight}px`"
            @click="changePiece(index)"
          >
            <div class="switch-piece" :id="`piece-${index}`" :style="item.style"></div>
          </div>
        </div>
      </div>
    </div>
  </v-ons-page>
</template>
<style>
svg {
  /* width: 100%; */
  /* fill: #6c5ce7; */
}
text {
  fill: #fff;
  font-family: "Oswald";
  font-weight: 700;
}
text tspan {
  padding: 0;
  margin: 0;
  opacity: 0;
}
.filled-heading {
  text-transform: uppercase;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 5em;
  line-height: 0.9;
}

/* Animate the background shapes */
#background path {
  animation: pulse 4s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;

  /* Necessary to keep the SVG objects in place while scaling */
  transform-origin: 50% 50%;
  transform-box: fill-box;
}

@keyframes pulse {
  /* Rotating it along with the scale makes it a little bit more fancy */
  0%,
  100% {
    transform: scale(0) rotate(33deg);
  }
  35%,
  65% {
    transform: scale(1) rotate(0deg);
  }
}
.switch-piece.on {
  -webkit-box-shadow: inset 0px 0px 0px 3px #6c5ce7 !important;
  -moz-box-shadow: inset 0px 0px 0px 3px #6c5ce7 !important;
  box-shadow: inset 0px 0px 0px 3px #6c5ce7 !important;
}
</style>
<script>
import clearPage from '@/views/play/Clear';
export default {
  props: {
    category: {
      type: String,
      default: "scenery"
    },
    src: {
      type: String,
      default: "10.jpg"
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
  name: "switch-play",
  data() {
    return {
      previewImage: null,
      imageSrc: "",
      realBoardItems: [],
      selectedIndex: -1,
      pWidth: 0,
      pHeight: 0,
      boardHeight: 0,
      actionSheetVisible: true,
      paddingTop: 0,
      background: this.$store.state.gameSet.background,
      borderColor: this.$store.state.gameSet.backgroundBorder
    };
  },
  created() {
    this.imageSrc = require(`../../assets/img/${this.category}/${this.src}`);
    this.pieceCount = this.pCount;
    this.background = require(`../../assets/img/background/${this.background}.jpg`);
  },
  mounted() {
    setTimeout(() => {
      this.setBoard();
      document.body._gestureDetector.dispose();
    }, 200);

    setTimeout(() => {
      this.actionSheetVisible = false;
    }, 1000);

  },
  methods: {
    isClear(){
      let len = this.realBoardItems.length;

      for(let i = 0 ; i < len ; i++){
        if(i !== this.realBoardItems[i].id) {
          return false;
        }
      }

      return true;
    },
    changePiece(i) {
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
          this.$emit("push-page", {
            ...clearPage,
            onsNavigatorProps: {
              category: this.category,
              id: this.id,
            }
          });
        }
      }
    },
    setBoard() {
      this.previewImage = this.$refs.preview;
      let gameContainer = this.$refs.gameContainer;
      this.pWidth = this.previewImage.clientWidth / this.pieceCount;
      this.pHeight = this.previewImage.clientHeight / this.pieceCount;
      this.boardHeight = this.previewImage.clientHeight;
      this.paddingTop =
        gameContainer.clientHeight / 2 - (this.boardHeight + 40) / 2;

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
