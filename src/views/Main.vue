<template>
  <v-ons-page>
    <v-ons-toolbar class="white" style="min-height:64px;">
      <div class="left pl-3 pt-3 fo w-100" style="font-size:32px;">{{title}}</div>
      <div class="right pt-2">
        <v-ons-button modifier="quiet" v-if="title === 'My' && this.$store.state.gameSet.removeMode" @click="setRemoveMode">
          <v-ons-icon icon="ion-ios-undo" style="color:black; font-size:28px"></v-ons-icon>
        </v-ons-button>
        <v-ons-button modifier="quiet" v-if="title === 'My' && this.$store.state.gameSet.removeMode" @click="doRemove" class="mr-2">
          <v-ons-icon icon="ion-ios-trash" style="color:black; font-size:28px"></v-ons-icon>
        </v-ons-button>
        <v-ons-button modifier="quiet" v-if="title === 'My' && !this.$store.state.gameSet.removeMode" @click="goPage" class="mr-2">
          <v-ons-icon icon="ion-ios-settings" style="color:black; font-size:28px"></v-ons-icon>
        </v-ons-button>
      </div>
    </v-ons-toolbar>


    <v-ons-modal v-if="isGuide === undefined" :visible="isVisbile">
      <v-ons-carousel fullscreen swipeable auto-scroll overscrollable
        auto-scroll-ratio="0.1"
        :index.sync="carouselIndex"
      >
        <v-ons-carousel-item v-for="(value, key) in items" :key="key">
          <div style="text-align: center; font-size: 30px; margin-top: 20px; color: #fff;">
            {{value}}
          </div>
          <v-ons-card>
            <img :src="require(`../assets/img/gameset/${value}.jpg`)" class="w-100" />
          </v-ons-card>
          <div class="mt-8" v-if="value === 'rotate'">
            <v-ons-button
              class="pa-3"
              style="font-family: baemin"
              v-hammer:tap="setGuide"
              v-hammer:pan.start="setGuide">Start</v-ons-button>
          </div>
        </v-ons-carousel-item>
      </v-ons-carousel>

      <div :style="dots">
        <span :index="dotIndex - 1" v-for="dotIndex in Object.keys(items).length" :key="dotIndex" style="cursor: pointer" @click="carouselIndex = dotIndex - 1">
          {{ carouselIndex === dotIndex - 1 ? '\u25CF' : '\u25CB' }}
        </span>
      </div>
    </v-ons-modal>

    <v-ons-tabbar :tabs="tabs" :visible="true" :index.sync="activeIndex" @push-page="pushPage"></v-ons-tabbar>
  </v-ons-page>
</template>

<script>
// import stagePage from "./Stage";
import settingPage from '@/views/Setting';
import homePage from "./tabs/Home";
import categoryPage from "./tabs/Category";
import myPage from "./tabs/My";
export default {
  name: "app-main",
  data() {
    return {
      carouselIndex: 0,
      items: ['jigsaw', 'switch', 'slider', 'rotate'],
      isGuide: localStorage['isGuide'],
      isVisbile: true,
      dots: {
        textAlign: 'center',
        fontSize: '30px',
        color: '#fff',
        position: 'absolute',
        bottom: '40px',
        left: 0,
        right: 0
      },
      activeIndex: 0,
      tabs: [
        {
          icon: "ion-ios-home",
          title: "Daily Puzzle",
          page: homePage,
          key: "homePage"
        },
        {
          icon: "ion-ios-cube",
          title: "Category",
          page: categoryPage,
          key: "categoryPage"
        },
        {
          icon: "ion-ios-person",
          title: "My",
          page: myPage,
          key: "myPage"
        },
      ]
    };
  },
  methods: {
    pushPage(obj) {
      this.$emit("push-page", obj);
    },
    goPage() {
      this.$emit("push-page", {
        ...settingPage,
        onsNavigatorProps: {}
      });
    },
    setGuide(e){
      if(e.type === 'tap' || e.type === 'panstart'){
        localStorage['isGuide'] = true;
        this.isVisbile = false;
      }
    },
    setRemoveMode(){
      this.$store.commit('gameSet/setRemoveMode', false);
    },
    doRemove(){
      this.$store.commit('gameSet/doRemoveItems');
      this.setRemoveMode();
    }
  },
  computed: {
    title() {
      return this.tabs[this.activeIndex].title;
    }
  }
};
</script>