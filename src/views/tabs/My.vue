<template>
  <v-ons-page class="mt-5">

    <div>
      로컬스토리지 저장한거 가져오기
    </div>

  </v-ons-page>
</template>

<script>
export default {
  name: "setting",
  data() {
    return {
      isExpanded: false
    };
  },
  methods: {
    goPage() {
      this.$emit("push-page", {
        ...settingPage,
        onsNavigatorProps: {}
      });
    },
  }
};
</script>