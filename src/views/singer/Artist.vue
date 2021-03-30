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
                        <span :class="['singer-btn', 'singer-collect', isActiveArtist? 'active' : '']" @click="subArtist()"><i :class="['iconfont', 'icon-collect' + (isActiveArtist ? '-active' : '')]"></i> {{ isActiveArtist? '已收藏' : '收藏'}}</span>
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
                    </div>
                </div>
                <div class="singer-list">
                        <album-content   :songList="listOfSongs" :stripe="true" v-show="type === 'hot'">
                            <template slot="title">歌曲列表</template>
                        </album-content>
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
    import {
        artistDesc,
        artists,
        artistAlbum,
        artistMv,
        subServeLikedArtist, deleteLikedArtist, getServeLikedArtist
    } from "../../networks/index"
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
                sUid: '',
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
        created() {
            this.sUid =this.$route.query.id;
            this.getLikedAlbum();
            this.$store.commit('setActiveName','歌手');

        },
        // 监听属性 类似于data概念
        computed: {
            ...mapGetters([
                'listOfSongs',
                'isActiveArtist',
                'userId',
                'loginIn',
            ])
        },
        mounted () {
            this.init()
            this.$route.query.type && this.getArtists()
        },
        // 方法集合
        methods: {
            //获取歌手描述
            getArtistDesc () {
                artistDesc({ id: this.sUid, timestamp: new Date().valueOf() }).then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('数据请求失败')
                    }
                    this.introduction = res.introduction
                })
            },
            //获取歌手
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
                    this.isLoading = false
                })
            },
            //提交收藏
            subArtist () {
                if (!this.isActiveArtist) {
                    if (this.loginIn) {
                        const params = {
                            user_id: this.userId,
                            tid: this.sUid,
                            time: (new Date()).getTime(),
                        }
                        subServeLikedArtist(params).then(res => {
                            if (res.status == 200) {
                                this.$store.commit("setIsActiveArtist", true)
                                this.$message.success('收藏成功');
                            } else {
                                this.$message.success('收藏失败');
                            }
                        })
                    } else {
                        this.$message.error('您还没有登录，请先登录')
                    }
                } else {
                    deleteLikedArtist(this.sUid).then(res =>{
                        if(res.status == 200){
                            this.$message.success('取消收藏成功')
                            this.$store.commit('setIsActiveArtist',false)
                        }else {
                            this.$message.error('取消收藏失败')
                        }
                    })
                }
            },
            //获取收藏列表
            getLikedAlbum(){
                if(this.loginIn){
                    getServeLikedArtist(this.userId).then(res =>{
                        for(let item of res.data){
                            if(item.tid == this.$route.query.id){
                                this.$store.commit('setIsActiveArtist',true);
                                break;
                            }
                        }
                    })
                }
            },
            //获取歌手专辑
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
            //获取歌手Mv
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
            //点击更多弹出描述
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
                const long = this.AsidePlayList.length
                const list = this.unique([...this.AsidePlayList,...this.listOfSongs]);
                this.$store.commit("setAsidePlayList",this.unique(list))
                this.toPlay(this.AsidePlayList[long].id,this.AsidePlayList[long].al.picUrl,long,this.AsidePlayList[long].name,this.AsidePlayList[long].ar[0].name)
            },
        },
        watch: {
            $route: {
                handler () {
                    this.sUid = this.$route.query.id
                },
                deep: true
            },
            sUid () {
                this.$store.commit("setIsActiveArtist", false)
                this.type = this.$route.query.type || 'hot'
                this.getArtists()
            },
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
<style scoped lang="scss">
@import "src/assets/css/artist.scss";
</style>
