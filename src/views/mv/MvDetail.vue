<template>
    <div class='mv-detail'>
        <div class="mv-video" :class="[isNight ? 'active' : '']">
            <div class="w1200">
                <div class="video-main">
                    <video-player
                        v-if="videoOptions.sources[0].src"
                        :options="videoOptions"
                        @play="onPlay"
                        @pause="onPause"
                        @seeking="onSeeking"
                        @qualityChange="onQualityChange"
                        />
                    <div class="mv-light" :class="[isNight ? 'active' : '']" @click="toggleLight">
                        <i class="iconfont" :class="[isNight ? 'icon-night' : 'icon-day']"></i>
                    </div>
                </div>
                <div class="mv-info">
                    <div class="mv-info-hd">
                        <div class="info-name">{{mvDetail.name}}</div>
                        <router-link :to="{ path: '/singer', query: { id: author.id }}" class="song-author" v-for="(author, k) in mvDetail.artists" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
                        <div class="mv-info-count">
                            <span class="info-count">播放量：{{formartNum(mvDetail.playCount)}}</span><span class="info-time">发布时间：{{mvDetail.publishTime}}</span>
                        </div>
                    </div>
                    <div class="mv-desc">
                        {{mvDetail.briefDesc ? mvDetail.briefDesc : '暂无简介'}}
                    </div>
                </div>
            </div>
        </div>
        <div class="w1200">
            <div class="mv-container">
                <div class="mv-main">
                    <Comments :type="type" :id="mId"></Comments>
                </div>
                <div class="mv-aside">
                    <div class="simi-mv">
                        <h3 class="aside-title">相似MV</h3>
                        <div class="aside-main mv-main">
                            <div class="item" :key="'' + item.id + index" v-for="(item, index) in simiMv">
                                <router-link :to="{ path: '/mv', query: { id: item.id }}" class="faceImg">
                                    <i class="iconfont icon-play"></i>
                                    <el-image :src="item.cover || item.imgurl">
                                        <div slot="placeholder" class="image-slot">
                                            <i class="iconfont icon-placeholder"></i>
                                        </div>
                                    </el-image>
                                </router-link>
                                <div class="info">
                                    <router-link :to="{ path: '/mv', query: { id: item.id }}" class="mv-name">{{item.name}}</router-link>
                                    <router-link :to="{ path: '/singer', query: { id: item.artistId }}" class="mv-author" v-if="!item.publishTime">{{item.artistName}}</router-link>
                                    <div class="mv-playCount"><i class="iconfont icon-video"></i> {{formartNum(item.playCount)}}</div>
                                    <div class="mv-time" v-if="item.publishTime">发布时间：{{item.publishTime}}</div>
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
import videoPlayer from '../../components/common/Video'
import Comments from "../../components/common/Comment";
import {mvDetail, mvUrl,simiMv} from "../../networks/index";
export default {
    name: 'MvDetail',
    components: {
        Comments,
        videoPlayer,
    },
    data () {
        // 这里存放数据
        return {
            mId: this.$route.query.id,
            mvDetail: {},
            type: 1, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
            videoOptions: {
                sources: [{
                    type: '',
                    src: '' // url地址
                }],
                qualityList: [],
                quality: 1080,
            },
            currentTime: 0, // 当前视频播放的时长
            simiMv: [],
            isNight: false
        }
    },
    // 监听属性 类似于data概念
    computed: {
    },
    created() {
        // this.$router.go(0);
        this.$store.commit('setActiveName','MV')
    },
    mounted () {
        this.init()
        this.getMvDetail()
        this.getSimiMv();
        this.getMvUrl();
    },
    // 方法集合
    methods: {
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
        getMvDetail () {
            // mvDetail({ id: this.$route.query.id }).then(res =>{
            //     if (res.code !== 200) {
            //         return this.$message.error('数据请求失败')
            //     }
            //     this.mvDetail = res.data
            //     this.videoOptions.qualityList = res.data.brs
            //     this.videoOptions.quality = res.mp
            // })
        },
        //获取mv地址
        getMvUrl (r) {
            mvUrl({ id: this.$route.query.id, r }).then(res =>{
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }
                const src =res.data.url
                this.$set(this.videoOptions.sources, 0, {
                    type: 'video/mp4',
                    src: src
                })
            })

        },
        //获取相似Mv
        getSimiMv(){
            simiMv( {id:this.$route.query.id} ).then(res =>{
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }
                this.simiMv = res.mvs
            })
        },
        init () {
            this.currentTime = 0
            mvDetail({ id: this.$route.query.id}).then(res =>{
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }
                this.mvDetail = res.data
                this.videoOptions.qualityList = res.data.brs
                this.videoOptions.quality = { br: res.mp.dl }
            })
            mvUrl({ id:this.$route.query.id}).then(res =>{
                const src = res.url
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }
                this.$set(this.videoOptions.sources, 0, {
                    type: 'video/mp4',
                    src: src
                })
            })
        },
        onPlay (play) {
            play.currentTime(this.currentTime)
        },
        onSeeking (play) {
            this.currentTime = play.currentTime()
        },
        onPause (play) {
            this.currentTime = play.currentTime()
            play.pause()
        },
        onQualityChange (play) {
            // 切换清晰度时候的后续操作
            // 暂停MV播放
            this.onPause(play)
            // 记录当前播放时长
            this.currentTime = play.currentTime()
            // 重新设置视频url
            this.getMvUrl(play.quality.val)
        },
        //改变亮度
        toggleLight () {
            this.isNight = !this.isNight
        }
    },
    watch: {
        $route (newId, oldId) {
            this.mId = this.$route.query.id
            if (this.mId) {
                this.init()
            }
        }
    }
}
</script>
<style scoped lang="scss">
@import "src/assets/css/mvdetail.scss";
</style>
