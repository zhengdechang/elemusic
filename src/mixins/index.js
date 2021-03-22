import {getServeLikedSong, likeSongofName, songLyric, songUrl} from "../networks";
import {mapGetters} from "vuex";

export const mixin = {
    computed:{
        ...mapGetters([
            'loginIn',
            'userId'
        ])
    },
    methods:{
        attachImageUrl(srcUrl){
            return srcUrl ? srcUrl : '../assets/img/user.jpg';
        },
        //模糊搜索
        getSong(){
            if(!this.$route.query.keywords){
                this.$store.commit('setListOfSongs',[])
                // this.notify('您输入的内容为空','warning');
                console.log('您输入的内容为空')
            }
            else {
                likeSongofName(this.$route.query.keywords).then(res =>{
                    if(res.length){
                        this.$store.commit('setListOfSongs',[])
                        // this.notify('系统暂无符合条件的歌曲','warning')
                        console.log('您输入的内容为空')
                    }else{
                        this.$store.commit('setListOfSongs',res.result.songs)
                        console.log(res.result);
                        // console.log(res.result.songs[0].id);
                        // console.log(res.result.songs[0].ar[0].name);
                        // console.log(res.result.songs[0].al.picUrl);

                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        },
        //播放
        toPlay(id,picUrl,index,name,artist){
            this.$store.commit('setId',id);
            this.getUrl(id);
            this.$store.commit('setPicUrl',picUrl);
            this.$store.commit('setListIndex',index);
            this.$store.commit('setTitle',name);
            this.$store.commit('setArtist',artist);
            this.getLyric(id);
            if(this.loginIn){
                getServeLikedSong(this.userId).then(res =>{
                    console.log(res);
                    for(let item of res.data){
                        if(item.tid == id){
                            this.$store.commit('setIsActive',true);
                            break;
                        }
                    }
                })
            }
        },
        //获取歌曲的url
        getUrl(id){
            songUrl(id).then(res =>{
                // console.log(res);
                this.$store.commit('setUrl',res.data[0].url);
            }).catch(err => {
                console.log(err);
            });
        },
        //获取歌词
        getLyric(id){
            songLyric(id).then(res =>{
                // console.log(res.lrc.lyric);
                this.$store.commit('setLyric',res.lrc.lyric);
            }).catch(err => {
                console.log(err);
            });
        },
    }
}
