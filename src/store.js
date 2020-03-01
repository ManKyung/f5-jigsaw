import Vue from 'vue'
import Vuex from 'vuex'
import stage from "@/assets/js/stage.js";
import bgMusic from "@/assets/mp3/background.mp3";
import clickSound from "@/assets/mp3/click.mp3";
import success from "@/assets/mp3/success.mp3";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    gameSet: {
      namespaced: true,
      state: {
        type: 'jigsaw',
        background: 'default',
        backgroundBorder: '#fff',
        rewardCount: 0,
        isShowAD: true,
        my: [],
        clear: {},
        stage: [],
        removeMode: false,
        removeItems: [],
        bgMusic: new Audio(bgMusic),
        clickSound: new Audio(clickSound),
        successSound: new Audio(success),
        isSound: true,
        isBackgroundMusic: true,
      },
      mutations: {
        setRemoveMode(state, value){
          if(!value) {
            state.removeItems = [];
          }
          state.removeMode = value;
        },
        setRemoveItems(state, value){
          state.removeItems = value;
        },
        doRemoveItems(state){
          let t = state.removeItems.sort().reverse()
          for(const i of t){
            state.my.splice(i, 1)
          }
          localStorage['game-my'] = JSON.stringify(state.my);
        },
        setState(state){
          state.stage = stage;
        },
        removeMy(state, obj) {
          let item = {};
          for(const i in state.my){
            item = state.my[i];
            if(item.gameType === obj.gameType && item.category === obj.category && item.id === obj.id && item.pCount === obj.pCount) {
              state.my.splice(i, 1)
            }
          }
          localStorage['game-my'] = JSON.stringify(state.my);
        },
        setMy(state, obj) {
          let result = state.my.filter(item => {
            return (item.gameType === obj.gameType && item.category === obj.category && item.id === obj.id && item.pCount === obj.pCount)
          })
          if(result.length === 0){
            state.my.push(obj)
            localStorage['game-my'] = JSON.stringify(state.my);
          }
        },
        // setReward Count
        setRewardCount(state) {
          state.rewardCount += 1;
          if(state.rewardCount === 2) {
            state.isShowAD = false;
            state.rewardCount = 0;
            localStorage['isReward'] = (new Date()).getTime() + 3600000; // 1 day
          }
        },
        // setting sound
        setSound(state, value) {
          state.isSound = value;
          if(value) {
            state.clickSound.play();
          }
        },
        // setting success sound
        setSuccessSound(state) {
          state.successSound.play();
        },
        // setting background music
        setBackgroundMusic(state, value) {
          state.isBackgroundMusic = value;
          if(value) {
            state.bgMusic.loop = true;
            state.bgMusic.volume = 0.3;
            state.bgMusic.play();
          } else {
            state.bgMusic.currentTime = 0;
            state.bgMusic.pause();
          }
        },
        // jigsaw, switch, slider, rotate
        setGameType(state, value) {
          state.type = value;
          localStorage['game-type'] = value;
        },
        // wood,
        setBackground(state, value) {
          state.background = value;
          localStorage['background'] = value;
        },
        setBackgroundBorder(state, value) {
          state.backgroundBorder = value;
          localStorage['background-border'] = value;
        },
        setGameInit(state){
          state.type = localStorage['game-type'] === undefined ? 'jigsaw' : localStorage['game-type'];
          state.background = localStorage['background'] === undefined ? 'default' : localStorage['background'];
          state.backgroundBorder = localStorage['background-border'] === undefined ? '#000' : localStorage['background-border'];
          state.my = localStorage['game-my'] === undefined ? [] : JSON.parse(localStorage['game-my']);
          state.clear = localStorage['game-clear'] === undefined ? {} : JSON.parse(localStorage['game-clear']);

          let d = localStorage['isReward'];
          let b = true;
          if(d !== undefined) {
            b = (new Date()).getTime() > Number(d);
            if(b){
              localStorage.removeItem('isReward');
            }
          } 
          state.isShowAD = d === undefined || b ? true : false;
        }
      },
      actions: {
        setGameClear(context, obj) {
          let state = context.state;
          context.commit('removeMy', obj)

          let clear = state.clear;
          if(state.clear[obj.category] === undefined) {
            state.clear[obj.category] = {};
          }

          if(state.clear[obj.category][obj.id] === undefined) {
            state.clear[obj.category][obj.id] = {
              src: obj.src,
              level: obj.level,
              jigsaw: [],
              switch: [],
              slider: [],
              rotate: [],
            }

            state.clear[obj.category][obj.id][obj.gameType].push(obj.pCount)
          } else {
            let t = state.clear[obj.category][obj.id][obj.gameType];
            if(t.indexOf(obj.pCount) === -1){
              state.clear[obj.category][obj.id][obj.gameType].push(obj.pCount)
            }
          }

          clear[obj.category] = state.clear[obj.category];
          localStorage['game-clear'] = JSON.stringify(clear);
        },
      }
    }
  }
})
