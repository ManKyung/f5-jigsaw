<template>
  <v-ons-page class="game-page">
    <v-ons-toolbar class="game-top white" style="min-height:64px; background-image: none;">
      <div class="left pt-2 w-100">
        <v-ons-back-button class="pl-4"></v-ons-back-button>
      </div>
      <div class="game-button right pt-1">
        <v-ons-button
          modifier="quiet"
          style="color:#111"
          @click="goBackgroundPage"
        >
          <v-ons-icon icon="ion-ios-albums"></v-ons-icon>
        </v-ons-button>
        <v-ons-button
          class="mr-2"
          modifier="quiet"
          :style="isVisiblePreview ? 'color:#6c5ce7' : 'color:#111'"
          @click="isVisiblePreview = !isVisiblePreview"
        >
          <v-ons-icon icon="ion-ios-image"></v-ons-icon>
        </v-ons-button>
      </div>
    </v-ons-toolbar>

    <component :is="component"
    :category="category"
    :src="src"
    :pCount="pCount"
    :id="id"
    :isVisiblePreview="isVisiblePreview"
    :background="this.$store.state.gameSet.background"
    :backgroundBorder="this.$store.state.gameSet.backgroundBorder"
    @goMainPage="goMainPage"    
    ></component>
    
  </v-ons-page>
</template>
<style>
.game-button ons-button {
  font-size:2.4vh
}
.preview-wrap{
  position:absolute; z-index:100
}
.board-wrap{
  position:absolute; z-index:103
}
.board-real-wrap{
  position:absolute; z-index:102
}
</style>
<script>
import jigsawPage from '@/views/play/Jigsaw.vue'
import sliderPage from '@/views/play/Slider.vue'
import switchPage from '@/views/play/Switch.vue'
import rotationPage from '@/views/play/Rotation.vue'
import backgroundPage from '@/views/settings/Background'
export default {
  name: "play",
  props: {
    gameType: {
      type: String,
      default: "animal"
    },
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
  data() {
    return {
      isVisiblePreview: true,
    };
  },
  created() {
    this.gameType = 'jigsaw'
    if(this.gameType === 'jigsaw'){
      this.component = jigsawPage
    } else if(this.gameType === 'slider'){
      this.component = sliderPage
    } else if(this.gameType === 'switch'){
      this.component = switchPage
    } else if(this.gameType === 'rotation'){
      this.component = rotationPage
    }
  },
  mounted() {
    setTimeout(() => {
      document.body._gestureDetector.dispose();
    }, 200);

    setTimeout(() => {
      this.isVisiblePreview = false;
    }, 1000);
  },
  methods: {
    goMainPage(){
      this.$emit('pop-page');
    },
    goBackgroundPage(){
      this.$emit("push-page", { ...backgroundPage });
    }
  }
};
</script>
