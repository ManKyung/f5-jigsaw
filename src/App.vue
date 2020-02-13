<template>
  <div id="app">
    <v-ons-navigator
      id="navigator"
      swipe-target-width="200px"
      :page-stack="pageStack"
      @push-page="pageStack.push($event)"
    ></v-ons-navigator>
  </div>
</template>

<script>
// import settingPage from "@/views/Setting";
// import PlayPage from "@/views/Play";
// import clickSound from "@/assets/mp3/click.mp3";
import MainPage from "@/views/Main";
// import { initAd, showBanner } from "@/api/admob.js";
export default {
  name: "app",
  data() {
    return {
      pageStack: [MainPage]
      // pageStack: [settingPage]
      // pageStack: [PlayPage]
    };
  },
  created() {
    this.$ons.disableAutoStyling();
    window.addEventListener("orientationchange", function() {
      if (window.innerHeight > window.innerWidth) {
        document.getElementsByTagName("body").style.transform = "rotate(90deg)";
      }
    });
  },
  mounted() {
    // window.document.addEventListener("click", () => {
    //   this.play();
    // });
    // window.document.addEventListener("touchstart", () => {
    //   this.play();
    // }); 
    setTimeout(() => {
      this.$ons.GestureDetector(document.getElementById("navigator")).dispose();
    }, 10);
    document.addEventListener("deviceready", function() {
      // initAd();
      // setTimeout(() => {
      //   showBanner();
      // }, 500);
    });
  },
  methods: {
    play() {
      console.log('click')
      let audio = new Audio(clickSound);
      audio.play();
    }
  }
};
</script>