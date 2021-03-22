<template>
    <div class="song-lyric">
        <h1 class="lyric-title">歌词</h1>
        <!--有歌词-->
        <ul class="has-lyric" v-if="lyr.length" key="index">
            <li v-for="(item,index) in lyr" :key="index">
                {{item.lyric}}
            </li>
        </ul>
        <!--没有歌词-->
        <div  v-else class="no-lyric" key="no-lyric">
            <span>暂无歌词</span>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {mixin} from "../../mixins";
    import {songLyric} from "../../networks";
    export default {
        name: "Lyric",
        mixins:[mixin],
        data(){
            return {
                lyr:[],
            }
        },
        computed:{
          ...mapGetters([
              'curTime',             //当前歌曲播放到的位置
              'id',                 //当前播放的歌曲id
              'lyric',              //歌词
              'listOfSongs',        //当前歌单列表
              'listIndex',          //当前歌曲在歌单列表中的位置
          ])
        },
        created() {
            this.lyr = this.parseLyric(this.lyric);
        },
        watch:{
            id() {
                songLyric(this.listOfSongs[this.listIndex].id).then(res =>{
                    this.lyr = this.parseLyric(res.lrc.lyric);
                }).catch(err => {
                    console.log(err);
                });
            },
            curTime(){
                if(this.lyr.length>0){
                    for(let i=0;i<this.lyr.length;i++){
                        if(this.curTime>=this.lyr[i].time){
                            for(let j=0;j<this.lyr.length;j++){
                                document.querySelectorAll('.has-lyric li')[j].style.color = '#000';
                                document.querySelectorAll('.has-lyric li')[j].style.fontSize = '15px';
                            }
                            if(i>=0){
                                document.querySelectorAll('.has-lyric li')[i].style.color = '#4453bfcc';
                                document.querySelectorAll('.has-lyric li')[i].style.fontSize = '25px';
                            }
                        }
                    }

                }
            },
        },
        methods:{
            //解析歌词
            parseLyric(lyric) {
                const regNewLine = /\n/
                const lineArr = lyric.split(regNewLine) // 每行歌词的数组
                const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/
                const lyricsObjArr =[];
                lineArr.forEach(item => {
                    if (item === '') return
                    const obj = {}
                    const time = item.match(regTime)
                    obj.lyric = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim()
                    obj.time = time ? this.formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0
                    obj.uid = Math.random().toString().slice(-6)
                    if (obj.lyric === '') {
                        console.log('这一行没有歌词')
                    } else {
                        lyricsObjArr.push(obj)
                    }
                });
                return  lyricsObjArr;

            },
            formatLyricTime (time) { // 格式化歌词的时间 转换成 sss:ms
                const regMin = /.*:/
                const regSec = /:.*\./
                const regMs = /\./

                const min = parseInt(time.match(regMin)[0].slice(0, 2))
                let sec = parseInt(time.match(regSec)[0].slice(1, 3))
                const ms = time.slice(time.match(regMs).index + 1, time.match(regMs).index + 3)
                if (min !== 0) {
                    sec += min * 60
                }
                return Number(sec + '.' + ms)
            },
        },
    }
</script>
<style scoped lang="scss">
    @import "../../assets/css/lyric";
</style>
