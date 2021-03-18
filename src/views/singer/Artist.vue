<template>
    <div class='artist'>
        <div class="w1200">
            <div class="singer-info">
                <div class="singer-avatar">
                    <el-image :src="artist.img1v1Url">
                        <div slot="placeholder" class="image-slot">
                            <i class="iconfont icon-placeholder"></i>
                        </div>
                    </el-image>
                </div>
                <div class="singer-desc">
                    <div class="singer-author">
                        <div class="singer-name">{{artist.name}}</div>
                        <router-link v-if="artist.accountId" class="singer-btn singer-home" :to="{ path: '/artist', query: { id: artist.accountId }}"><i class="iconfont icon-home"></i> 个人主页</router-link>
                        <span :class="['singer-btn', 'singer-collect', artist.followed ? 'active' : '']" @click="getArtistSub(artist.followed ? 0 : 1)"><i :class="['iconfont', 'icon-collect' + (artist.followed ? '-active' : '')]"></i> {{ artist.followed ? '已收藏' : '收藏'}}</span>
                    </div>
                    <div class="singer-brief">{{artist.briefDesc ? artist.briefDesc : '暂无简介'}} <span v-if="introduction.length" @click="moreDesc">更多>></span></div>
                </div>
            </div>
        </div>
        <div class="singer-main">
            <div class="w1200">
                <div class="singer-hd">
                    <em>作品集</em>
                    <div class="singer-tab">
                        <span :class="[ type === 'hot' ? 'active' : '']" @click="changeType('hot')">热门作品</span>
                        <span :class="[ type === 'album' ? 'active' : '']" @click="changeType('album')">所有专辑</span>
                        <span :class="[ type === 'mv' ? 'active' : '']" @click="changeType('mv')">相关MV</span>
                    </div>
                    <div class="singer-oper" v-if="type === 'hot'">
                        <span @click="playAllSongs" class="singer-btn playAll"><i class="iconfont icon-audio-play"></i> 播放全部</span>
<!--                        <span @click="addAll" class="singer-btn addAll"><i class="iconfont icon-add"></i> 添加到播放列表</span>-->
                        <span @click="collectAll" class="singer-btn collectAll"><i class="iconfont icon-collect"></i> 收藏热门</span>
                    </div>
                </div>
                <div class="singer-list">
                        <album-content   :songList="listOfSongs" :stripe="true" v-show="type === 'hot'"></album-content>
                        <AlbumList :albumList="hotAlbums" v-show="type === 'album'"></AlbumList>
                        <MvList  class="loadMv" :mvList="currentMv" v-show="type === 'mv'" v-infinite-scroll="loadMv" :infinite-scroll-disabled="isLoadMv" infinite-scroll-distance="20"></MvList>
                    <template v-if="isLoading">
                        <Loading />
                    </template>
                </div>
                <div class="pagination" v-if="type === 'hot'">
                    <el-pagination
                            background
                            @current-change="currentChange2"
                            layout="prev, pager, next"
                            :page-size="limit"
                            :total="total">
                    </el-pagination>
                </div>
                <div class="pagination" v-if="type ==='album'">
                    <el-pagination
                            background
                            @current-change="currentChange1"
                            layout="prev, pager, next"
                            :page-size="limit-1"
                            :total="total">
                    </el-pagination>
                </div>
                <div class="pagination" v-if="type ==='mv'">
                    <el-pagination
                            background
                            @current-change="currentChange3"
                            layout="prev, pager, next"
                            :page-size="limit"
                            :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog :title="artist.name" :visible.sync="dialogDescVisible" :destroy-on-close="true">
            <div class="artist-desc-main">
                <dl class="introduction">
                    <dt>艺人介绍</dt>
                    <dd>{{artist.briefDesc}}</dd>
                </dl>
                <dl v-for="(item, index) in introduction" :key="index" class="introduction">
                    <dt>{{item.ti}}</dt>
                    <dd>{{item.txt}}</dd>
                </dl>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {artistDesc,artists,artistAlbum,artistMv} from "../../networks/index"
    import {mixin} from "../../mixins";
    import { mapGetters } from "vuex"
    import Loading from "../../components/common/Loading"
    import AlbumContent from "../../components/common/AlbumContent";
    import AlbumList from "../../components/common/AlbumList";
    import MvList from "../../components/common/MvList";
    export default {
        name: 'artist',
        components: {
            MvList,
            AlbumList,
            AlbumContent,
            Loading
        },
        mixins:[mixin],
        data () {
            // 这里存放数据
            return {
                sUid: this.$route.query.id,
                artist: {},
                hotSongs: [],
                hotAlbums: [],
                hotMvs: [],
                currentMv:[],
                introduction: [],
                type: this.$route.query.type || 'hot',
                limit: 10,
                offset: 0,
                total: 0,
                hasMoreMvs: true,
                timer: null,
                dialogDescVisible: false,
                isLoading: true,
                isLoadMv: true,
                start:0,
                end:1,
                listSongs:'',
                AllhotAlbums:[],
            }
        },
        // 监听属性 类似于data概念
        computed: {
            ...mapGetters(['listOfSongs'])
        },
        mounted () {
            this.init()
            this.$route.query.type && this.getArtists()
        },
        // 方法集合
        methods: {
            // ...mapMutations({
            //     setPlayStatus: 'SET_PLAYSTATUS',
            //     setPlayList: 'SET_PLAYLIST',
            //     setPlayListTips: 'setPlayListTips',
            //     setPlayIndex: 'SET_PLAYINDEX'
            // }),
            getArtistDesc () {
                artistDesc({ id: this.sUid, timestamp: new Date().valueOf() }).then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('数据请求失败')
                    }
                    this.introduction = res.introduction
                })
            },
            getArtists () {
                this.isLoading = true
                artists({ id: this.sUid, timestamp: new Date().valueOf() }).then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('数据请求失败')
                    }

                    this.artist = res.artist
                    this.hotSongs = res.hotSongs
                    this.listSongs = this.hotSongs;
                    this.total =  this.listSongs.length;
                    this.$store.commit('setListOfSongs',(this.listSongs).slice(this.start*10,this.end*10))
                    console.log(this.hotSongs);
                    this.isLoading = false
                })
            },
            // async getArtistSub (t) {
            //     const { data: res } = await this.$http.artistSub({ id: this.sUid, t })
            //
            //     if (res.code !== 200) {
            //         return this.$msg.error('数据请求失败')
            //     }
            //     this.$msg.success('操作成功')
            //     this.getArtists()
            // },
            getArtistAlbum () {
                this.isLoading = true
                artistAlbum({ id: this.sUid, offset: this.offset }).then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('数据请求失败')
                    }
                    this.total = res.artist.albumSize

                    this.AllhotAlbums = res.hotAlbums
                    this.hotAlbums = this.AllhotAlbums.slice(this.start*9,this.end*9)
                    this.isLoading = false
                })

            },
            getArtistMv () {
                if (!this.hasMoreMvs || !this.isLoadMv) return
                this.isLoading = true
                this.isLoadMv = false
                artistMv({ id: this.sUid, offset: this.offset }).then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('数据请求失败')
                    }
                    this.hasMoreMvs = res.hasMore
                    this.hotMvs = [...this.hotMvs, ...res.mvs]
                    this.total =  this.hotMvs.length;
                    this.currentMv = this.hotMvs.slice(this.start*10,this.end*10)
                    this.isLoadMv = false
                    this.isLoading = false
                })

            },
            loadMv () {
                this.getArtistMv()
            },
            moreDesc () {
                this.dialogDescVisible = true
            },
            changeType (type) {
                const params = {
                    id: this.sUid
                }
                this.type = type
                this.offset = 0
                switch (this.type) {
                    case 'hot' :
                        this.getArtists()
                        break
                    case 'album' :
                        this.getArtistAlbum()
                        break
                    case 'mv' :
                        this.hotMvs = []
                        this.hasMoreMvs = true
                        this.getArtistMv()
                        break
                }
                if (type !== 'hot') {
                    params.type = this.type
                }
                this.$router.push({ path: 'artist', query: params })
            },
            // 分页
            currentChange1 (page) {
                    this.start = page -1;
                    this.end = page;
                    this.hotAlbums = this.AllhotAlbums.slice(this.start*9,this.end*9);
            },
            currentChange2 (page) {
                this.start = page -1;
                this.end = page;
                this.$store.commit('setListOfSongs',(this.listSongs).slice(this.start*10,this.end*10))
            },
            currentChange3 (page) {
                this.start = page -1;
                this.end = page;
                this.currentMv = this.hotMvs.slice(this.start*10,this.end*10)

            },
            init () {
                this.sUid = this.$route.query.id
                this.getArtistDesc()
                switch (this.type) {
                    case 'hot' :
                        this.getArtists()
                        break
                    case 'album' :
                        this.getArtistAlbum()
                        break
                    case 'mv' :
                        this.getArtistMv()
                        break
                }
            },
            // 播放列表为当前歌单的全部歌曲
            playAllSongs() {
                // listSongs
                this.listSongs.forEach((item,i) => {
                    this.listOfSongs[i] = item
                })
                this.toPlay(this.listOfSongs[0].id,this.listOfSongs[0].al.picUrl,0,this.listOfSongs[0].name,this.listOfSongs[0].ar[0].name)

            },
            // addAll () {
            //     this.addList({ list: this.hotSongs })
            //     this.setPlayListTips({ flag: true, txt: '已添加到播放列表' })
            //     clearTimeout(this.timer)
            //     this.timer = setTimeout(() => {
            //         this.setPlayListTips({ flag: false, txt: '已添加到播放列表' })
            //     }, 2000)
            // },
            // TODO收藏
            collectAll () {},
        },
        watch: {
            $route: {
                handler () {
                    this.sUid = this.$route.query.id
                },
                deep: true
            },
            sUid (val, oldVal) {
                this.type = this.$route.query.type || 'hot'
                this.getArtists()
            }
        },
        beforeDestroy () {
            clearTimeout(this.timer)
        },
        // 歌曲毫秒格式化处理 03:30
        formatSongTime (duration = 0) {
            duration = duration / 1000
            const m = (Math.floor(duration / 60) + '').padStart(2, '0')
            const s = (Math.floor(duration % 60) + '').padStart(2, '0')
            return `${m}:${s}`
        },
    }
</script>
<style scoped lang="less">
    .loadMv{
        display: flex;
        flex-wrap: wrap;
        overflow-y: auto;
    }
    a {
        text-decoration: none;
        color: #333;
    }
    .artist {
        /*background: #f8f8f8;*/
        margin-top: 70px;

        .singer-btn {
            display: inline-block;
            line-height: 16px;
            align-items: center;
            border-radius: 50px;
            padding: 7px 15px;
            cursor: pointer;
            margin: 5px 0 5px 15px;
            background: #fff;
            color: #333;
        }

        .playAll, .icon-audio-play {
            font-size: 14px;
            color: #fff;
            background: #ff641e;
        }

        .addAll, .collectAll {
            font-size: 14px;
            background: #f0f0f0;
        }
    }
    .singer-info {
        display: flex;
        padding: 40px 0 40px 150px;
        width: 80%;
        height: auto;

        .singer-avatar {
            width: 200px;
            height: 200px;
            border-radius: 100%;
            overflow: hidden;

            .el-image {
                transition: all 1s;

                &:hover {
                    transform: scale(1.1);
                }
            }
        }

        .singer-desc {
            flex: 1;
            padding-left: 50px;
        }

        .singer-author {
            padding-bottom: 16px;
        }

        .singer-name {
            display: inline-block;
            font-size: 40px;
            font-weight: 600;
            line-height: 40px;
            margin-right: 20px;
            vertical-align: top;
        }

        .singer-collect {
            &.active, .icon-collect-active {
                color: #ff641e;
            }
        }

        .singer-brief {
            line-height: 24px;
            color: #999;

            span {
                color: #ff641e;
                cursor: pointer;
            }
        }
    }
    .singer-main {
        padding: 50px 210px  80px 140px;
        /*background: #fff;*/
    }
    .singer-hd {
        display: flex;
        font-size: 0;

        em {
            display: inline-block;
            width: 85px;
            font-size: 28px;
            line-height: 28px;
            font-style: normal;
        }

        .singer-tab {
            flex: 1;
        }

        span {
            display: inline-block;
            font-size: 16px;
            margin: 0 24px;
            color: #666;
            cursor: pointer;

            &.active {
                position: relative;
                z-index: 1;
                font-weight: 600;
                color: #000;
                &:after {
                    position: absolute;
                    content: "";
                    left: 0;
                    bottom: 1px;
                    width: 100%;
                    height: 6px;
                    background: #ff641e;
                    z-index: -1;
                }
            }
        }
    }
    .artist-desc-main {
        max-height: 500px;
        overflow-y: auto;
    }
    .introduction {
        dt {
            position: relative;
            line-height: 14px;
            padding-bottom: 10px;
            color: #333;
            font-weight: bold;
            font-size: 14px;

            &::before {
                display: inline-block;
                content: '';
                width: 4px;
                height: 14px;
                margin-right: 10px;
                vertical-align: top;
                border-radius: 4px;
                background: #ff641e;
            }
        }

        dd {
            padding-bottom: 20px;
            font-size: 12px;
            line-height: 25px;
            white-space: pre-line;
            color: #666;
        }
    }
    .pagination {
        padding: 30px 0;
        text-align: center;
    }
</style>