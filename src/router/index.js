import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home/Home'
import SongList from "../views/songlist/SongList";
import Singer from "../views/singer/Singer";
import MyMusic from "../views/mymusic/MyMusic";
import Search from "../components/header/search/Search";
import Lyric from "../views/lyric/Lyric";
import signIn from "../views/login/signIn";
import loginIn from "../views/login/loginIn";
import Setting from "../components/header/Setting";
import SingerAlbum from "../components/common/album/SingerAlbum";
import SongListAlbum from "../components/common/album/SongListAlbum";
import detail from "../views/songlist/detail";
import Artist from "../views/singer/Artist";
import My from "../views/mymusic/My";
import Song from "../views/songs/Song";

// const originalPush = Router.prototype.push

// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

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
      path: '/cloudsearch',
      name: 'cloudsearch',
      component:Search
    },
    {
      path: '/lyric',
      name: 'lyric',
      component:Lyric
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component:signIn
    },
    {
      path: '/login-in',
      name: 'login-in',
      component:loginIn
    },
    {
      path: '/setting',
      name: 'setting',
      component:Setting
    },
    {
      path: '/singer-album/:id',
      name: 'singer-album',
      component:SingerAlbum
    },
    {
      path: '/song-list-album/:id',
      name: 'song-list-album',
      component:SongListAlbum
    },
    {
      path: '/song-list/detail',
      name: 'song-list-detail',
      component:detail
    },
    {
      path: '/artist',
      name: 'artist',
      component:Artist
    },
    {
      path: '/my',
      name: 'my',
      component:My,
      children:[
        {
        path: '/my/mymusic',
        name: 'mymusic',
        component: MyMusic
        },
      ]
    },
    {
      path:'/song',
      name:'song',
      component:Song
    }
  ]
})
