<template>
    <div class='song-list'>
        <div class="w1200">
            <div class="filter">
                <div class="filter-item" v-for="(item, index) in categories" :key="index">
                    <div class="filter-title">{{ item.name }}</div>
                    <div class="filter-box">
                        <span :class="['item-box', curType === sub.name ? 'active' : '']" v-for="sub in item.children.slice(0, 8)" :key="sub.name"><em @click="selectType(sub)">{{ sub.name }}</em></span>
                        <el-popover trigger="click">
                            <span :class="['item-box', 'filter-more', moreTxt[index] ? 'active' : '']" slot="reference" v-if="item.children.length > 9"><em>{{ moreTxt[index] ? curType : '更多'}}<i class="iconfont icon-arrow"></i></em></span>
                            <div class="filter-drop">
                                <span :class="['item-box', curType === sub.name ? 'active' : '']" v-for="sub in item.children.slice(9)" :key="sub.name"><em @click="selectType(sub, index)">{{ sub.name }}</em></span>
                            </div>
                        </el-popover>
                    </div>
                </div>
            </div>
            <div class="list-container">
                <div class="list-head">
                    <h2>{{curType}} <em v-if="curType !== allList.name" class="filter-close" @click="closed"><i class="iconfont icon-closed"></i></em></h2>
                    <div class="type">
                        <span :class="params.order === 'hot' ? 'active' : ''" @click="selectOrder('hot')">热门</span>
                        <span :class="params.order === 'new' ? 'active' : ''" @click="selectOrder('new')">最新</span>
                    </div>
                </div>
                <songlist :params="params" :isScroll="true"></songlist>
            </div>
        </div>
    </div>
</template>

<script>
    import {catlist,} from "../../networks";
    import songlist from '../../components/common/songlist.vue'
    export default {
        name: 'song-list',
        components: {
            songlist
        },
        activated(){
            //使用keep-alive代替触发周期函数的内容
            this.$store.commit('setActiveName','歌单');
        },
        created () {
            this.params.cat = this.$route.query.cat;
            this.getCatlist();
            this.$store.commit('setActiveName','歌单');
        },
        data () {
            // 这里存放数据
            return {
                sub: [],
                categories: [],
                curType: '',
                moreTxt: {},
                allList: {},
                params: {
                    order: 'hot',
                    cat: '',
                    limit: 50,
                    offset: 0
                },
            }
        },
        // 监听属性 类似于data概念
        computed: {
        },
        // 方法集合
        methods: {
            //获取所点击类型的歌单
            getCatlist () {
                catlist().then(res =>{
                    this.sub = res.sub

                    if (res.code !== 200) {
                        return this.$message.error('数据请求失败')
                    }

                    for (const k in res.categories) {
                        const params = { name: res.categories[k] }

                        params.children = this.sub.filter(subItem => { return subItem.category === Number(k) })
                        this.categories.push(params)
                    }

                    this.curType = this.$route.query.cat ? this.$route.query.cat : res.all.name
                    this.allList = res.all
                    this.getMoreTxt()
                })
            },
            selectType (item) {
                this.$router.push({ path: 'song-list', query: { cat: item.name, order: this.params.order } })
            },
            closed () {
                this.$router.push({ path: 'song-list' })
            },
            selectOrder (type) {
                this.$router.push({ path: 'song-list', query: { cat: this.params.cat, order: type } })
            },
            getMoreTxt () {
                // 查询当前显示的歌单分类详情，如：全部歌单、华语
                const itemInfo = this.sub.find(subItem => { return subItem.name === this.curType })
                this.moreTxt = {}
                if (itemInfo) {
                    // 若有歌单分类，且分类歌单的索引在更多里面，则渲染moreText数据
                    const index = this.categories[itemInfo.category].children.indexOf(itemInfo)
                    index >= 8 && (this.moreTxt[itemInfo.category] = itemInfo)
                }
            }
        },
        watch: {
            '$route' (newVal, oldVal) {
                const { cat, order } = newVal.query

                this.curType = cat || this.allList.name
                this.params = Object.assign({}, { order: 'hot', cat: '', limit: 50, offset: 0 }, { cat: cat || '', order: order || 'hot' })
                this.getMoreTxt()
            }
        }
    }
</script>
<style scoped lang="scss">
  @import "src/assets/css/song-list.scss";
</style>
