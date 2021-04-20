<template>
    <div>
        <login-logo/>
        <div class="signUp">
            <div class="signUp-head">
                <span>用户登录</span>
            </div>
            <el-form v-model="registerForm" ref="registerForm" label-width="70px" class="demo-ruleForm" :rules="rules">
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input type="password" v-model="registerForm.password" placeholder="密码"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button @click="goSignUp()">注册</el-button>
                    <el-button type="primary" @click="login()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import LoginLogo from "./loginLogo";
    import {mixin} from "../../mixins";
    import {getImg, loginIn} from '../../networks/index'
    export default {
        name: "login-in",
        components: {
            LoginLogo,
        },
        mixins:[mixin],
        data(){
            return{
                registerForm:{
                    username:'',            //用户名
                    password:'',            //密码
                },
                rules: {
                    username: [
                        {required:true,  trigger:'blur',  message:'请输入用户名'  }
                    ],
                    password: [
                        {required:true,  trigger:'blur',  message:'请输入密码'  }
                    ]
                }
            }
        },
        activated(){
            //使用keep-alive代替触发周期函数的内容
            this.$store.commit('setActiveName','登录');
        },
        mounted() {
            this.changeIndex('登录');
        },
        methods:{
              login(){
                  let baseURL = "http://localhost:3001/admin/api/user/getImg/"
                  loginIn(this.registerForm).then(res =>{
                  let _this = this;
                  console.log(res);
                  this.$message({
                      type:'success',
                      message:'登录成功'
                  })

                  _this.$store.commit('setLoginIn',true)
                  _this.$store.commit('setUserId',res.data.id)
                  _this.$store.commit('setUsername',res.data.username)
                  const avator = baseURL+res.data.id
                  getImg(res.data.id).then(r =>{
                      console.log(r.status);
                      if(r.status !== 200){
                          _this.$store.commit('setAvator',require("../../assets/img/user.jpg"))
                      }else {
                          _this.$store.commit('setAvator',avator)
                      }
                  }).catch(err =>{
                      console.log(err);
                  })
                      // console.log(baseURL + res.data.id);
                      setTimeout(function () {
                      _this.$router.push('/');
                      _this.changeIndex('首页');
                  },1000)
                  })

                // let _this = this;
                // loginIn(this.registerForm).then(res =>{
                //     console.log(res);
                //     if(res.status == 200){
                //         // _this.notify('注册成功','success');
                //         this.$message({
                //             type:'success',
                //             message:'登录成功'
                //         })
                //         setTimeout(function () {
                //             _this.$router.push({path:'/'});
                //         },1000)
                //     }
                // }).catch(err =>{
                //     this.$message({
                //         type:'success',
                //         message:'登录失败'
                //     })
                // })
            },
            goSignUp(){
                  this.changeIndex('注册')
                this.$router.push({path:'/sign-up'});
            },
            //改变首页theheader中的active
            changeIndex(value){
                this.$store.commit('setActiveName',value);
            }
        },
    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/sign-up";
</style>
