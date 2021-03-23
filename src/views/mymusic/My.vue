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
<style scoped lang="less">
a {
    text-decoration: none;
    color: #333;
}
.my{
    margin-top: 70px;
}
.my-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
}
.my-aside {
    width: 300px;
    padding: 10px 0;
    margin: 40px 0;
    border-radius: 4px;
    overflow-y: auto;
    box-shadow: 0 0 20px 0 rgba(65,67,70,.05);

    h3 {
        display: flex;
        padding: 0 20px;
        line-height: 40px;
        font-size: 14px;
        justify-content: space-between;
        cursor: pointer;

        .iconfont {
            transform: rotate(-90deg);
            transition: all .3s ease-in-out;
        }

    }

    .my-favorite {
        cursor: pointer;
    }
}
.my-main {
    flex: 1;
    padding: 0 20px;
    margin: 40px 0;
    overflow-y: auto;
}
.playlist-main {
    overflow: hidden;

    .el-image {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        overflow: hidden;
    }

    .item {
        display: flex;
        padding: 10px 20px;
        cursor: pointer;

        .icon-del {
            display: none;
        }

        &:hover {
            background:#f5f5f5;

            .icon-del {
                display: block;
            }
        }

        &.active {
            background:#f5f5f5;
        }
    }

    .info {
        flex: 1;
        padding-left: 10px;
    }

    .name {
        width: 100%;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-all;
        cursor: pointer;
    }

    .author {
        position: relative;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #999;

        span {
            display: inline-block;
            color: #666;
        }

        .icon-del {
            position: absolute;
            right: 0;
            bottom: 0;
        }
    }

    &.active {
        height: 0;
    }
}

</style>
