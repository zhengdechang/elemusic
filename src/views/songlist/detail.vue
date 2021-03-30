<template>
    <div class='detail'>
        <div class="w1200">
            <div class="detail-container">
                <div class="detail-main">
                    <div class="cover">
                        <div class="cover-img">
                            <el-image :src="details.coverImgUrl">
                                <div slot="placeholder" class="image-slot">
                                    <i class="iconfont icon-placeholder"></i>
                                </div>
                            </el-image>
                        </div>
                        <div class="cover-info">
                            <div class="cover-title">
                                {{details.name}}
                            </div>
                            <div class="cover-author" v-if="details.creator">
                                <el-image :src="details.creator.avatarUrl" class="cover-avatar">
                                    <div slot="placeholder" class="image-slot">
                                        <i class="iconfont icon-placeholder"></i>
                                    </div>
                                </el-image>
                                <div class="cover-name">{{details.creator.nickname}}</div>
                                <div class="cover-date">{{formartDate(details.createTime, 'yyyy-MM-dd')}}</div>
                            </div>
                            <div class="cover-tags" v-if="details.tags">
                                <router-link :to="{ path: '/song-list', query: { cat: tag }}" class="tag" v-for="(tag, index) in details.tags" :key="index">#{{tag}}</router-link>
                            </div>
                            <div class="cover-digital">
                                <span class="cover-playCount"><i class="iconfont icon-playnum"></i> {{formartNum(details.playCount)}}次</span>
                                <span class="cover-collect"><i class="iconfont icon-collect"></i> {{formartNum(details.subscribedCount)}}</span>
                                <span class="cover-comment"><i class="iconfont icon-comment"></i> {{formartNum(details.commentCount)}}</span>
                            </div>
                            <div class="cover-desc">
                                <h5>歌单简介<em class="desc-close" v-if="isShowDesc" @click="isShowDesc = false"><i class="iconfont icon-closed"></i></em></h5>
                                <p v-html="details.description" @click="showAllDesc"></p>
                                <pre class="cover-desc-all" v-if="isShowDesc">
                                    {{details.description}}
                                </pre>
                            </div>
                        </div>
                    </div>
                    <div class="song-main">
                        <div class="song-header">
                            <h4>歌曲列表 <em>{{total + '首歌'}}</em></h4>
                            <span class="play-all" @click="playAllSongs"><i class="iconfont icon-audio-play"></i> 播放全部</span>
                            <span :class="['collect', isActiveAlbum ? 'active' : '']" @click="subPlayList()"><i :class="['iconfont', 'icon-collect' + (isActiveAlbum ? '-active' : '')]"></i> {{ isActiveAlbum ? '已收藏' : '收藏'}}</span>
                        </div>
                        <template v-if="isLoading">
                            <Loading />
                        </template>
                        <template v-else>
                            <album-content :songList="listOfSongs">
                                <template slot="title">歌曲列表</template>
                            </album-content>
                            <div class="pagination" >
                                <el-pagination
                                        background
                                        @current-change="currentChange"
                                        layout="prev, pager, next"
                                        :page-size="limit"
                                        :total="total">
                                </el-pagination>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="detail-aside">
                    <div class="playlist-collect">
                        <h3 class="aside-title">喜欢这个歌单的人</h3>
                        <div class="aside-main collect-main">
                            <div class="collect-author" :to="{ path: '/artist', query: { id: item.userId }}" v-for="item in collects" :key="item.userId">
                                <el-image :src="item.avatarUrl">
                                    <div slot="placeholder" class="image-slot">
                                        <i class="iconfont icon-placeholder"></i>
                                    </div>
                                </el-image>
                            </div>
                        </div>
                    </div>
                    <div class="playlist-recom">
                        <h3 class="aside-title">相关歌单推荐</h3>
                        <div class="aside-main recom-main">
                            <router-link class="recom-item" :to="{ path: '/song-list/detail', query: { id: item.id }}" v-for="item in playlists" :key="item.id">
                                <el-image :src="item.coverImgUrl">
                                    <div slot="placeholder" class="image-slot">
                                        <i class="iconfont icon-placeholder"></i>
                                    </div>
                                </el-image>
                                <div class="recom-info">
                                    <div class="recom-name">{{item.name}}</div>
                                    <div class="recom-author">
                                        By. <router-link :to="{ path: '/artist', query: { id: item.creator.userId }}">{{ item.creator.nickname }}</router-link>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                    </div>
                    <div class="playlist-comment">
                        <h3 class="aside-title">歌单评论</h3>
                        <div class="aside-main comment-main">
                            <div class="comment-item" v-for="item in comments" :key="item.commentId">
                                    <el-image :src="item.user.avatarUrl">
                                        <div slot="placeholder" class="image-slot">
                                            <i class="iconfont icon-placeholder"></i>
                                        </div>
                                    </el-image>
                                <div class="comment-info">
                                    <div class="comment-userInfo"><div  class="comment-name">{{item.user.nickname}}</div><span class="comment-date">{{formatMsgTime(item.time)}}</span></div>
                                    <div class="comment-desc">{{item.content}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {mixin} from "../../mixins";
import Loading from '../../components/common/Loading'
import {
    playlistdetail,
    playlistSCollect,
    playlistRelated,
    songDetail,
    playlistComment,
    subServeLikedAlbum,
    getServeLikedAlbum,
    deleteLikedAlbum
} from "../../networks/index"
import AlbumContent from "../../components/common/AlbumContent";
export default {
    name: 'PlayListDetail',
    components: {
        AlbumContent,
        // songList,
        Loading
    },
    mounted() {
        this._initialize(this.$route.query.id)
    },
    mixins:[mixin],
    data() {
        // 这里存放数据
        return {
            // 歌单详情
            details: {},
            songList: [],
            collects: [],
            playlists: [],
            comments: [],
            isLoading: true,
            isShowDesc: false,
            total: 0,
            limit:10,
            start:0,
            end:1,
            listSongs:'',
            id:','
        }
    },
    // 监听属性 类似于data概念
    computed: {
        ...mapGetters([
            'listOfSongs',
            'isActiveAlbum',
            'userId',
            'loginIn',
            'AsidePlayList'
        ])
    },
    created() {
        this.id = this.$route.query.id
        this.getLikedAlbum()
        this.$store.commit("setActiveName",'歌单');

    },
    // 方法集合
    methods: {
        currentChange (page) {
            this.start = page -1;
            this.end = page;
            this.$store.commit('setListOfSongs',(this.listSongs).slice(this.start*10,this.end*10))
        },
        // 数字过万的处理
        formartNum (val) {
            let num = 0
            if (val > 9999) {
                num = Math.round(val / 10000 * 10) / 10 + '万'
            } else {
                num = val
            }

            return num
        },
        // 时间毫秒格式化处理 2020-10-30 09:30:00
        formartDate (originVal, fmt) {
            const dt = new Date(originVal)
            const opt = {
                yyyy: dt.getFullYear(),
                MM: (dt.getMonth() + 1 + '').padStart(2, '0'),
                dd: (dt.getDate() + '').padStart(2, '0'),
                HH: (dt.getHours() + '').padStart(2, '0'),
                mm: (dt.getMinutes() + '').padStart(2, '0'),
                ss: (dt.getSeconds() + '').padStart(2, '0')
            }

            for (const k in opt) {
                const ret = new RegExp('(' + k + ')').exec(fmt)
                if (ret) {
                    fmt = fmt.replace(ret[1], opt[k])
                }
            }

            return fmt
        },
        // 歌曲毫秒格式化处理 03:30
        formatSongTime (duration = 0) {
            duration = duration / 1000
            const m = (Math.floor(duration / 60) + '').padStart(2, '0')
            const s = (Math.floor(duration % 60) + '').padStart(2, '0')
            return `${m}:${s}`
        },
        // 评论时间格式化处理
        formatMsgTime (duration) {
            let result = ''
            const NOW = new Date()
            const PAST = new Date(duration)

            // 判断是当天的时间 显示格式 10：30
            if (NOW.toDateString() === PAST.toDateString()) {
                result = this.formartDate(duration, 'HH:mm')
                // 时间为当年 显示月日 时间戳
            } else if (PAST.getFullYear() === NOW.getFullYear()) {
                result = this.formartDate(duration, 'MM月dd日 HH:mm')
            } else {
                result = this.formartDate(duration, 'yyyy年MM月dd日')
            }

            return result
        },
        _initialize(id) {
            // 歌单详情
            this.getDetail({id: id, s: 8})
            // 歌单收藏者
            this.getCollect({id: id, limit: 18})
            // 相关歌单推荐
            this.getRecom({id: id})
            // // 歌单评论
            this.getComment({id: id, limit: 9})
        },
        // 获取歌单中歌曲的列表
        getDetail(params) {
            this.isLoading = true
            playlistdetail(params).then(res => {
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }

                this.details = res.playlist
                const ids = res.playlist.trackIds
                this.getAllSongs(ids)
                // this.songList = this._formatSongs(res.playlist.tracks)
                // this.total = this.songList.length
                // this.isLoading = false
            })

        },
        // 根据ids获取所有歌曲列表
        getAllSongs(ids) {
            const sliceArr = []
            const num = 500

            // 数组过长 每500份一组
            for (let index = 0; index < ids.length; index += num) {
                sliceArr.push(ids.slice(index, index + num))
            }

            for (let i = 0; i < sliceArr.length; i++) {
                const arrs = []
                sliceArr[i].map(d => {
                    arrs.push(d.id)
                })
                this.isLoading = true
                songDetail({ids: arrs.join(','), timestamp: new Date().valueOf() + i}).then(res => {
                    // this.$store.commit('setListOfSongs',res.songs)
                    this.listSongs = res.songs;
                    this.$store.commit('setListOfSongs',(this.listSongs).slice(this.start*10,this.end*10))
                    this.total = res.songs.length
                    // idsArr = idsArr.concat(this._formatSongs(res))
                    // console.log(idsArr);
                })
            }
            this.isLoading = false
        },
        // 订阅该歌单的用户列表
        getCollect(params) {
            playlistSCollect(params).then(res => {
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }
                this.collects = res.subscribers
            })

        },
        // 相关歌单推荐
        getRecom(params) {
            playlistRelated(params).then(res => {
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }
                this.playlists = res.playlists
            })
        },
        // 歌单精彩评论
        getComment(params) {
            playlistComment(params).then(res => {
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }
                this.comments = res.comments
            })

        },
        // 歌单简介查看更多
        showAllDesc() {
            if (this.details.description.length > 120) {
                this.isShowDesc = !this.isShowDesc
            }
        },
        // 播放列表为当前歌单的全部歌曲
        playAllSongs() {
            const long = this.AsidePlayList.length
            const list = [...this.AsidePlayList,...this.listOfSongs];
            this.$store.commit("setAsidePlayList",list)
            this.toPlay(this.AsidePlayList[long].id,this.AsidePlayList[long].al.picUrl,long,this.AsidePlayList[long].name,this.AsidePlayList[long].ar[0].name)

        },
        // 收藏、取消歌单
        subPlayList () {
            if(!this.isActiveAlbum){
                if(this.loginIn){
                    const params ={
                        tid:this.$route.query.id,
                        user_id: this.userId,
                        time: (new Date()).getTime(),
                    }
                    subServeLikedAlbum(params).then(res =>{
                        if(res.status == 200){
                            this.$message.success('歌单收藏成功');
                            this.$store.commit('setIsActiveAlbum',true)
                        }
                    })
                }else {
                    this.$message.error('您还没有登录，请先登录')
                }
            } else {
                deleteLikedAlbum(this.id).then(res =>{
                    if(res.status == 200){
                        this.$message.success('取消收藏成功')
                        this.$store.commit('setIsActiveAlbum',false);
                    }else {
                        this.$message.error('取消收藏失败')
                    }
                })
            }


        },
        //获取收藏列表
        getLikedAlbum(){
            if(this.loginIn){
                getServeLikedAlbum(this.userId).then(res =>{
                    for(let item of res.data){
                        if(item.tid == this.$route.query.id){
                            this.$store.commit('setIsActiveAlbum',true);
                            break;
                        }
                    }
                })
            }
        }
    },
    watch: {
        $route(newId, oldId) {
            this.$store.commit('setIsActiveAlbum',false);
            this.getLikedAlbum()
            this.id = this.$route.query.id
            const id = this.$route.query.id
            // this.$store.commit('setIsActiveAlbum',false);
            if (id) {
                this.songList = []
                this.total = 0
                this._initialize(id)
            }
        },
        id(){
            this.$store.commit('setIsActiveAlbum',false);
        }
        // isLogin (newVal, oldVal) {
        //     if (newVal) {
        //         const ids = this.details.trackIds
        //
        //         this.getAllSongs(ids)
        //     } else {
        //         this.songList = this.details.tracks
        //         this.total = this.details.tracks.length
        //     }
        // }
    }
}
</script>
<style scoped lang="scss">
@import "src/assets/css/detail.scss";
</style>
