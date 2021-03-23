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
        </div>
        <template v-if="isLoading">
            <Loading />
        </template>
        <template v-else class="container">
            <album-content :songList="listOfSongs" :stripe="true"  v-if="type == 'song'"></album-content>
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
            playAllSongs() {
                // listSongs
                this.listSongs.forEach((item,i) => {
                    this.listOfSongs[i] = item
                })
                this.toPlay(this.listOfSongs[0].id,this.listOfSongs[0].al.picUrl,0,this.listOfSongs[0].name,this.listOfSongs[0].ar[0].name)

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
<style scoped lang="less">
    a {
        text-decoration: none;
        color: #333;
      }
    .faceImg{
            width: 120px;
            height: 120px;
            border-radius: 100%;
            overflow: hidden;
    }
    .loadArtist {
        display: flex;
        flex-wrap: wrap;
        .item{
            width: 120px;
            margin-right: 70px;
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
    .playlist,.album{
        margin-right: 40px;
    }
    /*.album{*/
    /*    margin-right: 40px;*/
    /*}*/
    .pagination {
        padding: 30px 0;
        text-align: center;
    }
    .cover {
        display: flex;
    }
    .cover-img {
        position: relative;
        width: 200px;
        height: 200px;

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            width: 100%;
            height: 100%;
            content: '';
            transform: scale(.95) translateX(5%);
            background: #f0f0f0;
        }
    }
    .cover-info {
        flex: 1;
        padding-left: 40px;

        .cover-title {
            font-size: 24px;
            font-weight: bold;
        }
    }
    .cover-author {
        padding: 15px 0 10px;

        .cover-avatar {
            display: inline-block;
            width: 32px;
            height: 32px;
            border-radius: 100%;
            vertical-align: top;
        }

        .cover-name, .cover-date {
            display: inline-block;
            padding: 0 10px;
            line-height: 32px;
        }

        .cover-date {
            color: #999;
        }
    }
    .cover-tags {
        padding-bottom: 5px;
        line-height: 16px;

        .tag {
            display: inline-block;
            margin-right: 5px;
            font-size: 12px;
            color: #ff641e;
        }
    }
    .cover-playCount, .cover-collect, .cover-comment {
        display: inline-block;
        padding: 0 20px 5px 0;
        line-height: 16px;
        font-size: 14px;
        color: #999;

        i {
            vertical-align: top;
        }
    }
    .cover-desc {
        position: relative;

        h5 {
            padding: 10px 0 5px;
            line-height: 20px;
            font-size: 14px;
            color: #333;
        }

        .desc-close {
            position: absolute;
            top: 30px;
            right: 0;
            z-index: 2;
            cursor: pointer;
        }

        p {
            line-height: 22px;
            font-size: 14px;
            color: #999;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
            cursor: pointer;
        }

        .cover-desc-all {
            position: absolute;
            top: 50px;
            left: 10px;
            z-index: 1;
            width: calc(~'100% - 20px');
            padding: 10px;
            margin: -10px;
            max-height: 250px;
            line-height: 22px;
            font-size: 14px;
            white-space: pre-line;
            font-family: inherit;
            color: #999;
            background: #fff;
            overflow-y: scroll;
            box-shadow: 0 2px 10px 0 rgba(52, 52, 52, 0.1);
        }
    }
    .song-header {
        display: flex;
        padding: 30px 0 10px;

        h4 {
            flex: 1;
            font-size: 20px;
            line-height: 40px;

            em {
                display: inline-block;
                padding-left: 10px;
                font-size: 12px;
                line-height: 14px;
                font-style: normal;
                font-weight: normal;
                color: #666;
                vertical-align: baseline;
            }
        }

        span {
            display: flex;
            line-height: 16px;
            align-items: center;
            justify-content: center;
            border-radius: 50px;
            padding: 7px 20px;
            cursor: pointer;
            margin: 5px 0 5px 15px;
            transition: all .4s;
            background: #f0f0f0;
            color: #333;

            i {
                margin-right: 3px;
            }
        }

        .play-all {
            color: #fff;
            background: #ff641e;

            i {
                color: #fff;
            }
        }

        .collect.active, .collect.active i {
            color: #ff641e;
        }
    }
</style>
