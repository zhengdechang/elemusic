  <template>
    <div class='singer'>
        <div class="w1200">
            <div class="filter">
                <div class="filter-item">
                    <span v-for="(item, index) in initial"  class="hover" :key="index" :class=" index === initialIndex ? 'active' : ''" @click="selectType('initial', index)">{{item.label}}</span>
                </div>
                <div class="filter-item">
                    <span v-for="(item, index) in area" :key="index"  class="hover" :class=" index === areaIndex ? 'active' : ''" @click="selectType('area', index)">{{item.label}}</span>
                </div>
                <div class="filter-item">
                    <span v-for="(item, index) in type" :key="index"  class="hover" :class=" index === typeIndex ? 'active' : ''" @click="selectType('type', index)">{{item.label}}</span>
                </div>
            </div>
            <div class="list-container" v-infinite-scroll="loadMore">
                <router-link :to="{ path: '/artist', query: { id: item.id }}" class="item" :key="item.id" v-for="item in pageList">
                    <div class="faceImg">
                        <el-image :src="item.picUrl + '?param=120y120'">
                            <div slot="placeholder" class="image-slot">
                                <i class="iconfont icon-placeholder"></i>
                            </div>
                        </el-image>
                    </div>
                    <div class="info hover">
                        <div class="name">{{item.name}}</div>
                        <div class="albumSize">专辑：{{item.albumSize}}</div>
                    </div>
                </router-link>
            </div>
            <template v-if="isLoading">
                <Loading />
            </template>
        </div>
    </div>
</template>

<script>
    import {artistList} from "../../networks/index"
    import Loading from "../../components/common/Loading";
    export default {
        name: 'Singer',
        components: {
            Loading
        },
        data () {
            // 这里存放数据
            return {
                type: [{ label: '全部', val: -1 }, { label: '男歌手', val: 1 }, { label: '女歌手', val: 2 }, { label: '乐队', val: 3 }],
                area: [{ label: '全部', val: -1 }, { label: '华语', val: 7 }, { label: '欧美', val: 96 }, { label: '日本', val: 8 }, { label: '韩国', val: 16 }, { label: '其他', val: 0 }],
                initial: [{ label: '热门', val: -1 }, { label: '#', val: 0 }],
                typeIndex: 0,
                areaIndex: 0,
                initialIndex: 0,
                params: {
                    area: '',
                    type: '',
                    initial: '',
                    limit: 30,
                    offset: 0
                },
                list: [],
                isLoading: true,
                isLoadMv: true,
                page:0,
                pageList:[],
            }
        },
        activated(){
            //使用keep-alive代替触发周期函数的内容
            this.$store.commit('setActiveName','歌手');
        },
        created() {
            this.$store.commit('setActiveName','歌手')
        },
        // 监听属性 类似于data概念
        computed: {},
        mounted () {
            this.params.area = this.area[this.areaIndex].val
            this.params.type = this.type[this.typeIndex].val
            this.params.initial = this.initial[this.initialIndex].val
            this.renderInitial()
            this.pullup()
        },
        // 方法集合
        methods: {
            renderInitial () {
                const alphabet = []
                for (let i = 0; i < 26; i++) {
                    alphabet.push({
                        label: String.fromCharCode(65 + i),
                        val: String.fromCharCode(97 + i)
                    })
                }
                this.initial = [this.initial[0], ...alphabet, this.initial[1]]
            },
            selectType (type, index) {
                this[type + 'Index'] = index
                this.page = 0
                this.list = []
                this.params.offset = 0
                this.params[type] = this[type][index].val
            },
            //获取歌手列表
            getArtist (params) {
                artistList(params).then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('获取歌手列表数据请求失败')
                    }
                    this.list = this.params.offset !== 0 ? [...this.list, ...res.artists] : res.artists
                    this.pageList = this.list.slice(0,(this.page+1)*30)
                    this.isLoadMv = !res.more
                    this.isLoading = res.more
                })

            },
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
                        this.pageList = [...this.pageList,...this.list.slice(this.page*30,(this.page+1)*30)]
                        this.isLoading = false
                    }
                })
            },
            loadMore () {
                this.isLoadMv = true
                this.params.offset = this.list.length
            }
        },
        watch: {
            params: {
                handler (params) {
                    this.getArtist(params)
                },
                deep: true // 深度监听
            }
        }
    }
</script>
<style scoped lang="scss">
@import "src/assets/css/singer.scss";
</style>
