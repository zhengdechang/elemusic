<template>
    <div class="album-content">
        <h1 class="title">
            <slot name="title"></slot>
            <hr/>
        </h1>
        <ul>
            <li>
                <div class="song-item">
                    <span class="item-index"></span>
                    <span class="item-title">歌曲名</span>
                    <span class="item-name">歌手</span>
                    <span class="item-intro">专辑</span>
                    <span class="item-duration">时长</span>

                </div>
            </li>
            <li v-for="(item,index) in songList" :key="index">
                <div class="song-item" @click="toPlay(item.id,item.al.picUrl,index,item.name,item.ar[0].name)">
                    <span class="item-index">
                        {{index+1}}
                    </span>
                    <span class="item-title">{{item.name}}</span>
                    <span class="item-name">{{item.ar[0].name}}</span>
                    <span class="item-intro">{{item.al.name}}</span>
                    <span class="item-duration">{{formatSongTime(item.dt)}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import {mixin} from "../../mixins";

    export default {
        name: "AlbumContent",
        data(){
            return{

            }
        },
        mixins:[mixin],
        props:[
            'songList'
        ],
        methods:{
            // 歌曲毫秒格式化处理 03:30
            formatSongTime (duration = 0) {
                duration = duration / 1000
                const m = (Math.floor(duration / 60) + '').padStart(2, '0')
                const s = (Math.floor(duration % 60) + '').padStart(2, '0')
                return `${m}:${s}`
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/album-content";

</style>
