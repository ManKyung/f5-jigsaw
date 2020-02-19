<template>
  <v-ons-page>
    <div class="left pt-2">
      <v-ons-back-button class="pl-4"></v-ons-back-button>
    </div>

    <div class="pt-4">
      <v-ons-row>
        <v-ons-col class="mx-2 my-1 background-item" v-for="(item, index) in items" :key="index" @click="setBackground(item.key, item.borderColor)">
          <div v-if="item.key === background" class="background-check">
            <v-ons-icon
              icon="ion-ios-checkmark-circle-outline"
              :style="background === 'default' ? 'color:#000213' : 'color:white'"
            ></v-ons-icon>
          </div>
          <img class="w-100" style="height:130px;" :src="item.imageSrc" />
        </v-ons-col>
      </v-ons-row>
    </div>
  </v-ons-page>
</template>

<style>
.background-item {
  flex: 1 0 45%; /* explanation below */
  height: 130px;
}
.background-check {
  position: absolute;
  padding-left: 10px;
}
</style>

<script>
export default {
  name: "game-background",
  data() {
    return {
      items: [
        {
          key: "default",
          borderColor: '#000',
          src: "default-border.jpg"
        },
        {
          key: "brand",
          borderColor: '#fff',
          src: "brand.jpg"
        },
        {
          key: "black",
          borderColor: '#fff',
          src: "black.jpg"
        },
        {
          key: "grass",
          borderColor: '#000',
          src: "grass.jpg"
        },
        {
          key: "paper",
          borderColor: '#000',
          src: "paper.jpg"
        },
        {
          key: "polygon",
          borderColor: '#000',
          src: "polygon.jpg"
        },
        {
          key: "texttile",
          borderColor: '#000',
          src: "texttile.jpg"
        },
        {
          key: "texture",
          borderColor: '#000',
          src: "texture.jpg"
        },
        {
          key: "wall",
          borderColor: '#000',
          src: "wall.jpg"
        },
        {
          key: "wood",
          borderColor: '#000',
          src: "wood.jpg"
        }
      ],
      background: ""
    };
  },
  created() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].imageSrc = require(`../../assets/img/background/${this.items[i].src}`);
    }
    this.background = localStorage['background']
      ? localStorage['background']
      : 'default';
  },
  methods: {
    setBackground(value, color) {
      this.background = value;
      this.$store.commit("gameSet/setBackground", value);
      this.$store.commit("gameSet/setBackgroundBorder", color);
    }
  }
};
</script>