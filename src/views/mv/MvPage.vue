<template>
    <div class='mv-page'>
        <div class="w1200">
            <div class="filter">
                <div class="filter-item">
                    <span>区域</span>
                    <em v-for="(item, index) in area" class="hover" :class=" index === areaIndex ? 'active' : ''" :key="index" @click="selectType('area', index)">{{item}}</em>
                </div>
                <div class="filter-item">
                    <span>类型</span>
                    <em v-for="(item, index) in type" class="hover"  :class=" index === typeIndex ? 'active' : ''" :key="index" @click="selectType('type', index)">{{item}}</em>
                </div>
            </div>
            <div class="list-container">
                <div class="list-head">
                    <h2>全部MV</h2>
                    <div class="type">
                        <span v-for="(item, index) in order" class="hover"  :class=" index === orderIndex ? 'active' : ''" :key="index" @click="selectType('order', index)">{{item}}</span>
                    </div>
                </div>
                <MvList class="loadMv" :mvList="list" v-infinite-scroll="loadMv"  infinite-scroll-disabled="isLoadMv" infinite-scroll-distance="50"></MvList>
            </div>
            <template v-if="isLoading">
                <Loading />
            </template>
        </div>
    </div>
</template>

<script>
import {mv} from "../../networks/index"
import Loading from '../../components/common/Loading'
import MvList from "../../components/common/MvList";
export default {
    name: 'mv',
    components: {
        MvList,
        Loading
    },
    activated(){
        //使用keep-alive代替触发周期函数的内容
        this.$store.commit('setActiveName','MV');
    },
    data () {
        // 这里存放数据
        return {
            area: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
            type: ['全部', '官方版', '原生', '现场版', '网易出品'],
            order: ['上升最快', '热门', '最新'],
            areaIndex: 0,
            typeIndex: 0,
            orderIndex: 0,
            params: {
                area: '',
                type: '',
                order: '',
                limit: 30,
                offset: 0
            },
            list: [],
            isLoading: true,
            isLoadMv: true
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    mounted () {
        this.params.area = this.area[this.areaIndex]
        this.params.type = this.type[this.typeIndex]
        this.params.order = this.order[this.orderIndex]
    },
    // 方法集合
    methods: {
         getMv (params) {
            mv(params).then(res =>{
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }

                this.list = this.params.offset !== 0 ? [...this.list, ...res.data] : res.data
                this.isLoadMv = !res.hasMore
                this.isLoading = res.hasMore
            })
        },
        //选择Mv类型
        selectType (type, index) {
            this[type + 'Index'] = index
            this.list = []
            this.params.offset = 0
            this.params[type] = this[type][index]
        },
        loadMv () {
            this.isLoadMv = true
            this.params.offset = this.list.length
        }
    },
    watch: {
        params: {
            handler (params) {
                this.getMv(params)
            },
            deep: true // 深度监听
        }
    }
}
</script>
<style scoped lang="scss">
@import "src/assets/css/mvpage";
</style>
