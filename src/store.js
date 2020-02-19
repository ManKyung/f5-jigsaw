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
        my: []
      },
      mutations: {
        setMy(state, value) {
          let my = state.my.length === 0 ? [] : state.my;
          let result = my.filter(item => {
            return (item.type === value.type && item.category === value.category && item.src === value.src)
          })
          if(result.length === 0){
            my.push(value)
          }
          
          state.my = my
          localStorage['game-my'] = JSON.stringify(state.my);
        },
        // setting sound
        setSound(state, value) {
          state.isSound = value;
        },
        // jigsaw, switch, slider, rotation
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
        }
      }
    }
  }
})
