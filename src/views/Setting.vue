<template>
  <v-ons-page>
    <div class="left pt-2">
      <v-ons-back-button class="pl-4"></v-ons-back-button>
    </div>

    <div class="pt-4">
      <v-ons-list-item>
        <v-ons-list-item modifier="nodivider"></v-ons-list-item>
        <v-ons-list-item
          class="setting-title fs-20"
          modifier="nodivider"
          v-hammer:tap="(e)=> goPage(e, 'review')"
          v-hammer:pan.start="(e)=> goPage(e, 'review')"
          v-hammer:press="(e)=> goPage(e, 'review')"
          v-hammer:pressup="(e)=> goPage(e, 'review')"
        >Review</v-ons-list-item>
        <v-ons-list-item
          class="setting-title fs-20"
          modifier="nodivider"
          v-hammer:tap="(e)=> goPage(e, 'background')"
          v-hammer:pan.start="(e)=> goPage(e, 'background')"
          v-hammer:press="(e)=> goPage(e, 'background')"
          v-hammer:pressup="(e)=> goPage(e, 'background')"
        >Background</v-ons-list-item>
        <v-ons-list-item
          class="setting-title fs-20"
          modifier="nodivider"
          v-hammer:tap="(e)=> goPage(e, 'share')"
          v-hammer:pan.start="(e)=> goPage(e, 'share')"
          v-hammer:press="(e)=> goPage(e, 'share')"
          v-hammer:pressup="(e)=> goPage(e, 'share')"
        >Share</v-ons-list-item>
        <v-ons-list-item
          class="setting-title fs-20"
          modifier="nodivider"
          v-hammer:tap="(e)=> goPage(e, 'gameSetting')"
          v-hammer:pan.start="(e)=> goPage(e, 'gameSetting')"
          v-hammer:press="(e)=> goPage(e, 'gameSetting')"
          v-hammer:pressup="(e)=> goPage(e, 'gameSetting')"
        >Game Setting</v-ons-list-item>
        <v-ons-list-item
          class="setting-title fs-20"
          modifier="nodivider"
          v-hammer:tap="(e)=> goPage(e, 'removeAd')"
          v-hammer:pan.start="(e)=> goPage(e, 'removeAd')"
          v-hammer:press="(e)=> goPage(e, 'removeAd')"
          v-hammer:pressup="(e)=> goPage(e, 'removeAd')"
        >Remove AD</v-ons-list-item>
      </v-ons-list-item>
    </div>

    <div class="pt-4 text-center">
      <v-ons-button
        v-hammer:tap="setBackgroundMusic"
        modifier="outline"
        class="btn-music"
        :class="isBackgroundMusic ? 'on': ''"
        style="margin: 6px 0"
      >
        <v-ons-icon icon="ion-ios-musical-notes" style="color:black; font-size:32px"></v-ons-icon>
      </v-ons-button>
      <v-ons-button
        v-hammer:tap="setSound"
        modifier="outline"
        class="btn-sound"
        :class="isSound ? 'on': ''"
        style="margin: 6px 0"
      >
        <v-ons-icon icon="ion-ios-volume-high" style="color:black; font-size:32px"></v-ons-icon>
      </v-ons-button>
    </div>
  </v-ons-page>
</template>

<style>
.setting-title:active {
  transform: translateY(2px);
}
.list-item {
  padding-left: 8px !important;
}
.list-item__center {
  align-items: center !important;
  justify-content: center !important;
  background-image: none !important;
}
.btn-music > ons-icon {
  color: #6c5ce7 !important;
}
.btn-music {
  background-color: transparent !important;
  border: 2px solid #6c5ce7 !important;
  color: #6c5ce7 !important;
}
.btn-music:active {
  background-color: rgba(108, 92, 231, 0.2) !important;
  border: 2px solid #6c5ce7 !important;
  color: #6c5ce7 !important;
}
.btn-music:hover {
  border: 2px solid #6c5ce7 !important;
  transition: 0 !important;
}
.btn-sound > ons-icon {
  color: #fb8c00 !important;
}
.btn-sound {
  background-color: transparent !important;
  border: 2px solid #fb8c00 !important;
  color: #fb8c00 !important;
}
.btn-sound:active {
  background-color: rgba(255, 144, 138, 0.2) !important;
  border: 2px solid #fb8c00 !important;
  color: #fb8c00 !important;
  opacity: 1 !important;
}
.btn-sound:hover {
  border: 2px solid #fb8c00 !important;
  transition: 0 !important;
}
.btn-sound.on {
  background-color: #fb8c00 !important;
}
.btn-sound.on > ons-icon {
  color: white !important;
}
.btn-music.on {
  background-color: #6c5ce7 !important;
}
.btn-music.on > ons-icon {
  color: white !important;
}
.back-button__icon {
  fill: black !important;
}
</style>


<script>
import gameSettingPage from "@/views/settings/GameSetting";
import backgroundPage from "@/views/settings/Background";
import logoImage from "@/assets/logo.jpg";
export default {
  name: "setting",
  data() {
    return {
      isSound: this.$store.state.gameSet.isSound,
      isBackgroundMusic: this.$store.state.gameSet.isBackgroundMusic,
      logoImage
    };
  },
  methods: {
    setSound() {
      this.isSound = !this.isSound;
      this.$store.commit("gameSet/setSound", this.isSound);
    },
    setBackgroundMusic() {
      this.isBackgroundMusic = !this.isBackgroundMusic;
      this.$store.commit("gameSet/setBackgroundMusic", this.isBackgroundMusic);
    },
    goPage(e, page) {
      if(e.type === 'tap' || e.type === 'pressup' || e.type === 'panstart'){
        if (page === "review") {
          location.href =
            "https://play.google.com/store/apps/details?id=com.f5game.jigsaw";
        } else if (page === "background") {
          this.$emit("push-page", {
            ...backgroundPage,
            onsNavigatorProps: {}
          });
        } else if (page === "share") {
          window.plugins.socialsharing.share(
            "F5 Puzzle Games(Free)",
            "Jigsaw, Switch, Slider, Rotate",
            logoImage,
            "https://play.google.com/store/apps/details?id=com.f5game.jigsaw"
          );
        } else if (page === "gameSetting") {
          this.$emit("push-page", {
            ...gameSettingPage,
            onsNavigatorProps: {}
          });
        }
      }
    }
  }
};
</script>