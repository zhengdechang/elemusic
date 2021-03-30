<template>
    <div class="content_list">
        <ul class="section-content">
            <li class="content-item" v-for="(item,index) in contentList" :key="index">
                <div class="kuo" @click="goAlbum(item,item.name)">
                    <img  class="item-img" :src="attachImageUrl(item.coverImgUrl)">
                    <div class="mask">
                        <svg class="icon">
                            <use xlink:href="#icon-bofang"></use>
                        </svg>
                    </div>
                </div>
                <p class="item-name">{{item.name||item.title}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
    import {mixin} from "../../mixins";
    export default {
        name: "ContentList",
        mixins:[mixin],
        props:['contentList'],
        methods:{
            goAlbum(item,type){
                this.$store.commit('setTempList',item);
                if(!type){
                    this.$router.push({path:`singer-album/${item.id}`})
                }else{
                    this.$router.push({path:`song-list-album/${item.id}`})
                }
            }
        }
    }
</script>

<style scoped lang="scss">
 @import "../../assets/css/content-list";
</style>
