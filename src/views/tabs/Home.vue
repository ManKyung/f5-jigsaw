<template>
  <v-ons-page>

    <div v-for="(items, category) in categories" :key="category">
      <div>{{items.nameKR}}</div>
      <v-ons-row>
        <v-ons-col style="width:50%">
          <v-ons-carousel
            swipeable
            overscrollable
            fullscreen
            item-width="48%"
          >
            <v-ons-carousel-item style="width:48%"  v-for="(item, index) in items.data" :key="index" >
              <div class="pa-2" style="text-align: center; font-size: 30px; margin-top: 20px; color: #fff;">
                <img
                  @click="goPage(category, item.id, item.src)"
                  :src="item.imageSrc"
                  class="w-100"
                />
              </div>
            </v-ons-carousel-item>
          </v-ons-carousel>
        </v-ons-col>
      </v-ons-row>
    </div>

  </v-ons-page>
</template>

<style>
img {
  width: 100%;
}
</style>

<script>
import stage from '@/assets/js/stage.js'
import playOptionPage from '../PlayOption.vue'
export default {
  name: "home",
  data() {
    return {
      cIndex: 0,
      categories: stage
    };
  },
  created(){
    for(const key in this.categories){
      let data = this.categories[key].data;
      for(let i in data){
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
          src: src,
        }
      });
    }
  }
};
</script>