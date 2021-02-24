<template>
    <div class="song-list-album" >
        <div class="album-slide">
            <div class="album-img">
                <img :src="attachImageUrl(tempList.coverImgUrl)" alt="">
            </div>
            <div class="album-info">
                <h2>简介:</h2>
                <span>
                    {{tempList.name}}
                </span>
            </div>
        </div>
        <div class="album-contents">
            <div class="album-title">
                <p>{{tempList.name}}</p>
            </div>
            <div class="songs-body">
                <album-content :songlist="listOfSongs">
                    <template slot="title">歌单</template>
                </album-content>
            </div>
        </div>
    </div>
</template>

<script>
    import {mixin} from "../../../mixins";
    import {mapGetters} from 'vuex'
    import {listSongDetail,songOfSongId} from "../../../networks";
    import AlbumContent from "../AlbumContent";
    export default {
        name: "SongListAlbum",
        mixins:[mixin],
        data(){
            return {
                songLists:[],       //当前页面需要展示的歌曲列表
                songListsId:'',     //前面传来的id
            }
        },
        components:{
            AlbumContent,
        },
        computed:{
            ...mapGetters([
                'listOfSongs',       //当前播放列表
                'tempList',          //当前歌单对象
            ])
        },
        created() {
            this.songListsId = this.$route.params.id;
            this.getSongId();
        },
        methods:{
            //获取当前歌单的歌曲列表
            getSongId(){
                listSongDetail(this.songListsId).then(res =>{
                    for(let item of res){
                        this.getSongList(item.songId)
                    }
                    this.$store.commit('setListOfSongs',this.songLists)
                }).catch(err =>{
                    console.log(err);
                })
            },
            //根据歌曲id获取歌曲信息
            getSongList(id){
                songOfSongId(id).then(res =>{
                    this.songLists.push(res)
                }).catch(err =>{
                    console.log(err);
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/song-list-album";
</style>