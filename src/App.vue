<template>
  <div id="app">
    <the-header/>
    <router-view class="music-content"/>
    <scroll-top></scroll-top>
    <the-footer></the-footer>
  </div>
</template>

<script>
  import TheHeader from "./components/header/TheHeader";
  import ScrollTop from "./components/common/ScrollTop";
  import TheFooter from "./components/footer/TheFooter";
  export default {
    name: 'App',
    components: {
      TheFooter,
      ScrollTop,
        TheHeader,

    },
  }
</script>

<style  lang="scss" scoped>
  @import './assets/css/app.scss';
</style>
