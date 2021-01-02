<template>
<div class="login-wrap">
    <div class="ms-login">
        <el-tabs  v-model="activeName" style="background-color: rgba(255,255,255, 0.5);" :stretch="true">
            <el-tab-pane label="扫码登录" name="second">
                <div  class="login-tabs">
                    <div id="login_container"></div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="账号登录">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                    <el-form-item prop="audit_name">
                        <el-input
                                class="login-input"
                                style="width:290px"
                                placeholder="请输入用户名"
                                v-model="ruleForm.audit_name">
                            <i slot="prefix" class="el-icon-user-solid"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="audit_token">
                        <el-input
                                style="width:290px"
                                class="login-input"
                                @keyup.enter.native="submitForm('ruleForm')"
                                type="password"
                                placeholder="请输入密码"
                                v-model="ruleForm.audit_token">
                            <i slot="prefix" class="el-icon-lollipop"></i>
                        </el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="loading">登录 系统</el-button>
                    </div>
                </el-form>
                <!-- <el-alert
                        title="账号登录功能即将下线，请尽快绑定钉钉"
                        type="error"
                        center
                        :closable="false"
                        effect="light">
                </el-alert> -->
            </el-tab-pane>
        </el-tabs>
    </div>
</div>
</template>
<script>
import {toDate} from '@/utils/index'
import {login , isLogin,dingdingLogin,dingdingautoLogin} from '@/api/login'
export default {
    name: 'login',
    data: function(){
        return {
            loading:false,
            activeName:'second',
            ruleForm: {
                type:'dingding',//登录方式: 钉钉扫码 dingding、用户密码登录 normal
                audit_name: '',//用户名: type 为 normal 时必填
                audit_token: '',//密码: type 为 normal 时必填
                tmp_auth_code: this.$route.query.code,//临时授权码: type 为 dingding 时必填
            },
            rules: {
                audit_name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                audit_token: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },
            login_code:this.$route.query.code,
        }
    },
    // 扫码登录
    mounted(){
        if(!this.login_code){
            // APP_ID
            // 运营后台生产环境线上 dingoal0yizrpmhiglhjra
            // 运营后台正式测试环境 dingoa2ddtwuqffgjv3vwj
            let appId = 'dingoal0yizrpmhiglhjra' // appId 线上
            // let baseUrl = encodeURIComponent('http://ems.test.dfs800.com/#/login') //测试环境 回调域名：扫码成功跳转的url，需要进行编码
            let baseUrl = encodeURIComponent('http://ems.dfs800.com/#/login') //线上环境 回调域名：扫码成功跳转的url，需要进行编码
            let url = encodeURIComponent(
                `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appId}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${baseUrl}`
            ) // goto参数,需要进行编码
            var obj = DDLogin({
                id: "login_container", //这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
                goto: url, // 转码后的url
                style: "border:none;background-color:#FFFFFF;", // 二维码的样式
                width: "300", // 二维码的宽度
                height: "360" // 二维码的高度
            });
            // **width和height不代表二维码的大小，二维码大小是固定的210px210px。
            var hanndleMessage = function (event) {
                let {origin} = event;
                if (origin == "https://login.dingtalk.com") { //判断是否来自ddLogin扫码事件。
                    let {data:loginTmpCode} = event; //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
                    window.location.href=`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appId}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${baseUrl}&loginTmpCode=${loginTmpCode}` //
                }
            };
            if (typeof window.addEventListener != 'undefined') {
                window.addEventListener('message', hanndleMessage, false);
            } else if (typeof window.attachEvent != 'undefined') {
                window.attachEvent('onmessage', hanndleMessage);
            }
        }else{
            login(this.ruleForm).then(res => {
                if (res.errno == 0) {
                    // 将token赋值localStorage
                    localStorage.setItem("accessToken","Bearer "+res.data.access_token)
                    window.location.href = '/#dashboard'
                    location.reload()
                    // 将token赋值给全局变量
                    // this.$root.Authorization = res.data.access_token
                } else {
                    this.$message.error(res.errmsg)
                    this.loading = false
                }
            }).catch(err => {
                this.loading = false
                this.$message.error(res.errmsg)
                this.errorMsg(res.errmsg)
            })
        }
    },
    methods: {
      //用户名密码登录
        submitForm() {
        this.ruleForm.type = "normal"
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    login(this.ruleForm).then(res => {
                        if (res.errno == 0) {
                            // 将token赋值localStorage
                            localStorage.setItem("accessToken","Bearer "+res.data.access_token)
                            window.location.href = '/#dashboard'
                            location.reload()
                            // 将token赋值给全局变量
                            // this.$root.Authorization = res.data.access_token
                        } else {
                            this.$message.error(res.errmsg)
                            this.loading = false
                        }
                    }).catch(err => {
                        this.loading = false
                    })
                } else {
                    return false
                }
            })
        },
    }
}
</script>

<style>
.login-tabs{
    height: 320px;
}
.login-wrap{
    position: relative;
    width:100%;
    height:100%;
    background-image: url(../assets/img/login-bg.gif);
    background-size: 100%;
}
.ms-title{
    width:100%;
    line-height: 50px;
    text-align: center;
    font-size:20px;
    border-bottom: 1px solid #ddd;
    margin-top: 20px;
}
.ms-login{
    position: absolute;
    left:50%;
    top:40%;
    width:350px;
    margin:-190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255,255,255, 0.5);
    overflow: hidden;
}
/*.ms-content{
    padding: 30px 30px;
}*/
    .login-input{
        margin-bottom: 22px
    }
.login-btn{
    text-align: center;
}
.login-btn button{
    width:100%;
    height:36px;
    margin-bottom: 10px;
}
    .el-tabs__item{
        line-height: 70px!important;
        height: 70px!important;
        font-size: 16px;
        font-weight: bold;
    }
    #login_container{
        position: absolute;
        left:57%;
        top:50%;
        margin:-160px 0 0 -175px;
    }
    .ms-content{
        padding: 48px 30px 0px;
        margin-bottom: 45px;
    }
</style>