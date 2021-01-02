<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon iconfont el-iconshangpin"></i>价格审核列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form inline :model="searchForm" ref="searchForm" @submit.native.prevent>
                <el-form-item label="所属业务" prop="business_type">
                    <el-select v-model="searchForm.business_type" placeholder="所属业务" class="w110">
                        <el-option v-for="item in auditConfigs.business_type" :key="item.value" :label="item.key" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="审批状态" prop="status">
                    <el-select v-model="searchForm.status" placeholder="审批状态" class="w110">
                        <el-option v-for="item in auditConfigs.status" :key="item.value" :label="item.key" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发起人" prop="from_user">
                    <el-input v-model="searchForm.from_user" placeholder="请输入发起人" clearable></el-input>
                </el-form-item>
                <el-form-item label="发起时间" prop="from_time">
                    <el-date-picker v-model="timestamp" value-format="timestamp" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="getcountryData(1)" size="mini" plain>搜索</el-button>
                    <el-button type="warning" icon="el-icon-refresh-right" @click="getcountryData(2)" size="mini" plain>重置</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="productList" style="width: 100%" border>
                <el-table-column align="center" label="序号" type="index" width="50" fixed="left" />
                <el-table-column align="center" label="操作" fixed="left">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == 1" type="primary" size="mini" plain @click="handleEdit(scope.row,'审批')">审批</el-button>
                        <el-button type="danger" size="mini" plain @click="handleEdit(scope.row,'查看')">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="审核状态" align="center">
                    <template scope="scope">
                        <span v-for="item in auditConfigs.status" :key="item.value">
                            <el-tag type="success" v-if="item.value==scope.row.status">{{item.key}}</el-tag>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="business_type" label="所属业务" align="center">
                    <template scope="scope">
                        <span v-for="item in auditConfigs.business_type" :key="item.value">
                            <div type="warning" v-if="item.value==scope.row.business_type">{{item.key}}</div>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="from_user" label="发起人" align="center" />
                <el-table-column prop="reason" label="驳回理由" align="center" />
                <el-table-column prop="post_ts" label="开始时间" align="center" :formatter="formatTime" />
                <el-table-column prop="end_ts" label="结束时间" align="center" :formatter="formatTime" />
            </el-table>
            <div class="pagination" key="firstT">
                <el-pagination background @current-change="handleCurrentChange" :page-sizes="[30, 50, 70, 90]" @size-change="handleSizeChange" layout="sizes, prev, pager, next" :page-size='30' :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="审批详情" center :visible.sync="dialogTableVisible" width="80%">
            <el-row :gutter="20">
                <el-col :span="6">
                    <span v-for="item in auditConfigs.business_type" :key="item.value">
                        <div type="warning" v-if="item.value==auditForm.business_type">所属业务：{{item.key}}</div>
                    </span>
                </el-col>
                <el-col :span="4">
                    发起人：{{auditForm.from_user}}
                </el-col>
                <el-col :span="4">
                    审批人：{{auditForm.to_user}}
                </el-col>
                <el-col :span="4">
                    <span v-for="item in auditConfigs.status" :key="item.value">
                        <el-tag type="success" v-if="item.value==auditForm.status">审批状态：{{item.key}}</el-tag>
                    </span>
                </el-col>
                <el-col :span="6">
                    发起时间：{{formatTime(0, 0, auditForm.post_ts)}}
                </el-col>
            </el-row>
            <el-table :data="goodEditList">
                <el-table-column align="center" label="序号" type="index" fixed="left" />
                <el-table-column prop="sku_img" label="SKU图片" align="center" width="120">
                    <template slot-scope="scope" v-if="scope.row.sku_img">
                        <img :src="cdn06+scope.row.sku_img" width="100">
                    </template>
                </el-table-column>
                <el-table-column prop="goods_id" label="商品ID" align="center" />
                <el-table-column prop="goods_name" label="商品名称" align="center" />
                <el-table-column prop="sku_id" label="SKUID" align="center" />
                <el-table-column prop="sku_name" label="SKU名称" align="center" />
                <el-table-column prop="source" label="来源" align="center" />
                <el-table-column prop="category1" label="分类" align="center">
                    <template scope="scope">
                        <span v-for="item in categories" :key="item.category_id">
                            <div type="warning" v-if="item.category_id==scope.row.category1">{{item.category_name}}</div>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否置顶">
                    <template slot-scope="scope">
                        <el-tag type='info'>{{scope.row.is_top?'是':'否'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否外漏">
                    <template slot-scope="scope">
                        <el-tag type='info'>{{scope.row.outside?'是':'否'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="SPU排序" align="center" />
                <el-table-column prop="buy_limit" label="限购数量" align="center" />
                <el-table-column prop="current_cost" label="成本价" align="center" />
                <el-table-column prop="old_price" label="变更前普通价格" align="center" />
                <el-table-column prop="new_price" label="变更后普通价格" align="center" />
                <el-table-column prop="old_origin_price" label="变更前会员价格" align="center" />
                <el-table-column prop="new_origin_price" label="变更后会员价格" align="center" />
                <el-table-column prop="old_earnest_money" label="变更前膨胀定金" align="center" />
                <el-table-column prop="new_earnest_money" label="变更后膨胀定金" align="center" />
                <el-table-column prop="old_coefficient" label="变更前膨胀系数" align="center" />
            </el-table>
            <div style="margin-top: 20px" align="center">
                <el-button type="info" @click="dialogTableVisible = false">关 闭</el-button>
                <el-button v-if="but_type=='审批'" type="danger" @click="handleEditGoodsNo">审批不通过</el-button>
                <el-button v-if="but_type=='审批'" type="success" @click="handleEditGoods">审批通过</el-button>
            </div>
        </el-dialog>
        <el-dialog title="审批不通过" :visible.sync="dialogVisibleNo" width="30%" center>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入驳回理由" v-model="reason" maxlength="50" show-word-limit>
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleNo = false">取 消</el-button>
                <el-button type="primary" @click="goodsDeleteNo">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="审批通过" :visible.sync="dialogVisible" width="30%" center>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="goodsDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {
    auditConfigs,
    auditList,
    auditDetail,
    auditReject,
    auditAccept,
    categories,
} from '@/api/activity/activity'
import data from './data.js';
import { formatDate, saveTime } from "@/utils/utils";

export default {
    name: 'priceReviewList',
    mixins: [data],
    created() {
        categories(0).then(res => {
            if (res.errno == 0) {
                this.categories = res.data
            } else {
                this.$message(res.errmsg)
            }
        }).catch(err => { });
        auditConfigs().then(res => {
            if (res.errno == 0) {
                this.auditConfigs = res.data
            } else {
                this.$message(res.errmsg)
            }
        }).catch(err => { });
    },
    mounted() {
        this.getcountryData(2);
    },
    methods: {
        handleCurrentChange(val) {
            this.searchForm.page = val
            this.getcountryData();
        },
        // 放开自定义条数
        handleSizeChange(val) {
            this.searchForm.page_size = val
            this.getcountryData();
        },
        //搜搜获取 数据goodslist
        getcountryData(mobile) {
            if (mobile == 2) {
                this.$refs.searchForm.resetFields();
                this.timestamp = [];
            }
            this.searchForm.from_time = saveTime(this.timestamp[0]);
            this.searchForm.to_time = saveTime(this.timestamp[1]);
            auditList(this.searchForm).then(res => {
                if (res.errno == 0) {
                    this.productList = res.data.list
                    this.total = res.data.total
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {
            })
        },
        handleEdit(row, but_type) {
            this.dialogTableVisible = true;
            this.but_type = but_type;
            this.audit_id = row.id
            auditDetail({ audit_id: row.id }).then(res => {
                this.goodEditList = [];
                if (res.errno == 0) {
                    this.auditForm = Object.assign({}, res.data)
                    this.goodEditList.push(res.data.details);
                } else {
                    this.dialogTableVisible = false;
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {
            })
        },
        handleEditGoodsNo() {
            this.reason = "";
            this.dialogVisibleNo = true;
        },
        handleEditGoods() {
            this.dialogVisible = true;
        },
        goodsDeleteNo() {
            this.dialogVisibleNo = false;
            auditReject({ audit_id: this.audit_id, reason: this.reason }).then(res => {
                if (res.errno == 0) {
                    this.dialogTableVisible = false;
                    this.$message({
                        message: "已驳回!",
                        type: "success"
                    });
                    this.getcountryData(2);
                } else {
                    this.getcountryData(2);
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {
            })
        },
        goodsDelete() {
            this.dialogVisible = false;
            auditAccept({ audit_id: this.audit_id }).then(res => {
                if (res.errno == 0) {
                    this.dialogTableVisible = false;
                    this.$message({
                        message: "已通过!",
                        type: "success"
                    });
                    this.getcountryData(2);
                } else {
                    this.getcountryData(2);
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {
            })
        },
        // //时间传毫秒转换中国时间
        formatTime: function (row, column, cellValue) {
            if (cellValue == 0) return
            return formatDate(cellValue)
        },
    }
}
</script>
<style scoped lang="scss">
/* 线上引入 */
.mb {
    margin-bottom: 10px;
}

.form-box {
    margin: 0 auto;
}

.fr {
    float: right;
}

.fr button {
    display: block;
    width: 100%;
    margin: 5px 0 0;
}

.drag-list {
    float: left;
    padding: 10px;
    width: 205px;
    border: 1px solid #dcdfe6;
    border-radius: 10px;
    margin: 10px;
    font-size: 12px;
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
.float_right {
    float: right;
}
.w280 {
    width: 280px;
}
.w130 {
    width: 130px;
}
.w110 {
    width: 110px;
}
.aintimport {
    position: relative;
    color: #fff;
    background-color: #f56c6c;
    padding: 5px 10px;
    border-radius: 4px;
    margin-right: 12px;
    border-color: #f56c6c;
    cursor: pointer;
}
.intimport {
    opacity: 0;
    z-index: 10;
    position: absolute;
    right: 0px;
    top: 2px;
    width: 60px;
    height: 30px;
    cursor: pointer;
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
.el-col {
    border-radius: 4px;
}
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
