<template>
    <div class="home">
        <swiper/>
        <!--新碟上架-->
        <div class='album_list'>
            <div class="h_title">
                <h3>新碟上架</h3>
                <span v-for="(item, index) in album_area" class="hover" :key="item.id" :class="index == album_index ? 'active' : ''" @click="chooseAlbumType(index)">{{item.name}}</span>
            </div>
            <div class="wrapper">
                <div class="album_list">
                    <AlbumList  :albumList="album_list"></AlbumList>
                </div>
            </div>
        </div>
        <!--排行版-->
        <div class='top_list'>
            <div class="h_title">
                <h3>排行榜</h3>
            </div>
            <IndexRank></IndexRank>
        </div>
        <!--最新MV-->
        <div class='mv_list'>
            <div class="h_title">
                <h3>最新MV</h3>
                <span v-for="(item, index) in mv_area" class="hover" :key="item.id" :class="index == mv_index ? 'active' : ''" @click="chooseMvType(index)">{{item}}</span>
            </div>
            <div class="wrapper">
                <MvList class="loadMv" :mvList="mv_list"></MvList>
            </div>
        </div>
        <!--热门歌单-->
        <div class='recom_list'>
            <div class="h_title">
                <h3>热门歌单</h3>
                <span v-for="(item, index) in playlist_tags" :key="item.id"  class="hover" :class="index == playlist_index ? 'active' : ''" @click="choosePlayListType(index)">{{item.name}}</span>
            </div>
            <div class="wrapper">
                <play-list :playList="playlist_list"></play-list>
            </div>
        </div>
        <!--热门歌手 -->
        <div class='artists_list'>
            <div class="h_title">
                <h3>热门歌手</h3>
            </div>
            <div>
                <IndexSInger :artists_list='artists_list'></IndexSInger>
            </div>
        </div>
    </div>
</template>

<script>
    import Swiper from "../../components/swiper/Swiper";
    import playList from '../../components/common/PlayList'
    import {hotList, playLists, topArtists, topAlbum, getNewMv} from "../../networks/index"
    import AlbumList from "../../components/common/AlbumList";
    import MvList from "../../components/common/MvList";
    import IndexRank from "../../components/common/IndexRank";
    import IndexSInger from "../../components/common/IndexSInger";
    export default {
        name: "Homes",
        components:{
            IndexSInger,
            IndexRank,
            MvList,
            AlbumList,
            playList,
            Swiper
        },
        data(){
            return{
                playlist_tags: [],
                playlist_list: [],
                playlist_index: 0,
                playlist_params: { limit: 5, offset: 0 },
                album_area: [{
                    name: '全部',
                    code: 'all'
                }, {
                    name: '华语',
                    code: 'zh'
                }, {
                    name: '欧美',
                    code: 'ea'
                }, {
                    name: '韩国',
                    code: 'kr'
                }, {
                    name: '日本',
                    code: 'jp'
                }],
                album_index: 0,
                album_list: [],
                album_params: { limit: 9 },
                top_list: [],
                songList: {},
                mv_area: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
                mv_list: [],
                mv_index: 0,
                mv_params: { limit: 5 },
                artists_list: [],
                artists_params: { limit: 9 }
            }
        },
        activated(){
            //使用keep-alive代替触发周期函数的内容
            this.$store.commit('setActiveName','首页');
        },
        created() {
            this.chooseAlbumType ('0');
            this.chooseMvType('全部');
            this.mv_index = 0;
            this.$store.commit('setActiveName','首页');
        },
        mounted() {
            this.init()
        },
        methods:{
            // 热门歌单分类标签
            getHotTags () {
                hotList().then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('歌单分类数据请求失败')
                    }
                    res.tags.unshift({ name: '为您推荐' })
                    this.playlist_tags = res.tags.splice(0, 6)
                })

            },
            // 分类歌单列表
            getPlayList (params) {
                playLists(params).then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('分类歌单数据请求失败')
                    }
                    this.playlist_list = res.playlists
                })
            },
            //选择歌单类型
            choosePlayListType (index) {
                this.playlist_index = index
                this.playlist_params.cat = index !== 0 ? this.playlist_tags[index].name : ''
                this.getPlayList(this.playlist_params)
            },
            // 新碟上架
            getAlbum (params) {
                topAlbum(params).then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('新碟上架数据请求失败')
                    }
                    if(res.monthData.length == []){
                        this.album_list = res.weekData.slice(0, 9)
                    }else{
                        this.album_list = res.monthData.slice(0, 9)
                    }
                })
            },
            //选择专辑播放类型
            chooseAlbumType (index) {
                this.album_index = index
                this.album_params.area = index !== 0 ? this.album_area[index].code : 'all'
                this.getAlbum(this.album_params)
            },
            // 最新MV
            getMv (params) {
                getNewMv(params).then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('最新MV数据请求失败')
                    }
                    this.mv_list = res.data;
                })
            },
            //选择Mv类型
            chooseMvType (index) {
                this.mv_index = index
                this.mv_params.area = index !== 0 ? this.mv_area[index] : ''
                this.getMv(this.mv_params)
            },
            // 热门歌手
            getArtists (params) {
                topArtists(params).then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('热门歌手数据请求失败')
                    }
                    this.artists_list = res.artists
                })
            },
            init () {
                this.getHotTags()
                this.getPlayList(this.playlist_params)
                this.getArtists(this.artists_params)
            }
        },
    }
</script>

<style scoped lang="scss">
@import "src/assets/css/home.scss";
</style>
