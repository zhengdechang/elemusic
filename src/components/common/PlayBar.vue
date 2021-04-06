<template>
    <div class="play-bar" :class="{show:!toggle}">
        <div @click="toggle = !toggle" class="item-up" :class="{turn:toggle}">
            <svg class="icon">
                <use xlink:href="#icon-jiantou-shang-cuxiantiao"></use>
            </svg>
        </div>
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
            <div class="item-img" @click="toLyric">
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
                <div class="item"  @click="subSong">
                    <svg class="icon"  :class="{active:isActive}">
                        <use xlink:href="#icon-xihuan-shi"></use>
                    </svg>
                </div>
                <!--下载-->
                <div class="item" @click="download()">
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
                <!--切换播放模式-->
                <div class="item" @click="changePlayMode()">
                    <i class="iconfont" :class="PlayMode()"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {
        songLyric,
        songUrl,
        download,
        getServeLikedSong,
        deleteLikedSong,
        subServeLikedSong
    } from "../../networks";

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
                ly:'',               //歌词
                toggle:true,         //显示隐藏播放器页面
                playMode:{
                    loop:0,
                    suijixunhuan:1,
                    danquxunhuan1:2,
                },
                mode:0,
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
              'listOfSongs',             //分页列表
              'autoNext',                //自动播放下一首
              'isActive',                //是否收藏
              'loginIn',                 //是否登录
              'userId',                  //用户id
              'AsidePlayList',            //播放列表
    ])
        },
        created() {
            this.PlayMode();
        },
        mounted() {
            //改变音量
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
            //监控进度/时间
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
                if(this.autoNext){
                    this.next();
                }
            },
            id(){
                this.$store.commit('setIsActive',false)
            },
            mode(){
                this.$store.commit("setMode",this.mode)
            }

        },
        methods:{
           //切换模式
           PlayMode(){
               return this.mode === this.playMode.loop? 'icon-loop': this.mode === this.playMode.suijixunhuan?'icon-suijixunhuan':'icon-danquxunhuan1'
           },
           changePlayMode(){
               if(this.mode>=2){
                   this.mode = 0;
                   this.PlayMode();
               }else {
                   this.mode = this.mode + 1
               }

           },
          //切换播放
          togglePlay(){
              if(this.isPlay){
                  this.$store.commit('setIsPlay',false);
              }else{
                  this.$store.commit('setIsPlay',true);
              }
          },
            //时间格式处理
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

            //改变进度
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
              if(this.listIndex != -1 && this.AsidePlayList.length > 1){          //当前处于不可能状态或者只有一首音乐的时候不执行
                      if(this.listIndex >0){                                        //不是第一首音乐
                          this.$store.commit('setListIndex',this.listIndex-1);  //直接返回上一首

                      }else{                                                                           //当前是第一首音乐
                          this.$store.commit('setListIndex',this.AsidePlayList.length-1);  //切换到倒数第一首
                      }
                  this.toPlay(this.AsidePlayList[this.listIndex].id);
              }
            },
            //下一首
            next(){
                if(this.listIndex != -1 && this.AsidePlayList.length > 1){          //当前处于不可能状态或者只有一首音乐的时候不执行
                    if(this.mode === 0){
                        if(this.listIndex < this.AsidePlayList.length-1){               //不是最后一首音乐
                            this.$store.commit('setListIndex',this.listIndex+1);  //直接返回下一首
                        }else{                                                                           //当前是最后一首音乐
                            this.$store.commit('setListIndex',0);  //切换到第一首
                        }
                    }else if(this.mode === 1){
                        const long = this.AsidePlayList.length;
                        if(this.listIndex < this.AsidePlayList.length-1){               //不是最后一首音乐
                            this.$store.commit('setListIndex',this.listIndex+Math.round(Math.random()*long));  //返回下面随机一首
                        }else{                                                                           //当前是最后一首音乐
                            this.$store.commit('setListIndex',Math.round(Math.random()*long));  //从0开始随机一首
                        }
                    }else{
                        this.$store.commit('setListIndex',this.listIndex+0);  //单曲循环播放当前
                        this.$store.commit("setIsPlay",true)
                    }
                    this.toPlay(this.AsidePlayList[this.listIndex].id);
                }
            },

            //播放
            toPlay(id){
              if(id&&id !=this.id){
                  this.$store.commit('setId',this.AsidePlayList[this.listIndex].id);
                  this.getUrl(this.AsidePlayList[this.listIndex].id);
                  this.$store.commit('setPicUrl',this.AsidePlayList[this.listIndex].al.picUrl);
                  this.$store.commit('setTitle',this.AsidePlayList[this.listIndex].name);
                  this.$store.commit('setArtist',this.AsidePlayList[this.listIndex].ar[0].name);
                  this.getLyric(this.AsidePlayList[this.listIndex].id);
                  if(this.loginIn){
                      getServeLikedSong(this.userId).then(res =>{
                          for(let item of res.data){
                              if(item.tid == id){
                                  this.$store.commit('setIsActive',true);
                                  break;
                              }
                          }
                      })
                  }
              }
            },
            //获取歌曲的url
            getUrl(id){
                songUrl(id).then(res =>{
                    this.$store.commit('setUrl',res.data[0].url);
                    console.log(res.data[0].url);
                }).catch(err => {
                    console.log(err);
                });
            },
            //获取歌词
            getLyric(id){
                songLyric(id).then(res =>{
                    // console.log(res.lrc.lyric);
                    this.$store.commit('setLyric',res.lrc.lyric);
                }).catch(err => {
                    console.log(err);
                });
            },

            // //解析歌词
            // parseLyric(text){
            //     let lines = text.split("\n");                   //将歌词按行分解成数组
            //     let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;   //时间格式的正则表达式
            //     let result = [];
            //     //对于歌词格式不对的直接返回
            //     if(!(/\[.+\]/.test(text))){
            //         return [[0,text]];
            //     }
            //     //去掉前面格式不正确的行
            //     while (!pattern.test(lines[0])){
            //         lines = lines.slice(1);
            //     }
            //     //遍历每一行，形成一个每行都带着俩元素的数组，第一个元素是以秒为计算单位的时间，第二个元素是歌词
            //     for(let item of lines){
            //         let time = item.match(pattern);              // 存放时间
            //         let value = item.replace(pattern,'');        //存放歌词
            //         for(let item1 of time){
            //             let t = item1.slice(1,-1).split(':');    //取出时间，换算为数组
            //             if(value!=''){
            //                 result.push([parseInt(t[0],10)*60 + parseFloat(t[1]),value]);
            //             }
            //         }
            //     }
            //     //按照第一个元素--时间--排序
            //     result.sort(function (a,b) {
            //         return  a[0]-b[0];
            //     });
            //     return result;
            // },
            //转向歌词
            toLyric(){
              this.$router.push({path:'/lyric'});
            },
            //下载音乐
            download(){
              download(this.url).then(res =>{
                  let content = res.data;
                  console.log(this.artist);
                  console.log(this.title);
                  let eleLink = document.createElement('a');
                  eleLink.download = `${this.artist}-${this.title}.mp3`;
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
            },
            //收藏歌曲
            subSong() {
                if (!this.id) {
                    this.$message.error('当前无播放歌曲');
                } else {
                    if (!this.isActive) {
                        if (this.loginIn) {
                            const params = {
                                user_id: this.userId,
                                tid: this.id,
                                time: (new Date()).getTime(),
                            }
                            subServeLikedSong(params).then(res => {
                                if (res.status == 200) {
                                    this.$store.commit("setIsActive", true)
                                    this.$message.success('收藏成功');
                                } else {
                                    this.$message.success('收藏失败');
                                }
                            })
                        } else {
                            this.$message.error('您还没有登录，请先登录')
                        }
                    } else {
                        deleteLikedSong(this.id).then(res =>{
                            if(res.status == 200){
                                this.$message.success('取消收藏成功')
                                this.$store.commit('setIsActive',false)
                            }else {
                                this.$message.error('取消收藏失败')
                            }
                        })
                    }
                }
            }
        },
    }
</script>

<style scoped lang="scss">
@import "../../assets/css/play-bar";

</style>
