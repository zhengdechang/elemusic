<template>
    <div class='mv-list'>
        <!-- 列表有重复的MV， 相同id的key会报错，加上字符串的index -->
        <div class="item" :key="'' + item.id + index" v-for="(item, index) in mvList">
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
                <router-link :to="{ path: '/artist', query: { id: item.artistId }}" class="mv-author" v-if="!item.publishTime">{{item.artistName}}</router-link>
                <div class="mv-playCount"><i class="iconfont icon-video"></i> {{formartNum(item.playCount)}}</div>
                <div class="mv-time" v-if="item.publishTime">发布时间：{{item.publishTime}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: ['mvList'],
    data () {
        // 这里存放数据
        return {
        }
    },
    // 监听属性 类似于data概念
    computed: {},
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
    }
}
</script>
<style scoped lang="scss">
@import "src/assets/css/mvlist.scss";
</style>
