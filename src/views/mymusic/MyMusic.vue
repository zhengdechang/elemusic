<template>
    <div class='my-music'>
        <div class="cover">
            <div class="cover-img">
                <el-image :src="baseUrl+userId">
                    <div slot="placeholder" class="image-slot">
                        <i class="iconfont icon-placeholder"></i>
                    </div>
                </el-image>
            </div>
            <div class="cover-info">
                <div class="cover-title">
                    收藏的歌曲
                </div>
                <div class="cover-author">
                    <el-image :src="baseUrl+userId" class="cover-avatar">
                        <div slot="placeholder" class="image-slot">
                            <i class="iconfont icon-placeholder"></i>
                        </div>
                    </el-image>
                    <div class="cover-name">{{userInfo.username}}</div>
                    <div class="cover-date">{{formartDate(time, 'yyyy-MM-dd')}}</div>
                </div>
                <div class="cover-digital">
                    <span class="cover-playCount"><i class="iconfont icon-playnum"></i> 0次</span>
                    <span class="cover-collect"><i class="iconfont icon-collect"></i> 0</span>
                    <span class="cover-comment"><i class="iconfont icon-comment"></i> 6</span>
                </div>
            </div>
        </div>
        <div class="song-header">
            <h4>{{this.list[type]}}列表 <em v-if="type == 'song'">{{total + '首歌'}}</em></h4>
            <span class="play-all" @click="playAllSongs"><i class="iconfont icon-audio-play"></i> 播放全部</span>
        </div>
        <template v-if="isLoading">
            <Loading />
        </template>
        <template v-else class="container">
            <album-content :songList="listOfSongs" :stripe="true"  v-if="this.data&&type == 'song'"></album-content>
            <play-list :playList="playlist_list" :stripe="true"  v-if="type == 'album'"></play-list>
            <div class="loadArtist"  stripe="true"  v-if="type == 'artist'">
                <router-link :to="{ path: '/artist', query: { id: item.id }}" class="item" :key="item.id" v-for="item in artist_list" >
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
            <AlbumList  :albumList="album_list" :stripe="true"  v-if="type == 'collection'"></AlbumList>
            <div class="pagination" v-if="type == 'song'" >
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
</template>

<script>
    import {mapGetters} from "vuex"
    import {mixin} from "../../mixins";
    import {
        album, artistAlbum,
        getServeLikedAlbum, getServeLikedArtist,
        getServeLikedCollection,
        getServeLikedSong,
        playlistdetail,
        songDetail
    } from "../../networks/index"
    import Loading from "../../components/common/Loading";
    import AlbumContent from "../../components/common/AlbumContent";
    import PlayList from "../../components/common/PlayList";
    import AlbumList from "../../components/common/AlbumList";
    export default {
        components: {
            AlbumContent,
            Loading,
            PlayList,
            AlbumList,
        },
        mixins:[mixin],
        data () {
            // 这里存放数据
            return {
                type:'song',
                limit:10,
                offset:2,
                details: {},
                songList: [],
                total: 0,
                isLoading: true,
                isShowDesc: false,
                start:0,
                end:1,
                listSongs:'',
                data:[],
                baseUrl:'http://localhost:3001/admin/api/user/getImg/',
                userInfo:'',
                time:0,
                list:{
                    'song':'歌曲',
                    'album':'歌单',
                    'artist':'歌手',
                    'collection':'专辑',
                },
                ids:[],
                playlist_list:[],
                album_list:[],
                artist_list:[],
            }
        },
        created() {
            this.type = this.$route.query.type;
            this.getUserInfo();
        },
        // 监听属性 类似于data概念
        computed: {
            ...mapGetters([
                'listOfSongs',
                'userId',
            ])
        },
        mounted () {
        },
        // 方法集合
        methods: {
            //获取收藏
            getUserInfo(){
                //歌曲
                if(this.type == 'song'){
                    getServeLikedSong(this.userId).then(res =>{
                        this.data = res.data;
                        this.userInfo = res.data[0].user_id;
                        this.time = Number(res.data[0].time);
                        for(let i=0;i<res.data.length;i++){
                            this.ids.push(res.data[i].tid)
                        }
                        songDetail({ids: this.ids.join(','), timestamp: new Date().valueOf()}).then(res =>{
                            this.listSongs = res.songs;
                            this.$store.commit('setListOfSongs',(this.listSongs).slice(this.start*10,this.end*10))
                            this.total = res.songs.length
                        })
                    })
                }
                //歌单
                else if(this.type == 'album'){
                    getServeLikedAlbum(this.userId).then(res =>{
                        this.data = res.data;
                        this.userInfo = res.data[0].user_id;
                        this.time = Number(res.data[0].time);
                        this.ids = [];
                        for(let i=0;i<res.data.length;i++){
                            this.ids.push(res.data[i].tid);
                        }
                        for(let i=0;i<this.ids.length;i++){
                            playlistdetail({id:this.ids[i]}).then(res =>{
                                this.playlist_list.push(res.playlist)
                            })
                        }
                    })
                }
                //专辑
                else if(this.type == 'collection'){
                    getServeLikedCollection(this.userId).then(res =>{
                        this.data = res.data;
                        this.userInfo = res.data[0].user_id;
                        this.time = Number(res.data[0].time);
                        this.ids = [];
                        for(let i=0;i<res.data.length;i++){
                            this.ids.push(res.data[i].tid);
                        }
                        for(let i=0;i<this.ids.length;i++){
                            album({id:this.ids[i]}).then(res =>{
                                this.album_list.push(res.album)
                            })
                        }
                    })
                }
                //专辑
                else if(this.type == 'artist'){
                    getServeLikedArtist(this.userId).then(res =>{
                        this.data = res.data;
                        this.userInfo = res.data[0].user_id;
                        this.time = Number(res.data[0].time);
                        this.ids = [];
                        for(let i=0;i<res.data.length;i++){
                            this.ids.push(res.data[i].tid);
                        }
                        for(let i=0;i<this.ids.length;i++){
                            artistAlbum({id:this.ids[i]}).then(res =>{
                                this.artist_list.push(res.artist)
                            })
                        }
                    })
                }
                this.isLoading = false
            },
            // 分页
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
            // 播放列表为当前歌单的全部歌曲
            // 播放列表为当前歌单的全部歌曲
            playAllSongs() {
                const long = this.AsidePlayList.length
                const list = [...this.AsidePlayList,...this.listOfSongs];
                this.$store.commit("setAsidePlayList",this.unique(list))
                this.toPlay(this.AsidePlayList[long].id,this.AsidePlayList[long].al.picUrl,long,this.AsidePlayList[long].name,this.AsidePlayList[long].ar[0].name)
            },
            // 歌单简介查看更多
            showAllDesc () {
                if (this.details.description.length > 88) {
                    this.isShowDesc = !this.isShowDesc
                }
            },
            // 处理歌曲
            _formatSongs (list) {
                const ret = []
                list.songs.map((item, index) => {
                    if (item.id) {
                        // 是否有版权播放
                        item.license = !list.privileges[index].cp
                    }
                })
                return ret
            },
        },
        watch: {
            $route () {
                this.type = this.$route.query.type
                this.getUserInfo()
            }
        }
    }
</script>
<style scoped lang="scss">
@import "src/assets/css/my-music";
</style>
