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
    export default {
        name: "TheAside",
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
                this.$store.commit('setLyric','http://music.163.com/api/song/media?id='+id);
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/the-aside";
</style>