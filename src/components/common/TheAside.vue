<template>
    <transition name="slide-fade">
        <div class="the-aside" v-if="showAside">
            <h2 class="title">播放列表</h2>
            <ul class="menus">
                <li v-for="(item,index) in listOfSongs" :key="index" :class="{'is-play': id == item.id}"
                    @click="toPlay(item.id,item.al.picUrl,index,item.name,item.ar[0].name)">
                    {{item.name}}
                </li>
            </ul>
        </div>
    </transition>
</template>

<script>

    import {mapGetters} from 'vuex'
    import {songLyric} from "../../networks";
    export default {
        name: "TheAside",
        data(){
            return {
                ly:''
            }
        },
        computed:{
            ...mapGetters([
                'showAside',             //是否显示播放中的歌曲列表
                "listOfSongs",           //当前歌曲列表
                'id',                    //播放中的音乐id
            ])
        },
        mounted() {
            let _this = this;
            document.addEventListener('click',function () {
                _this.$store.commit('setShowAside',false);
            },true)
        },
        methods:{
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
            parseLyric(text){
                let lines = text.split("\n");                   //将歌词按行分解成数组
                let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;   //时间格式的正则表达式
                let result = [];
                //对于歌词格式不对的直接返回
                if(!(/\[.+\]/.test(text))){
                    return [[0,text]];
                }
                //去掉前面格式不正确的行
                while (!pattern.test(lines[0])){
                    lines = lines.slice(1);
                }
                //遍历每一行，形成一个每行都带着俩元素的数组，第一个元素是以秒为计算单位的时间，第二个元素是歌词
                for(let item of lines){
                    let time = item.match(pattern);              // 存放时间
                    let value = item.replace(pattern,'');        //存放歌词
                    for(let item1 of time){
                        let t = item1.slice(1,-1).split(':');    //取出时间，换算为数组
                        if(value!=''){
                            result.push([parseInt(t[0],10)*60 + parseFloat(t[1]),value]);
                        }
                    }
                }
                //按照第一个元素--时间--排序
                result.sort(function (a,b) {
                    return  a[0]-b[0];
                });
                return result;
            },

        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/the-aside";
</style>