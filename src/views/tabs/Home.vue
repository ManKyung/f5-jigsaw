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
    <div v-for="(items, category) in categories" :key="category">

      
      <div v-if="category === 'bw'">
        <div class="pl-3 py-3 fs-20">Random Puzzle</div>
        <v-ons-row>
          <v-ons-col>
            <v-ons-card class="game-wrap pa-0">
              
              <div class="card-inner">
                <div style="font-size:14px; padding:1px 2px 3px 2px;">
                  <v-ons-icon v-for="i in randomItem2.level" :key="i" class="level-star" icon="ion-ios-star"></v-ons-icon>
                </div>
              </div>
              <img
                v-hammer:tap="(e)=> goPage(e, randomCategory2, randomItem2.id, randomItem2.src, randomItem2.level)"
                v-hammer:press="(e)=> goPage(e, randomCategory2, randomItem2.id, randomItem2.src, randomItem2.level)"
                v-hammer:pressup="(e)=> goPage(e, randomCategory2, randomItem2.id, randomItem2.src, randomItem2.level)"
                :src="require(`../../assets/img/${randomCategory2}/${randomItem2.src}`)"
                class="game-img"
              />
            </v-ons-card>
          </v-ons-col>
        </v-ons-row>
      </div>


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
  
    <div class="pb-10">
      <div class="pl-3 py-3 fs-20">Random Puzzle</div>
      <v-ons-row>
        <v-ons-col>
          <v-ons-card class="game-wrap pa-0">
            
            <div class="card-inner">
              <div style="font-size:14px; padding:1px 2px 3px 2px;">
                <v-ons-icon v-for="i in randomItem1.level" :key="i" class="level-star" icon="ion-ios-star"></v-ons-icon>
              </div>
            </div>
            <img
              v-hammer:tap="(e)=> goPage(e, randomCategory1, randomItem1.id, randomItem1.src, randomItem1.level)"
              v-hammer:press="(e)=> goPage(e, randomCategory1, randomItem1.id, randomItem1.src, randomItem1.level)"
              v-hammer:pressup="(e)=> goPage(e, randomCategory1, randomItem1.id, randomItem1.src, randomItem1.level)"
              :src="require(`../../assets/img/${randomCategory1}/${randomItem1.src}`)"
              class="game-img"
            />
          </v-ons-card>
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
        'color',
        'dessert',
        'pattern',
        'bw',
        'season',
        'tourist',
        'planet',
        'building',
        'scenery',
      ],
      randomCategory: '',
      randomItem: {},
      randomCategory1: '',
      randomItem1: {},
      randomCategory2: '',
      randomItem2: {}
    };
  },
  created() {
    this.randomCategory = this.randomCategories[(new Date()).getDate() % 10];
    let random = this.getRandom(0, this.categories[this.randomCategory].data.length);
    this.randomItem = this.categories[this.randomCategory].data[random];

    this.randomCategory1 = this.randomCategories[(new Date()).getDate() % 9];
    random = this.getRandom(0, this.categories[this.randomCategory1].data.length);
    this.randomItem1 = this.categories[this.randomCategory1].data[random];

    this.randomCategory2 = this.randomCategories[(new Date()).getDate() % 8];
    random = this.getRandom(0, this.categories[this.randomCategory2].data.length);
    this.randomItem2 = this.categories[this.randomCategory2].data[random];
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