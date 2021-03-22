<template>
    <div>
        <div class="info">
            <div class="title">
                <span>编辑个人资料</span>
            </div>
            <hr/>
            <div class="personal">
                <el-form v-model="registerForm" ref="registerForm" label-width="70px" class="demo-ruleForm" :rules="rules">
                    <el-form-item prop="username" label="用户名">
                        <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="密码">
                        <el-input type="password" v-model="registerForm.password" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="sex" label="性别">
                        <el-radio-group v-model="registerForm.sex">
                            <el-radio label="0">女</el-radio>
                            <el-radio label="1">男</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="phoneNum" label="手机">
                        <el-input  v-model="registerForm.phoneNum" placeholder="手机"></el-input>
                    </el-form-item>
                    <el-form-item prop="email" label="邮箱">
                        <el-input  v-model="registerForm.email" placeholder="邮箱"></el-input>
                    </el-form-item>
                    <el-form-item prop="birth" label="生日">
                        <el-date-picker v-model="registerForm.birth" placeholder="选择日期" style="width:100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="introduction" label="签名">
                        <el-input  v-model="registerForm.introduction" placeholder="签名"></el-input>
                    </el-form-item>
                    <el-form-item prop="location" label="地区">
                        <el-select  v-model="registerForm.location" placeholder="地区" style="width:100%;">
                            <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="btn">
                    <el-button type="primary" @click="saveMsg">保存</el-button>
                    <el-button @click="goback(-1)">取消</el-button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import {cities,rules}  from "../../assets/data/form"
    import {changeUser,getUserData} from  '../../networks/index'
    import {mapGetters} from 'vuex'
    export default {
        name: "info",
        components: {
        },
        data(){
            return{
                registerForm:{
                    username:'',            //用户名
                    password:'',            //密码
                    sex:'',                 //性别
                    phoneNum:'',            //手机号码
                    email:'',               //邮箱
                    birth:'',               //生日
                    introduction:'',        //签名
                    location:'',            //地区
                },
                cities:[],                  //所有的地区--省
                rules:{},                   //表单提交的规则
            }
        },
        computed:{
          ...mapGetters([
              'userId'
          ])
        },
        created() {
            this.fetch();
            this.cities = cities;
            this.rules =  rules;
        },
        methods:{
            //保存信息
            saveMsg(){
                changeUser(this.registerForm,this.userId).then(res =>{
                    console.log(res);
                    this.$message({
                        type:'success',
                        message:'保存成功'
                    })
                    setTimeout(()=>{
                        this.$router.push({path:'/'})
                    },1000)

                }).catch(err =>{
                    console.log(err);
                })

            },
            goback(index){
                this.$router.go(index);
            },
            //获取用户资料
            fetch(){
                getUserData(this.userId).then(res =>{
                    this.registerForm = res.data
                })
            }
        },
    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/info";
</style>
