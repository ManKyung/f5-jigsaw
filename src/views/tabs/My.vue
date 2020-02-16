<template>
  <v-ons-page class="mt-5">

    <div class="pt-4">
      <v-ons-row class="my-tab-item pt-1" 
        v-for="(item, index) in myItems" :key="index"
        :class="index % 2 === 0 ? 'pl-2 pr-1' : 'pl-1 pr-2'"
      >
        <v-ons-col>
          <v-ons-card class="pa-0 ma-0">
            <img
              @click="goPage(item)"
              :src="item.imageSrc"
              class="home-img"
            />
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
import jigsawPage from '@/views/Play/Jigsaw.vue'
import sliderPage from '@/views/Play/Slider.vue'
import switchPage from '@/views/Play/Switch.vue'
import rotationPage from '@/views/Play/Rotation.vue'
export default {
  name: "setting",
  data() {
    return {
      isExpanded: false,
      items: JSON.parse(this.$store.state.gameSet.my),
      myItems: []
    };
  },
  mounted(){
    setTimeout(() => {
      let temp = [];
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].imageSrc = require(`../../assets/img/${this.items[i].category}/${this.items[i].src}`);
        temp.push(this.items[i])
      }
      this.myItems = temp;
    }, 300)
  },
  methods: {
    goPage(item) {
      let params = {
        type: item.gameType,
        category: item.category,
        id: item.id,
        src: item.src,
        pCount: item.pieceCount,
      }
      
      if(item.gameType === 'jigsaw'){
        this.$emit("push-page", { ...jigsawPage, onsNavigatorProps: params });
      } else if(item.gameType === 'slider'){
        this.$emit("push-page", { ...sliderPage, onsNavigatorProps: params });
      } else if(item.gameType === 'switch'){
        this.$emit("push-page", { ...switchPage, onsNavigatorProps: params });
      } else if(item.gameType === 'rotation'){
        this.$emit("push-page", { ...rotationPage, onsNavigatorProps: params });
      }
    },
  }
};
</script>