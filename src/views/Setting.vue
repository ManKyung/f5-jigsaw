<template>
  <v-ons-page>
    <div class="left pt-2">
      <v-ons-back-button class="pl-4"></v-ons-back-button>
    </div>

    <div class="pt-4">
      <v-ons-list-item>
        <v-ons-list-item modifier="nodivider"></v-ons-list-item>
        <v-ons-list-item modifier="nodivider">Review</v-ons-list-item>
        <v-ons-list-item modifier="nodivider">Background</v-ons-list-item>
        <v-ons-list-item modifier="nodivider">Feedback</v-ons-list-item>
        <v-ons-list-item modifier="nodivider">Remove AD</v-ons-list-item>
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
  align-items: center;
  justify-content: center;
  background-image: none;
}
.btn-music > ons-icon {
  color: #fd79a8 !important;
}
.btn-music {
  background-color: transparent;
  border: 2px solid #fd79a8;
  color: #fd79a8;
}
.btn-music:active {
  background-color: #ffe6ee;
  border: 2px solid #fd79a8;
  color: #fd79a8;
  opacity: 1;
}
.btn-music:hover {
  border: 2px solid #fd79a8;
  transition: 0;
}
.btn-sound > ons-icon {
  color: #00b894 !important;
}
.btn-sound {
  background-color: transparent;
  border: 2px solid #00b894;
  color: #00b894;
}
.btn-sound:active {
  background-color: #cbf1ea;
  border: 2px solid #00b894;
  color: #00b894;
  opacity: 1;
}
.btn-sound:hover {
  border: 2px solid #00b894;
  transition: 0;
}
</style>


<script>
export default {
  name: "setting"
};
</script>