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
                <div class="song-item hover" @click="goSong(item.id)">
                    <span class="item-index">
                        {{index+1}}
                    </span>
                    <span class="item-title">{{item.name}}</span>
                    <span class="item-name">{{item.ar[0].name}}</span>
                    <span class="item-intro">{{item.al.name}}</span>
                    <span class="item-duration">{{formatSongTime(item.dt)}}</span>
                    <div class="songlist-oper">
                        <i class="iconfont icon-play" title="播放歌曲"  slot="reference" @click.stop="toPlay(item.id,item.al.picUrl,index,item.name,item.ar[0].name,item)"></i>
                        <i class="iconfont icon-add-list" title="添加到列表" slot="reference" @click.stop="addList(item)"></i>
                        <i class="iconfont icon-xiazai" title="下载到本地" slot="reference" @click.stop="download(item.id,item.name,item.ar[0].name)"></i>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import {mixin} from "../../mixins";
    import {mapGetters} from 'vuex'
    import {download,songUrl} from "../../networks";

    export default {
        name: "AlbumContent",
        data(){
            return{
                singleIsActive:false,
                data:[],
            }
        },
        created() {

        },
        mixins:[mixin],
        props:[
            'songList'
        ],
        methods:{
            // //根据id获取url
            // getUrl(id){
            //     songUrl(id).then(res =>{
            //         this.downloadurl = res.data[0].url;
            //     })
            // },
            //下载音乐
            download(id,title,artist){
                songUrl(id).then(res =>{
                    const downloadurl = res.data[0].url;
                    download(downloadurl).then(res =>{
                        let content = res.data;
                        let eleLink = document.createElement('a');
                        eleLink.download = `${artist}-${title}.mp3`;
                        eleLink.style.display = 'none';
                        //把字符内容转换为blob地址
                        let blob = new Blob([content]);
                        eleLink.href = URL.createObjectURL(blob);
                        //把链接地址加到document里
                        document.body.appendChild(eleLink);
                        //触发点击
                        eleLink.click();
                        //然后移除这个新加的控件
                        document.body.removeChild(eleLink);
                    }).catch(err =>{
                        console.log(err);
                    })

                })
            },
            goSong(id){
              this.$router.push({path:'/song',query:{id:id}})
            },
            // 歌曲毫秒格式化处理 03:30
            formatSongTime (duration = 0) {
                duration = duration / 1000
                const m = (Math.floor(duration / 60) + '').padStart(2, '0')
                const s = (Math.floor(duration % 60) + '').padStart(2, '0')
                return `${m}:${s}`
            },
            addList(item){
                this.AsidePlayList.push(item)
                this.$store.commit('setAsidePlayList',this.unique(this.AsidePlayList))
            },

        },
        computed:{
          ...mapGetters([
              'listOfSongs',
              'isActive',
              'userId',
              'loginIn',
              'AsidePlayList',
          ])
        },
    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/album-content";
</style>
