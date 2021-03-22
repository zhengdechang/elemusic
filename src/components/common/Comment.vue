<template>
    <div class='comments'>
        <div class="comment_hd">
            <h2>评论<em>共{{total}}条评论</em></h2>
        </div>
        <el-form class="comment_box">
            <div class="comment_textarea">
                <div class="pre">{{msg}}</div>
                <textarea class="J_inpBox inp-paragraph" name="leave_msg" id="leave_msg" placeholder="期待你的神评论……" v-model="msg"></textarea>
            </div>
            <div class="comment_box_footer">
                <el-button type="primary" size="mini" @click="subComment">评论</el-button>
                <span class="comment_limit"><em class="num">{{msg.length}}</em>/{{maxLen}}</span>
            </div>
        </el-form>
        <div class="comment_area">
            <template v-if="comments.length">
                <div class="comment_item" v-for="(item, index) in comments" :key="index">
                    <router-link :to="{ path: '/user', query: { id: item.user.userId }}" class="comment_avatar">
                        <el-image :src="item.user.avatarUrl + '?param=120y120'">
                            <div slot="placeholder" class="image-slot">
                                <i class="iconfont icon-placeholder"></i>
                            </div>
                        </el-image>
                    </router-link>
                    <div class="comment_info">
                        <router-link :to="{ path: '/user', query: { id: item.user.userId }}">{{ item.user.nickname }}</router-link>
                        <div class="comment_content">
                            {{ item.content }}
                        </div>
                        <div class="comment_reply" v-for="replyItem in item.beReplied" :key="replyItem.beRepliedCommentId">
                            <router-link :to="{ path: '/user', query: { id: replyItem.user.userId }}">{{ replyItem.user.nickname }}</router-link>: {{ replyItem.content }}
                        </div>
                        <div class="comment_footer">
                            <div class="comment_time">{{formatMsgTime(item.time)}}</div>
                            <div class="comment_oper">
<!--                                <em class="comment_del" v-if="userInfo && userInfo.userId === item.user.userId" @click="delComment(item)"><i class="iconfont icon-del"></i></em>-->
                                <span :class="[ item.liked ? 'active' : '']" @click="likeComment(item)"><i class="iconfont icon-praise"></i>({{item.likedCount}})</span>
                                <span class="replyComment" @click="replyComment(item, index)"><i class="iconfont icon-comment"></i></span>
                            </div>
                        </div>
                        <div class="isHot" v-if="item.isHot">
                            <i class="iconfont icon-choicest"></i>
                        </div>
                        <transition name="fade" mode="out-in">
                            <ReplyComment :params="item" v-if="isShowReply(item, index)" @replyMsg="replyMsg"></ReplyComment>
                        </transition>
                    </div>
                </div>
                <div class="pagination">
                    <el-pagination
                        background
                        @current-change="currentChange"
                        layout="prev, pager, next"
                        :total="this.total">
                    </el-pagination>
                </div>
            </template>
            <div v-else class="comments_status">
                <div class="loading" v-if="!isEmpty">评论加载中...</div>
                <div class="empty" v-else>
                    <p><i class="iconfont icon-empty-main"></i></p>
                    <p>暂无留言</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ReplyComment from "./ReplyComment";
import {
    albumComment,
    comment,
    commentMv,
    commentSong,
    serveSongComment,
    getServeSongComment,
    serveMvComment,
    getServeMvComment,
    serveAlbumComment,
    getServeAlbumComment,
} from "../../networks";
export default {
    name: 'Comments',
    components: {
        ReplyComment
    },
    props: {
        // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
        type: {
            type: Number,
            default: 0
        },
        id: {
            type: String,
            default: '0'
        }
    },
    data () {
        // 这里存放数据
        return {
            msg: '',
            maxLen: 140,
            curId: this.id,
            limit: 20,
            offset: 0,
            before: 0,
            hotComments: [],
            comments: [],
            total: 0,
            currentPage: 0,
            isEmpty: false,
            replyCommentId: 0,
            replyIndex: -1,
            serveComment:[],
            childType:0,
        }
    },
    // 监听属性 类似于data概念
    computed: {
        isShowReply () {
            return function (item, index) {
                return item.commentId === this.replyCommentId && this.replyIndex === index
            }
        },
        ...mapGetters([
            'userId',
            'loginIn'
        ])
    },
    created () {
        this.childType = this.type
        this.getComment()
    },
    // 方法集合
    methods: {
        // 时间毫秒格式化处理 2020-10-30 09:30:00
        formartDate (originVal, fmt) {
            const dt = new Date(originVal)
            const opt = {
                yyyy: dt.getFullYear(),
                MM: (dt.getMonth() + 1 + '').padStart(2, '0'),
                dd: (dt.getDate() + '').padStart(2, '0'),
                HH: (dt.getHours() + '').padStart(2, '0'),
                mm: (dt.getMinutes() + '').padStart(2, '0'),
                ss: (dt.getSeconds() + '').padStart(2, '0')
            }
            for (const k in opt) {
                const ret = new RegExp('(' + k + ')').exec(fmt)
                if (ret) {
                    fmt = fmt.replace(ret[1], opt[k])
                }
            }
            return fmt
        },
        // 评论时间格式化处理
        formatMsgTime (duration) {
            let result = ''
            // const NOW = new Date()
            // const PAST = new Date(duration)

            // 判断是当天的时间 显示格式 10：30
            // if (NOW.toDateString() === PAST.toDateString()) {
            //     result = this.formartDate(duration, 'HH:mm')
            //     // 时间为当年 显示月日 时间戳
            // } else if (PAST.getFullYear() === NOW.getFullYear()) {
            //     result = this.formartDate(duration, 'MM月dd日 HH:mm')
            // } else {
            //     result = this.formartDate(duration, 'yyyy年MM月dd日')
            // }
            result = this.formartDate(duration, 'MM月dd日 HH:mm')
            return result
        },
        // 获取页面评论
        getComment () {
            this.getServeComments()
            switch (this.childType) {
                case 0:
                    this.getSongComment()
                break
                case 1:
                    this.getMvComment()
                break
                case 3:
                    this.getAlbumComment()
                break
            }
        },
        //获取歌曲评论
        getSongComment () {
             commentSong({ id: this.curId, limit: this.limit, offset: this.offset, before: this.before }).then(res =>{
                 this.msgHandler(res)
             })
        },
        //获取Mv评论
        getMvComment () {
            commentMv({ id: this.curId, limit: this.limit, offset: this.offset, before: this.before }).then(res =>{
                this.msgHandler(res)
            })
        },
        //获取专辑评论
        getAlbumComment () {
            albumComment({ id: this.curId, limit: this.limit, offset: this.offset, before: this.before }).then(res =>{
                this.msgHandler(res)
            })
        },
        //评论msg处理
        msgHandler (res) {
            if (res.code !== 200) {
                return this.$message.error('数据请求失败')
            }
            this.hotComments = res.hotComments || []
            this.hotComments.map(item => {
                item.isHot = true
                return item
            })
            this.comments = [...this.serveComment,...this.hotComments, ...res.comments]
            // 当前评论是否为空
            this.total = this.comments.length
            this.isEmpty = this.before === 0 && !this.comments.length
        },
        // 发布/删除/回复评论
        commentHandler (t, content, commentId) {
            const params = {
                t: t, // 0删除 1发送 2回复
                type: this.type, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
                id: this.curId, // 对应资源id
                content: content, // 发送的内容/对应内容的id
                commentId: commentId // 回复的评论id
            }
            comment(params).then(res =>{
                if (res.code !== 200) {
                    return this.$message.error('数据请求失败')
                }
                this.msg = ''
                this.getComment()
                if (t === 0) {
                    this.$message.success('删除评论成功！')
                } else if (t === 1) {
                    this.$message.success('评论成功！')
                } else if (t === 2) {
                    this.$message.success('回复评论成功！')
                    this.replyCommentId = 0
                    this.replyIndex = -1
                }
            })
        },
        // 发布评论
        subComment () {
            if (!this.loginIn) {
                this.$message.error('请先登录')
            }else {
                this.subServeComment()
            }
        },
        // 删除评论
        delComment (item) {
            this.$message.confirm('确定删除评论？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() => {
                    this.commentHandler(0, '', item.commentId)
                }).catch(() => {
                })
        },
        // 回复评论
        // replyComment (item, index) {
        //     // if (!this.isLogin) {
        //     //     this.setLoginDialog(true)
        //     //     return
        //     // }
        //
        //     this.replyCommentId = (this.replyCommentId === item.commentId && this.replyIndex === index) ? 0 : item.commentId
        //     this.replyIndex = index
        // },
        replyMsg (msg) {
            if (!this.isLogin) {
                this.setLoginDialog(true)
                return
            }
            this.commentHandler(2, msg, this.replyCommentId)
        },
        // // 给评论点赞
        // async likeComment (item) {
        //     if (!this.isLogin) {
        //         this.setLoginDialog(true)
        //         return
        //     }
        //
        //     const { data: res } = await this.$http.commentLike({ id: this.curId, cid: item.commentId, t: Number(!item.liked), type: this.type })
        //
        //     if (res.code !== 200) {
        //         return this.$msg.error('数据请求失败')
        //     }
        //     this.getComment()
        // },
        // // 留言分页
        currentChange (page) {
            this.offset = (page - 1) * this.limit
            this.getComment()
        },
        //提交单曲评论并获取评论
        subServeComment(){
            const params = {
                tid:this.curId,
                user_id:this.userId,
                content:this.msg,
                time:(new Date()).getTime(),
                likecount:0,
            }
            if(this.childType == 0){
                serveSongComment(params).then(res =>{
                    if(res.status){
                        this.$message.success('评论成功')
                        this.msg = ''
                        this.getServeComments()
                    }
                })
            } else if(this.childType == 1){
                serveMvComment(params).then(res =>{
                    if(res.status){
                        this.$message.success('评论成功')
                        this.msg = ''
                        this.getServeComments()
                    }
                })
            }else if(this.childType == 3){
                serveAlbumComment(params).then(res =>{
                    if(res.status){
                        this.$message.success('评论成功')
                        this.msg = ''
                        this.getServeComments()
                    }
                })
            }

        },
        //获取评论（歌曲、专辑、mv）
        getServeComments(){
            if(this.childType == 0){
                getServeSongComment(this.curId).then(res =>{
                    res.data.forEach(item =>{
                        const user =item.user_id
                        const comment = {
                            content:item.content,
                            user:{
                                avatarUrl:'http://localhost:3001/admin/api/user/getImg/'+user._id,
                                nickname:user.username,
                                userId:user._id,
                            },
                            time:Number(item.time),
                            likedCount:item.likecount
                        };
                        this.serveComment.unshift(comment)
                    })
                    // this.serveComment =JSON.parse(JSON.stringify(this.serveComment))
                })
            } else if(this.childType == 1){
                getServeMvComment(this.curId).then(res =>{
                    res.data.forEach(item =>{
                        const user =item.user_id
                        const comment = {
                            content:item.content,
                            user:{
                                avatarUrl:'http://localhost:3001/admin/api/user/getImg/'+user._id,
                                nickname:user.username,
                                userId:user._id,
                            },
                            time:Number(item.time),
                            likedCount:item.likecount
                        };
                        this.serveComment.unshift(comment)
                    })
                    // this.serveComment =JSON.parse(JSON.stringify(this.serveComment))
                })
            }else if(this.childType == 3){
                getServeAlbumComment(this.curId).then(res =>{
                    res.data.forEach(item =>{
                        const user =item.user_id
                        const comment = {
                            content:item.content,
                            user:{
                                avatarUrl:'http://localhost:3001/admin/api/user/getImg/'+user._id,
                                nickname:user.username,
                                userId:user._id,
                            },
                            time:Number(item.time),
                            likedCount:item.likecount
                        };
                        this.serveComment.unshift(comment)
                    })
                    // this.serveComment =JSON.parse(JSON.stringify(this.serveComment))
                })
            }
        }
    },
    watch: {
        id (newVal, oldVal) {
            this.curId = newVal
            this.offset = 0
            this.getComment()
        },
        msg () {
            this.msg = this.maxLen >= this.msg ? this.msg : this.msg.substring(0, this.maxLen)
        },
    }
}
</script>
<style scoped lang="less">
.comments {
    padding-top: 30px;
}

.comment_hd {
    display: flex;
    align-items: center;
    height: 60px;
    font-size: 0;

    h2 {
        flex: 1;
        font-size: 24px;
        line-height: 24px;
        font-weight: normal;

        em {
            padding-left: 20px;
            font-size: 14px;
            line-height: 14px;
            font-style: normal;
            color: #999;
        }
    }

    .userInfo {
        .avatar {
            width: 30px;
            height: 30px;
            border-radius: 4px;
            vertical-align: top;
        }

        span {
            display: inline-block;
            padding: 0 20px;
            line-height: 30px;
            font-size: 14px;
            color: #666;
        }
    }
}

.comment_box {

    .comment_textarea {
        position: relative;
        border: 1px solid #e9e9e9;
        border-radius: 4px;
        background: #fff;
    }

    .pre {
        visibility: hidden;
    }

    .inp-paragraph {
        position: absolute;
        top: 0;
        left: 0;
        height: calc(100% - 20px);
        resize: none;
        width: auto;
        padding: 0;
        border: 0;
        margin: 0;
        font-family: inherit;
        border-radius: 0;
        box-shadow: none;
        overflow: hidden;
    }

    .inp-paragraph, .pre {
        width: calc(100% - 30px);
        padding: 10px 15px;
        line-height: 24px;
        min-height: 90px;
        font-size: 14px;
        color: #333;
        border-radius: 4px;
        white-space: pre-wrap;
        word-wrap: break-word
    }

    .comment_box_footer {
        display: flex;
        padding: 15px 0 50px;
        justify-content: space-between;
    }

    .comment_limit {
        display: inline-block;
        line-height: 28px;
        padding: 0 0 0 20px;
        font-size: 14px;
        color: #666;

        em {
            font-style: normal;
        }
    }
}

.comments_status {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;

    .loading {
        font-size: 14px;
        line-height: 24px;
        color: #999;
    }

    .empty {
        text-align: center;

        p {
            font-size: 14px;
            line-height: 24px;
            color: #999;
        }

        .icon-empty-main {
            line-height: 140px;
            font-size: 100px;
            color: #bbb;
            opacity: .8;
        }
    }
}

.comment_item {
    position: relative;
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid #f2f2f2;

    .comment_avatar {
        display: in;
        width: 40px;
        height: 40px;
        border-radius: 100%;
        overflow: hidden;
    }

    .comment_info {
        flex: 1;
        padding-left: 20px;

        a {
            display: inline-block;
            padding-bottom: 10px;
            line-height: 14px;
            color: #999;
            text-decoration: none;

            &:hover {
                color: #ff641e;
            }
        }
    }

    .comment_content {
        line-height: 24px;
    }

    .comment_reply {
        padding: 10px;
        line-height: 28px;
        margin: 5px 0;
        border-radius: 4px;
        color: #666;
        background: #f2f2f2;

        a {
            display: inline-block;
            line-height: 28px;
            padding: 0;
        }
    }

    .comment_footer {
        display: flex;
        color: #999;

        .comment_time {
            display: inline-block;
            line-height: 28px;
        }

        .comment_oper {
            flex: 1;
            text-align: right;

            span {
                display: inline-block;
                margin-left: 15px;
                line-height: 28px;
                cursor: pointer;

                &.active, &.active .iconfont  {
                    color: #ff641e;
                }
            }
        }
    }

    .isHot {
        position: absolute;
        right: 0;
        top: -8px;
        z-index: 1;
        // transform: rotate(45deg);

        .icon-choicest {
            font-size: 60px;
            color: #ff641e;
            opacity: .8;
        }
    }

    .comment_del {
        cursor: pointer;
        display: none;
    }

    &:hover {
        .comment_del {
            display: inline-block;
        }
    }

    &:last-child {
        border: none;
    }
}

.pagination {
    padding: 30px 0;
    text-align: center;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>
