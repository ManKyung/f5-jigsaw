<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-list-header>Sound</v-ons-list-header>
      <v-ons-list-item>
        <div class="center">Turn it on</div>
        <div class="right" >
          <v-ons-switch ></v-ons-switch>
        </div>
      </v-ons-list-item>
    </v-ons-list>
    <br />

    <v-ons-list>
      <v-ons-list-item tappable>Remove AD</v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
export default {
  name: "setting",
  data() {
    return {
      isExpanded: false
    };
  }
};
</script>