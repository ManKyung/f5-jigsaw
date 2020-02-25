<template>
  <v-ons-page class="mt-5">

    <v-ons-list class="pb-10">
      <v-ons-list-item
        v-for="(items, category) in categories"
        :key="category"
        expandable
        :expanded.sync="items.expand"
        class="category-title"
      >
        <div class="left">
          <img :src="items.data[0].imageSrc" class="list-item__thumbnail" />
        </div>
        <div class="center">
          <span class="list-item__title">{{items.nameKR}}</span>
        </div>
        <div class="expandable-content">
          <v-ons-row>
            <v-ons-col
              class="category-item"
              v-for="(item, index) in items.data"
              :key="index"
            >
              <v-ons-card class="game-wrap pa-0" style="margin: 4px">
                <div class="card-inner">
                  <div style="font-size:14px; padding:2px;">
                    <v-ons-icon v-for="i in item.level" :key="i" class="level-star" icon="ion-ios-star"></v-ons-icon>
                  </div>
                </div>
                <img
                  v-hammer:tap="(e)=> goPage(e, category, item.id, item.src)"
                  v-hammer:press="(e)=> goPage(e, category, item.id, item.src)"
                  v-hammer:pressup="(e)=> goPage(e, category, item.id, item.src)"
                  :src="item.imageSrc"
                  class="game-img"
                />
              </v-ons-card>
              <!-- <img
                class="game-img"
                :src="data.imageSrc"
                v-hammer:tap="(e)=> goPage(e, category, data.id, data.src)"
                v-hammer:press="(e)=> goPage(e, category, data.id, data.src)"
                v-hammer:pressup="(e)=> goPage(e, category, data.id, data.src)"
              /> -->
            </v-ons-col>
          </v-ons-row>
        </div>
      </v-ons-list-item>
    </v-ons-list>

  </v-ons-page>
</template>

<style>
.category-item {
  flex: 1 0 45%; /* explanation below */
}
.list-item__top:active {
  transform: translateY(2px);
}
.category-title .list-item__title {
  align-self: center !important;
  /* margin-top:3px; */
}
.list,
.list-item--expandable {
  background-image: none;
}
</style>

<script>
import stage from "@/assets/js/stage.js";
import playOptionPage from "../PlayOption.vue";
export default {
  name: "category",
  data() {
    return {
      cIndex: 0,
      categories: stage,
      isExpanded: false
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
    goPage(e, category, id, src) {
      if (e.type === "tap" || e.type === "pressup") {
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
  }
};
</script>