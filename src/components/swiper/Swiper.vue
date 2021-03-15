<template>
    <div class="swiper">
        <el-carousel :interval="4000" type="card" height="280px">
            <el-carousel-item v-for="(item,index) in banners" :key="index" >
                <div class="img" @click="pathHandler(item)"> <img :src="item.imageUrl"/></div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    import {getBanner} from '../../networks/index'
    export default {
        name: "Swiper",
        data(){
            return{
                banners:{},
            }
        },
        created() {
            this.getBanner();
        },
        methods:{
            getBanner () {
                    getBanner().then(res =>{
                        if (res.code !== 200) {
                            return this.$message.error('数据请求失败')
                        }
                        this.banners = res.banners
                    }).catch (err=>{
                        console.log(err);
                    })
            },
            pathHandler (params) {
                switch (params.targetType) {
                    case 1: // 单曲
                        this.$router.push({ path: '/song', query: { id: params.targetId } })
                        break
                    case 10: // 专辑
                        this.$router.push({ path: '/album', query: { id: params.targetId } })
                        break
                    case 1000: // 歌单
                        this.$router.push({ path: '/playlist', query: { id: params.targetId } })
                        break
                    case 1004: // MV
                        this.$router.push({ path: '/mv', query: { id: params.targetId } })
                        break
                    case 3000: // 外链
                        window.open(params.url, '_blank')
                        break
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/swiper";
</style>
