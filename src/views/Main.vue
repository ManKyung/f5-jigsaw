<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="center">{{ title }}</div>
    </v-ons-toolbar>

    <v-ons-tabbar 
      :tabs="tabs"
      :visible="true"
      :index.sync="activeIndex"
      @push-page="pushPage"
    >
    </v-ons-tabbar>
  </v-ons-page>
</template>

<script>
// import stagePage from "./Stage";
import homePage from './tabs/Home'
import categoryPage from './tabs/Category'
import rankPage from './tabs/Rank'
import settingPage from './tabs/Setting'
export default {
  name: "app-main",
  data() {
    return {
      activeIndex: 0,
      tabs: [
        {
          icon: 'ion-ios-home',
          label: 'Home',
          page: homePage,
          props: {
            myProp: 'This is a page prop!'
          },
          key: "homePage"
        },
        {
          icon: 'ion-ios-cube',
          label: 'Category',
          page: categoryPage,
          key: "categoryPage"
        },
        {
          icon: 'ion-ios-trophy',
          label: 'Rank',
          page: rankPage,
          key: "rankPage"
        },
        {
          icon: 'ion-ios-apps',
          label: 'Settings',
          page: settingPage,
          key: "settingPage"
        }
      ]
    };
  },
  mounted() {
  },
  methods: {
    pushPage(obj){
      this.$emit("push-page", obj);
    }
  },
  computed: {
    title() {
      return this.tabs[this.activeIndex].label;
    }
  }
};
</script>