<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">EMS系统 | 运营后台管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 用户名下拉菜单 -->
                    <span class="el-dropdown-link" style="color:rgba(64,158,255)">
                        EMS系统欢迎您:
                    </span>
                    <span style="color:#ebd842">
                        &nbsp;{{username}}&nbsp;
                    </span>
                    <el-button type="danger" @click="loginout">退出登录</el-button>
                <!-- 用户头像 -->
                <div class="user-avator"><img src="../../assets/img/touxiang.gif"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import bus from '../common/bus';
    import {logout,logme} from '@/api/login'
    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                username: '',
                message: 2
            }
        },
        created(){
            logme().then(res=>{
                this.username = res.data.login_user_name||'',
                this.$store.commit('SET_USER_NAME', res.data.login_user_name)
                localStorage.setItem('login_user_id', res.data.login_user_id)
                
                // if(res.data.roles.name) localStorage.setItem('user_name', res.data.roles.name)
                // else localStorage.setItem('user_name', '您还没有中文名');
                // if(res.data.roles.desc) localStorage.setItem('user_desc', res.data.roles.desc)
                // else localStorage.setItem('user_desc', '您还没有角色信息')
            })
        },
        computed:{
        },
        methods:{
            // 退出登录
            loginout(){
                let that = this
                    logout().then(res => {
                        window.location.href = '/#login'
                        location.reload()
                    })
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            }
        },
        mounted(){
            if(document.body.clientWidth < 1500){
                this.collapseChage();
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }
    .header .logo{
        float: left;
        width:250px;
        line-height: 70px;
    }
    .header-right{
        float: right;
        padding-right: 50px;
    }
    .header-user-con{
        display: flex;
        height: 70px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .btn-bell .el-icon-bell{
        color: #fff;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
        padding: 0 30px;
    }
    .el-dropdown-menu__item--divided:before{
        background: none;
    }
</style>
