import {get,post} from "./http";
import Axios from "axios";
import axios from "axios";
import Vue from 'vue'

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

// 首页轮播图
export const getBanner = () => get('/banner', {})

// 获取相似音乐
export const simiSong = ({ id = '' }) => get(`/simi/song?id=${id}`, {})

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
// 歌单详情
export const playlistdetail = ({ id = '', s = 8 }) => get(`/playlist/detail?id=${id}&s=${s}`, {})
// 歌单收藏用户
export const playlistSCollect = ({ id = '', limit = 20, offset = 0 }) => get(`/playlist/subscribers?id=${id}&limit=${limit}&offset=${offset}`, {})
// 相关歌单推荐
export const playlistRelated = ({ id = '' }) => get(`/related/playlist?id=${id}`, {})
// 歌单评论
export const playlistComment = ({ id = '', limit = 20, offset = 0, before = 0 }) => get(`/comment/playlist?id=${id}&limit=${limit}&offset=${offset}&before=${before}`, {})
// 歌单中的歌曲详情 多个id , 隔开
export const songDetail = ({ ids = '', timestamp = 0 }) => post(`/song/detail?timestamp=${timestamp}&&ids=${ids}`, { ids: ids })

/* ********* 歌手 ********* */
// 歌手介绍
export const artistDesc = ({ id = '' }) => get(`/artist/desc?id=${id}`, {})
// 歌手热门歌曲
export const artists = ({ id = '' }) => get(`/artists?id=${id}`, {})
// 获取歌手专辑
export const artistAlbum = ({ id = '', limit = 50, offset = 0 }) => get(`/artist/album?id=${id}&limit=${limit}&offset=${offset}`, {})
// 热门歌手
export const topArtists = ({ limit = 30, offset = 0 }) => get(`/top/artists?limit=${limit}&offset=${offset}`, {})

//排行榜
export  const topList = () => get('/toplist', {})

// 歌单详情
export const listDetail = ({ id = '', s = 8 }) => get(`/playlist/detail?id=${id}&s=${s}`, {})

// 歌单分类
export const catlist = () => get('/playlist/catlist', {})
// 歌单列表
export const playList = ({ order = 'hot', cat = '', limit = 50, offset = 0 }) => get(`/top/playlist?limit=${limit}&order=${order}&cat=${cat}&offset=${offset}`, {})

//歌手列表
export const artistList = ({ type = -1, area = -1, initial = '', limit = 50, offset = 0 }) => get(`/artist/list?type=${type}&area=${area}&initial=${initial}&limit=${limit}&offset=${offset}`, {})



// 获取用户歌单
export const playlistUser = ({ uid = '', limit = 30, offset = 0 }) => get(`/user/playlist?uid=${uid}&limit=${limit}&offset=${offset}`, {})
// 收藏、取消歌单 1：收藏 2取消
export const subPlayList = ({ t = 1, id = '' }) => get(`/playlist/subscribe?t=${t}&id=${id}`, {})

/* ********* 专辑 ********* */
// 获取专辑内容
export const album = ({ id = '' }) => get(`/album?id=${id}`, {})
export const albumDynamic = ({ id = '' }) => get(`/album/detail/dynamic?id=${id}`, {})

// 新碟上架
export  const topAlbum = ({ limit = 20, offset = 0, area = '', type = 'new', year = '', month = '' }) => get(`/top/album?limit=${limit}&offset=${offset}&area=${area}&type=${type}&year=${year}&month=${month}`, {})


/* ********* 歌曲评论 ********* */
// 歌曲评论
export const commentSong = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) =>get(`/comment/music?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {})
/*
    * 发送/删除评论
    * t: 0删除 1发送 2回复
    * type: 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
    * id: 对应资源id
    * content: 发送的内容/对应内容的id
    * commentId: 回复的评论id
*/
export const comment = ({ t = 1, type = 0, id = '', content = '', commentId = '' }) => get(`/comment?t=${t}&type=${type}&id=${id}&content=${content}&commentId=${commentId}`, {})
/*
    * 给评论点赞
    * id: 对应资源id
    * cid: 评论id
    * t: 是否点赞 1: 是  0: 取消
    * type: 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
*/
export const commentLike = ({ id = '', cid = '', t = 1, type = 0 }) => get(`/comment/like?id=${id}&cid=${cid}&t=${t}&type=${type}`, {})

// 专辑评论
export const albumComment = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) =>get(`/comment/album?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {})
