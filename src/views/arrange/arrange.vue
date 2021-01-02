<template>
    <div class="arrange">
        <h1>会场id配置</h1>
        <div>主会场id配置<el-button type="primary" @click="toNext(8)">点击跳转>></el-button>
        </div>
        <div>美妆会场配置<el-button type="primary" @click="toNext(1)">点击跳转>></el-button>
        </div>
        <!-- <div>零食会场配置<el-button type="primary" @click="toNext(2)">点击跳转>></el-button>
        </div>
        <div>轻奢会场配置<el-button type="primary" @click="toNext(3)">点击跳转>></el-button>
        </div>
        <div>包邮包税配置<el-button type="primary" @click="toNext(4)">点击跳转>></el-button>
        </div>
        <div>保健会场配置<el-button type="primary" @click="toNext(5)">点击跳转>></el-button>
        </div>
        <div>家居会场配置<el-button type="primary" @click="toNext(6)">点击跳转>></el-button>
        </div>
        <div>服饰会场配置<el-button type="primary" @click="toNext(7)">点击跳转>></el-button>
        </div> -->
    </div>
</template>
<script>

import { actType, cmsCreateData, cmsGetData } from '@/api/arrange.js'
export default {
    data() {
        return {

        };
    },
    created() {

    },
    methods: {
        toNext(index) {
            this.$router.push({
                path: "/addArrange" + index
            });
        }
    }
}
</script>
<style>
.arrange div{
    margin-bottom: 20px;
}
.arrange .el-button{
    margin-left: 20px;
}
</style>