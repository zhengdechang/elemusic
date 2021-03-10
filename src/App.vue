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
    // created() {
    //   this.getparams()
    // },
    // methods:{
    //   getparams(){
    //       this.$store.setActiveName = this.$route.params
    //   }
    // }
  }
</script>

<style  lang="scss" scoped>
    @import './assets/css/app.scss';
  .container {
    height: 100%;
  }
  .layout {
    /*min-height: calc(100vh - 80px - 40px);*/
    margin: 0 30px;
  }
 .play-bar{
   z-index: 5;
 }
</style>
