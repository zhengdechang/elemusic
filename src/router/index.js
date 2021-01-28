import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home/Home'
import SongList from "../views/songlist/SongList";
import Singer from "../views/singer/Singer";
import MyMusic from "../views/mymusic/MyMusic";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/song-list',
      name: 'song-list',
      component: SongList
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer
    },
    {
      path: '/my-music',
      name: 'my-music',
      component: MyMusic
    }
  ],
})
