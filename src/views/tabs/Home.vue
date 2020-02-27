<template>
  <v-ons-page class="mt-5">
    <div>
      <div class="pl-3 py-3 fs-20">Today Puzzle</div>
      <v-ons-row>
        <v-ons-col>
          <v-ons-card class="game-wrap pa-0">
            
            <div class="card-inner">
              <div style="font-size:14px; padding:1px 2px 3px 2px;">
                <v-ons-icon v-for="i in randomItem.level" :key="i" class="level-star" icon="ion-ios-star"></v-ons-icon>
              </div>
            </div>
            <img
              v-hammer:tap="(e)=> goPage(e, randomCategory, randomItem.id, randomItem.src, randomItem.level)"
              v-hammer:press="(e)=> goPage(e, randomCategory, randomItem.id, randomItem.src, randomItem.level)"
              v-hammer:pressup="(e)=> goPage(e, randomCategory, randomItem.id, randomItem.src, randomItem.level)"
              :src="require(`../../assets/img/${randomCategory}/${randomItem.src}`)"
              class="game-img"
            />
          </v-ons-card>
        </v-ons-col>
      </v-ons-row>
    </div>
    <div v-for="(items, category) in categories" :key="category" :class="category === 'scenery' ? 'pb-10' : ''">
      <div class="pl-3 py-3 fs-20">{{items.nameKR}}</div>
      <v-ons-row>
        <v-ons-col style="width:50%">
          <v-ons-carousel swipeable overscrollable fullscreen item-width="48%" auto-scroll-ratio="0.1">
            <v-ons-carousel-item style="width:48%" v-for="(item, index) in items.data" :key="index">
              <v-ons-card class="game-wrap pa-0">
                
                <div class="card-inner">
                  <div style="font-size:14px; padding:1px 2px 3px 2px;">
                    <v-ons-icon v-for="i in item.level" :key="i" class="level-star" icon="ion-ios-star"></v-ons-icon>
                  </div>
                </div>
                <img
                  v-hammer:tap="(e)=> goPage(e, category, item.id, item.src, item.level)"
                  v-hammer:press="(e)=> goPage(e, category, item.id, item.src, item.level)"
                  v-hammer:pressup="(e)=> goPage(e, category, item.id, item.src, item.level)"
                  :src="require(`../../assets/img/${category}/${item.src}`)"
                  class="game-img"
                />
              </v-ons-card>
            </v-ons-carousel-item>
          </v-ons-carousel>
        </v-ons-col>
      </v-ons-row>
    </div>
  </v-ons-page>
</template>

<script>
import playOptionPage from "../PlayOption.vue";
export default {
  name: "home",
  data() {
    return {
      cIndex: 0,
      categories: this.$store.state.gameSet.stage,
      randomCategories: [
        'cats',
        'dogs',
        'season',
        'color',
        'pattern',
        'bw',
        'tourist',
        'planet',
        'building',
        'scenery',
      ],
      randomCategory: '',
      randomItem: {}
    };
  },
  created() {
    this.randomCategory = this.randomCategories[(new Date()).getDate() % 10];
    let random = this.getRandom(0, this.categories[this.randomCategory].data.length);
    this.randomItem = this.categories[this.randomCategory].data[random];
  },
  methods: {
    getRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    goPage(e, category, id, src, level) {
      if(e.type === 'tap' || e.type === 'pressup'){
        this.$emit("push-page", {
          ...playOptionPage,
          onsNavigatorProps: {
            category: category,
            id: id,
            src: src,
            level: level,
          }
        });
      }
    }
  }
};
</script>