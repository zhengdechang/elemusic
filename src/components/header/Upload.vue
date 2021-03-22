<template>
    <div class="upload">
        <p class="title">修改头像</p>
        <hr/>
        <div class="section">
            <el-upload drag :action="uploadUrl()" :show-file-list="false" :on-success="handleAvatorSuccess"
                    :before-upload="beforeAvatorUpload" name="head">
                <i class="el-icon-upload"></i>
                <div>
                    将文件拖到此处，或<span style="color:blue">修改头像</span>
                </div>
                <div slot="tip">只能上传jpg/png文件且不能超过10MB</div>
            </el-upload>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {mixin} from "../../mixins";
    import {getImg} from "../../networks/index"
    export default {
        name: "Upload",
        mixins:[mixin],
        data(){
            return{
                UserInfo:{},
            }
        },
        computed:{
            ...mapGetters([
                'userId'
            ])
        },
        methods:{
            //上传地址
            uploadUrl(){
                return `http://localhost:3001/admin/api/user/changeImg/${this.userId}`;
            },
            //上传成功
            handleAvatorSuccess(res,file){
                getImg(this.userId).then(res =>{
                    console.log(res.config.url);
                    console.log(res.config.baseURL);
                    this.$store.commit("setAvator",res.config.baseURL+res.config.url);
                    if(res.request.status == 200){
                        this.$message({
                            type:'success',
                            message:'修改成功'
                        });
                    }else {
                        this.$message({
                            type:'error',
                            message:'修改失败'
                        });
                    }
                    // getUserData(this.userId).then(res =>{
                    //     this.UserInfo = res.data
                    //     console.log(this.UserInfo);
                    // })
                    // changeUser(this.UserInfo,this.userId).then(res =>{
                    //     console.log(res)});
                    this.$router.go(0);
                })

            },
            //上传之前的校验
            beforeAvatorUpload(file){
                const isJPG = file.type == 'image/jpeg';
                const isLt10M = file.size /1024/1024<10;
                if(!isJPG){
                    this.$message({
                        type:'error',
                        message:'上传头像图片只能是JPG格式'
                    });
                    return false;
                }
                if(!isLt10M){
                    this.$message({
                        type:'error',
                        message:'上传头像图片不能大于10Mb'
                    });
                    return false;
                }
                return true;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/upload";
</style>
