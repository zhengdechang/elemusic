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
    import {songLyric, songUrl,getServeLikedSong} from "../../networks";
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
                'userId'
            ])
        },
        mounted() {
            let _this = this;
            document.addEventListener('click',function () {
                _this.$store.commit('setShowAside',false);
            },true)
        },
        methods:{
            //播放歌曲
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
</script>

<style scoped lang="scss">
    @import "../../assets/css/the-aside";
</style>
