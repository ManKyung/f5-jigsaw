<template>
  <v-ons-page class="mt-5">
    <div class="pt-4 mb-8">
      <div class="mb-1 pa-2">
        <div class="btn-group">
          <v-ons-button
            :class="myType === 'todo' ? 'on' : ''"
            v-hammer:tap="(e)=> setMyType(e, 'todo')"
            v-hammer:press="(e)=> setMyType(e, 'todo')"
            v-hammer:pressup="(e)=> setMyType(e, 'todo')"
            v-hammer:pan.start="(e)=> setMyType(e, 'todo')"
          >Todo</v-ons-button>
          <v-ons-button
            :class="myType === 'clear' ? 'on' : ''"
            v-hammer:tap="(e)=> setMyType(e, 'clear')"
            v-hammer:press="(e)=> setMyType(e, 'clear')"
            v-hammer:pressup="(e)=> setMyType(e, 'clear')"
            v-hammer:pan.start="(e)=> setMyType(e, 'clear')"
          >Clear</v-ons-button>
        </div>
      </div>
      <div v-if="myType === 'todo'">
        <v-ons-row
          class="my-tab-item"
          v-for="(item, index) in myItems"
          :key="index"
          :class="index % 2 === 0 ? 'pl-2 pr-1' : 'pl-1 pr-2'"
        >
          <v-ons-col>
            <v-ons-card class="pa-0 ma-0">
              <div>
                <div class="card-inner">
                  <div
                    style="font-size:14px; color:white; padding:4px; text-transform:capitalize;"
                  >{{item.gameType}} / {{item.pCount}}</div>
                </div>
                <img
                  v-hammer:tap="(e)=> goPage(e, item)"
                  v-hammer:press="(e)=> goPage(e, item)"
                  v-hammer:pressup="(e)=> goPage(e, item)"
                  :src="item.imageSrc"
                  class="game-img"
                />
              </div>
            </v-ons-card>
          </v-ons-col>
        </v-ons-row>
      </div>
      <div v-else class="my-clear">
        <div v-for="(items, category) in clearItems" :key="category">
          <v-ons-row v-for="(item, index) in items" :key="index" class="pa-2">
            <v-ons-col>
              <v-ons-card class="pa-0 ma-0">
                <!-- {{item}} -->
                <div style="position: relative;">
                  <div class="card-inner bottom">
                    <div style="font-size:14px; color:white; padding:4px; text-transform:capitalize;">
                      <div class="mb-2 float-left">Category : {{category}}</div>
                      <div class="float-right">
                        <v-ons-icon
                          v-for="i in item.level"
                          :key="i"
                          class="level-star"
                          icon="ion-ios-star"
                        ></v-ons-icon>
                      </div>
                      <div class="clear"></div>
                      <div>
                        <div class="pb-2" style="display: flex">
                          <div style="flex: 1" class="game-type mr-2">Jigsaw</div>
                          <div style="flex: 9" class="game-bar">
                            <v-ons-progress-bar :value="item.jigsaw.length * 10" class="pg-bar"></v-ons-progress-bar>
                          </div>
                        </div>
                        <div class="clear"></div>
                        <div class="pb-2" style="display: flex">
                          <div style="flex: 1" class="game-type mr-2">Switch</div>
                          <div style="flex: 9" class="game-bar">
                            <v-ons-progress-bar :value="item.switch.length * 10" class="pg-bar"></v-ons-progress-bar>
                          </div>
                        </div>
                        <div class="clear"></div>
                        <div class="pb-2" style="display: flex">
                          <div style="flex: 1" class="game-type mr-2">Slider</div>
                          <div style="flex: 9" class="game-bar">
                            <v-ons-progress-bar :value="item.slider.length * 10" class="pg-bar"></v-ons-progress-bar>
                          </div>
                        </div>
                        <div class="clear"></div>
                        <div class="pb-2" style="display: flex">
                          <div style="flex: 1" class="game-type mr-2">Rotate</div>
                          <div style="flex: 9" class="game-bar">
                            <v-ons-progress-bar :value="item.rotate.length * 10" class="pg-bar"></v-ons-progress-bar>
                          </div>
                        </div>
                        <div class="clear"></div>
                      </div>
                    </div>
                  </div>
                  <img :src="require(`../../assets/img/${category}/${item.src}`)" class="game-img" />
                </div>
              </v-ons-card>
            </v-ons-col>
          </v-ons-row>
        </div>
      </div>
    </div>
  </v-ons-page>
</template>

<script>
import gamePage from "@/views/play/Game";
export default {
  name: "setting",
  data() {
    return {
      isExpanded: false,
      myStoreItems: this.$store.state.gameSet.my,
      clearStoreItems: this.$store.state.gameSet.clear,
      myItems: [],
      clearItems: [],
      myType: "todo"
    };
  },
  mounted() {
    setTimeout(() => {
      this.myInit();
      this.clearInit();
    }, 700);
  },
  watch: {
    myStoreItems() {
      this.myInit();
    },
    clearStoreItems() {
      this.clearInit();
    }
  },
  methods: {
    myInit() {
      this.myStoreItems = this.$store.state.gameSet.my;
      let temp = [];
      for (let i = 0; i < this.myStoreItems.length; i++) {
        this.myStoreItems[i].imageSrc = require(`../../assets/img/${this.myStoreItems[i].category}/${this.myStoreItems[i].src}`);
        temp.push(this.myStoreItems[i]);
      }
      this.myItems = temp;
    },
    clearInit(){
      this.clearItems = this.$store.state.gameSet.clear;
      // let temp = [];
      // for(const i in this.clearStoreItems){
      //   console.log(this.clearStoreItems[i])

      // }
      // if(this.clearStoreItems !== undefined){
      //   for (let i = 0; i < this.clearStoreItems.length; i++) {
      //     // this.clearStoreItems[i].imageSrc = require(`../../assets/img/${this.clearStoreItems[i].category}/${this.clearStoreItems[i].src}`);
      //     // temp.push(this.clearStoreItems[i]);
      //   }
      // }
      // this.clearItems = temp;
    },
    setMyType(e, type) {
      if (e.type === "tap" || e.type === "pressup" || e.type === "panstart") {
        this.myType = type;
      }
    },
    goPage(e, item) {
      if (e.type === "tap" || e.type === "pressup") {
        let params = {
          gameType: item.gameType,
          category: item.category,
          id: item.id,
          src: item.src,
          pCount: item.pCount,
          level: item.level,
        };
        this.$emit("push-page", { ...gamePage, onsNavigatorProps: params });
      }
    }
  }
};
</script>