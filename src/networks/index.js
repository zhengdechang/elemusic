import {get} from "./http";
import Axios from "axios";

// Axios.defaults.withCredentials = true;  //允许跨域
// //Content-Type 响应头
// Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

//============歌手相关================
//查询歌手
export const getAllSinger =() => get(`/top/playlist/highquality`);
//============歌单相关================
//查询歌单
export const getAllSongList =() => get(`/top/playlist/highquality`);

//============歌曲相关================
//模糊查询
export const likeSongofName =(keywords) => get(`/cloudsearch?keywords= ${keywords}`);

//根据歌曲id查询歌曲对象
export const songOfSongId =(id) => get(`song/detail?songId=${id}`);

//id相对应的歌词
export const songLyric =(id) => get(`/lyric?id=${id}`);
//根据keywords相应的id获取音乐url
export const songUrl =(id) => get(`/song/url?id=${id}`);

//下载音乐
export const download = (url) => Axios({
    method:'get',
    url:url,
    responseType:'blob'
});


//============歌单的歌曲相关============
//根据歌单id查询歌曲列表
export const listSongDetail = (songListId) => Axios(`listSong/detail?songListId=${songListId}`);


//============用户相关================
//查询用户
export const getAllConsumer =() => get(`consumer/allConsumer`);
