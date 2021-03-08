import {get,post} from "./http";
import Axios from "axios";
import axios from "axios";
import router from "../../../admin/src/router";
import Vue from 'vue'
import api from "../../../vue_pc_music/src/apis/instance";

const http = axios.create({
    baseURL:'http://localhost:3001/admin/api'
})

//拦截服务端错误信息显示在客户端
http.interceptors.response.use(res =>{
    return res
},err =>{
    if(err.response.data.message){
        Vue.prototype.$message({
            type:'err',
            message:err.response.data.message
        })
    }
    return Promise.reject(err)
})
axios.defaults.withCredentials = true


export default http

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

//注册
export const SignUp = (params) =>post('consumer/add',params)


//============歌单的歌曲相关============
//根据歌单id查询歌曲列表
export const listSongDetail = (songListId) => Axios(`listSong/detail?songListId=${songListId}`);


//============用户相关================
//查询用户
export const getAllConsumer =() => get(`consumer/allConsumer`);


//用户注册接口
export const postSignUp =(model) => http.post('rest2/user',model);

//用户登录接口
export const loginIn =(model) => http.post('user/login',model);

//获取数据
export  const getUserData =(id) => http.get(`user/change/${id}`);

//修改用户信息
export  const changeUser =(model,id) => http.put(`user/change/${id}`,model);


//获取用户头像
export  const getImg =(id) => http.get(`/user/getImg/${id}`);


// 热门歌单分类
export const hotList = () => get('/playlist/hot', {})

// 歌单列表
export const playLists = ({ order = 'hot', cat = '', limit = 50, offset = 0 }) => get(`/top/playlist?limit=${limit}&order=${order}&cat=${cat}&offset=${offset}`, {})

// 热门歌手
export const topArtists = ({ limit = 30, offset = 0 }) => get(`/top/artists?limit=${limit}&offset=${offset}`, {})

//排行榜
export  const topList = () => get('/toplist', {})

// 歌单详情
export const listDetail = ({ id = '', s = 8 }) => get(`/playlist/detail?id=${id}&s=${s}`, {})

