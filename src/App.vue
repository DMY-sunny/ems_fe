<template>
    <div id="app">
        <!-- <router-view></router-view> -->
        <!-- 新增刷新 -->
        <keep-alive>
            <!-- <router-view :include="includeModule"></router-view> -->
            <router-view v-if="isRouterAlive"></router-view>
            <!-- <router-view v-if="isRouterAlive || this.$route.meta.keepAlive"></router-view> -->
        </keep-alive>
    </div>
</template>
<script>
export default {
    name: 'App',
    //路由缓存 新增刷新====开始
    provide: function () {
        return {
            reload: this.reload
        }
    },
    data: function () {
        return {
            isRouterAlive: true,
            // includeModule:['EventPageList','EventPageEditing'],
        }
    },
    methods: {
        reload: function () {
            this.isRouterAlive = false;
            this.$nextTick(function () {
                this.isRouterAlive = true
            })
        },
    }
    // 新增刷新====结束
}
</script>
<style>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css"; /*深色主题*/
/*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
/*EventPageNew 热区选择样式*/
#container div {
    border: 0.5px solid green;
    position: absolute;
    background-color: #409eff;
    opacity: 0.4;
}
.el-image-viewer__close {
    color: #ffffff;
}
</style>
