<template>
  <v-ons-page class="mt-5">

    <div class="pt-4">
      <v-ons-row class="my-tab-item pt-1" 
        v-for="(item, index) in myItems" :key="index"
        :class="index % 2 === 0 ? 'pl-2 pr-1' : 'pl-1 pr-2'"
      >
        <v-ons-col>
          <v-ons-card class="pa-0 ma-0">
            <div>
              <div style="position: absolute; background: rgba(0,0,0, 0.6); margin: 5px;">
                <div style="font-size:2vh; color:white; padding:0 4px 4px 4px; text-transform:capitalize;">{{item.gameType}} / {{item.pCount}}</div>
              </div>
            <img
              v-hammer:tap="(e)=> goPage(e, item)"
              v-hammer:press="(e)=> goPage(e, item)"
              v-hammer:pressup="(e)=> goPage(e, item)"
              :src="item.imageSrc"
              class="game-img"
            />
            </div>
          </v-ons-card>
        </v-ons-col>
      </v-ons-row>
    </div>
  </v-ons-page>
</template>

<style scoped>
.my-tab-item {
  width:50% !important;
  display:inline-block !important;
}
</style>

<script>
import gamePage from '@/views/play/Game';
export default {
  name: "setting",
  data() {
    return {
      isExpanded: false,
      items: this.$store.state.gameSet.my,
      myItems: []
    };
  },
  mounted(){
    setTimeout(() => {
      this.myInit()
    }, 300)
  },
  watch: {
    items() {
      console.log(123123)
      this.myInit()
    }
  },
  methods: {
    myInit(){
      let myItems = this.$store.state.gameSet.my;
      console.log(myItems)
      myItems = myItems.length > 0 ? myItems : '';
      console.log(myItems)
      
      if(myItems !== ''){
        let temp = [];
        this.myItems = [];
        for (let i = 0; i < myItems.length; i++) {
          myItems[i].imageSrc = require(`../../assets/img/${myItems[i].category}/${myItems[i].src}`);
          temp.push(myItems[i])
        }
        this.myItems = temp;
      }
    },
    goPage(e, item) {
      if(e.type === 'tap' || e.type === 'pressup'){
        let params = {
          gameType: item.gameType,
          category: item.category,
          id: item.id,
          src: item.src,
          pCount: item.pieceCount,
        }
        this.$emit("push-page", { ...gamePage, onsNavigatorProps: params });
      }
    },
  }
};
</script>