<template>
  <v-ons-page>
    <div class="left" style="min-height:64px;">
      <v-ons-back-button class="pl-4 pt-2"></v-ons-back-button>
      <div class="pl-3 fo w-100" style="display:inline; font-size:32px;">Option</div>
    </div>
    <div>
      <div id="board-real-preview" :style="`max-height:${boardHeight}px; overflow:hidden`">
        <div
          v-for="(item, index) in boardItems"
          :key="index"
          :style="`width: ${pWidth}px; height:${pHeight}px`"
          :board-id="`${index}`"
        >
          <div :id="item.id" :style="item.style"></div>
        </div>
      </div>

      <div>
        <img ref="preview" class="w-100" :src="imageSrc" />
      </div>
      <carousel-3d
        @after-slide-change="setPieceCount"
        :animationSpeed="200"
        :space="100"
        :width="80"
        :height="80"
      >
        <slide class="text-center pt-3" v-for="(value, key) in items" :key="key" :index="key">
          <v-ons-icon icon="md-puzzle-piece"></v-ons-icon>
          <div>{{(value)*(value)}}</div>
        </slide>
      </carousel-3d>

      <v-ons-row class="text-center">
        <v-ons-col class="pa-1" v-for="(item, index) in gameTypeItems" :key="index">
          <v-ons-button
            v-hammer:tap="(e)=> setGameType(e, item.type)"
            v-hammer:press="(e)=> setGameType(e, item.type)"
            v-hammer:pressup="(e)=> setGameType(e, item.type)"
            v-hammer:pan.start="(e)=> setGameType(e, item.type)"
            class="w-100 btn-type type-text"
            :class="gameType === item.type ? 'on' : ''"
          >{{item.type}}</v-ons-button>
        </v-ons-col>
      </v-ons-row>

      <v-ons-col class="pa-1">
        <v-ons-button class="w-100 text-center play-text" 
          v-hammer:tap="goPage"
          v-hammer:press="goPage"
          v-hammer:pressup="goPage"
        >Play</v-ons-button>
      </v-ons-col>
    </div>
  </v-ons-page>
</template>
<style>
.back-button__icon {
  fill: black !important;
}
.carousel-3d-slide.current {
  background-color: #fb8c00 !important;
  color: white !important;
  letter-spacing: 2px !important;
  border-radius: 20px;
  font-size:28px;
  border: none;
}
.carousel-3d-slide.left-1,
.carousel-3d-slide.left-2,
.carousel-3d-slide.right-1,
.carousel-3d-slide.right-2 {
  background-color: white !important;
  color: #fb8c00 !important;
  border: 1px solid #fcaf50 !important;
  border-radius: 10px;
  padding-top:16px !important;
  font-size:20px;
  letter-spacing: 2px !important;
}
.btn-type {
  background-color: transparent !important;
  border: 1px solid #fb8c00 !important;
  color: #fb8c00 !important;
  letter-spacing: 2px !important;
}
.btn-type.on {
  background-color: #fb8c00 !important;
  color: white !important;
  letter-spacing: 1px !important;
  font-weight: bold !important;
}
.type-text,
.play-text {
  text-transform: capitalize !important;
  font-family: baemin !important;
  letter-spacing: 0.5px !important;
}
.play-text:active, .type-text:active {
  transform: translateY(2px);
}
</style>
<script>
import gamePage from "./play/Game.vue";
import { Carousel3d, Slide } from "vue-carousel-3d";
export default {
  props: ["category", "id", "src", "level"],
  name: "playOption",
  components: {
    Carousel3d,
    Slide
  },
  data() {
    return {
      pieceCount: 3,
      items: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      perviewImage: null,
      boardItems: [],
      selectedPiece: {},
      pWidth: 0,
      pHeight: 0,
      boardHeight: 0,
      imageSrc: "",
      gameType: this.$store.state.gameSet.type,
      my: this.$store.state.gameSet.my,
      gameTypeItems: [
        {
          type: "jigsaw"
        },
        {
          type: "switch"
        },
        {
          type: "slider"
        },
        {
          type: "rotate"
        }
      ]
    };
  },
  created() {
    this.imageSrc = require(`../assets/img/${this.category}/${this.src}`);
  },
  mounted() {
    setTimeout(() => {
      this.setBoard();
    }, 100);
  },
  watch: {
    pieceCount(value) {
      this.setBoard(value);
    }
  },
  methods: {
    setGameType(e, value) {
      if(e.type === 'tap' || e.type === 'pressup' || e.type === 'pan'){
        this.gameType = value;
      }
    },
    setPieceCount(index) {
      this.pieceCount = index + 3;
    },
    goPage(e) {
      if(e.type === 'tap' || e.type === 'pressup'){
        let params = {
          gameType: this.gameType,
          category: this.category,
          id: this.id,
          src: this.src,
          pCount: this.pieceCount,
          level: this.level
        };

        this.$store.commit("gameSet/setMy", params);
        this.$emit("push-page", { ...gamePage, onsNavigatorProps: params });
      }
    },
    setBoard(pieceCount) {
      pieceCount = pieceCount === undefined ? this.pieceCount : pieceCount;
      this.perviewImage = this.$refs.preview;
      this.pWidth = this.perviewImage.clientWidth / pieceCount;
      this.pHeight = this.perviewImage.clientHeight / pieceCount;
      this.boardHeight = this.perviewImage.clientHeight;

      let len = pieceCount * pieceCount;
      this.boardItems = [];
      for (let i = 0; i < len; i++) {
        this.boardItems.push(0);
      }
    }
  }
};
</script>