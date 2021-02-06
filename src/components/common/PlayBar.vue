<template>
    <div class="play-bar">
        <div class="kongjian">
            <!--上一首-->
            <div class="item" @click="prev">
                <svg class="icon">
                    <use xlink:href="#icon-ziyuanldpi"></use>
                </svg>
            </div>
            <!--播放-->
            <div class="item" @click="togglePlay()">
                <svg class="icon">
                    <use :xlink:href="playButtonUrl"></use>
                </svg>
            </div>
            <!--下一首-->
            <div class="item" @click="next">
                <svg class="icon">
                    <use xlink:href="#icon-ziyuanldpi1"></use>
                </svg>
            </div>
            <!--歌曲图片-->
            <div class="item-img">
                <img :src="picUrl" alt="" />
            </div>
            <!--歌曲进度-->
            <div class="playing-speed">
                <!--播放开始时间-->
                <div class="current-time">{{nowTime}}</div>
                <div class="progress-box">
                    <div class="item-song-title">
                        <div>{{this.title}}</div>
                        <div>{{this.artist}}</div>
                    </div>
                    <div ref="progress" class="progress" @mousemove="mousemove">
                        <!--进度条-->
                        <div class="bg" ref="bg" @click="updatemove">
                            <div class="curProgress" ref="curProgress" :style="{width:curLength+'%'}"></div>
                        </div>
                        <!--拖动的点-->
                        <div class="idot" ref="idot" :style="{left:curLength+'%'}" @mousedown="mousedown" @mouseup="mouseup">
                        </div>
                    </div>
                </div>
                <!--播放结束时间-->
                <div class="left-time">{{songTime}}</div>
                <!--音量-->
                <div class="item item-volume">
                    <svg v-if="volume == 0" class="icon">
                        <use xlink:href="#icon-yinliangjingyinheix"></use>
                    </svg>
                    <svg v-else class="icon">
                        <use xlink:href="#icon-yinliang1"></use>
                    </svg>

                    <el-slider class="volume" v-model="volume" :vertical="true" ></el-slider>
                </div>
                <!--收藏-->
                <div class="item">
                    <svg class="icon">
                        <use xlink:href="#icon-xihuan-shi"></use>
                    </svg>
                </div>
                <!--下载-->
                <div class="item">
                    <svg class="icon">
                        <use xlink:href="#icon-xiazai"></use>
                    </svg>
                </div>
                <!--当前播放的歌曲列表-->
                <div class="item" @click="changeAside()">
                    <svg class="icon">
                        <use xlink:href="#icon-liebiao"></use>
                    </svg>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex"

    export default {
        name: "PlayBar",
        data(){
            return{
                nowTime:'00:00',     //当前播放进度的时间
                songTime:'00:00',    //当前歌曲总时间
                curLength:0,         //进度条位置
                progressLength:0,    //进度条总长度
                mouseStartX:0,       //拖拽开始位置
                tag:false,           //拖拽开始结束的标准
                volume:50,           //音量
            }
        },
        computed:{
          ...mapGetters([
              'id',                     //歌曲id
              'url',                    //歌曲地址
              'isPlay',                 //播放状态
              'playButtonUrl',          //播放状态的图标
              'picUrl',                 //正在播放的音乐图片
              'title',                  //歌名
              'artist',                 //歌手名
              'duration',               //歌曲时长
              'curTime',                //当前音乐的播放位置
              'showAside',              //是否显示播放的歌曲列表
              'listIndex',              //当前歌曲在歌单中的位置
              'listOfSongs',             //当前的歌单列表
              'autoNext',                //自动播放下一首
    ])
        },
        mounted() {
            this.progressLength = this.$refs.progress.getBoundingClientRect().width;
            document.querySelector('.item-volume').addEventListener('click',function (e) {
                document.querySelector('.volume').classList.add('show-volume');
                e.stopPropagation();
            },false);
            document.querySelector('.volume').addEventListener('click',function (e) {
                e.stopPropagation();
            },false);
            document.addEventListener('click',function () {
                document.querySelector('.volume').classList.remove('show-volume');
            },false);
        },
        watch:{
          //切换播放状态的图标
          isPlay(){
              if(this.isPlay){
                  this.$store.commit('setPlayButtonUrl','#icon-zanting');
              }else{
                  this.$store.commit('setPlayButtonUrl','#icon-bofang');
              }
          },
           curTime(){
              this.nowTime = this.formatSeconds(this.curTime);
              this.songTime = this.formatSeconds(this.duration);
              this.curLength = (this.curTime / this.duration)*100;
           },
           //监控音量值的变化
           volume(){
             this.$store.commit('setVolume',this.volume/100);
           },
            //自动播放下一首
            autoNext(){
              this.next();

            },

        },
        methods:{
          togglePlay(){
              if(this.isPlay){
                  this.$store.commit('setIsPlay',false);
              }else{
                  this.$store.commit('setIsPlay',true);
                  console.log(this.duration);
              }
          },
           formatSeconds(value){
                let theTime = parseInt(value);
                let result = '';
                let hour = parseInt(theTime/3600);  //小时
                let minute = parseInt(theTime/60);  //分
                let second = parseInt(theTime % 60); //秒
                if(hour>0){
                    if(hour<10){
                        result = '0' + hour + ":";
                    }else {
                        result = + hour + ":";
                    }
                }
                if(minute>0){
                    if(minute<10){
                        result += '0' + minute + ":";
                    }else {
                        result +=  minute + ":";
                    }
                }else {
                    result += "00:";
                }
                if(second>0){
                    if(second<10){
                        result += '0' + second;
                    }else {
                        result += second ;
                    }
                }else {
                    result += "00";
                }
                return  result;
            },
            mousedown(e){
                this.mouseStartX = e.clientX;
                this.tag = true;
            },
            mouseup(){
                this.tag = false;
            },
            mousemove(e){
                if(!this.duration){
                    return false;
                }
                if(this.tag){
                    let movementX = e.clientX - this.mouseStartX ; //黑点移动的位置
                    let curLength = this.$refs.curProgress.getBoundingClientRect().width;
                    let newPercent = ((movementX+curLength)/this.progressLength)*100;
                    if(newPercent>100){
                        newPercent = 100;
                    }
                    this.curLength = newPercent;
                    this.mouseStartX = e.clientX;
                    this.changeTime(newPercent);

                }
            },
            //更换歌曲进度
            changeTime(percent){
              let newCurTime = (percent*0.01)*this.duration;
              this.$store.commit('setChangeTime',newCurTime)
            },
            //点击进度条更改进度
            updatemove(e){
              if(!this.tag){
                  //进度条左侧坐标
                  let curLength = this.$refs.bg.offsetLeft;
                  let  newPercent = ((e.clientX - curLength)/this.progressLength)*100;
                  if(newPercent>100){
                      newPercent = 100;
                  } else if(newPercent<0){
                      newPercent = 0;
                  }
                  this.curLength = newPercent;
                  this.changeTime(newPercent);
              }
            },
            //显示播放中的歌曲列表
            changeAside(){
              this.$store.commit('setShowAside',true);
            },
            //上一首
            prev(){
              if(this.listIndex != -1 && this.listOfSongs.length > 1){          //当前处于不可能状态或者只有一首音乐的时候不执行
                  if(this.listIndex >0){                                        //不是第一首音乐
                      this.$store.commit('setListIndex',this.listIndex-1);  //直接返回上一首

                  }else{                                                                           //当前是第一首音乐
                      this.$store.commit('setListIndex',this.listOfSongs.length-1);  //切换到倒数第一首
                  }
                  this.toPlay(this.listOfSongs[this.listIndex].id);
              }
            },
            //下一首
            next(){
                if(this.listIndex != -1 && this.listOfSongs.length > 1){          //当前处于不可能状态或者只有一首音乐的时候不执行
                    if(this.listIndex < this.listOfSongs.length-1){               //不是最后一首音乐
                        this.$store.commit('setListIndex',this.listIndex+1);  //直接返回下一首

                    }else{                                                                           //当前是最后一首音乐
                        this.$store.commit('setListIndex',0);  //切换到第一首
                    }
                    this.toPlay(this.listOfSongs[this.listIndex].id);
                }
            },

            //播放
            toPlay(id){
              if(id&&id !=this.id){
                  this.$store.commit('setId',this.listOfSongs[this.listIndex].id);
                  this.$store.commit('setUrl','http://music.163.com/song/media/outer/url?id='+this.listOfSongs[this.listIndex].id+'.mp3');
                  this.$store.commit('setPicUrl',this.listOfSongs[this.listIndex].al.picUrl);
                  console.log(this.listOfSongs[this.listIndex].al.picUrl);
                  this.$store.commit('setTitle',this.listOfSongs[this.listIndex].name);
                  this.$store.commit('setArtist',this.listOfSongs[this.listIndex].ar[0].name);
                  this.$store.commit('setLyric','http://music.163.com/api/song/media?id='+this.listOfSongs[this.listIndex].id);
              }
            },
        },

    }
</script>

<style scoped lang="scss">
@import "../../assets/css/play-bar";
</style>