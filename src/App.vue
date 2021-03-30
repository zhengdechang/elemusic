<template>
  <div id="app" class="container">
    <song-audio/>
    <the-header/>
    <div class="layout">
      <router-view/>
    </div>
    <song-audio/>
    <the-aside></the-aside>
    <div class="play-bar">
      <play-bar></play-bar>
    </div>
    <scroll-top></scroll-top>
    <the-footer></the-footer>
  </div>
</template>

<script>
  import TheHeader from "./components/header/TheHeader";
  import ScrollTop from "./components/common/ScrollTop";
  import TheFooter from "./components/footer/TheFooter";
  import SongAudio from "./components/common/SongAudio";
  import PlayBar from   "./components/common/PlayBar";
  import TheAside from "./components/common/TheAside";

  export default {
    name: 'App',
    components: {
      TheAside,
      TheFooter,
      ScrollTop,
      TheHeader,
      SongAudio,
      PlayBar
    },
  }
</script>

<style  lang="scss" scoped>
@import './assets/css/app.scss';

</style>
