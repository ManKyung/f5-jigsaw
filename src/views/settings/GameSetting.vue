<template>
  <v-ons-page>
    <div class="left pt-2">
      <v-ons-back-button class="pl-4"></v-ons-back-button>
    </div>

    <div class="pt-4">
      <v-ons-row>
        <v-ons-col
          class="ml-2 mr-1 my-1 gamesetting-item"
          :class="type === 'jigsaw' ? 'on' : ''"
          v-hammer:tap="(e)=> setGameType(e, 'jigsaw')"
          v-hammer:pan.start="(e)=> setGameType(e, 'jigsaw')"
        >
          <div v-if="type === 'jigsaw'" class="game-check">
            <v-ons-icon icon="ion-ios-checkmark-circle-outline"></v-ons-icon>
          </div>
          <div class="pl-5 pt-10">Jigsaw</div>
        </v-ons-col>
        <v-ons-col
          class="ml-1 mr-2 my-1 gamesetting-item"
          :class="type === 'switch' ? 'on' : ''"
          v-hammer:tap="(e)=> setGameType(e, 'switch')"
          v-hammer:pan.start="(e)=> setGameType(e, 'switch')"
        >
          <div v-if="type === 'switch'" class="game-check">
            <v-ons-icon icon="ion-ios-checkmark-circle-outline"></v-ons-icon>
          </div>
          <div class="pl-5 pt-10">Switch</div>
        </v-ons-col>
      </v-ons-row>
      <v-ons-row>
        <v-ons-col
          class="ml-2 mr-1 my-1 gamesetting-item"
          :class="type === 'slider' ? 'on' : ''"
          v-hammer:tap="(e)=> setGameType(e, 'slider')"
          v-hammer:pan.start="(e)=> setGameType(e, 'slider')"
        >
          <div v-if="type === 'slider'" class="game-check">
            <v-ons-icon icon="ion-ios-checkmark-circle-outline"></v-ons-icon>
          </div>
          <div class="pl-5 pt-10">Slider</div>
        </v-ons-col>
        <v-ons-col
          class="ml-1 mr-2 my-1 gamesetting-item"
          :class="type === 'rotate' ? 'on' : ''"
          v-hammer:tap="(e)=> setGameType(e, 'rotate')"
          v-hammer:pan.start="(e)=> setGameType(e, 'rotate')"
        >
          <div v-if="type === 'rotate'" class="game-check">
            <v-ons-icon icon="ion-ios-checkmark-circle-outline"></v-ons-icon>
          </div>
          <div class="pl-5 pt-10">Rotate</div>
        </v-ons-col>
      </v-ons-row>
    </div>
  </v-ons-page>
</template>

<style scoped>
.gamesetting-item {
  background: #eee;
  height: 120px;
}
.gamesetting-item.on {
  background: #6c5ce7;
  color: white;
}
.game-check {
  position: absolute;
  padding-left: 10px;
  color: white;
}
</style>

<script>
export default {
  name: "game-setting",
  data() {
    return {
      type: "",
    };
  },
  mounted() {
    this.type = this.$store.state.gameSet.type;
  },
  methods: {
    setGameType(e, type) {
      this.type = type;
      this.$store.commit("gameSet/setGameType", type);
    }
  }
};
</script>