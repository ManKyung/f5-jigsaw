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
        clear: []
      },
      mutations: {
        setMy(state, obj) {
          let result = state.my.filter(item => {
            return (item.gameType === obj.gameType && item.category === obj.category && item.id === obj.id && item.pCount === obj.pCount)
          })
          if(result.length === 0){
            state.my.push(obj)
          }
          
          localStorage['game-my'] = JSON.stringify(state.my);
        },
        // game clear
        setGameClear(state, obj) {
          // var name = 'clearDB';
          // var version = 1;
          // var db = null;
          // // IDBOpenDBRequest
          // var request = indexedDB.open(name, version);
          
          if(state.clear[obj.category] === undefined) {
            state.clear[obj.category] = {};
          }

          if(state.clear[obj.category][`${obj.id}`] === undefined) {
            state.clear[obj.category][`${obj.id}`] = {
              src: obj.src,
              level: obj.level,
              jigsaw: [],
              switch: [],
              slider: [],
              rotate: [],
            }

            state.clear[obj.category][`${obj.id}`][obj.gameType].push(obj.pCount)
          } else {
            let t = state.clear[obj.category][`${obj.id}`][obj.gameType];
            if(t.indexOf(obj.pCount) === -1){
              state.clear[obj.category][`${obj.id}`][obj.gameType].push(obj.pCount)
            }
          }

          console.log(state.clear)
          // localStorage['game-clear'] = state.clear;

          // request.onupgradeneeded = function(event) { 
          //   console.log(123)
          //   // IDBDatabase
          //   db = request.result;
          //   var key = "id";
          //   var name = 'clear';
          //   // IDBObjectStore
          //   var store = db.createObjectStore(name, { keyPath: key });
          //   var indexName = 'dby_name';
          //   var keyPath = 'name';
          //   // IDBIndex
          //   var index = store.createIndex(indexName, keyPath);
          //   var obj = {
          //     [key]: 2,
          //     [keyPath]: "name"
          //   }
          //   store.put(obj);
          // };
          // request.onsuccess = function(event) {
          //   console.log(234)
          //   db = request.result;
          //   // IDBTransaction
          //   var transaction = db.transaction(['clear'], "readonly");
          //   // IDBObjectStore
          //   var objectStore = transaction.objectStore('clear');
          //   // IDBRequest
          //   var cursor = objectStore.openCursor();
          //     cursor.onsuccess = function(event) {
          //       // IDBCursorWithValue
          //       var cursor = event.target.result;
          //       if ( cursor ) {
          //         // {id: 1, name: "name"}
          //         console.log(cursor.value)
          //         cursor.continue();
          //       } else {
          //         console.log('end');
          //       }
          //     };
          // };

          // let result = state.clear.filter(item => {
          //   return (item.gameType === value.gameType && item.category === value.category && item.id === value.id && item.pCount === value.pCount)
          // })
          // if(result.length === 0){
          //   state.clear.push(value)
          // }
          // localStorage['game-clear'] = JSON.stringify(state.clear);

          /*
          category: {
            []
            id : {
              src: 1.jpg,
              level: 3,
              jigsaw : [3,4,5,6,7,8,9,10,11,12],
              switch : [3,4,5,6,7,8,9,10,11,12],
              slider : [3,4,5,6,7,8,9,10,11,12],
              rotate : [3,4,5,6,7,8,9,10,11,12]
            }
          }
          */
          // state.type = value;
          // localStorage['game-clear'] = value;
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
          state.clear = localStorage['game-clear'] === undefined ? [] : JSON.parse(localStorage['game-clear']);
        }
      }
    }
  }
})
