<template>
    <div class="loginBody">
        <div class="loginDiv">
            <div class="login-content">
                <h1 class="login-title">用户登录</h1>
                <el-form :model="loginForm" label-width="100px"
                         :rules="rules" ref="loginForm">
                    <el-form-item label="账号" prop="username">
                        <el-input style="width: 200px" type="text" v-model="loginForm.username"
                                  autocomplete="off" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input style="width: 200px" type="password" v-model="loginForm.password"
                                  show-password autocomplete="off" size="small" @keyup.enter.native="confirm"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="confirm" :disabled="confirm_disabled">确 定</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        name: "Login",
        init(){
            this.$store.commit('setThings',null);
            this.$store.commit('setDto',null);
        },
        data(){
            return{
                confirm_disabled:false,
                loginForm:{
                    no:'',
                    password:''
                },
                rules:{
                    no: [
                        { required: true, message: '请输入账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输密码', trigger: 'blur' }
                    ],
                }
            }
        },
        methods:{

            confirm(){
                this.confirm_disabled=true;
                this.$refs.loginForm.validate((valid) => {
                    if (valid) { //valid成功为true，失败为false
                        const loginFormData = new FormData();
                        loginFormData.append("username",this.loginForm.username);
                        loginFormData.append("password",this.loginForm.password);
                        //去后台验证用户名密码
                        this.$axios.post(this.$httpUrl+'/Authentication/CheckLogin',loginFormData).then(loginres=>loginres.data).then(loginres=>{
                            if(loginres.Item1.Item1){
                                //存储
                                sessionStorage.setItem("CurUser",JSON.stringify(loginres.Item1.Item3))
                                this.$axios.defaults.headers.common['Authorization'] = `Bearer ${loginres.Item2}`;
                                this.$store.commit('setToken', loginres.Item2);
                                this.$store.commit('setUser', loginres.Item1.Item3);
                                const menuFormData = new FormData();
                                menuFormData.append("userId",loginres.Item1.Item3.UserId);
                                menuFormData.append("token",loginres.Item2);
                                this.$axios.post(this.$httpUrl+'/Permission/GetPermissions',menuFormData).then(menures=>menures.data).then(menures=>{
                                    
                                this.$store.commit("setMenu",menures)
                                });
                                //跳转到主页
                                this.$router.replace('/Index');
                            }else{
                                this.confirm_disabled=false;
                                alert('校验失败，用户名或密码错误！');
                                this.init();
                                return false;
                            }
                        });
                    } else {
                        this.confirm_disabled=false;
                        console.log('校验失败');
                        return false;
                    }
                });

            }
        }
    }
</script>

<style scoped>
    .loginBody {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #B3C0D1;
    }
    .loginDiv {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -200px;
        margin-left: -250px;
        width: 450px;
        height: 330px;
        background: #fff;
        border-radius: 5%;

    }
    .login-title {
        margin: 20px 0;
        text-align: center;
    }
    .login-content {
        width: 400px;
        height: 250px;
        position: absolute;
        top: 25px;
        left: 25px;
    }
</style>