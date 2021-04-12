<template>
    <div class="the-header">
        <i v-if="activeName != '首页'" class="iconfont iconfont-back icon-fanhui" @click="back()"></i>
        <div class="header-logo" @click="goHome">
            <i class="icon iconfont icon-lianmaiyinleermai"></i>
            <span class="title-text">EleMusic</span>
        </div>
        <ul class="navbar">
            <li  :class="{active:item.name == activeName}" v-for="item in navMsg" :key="item.path" @click="goPage(item.path,item.name)">
                {{item.name}}
            </li>


            <li>
                <span class="search" @keyup.enter="search" >
                        <el-popover
                                ref="popover"
                                width="200"
                                placement="bottom-end"
                                trigger="manual"
                                v-model="isShowSearch"
                                v-clickoutside="handleClose">
                            <el-input
                                    class="keyVal"
                                    slot="reference"
                                    placeholder="请输入歌名、歌词、歌手或专辑"
                                    v-model="keyVal"
                                    @focus="handleFocus"
                                    @input="handleInput"
                                    clearable>
                            </el-input>
                            <template>
                                <div class="hot-search" v-if="!keyVal">
                                    <h5>热门搜索</h5>
                                    <div class="hot-search-list">
                                        <div class="hot-item" v-for="(item, index) in serachHot" :key="index" @click="jumpSearch(item)">
                                            <span :class="[ index < 3 ? 'top-' + index : '']">{{(index + 1) + '.'}}</span>
                                            {{item.first}}
                                        </div>
                                    </div>
                                </div>
                                <div class="search-key-list" v-else>
                                    <div class="search-item" v-for="(item, index) in suggestInfo.order" :key="index">
                                        <h6>{{listType[item]}}</h6>
                                        <div class="item-main">
                                            <div class="list" v-for="(val, k) in suggestInfo[item]" :key="k" @click="jumpPage(val, item)">
                                                {{val.name}}
                                                <template v-if="item === 'songs'">
                                                    -<span v-for="(a, i) in val.artists" :key="i">{{a.name + (i !== 0 ? ' / ' : '')}}</span>
                                                </template>
                                                <template v-else-if="item === 'albums'">
                                                    -<span>{{val.artist.name}}</span>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-popover>
                        <i class="iconfont icon-soushuo" @click="search"></i>
                    </span>
<!--                <div class="header-search">-->
<!--                    <input type="text" placeholder="搜索音乐" @keyup.enter="goSearch()" v-model="keywords">-->
<!--                    <div class="search-btn" @click="goSearch()">-->
<!--                        <svg class="icon">-->
<!--                            <use xlink:href="#icon-sousuo"></use>-->
<!--                        </svg>-->
<!--                    </div>-->
<!--                </div>-->
            </li>


            <li v-show="!loginIn" :class="{active:item.name == activeName}" v-for="item in loginMsg" :key="item.path" @click="goPage(item.path,item.name)">
                {{item.name}}
            </li>
        </ul>
        <div class="header-right" v-show="loginIn">
            <div id="user">
                <img :src="attachImageUrl(this.avator)" alt="" >
            </div>
            <ul class="menu">
                <li v-for="(item,index) in menuList" :key="index" @click="goMenuList(item.path)">
                    {{item.name}}
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {navMsg,loginMsg,menuList} from '../../assets/data/header'
    import {searchHot, searchSuggest} from "../../networks";
    export default {
        name: "Header",
        data(){
          return {
              navMsg:[],          //左侧导航栏
              keywords:'',        //搜索关键字
              loginMsg:[],        //右侧导航栏
              menuList:[],        //用户下拉菜单
              isShowSearch: false,
              keyVal: '',
              serachHot: [],
              suggestInfo: {},
              listType: {
                  songs: '单曲',
                  artists: '歌手',
                  albums: '专辑',
                  playlists: '歌单'
              },
          }
        },
        components:{

        },
        computed:{
            ...mapGetters([
                'activeName',
                "loginIn",
                'avator'
            ])
        },
        mounted() {
            document.querySelector('#user').addEventListener('click',function (e) {
                document.querySelector('.menu').classList.add("show");
                e.stopPropagation();   //关键在于阻止冒泡
            },false);
            document.querySelector('.menu').addEventListener('click',function (e) {
                e.stopPropagation();     //点击菜单内部时，阻止时间冒泡，这样点击内部时菜单不会消失
            },false);
            document.addEventListener('click',function () {
                document.querySelector('.menu').classList.remove('show')
            },false)

        },
        methods:{
            //返回
            back(){
                this.$router.go(-1);
            },
            //获取搜索建议
            getSearchSuggest () {
                searchSuggest({ keywords: this.keyVal }).then(res =>{
                    if (res.code !== 200) {
                        return this.$message.error('数据请求失败')
                    }

                    this.suggestInfo = res.result
                })

            },
            //热门搜索
            getSearchHot () {
                searchHot().then(res =>{
                    if (res.code !== 200) {
                        return this.$msg.error('数据请求失败')
                    }
                    this.serachHot = res.result.hots
                })
            },
            handleInput () {
                if (this.keyVal) {
                    this.showSearch()
                    this.isShowSearch = true
                } else {
                    this.isShowSearch = false
                }
            },
            // 显示搜索列表 若有关键词显示搜索建议，否则显示默认热门搜索列表
            showSearch () {
                if (!this.keyVal) {
                    this.serachHot = []
                    this.getSearchHot()
                } else {
                    this.suggestInfo = {}
                    this.getSearchSuggest()
                }
            },
            handleFocus () {
                this.showSearch()
                this.isShowSearch = true
            },
            handleClose () {
                this.isShowSearch = false
            },
            search () {
                // 点击搜索关键词，跳转到搜索结果页面
                if (this.keyVal) {
                    this.$router.push({ path: '/search', query: { key: this.keyVal } })
                    this.isShowSearch = false
                }
            },
            // 搜索建议列表，点击后跳转到相对应的落地页
            jumpPage (item, type) {
                this.keyVal = item.name
                switch (type) {
                    case 'songs':
                        this.$router.push({ path: '/song', query: { id: item.id } })
                        break
                    case 'artists':
                        this.$router.push({ path: '/artist', query: { id: item.id } })
                        break
                    case 'albums':
                        this.$router.push({ path: '/album', query: { id: item.id } })
                        break
                    case 'playlists':
                        this.$router.push({ path: '/song-list/detail', query: { id: item.id } })
                        break
                }
                this.isShowSearch = false
            },
            // 默认热门搜索列表，点击后台跳转到搜索结果页面
            jumpSearch (item) {
                this.isShowSearch = false
                this.keyVal = item.first
                if (item.first === this.$route.query.key) {
                    return
                }
                this.$router.push({ path: '/search', query: { key: item.first } })
            },
            goHome(){
                this.$store.commit('setActiveName',navMsg[0].name)
                this.activeName = navMsg[0].name
                this.$router.push({path:'/'});
            },
            goPage(path,name){
                this.$store.commit('setActiveName',name)
                this.$router.push({path:path});
            },
            //获取图片地址/头像
            attachImageUrl(avator){
                return avator ? avator : require("../../assets/img/user.jpg");
            },
            //设置菜单选择
            goMenuList(path){
                if(path == 0){
                    this.$store.commit('setLoginIn',false);
                    this.$store.commit('setIsActive',false);
                    this.$store.commit('setIsActiveAlbum',false);
                    this.$store.commit('setIsActiveSong',false);
                    this.$store.commit('setIsActiveArtist',false);
                    this.$store.commit('setIsActiveCollection',false);
                    this.$router.go(0);
                }else {
                    this.$router.push({path:path});
                }
            }
        },
        created() {
            this.navMsg = navMsg;
            this.loginMsg = loginMsg;
            this.menuList = menuList;
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/the-header.scss";
</style>
