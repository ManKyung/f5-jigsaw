<template>
  <v-ons-page>
    <div class="left" style="min-height:64px;">
      <v-ons-back-button class="pl-4"></v-ons-back-button>
      <div class="pl-3 fo w-100" style="display:inline; font-size:42px;">Option</div>
    </div>
    <!-- <v-ons-toolbar class="white" style="min-height:64px;">
      <v-ons-back-button class="pt-2"></v-ons-back-button>
    </v-ons-toolbar> -->

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
        <slide class="text-center pt-2" v-for="(value, key) in items" :key="key" :index="key">
          <v-ons-icon icon="md-puzzle-piece"></v-ons-icon>
          <div style="margin-top:-4px;">{{(value)*(value)}}</div>
        </slide>
      </carousel-3d>

      <v-ons-row class="text-center">
        <v-ons-col class="pa-1" v-for="(item, index) in gameTypeItems" :key="index">
          <v-ons-button
            v-hammer:tap="(e)=> setGameType(e, item.type)"
            v-hammer:pan="(e)=> setGameType(e, item.type)"
            class="w-100 btn-type type-text"
            :class="gameType === item.type ? 'on' : ''"
          >{{item.type}}</v-ons-button>
        </v-ons-col>
      </v-ons-row>

      <v-ons-col class="pa-1">
        <v-ons-button modifier="large" class="w-100 play-text" @click="goPage">Play</v-ons-button>
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
  letter-spacing: 4px !important;
}
.carousel-3d-slide.left-1,
.carousel-3d-slide.left-2,
.carousel-3d-slide.right-1,
.carousel-3d-slide.right-2 {
  background-color: white !important;
  color: #fb8c00 !important;
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
  letter-spacing: 2px !important;
}
.type-text,
.play-text {
  text-transform: capitalize !important;
  font-family: NanumOenSonJabIDoYeBbeo !important;
  font-size: 2vh !important;
  letter-spacing: 2px !important;
  font-weight: bold !important;
}
</style>
<script>
import gamePage from "./play/Game.vue";
import { Carousel3d, Slide } from "vue-carousel-3d";
export default {
  props: ["category", "id", "src"],
  name: "playOption",
  components: {
    Carousel3d,
    Slide
  },
  data() {
    return {
      pieceCount: 4,
      items: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      perviewImage: null,
      boardItems: [],
      selectedPiece: {},
      // pieceNumber: 8,
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
          type: "rotation"
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
      this.gameType = value;
    },
    setPieceCount(index) {
      this.pieceCount = index + 4;
    },
    goPage() {
      let params = {
        gameType: this.gameType,
        category: this.category,
        id: this.id,
        src: this.src,
        pCount: this.pieceCount
      };

      this.$store.commit("gameSet/setMy", params);
      this.$emit("push-page", { ...gamePage, onsNavigatorProps: params });
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