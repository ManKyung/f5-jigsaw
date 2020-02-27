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
          v-hammer:tap="(e)=> goPage(e, 'about')"
          v-hammer:pan.start="(e)=> goPage(e, 'about')"
          v-hammer:press="(e)=> goPage(e, 'about')"
          v-hammer:pressup="(e)=> goPage(e, 'about')"
        >About</v-ons-list-item>
        <v-ons-list-item
          class="setting-title fs-20"
          modifier="nodivider"
          v-hammer:tap="(e)=> goPage(e, 'privacy')"
          v-hammer:pan.start="(e)=> goPage(e, 'privacy')"
          v-hammer:press="(e)=> goPage(e, 'privacy')"
          v-hammer:pressup="(e)=> goPage(e, 'privacy')"
        >Privacy</v-ons-list-item>
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
        v-hammer:press="setBackgroundMusic"
        v-hammer:pressup="setBackgroundMusic"
        v-hammer:pan.start="setBackgroundMusic"
        modifier="outline"
        class="btn-music"
        :class="$store.state.gameSet.isBackgroundMusic ? 'on': ''"
        style="margin: 6px 0"
      >
        <v-ons-icon icon="ion-ios-musical-notes" style="color:black; font-size:32px"></v-ons-icon>
      </v-ons-button>
      <v-ons-button
        v-hammer:tap="setSound"
        v-hammer:press="setSound"
        v-hammer:pressup="setSound"
        v-hammer:pan.start="setSound"
        modifier="outline"
        class="btn-sound"
        :class="$store.state.gameSet.isSound ? 'on': ''"
        style="margin: 6px 0"
      >
        <v-ons-icon icon="ion-ios-volume-high" style="color:black; font-size:32px"></v-ons-icon>
      </v-ons-button>
    </div>


    <v-ons-toast :visible.sync="toastVisible" animation="ascend">
      Thanks for ad watching
      <button @click="toastVisible = false">ok</button>
    </v-ons-toast>
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
  transform: translateY(2px);
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
  transform: translateY(2px);
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
</style>


<script>
import gameSettingPage from "@/views/settings/GameSetting";
import backgroundPage from "@/views/settings/Background";
import { showRewardVideo } from "@/assets/js/admob.js";
export default {
  name: "setting",
  data() {
    return {
      toastVisible: false
    };
  },
  mounted() {
    document.addEventListener(
      "admob.rewardvideo.events.REWARD",
      this.getReward
    );
  },
  destroyed() {
    document.removeEventListener(
      "admob.rewardvideo.events.REWARD",
      this.getReward
    );
  },
  methods: {
    getReward(){
      this.$store.commit("gameSet/setRewardCount");
      if(this.$store.state.gameSet.rewardCount === 0){
        this.toastVisible = true;
      }
    },
    setSound(e) {
      if(e.type === 'tap' || e.type === 'pressup' || e.type === 'panstart'){
        this.$store.commit("gameSet/setSound", !this.$store.state.gameSet.isSound);
      }
    },
    setBackgroundMusic(e) {
      if(e.type === 'tap' || e.type === 'pressup' || e.type === 'panstart'){
        this.$store.commit("gameSet/setBackgroundMusic", !this.$store.state.gameSet.isBackgroundMusic);
      }
    },
    goPage(e, page) {
      if(e.type === 'tap' || e.type === 'pressup' || e.type === 'panstart'){
        if (page === "review") {
          location.href = "https://play.google.com/store/apps/details?id=com.f5game.jigsaw";
        } else if (page === "background") {
          this.$emit("push-page", {
            ...backgroundPage,
            onsNavigatorProps: {}
          });
        } else if (page === "share") {
          window.plugins.socialsharing.share(
            "F5 Puzzle Games(Free)",
            "Jigsaw, Switch, Slider, Rotate",
            "https://f5game.co.kr/img/f5-jigsaw.d15fc2e8.jpg",
            "https://play.google.com/store/apps/details?id=com.f5game.jigsaw"
          );
        } else if (page === "gameSetting") {
          this.$emit("push-page", {
            ...gameSettingPage,
            onsNavigatorProps: {}
          });
        } else if (page === "removeAd") {
          this.$ons.notification.confirm(`If you watch an ad twice,<br/> you won't see banner AD it for a day<br/> (${this.$store.state.gameSet.rewardCount}/2)`, { title: "" }).then((response) => {
            if (response) {
              showRewardVideo()
            }
          });
        } else if (page === "about") {
          location.href = "https://f5game.co.kr/home";
        } else if (page === "privacy") {
          location.href = "https://f5game.co.kr/privacy";
        } 
      }
    }
  }
};
</script>