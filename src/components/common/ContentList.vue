<template>
    <div class="content_list">
        <ul class="section-content">
            <li class="content-item" v-for="(item,index) in contentList" :key="index">
                <img  class="item-img" :src="attachImageUrl(item.coverImgUrl)">
                <div class="mask">
                    <svg class="icon">
                        <use xlink:href="#icon-bofang"></use>
                    </svg>
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
        props:['contentList']
    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/content-list";
</style>