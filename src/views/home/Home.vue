<template>
    <div class="home">
        <swiper/>
        <div class="section" v-for="(item,index) in songslist" :key="index">
            <div class="section-title">
                {{item.name}}
            </div>
            <content-list :contentList="item.list"></content-list>
        </div>
    </div>
</template>

<script>
    import Swiper from "../../components/swiper/Swiper";
    import {getAllSinger,getAllSongList} from "../../networks/index"
    import ContentList from "../../components/common/ContentList";
    export default {
        name: "Homes",
        components:{
            ContentList,
            Swiper
        },
        data(){
            return{
                songslist:[
                    {name:"歌单",list:[]},
                    {name:"歌手",list:[]},
                ]
            }
        },
        created() {
            this.getSongList();
            this.getSinger();
        },
        methods:{
            getSongList(){
                getAllSongList().then((res) =>{
                    this.songslist[0].list = res.playlists.slice(0,10);
                    console.log(res.playlists);
                }).catch(err =>{
                    console.log(err);
                })
            },
            getSinger(){
                getAllSinger().then((res) =>{
                    this.songslist[1].list = res.playlists.slice(0,10);
                    console.log(res);
                }).catch(err =>{
                    console.log(err);
                })
            }
        },

    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/home";
</style>