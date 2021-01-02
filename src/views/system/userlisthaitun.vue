<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-peoplefill"></i> 海豚家用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!--@input="searchChange"-->
                <el-input v-model="select_word" placeholder="请输入用户ID或昵称" class="handle-input mr10" />
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
                <el-table-column prop="user_id" label="用户ID" align="center" width="130" />
                <!-- <el-table-column prop="user_img" label="头像" :span="1" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.user_img" alt width="50" height="50" />
          </template>
                </el-table-column>-->
                <el-table-column prop="nicked_name" label="昵称" align="center" width="80" />
                <el-table-column prop="is_vip_text" label="VIP" align="center" width="50" />
                <el-table-column prop="channel_from" label="渠道" align="center" width="80" />
                <el-table-column prop="discount_text" label="折扣等级" align="center" width="80" />
                <el-table-column prop="birthday" label="生日" align="center" />
                <el-table-column prop="sex_text" label="性别" align="center" width="50" />
                <el-table-column prop="phone_number" label="手机号" align="center" />
                <el-table-column prop="create_time_text" label="注册时间" align="center">
                    <template slot-scope="scope" v-if="scope.row.create_time_text">
                        <i class="el-icon-time" />
                        &nbsp;
                        {{scope.row.create_time_text}}
                    </template>
                </el-table-column>
                <el-table-column prop="beans" label="金豆" align="center">
                    <template slot-scope="scope">
                        <span
                            style="text-decoration: underline;cursor:pointer;color:#409EFF"
                            @click="goldbeandetailClick(scope.row)"
                        >{{scope.row.beans}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="balance" label="余额" align="center">
                    <template slot-scope="scope">
                        <span
                            style="text-decoration: underline;cursor:pointer;color:#409EFF"
                            @click="balanceDetailClick(scope.row)"
                        >{{scope.row.balance}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="member_level_text" label="会员等级" align="center" />
                <el-table-column prop="member_time_text" label="会员开通" align="center">
                    <template slot-scope="scope">
                        <i class="el-icon-time" />
                        &nbsp;
                        {{scope.row.member_time_text}}
                    </template>
                </el-table-column>
                <el-table-column prop="expire_time_text" label="会员到期" align="center">
                    <template slot-scope="scope">
                        <i class="el-icon-time" />
                        &nbsp;
                        {{scope.row.expire_time_text}}
                    </template>
                </el-table-column>
                <el-table-column prop="user_status_text" label="用户状态" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.user_status_text}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" width="180">
                    <template slot-scope="scope">
                        <el-button
                            style="margin-bottom:10px;min-width:120px;"
                            v-if="scope.row.user_status=='0'"
                            type="danger"
                            icon="el-icon-lock"
                            @click="userChangesureunlock(scope.row)"
                        >禁用</el-button>
                        <el-button
                            style="margin-bottom:10px;min-width:120px;"
                            v-if="scope.row.user_status=='1'"
                            type="success"
                            icon="el-icon-unlock"
                            @click="userChangesurelock(scope.row)"
                        >解锁</el-button>
                        <el-button
                            style="margin-left:0;margin-bottom:10px;min-width:120px;"
                            class="prebutton"
                            type="primary"
                            icon="el-icon-edit"
                            @click="goldbeanEdit(scope.row)"
                        >补发金豆</el-button>
                        <el-button
                            style="margin-left:0;margin-bottom:10px;min-width:120px;"
                            class="prebutton"
                            type="primary"
                            icon="el-icon-edit"
                            @click="balanceEdit(scope.row)"
                        >补发金额</el-button>
                        <el-button
                            v-if="scope.row.is_vip==='1'||scope.row.is_vip===1"
                            style="margin-left:0;margin-bottom:10px;"
                            class="prebutton"
                            type="primary"
                            icon="el-icon-edit"
                            @click="memberEdit(scope.row)"
                        >修改会员到期日</el-button>
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
        <!-- 编辑弹出框 -->
        <el-dialog title="当前用户信息" :visible.sync="editVisible" width="40%" center>
            <el-form ref="form" :rules="rules" :model="modify_user" label-width="100px">
                <el-form-item>
                    <img :src="modify_user.user_img" alt="用户头像" width="100" height="100" />
                </el-form-item>
                <el-form-item label="ID:" prop="user_id">
                    <el-input v-model="modify_user.user_id" readonly disabled />
                </el-form-item>
                <el-form-item label="openid:" prop="open_id">
                    <el-input v-model="modify_user.open_id" readonly disabled />
                </el-form-item>
                <el-form-item label="昵称:" prop="nicked_name">
                    <el-input v-model="modify_user.nicked_name" readonly disabled />
                </el-form-item>
                <el-form-item label="性别:" prop="nicked_name">
                    <el-input v-model="modify_user.nicked_name" readonly disabled />
                </el-form-item>
                <el-form-item label="国家:" prop="country">
                    <el-input v-model="modify_user.country" readonly disabled />
                </el-form-item>
                <el-form-item label="省:" prop="province">
                    <el-input v-model="modify_user.province" readonly disabled />
                </el-form-item>
                <el-form-item label="市:" prop="city">
                    <el-input v-model="modify_user.city" readonly disabled />
                </el-form-item>
                <el-form-item label="连续签到天数:" prop="day">
                    <el-input v-model="modify_user.day" readonly disabled />
                </el-form-item>
                <el-form-item label="会员信息:" prop="user_info">
                    <div>普通会员，消费0元</div>
                </el-form-item>
                <el-form-item label="用户类型" prop="is_vip">
                    <el-radio-group v-model="modify_user.is_vip">
                        <el-radio label="0">普通</el-radio>
                        <el-radio label="1">VIP</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="分销权限" prop="qr_status">
                    <el-radio-group v-model="modify_user.qrcode_status">
                        <el-radio label="0">关闭</el-radio>
                        <el-radio label="1">一级分销</el-radio>
                        <el-radio label="2">二级分销</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="lock_flag" width="300px" center>
            <div class="del-dialog-cnt">您确定要删除该用户吗？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="lock_flag = false">取 消</el-button>
                <el-button type="primary" @click="saveDelete">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 锁定 用户 提示框 -->
        <el-dialog title="提示" :visible.sync="unlock_dialog" width="300px" center>
            <div class="del-dialog-cnt">您确定要禁用该用户吗？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="unlock_dialog = false">取 消</el-button>
                <el-button type="primary" @click="htuserForbiduse">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 解锁 用户 提示框 -->
        <el-dialog title="提示" :visible.sync="lock_dialog" width="300px" center>
            <div class="del-dialog-cnt">您确定要解锁该用户吗？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="lock_dialog = false">取 消</el-button>
                <el-button type="primary" @click="htuserForbiduse">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 补发金豆提示窗 -->
        <el-dialog title="补发金豆" :visible.sync="goldbean_dialog" width="30%" center>
            <el-form :model="form_beans">
                <el-form-item label="金豆数" :label-width="formLabelWidth">
                    <el-input v-model="form_beans.beans" autocomplete="off" style="width:80%;"></el-input>
                </el-form-item>
                <el-form-item label="操作" :label-width="formLabelWidth">
                    <el-radio-group v-model="form_beans.beans_operation">
                        <el-radio label="1">增加</el-radio>
                        <el-radio label="2">减少</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-dialog
                width="20%"
                center
                title="提示"
                :visible.sync="inner_goldbean_dialog"
                append-to-body
            >
                <span class="inner_span">确定要改变用户金豆数吗？</span>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="inner_goldbean_dialog = false" style="margin-right:50px;">取 消</el-button>
                    <el-button type="primary" @click="goldbeanSure">确 定</el-button>
                </div>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button @click="goldbean_dialog = false" style="margin-right:50px;">取 消</el-button>
                <el-button type="primary" @click="inner_goldbean_dialog = true">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 补发余额提示窗 -->
        <el-dialog title="补发金额" :visible.sync="balance_dialog" width="30%" center>
            <el-form :model="form_balance">
                <el-form-item label="订单ID" :label-width="formLabelWidth">
                    <el-input v-model="form_balance.order_id" autocomplete="off" style="width:80%;"></el-input>
                </el-form-item>
                <el-form-item label="金额" :label-width="formLabelWidth">
                    <el-input v-model="form_balance.assets" autocomplete="off" style="width:80%;"></el-input>
                </el-form-item>
                <el-form-item label="原因" :label-width="formLabelWidth">
                    <el-select
                        v-model="form_balance.catagory"
                        placeholder="请选择原因"
                        @change="changeAssets"
                    >
                        <el-option
                            :value="item.value"
                            :label="item.name"
                            v-for="(item,index) in catagory_List"
                            :key="index"
                        >{{item.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作" :label-width="formLabelWidth">
                    <el-radio-group v-model="form_balance.assets_operation">
                        <el-radio label="1">增加</el-radio>
                        <el-radio label="2">减少</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-dialog
                width="20%"
                center
                title="提示"
                :visible.sync="inner_balance_dialog"
                append-to-body
            >
                <span class="inner_span">确定要改变用户金额吗？</span>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="inner_balance_dialog = false" style="margin-right:50px;">取 消</el-button>
                    <el-button type="primary" @click="balanceSure">确 定</el-button>
                </div>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button @click="balance_dialog = false" style="margin-right:50px;">取 消</el-button>
                <el-button type="primary" @click="inner_balance_dialog = true">确 定</el-button>
                <!-- <el-button type="primary" @click="goldbeanSure">确 定</el-button> -->
            </div>
        </el-dialog>
        <!-- 修改会员到期日 -->
        <el-dialog title="修改会员到期日" :visible.sync="member_dialog" width="30%" center>
            <el-date-picker v-model="expire_timedate" type="datetime" placeholder="选择日期时间"></el-date-picker>
            <div slot="footer" class="dialog-footer">
                <el-button @click="member_dialog = false" style="margin-right:20px;">取 消</el-button>
                <el-button type="primary" @click="memberSure">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    userlisthaitun,
    userchangehaitun,
    userchangebeans,
    userchangeassets,
    userassetscategory,
    usermembertime,
    userDelete,
    updateUser
} from "@/api/system/user/user";
export default {
    name: "userManage",
    data() {
        return {
            user_id: "",
            beans: "",
            beans_operation: "",
            formLabelWidth: "100px",
            form_beans: {
                beans: "",
                beans_operation: ""
            },
            form_balance: {
                order_id: "",
                catagory: "",
                assets: "",
                assets_operation: ""
            },
            catagory_List: [],
            userchange_row: {},
            bean_row: {},
            lock_dialog: false,
            unlock_dialog: false,
            sendObj_userchange: {
                user_id: "",
                user_status: ""
            },
            goldbean_dialog: false,
            inner_goldbean_dialog: false,
            balance_dialog: false,
            inner_balance_dialog: false,
            member_dialog: false,
            expire_timedate: "",
            loading: false,
            tableData: [],
            cur_page: 1,
            page_size: 30,
            select_word:"",
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
            total_count: {}
        };
    },
    created() {
        // this.initData();
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
                        // d.user_status = "已锁定";
                        d.lock = "解锁";
                        d.icon = "el-icon-lx-unlock";
                    } else {
                        // d.user_status = "正常";
                        d.lock = "锁定";
                        d.icon = "el-icon-lx-lock";
                    }
                    return d;
                });
            }
        }
    },
    methods: {
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
            this.initData(this.select_word);
        },
        // 渲染列表
        initData() {
            this.loading = true;
            let sendObj = {
                cur_page: this.cur_page,
                page_size: this.page_size,
                key_word: this.select_word
            };
            userlisthaitun(sendObj)
                .then(res => {
                    if (res.errno == 0) {
                        this.loading = false;
                        this.tableData = res.data.list;
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
        // 修改用户信息 - 修改按钮
        handleEdit(row) {
            let id = row.audit_name;
            this.modify_user = row;
            this.editVisible = true;
        },
        // 修改用户信息 - 保存按钮
        saveEdit() {
            let sendObj = {
                user_id: this.modify_user.user_id,
                is_vip: this.modify_user.is_vip,
                qr_status: this.modify_user.qrcode_status
            };
            updateUser(sendObj)
                .then(res => {
                    if (res.errno == 0) {
                        this.$message.success("恭喜你，修改成功！");
                        this.initData();
                        this.editVisible = false;
                    } else {
                        this.$message.error(res.errmsg);
                        this.editVisible = false;
                    }
                })
                .catch(err => {});
        },
        // 点击删除
        deleteItem(row) {
            this.lock_flag = true;
            this.lock_name = row.user_id;
        },
        // 删除
        saveDelete() {
            let sendObj = { user_id: this.lock_name };
            userDelete(sendObj)
                .then(res => {
                    if (res.errno == 0) {
                        this.$message.success("删除用户成功");
                        this.initData();
                    } else {
                        this.$message.error(res.errmsg);
                    }
                })
                .catch(err => {});
            this.lock_flag = false;
        },
        //禁用
        userChangesureunlock(row) {
            this.userchange_row = row;
            this.unlock_dialog = true;
        },
        //解锁
        userChangesurelock(row) {
            this.userchange_row = row;
            this.lock_dialog = true;
        },
        htuserForbiduse() {
            let newuser_status = "";
            if (this.userchange_row.user_status == "1") {
                newuser_status = "0";
            } else {
                newuser_status = "1";
            }
            let sendObj = {
                user_id: this.userchange_row.user_id,
                user_status: newuser_status
            };
            this.sendObj_userchange = sendObj;
            userchangehaitun(this.sendObj_userchange)
                .then(res => {
                    if (res.errno == 0) {
                        this.$message.success("恭喜你，修改成功！");
                        this.initData();
                    } else {
                        this.$message.error(res.errmsg);
                    }
                })
                .catch(err => {});
            this.unlock_dialog = false;
            this.lock_dialog = false;
        },
        // 补发金豆
        goldbeanEdit(row) {
            this.user_id = row.user_id;
            this.form_beans.beans = "";
            this.form_beans.beans_operation = "";
            this.goldbean_dialog = true;
        },
        goldbeanSure() {
            let sendObj = {
                user_id: this.user_id,
                beans: this.form_beans.beans,
                beans_operation: this.form_beans.beans_operation
            };
            userchangebeans(sendObj)
                .then(res => {
                    if (res.errno == 0) {
                        this.$message.success(res.errmsg);
                        this.initData();
                    } else {
                        this.$message.error(res.errmsg);
                    }
                })
                .catch(err => {});
            this.inner_goldbean_dialog = false;
            this.goldbean_dialog = false;
            //   console.log(this.goldbean_num);
        },
        //修改金额原因列表
        categoryList() {
            let sendObj = {};
            userassetscategory(sendObj)
                .then(res => {
                    if (res.errno == 0) {
                        this.catagory_List = res.data.list;
                    } else {
                        this.$message.error(res.errmsg);
                    }
                })
                .catch(err => {});
            this.inner_balance_dialog = false;
            this.balance_dialog = false;
            //   console.log(this.goldbean_num);
        },
        // 补发金额
        balanceEdit(row) {
            this.user_id = row.user_id;
            this.form_balance.assets = "";
            this.form_balance.order_id = "";
            this.form_balance.catagory = "";
            this.form_balance.assets_operation = "1";
            this.categoryList();
            this.balance_dialog = true;
        },
        balanceSure() {
            let sendObj = {
                user_id: this.user_id,
                order_id: this.form_balance.order_id,
                catagory: this.form_balance.catagory,
                assets: this.form_balance.assets,
                assets_operation: this.form_balance.assets_operation
            };
            userchangeassets(sendObj)
                .then(res => {
                    if (res.errno == 0) {
                        this.$message.success(res.errmsg);
                        this.initData();
                    } else {
                        this.$message.error(res.errmsg);
                    }
                })
                .catch(err => {});
            this.inner_balance_dialog = false;
            this.balance_dialog = false;
            //   console.log(this.goldbean_num);
        },
        changeAssets(val) {},
        //金豆明细
        goldbeandetailClick(row) {
            localStorage.setItem("user_id", row.user_id);
            this.$router.push({
                path: "/goldbeanDetail"
            });
        },
        //金额明细
        balanceDetailClick(row) {
            localStorage.setItem("user_id", row.user_id);
            this.$router.push({
                path: "/balanceDetail"
            });
        },
        //修改会员到期日
        memberEdit(row) {
            this.user_id = row.user_id;
            this.expire_timedate = row.expire_time_text;
            this.member_dialog = true;
        },
        memberSure() {
            let sendObj = {
                user_id: this.user_id,
                expire_time: new Date(this.expire_timedate).getTime() / 1000
            };
            usermembertime(sendObj)
                .then(res => {
                    if (res.errno == 0) {
                        this.$message.success(res.errmsg);
                        this.initData();
                    } else {
                        this.$message.error(res.errmsg);
                    }
                })
                .catch(err => {});
            this.member_dialog = false;
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
.inner_span {
    display: block;
    width: 80%;
    color: #ff0000;
    text-align: center;
}
</style>
