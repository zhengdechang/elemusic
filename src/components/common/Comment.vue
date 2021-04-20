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
                        <el-image :src="item.user.avatarUrl + '?param=120y120'" class="el-img">
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
                            <div class="comment_time">{{format(item.time,'MM月DD日 hh:mm')}}</div>
                            <div class="comment_oper">
                                <em class="comment_del" @click="delComment(item)" v-if="userId === item.user.userId"><i class="iconfont icon-del"></i></em>
                                <span :class="[ item.liked ? 'active' : '']" @click="likeComment(item)"><i class="iconfont icon-dianzan"></i>({{item.likedCount}})</span>
                                <span class="replyComment" @click="replyComment(item, index)"><i class="iconfont icon-comment"></i></span>
                            </div>
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
import {mixin} from "../../mixins";
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
    getServeAlbumComment, songDeteleComment, mvDeteleComment, albumDeteleComment,
} from "../../networks";
export default {
    name: 'Comments',
    components: {
        ReplyComment
    },
    mixins:[mixin],
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
            this.$forceUpdate()
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
            this.comments = this.unique([...this.serveComment,...this.hotComments, ...res.comments])
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
                this.subServeComment();
            }
        },
        // 删除评论
        delComment (item) {
            this.$confirm('确定删除评论？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() => {
                    if(this.childType == 0){
                        songDeteleComment(item._id).then(res =>{
                            console.log(res);
                            this.getComment();
                        })
                    } else if(this.childType == 1){
                        mvDeteleComment(item._id).then(res =>{
                            console.log(res);
                            this.getComment();
                        })
                    }else if(this.childType == 3){
                        albumDeteleComment(item._id).then(res =>{
                            console.log(res);
                            this.getComment();
                    })

                  }
                }).catch(() => {
                    console.log('取消')
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
                        this.$message.success('评论成功!数据同步可能会耗时!')
                        this.msg = ''
                    }
                })
            } else if(this.childType == 1){
                serveMvComment(params).then(res =>{
                    if(res.status){
                        this.$message.success('评论成功!数据同步可能会耗时!')
                        this.msg = ''
                        // this.getServeComments()
                    }
                })
            }else if(this.childType == 3){
                serveAlbumComment(params).then(res =>{
                    if(res.status){
                        this.$message.success('评论成功!数据同步可能会耗时!')
                        this.msg = ''
                        // this.getServeComments()
                    }
                })
            }
            this.getComment()
        },
        //获取评论（歌曲、专辑、mv）
        getServeComments(){
            if(this.childType == 0){
                getServeSongComment(this.curId).then(res =>{
                    this.serveComment = []
                    res.data.forEach(item =>{
                        const user =item.user_id
                        const comment = {
                            content:item.content,
                            tid:item.tid,
                            _id:item._id,
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
                    this.serveComment = []
                    res.data.forEach(item =>{
                        const user =item.user_id
                        const comment = {
                            content:item.content,
                            tid:item.tid,
                            _id:item._id,
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
                    this.serveComment = []
                    res.data.forEach(item =>{
                        const user =item.user_id
                        const comment = {
                            content:item.content,
                            tid:item.tid,
                            _id:item._id,
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
        serveComment(newVal,oldVal){
            this.serveComment = newVal
            this.getComment()
        }
    }
}
</script>
<style scoped lang="scss">
@import "src/assets/css/comment";
</style>
