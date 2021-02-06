import {likeSongofName} from "../networks";

export const mixin = {
    methods:{
        // notify(title,type){
        //     this.notify({
        //         title:title,
        //         type:type
        //     })
        // },
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
                        console.log(res.result.songs[0].id);
                        console.log(res.result.songs[0].ar[0].name);
                        console.log(res.result.songs[0].al.picUrl);

                    }
                }).catch(err => {
                    console.log(err);
                })
            }

        },
        //播放
        toPlay(id,picUrl,index,name,artist){
           this.$store.commit('setId',id);
           this.$store.commit('setUrl','http://music.163.com/song/media/outer/url?id='+id+'.mp3');
            this.$store.commit('setPicUrl',picUrl);
            this.$store.commit('setListIndex',index);
            this.$store.commit('setTitle',name);
            this.$store.commit('setArtist',artist);
            this.$store.commit('setLyric','http://music.163.com/api/song/media?id='+id);
        },


        //获取名字前半部分
        // replaceName(str){
        //     let arr = str.split('-');
        //     return arr[0]
        // },
        // replaceFName(str){
        //     let arr = str.split('-');
        //     return arr[1]
        // },
    }
}