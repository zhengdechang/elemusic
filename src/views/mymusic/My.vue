<template>
    <div class='my'>
        <div class="w1200">
            <div class="my-container">
                <div class="my-aside">
                    <!--收藏歌曲  -->
                    <router-link :to="{ name: 'mymusic', query: {type:item.type,id:userId} }" :class="['item', String(id) === String(id) ? 'active' : '']" class="item" v-for="(item,index) in col"  :key="index" >
                        <h3 class="my-favorite active">我收藏的{{item.name}} <i class="iconfont icon-arrow"></i></h3>
                        <!--<i class="iconfont icon-del" @click="delPlayList(item, index, 'created')"></i>-->
                    </router-link>
                </div>
                <div class="my-main">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    components: {

    },
    created () {
        this.init();
    },
    computed:{
        ...mapGetters([
            'listOfSongs',
            'userId',
        ])
    },
    data () {
        // 这里存放数据
        return {
            col:[
                {type:'song',name:'歌曲'},
                {type:'album',name:'歌单'},
                {type:'artist',name:'歌手'},
                {type:'collection',name:'专辑'},
             ],
            createdList: [],
            collectList: [],
            slideBox1: false,
            slideBox2: false,
            id: this.$route.query.id
        }
    },
    mounted () {
    },
    // 方法集合
    methods: {
        init(){
            const loginIn = window.sessionStorage.getItem('loginIn')
            if(loginIn == 'false'||!loginIn){
                this.$router.push('/login-in')
                this.$message.warning('你还没有登录，请先登录')
            }else {
                this.$router.push(`/my/mymusic?type=song&id=${this.userId}`)
            }
        },
    },
}
</script>
<style scoped lang="scss">
@import "src/assets/css/my.scss";
</style>
