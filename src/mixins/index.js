import {likeSongofName, songLyric} from "../networks";

export const mixin = {
    data(){
        return {
            lr:'sss'
        }
    },
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
            songLyric(id).then(res =>{
                console.log(res.lrc.lyric);
                this.$store.commit('setLyric',res.lrc.lyric);
            }).catch(err => {
                console.log(err);
            });
        },
        //解析歌词
        // parseLyric(text){
        //     let lines = text.split("\n");                   //将歌词按行分解成数组
        //     let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;   //时间格式的正则表达式
        //     let result = [];
        //     //对于歌词格式不对的直接返回
        //     if(!(/\[.+\]/.test(text))){
        //         return [[0,text]];
        //     }
        //     //去掉前面格式不正确的行
        //     while (!pattern.test(lines[0])){
        //         lines = lines.slice(1);
        //     }
        //     //遍历每一行，形成一个每行都带着俩元素的数组，第一个元素是以秒为计算单位的时间，第二个元素是歌词
        //     for(let item of lines){
        //         let time = item.match(pattern);              // 存放时间
        //         let value = item.replace(pattern,'');        //存放歌词
        //         for(let item1 of time){
        //             let t = item1.slice(1,-1).split(':');    //取出时间，换算为数组
        //             if(value!=''){
        //                 result.push([parseInt(t[0],10)*60 + parseFloat(t[1]),value]);
        //             }
        //         }
        //     }
        //     //按照第一个元素--时间--排序
        //     result.sort(function (a,b) {
        //         return  a[0] - b[0];
        //     });
        //     return result;
        // },
        //获取歌词
        // getLyric(id){
        //     songLyric(id).then(res =>{
        //         console.log(res.lrc.lyric);
        //         this.lr = res.lrc.lyric
        //     }).catch(err => {
        //         console.log(err);
        //     })
        // },

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