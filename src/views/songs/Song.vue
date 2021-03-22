<template>
    <div v-if="info" class="song-container">
        <div class="w1200">
            <div class="song-sidebar">
                <div class="sidebar">
                    <div class="cover">
<!--                        <div class="cover-img" :class="[isCurSong ? 'active' : '']" @click.stop="plyaing(info)">-->
                        <div class="cover-img" >
                            <img src="../../assets/img/stylus.png" class="cover-stylus" />
                            <el-image :src="info.al.picUrl">
                                <div slot="placeholder" class="image-slot">
                                    <i class="iconfont icon-placeholder"></i>
                                </div>
                            </el-image>
                        </div>
                        <div class="cover-desc" v-if="coverDesc">
                            <h5>专辑简介</h5>
                            <p>{{coverDesc}}</p>
                        </div>
                        <div class="simi-song">
                            <h6>相似歌曲</h6>
                            <div class="simi-main">
                                <div class="simi-item" v-for="simiItem in simiSong" :key="simiItem.id">
                                    <div class="simi-info">
                                        <router-link class="simi-name" :to="{ path: '/song', query: { id: simiItem.id }}">
                                            {{ simiItem.name }}
                                        </router-link>
                                        <div class="simi-author"><router-link :to="{ path: '/artist', query: { id: author.id }}" class="song-author" v-for="(author, k) in simiItem.artists" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="song-main">
                <h3 class="song-name">
                    {{info.name}}
                    <router-link class="mv-name" :to="{ path: '/mv', query: { id: info.mvId }}" v-if="info.mvId">
                        <i class="iconfont icon-video"></i>
                    </router-link>
<!--                    <i v-if="info.vip" class="iconfont icon-vip"></i>-->
<!--                    <div class="audio-icon" v-if="isCurSong">-->
<!--                        <div class="column" style="animation-delay: -1.2s;"></div>-->
<!--                        <div class="column"></div>-->
<!--                        <div class="column" style="animation-delay: -1.5s;"></div>-->
<!--                        <div class="column" style="animation-delay: -0.9s;"></div>-->
<!--                        <div class="column" style="animation-delay: -0.6s;"></div>-->
<!--                    </div>-->
                </h3>
                <p><router-link :to="{ path: '/artist', query: { id: author.id }}" class="song-author" v-for="(author, k) in info.singer" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link></p>
                <p class="song-info">
                    <span>专辑：<router-link class="song-album" :to="{ path: '/album', query: { id: info.al.id }}">{{ info.al.name }}</router-link></span>
                    <span>发行时间：<em>{{formartDate(info.publishTime,'yyyy年MM月dd日')}}</em></span>
                </p>
                <div class="song-oper">
                    <span :class="['play-btn','play-all', songDisable]" @click="playing1(info)"><i :class="['iconfont']"></i> {{info.vip ? 'VIP尊享' : '立即播放'}}</span>
                    <template>
                        <span class="play-btn play-collect,isActiveSong? 'active' : ''" @click="subSong"><i :class="['iconfont','icon-collect' + (isActiveSong ? '-active' : '')]"></i>  {{ isActiveSong? '已收藏' : '收藏'}}</span>
<!--                        <span :class="['singer-btn', 'singer-collect', isActiveArtist? 'active' : '']" @click="subArtist()"><i :class="['iconfont', 'icon-collect' + (isActiveArtist ? '-active' : '')]"></i> {{ isActiveArtist? '已收藏' : '收藏'}}</span>-->
                    </template>
<!--                    <el-popover placement="bottom" trigger="click" ref="popAddList" v-else>-->
<!--                        <span class="play-btn play-collect" slot="reference"><i class="iconfont icon-collect"></i> 收藏</span>-->
<!--&lt;!&ndash;                        <add-list :tracks="info.id" @closeAddListPop="closeAddListPop"></add-list>&ndash;&gt;-->
<!--                    </el-popover>-->
                    <span class="play-btn play-comment" @click="jumpComment"><i class="iconfont icon-comment"></i> 评论</span>
                </div>
                <div class="song-lyric">
                    <SongShowLyric :sId="sId" local="page"></SongShowLyric>
                </div>
                <div class="song-comments" ref=comment>
                    <Comments  :type="type" :id="sId"></Comments>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex"
import {mixin} from "../../mixins";
import SongShowLyric from "../lyric/SongShowLyric";
import {songDetail, simiSong, subServeLikedSong, deleteLikedSong, getServeLikedSong} from '../../networks/index'
import Comments from "../../components/common/Comment";
export default {
    name: 'song-detail',
    components: {
        Comments,
        // Lyrics,
        // Comments,
        // addList
        SongShowLyric
    },
    mixins:[mixin],
    data () {
        // 这里存放数据
        return {
            info: null,
            sId: '0',
            type: 0, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
            simiSong: [],
            background:'',
            tid:'',
        }
    },
    created () {
        this.tid = this.$route.query.id;
     },
    mounted () {
        this.sId = String(this.$route.query.id)
        this.init()
        window.addEventListener('scroll', this.handleScroll, true)
        this.backGround();
    },
    // 监听属性 类似于data概念
    computed: {
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
        ...mapGetters([
            'listOfSongs',
            'isActiveSong',
            'userId',
            'loginIn',
        ]),
        songDisable () {
            return (this.info.license || this.info.vip) ? 'disable' : ''
        },
        // 显示歌曲简介
        coverDesc () {
            return this.info.alia.join(' / ')
        },
    },
    // 方法集合
    methods: {
        //背景
        backGround(){
            const bg =  document.getElementsByClassName('song-container');
            bg.style = "background-image:url('"+this.background+"')";
        },
        //获取歌曲详情
        getSongDetail () {
            songDetail({ ids: this.sId, timestamp: new Date().valueOf() }).then(res =>{
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }
                // 是否有版权播放
                // res.songs[0].license = !res.privileges[0].cp
                this.info = res.songs[0];
                this.background = this.info.al.picUrl
            })
        },
        // 获取相似音乐
        getSimiSong () {
            simiSong({ id: this.sId }).then(res =>{
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }

                this.simiSong = res.songs
            })
        },
        playing1(params) {
            this.listOfSongs.unshift(params)
            console.log(params);
            this.toPlay(params.id,params.al.picUrl,0,params.name,params.ar[0].name)
        },
        //点击评论跳到评论框
        jumpComment () {
            this.$refs.comment.scrollIntoView(true)
        },
        init () {
            this.getSongDetail()
            this.getSimiSong()
        },
        subSong() {
                if (!this.isActiveSong) {
                    if (this.loginIn) {
                        const params = {
                            user_id: this.userId,
                            tid: this.tid,
                            time: (new Date()).getTime(),
                        }
                        subServeLikedSong(params).then(res => {
                            if (res.status == 200) {
                                this.$store.commit("setIsActiveSong", true)
                                this.$message.success('收藏成功');
                            } else {
                                this.$message.success('收藏失败');
                            }
                        })
                    } else {
                        this.$message.error('您还没有登录，请先登录')
                    }
                } else {
                    deleteLikedSong(this.tid).then(res =>{
                        if(res.status == 200){
                            this.$message.success('取消收藏成功')
                            this.$store.commit('setIsActiveSong',false)
                        }else {
                            this.$message.error('取消收藏失败')
                        }
                    })
                }
        },
        getSong(){
            if(this.loginIn){
                getServeLikedSong(this.userId).then(res =>{
                    for(let item of res.data){
                        if(item.tid == this.$route.query.id){
                            this.$store.commit('setIsActiveSong',true);
                            break;
                        }
                    }
                })
            }
        }
    },
    watch: {
        $route: {
            handler () {
                this.sId = this.$route.query.id
                this.init()
            },
            deep: true
        },
        tid(){
            this.$store.commit('setIsActiveSong',false)
        }
    }
}
</script>
<style scoped lang="less">
a {
    text-decoration: none;
    color: #333;
}
.song-container {
    padding: 40px 0;
    margin-top: 70px;

    .song-sidebar {
        position: fixed;
        width: 310px;
        margin-left: 160px;
    }

    .song-main {
        position: relative;
        margin-left: 650px;
    }
}

.cover {
    position: relative;
}

.cover-img {
    margin-left: 30px;
    position: relative;
    width: 190px;
    padding: 40px;
    font-size: 0;
    background: url('../../assets/img/disc_bg.png') no-repeat;
    background-size: contain;
    cursor: pointer;

    .cover-stylus {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
        display: inline-block;
        width: 30px;
        height: 120px;
        transition: all .3s;
        transform-origin: 23px 5px;
        transform: rotateZ(-30deg);
    }

    .el-image {
        width: 190px;
        height: 190px;
        border-radius: 100%;
        animation: soundPaying 15s linear infinite;
        animation-play-state: paused;
    }



    &.active {
        .cover-stylus {
            transform: rotateZ(0);
        }

        .el-image {
            animation-play-state: running;
        }
    }

     &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2;
        width: 30px;
        height: 30px;
        border-radius: 100%;
        transform: translate(-50%,-50%);
        background: #000;
        box-shadow: 0px 2px 10px 20px rgba(150, 150, 150, 0.5);
    }

    .iconfont {
        position: absolute;
        z-index: 3;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        color: #fff;
    }
}

.cover-desc {
    text-align: center;

    h5 {
        margin-top: 40px;
        margin-bottom: 10px;
        font-size: 22px;
        font-weight: 600;
        height: 30px;
        line-height: 30px;
    }

    p {
        width: 100%;
        font-size: 14px;
        color: #999;
        line-height: 21px;
        word-break: break-all;
    }
}

.simi-song {
    padding-left: 77px;
    h6 {
        margin-top: 20px;
        margin-bottom: 10px;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
    }
    .simi-name {
        line-height: 20px;
        font-size: 12px;
        color: #000;
    }

    .simi-author {
        font-size: 0;

        a {
            font-size: 12px;
            color: #999;
        }
    }

    .simi-item {
        display: flex;
        padding-top: 5px;
        border-bottom: 1px solid #f2f2f2;
        margin-bottom: 5px;
    }

    .simi-info {
        flex: 1;
    }

    .simi-song-status {
        line-height: 48px;

        i {
            cursor: pointer;
        }
    }
}

.song-name {
    font-size: 40px;
    line-height: 100px;
    padding-top: 30px;

    .iconfont {
        margin-right: 10px;
        font-size: 24px;
        color: #ff641e;
    }

    .audio-icon {
        display: inline-flex;
    }
}
.song-author {
    display: inline-block;
    font-size: 18px;
    color: #666;
    line-height: 18px;
}

.song-info {
    padding: 20px 0;
    font-size: 0;
    color: #999;

    span {
        display: inline-block;
        padding-right: 30px;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
    }

    a, em {
        color: #333;
        font-style: normal;
    }
}

.song-oper {
    .play-btn {
        display: inline-block;
        line-height: 16px;
        align-items: center;
        border-radius: 50px;
        padding: 7px 15px;
        cursor: pointer;
        margin: 5px 15px 5px 0;
        color: #333;
    }
    .play-btn {
        &.active, .icon-collect-active {
            color: red;
        }
    }

    .play-all {
        color: #fff;
        background: #ff641e;
        i {
            color: #fff;
        }
    }

    .disable {
        background: #ccc;
        cursor: not-allowed;
    }
}

@keyframes soundPaying {
    from {
        -webkit-transform: rotate(10deg);
        transform: rotate(10deg)
    }

    to {
        -webkit-transform: rotate(370deg);
        transform: rotate(370deg)
    }
}

.song-lyric {
    margin: 30px 0 10px;
    overflow-y: auto;
}

.song-comments {
    margin: 10px 0 30px;
}
</style>
