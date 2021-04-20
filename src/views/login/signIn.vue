<template>
    <div>
        <login-logo/>
        <div class="signUp">
            <div class="signUp-head">
                <span>用户注册</span>
            </div>
            <el-form v-model="registerForm" ref="registerForm" label-width="70px" class="demo-ruleForm" :rules="rules">
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input type="password" v-model="registerForm.password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item prop="sex" label="性别">
                    <el-radio-group v-model="registerForm.sex">
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="1">男</el-radio>
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
                <div class="login-btn">
                    <el-button @click="goback(-1)">取消</el-button>
                    <el-button type="primary" @click="SignUp()">确定</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {cities,rules}  from "../../assets/data/form"
    import LoginLogo from "./loginLogo";
    import {mixin} from "../../mixins";
    import {postSignUp} from  '../../networks/index'
    export default {
        name: "sign-in",
        components: {
            LoginLogo,
        },
        mixins:[mixin],
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
                    avator:'../../assets/img/user.jpg',              //头像
                },
                cities:[],                  //所有的地区--省
                rules:{},                   //表单提交的规则
            }
        },
        created() {
            this.cities = cities;
            this.rules =  rules;
        },
        activated(){
            //使用keep-alive代替触发周期函数的内容
            this.$store.commit('setActiveName','注册');
        },
        methods:{
            SignUp(){
                let _this = this;
                postSignUp(this.registerForm).then(res =>{
                    if(res.status == 200){
                            // _this.notify('注册成功','success');
                        this.$message({
                            type:'success',
                            message:'注册成功'
                         })
                        setTimeout(function () {
                            _this.$router.push({path:'/login-in'});
                        },1000)
                    }
                }).catch(err =>{
                    console.log(err);
                })

            },
            goback(index){
                this.$router.go(index);
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/sign-up";
</style>
