<template>
    <div class="home">
        <swiper/>
<!--        <div class="section" v-for="(item,index) in songslist" :key="index">-->
<!--            <div class="section-title">-->
<!--                {{item.name}}-->
<!--            </div>-->
<!--            <content-list :contentList="item.list"></content-list>-->
<!--        </div>-->
        <!--排行版-->
        <div class='album_list'>
            <div class="h_title">
                <h3>新碟上架</h3>
                <span v-for="(item, index) in album_area" :key="item.id" :class="index == album_index ? 'active' : ''" @click="chooseAlbumType(index)">{{item.name}}</span>
            </div>
            <div class="wrapper">
                <div class="album_list">
                    <AlbumList  :albumList="album_list"></AlbumList>
                </div>
            </div>
        </div>
        <div class='top_list'>
            <div class="h_title">
                <h3>排行榜</h3>
            </div>
            <el-row class="wrapper" :gutter="20">
                <el-col :span="6" v-for="item in top_list" :key="item.id" class="toplist_item">
                    <div class="coverImg">
                        <el-image :src="item.coverImgUrl" class="toplist_img"></el-image>
                    </div>
                    <div class="toplist_wrapper">
                        <h4 class="toplist_hd">{{item.name}}</h4>
                        <div class="toplist_songlist">
                            <div class="songitem" v-for="(songItem, index) in songList[item.id]" :key="songItem.id">
                                <div class="songnum">{{index + 1}}</div>
                                <div class="songinfo">
                                    <router-link :to="{ path: '/song', query: { id: item.id }}" class="song_title">{{songItem.name}}</router-link>
                                    <div class="song_author">
                                        <router-link :to="{ path: '/artist', query: { id: author.id }}" class="song_name" v-for="(author, k) in songItem.ar" :key="k">{{ k !== 0 ? '/ ' + author.name : author.name }}</router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--热门歌单-->
        <div class='recom_list'>
            <div class="h_title">
                <h3>热门歌单</h3>
                <span v-for="(item, index) in playlist_tags" :key="item.id" :class="index == playlist_index ? 'active' : ''" @click="choosePlayListType(index)">{{item.name}}</span>
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
            <div class="wrapper">
                <router-link :to="{ path: '/artist', query: { id: item.id }}" class="artists_item" :key="item.id" v-for="item in artists_list">
                    <div class="faceImg">
                        <el-image :src="item.picUrl + '?param=120y120'">
                            <div slot="placeholder" class="image-slot">
                                <i class="iconfont icon-placeholder"></i>
                            </div>
                        </el-image>
                    </div>
                    <div class="info">
                        <div class="name">{{item.name}}</div>
                        <div class="albumSize">专辑：{{item.albumSize}}</div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import Swiper from "../../components/swiper/Swiper";
    import playList from '../../components/common/PlayList'
    // import {getAllSinger,getAllSongList} from "../../networks/index"
    import {hotList, playLists, topArtists, topList, listDetail, topAlbum} from "../../networks/index"
    import AlbumList from "../../components/common/AlbumList";
    // import ContentList from "../../components/common/ContentList";
    export default {
        name: "Homes",
        components:{
            AlbumList,
            // ContentList,
            playList,
            Swiper
        },
        data(){
            return{
                // songslist:[
                //     {name:"歌单",list:[]},
                //     {name:"歌手",list:[]},
                // ]
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
                mv_params: { limit: 10 },
                artists_list: [],
                artists_params: { limit: 9 }
            }
        },
        created() {
            this.chooseAlbumType ('0');
            // this.getSongList();
            // this.getSinger();
        },
        mounted() {
            this.init()
        },
        methods:{
            // getSongList(){
            //     getAllSongList().then((res) =>{
            //         this.songslist[0].list = res.playlists.slice(0,10);
            //         console.log(res.playlists);
            //     }).catch(err =>{
            //         console.log(err);
            //     })
            // },
            // getSinger(){
            //     getAllSinger().then((res) =>{
            //         this.songslist[1].list = res.playlists.slice(0,10);
            //         console.log(res);
            //     }).catch(err =>{
            //         console.log(err);
            //     })
            // }
            // 热门歌单分类标签
            getHotTags () {
                hotList().then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('数据请求失败')
                    }
                    res.tags.unshift({ name: '为您推荐' })
                    this.playlist_tags = res.tags.splice(0, 6)
                })

            },
            // 分类歌单列表
            async getPlayList (params) {
                playLists(params).then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('数据请求失败')
                    }
                    this.playlist_list = res.playlists
                })
            },
            choosePlayListType (index) {
                this.playlist_index = index
                this.playlist_params.cat = index !== 0 ? this.playlist_tags[index].name : ''
                this.getPlayList(this.playlist_params)
            },
            // 新碟上架
            getAlbum (params) {
                topAlbum(params).then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('数据请求失败')
                    }

                    this.album_list = res.monthData.slice(0, 9)
                })
            },
            chooseAlbumType (index) {
                this.album_index = index
                this.album_params.area = index !== 0 ? this.album_area[index].code : ''
                this.getAlbum(this.album_params)
            },

            //排行榜
            getToplist () {
                topList().then((r) => {
                    const res = r
                    if (res.code !== 200) {
                        return this.$msg.error('数据请求失败')
                    }
                    return res
                }).then((r) => {
                    this.top_list = r.list.splice(0, 4)
                    this.top_list.forEach(async item => {
                        listDetail({ id: item.id }).then(res =>{
                            this.$set(this.songList, item.id, res.playlist.tracks.splice(0, 6))
                        })
                    })
                })
            },
            // // 最新MV
            // async getMv (params) {
            //     const { data: res } = await this.$http.getNewMv(params)
            //
            //     if (res.code !== 200) {
            //         return this.$msg.error('数据请求失败')
            //     }
            //
            //     this.mv_list = res.data
            // },
            // chooseMvType (index) {
            //     this.mv_index = index
            //     this.mv_params.area = index !== 0 ? this.mv_area[index] : ''
            //     this.getMv(this.mv_params)
            // },


            // 热门歌手
            async getArtists (params) {
                topArtists(params).then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('数据请求失败')
                    }
                    this.artists_list = res.artists
                })
            },
            init () {
                this.getHotTags()
                this.getToplist()
                this.getPlayList(this.playlist_params)
                this.getArtists(this.artists_params)
            }
        },
    }
</script>

<style scoped lang="less">
    .album_list{
        margin: 0 15px -10px 15px;
    }
    .home {
        margin-top: 90px - 10px;
        .section {
            width: 100%;
            margin-top: 20px;
            padding: 0 120px 50px 120px;
            background-color: #ffffff;
            box-sizing: border-box;
            .section-title {
                height: 60px;
                line-height: 60px;
                padding-top: 10px;
                font-size: 28px;
                font-weight: 500;
                text-align: center;
                color: #000000;
                box-sizing: border-box;
            }
        }
    }
    .recom_list{
        margin-left: 35px;
        margin-right: 15px;
    }
    .h_title {
        padding: 20px 0 0;
        text-align: center;

        h3 {
            padding: 20px 0;
            font-size: 28px;
            font-weight: 700;
        }

        span {
            display: inline-block;
            font-size: 16px;
            margin: 0 24px;
            color: #333;
            cursor: pointer;

            &.active {
                position: relative;
                font-weight: 600;
                color: #000;
                &:after {
                    position: absolute;
                    content: "";
                    left: 0;
                    bottom: 1px;
                    width: 100%;
                    height: 6px;
                    background:#d9d9d9;
                    z-index: -1;
                }
            }
        }
    }

    .wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin:0 80px !important;
        /*margin:0 60px !important;*/
        margin-left: 63px !important;
        margin-right: 60px !important;
    }

    .toplist_item {
        position: relative;
        margin-bottom: 30px;

        .coverImg {
            position: absolute;
            top: 0;
            right: 30px;
            left: 30px;
            z-index: 0;
            height: 100% !important;

            &::before {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 0;
                content: '';
                width: 100%;
                height: 100%;
            }

            /deep/ img {
                filter: blur(60px);
                transform: scale(1.5);
            }
        }

        .toplist_wrapper {
            position: relative;
            z-index: 0;
        }

        &:hover {
            /deep/ img {
                transform: scale(2);
            }
        }
    }

    .toplist_wrapper {
        padding: 30px 40px;
        height: 505px;

        .toplist_hd {
            position: relative;
            font-size: 24px;
            text-align: center;
            color: #fff;

            &::after {
                display: inline-block;
                content: '';
                position: absolute;
                bottom: -30px;
                left: 0;
                right: 0;
                width: 30px;
                height: 2px;
                margin: 0 auto;
                background-color: #fff;
            }
        }

        .toplist_songlist {
            padding-top: 80px;
        }

        .songitem {
            display: flex;
            padding-bottom: 20px;
            color: #fff;

            .songnum {
                padding-right: 10px;
                font-size: 18px;
            }

            .song_title {
                line-height: 24px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                word-break: break-all;
                padding-bottom: 5px;
                font-size: 14px;
                color: #fff;
            }

            .song_author {
                display: block;
                font-size: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                word-break: break-all;

                a {
                    display: inline-block;
                    line-height: 20px;
                    font-size: 14px;
                    color: #fff;
                }
            }

            &:last-child {
                padding-bottom: 0;
            }
        }
    }

    .artists_item {
        width: 120px;

        .el-image {
            transition: all .4s linear;
        }

        &:hover {
            .el-image {
                transform: rotateY(180deg);
            }
        }

        .faceImg {
            width: 120px;
            height: 120px;
            border-radius: 100%;
            overflow: hidden;
        }
    }
    .info {
        text-align: center;

        .name {
            line-height: 28px;
            font-size: 14px;
        }

        .albumSize {
            color: #999;
        }
    }

    .artists_list {
        padding-bottom: 40px;
        margin-bottom: 50px;
        margin-left: 35px;
        margin-right: 10px;
    }

    .toplist_img{
        height: 600px;
    }
    .toplist_img{
        height: 600px;
    }
    a {
          text-decoration: none;
          color: #333;
      }

</style>
