<template>
  <div id="app">
    <v-ons-navigator
      id="navigator"
      swipe-target-width="200px"
      :page-stack="pageStack"
      @push-page="pageStack.push($event)"
      @pop-page="popStatck"
    ></v-ons-navigator>
  </div>
</template>

<script>
// import clearTestPage from "@/views/clearTest";
// import backgroundPage from "@/views/settings/Background";
// import settingPage from "@/views/Setting";
// import jigsawPage from "@/views/play/Jigsaw";
// import gamePage from "@/views/play/Game";
// import playOption from "@/views/PlayOption";
// import rotationPage from "@/views/play/Rotation";
// import switchPage from "@/views/play/Switch";
// import clearPage from "@/views/play/Clear";
// import sliderPage from "@/views/play/Slider";
import clickSound from "@/assets/mp3/click.mp3";
import MainPage from "@/views/Main";
// import { initAd, showBanner } from "@/assets/js/admob.js";
export default {
  name: "app",
  data() {
    return {
      pageStack: [MainPage]
      // pageStack: [playOption]
      // pageStack: [clearTestPage]
      // pageStack: [backgroundPage]
      // pageStack: [settingPage]
      // pageStack: [clearPage]
      // pageStack: [gamePage]
      // pageStack: [rotationPage]
      // pageStack: [sliderPage]
    };
  },
  created() {
    this.$ons.disableAutoStyling();
    window.addEventListener("orientationchange", function() {
      if (window.innerHeight > window.innerWidth) {
        document.getElementsByTagName("body").style.transform = "rotate(90deg)";
      }
    });

    this.$store.commit('gameSet/setGameInit');
  },
  mounted() {
    // window.document.addEventListener("click", () => {
    //   this.play();
    // });
    window.document.addEventListener("touchstart", () => {
      this.play();
    }); 
    setTimeout(() => {
      this.$ons.GestureDetector(document.getElementById("navigator")).dispose();
    }, 10);
    document.addEventListener("deviceready", function() {
      initAd();
      // alert(1)
      setTimeout(() => {
        showBanner();
      }, 500);
    });
  },
  methods: {
    popStatck(){
      this.pageStack = [MainPage];
    },
    play() {
      let audio = new Audio(clickSound);
      audio.play();
    }
  }
};
</script>