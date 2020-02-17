<template>
  <v-ons-page>

    <v-ons-button @click="aa">click</v-ons-button>

    <div class="c-text a pl-0" :class="isClick ? 'on' : ''">C</div>
    <div class="c-text b pl-2" :class="isClick ? 'on' : ''">L</div>
    <div class="c-text c pl-4" :class="isClick ? 'on' : ''">E</div>
    <div class="c-text d pl-6" :class="isClick ? 'on' : ''">A</div>
    <div class="c-text e pl-8" :class="isClick ? 'on' : ''">R</div>

  </v-ons-page>
</template>

<style>

.c-text {
  position:fixed;
  display: inline-block;
  padding-left: 20px;
  bottom: -100px;
}
.c-text.a.on {
  position:fixed;
  display: inline-block;
  bottom:50%;
  transition: 0.3s;
  transition-timing-function: cubic-bezier(0,1.95,.84,.95);
}
.c-text.b.on {
  position:fixed;
  display: inline-block;
  bottom:50%;
  transition: 0.3s;
  transition-timing-function: cubic-bezier(0,2.3,.84,.95);
}
.c-text.c.on {
  position:fixed;
  display: inline-block;
  bottom:50%;
  transition: 0.3s;
  transition-timing-function: cubic-bezier(0,1.3,.84,.95);
}
.c-text.d.on {
  position:fixed;
  display: inline-block;
  bottom:50%;
  transition: 0.3s;
  transition-timing-function: cubic-bezier(0,1.78,.84,.95);
}
.c-text.e.on {
  position:fixed;
  display: inline-block;
  bottom:50%;
  transition: 0.3s;
  transition-timing-function: cubic-bezier(0,1.5,.84,.95);
}

</style>
<script>
export default {
  data() {
    return {
      isClick: false
    }
  },
  methods: {
    aa() {
      this.isClick = !this.isClick
    }
  }
}
</script>