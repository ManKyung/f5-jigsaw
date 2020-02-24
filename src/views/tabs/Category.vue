<template>
  <v-ons-page class="mt-5">

    <v-ons-list>
      <v-ons-list-item v-for="item in categories" :key="item.nameKR" expandable :expanded.sync="item.expand">
        {{item.nameKR}}
        <div class="expandable-content">
          {{item.data}}
        </div>
      </v-ons-list-item>
    </v-ons-list>

    <!-- <div v-for="(items, category) in categories" :key="category">
      <div class="pl-3 py-5">{{items.nameKR}}</div>
      <v-ons-row>
        <v-ons-col style="width:50%">
          <v-ons-carousel
            swipeable
            overscrollable
            fullscreen
            item-width="48%"
          >
            <v-ons-carousel-item style="width:48%"  v-for="(item, index) in items.data" :key="index" >
              <v-ons-card class="pa-0">
                <img
                  @click="goPage(category, item.id, item.src)"
                  :src="item.imageSrc"
                  class="w-100"
                />
              </v-ons-card>
            </v-ons-carousel-item>
          </v-ons-carousel>
        </v-ons-col>
      </v-ons-row>
    </div> -->

  </v-ons-page>
</template>

<script>
import stage from '@/assets/js/stage.js'
import playOptionPage from '../PlayOption.vue'
export default {
  name: "category",
  data() {
    return {
      cIndex: 0,
      categories: stage,
      isExpanded: false
    };
  },
  created(){
    for(const key in this.categories){
      let data = this.categories[key].data;
      for(let i in data){
        data[i].imageSrc = require(`../../assets/img/${key}/${data[i].src}`);
      }
    }
    console.log(this.categories)
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