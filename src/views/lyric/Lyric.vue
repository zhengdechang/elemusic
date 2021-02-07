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
                                document.querySelectorAll('.has-lyric li')[i].style.color = '#95d2f6';
                                document.querySelectorAll('.has-lyric li')[i].style.fontSize = '25px';
                            }
                        }
                    }

                }
            },
        },
        methods:{
            //解析歌词
            // parseLyric(text){
            //     const regNewLine = /\n/;
            //     let lines = text.split(regNewLine);                   //将歌词按行分解成数组
            //     let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g; //时间格式的正则表达式
            //     let result = [];                                //返回值
            //     //对于歌词格式不对的直接返回
            //     if(!(/\[.+\]/.test(text))){
            //         return [[0,text]]
            //     }
            //     //去掉前面格式不正确的行
            //     while(!pattern.test(lines[0])){
            //         lines = lines.slice(1);
            //     }
            //     //遍历每一行，形成一个每行带着俩元素的数组，第一个元素是以秒为计算单位的时间，第二个元素是歌词
            //     for(let item of lines){
            //         var time = item.match(pattern);  //存前面的时间段
            //         var value = item.replace(pattern,'');//存后面的歌词
            //     }
            //     for(let item1 of time){
            //         let t = item1.slice(1,-1).split(":");   //取出时间，换算成数组
            //         if(value!=''){
            //             result.push([parseInt(t[0],10)*60 + parseFloat(t[1]),value]);
            //         }
            //     }
            //     //按照第一个元素--时间--排序
            //     result.sort(function(a,b){
            //         return a[0] - b[0];
            //     });
            //     return result;
            // },
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