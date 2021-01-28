<template>
    <div class="home">
        <swiper/>
        <div class="section" v-for="(item,index) in songslist" :key="index">
            <div class="section-title">
                {{item.name}}
            </div>
        </div>
    </div>
</template>

<script>
    import Swiper from "../../components/swiper/Swiper";
    import {getAllSinger,getAllSongList} from "../../networks/index"
    export default {
        name: "Homes",
        components:{
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
        methods:{
            getSongList(){
                getAllSongList().then((res) =>{
                    this.songlist[0].list = res.slice(0,10);
                }).catch(err =>{
                    console.log(err);
                })
            },
            getSinger(){
                getAllSinger().then((res) =>{
                    this.songlist[1].list = res.slice(0,10);
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