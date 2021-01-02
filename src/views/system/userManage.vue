<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-lx-peoplefill"></i> 用户管理</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <div class="handle-box">
            <!--@input="searchChange"-->
            <el-input v-model="select_word" placeholder="请输入用户ID或妮称" class="handle-input mr10"/>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <div class="user-detail-title">
            <span class="user-first-title">总用户数:</span>
            <strong  class="user-second-title">{{total_count.user_count}}</strong>
            <span class="user-first-title">VIP用户数:</span>
            <strong  class="user-second-title">{{total_count.user_vip_count}}</strong>
            <span class="user-first-title">银卡:</span>
            <strong  class="user-second-title">{{total_count.user_silver_count}}</strong>
            <span class="user-first-title">金卡:</span>
            <strong  class="user-second-title">{{total_count.user_gold_count}}</strong>
            <span class="user-first-title">白金:</span>
            <strong  class="user-second-title">{{total_count.user_platinum_count}}</strong>
            <span class="user-first-title">钻石:</span>
            <strong  class="user-second-title">{{total_count.user_diamond_count}}</strong>
        </div>
        <el-table v-loading="false"
                  element-loading-text="拼命加载中"
                  :data="tableTemp" border class="table"
                  ref="multipleTable">
            <el-table-column prop="user_id" label="用户ID" align="center"/>
            <el-table-column prop="logo_url" label="头像" :span="1" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.user_img" alt="" width="50" height="50">
                </template>
            </el-table-column>
            <el-table-column prop="nicked_name" label="昵称" align="center">
                <template slot-scope="scope" v-if="scope.row.nicked_name">
                    <el-tag>
                        {{scope.row.nicked_name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="isVip" label="VIP" align="center" width="100"/>
            <el-table-column prop="channel_from" label="渠道" align="center"/>
            <el-table-column prop="member_level" label="折扣等级" align="center" width="100"/>
            <el-table-column prop="createtime" label="关注时间" align="center">
                <template slot-scope="scope" v-if="scope.row.createtime">
                    <i class="el-icon-time" />&nbsp;
                    {{scope.row.createtime}}
                </template>
            </el-table-column>
            <el-table-column prop="invite_code" label="邀请码" align="center"/>
            <el-table-column prop="invite_total" label="邀请额" align="center" width="100"/>
            <el-table-column label="操作" align="center" fixed="right" width="200">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="deleteItem(scope.row)">删除</el-button>
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
                    :page-size = '30'
                    :total="total">
            </el-pagination>
        </div>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog title="当前用户信息" :visible.sync="editVisible" width="40%" center>
        <el-form ref="form" :rules="rules" :model="modify_user" label-width="100px">
            <el-form-item>
                <img :src="modify_user.user_img" alt="用户头像" width="100" height="100">
            </el-form-item>
            <el-form-item label="ID:" prop="user_id">
                <el-input v-model="modify_user.user_id" readonly disabled/>
            </el-form-item>
            <el-form-item label="openid:" prop="open_id">
                <el-input v-model="modify_user.open_id" readonly disabled/>
            </el-form-item>
            <el-form-item label="昵称:" prop="nicked_name">
                <el-input v-model="modify_user.nicked_name" readonly disabled/>
            </el-form-item>
            <el-form-item label="性别:" prop="nicked_name">
                <el-input v-model="modify_user.nicked_name" readonly disabled/>
            </el-form-item>
            <el-form-item label="国家:" prop="country">
                <el-input v-model="modify_user.country" readonly disabled/>
            </el-form-item>
            <el-form-item label="省:" prop="province">
                <el-input v-model="modify_user.province" readonly disabled/>
            </el-form-item>
            <el-form-item label="市:" prop="city">
                <el-input v-model="modify_user.city" readonly disabled/>
            </el-form-item>
            <el-form-item label="连续签到天数:" prop="day">
                <el-input v-model="modify_user.day" readonly disabled/>
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
</div>
</template>
<script>
import {
    userList,
    userDelete,
    updateUser
} from '@/api/system/user/user'
export default {
    name: 'userManage',
    data() {
        return {
            loading: false,
            tableData: [],
            cur_page: 1,
            page_size: 30,
            select_word: '',
            lock_name: '',
            del_list: [],
            editVisible: false,
            lock_flag: false,
            modify_user: {
                is_vip:'0',
                qr_status:'0'
            },
            total:null,
            rules :{},
            total_count:{}
        }
    },
    created() {
        this.initData()
    },
    computed: {
        tableTemp() {
            if(this.tableData){
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (Number(d.wrong_times) >= 5) {
                        d.user_status = '已锁定'
                        d.lock = '解锁'
                        d.icon = 'el-icon-lx-unlock'
                    } else {
                        d.user_status = '正常'
                        d.lock = '锁定'
                        d.icon = 'el-icon-lx-lock'
                    }
                    return d;
                })
            }
        }
    },
    methods: {
        // 分页导航
        handleCurrentChange(val) {
            this.cur_page = val;
            this.initData()
        },
        //        放开自定义条数
        handleSizeChange(val) {
            this.page_size = val
            this.initData()
        },
        searchChange() {
            this.cur_page = 1
            this.initData(this.select_word)
        },
        search() {
            this.cur_page = 1
            this.initData(this.select_word)
        },
        // 渲染列表
        initData(keyword) {
            this.loading = true
            let sendObj = {
                cur_page: this.cur_page,
                page_size: this.page_size,
                key_word: keyword ? keyword : ''
            }
            userList(sendObj).then(res => {
                if(res.errno == 0){
                    this.loading = false
                    this.tableData = res.data.list
                    this.total = res.data.total-0
                    this.total_count = res.data.total_count
                }else{
                    this.$message.error(res.errmsg)
                    this.tableData = res.data.list
                    this.total = res.data.total-0
                    this.loading = false
                }
            }).catch(err => {
                this.loading = false
            })
        },
        // 修改用户信息 - 修改按钮
        handleEdit(row) {
            let id = row.audit_name
            this.modify_user = row
            this.editVisible = true;
        },
        // 修改用户信息 - 保存按钮
        saveEdit() {
            let sendObj = {
                user_id: this.modify_user.user_id,
                is_vip: this.modify_user.is_vip,
                qr_status: this.modify_user.qrcode_status,
            }
            updateUser(sendObj).then(res => {
                if (res.errno == 0) {
                    this.$message.success('恭喜你，修改成功！')
                    this.initData()
                    this.editVisible = false
                } else {
                    this.$message.error(res.errmsg)
                    this.editVisible = false
                }
            }).catch(err => {

            })
    },
        // 点击删除
        deleteItem(row) {
            this.lock_flag = true
            this.lock_name = row.user_id
        },
        // 删除
        saveDelete() {
            let sendObj = {user_id: this.lock_name, }
            userDelete(sendObj).then(res => {
                if (res.errno == 0) {
                    this.$message.success('删除用户成功')
                    this.initData()
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
            this.lock_flag = false
        },
    }
}
</script>

<style scoped>
.handle-box {
    float: left;
    margin-bottom: 20px;
}
.user-detail-title{
    float: left;width: 100%;margin-bottom: 20px;clear: both
}
.user-first-title{
    float: left;padding-right: 2%
}
.user-second-title{
    float: left;padding-right: 6%
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
</style>
