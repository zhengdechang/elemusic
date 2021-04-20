<template>
    <div class='album' v-if="details">
        <div class="w1200">
            <div class="album-cover">
                <div class="album-img">
                    <el-image :src="details.picUrl">
                        <div slot="placeholder" class="image-slot">
                            <i class="iconfont icon-placeholder"></i>
                        </div>
                    </el-image>
                </div>
                <div class="album-info">
                    <div class="album-title">
                        {{details.name}}
                        <span>{{'#' + details.type}}</span>
                    </div>
                    <div class="album-singer">歌手：<router-link :to="{ path: '/artist', query: { id: author.id }}" class="song_name" v-for="(author, k) in details.artists" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link></div>
                    <div class="album-time">发行时间：{{format(details.publishTime, 'YYYY-MM-DD')}}</div>
                    <div class="album-company">发行公司：{{details.company}}</div>
                    <div class="album-desc" v-if="details.description">
                        <h5>歌单简介<em class="desc-close" v-if="isShowDesc" @click="isShowDesc = false"><i class="iconfont icon-closed"></i></em></h5>
                        <p  @click="showAllDesc">{{details.description}}</p>
                        <pre class="album-desc-all" v-if="isShowDesc">
                            {{details.description}}
                        </pre>
                    </div>
                </div>
            </div>
            <div class="detail-container">
                <div class="detail-main">
                    <div class="song-header">
                        <h4>包含歌曲列表 <em>{{details.size + '首歌'}}</em></h4>
                        <span class="play-all" @click="playAllSongs"><i class="iconfont icon-audio-play"></i> 播放全部</span>
                        <span :class="['collect', isActiveCollection ? 'active' : '']" @click="subCollection()"><i :class="['iconfont', 'icon-collect' + (isActiveCollection ? '-active' : '')]"></i> {{ isActiveCollection ? '已收藏' : '收藏'}}</span>
                    </div>
                    <album-content :songList="songList" :stripe="true">
                        <template slot="title">歌曲列表</template>
                    </album-content>
                    <div class="album-comments" ref=comment>
                        <Comments :type="type" :id="albumId"></Comments>
                    </div>
                </div>
                <div class="detail-aside">
                    <h3 class="aside-title">{{details.artists[0].name}}的其他专辑<router-link :to="{ path: '/artist', query: { id: details.artists[0].id, type: 'album' }}" class="album-more">全部>></router-link></h3>
                    <div class="aside-main aside-album-main">
                        <router-link class="aside-album-item" :to="{ path: '/album', query: { id: item.id }}" v-for="item in hotAlbums" :key="item.id">
                            <el-image :src="item.picUrl">
                                <div slot="placeholder" class="image-slot">
                                    <i class="iconfont icon-placeholder"></i>
                                </div>
                            </el-image>
                            <div class="aside-album-info">
                                <div class="aside-album-name">{{item.name}}</div>
                                <div class="aside-album-time">
                                    {{format(details.publishTime, 'YYYY-MM-DD')}}
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        album,
        artistAlbum,
        albumDynamic,
        subServeLikedCollection,
        deleteLikedCollection,
        getServeLikedCollection,
    } from "../../networks/index"
import AlbumContent from "../../components/common/AlbumContent";
import Comments from "../../components/common/Comment";
import {mixin} from "../../mixins";
import {mapGetters} from "vuex"
export default {
    name: 'albumDetail',
    components: {
        Comments,
        AlbumContent
    },
    mounted () {
        this.albumId = this.$route.query.id
        this._initialize()
    },
    mixins:[mixin],
    data () {
        // 这里存放数据
        return {
            // 歌单详情
            tid:'',            //提交给服务器的专辑id
            albumId: '',
            details: null,
            songList: [],
            dynamic: {},
            hotAlbums: [],
            comments: [],
            type: 3, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
            isShowDesc: false,
            artist_id:'',
        }
    },
    // 监听属性 类似于data概念
    computed: {
        ...mapGetters([
            'listOfSongs',
            'isActiveCollection',
            'userId',
            'loginIn',
            'AsidePlayList'
        ])
    },
    created() {
        this.tid = this.$route.query.id;
        this.getLikedCollection();
        this.$store.commit("setActiveName",'')
    },
    activated(){
        //使用keep-alive代替触发周期函数的内容
        this.$store.commit('setActiveName','');
    },
    // 方法集合
    methods: {
        // 相关歌单推荐
        getAlbum (params) {
            album(params).then(res =>{
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }
                this.artist_id = res.album.artists[0].id;
                this.details = res.album;
                this.songList = res.songs
                this.$store.commit("setListOfSongs",this.songList)
                this.getArtistAlbum(this.artist_id)
            })
        },
        //获取专辑动态
        getAlbumDynamic (params) {
            albumDynamic(params).then(res =>{
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }
                this.dynamic = res
            })
        },
        //获取歌手专辑
        getArtistAlbum (id) {
            artistAlbum({ id: id, limit: 5,offset:0}).then(res =>{
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }
                this.hotAlbums = res.hotAlbums
            })
        },
        // 专辑简介查看更多
        showAllDesc () {
            if (this.details.description.length > 120) {
                this.isShowDesc = !this.isShowDesc
            }
        },
        // 播放列表为当前歌单的全部歌曲
        playAllSongs() {
            const long = this.AsidePlayList.length
            const list = [...this.AsidePlayList,...this.songList];
            this.$store.commit("setAsidePlayList",this.unique(list))
            this.toPlay(this.AsidePlayList[long].id,this.AsidePlayList[long].al.picUrl,long,this.AsidePlayList[long].name,this.AsidePlayList[long].ar[0].name)
        },
        //提交收藏
        subCollection () {
            if (!this.isActiveCollection) {
                if (this.loginIn) {
                    const params = {
                        user_id: this.userId,
                        tid: this.tid,
                        time: (new Date()).getTime(),
                    }
                    subServeLikedCollection(params).then(res => {
                        if (res.status == 200) {
                            this.$store.commit("setIsActiveCollection", true)
                            this.$message.success('收藏成功');
                        } else {
                            this.$message.success('收藏失败');
                        }
                    })
                } else {
                    this.$message.error('您还没有登录，请先登录')
                }
            } else {
                deleteLikedCollection(this.tid).then(res =>{
                    if(res.status == 200){
                        this.$message.success('取消收藏成功')
                        this.$store.commit('setIsActiveCollection',false)
                    }else {
                        this.$message.error('取消收藏失败')
                    }
                })
            }
        },
        //获取收藏列表
        getLikedCollection(){
            if(this.loginIn){
                getServeLikedCollection(this.userId).then(res =>{
                    for(let item of res.data){
                        if(item.tid == this.$route.query.id){
                            this.$store.commit('setIsActiveCollection',true);
                            break;
                        }
                    }
                })
            }
        },

        //处理歌曲
        _initialize () {
            this.getAlbum({ id: this.albumId })
            this.getAlbumDynamic({ id: this.albumId })
        },
    },
    watch: {
        $route () {
            this.albumId = this.$route.query.id
            if (this.albumId) {
                this._initialize()
            }
            this.$store.commit("setIsActiveCollection", false)
        },
        tid(){
            this.$store.commit("setIsActiveCollection", false)
        }
    }
}
</script>
<style scoped lang="scss">
@import "src/assets/css/album.scss";
</style>
