import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    gameSet: {
      namespaced: true,
      state: {
        type: 'jigsaw',
        background: 'default',
        backgroundBorder: '#fff',
        isSound: true,
        isBackgroundMusic: true,
        my: [],
        clear: {}
      },
      mutations: {
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
        // setting sound
        setSound(state, value) {
          state.isSound = value;
        },
        // setting background music
        setBackgroundMusic(state, value) {
          state.isBackgroundMusic = value;
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
