<template>
  <v-ons-page>
    <div class="left pt-2">
      <v-ons-back-button class="pl-4"></v-ons-back-button>
    </div>

    <div class="pt-4">
      <v-ons-list-item>
        <v-ons-list-item modifier="nodivider"></v-ons-list-item>
        <v-ons-list-item modifier="nodivider" @click="goPage('review')">Review</v-ons-list-item>
        <v-ons-list-item modifier="nodivider" @click="goPage('background')">Background</v-ons-list-item>
        <v-ons-list-item modifier="nodivider" @click="goPage('share')">Share</v-ons-list-item>
        <v-ons-list-item modifier="nodivider" @click="goPage('gameSetting')">Game Setting</v-ons-list-item>
        <v-ons-list-item modifier="nodivider" @click="goPage('removeAd')">Remove AD</v-ons-list-item>
      </v-ons-list-item>
    </div>

    <div class="pt-4 text-center">
      <v-ons-button modifier="outline" class="btn-music" color="red" style="margin: 6px 0">
        <v-ons-icon icon="ion-ios-musical-notes" style="color:black; font-size:32px"></v-ons-icon>
      </v-ons-button>
      <v-ons-button modifier="outline" class="btn-sound" style="margin: 6px 0">
        <v-ons-icon icon="ion-ios-volume-high" style="color:black; font-size:32px"></v-ons-icon>
      </v-ons-button>
    </div>
  </v-ons-page>
</template>

<style>
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
.back-button__icon {
  fill: black !important;
}
</style>


<script>
import gameSettingPage from "@/views/settings/GameSetting";
import backgroundPage from "@/views/settings/Background";
export default {
  name: "setting",
  methods: {
    goPage(page) {
      if (page === "review") {
        location.href =
          "https://play.google.com/store/apps/details?id=com.f5game.jigsaw";
      } else if (page === "background") {
        this.$emit("push-page", {
          ...backgroundPage,
          onsNavigatorProps: {}
        });
      } else if (page === "gameSetting") {
        this.$emit("push-page", {
          ...gameSettingPage,
          onsNavigatorProps: {}
        });
      }
    }
  }
};
</script>