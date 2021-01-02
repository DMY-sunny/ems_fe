<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-lx-peoplefill"></i> 签到记录</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <div class="handle-box">
            <!--@input="searchChange"-->
            <el-input v-model="nicked_name" placeholder="请输入用户妮称" class="handle-input mr10"
                      ></el-input>
            <el-select v-model="continue_day" placeholder="签到天数" class="handle-select mr10">
                <!--<el-option value="0" label="全部"></el-option>-->
                <el-option
                v-for="(item,index) in dataListt"
                :key="index"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="sort_flag" placeholder="排序方式" class="handle-select mr10">
                <el-option value="sign_time_desc" label="签到时间倒序"></el-option>
                <el-option value="continue_day_desc" label="签到天数倒序"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <el-table v-loading="false"
                  element-loading-text="拼命加载中"
                  :data="tableTemp" border class="table"
                  ref="multipleTable"
                  >
            <el-table-column prop="user_id" label="用户ID" align="center"/>
            <el-table-column prop="logo_url" label="头像" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.user_img" alt="" width="40" height="40">
                </template>
            </el-table-column>
            <el-table-column prop="nicked_name" label="昵称" align="center">
                <template slot-scope="scope" v-if="scope.row.nicked_name">
                    <el-tag>
                        {{scope.row.nicked_name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="member_title" label="用户类型" align="center"/>
            <el-table-column prop="create_time_text" label="签到时间" align="center">
                <template slot-scope="scope" v-if="scope.row.create_time_text">
                    <i class="el-icon-time" />&nbsp;
                    {{scope.row.create_time_text}}
                </template>
            </el-table-column>
            <el-table-column prop="continue_day" label="连续签到天数(天)" align="center"/>
            <el-table-column prop="score" label="当日得分" align="center"/>
            <el-table-column prop="continue_score" label="累积积分" align="center"/>
            <el-table-column prop="available_score" label="可用积分" align="center"/>
            <el-table-column prop="remarks" label="备注" align="center"/>
            <el-table-column label="操作" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">修改备注</el-button>
                    <!--<el-button type="text" icon="el-icon-edit" class="red" @click="deleteItem(scope.row)">删除</el-button>-->
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
    <el-dialog title="当前用户信息" :visible.sync="editVisible" width="40%" center  @close="cancel('modify_user')">
        <el-form ref="modify_user" :rules="rules" :model="modify_user" label-width="100px">
            <el-form-item label="备注:" prop="remarks">
                <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="modify_user.remarks">
                </el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button  @click="cancel('modify_user')">取 消</el-button>
            <el-button type="primary" @click="saveEdit('modify_user')">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
import {
    signList,
    userDelete,
    updateUser,
    signUpdate
} from '@/api/system/user/user'
import dayList from '@/utils/day.js'
export default {
    name: 'signManage',
    data() {
        return {
            loading: false,
            dataListt:dayList,
            tableData: [],
            cur_page: 1,
            page_size: 30,
            nicked_name: '',
            continue_day:'',
            sort_flag:'',
            lock_name: '',
            del_list: [],
            editVisible: false,
            lock_flag: false,
            select_state:'',
            modify_user: {
                remarks:'',
            },
            total:null,
            rules :{
                remarks:[
                    { required: true, message: '请输入备注', trigger: 'blur' },
                ]
            }
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
            this.initData(this.nicked_name,this.continue_day,this.sort_flag)
        },
        //        放开自定义条数
        handleSizeChange(val) {
            this.page_size = val
            this.initData(this.nicked_name,this.continue_day,this.sort_flag)
        },
        search() {
            this.cur_page = 1
            this.initData(this.nicked_name,this.continue_day,this.sort_flag)
        },
        //        取消
        cancel (formName){
            this.$refs[formName].resetFields()
            this.editVisible = false
        },
        // 渲染列表
        initData(nicked_name,continue_day,sort_flag) {
            this.loading = true
            let sendObj = {
                cur_page: this.cur_page,
                page_size: this.page_size,
                nicked_name: this.nicked_name?this.nicked_name:"",
                continue_day: this.continue_day ? this.continue_day : '',
                sort_flag: this.sort_flag  ? this.sort_flag  : ''
            }
            signList(sendObj).then(res => {
                if(res.errno == 0){
                    this.loading = false
                    this.tableData = res.data.sign_list
                    this.total = res.data.total-0
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
            this.editVisible = true
        },
        // 修改用户信息 - 保存按钮
        saveEdit(formName) {
            let sendObj = {
                sign_id: this.modify_user.sign_id,
                remarks: this.modify_user.remarks,
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    signUpdate(sendObj).then(res => {
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
                }
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
