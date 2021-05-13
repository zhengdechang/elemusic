<template>
    <div class='wrapper infinite-list' v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="50">
        <play-list :playList="pageList"></play-list>
        <template v-if="isLoading">
            <Loading/>
        </template>
    </div>
</template>

<script>
import Loading from "./Loading"
import PlayList from "./PlayList";
import {playList} from "../../networks/index"
export default {
    name: 'songlist',
    components: {
        PlayList,
        Loading
    },
    created () {
        this.getPlayList(this.params)
    },
    mounted() {
        this.pullup()
    },
    props: {
        params: {
            type: Object,
            default: () => {}
        },
        // 是否有滚动条
        isScroll: {
            type: Boolean,
            default: false
        }
    },
    data () {
        // 这里存放数据
        return {
            list: [],
            isLoading: false,
            busy: true,
            page:0,
            pageList:[],
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 方法集合
    methods: {
        //上拉加载
        pullup(){
            document.addEventListener('scroll', ()=> {
                let  scrollTop = document.documentElement.scrollTop||document.body.scrollTop
                let  clientHeight =  document.documentElement.clientHeight||document.body.clientHeight
                let  offsetHeight = document.documentElement.offsetHeight||document.body.offsetHeight
                console.log(scrollTop,clientHeight,offsetHeight)
                if(offsetHeight <= scrollTop+clientHeight+1){
                    this.isLoading = true
                    this.page++
                    this.pageList = [...this.pageList,...this.list.slice(this.page*20,(this.page+1)*20)]
                    this.isLoading = false
                }
            })
         },
        //获取歌曲列表
        getPlayList (params) {
            playList(params).then(res =>{
                if (res.code !== 200) {
                    return this.$message.error('获取歌曲列表数据请求失败')
                }
                this.list = this.params.offset !== 0 ? [...this.list, ...res.playlists] : res.playlists
                this.pageList = this.list.slice(0,(this.page+1)*20)
                // console.log(this.list)
                this.busy = this.list.length >= res.total
                this.isLoading = !this.busy
            })
        },
        // //加载更多
        loadMore () {
            if (this.isScroll) {
                this.busy = true
                this.params.offset = this.list.length
            }
        }
    },
    watch: {
        params: {
            handler (newVal, oldVal) {
                if (newVal.cat !== oldVal.cat) {
                    this.page = 0
                    this.list = []
                }
                this.getPlayList(newVal)
            },
            deep: true // 深度监听
        }
    }
}
</script>
<style scoped lang="scss">
@import "src/assets/css/songlist.scss";
</style>
