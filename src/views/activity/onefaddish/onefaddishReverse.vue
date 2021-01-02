<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon iconfont el-iconshangpin"></i> 一元爆款商品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-col :span="20" :offset="2">
                <div class="form-box">
                    <el-form ref="commodity_form" :rules="rules" :model="commodity_form" label-width="80px">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-autocomplete style="width: 100%;margin-bottom: 10px" v-model="commodity_form.goods_name" :fetch-suggestions="querySearch" placeholder="请输入商品名称" :trigger-on-focus="false" @select="handleSelect">
                                <template slot="append">
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                        <el-form-item label="sku名字">
                            <el-input v-model="commodity_form.sku_name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="skuID">
                            <el-input v-model="commodity_form.sku_id" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="商品ID">
                            <el-input v-model="commodity_form.goods_id" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="商品简称" prop="short_name">
                            <el-input style="width: 100%;margin-bottom: 10px" v-model="commodity_form.short_name" placeholder="请输入商品简称"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="act_price">
                            <el-input style="width: 100%;margin-bottom: 10px" type="number" v-model="commodity_form.act_price" @change="handleChange" placeholder="请输入商品价格"></el-input>
                        </el-form-item>
                        
                        <el-form-item>
                            <el-button @click="handle('commodity_form')" type="success" size="medium" plain class="">添加</el-button>
                            <span style="color:red ">&nbsp; &nbsp;选择以上条目后,然后点击添加按钮保存商品</span>
                        </el-form-item>
                        <div>
                            <el-card class="box-card mb">
                                <div slot="header" class="clearfix"><span>一元爆款商品列表</span>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                </div>
                                <el-table v-loading="false" element-loading-text="拼命加载中" align="center" :data="tableData" border class="table" ref="multipleTable">
                                    <el-table-column fixed="left" label="商品排序" key="index" type="index" align="center" width="80">
                                    </el-table-column>
                                    <el-table-column prop="goods_name" label="商品名称" width="200">
                                        <template slot-scope="scope">
                                            {{scope.row.goods_name}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column key="goods_id" prop="goods_id" label="商品id" />
                                    <el-table-column key="sku_name" prop="sku_name" label="SKU名" width="200" />
                                    <el-table-column key="order_sort" prop="order_sort" label="调整排序" width="160">
                                        <template slot-scope="scope">
                                            <el-row>
                                                <el-col :span="14">
                                                    <el-input type="number" v-model="scope.row.order_sort"></el-input>
                                                </el-col>
                                                <el-col :span="2">
                                                    &nbsp;
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-button  type="primary" icon="el-icon-s-unfold" @click="sortClick(scope.row)" plain></el-button>
                                                </el-col>
                                            </el-row>
                                        </template>
                                    </el-table-column>
                                    <el-table-column key="short_name" prop="short_name" label="简名称" />
                                    <el-table-column key="activity_price" prop="activity_price" label="活动价" />
                                    <el-table-column key="status" prop="status" label="商品状态" />
                                   
                                    <el-table-column label="操作" align="center" width="180" fixed="right">
                                        <template slot-scope="scope">
                                            <div style="margin-bottom: 10px">
                                                <el-button type="danger" size="mini" @click="handleDelete(scope.row)"  plain>删除</el-button>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>        
                            </el-card>
                        </div>
                    </el-form>
                </div>
            </el-col>
        </div>
    </div>
</template>

<script>
const commodityForm = {
    sku_id: '',  
    goods_id: '', //商品id
    act_id: '',  //活动id
    goods_name: '',  //商品名字
    sku_name: '',  //sku名字
    short_name: '',  //商品简称
    act_price: '',  //商品价格
    order_sort: 0, //分类 暂时无用
};
import { actautocomplete, skusearch, } from '@/api/activity/activity'
import { specialGoodsAdd,specialGoodsList,specialGoodsUpdate } from '@/api/activity/onefaddish/onefaddish'
import { mapGetters } from 'vuex'
export default {
    name:'',
    data() {
        return {
            form: {},
            commodity_form: { ...commodityForm }, // 商品保存信息
            rules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                short_name: [
                    { required: true, message: '请输入商品简称', trigger: 'blur' }
                ],
                act_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                ]
            },
            tableData:[],
        }
    },
    props: ['formData'],
    computed: {
        ...mapGetters(['onefaddishId']),
    },
    watch: {
        formData: {
            handler(val) {
                this.form = val;
            },
            deep: true,
            immediate: true,
        },
    },
    mounted() {
        this.initGoodsList()
    },
    methods: {
        querySearch(queryString, cb) { //input 触发事件
            actautocomplete(queryString).then(res => {
                if (res.errno == 0) {
                    for (var i = 0; i < res.data.list.length; i++) {
                        res.data.list[i].value = res.data.list[i].name;
                    }
                    var restaurants = res.data.list;
                    var results = queryString ? restaurants : restaurants;
                    cb(results);
                } else {
                    this.$message.error(res.errmsg)
                }
            })
        },
        handleSelect(item) { //选中品牌
            this.commodity_form.goods_name = item.value
            this.commodity_form.goods_id = item.goods_id
            let that = this
            skusearch({ goods_name: item.value }).then(res => {//获取选中场馆商品的信息
                if (res.errno == 0) {
                    that.commodity_form.sku_id = res.data.skuInfo.sku_id
                    that.commodity_form.sku_name = res.data.skuInfo.sku_name
                } else {
                    that.$message.error(res.errmsg)
                }
            }).catch(err => {
            })
        },
        //添加商品
        handle(commodity_form) {
            let valids = true;
            this.$refs[commodity_form].validate((valid) => {
                if (valid) {
                    valids = false;
                } else {
                    valids = true;
                    return false;
                }
            });
            if (valids) return;
            this.commodity_form.act_id = this.form.id;
            specialGoodsAdd(this.commodity_form).then(res => {
                if (res.errno == 0) {
                    this.$message({
                        message: "操作成功!",
                        type: "success"
                    });
                    this.commodity_form = { ...commodityForm };
                    this.initGoodsList();
                    return;
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {
                // alert('请刷新页面')
            })
        },
        //价格保留两位小数
        handleChange(val) {
            if(this.commodity_form.act_price) {
                this.commodity_form.act_price=Number(val).toFixed(2)
            }
        },
        
        //删除活动商品
        handleDelete(row) {
            this.$confirm("确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(() => {
                let sendObj = {
                    id: row.id,
                    status:2
                }
                specialGoodsUpdate(sendObj).then(res => {
                    if (res.errno == 0) {
                        this.$message({
                            message: "删除成功!",
                            type: "success"
                        });
                        this.initGoodsList();
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {
                })
            })
        },
        //一元爆款商品列表
        initGoodsList(item) {
            this.good_list = [];
            specialGoodsList(this.onefaddishId).then(res => {
                if (res.errno == 0) {
                    this.tableData = res.data.list
                } else {
                    this.$message.error(res.errmsg)
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
            })
        },
        //商品排序
        sortClick(row) {
            this.$confirm("确认更新排序?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let sendObj = {
                    id: row.id,
                    order_sort:row.order_sort
                }
                specialGoodsUpdate(sendObj).then(res => {
                    if (res.errno == 0) {
                        this.$message({
                            message: "操作成功!",
                            type: "success"
                        });
                        this.initGoodsList();
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {
                })
            })
        },
    }
}
</script>

<style scoped>
/* 线上引入 */
.mb {
    margin-bottom: 10px;
}

.form-box {
    margin: 0 auto;
}

.el-table th,
.el-table tr.el-table__row {
    float: left !important;
}

.el-table tr {
    float: left !important;
}

.red {
    color: #ff0000;
}

</style>
