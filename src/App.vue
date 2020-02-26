<template>
  <div id="app">
    <v-ons-navigator
      id="navigator"
      swipe-target-width="200px"
      :page-stack="pageStack"
      @push-page="pushStack"
      @pop-page="popStack"
      v-hammer:tap="init"
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
// import backgroundMusic from "@/assets/mp3/bensound-photoalbum.mp3";
import clickSound from "@/assets/mp3/click.mp3";
import MainPage from "@/views/Main";
import { initAd, removeBanner } from "@/assets/js/admob.js";
export default {
  name: "app",
  data() {
    return {
      pageStack: [MainPage],
      // pageStack: [playOption]
      // pageStack: [clearTestPage]
      // pageStack: [backgroundPage]
      // pageStack: [settingPage]
      // pageStack: [clearPage]
      // pageStack: [gamePage],
      // pageStack: [rotationPage]
      // pageStack: [sliderPage]
      isPlayMusic: false,
      backgroundMusic: null
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

    // window.document.addEventListener("click", () => {
    //   if(this.$store.state.gameSet.isSound){
    //     this.play();
    //   }
    //   if(!this.isPlayMusic && this.$store.state.gameSet.isBackgroundMusic){
    //     this.backgroudPlay();
    //   }
    //   if(this.$store.state.gameSet.isBackgroundMusic === false){
    //     this.backgroundMusic.pause();
    //     this.backgroundMusic.currentTime = 0;
    //     this.isPlayMusic = false;
    //   }
    // });
    setTimeout(() => {
      this.$ons.GestureDetector(document.getElementById("navigator")).dispose();
    }, 10);
    document.addEventListener("deviceready", function() {
      initAd();
    });
  },
  methods: {
    init(){
      // if(this.$store.state.gameSet.isSound){
      //   this.play();
      // }
      // if(!this.isPlayMusic && this.$store.state.gameSet.isBackgroundMusic){
      //   this.backgroudPlay();
      // }
      // if(this.$store.state.gameSet.isBackgroundMusic === false){
      //   this.backgroundMusic.pause();
      //   this.backgroundMusic.currentTime = 0;
      //   this.isPlayMusic = false;
      // }
    },
    pushStack(e){
      this.pageStack.push(e)
    },
    popStack(){
      this.pageStack = [MainPage];
      removeBanner();
    },
    play() {
      let audio = new Audio(clickSound);
      audio.play();
    },
    backgroudPlay() {
      // this.backgroundMusic = new Audio(backgroundMusic);
      // this.backgroundMusic.loop = true;
      // this.backgroundMusic.volume = 0.3;
      // this.backgroundMusic.play();
      // this.isPlayMusic = true;
    }
  }
};
</script>