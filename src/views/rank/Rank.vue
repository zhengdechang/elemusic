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
                                {{rankInfo.name}} <span>({{formartDate(rankInfo.updateTime, 'MM月dd日')}} 更新)</span>
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
            ...mapGetters(['listOfSongs'])
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
            // listSongs
            this.listSongs.forEach((item,i) => {
                this.listOfSongs[i] = item
            })
            this.toPlay(this.listOfSongs[0].id,this.listOfSongs[0].al.picUrl,0,this.listOfSongs[0].name,this.listOfSongs[0].ar[0].name)

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
<style scoped lang="less">
.pagination {
    padding: 30px 0;
    text-align: center;
}
.rank{
    margin-top: 70px;
    margin-left: 110px;
    margin-right: 110px;
}
.rank-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    padding: 40px 0 0 0;
}
.rank-aside {
    width: 300px;
    padding: 0 20px 100px 0;

    .rank-type {
        box-shadow: 0 0 20px 0 rgba(65,67,70,.05);
    }
}
.rank-main {
    flex: 1;
    padding: 0 20px 100px;
    overflow: hidden;
}

.type-hd {
    display: flex;
    padding: 20px 0;
    margin: 0 20px;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;

    span {
        position: relative;
        display: inline-block;
        height: 20px;
        line-height: 20px;
        font-weight: 300;
        color: #333;
        cursor: pointer;

        &.active {
            font-weight: 600;
            color: #000;

            &::after {
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
.type-main {
    padding: 10px 0;
}
.type-item {
    display: flex;
    padding: 10px 20px;
    cursor: pointer;

    .item-img {
        width: 60px;
        height: 60px;
    }

    .item-info {
        flex: 1;
        align-items: center;
        padding-left: 20px;
    }

    .item-title {
        display: block;
        font-weight: bold;
        line-height: 30px;
        padding-bottom: 15px;
    }

    .item-time {
        font-size: 12px;
        line-height: 12px;
        color: #999;
    }

    &:hover {
        background: #f5f5f5;
    }

    &.active {
        background: #efefef;
    }
}

.rank-list-hd {
    display: flex;

    .rank-img {
        width: 150px;
        height: 150px;
        padding: 5px;
        border: 1px solid #eee;
    }

    .rank-info {
        flex: 1;
        padding-left: 40px;
    }

    .rank-title {
        padding-bottom: 20px;
        font-size: 24px;
        font-weight: bold;

        span {
            display: inline-block;
            padding-left: 10px;
            font-weight: normal;
            line-height: 22px;
            font-size: 14px;
            color: #999;
        }
    }

    .rank-desc {
        line-height: 22px;
        font-size: 14px;
        color: #999;
    }

    .rank-tags {
        padding-bottom: 5px;
        line-height: 16px;

        .tag {
            display: inline-block;
            margin-right: 5px;
            font-size: 12px;
            color: #ff641e;
        }
    }
    .rank-playCount, .rank-collect, .rank-comment {
        display: inline-block;
        padding: 0 20px 5px 0;
        line-height: 16px;
        font-size: 14px;
        color: #999;

        i {
            vertical-align: top;
        }
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
