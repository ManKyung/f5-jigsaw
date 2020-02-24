<template>
  <v-ons-page class="mt-5">

    <v-ons-list class="pb-10">
      <v-ons-list-item
        v-for="(item, category) in categories"
        :key="category"
        expandable
        :expanded.sync="item.expand"
        class="category-title"
      >
        <div class="left">
          <img :src="item.data[0].imageSrc" class="list-item__thumbnail" />
        </div>
        <div class="center">
          <span class="list-item__title">{{item.nameKR}}</span>
        </div>
        <div class="expandable-content">
          <v-ons-row>
            <v-ons-col
              class="mx-1 my-1 category-item"
              v-for="(data, index) in item.data"
              :key="index"
            >
              <img
                class="game-img"
                :src="data.imageSrc"
                v-hammer:tap="(e)=> goPage(e, category, data.id, data.src)"
                v-hammer:press="(e)=> goPage(e, category, data.id, data.src)"
                v-hammer:pressup="(e)=> goPage(e, category, data.id, data.src)"
              />
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
.category-title:active {
  transform: translateY(2px);
}
.category-title .list-item__title {
  align-self: flex-start !important;
  margin-top:-3px;
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