<template>
  <v-ons-page>
    <div>동물</div>
    <v-ons-row>
      <v-ons-col style="width:50%">
        <v-ons-carousel
          swipeable
          auto-scroll
          overscrollable
          fullscreen
          item-width="48%"
          :index.sync="carouse2lIndex"
        >
          <v-ons-carousel-item style="width:48%" v-for="i in [1,2,3,4,5]" :key="i">
            <div style="text-align: center; font-size: 30px; margin-top: 20px; color: #fff;">
              <img
              @click="goPage"
                src="https://search.pstatic.net/common/?src=http%3A%2F%2Fimgnews.naver.net%2Fimage%2F081%2F2018%2F04%2F14%2F0002907850_001_20180414213605545.jpg&type=b400"
              />
            </div>
          </v-ons-carousel-item>
        </v-ons-carousel>
      </v-ons-col>
    </v-ons-row>
  </v-ons-page>
</template>

<style>
img {
  width: 100%;
}
</style>

<script>
import playPage from '../Play'
export default {
  name: "home",
  data() {
    return {
      carouselIndex: 0,
      carouse2lIndex: 0,
      carouse3lIndex: 0
    };
  },
  methods: {
    goPage() {
      this.$emit("push-page", {
        ...playPage,
        onsNavigatorProps: {
          stage: 23,
          id: 1
        }
      });
    }
  }
};
</script>