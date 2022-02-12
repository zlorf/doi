<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      doi2better - easy transformation of DOI to many bibliography formats
    </v-app-bar>

    <v-main>
      <Home/>
    </v-main>
    <v-footer padless>
      <v-col cols="12" class="text-center">
        <a id="kofi" href="https://ko-fi.com/zlorf" target="_blank" style="">
          <img src="https://cdn.ko-fi.com/cdn/kofi2.png?v=3" alt="Buy Me a Coffee / Donate">
        </a>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Home from '@/views/Home.vue';

export default Vue.extend({
  name: 'App',

  components: {
    Home,
  },
});
</script>

<style lang="less">
#kofi {
  img {
    border: 0;
    height: 36px;
    vertical-align: middle;
  }
}
</style>
