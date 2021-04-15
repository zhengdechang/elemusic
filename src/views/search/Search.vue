<template>
    <div class='search'>
        <div class="search-hd">
            <div class="w1200">
                <div class="search-box" @keyup.enter="jumpSearch(keyVal)">
                    <el-popover
                        ref="popover"
                        placement="bottom-start"
                        trigger="manual"
                        width="626"
                        visible-arrow="false"
                        v-model="isShowSearch"
                        v-clickoutside="handleClose">
                            <el-input
                                class="search-inp"
                                slot="reference"
                                placeholder="请输入歌名、歌词、歌手或专辑"
                                v-model="keyVal"
                                @focus="getListHandle"
                                @input="getListHandle"
                                clearable>
                            </el-input>
                            <template>
                                <div class="search-key-list">
                                    <div class="search-item" v-for="(item, index) in suggestInfo.order" :key="index">
                                        <h6>{{listType[item]}}</h6>
                                        <div class="item-main">
                                            <div class="list" v-for="(val, k) in suggestInfo[item]" :key="k" @click="jumpPage(val, item)">
                                                {{val.name}}
                                                <template v-if="item === 'songs'">
                                                    -<span v-for="(a, i) in val.artists" :key="i">{{a.name + (i !== 0 ? ' / ' : '')}}</span>
                                                </template>
                                                <template v-else-if="item === 'albums'">
                                                    -<span>{{val.artist.name}}</span>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                    </el-popover>
                    <i class="iconfont icon-soushuo"  @click="jumpSearch(keyVal)" ></i>
                    <div class="search-history" v-if="history.length">
                        <span>历史搜索：</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="w1200">
            <div class="search-main">
                <div class="search-tab">
                    <h2>搜索结果<em>({{searchInfo}})</em></h2>
                    <div class="type">
                        <span :class="type === '1' ? 'active' : ''" @click="selectType('1')">单曲</span>
                        <span :class="type === '10' ? 'active' : ''" @click="selectType('10')">专辑</span>
                        <span :class="type === '100' ? 'active' : ''" @click="selectType('100')">歌手</span>
                        <span :class="type === '1000' ? 'active' : ''" @click="selectType('1000')">歌单</span>
                        <span :class="type === '1004' ? 'active' : ''" @click="selectType('1004')">MV</span>
                    </div>
                </div>
                <div class="search-list">
                    <album-content :songList="list" :stripe="true" :offset="offset" v-if="type === '1'">
                        <template slot="title">搜索列表</template>
                    </album-content>
                    <album-list :albumList="list" v-if="type === '10'"></album-list>
                    <artist-list :artistList="list" v-if="type === '100'"></artist-list>
                    <play-list :playList="list" v-if="type === '1000'"></play-list>
                    <mv-list :mvList="list" v-if="type === '1004'"></mv-list>
                    <video :videoList="list" v-if="type === '1014'"></video>
                </div>
                <div class="pagination">
                    <el-pagination
                        background
                        @current-change="currentChange"
                        :current-page="currentpage"
                        :page-size="limit"
                        layout="prev, pager, next"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AlbumContent from "../../components/common/AlbumContent";
import AlbumList from "../../components/common/AlbumList";
import MvList from "../../components/common/MvList";
import PlayList from "../../components/common/PlayList";
import {cloudsearch,searchSuggest} from "../../networks";
import ArtistList from "../../components/common/ArtistList";
export default {
    name: 'search',
    components: {
        ArtistList,
        PlayList,
        MvList,
        AlbumList,
        AlbumContent
    },
    data () {
        // 这里存放数据
        return {
            keyVal: this.$route.query.key,
            suggestInfo: {},
            listType: {
                songs: '单曲',
                artists: '歌手',
                albums: '专辑',
                playlists: '歌单'
            },
            type: this.$route.query.type || '1', //  搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
            history: [],
            list: [],
            total: 0,
            offset: 0,
            limit: 30,
            currentpage: 0,
            isShowSearch: false
        }
    },
    // 监听属性 类似于data概念
    computed: {
        searchInfo () {
            const txt = {
                1: '首单曲',
                10: '张专辑',
                100: '个歌手',
                1000: '个歌单',
                1002: '个用户',
                1004: '个MV',
                1014: '个视频',
                1018: '个'
            }

            return this.total + txt[this.type]
        }
    },
    created() {
        this.$store.commit('setActiveName','')
    },
    mounted () {
        this.getSearchMatch()
    },
    // 方法集合
    methods: {
        //获取搜索建议
        getSearchSuggest () {
            searchSuggest({ keywords: this.keyVal }).then(res =>{
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }

                this.suggestInfo = res.result
            })

        },
        //热门搜索
        getSearchMatch () {
            cloudsearch({ keywords: this.keyVal, type: this.type, limit: this.limit, offset: this.offset }).then(res =>{
                if (res.code !== 200) {
                    return this.$msg.error('数据请求失败')
                }

                if (this.type === '1') {
                    this.list = res.result.songs
                    this.total = res.result.songCount
                } else if (this.type === '10') {
                    this.list = res.result.albums
                    this.total = res.result.albumCount
                } else if (this.type === '100') {
                    this.list = res.result.artists
                    this.total = res.result.artistCount
                } else if (this.type === '1000') {
                    this.list = res.result.playlists
                    this.total = res.result.playlistCount
                } else if (this.type === '1004') {
                    this.list = res.result.mvs
                    this.total = res.result.mvCount
                } else if (this.type === '1014') {
                    this.list = res.result.videos
                    this.total = res.result.videoCount
                }
            })
        },
        jumpSearch (k) {
            if (!k) {
                return
            }
            if (this.keyVal && this.keyVal !== this.$route.query.key) {
                // 点击搜索关键词，跳转到搜索结果页面
                this.$router.push({ path: '/search', query: { key: k, type: this.type } })
                this.isShowSearch = false
            } else {
                this.list = []
                this.getSearchMatch()
            }
        },
        //跳到相对应的页面
        jumpPage (item, type) {
            this.keyVal = item.name
            switch (type) {
                case 'songs':
                    this.$router.push({ path: '/song', query: { id: item.id } })
                break
                case 'artists':
                    this.$router.push({ path: '/artist', query: { id: item.id } })
                break
                case 'albums':
                    this.$router.push({ path: '/album', query: { id: item.id } })
                break
                case 'playlists':
                    this.$router.push({ path: '/song-list/detail', query: { id: item.id } })
                break
            }
            this.isShowSearch = false
        },
        //显示搜索建议
        getListHandle () {
            if (this.keyVal) {
                this.suggestInfo = {}
                this.getSearchSuggest()
                this.isShowSearch = true
            } else {
                this.isShowSearch = false
            }
        },
        //关闭搜索建议
        handleClose () {
            this.isShowSearch = false
        },
        selectType (type) {
            this.type = type
            this.offset = 0
            this.currentpage = 0
            this.$router.push({ path: '/search', query: { key: this.keyVal, type: this.type } })
        },
        currentChange (page) {
            this.offset = (page - 1) * this.limit
            this.currentpage = page
            this.getSearchMatch()
        }
    },
    watch: {
        $route (newVal, oldVal) {
            this.keyVal = this.$route.query.key
            this.type = this.$route.query.type || '1'
            this.getSearchMatch()
        }
    }
}
</script>
<style scoped lang="scss">
@import "src/assets/css/search.scss";
</style>
