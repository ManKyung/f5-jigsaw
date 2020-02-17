<template>
  <v-ons-page class="mt-5">
    <div v-for="(items, category) in categories" :key="category" :class="category === 'scenery' ? 'pb-10' : ''">
      <div class="pl-3 py-2">{{items.nameKR}}</div>
      <v-ons-row>
        <v-ons-col style="width:50%">
          <v-ons-carousel swipeable overscrollable fullscreen item-width="48%">
            <v-ons-carousel-item style="width:48%" v-for="(item, index) in items.data" :key="index">
              <v-ons-card class="pa-0">
                <img
                  @click="goPage(category, item.id, item.src)"
                  :src="item.imageSrc"
                  class="home-img"
                />
              </v-ons-card>
            </v-ons-carousel-item>
          </v-ons-carousel>
        </v-ons-col>
      </v-ons-row>
    </div>
  </v-ons-page>
</template>

<style>
.home-img {
  border-radius: 8px;
  width: 100%;
}
</style>

<script>
import stage from "@/assets/js/stage.js";
import playOptionPage from "../PlayOption.vue";
export default {
  name: "home",
  data() {
    return {
      cIndex: 0,
      categories: stage
    };
  },
  created() {
    for (const key in this.categories) {
      let data = this.categories[key].data;
      for (let i in data) {
        data[i].imageSrc = require(`../../assets/img/${key}/${data[i].src}`);
      }
    }
  },
  methods: {
    goPage(category, id, src) {
      this.$emit("push-page", {
        ...playOptionPage,
        onsNavigatorProps: {
          category: category,
          id: id,
          src: src
        }
      });
    }
  }
};
</script>