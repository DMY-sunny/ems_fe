<template>
    <div class="table">
        <div class="crumbs">
            <h3>
                <i class="el-icon-time"></i> 活动搜索
            </h3>
        </div>
        <div>
            <el-input v-model="goods_id" @keyup.enter.native="seekInfo" class="width_inout" placeholder="根据商品id搜索"></el-input>
            <el-button @click="seekInfo">搜索</el-button>
        </div>
        <div style="margin-top:20px">
            <el-table :data="dataList" border style="width: 100%">
                <el-table-column prop="desc" label="活动名称" width="180"> </el-table-column>
                <el-table-column prop="act_id" label="活动id" width="130"> </el-table-column>
                <el-table-column prop="goods_id" label="商品id" width="130"> </el-table-column>
                <el-table-column prop="china_vip_price" label="vip价格" width="100"> </el-table-column>
                <el-table-column prop="china_goods_price" label="原价" width="100"> </el-table-column>
                <el-table-column prop="address" label="时间" width="180">
                    <template slot-scope="scope">
                        <div>开始：<span>{{scope.row.start_time_text}}</span></div>
                        <div>结束：<span>{{scope.row.end_time_text}}</span></div>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="商品图片" width="90">
                    <template slot-scope="scope">
                        <img style="width:70px;" :src="image_host+scope.row.logo_url" />
                    </template>
                </el-table-column>
                <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
                <el-table-column label="操作" align="center" width="100" fixed="right">
                    <template slot-scope="scope">
                        <div style="margin-bottom: 10px">
                            <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { atcGoods,delactgoods } from '@/api/banner.js'
export default {
    data() {
        return {
            image_host: "",
            goods_id: "",
            dataList: []
        }
    },
    methods: {
        seekInfo() {
            atcGoods(this.goods_id).then(res => {
                if (res.errno === 0) {
                    this.image_host = res.data.image_host
                    this.dataList = res.data.list
                }
            })
        },
        //删除
        handleDelete(row) {
            this.$confirm("确认在该活动中删除此商品吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let sendObj={
                    type:row.type,
                    goods_id:row.goods_id,
                    act_id:row.act_id,
                }
                delactgoods(sendObj).then(res => {
                    if(res.errno == 0){
                        this.$message({
                            message: "已成功删除!",
                            type: "success"
                        });
                        this.seekInfo();
                    }else{
                        this.$message.error(res.errmsg);
                    }
                    
                });
            }).catch(() => {});
        },
    }
}
</script>
<style scoped>
.width_inout {
    width: 300px;
}
</style>