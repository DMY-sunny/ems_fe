<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-peoplefill"></i> 金额明细
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="table_title" style="overflow:hidden;">
                金额明细
                <!-- <el-button
                    style="float:right"
                    type="primary"
                    icon="el-icon-plus"
                    @click="balanceEdit"
                >发放金额</el-button>-->
            </div>
            <div class="handle-box">
                <el-input v-model="order_id" placeholder="请输入订单ID" class="handle-input mr10" />
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <el-table
                v-loading="false"
                element-loading-text="拼命加载中"
                :data="tableTemp"
                border
                class="table"
                ref="multipleTable"
            >
                <el-table-column prop="number_idx" label="序号" align="center" width="55" />
                <el-table-column prop="user_id" label="用户ID" align="center" />
                <el-table-column prop="amount" label="消耗或获得资产数量" align="center" />
                <el-table-column prop="billing_state_text" label="入账状态" align="center" />
                <el-table-column prop="op_type_text" label="操作类型" align="center" />
                <el-table-column prop="catagory_text" label="分类" align="center" />
                <el-table-column prop="relation_id" label="关联ID" align="center" />
                <el-table-column prop="desc" label="记录简介" align="center" />
                <el-table-column prop="create_time_text" label="创建时间" align="center">
                    <template slot-scope="scope" v-if="scope.row.create_time_text">
                        <i class="el-icon-time" />
                        &nbsp;
                        {{scope.row.create_time_text}}
                    </template>
                </el-table-column>
                <el-table-column prop="billing_time_text" label="入账处理时间" align="center">
                    <template slot-scope="scope" v-if="scope.row.billing_time_text">
                        <i class="el-icon-time" />
                        &nbsp;
                        {{scope.row.billing_time_text}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    background
                    :page-sizes="[30, 50, 70, 90]"
                    @size-change="handleSizeChange"
                    layout="sizes, prev, pager, next"
                    :page-size="30"
                    :total="total"
                ></el-pagination>
            </div>
        </div>
        <!-- 补发余额提示窗 -->
        <el-dialog title="补发余额" :visible.sync="balance_dialog" width="30%">
            <el-input v-model="balance_num" autocomplete="off" :autofocus="true"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="balance_dialog = false">取 消</el-button>
                <el-button type="primary" @click="balanceSure">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { userassetslist } from "@/api/system/user/user";
export default {
    name: "userManage",
    data() {
        return {
            order_id: "",
            userDetails: [
                {
                    user_id: "929388383"
                }
            ],
            loading: false,
            tableData: [],
            cur_page: 1,
            page_size: 30,
            select_word: "",
            lock_name: "",
            del_list: [],
            editVisible: false,
            lock_flag: false,
            modify_user: {
                is_vip: "0",
                qr_status: "0"
            },
            total: null,
            rules: {},
            total_count: {},
            coupon_type: "全部优惠券",
            goldbean_dialog: false,
            balance_dialog: false,
            member_dialog: false,
            membership_dialog: false,
            membership_type: "银卡",
            goldbean_num: "",
            balance_num: "",
            member_date: "2019-10-10"
        };
    },
    created() {
        this.initData();
    },
    computed: {
        tableTemp() {
            if (this.tableData) {
                return this.tableData.filter(d => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (Number(d.wrong_times) >= 5) {
                        d.user_status = "已锁定";
                        d.lock = "解锁";
                        d.icon = "el-icon-lx-unlock";
                    } else {
                        d.user_status = "正常";
                        d.lock = "锁定";
                        d.icon = "el-icon-lx-lock";
                    }
                    return d;
                });
            }
        }
    },
    methods: {
        changeStatus(val) {
            // console.log(val)
        },
        // 分页导航
        handleCurrentChange(val) {
            this.cur_page = val;
            this.initData();
        },
        //        放开自定义条数
        handleSizeChange(val) {
            this.page_size = val;
            this.initData();
        },
        searchChange() {
            this.cur_page = 1;
            this.initData(this.select_word);
        },
        search() {
            this.cur_page = 1;
            this.initData(this.order_id);
        },
        // 渲染列表
        initData(keyword) {
            this.loading = true;
            let sendObj = {
                cur_page: this.cur_page,
                page_size: this.page_size,
                order_id: this.order_id,
                user_id: localStorage.getItem("user_id")
            };
            userassetslist(sendObj)
                .then(res => {
                    if (res.errno == 0) {
                        this.loading = false;
                        this.tableData = res.data.list;
                        for (let i = 0; i < this.tableData.length; i++) {
                            this.tableData[i].number_idx =
                                i +
                                1 +
                                this.cur_page * this.page_size -
                                this.page_size;
                        }
                        this.total = res.data.total - 0;
                        this.total_count = res.data.total_count;
                    } else {
                        this.$message.error(res.errmsg);
                        this.tableData = res.data.list;
                        this.total = res.data.total - 0;
                        this.loading = false;
                    }
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        //补发余额
        balanceEdit() {
            this.balance_num = "";
            this.balance_dialog = true;
        },
        balanceSure() {
            this.balance_dialog = false;
            //   console.log("补发余额：",this.balance_num)
        }
    }
};
</script>

<style scoped>
.handle-box {
    float: left;
    margin-bottom: 20px;
}
.user-detail-title {
    float: left;
    width: 100%;
    margin-bottom: 20px;
    clear: both;
}
.user-first-title {
    float: left;
    padding-right: 2%;
}
.user-second-title {
    float: left;
    padding-right: 6%;
}
.create_account {
    float: left;
    margin-left: 40px;
}
.handle-input {
    width: 300px;
    display: inline-block;
}

.del-dialog-cnt {
    font-size: 16px;
    text-align: center;
}

.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table_title {
    font-size: 16px;
    margin-bottom: 15px;
}
.table_bot {
    margin-bottom: 20px;
}
.address_div {
    overflow: hidden;
}
</style>
