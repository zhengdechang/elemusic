<template>
    <div>
        <div :class="['lyrics-main', lyricName]">
            <div class="lyrics" ref="lyrics" v-if="lyric.length" >
                <p :class="[isCurLyric(index)]" v-for="(item, index) in lyric" :key="index">{{item.lyric}}</p>
            </div>
            <div v-else class="lyric-empty">
                <p v-if="lyric">纯音乐，无歌词</p>
                <p v-else>歌词加载中......</p>
            </div>
        </div>
        <div class="lyric-more" v-if="local === 'page' && lyric.length > 6">
            <p v-if="!isFull">...</p>
            <span @click.stop="fullLyric">{{ this.isFull ? '收起' : '展开'}}</span>
        </div>
    </div>
</template>

<script>
import {songLyric} from "../../networks";

export default {
    name: 'lyrics',
    components: {},
    props: {
        sId: {
            type: [Number, String],
            default: 0
        },
        // currentTime: {
        //     type: Number,
        //     default: 0
        // },
        local: {
            type: String,
            default: ''
        }
    },
    data () {
        // 这里存放数据
        return {
            lyric: [],
            curIndex: 0,
            isFull: false
        }
    },
    mounted () {
        console.log(this.sId);
        this.getLyrics(this.sId)
    },
    // 监听属性 类似于data概念
    computed: {
        lyricName () {
            return [this.local === 'page' ? 'page-lyrics' : '', this.isFull ? 'fullLyrics' : '']
        },
        isCurLyric () {
            return (index) => {
                return index === this.curIndex && !this.local ? 'active' : ''
            }
        },
    },
    // 方法集合
    methods: {
        getLyrics (sid) {
            songLyric(sid).then(res =>{
                console.log(res.lrc);
                this.lyric = this.parseLyric(res.lrc.lyric)
            }).catch(err => {
                console.log(err);
            });

        },
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
        // 格式化歌词的时间 转换成 sss:ms
        formatLyricTime (time) {
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
        findCurIndex (t) {
            for (let i = 0; i < this.lyric.length; i++) {
                if (t <= this.lyric[i].t) {
                    return i
                }
            }
            return this.lyric.length
        },
        // 页面歌词可以展开查看更多
        fullLyric () {
            this.isFull = !this.isFull
        }
    },
    watch: {
        sId (newVal, oldVal) {
            this.lyric = []
            this.curIndex = 0
            this.getLyrics(newVal)
        },
        currentTime (newVal, oldVal) {
            // 无歌词的时候 不做动画滚动
            if (!this.lyric.length) {
                return
            }
            this.curIndex = this.findCurIndex(newVal) - 1
        }
    }
}
</script>
<style scoped lang="scss">
@import "src/assets/css/songshowlyric.scss";
</style>
