import {get} from "./http";


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



//============歌单的歌曲相关============
//根据歌单id查询歌曲列表
export const listSongDetail = (songListId) => get(`listSong/detail?songListId=${songListId}`);


//============用户相关================
//查询用户
export const getAllConsumer =() => get(`consumer/allConsumer`);
