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
        <div v-if="myItems.length > 0">
          <v-ons-row
            class="my-tab-item"
            v-for="(item, index) in myItems"
            :key="index"
            :class="index % 2 === 0 ? 'pl-2 pr-1' : 'pl-1 pr-2'"
          >
            <v-ons-col>
              <v-ons-card class="game-wrap pa-0 ma-0">
                <div v-if="!$store.state.gameSet.removeMode">
                  <div class="card-inner">
                    <div
                      style="font-size:14px; color:white; padding:4px; text-transform:capitalize;"
                    >{{item.gameType}} / {{item.pCount}}</div>
                  </div>
                  <img
                    v-hammer:tap="(e)=> goPage(e, item)"
                    v-hammer:press="(e)=> doRemove(e, index)"
                    :src="item.imageSrc"
                    class="game-img"
                  />
                </div>
                <div v-else>
                  <div class="card-inner check">
                      <v-ons-icon
                      v-if="removeItems.indexOf(index) !== -1" 
                        icon="ion-ios-checkmark-circle-outline"
                        class="fs-24"
                      ></v-ons-icon>
                  </div>
                  <img
                    v-hammer:tap="(e)=> setRemoveItem(e, index)"
                    v-hammer:pan.start="(e)=> setRemoveItem(e, index)"
                    :src="item.imageSrc"
                    class="game-img remove"
                  />
                </div>
              </v-ons-card>
            </v-ons-col>
          </v-ons-row>
        </div>
        <div v-else>
          <v-ons-card class="empty-card">
            <div class="title">
              You have to play the game first! <v-ons-icon class="ml-2" icon="md-puzzle-piece"></v-ons-icon>
            </div>
          </v-ons-card>
        </div>
      </div>
      <div v-else class="my-clear">
        <div v-if="clearItems !== undefined || clearItems !== {}">
          <div v-for="(items, category) in clearItems" :key="category">
            <v-ons-row v-for="(item, index) in items" :key="index" class="pa-2">
              <v-ons-col>
                <v-ons-card class="pa-0 ma-0">
                  <div style="position: relative;">
                    <div class="card-inner bottom">
                      <div style="font-size:14px; color:white; padding:4px; text-transform:capitalize;">
                        <div class="mb-2 float-left">Category : {{category === 'bw' ? 'Black & White' : category}}</div>
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
        
        <div v-else>
          <v-ons-card class="empty-card">
            <div class="title">
              Please clear the game first! <v-ons-icon class="ml-2" icon="ion-ios-alert"></v-ons-icon>
            </div>
          </v-ons-card>
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
      myType: "todo",
      removeMode: false,
      removeItems: [],
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
    },
    setMyType(e, type) {
      if (e.type === "tap" || e.type === "pressup" || e.type === "panstart") {
        this.myType = type;
      }
    },
    goPage(e, item) {
      if (e.type === "tap" || e.type === "panstart") {
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
    },
    doRemove(e, i) {
      if (e.type === "tap" || e.type === "press") {
        this.removeItems = [];
        this.$store.state.gameSet.removeMode = true;
        this.removeItems.push(i)
      }
    },
    setRemoveItem(e, i){
      if (e.type === "tap" || e.type === "panstart") {
        let index = this.removeItems.indexOf(i);
        if(index === -1){
          this.removeItems.push(i)
        } else {
          this.removeItems.splice(index, 1)
        }
        this.$store.commit('gameSet/setRemoveItems', this.removeItems);
      }
    }
  }
};
</script>