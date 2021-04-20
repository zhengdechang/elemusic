<template>
    <el-row class="wrapper" :gutter="20">
        <el-col :span="6" v-for="item in top_list"  :key="item.id" class="toplist_item hover">
            <div class="coverImg">
                <el-image :src="item.coverImgUrl" class="toplist_img"></el-image>
            </div>
            <div class="toplist_wrapper">
                <h4 class="toplist_hd">{{item.name}}</h4>
                <div class="toplist_songlist">
                    <div class="songitem" v-for="(songItem, index) in songList[item.id]" :key="songItem.id">
                        <div class="songnum">{{index + 1}}</div>
                        <div class="songinfo ">
                            <router-link :to="{ path: '/song', query: { id: songItem.id }}" class="song_title ">{{songItem.name}}</router-link>
                            <div class="song_author">
                                <router-link :to="{ path: '/artist', query: { id: author.id }}" class="song_name" v-for="(author, k) in songItem.ar" :key="k">{{ k !== 0 ? '/ ' + author.name : author.name }}</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    import {listDetail, topList} from "../../networks";
    export default {
        name: "IndexRank",
        data(){
            return{
                top_list:[],
                songList: {},
            }
        },
        created() {
            this.getToplist();
        },
        methods:{
            //排行榜
            getToplist () {
                topList().then((r) => {
                    this.top_list = r.list.splice(0, 4)
                    this.top_list.forEach( item => {
                        listDetail({ id: item.id }).then(res =>{
                            // this.songList[item.id] = res.playlist.tracks.splice(0, 6)
                            this.$set(this.songList,item.id,res.playlist.tracks.splice(0, 6))
                        })
                    })
                })
            },
        }
    }
</script>

<style scoped lang="scss">
@import "src/assets/css/indexrank";
</style>
