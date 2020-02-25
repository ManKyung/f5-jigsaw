<template>
  <v-ons-page>
    <v-ons-toolbar class="white" style="min-height:64px;">
      <div class="left pl-3 pt-3 fo w-100" style="font-size:32px;">{{title}}</div>
      <div class="right pt-2">
        <v-ons-button modifier="quiet" v-if="title === 'My'" @click="goPage">
          <v-ons-icon icon="ion-ios-settings" style="color:black; font-size:28px"></v-ons-icon>
        </v-ons-button>
      </div>
    </v-ons-toolbar>

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
      activeIndex: 0,
      tabs: [
        {
          icon: "ion-ios-home",
          page: homePage,
          title: "Daily Puzzle",
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
  },
  computed: {
    title() {
      return this.tabs[this.activeIndex].title;
    }
  }
};
</script>