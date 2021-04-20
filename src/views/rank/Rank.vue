<template>
    <div class='rank'>
        <div class="w1200">
            <div class="rank-container">
                <div class="rank-aside">
                    <div class="rank-type">
                        <div class="type-hd">
                            <span :class="type === 'Top' ? 'active' : ''" @click="selectType('Top')">TOP榜</span>
                            <span :class="type === 'Feature' ? 'active' : ''" @click="selectType('Feature')">特色榜</span>
                            <span :class="type === 'Other' ? 'active' : ''" @click="selectType('Other')">场景榜</span>
                        </div>
                        <div class="type-main">
                            <div class="type-item" :class="rId == item.id ? 'active' : ''" v-for="(item, index) in list" :key="index" @click="selectItem(item)">
                                <el-image class="item-img" :src="item.coverImgUrl">
                                    <div slot="placeholder" class="image-slot">
                                        <i class="iconfont icon-placeholder"></i>
                                    </div>
                                </el-image>
                                <div class="item-info">
                                    <div class="item-title">
                                        {{item.name}}
                                    </div>
                                    <div class="item-time">
                                        {{item.updateFrequency}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rank-main">
                    <div class="rank-list-hd">
                        <el-image class="rank-img" :src="rankInfo.coverImgUrl">
                            <div slot="placeholder" class="image-slot">
                                <i class="iconfont icon-placeholder"></i>
                            </div>
                        </el-image>
                        <div class="rank-info" v-if="rankInfo">
                            <div class="rank-title">
                                {{rankInfo.name}} <span>({{format(rankInfo.updateTime, 'MM月DD日')}} 更新)</span>
                            </div>
                            <div class="rank-tags" v-if="rankInfo.tags">
                                <router-link :to="{ path: '/song-list', query: { cat: tag }}" class="tag" v-for="(tag, index) in rankInfo.tags" :key="index">#{{tag}}</router-link>
                            </div>
                            <div class="rank-digital">
                                <span class="rank-playCount"><i class="iconfont icon-playnum"></i> {{formartNum(rankInfo.playCount)}}次</span>
                                <span class="rank-collect"><i class="iconfont icon-collect"></i> {{formartNum(rankInfo.subscribedCount)}}</span>
                                <span class="rank-comment"><i class="iconfont icon-comment"></i> {{formartNum(rankInfo.commentCount)}}</span>
                            </div>
                            <div class="rank-desc">
                                {{rankInfo.description}}
                            </div>
                        </div>
                    </div>
                    <div class="song-header">
                        <h4>歌曲列表 <em>{{total + '首歌'}}</em></h4>
                        <span class="play-all" @click="playAllSongs"><i class="iconfont icon-audio-play"></i> 播放全部</span>
                    </div>
                    <template v-if="isLoading">
                        <Loading />
                    </template>
                    <template v-else>
                        <AlbumContent :songList="listOfSongs" :stripe="true"></AlbumContent>
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
        </div>
    </div>
</template>

<script>
import Loading from "../../components/common/Loading"
import AlbumContent from "../../components/common/AlbumContent";
import {listDetail, topListDetail} from "../../networks";
import { mapGetters } from 'vuex'
import {mixin} from "../../mixins";
export default {
    name: 'Rank',
    components: {
        AlbumContent,
        Loading
    },
    mixins:[mixin],
    data () {
        // 这里存放数据
        return {
            list: [],
            type: 'Top',
            listTop: [],
            listFeature: [],
            listOther: [],
            rId: 0,
            rankInfo: {},
            songList: [],
            isLoading: true,
            total: 0,
            limit:10,
            start:0,
            end:1,
            listSongs:'',
        }
    },
    // 监听属性 类似于data概念
    computed: {
            ...mapGetters([
                'listOfSongs',
                'AsidePlayList',
            ])
    },
    activated(){
        //使用keep-alive代替触发周期函数的内容
        this.$store.commit('setActiveName','排行榜');
    },
    created () {
        this.rId = this.$route.query.rId
        this.type = this.$route.query.type ? this.$route.query.type : this.type
    },
    mounted () {
        this.getTopListDetail()
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
        //获取排行榜详情
        getTopListDetail () {
            topListDetail().then(res =>{
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }

                // 云音乐TOP榜
                this.listTop = res.list.filter(item => {
                    return item.ToplistType
                })
                // 云音乐特色榜
                this.listFeature = res.list.filter(item => {
                    return !item.ToplistType && item.name.indexOf('云音乐') >= 0
                })
                // 其他场景榜
                this.listOther = res.list.filter(item => {
                    return !item.ToplistType && item.name.indexOf('云音乐') < 0
                })

                this.list = this.type ? this['list' + this.type] : this.listTop
                this.rId = this.rId ? this.rId : this.listTop[0].id
            })

        },
        //获取排行榜单详情
        getListDetail () {
            this.isLoading = true
            listDetail({ id: this.rId, s: -1 }).then(res =>{
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }

                this.rankInfo = res.playlist

                this.listSongs = res.playlist.tracks;
                console.log(this.listSongs);
                this.$store.commit('setListOfSongs',(this.listSongs).slice(this.start*10,this.end*10))

                this.total = res.playlist.tracks.length
                // this.songList = this._formatSongs(res.playlist.tracks, res.privileges)
                // this.total = this.songList.length
                this.isLoading = false
            })

        },
        //选择类型
        selectType (type) {
            this.type = type
            this.list = this['list' + this.type]
            this.rId = this['list' + type][0].id
            this.$router.push({ path: 'rank', query: { type: this.type, rId: this.rId } })
        },
        //选择类型中的item
        selectItem (item) {
            this.rId = item.id
            this.$router.push({ path: 'rank', query: { type: this.type, rId: this.rId } })
        },
        // 播放列表为当前歌单的全部歌曲
        playAllSongs() {
            const long = this.AsidePlayList.length
            const list = [...this.AsidePlayList,...this.listOfSongs];
            this.$store.commit("setAsidePlayList",this.unique(list))
            this.toPlay(this.AsidePlayList[long].id,this.AsidePlayList[long].al.picUrl,long,this.AsidePlayList[long].name,this.AsidePlayList[long].ar[0].name)
        },
        // 处理歌曲
        _formatSongs (list, privileges) {
            const ret = []
            list.map((item, index) => {
                if (item.id) {
                    // 是否有版权播放
                    item.license = !privileges[index].cp
                    ret.push(item)
                }
            })
            return ret
        },
    },
    watch: {
        rId (newVal, oldVal) {
            this.rId = newVal

            if (this.rId) {
                this.getListDetail()
            }
        }
    }
}
</script>
<style scoped lang="scss">
@import "../../assets/css/rank.scss";
</style>
