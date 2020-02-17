<template>
  <v-ons-page>

    <v-ons-button @click="aa">click</v-ons-button>

    <v-ons-modal style="display: flex;" :visible="modalVisible" @click="modalVisible = false">
      <v-ons-row class="clear-wrap" :class="isClick ? 'on' : ''">
        <v-ons-col class="c-text"></v-ons-col>
        <v-ons-col class="c-text">C</v-ons-col>
        <v-ons-col class="c-text">L</v-ons-col>
        <v-ons-col class="c-text">E</v-ons-col>
        <v-ons-col class="c-text">A</v-ons-col>
        <v-ons-col class="c-text">R</v-ons-col>
        <v-ons-col class="c-text"></v-ons-col>
      </v-ons-row>
      <div class="pt-12 px-4">
        <v-ons-button modifier="large">NEXT</v-ons-button>
      </div>
    </v-ons-modal>

  </v-ons-page>
</template>

<style>
.clear-wrap {
  position:fixed;
  bottom: 0px;
}
.clear-wrap.on {
  position:fixed;
  bottom: 50%;
  transition: 0.3s;
  transition-timing-function: cubic-bezier(0,1.95,.84,.95);
}
.c-text {
  font-size:10vh;
}
/* .c-text.a.on {
  bottom:50%;
  transition: 0.3s;
  transition-timing-function: cubic-bezier(0,1.95,.84,.95);
}
.c-text.b.on {
  bottom:50%;
  transition: 0.3s;
  transition-timing-function: cubic-bezier(0,2.3,.84,.95);
}
.c-text.c.on {
  bottom:50%;
  transition: 0.3s;
  transition-timing-function: cubic-bezier(0,1.3,.84,.95);
}
.c-text.d.on {
  bottom:50%;
  transition: 0.3s;
  transition-timing-function: cubic-bezier(0,1.78,.84,.95);
}
.c-text.e.on {
  bottom:50%;
  transition: 0.3s;
  transition-timing-function: cubic-bezier(0,1.5,.84,.95);
} */

</style>
<script>
export default {
  data() {
    return {
      isClick: false,
      modalVisible: false,
    }
  },
  methods: {
    aa() {
      this.modalVisible = !this.modalVisible
      setTimeout(() => {
        this.isClick = !this.isClick
      }, 100)
    }
  }
}
</script>