<template>
    <div class="coupon">
        <h1>优惠券配置</h1>
        <div>一键领取配置<el-button type="primary" @click="toNext('/couponall')">点击跳转>></el-button>
        </div>
        <!-- <div>单张领取配置
            <el-button type="primary" @click="toNext('/couponone')">点击跳转>></el-button>
        </div> -->
    </div>
</template>
<script>
export default {
    data() {
        return {

        };
    },
    created() {

    },
    methods: {
        toNext(name) {
            this.$router.push({
                path: name
            });
        }
    }
}
</script>
<style>
.coupon div {
    margin-bottom: 20px;
}
.coupon .el-button {
    margin-left: 20px;
}
</style>