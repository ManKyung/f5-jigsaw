<template>
  <v-ons-page>
    
    <v-ons-toolbar class="white" style="min-height:64px;">
      <v-ons-back-button class="pt-2">
      </v-ons-back-button>
      <div class="pl-3 fo w-100" style="font-size:42px;">Option</div>
    </v-ons-toolbar>

    <div class="pt-5">
    <div
      id="board-real-preview"
      :style="`max-height:${boardHeight}px; overflow:hidden`"
    >
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

    <v-ons-carousel class="w-100" swipeable auto-scroll :index.sync="pieceCount">
      <v-ons-carousel-item v-for="(value, key) in items" :key="key">
        <div style="text-align: center; font-size: 30px; margin: 20px 0;">
          <v-ons-icon icon="md-puzzle-piece"></v-ons-icon>
          <div>{{(value-2)*(value-2)}}</div>
        </div>
      </v-ons-carousel-item>
    </v-ons-carousel>
    <div class="text-center">
    <v-ons-button style="width:50px;" @click="pieceCount > 2 && pieceCount--">
      <v-ons-icon icon="md-chevron-left"></v-ons-icon>
    </v-ons-button>
    <v-ons-button style="width:50px;" @click="pieceCount < 15 && pieceCount++">
      <v-ons-icon icon="md-chevron-right"></v-ons-icon>
    </v-ons-button>
    </div>

    <v-ons-col class="pa-3">
      <v-ons-button modifier="large" class="w-100" @click="goPage">Play</v-ons-button>
    </v-ons-col>

    </div>
  </v-ons-page>
</template>
<style>
.back-button__icon {
  fill: black !important;
}
</style>
<script>
import jigsawPage from './Play/Jigsaw.vue'
import sliderPage from './Play/Slider.vue'
import switchPage from './Play/Switch.vue'
import rotationPage from './Play/Rotation.vue'
export default {
  props: ["category", "id", "src"],
  name: "playOption",
  data() {
    return {
      pieceCount: 4,
      items: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      perviewImage: null,
      boardItems: [],
      selectedPiece: {},
      // pieceNumber: 8,
      pWidth: 0,
      pHeight: 0,
      boardHeight: 0,
      imageSrc: '',
      gameType: this.$store.state.gameSet.type,
      my: this.$store.state.gameSet.my,
    };
  },
  created(){
    this.imageSrc = require(`../assets/img/${this.category}/${this.src}`);
  },
  mounted() {
    console.log(this.my)
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
    goPage() {
      let params = {
        gameType: this.gameType,
        category: this.category,
        id: this.id,
        src: this.src,
        pCount: this.pieceCount,
      }

      this.$store.commit('gameSet/setMy', params)

      if(this.gameType === 'jigsaw'){
        this.$emit("push-page", { ...jigsawPage, onsNavigatorProps: params });
      } else if(this.gameType === 'slider'){
        this.$emit("push-page", { ...sliderPage, onsNavigatorProps: params });
      } else if(this.gameType === 'switch'){
        this.$emit("push-page", { ...switchPage, onsNavigatorProps: params });
      } else if(this.gameType === 'rotation'){
        this.$emit("push-page", { ...rotationPage, onsNavigatorProps: params });
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