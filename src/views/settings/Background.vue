<template>
  <v-ons-page>
    <div class="left pt-2">
      <v-ons-back-button class="pl-4"></v-ons-back-button>
    </div>

    <div class="pt-4">
      <v-ons-row>
        <v-ons-col
          class="background-item"
          v-for="(item, index) in items"
          :key="index"
          v-hammer:tap="(e)=> setBackground(e, item.key, item.borderColor)"
        >
          <div v-if="item.key === background" class="background-check" >
            <v-ons-icon
              icon="ion-ios-checkmark-circle-outline"
              class="fs-24 primary--text"
            ></v-ons-icon>
          </div>
          <img class="w-100" :style="`height:${height}px`" :src="item.imageSrc" />
        </v-ons-col>
      </v-ons-row>
    </div>
  </v-ons-page>
</template>

<style>
.background-item {
  flex: 1 0 33%; /* explanation below */
  padding: 1px;
}
.background-check {
  position: absolute;
  padding-left: 10px;
  padding-top: 10px;
}
</style>

<script>
export default {
  name: "game-background",
  data() {
    return {
      items: [
        {
          key: "1",
          borderColor: "#000",
          src: "1.jpg"
        },
        {
          key: "2",
          borderColor: "#000",
          src: "2.jpg"
        },
        {
          key: "3",
          borderColor: "#000",
          src: "3.jpg"
        },
        {
          key: "4",
          borderColor: "#000",
          src: "4.jpg"
        },
        {
          key: "5",
          borderColor: "#fff",
          src: "5.jpg"
        },
        {
          key: "6",
          borderColor: "#000",
          src: "6.jpg"
        },
        {
          key: "7",
          borderColor: "#fff",
          src: "7.jpg"
        },
        {
          key: "8",
          borderColor: "#fff",
          src: "8.jpg"
        },
        {
          key: "9",
          borderColor: "#fff",
          src: "9.jpg"
        }
      ],
      background: "",
      height: 100
    };
  },
  created() {
    this.height = document.body.clientWidth / 3

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].imageSrc = require(`../../assets/img/background/${this.items[i].src}`);
    }
    this.background = localStorage["background"]
      ? localStorage["background"]
      : "default";
  },
  methods: {
    setBackground(e, value, color) {
      this.background = value;
      this.$store.commit("gameSet/setBackground", value);
      this.$store.commit("gameSet/setBackgroundBorder", color);
    }
  }
};
</script>