<template>
    <div class='artist'>
        <router-link :to="{ path: '/artist', query: { id: item.id }}" class="item" :key="item.id" v-for="item in artistList">
            <div class="faceImg">
                <el-image :src="item.picUrl + '?param=120y120'">
                    <div slot="placeholder" class="image-slot">
                        <i class="iconfont icon-placeholder"></i>
                    </div>
                </el-image>
            </div>
            <div class="info">
                <div class="name">{{item.name}}</div>
                <div class="albumSize">专辑：{{item.albumSize}}</div>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    components: {},
    props: ['artistList'],
    data () {
        // 这里存放数据
        return {
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 方法集合
    methods: {
    }
}
</script>
<style scoped lang="scss">
@import "src/assets/css/artistlist.scss";
</style>
