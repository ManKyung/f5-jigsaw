<template>
  <v-ons-page class="game-page">
    <v-ons-toolbar class="game-top white" style="min-height:64px; background-image: none;">
      <div class="left pt-2">
        <v-ons-back-button class="pl-4" @click="clickRemoveBanner"></v-ons-back-button>
      </div>
      <div class="game-button right pt-1">
        <v-ons-button
          modifier="quiet"
          style="color:#111"
          @click="isHint = !isHint"
        >
          <v-ons-icon icon="ion-ios-color-wand"></v-ons-icon>
        </v-ons-button>
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
    :gameType="gameType"
    :level="level"
    :category="category"
    :src="src"
    :pCount="pCount"
    :id="id"
    :isVisiblePreview="isVisiblePreview"
    :isHint="isHint"
    :background="this.$store.state.gameSet.background"
    :backgroundBorder="this.$store.state.gameSet.backgroundBorder"
    @goMainPage="goMainPage"    
    ></component>
    
  </v-ons-page>
</template>
<style>
.game-top {
  display:flex;
}
.game-top > .left {
  flex: 1;
}
.game-top > .center {
  flex: 0;
}
.game-top > .right {
  flex: 2;
}
.game-button ons-button {
  font-size:3vh !important;
}
</style>
<script>
import jigsawPage from '@/views/play/Jigsaw.vue'
import sliderPage from '@/views/play/Slider.vue'
import switchPage from '@/views/play/Switch.vue'
import rotationPage from '@/views/play/Rotation.vue'
import backgroundPage from '@/views/settings/Background'
import { showBanner, removeBanner } from "@/assets/js/admob.js";
export default {
  name: "play",
  props: {
    gameType: {
      type: String,
      default: "jigsaw"
    },
    level: {
      type: Number,
      default: 1
    },
    category: {
      type: String,
      default: "cats"
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
      isHint: true,
    };
  },
  created() {
    // this.gameType = 'jigsaw'
    if(this.gameType === 'jigsaw'){
      this.component = jigsawPage
    } else if(this.gameType === 'slider'){
      this.component = sliderPage
    } else if(this.gameType === 'switch'){
      this.component = switchPage
    } else if(this.gameType === 'rotate'){
      this.component = rotationPage
    }
  },
  mounted() {
    setTimeout(() => {
      if(this.component.name === 'jigsaw-play'){
        document.body._gestureDetector.dispose();
      }
      showBanner();
    }, 200);

    setTimeout(() => {
      this.isVisiblePreview = false;
    }, 1000);
  },
  methods: {
    clickRemoveBanner(){
      removeBanner();
    },
    goMainPage(){
      this.$emit('pop-page');
    },
    goBackgroundPage(){
      this.$emit("push-page", { ...backgroundPage });
    }
  }
};
</script>
