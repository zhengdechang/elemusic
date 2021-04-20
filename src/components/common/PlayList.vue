<template>
    <div class='playlist'>
        <div class="item" v-for="(item,index) in playList" :key="index">
            <router-link :to="{ path: 'song-list/detail', query: { id: item.id }}" class="faceImg">
                <el-image :src="item.coverImgUrl" lazy>
                    <div slot="placeholder" class="image-slot">
                        <i class="iconfont icon-placeholder"></i>
                    </div>
                </el-image>
                <span class="playCount"><i class="iconfont icon-playnum"></i><em>{{dealNum(item.playCount)}}</em></span>
            </router-link>
            <div class="info">
                <router-link :to="{ path: 'song-list/detail', query: { id: item.id }}" class="info_name hover">{{item.name}} </router-link>
                <div class="tags">
                    <router-link :to="{ path: '/song-list', query: { cat: tag }}" class="tag" v-for="(tag, index) in item.tags" :key="index">#{{tag}} </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: ['playList'],
    data () {
        // 这里存放数据
        return {
        }
    },
    created() {
    },
    // 监听属性 类似于data概念
    computed: {},
    // 方法集合
    methods: {
        // 数字过万的处理
        dealNum (val) {
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
@import "src/assets/css/playlist.scss";
</style>
