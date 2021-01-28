<template>
    <div class="swiper">
        <el-carousel :interval="4000" type="card" height="280px">
            <el-carousel-item v-for="(item,index) in swiperList" :key="index">
                <img :src="item.picImg"/>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    import {swiperList} from "../../assets/data/swiper";


    export default {
        name: "Swiper",
        data(){
            return{
                swiperList:[]
            }
        },
        created() {
            this.swiperList = swiperList;
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/swiper";
</style>