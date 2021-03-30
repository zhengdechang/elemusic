<template>
    <div class='album'>
        <router-link :to="{ path: '/album', query: { id: item.id }}" class="item" :key="item.id" v-for="item in albumList">
            <div class="faceImg">
                <el-image :src="item.picUrl + '?param=120y120'">
                    <div slot="placeholder" class="image-slot">
                        <i class="iconfont icon-placeholder"></i>
                    </div>
                </el-image>
            </div>
            <div class="info">
                <div class="album-type">{{item.type}}</div>
                <div class="album-name" v-if="item.name">{{item.name}}</div>
                <div class="artist-name" v-if="item.artist">{{item.artist.name}}</div>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    components: {},
    props: ['albumList'],
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
@import "src/assets/css/albumlist.scss";
</style>
