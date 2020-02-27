<template>
  <div id="app">
    <v-ons-navigator
      id="navigator"
      swipe-target-width="200px"
      :page-stack="pageStack"
      @push-page="pushStack"
      @pop-page="popStack"
      @deviceBackButton="deviceBack"
      v-hammer:tap="init"
    ></v-ons-navigator>

    <v-ons-modal :visible="closeVisible" @click="closeVisible = false">
      <div class="close-modal-wrap" :class="isModalOn ? 'on' : ''">
        <v-ons-card>
          <div class="black--text">Would you please leave a review<br/>before you exit?</div>
          <div class="pt-8 px-4">
            <v-ons-button modifier="quiet" class="text-center" 
            v-hammer:tap="(e)=> goClose(e, 'cancel')"
            v-hammer:press="(e)=> goClose(e, 'cancel')"
            v-hammer:pressup="(e)=> goClose(e, 'cancel')"
            v-hammer:pan.start="(e)=> goClose(e, 'cancel')">Cancel</v-ons-button>
            <v-ons-button class="text-center"
            v-hammer:tap="(e)=> goClose(e, 'No')"
            v-hammer:press="(e)=> goClose(e, 'No')"
            v-hammer:pressup="(e)=> goClose(e, 'No')"
            v-hammer:pan.start="(e)=> goClose(e, 'No')">No, Thanks</v-ons-button>
            <v-ons-button class="text-center"
            v-hammer:tap="(e)=> goClose(e, 'OK')"
            v-hammer:press="(e)=> goClose(e, 'OK')"
            v-hammer:pressup="(e)=> goClose(e, 'OK')"
            v-hammer:pan.start="(e)=> goClose(e, 'OK')">OK</v-ons-button>
          </div>
        </v-ons-card>
      </div>
    </v-ons-modal>
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
import MainPage from "@/views/Main";
import { initAd, removeBanner } from "@/assets/js/admob.js";
export default {
  name: "app",
  data() {
    return {
      pageStack: [MainPage],
      closeVisible: false,
      isModalOn: false,
    };
  },
  created() {
    this.$ons.disableAutoStyling();
    window.addEventListener("orientationchange", function() {
      if (window.innerHeight > window.innerWidth) {
        document.getElementsByTagName("body").style.transform = "rotate(90deg)";
      }
    });

    this.$store.commit('gameSet/setState'); // Stage 로딩
    this.$store.commit('gameSet/setGameInit');
  },
  mounted() {
    setTimeout(() => {
      this.$ons.GestureDetector(document.getElementById("navigator")).dispose();
    }, 10);
    document.addEventListener("deviceready", function() {
      initAd();
    });
  },
  methods: {
    goClose(e, title){
      if(e.type === 'tap' || e.type === 'pressup' || e.type === 'panstart'){
        if (title === "cancel") {
          setTimeout(() => {
            this.isModalOn = false;
          }, 100)
          setTimeout(() => {
            this.closeVisible = false;
          }, 400)
        } else if(title === "No") {
          navigator.app.exitApp();
        } else if(title === "OK") {
          location.href =
            "https://play.google.com/store/apps/details?id=com.f5game.jigsaw";
        }
      }

    },
    init(){
      if(this.$store.state.gameSet.isSound){
        this.$store.commit('gameSet/setSound', true);
      }
      if(this.$store.state.gameSet.isBackgroundMusic){
        this.$store.commit('gameSet/setBackgroundMusic', true);
      }
    },
    pushStack(e){
      this.pageStack.push(e)
    },
    popStack(){
      this.pageStack = [MainPage];
      removeBanner();
    },
    deviceBack(e){
      if(this.pageStack.length === 1){
        e.preventDefault();
        setTimeout(() => {
          this.isModalOn = true;
        }, 100)
        setTimeout(() => {
          this.closeVisible = true;
        }, 400)
      } else {
        setTimeout(() => {
          removeBanner();
        }, 500)
      }
    }
  }
};
</script>