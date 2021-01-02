<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="icon iconfont el-iconquanxianguanli"></i> 管理员管理</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="请输入账号或姓名" class="handle-input mr10"
                      @input="searchChange"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="createUser">创建管理员</el-button>

        </div>

        <div class="create_account">
        </div>

        <el-table v-loading="false"
                  element-loading-text="拼命加载中"
                  :data="tableTemp" border class="table" ref="multipleTable">
            <el-table-column prop="audit_name" label="ID" align="center"/>
            <el-table-column prop="name" label="姓名" align="center">
                <template slot-scope="scope" v-if="scope.row.name">
                    <el-tag type="success">
                        {{scope.row.name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="cur_login_time" label="上次登录时间" align="center">
                <template slot-scope="scope" v-if="scope.row.cur_login_time">
                    <i class="el-icon-time" />&nbsp;
                    {{scope.row.cur_login_time}}
                </template>
            </el-table-column>
            <el-table-column prop="cur_login_ip" label="当前登录IP" align="center"/>
            <el-table-column prop="role_name" label="角色" align="center"/>
            <el-table-column prop="user_status" label="状态" align="center"/>
            <el-table-column label="操作" align="center" fixed="right" width="200">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
                    <el-button type="danger" :icon="scope.row.icon"
                               @click="handleLock(scope.row.audit_id, scope.row.lock)">{{scope.row.lock}}
                    </el-button>
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
    <el-dialog title="当前用户信息" :visible.sync="editVisible" width="40%" center  @close="cancel('form')">
        <el-form ref="form" :rules="rules" :model="modify_user" label-width="100px">
            <el-form-item label="账户名:" prop="audit_name">
                <el-input v-model="modify_user.audit_name" readonly disabled></el-input>
            </el-form-item>
            <el-form-item label="姓名:" prop="name">
                <el-input v-model="modify_user.name" ></el-input>
            </el-form-item>
            <el-form-item label="上次登录时间:">
                <el-input v-html="modify_user.cur_login_time"></el-input>
            </el-form-item>
            <el-form-item label="上次登录地点:">
                <el-input v-html="modify_user.cur_login_ip"></el-input>
            </el-form-item>
            <el-form-item label="新密码:">
                <el-input v-model="modify_user.audit_token1"
                          placeholder="输入新密码，密码由字母、数字、下划线组成,长度在8-20之间"></el-input>
            </el-form-item>
            <el-form-item label="确认密码:">
                <el-input v-model="modify_user.audit_token2" placeholder="再次输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="角色:" prop="user_role">
                <el-select v-model="modify_user.user_role" placeholder="请选择">
                    <el-option v-for="item in rolelist" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel('form')">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 创建用户弹出框 -->
    <el-dialog title="新增用户" :visible.sync="createUserVisible" width="40%" centerr>
        <el-form ref="form"  :rules="rules" :model="create_user" label-width="100px">
            <el-form-item label="账户名:" prop="audit_name">
                <el-input v-model="create_user.audit_name"></el-input>
            </el-form-item>
            <el-form-item label="姓名:" prop="name">
                <el-input v-model="create_user.name"></el-input>
            </el-form-item>
            <el-form-item label="新密码:" prop="audit_token1">
                <el-input v-model="create_user.audit_token1"
                          placeholder="输入新密码，密码由字母、数字、下划线组成,长度在8-20之间"></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="audit_token2">
                <el-input v-model="create_user.audit_token2" placeholder="再次输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="角色:" prop="role_name">
                <el-select v-model="create_user.role_name" placeholder="请选择">
                    <el-option v-for="item in rolelist" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="createUserVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitUser">提 交</el-button>
        </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="lock_flag" width="300px" center>
        <div class="del-dialog-cnt">您确定要{{lock_text}}吗？</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="lock_flag = false">取 消</el-button>
            <el-button type="primary" @click="LockRun">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
import {
    adminList ,
    getUserDetail ,
    roleList,
    isFreeze,
    addUser,
    adminupdateUser,/**/
} from '@/api/system/user/user'
export default {
    name: 'userManage',
    data() {
        return {
            loading: false,
            tableData: [],
            cur_page: 1,
            page_size: 30,
            multipleSelection: [],
            select_word: '',
            new_pwd: '',
            lock_text: '',
            lock_name: '',
            confirm_pwd: '',
            del_list: [],
            editVisible: false,
            lock_flag: false,
            createUserVisible: false,
            form: {
                date: '',
                address: ''
            },
            modify_user: {},
            create_user: {},
            idx: -1,
            role_value: '',
            rolelist: [],
            total:null,
            rules :{
                audit_name:[
                    { required: true, message: '请输入账户名', trigger: 'blur' },
                ],
                name:[
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                audit_token1:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                audit_token2:[
                    { required: true, message: '请输入确认密码', trigger: 'blur' },
                ],
                role_name:[
                    { required: true, message: '请选择角色', trigger: 'blur' },
                ],
                user_role:[
                    { required: true, message: '请选择角色', trigger: 'blur' },
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
            adminList(sendObj).then(res => {
                if(res.errno == 0){
                    this.loading = false
                    this.tableData = res.data.list
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
            this.getRolelist()
            this.modify_user = row
            let id = row.audit_name
            /*getUserDetail(id).then(res => {
                if (res.errno == 0) {
                    this.modify_user = res.data
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })*/
            this.editVisible = true;
        },
        //        取消
        cancel (formName){
            this.$refs[formName].resetFields()
            this.editVisible = false
            this.initData()
        },
        // 修改用户信息 - 保存按钮
        saveEdit() {
            if (!this.modify_user.audit_name) {
                this.$message.error('账户名不能为空')
                return;
            }
            if (!this.modify_user.name) {
                this.$message.error('姓名不能为空')
                return;
            }
            if (!this.modify_user.role_name) {
                this.$message.error('角色不能为空')
                return;
            }
            if (this.modify_user.audit_token1 == this.modify_user.audit_token2) {
                let reg = /^[a-zA-Z0-9_]{8,20}$/;
                // if (new RegExp(reg).test(this.modify_user.audit_token1) == true) {
                    let sendObj ={
                        audit_aname: this.modify_user.audit_name,
                        audit_name: this.modify_user.name,
                        audit_token: this.modify_user.audit_token1 || '',
                        audit_role: this.modify_user.user_role,
                        audit_token_again:this.modify_user.audit_token2?this.modify_user.audit_token2:""
                    }
                    adminupdateUser(sendObj).then(res => {
                        if(res.errno ==0 ){
                            this.$message.success('恭喜你，修改成功！')
                            this.initData()
                            this.editVisible = false
                        }else{
                            this.$message.error(res.errmsg)
                        }
                    }).catch(err => {

                    })
                // } else {
                //     this.$message.error('密码由字母、数字、下划线组成,长度在8-20之间');
                // }
            } else {
                this.$message.error('密码输入不一致，请重新确认');
            }
        },
        // 点击锁定或解锁按钮
        handleLock(audit_id, lock) {
            this.lock_flag = true
            this.lock_text = lock
            this.lock_name = audit_id
        },
        // 确定锁定或解锁
        LockRun() {
            let type = this.lock_text == '锁定' ? 1 : 0
            let sendObj = {
                audit_id: this.lock_name,
                lock: type
            }
            isFreeze(sendObj).then(res => {
                if (res.errno == 0) {
                    this.$message.success(`${this.lock_text}成功`)
                    this.initData()
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
            this.lock_flag = false
        },
        // 获取角色列表
        getRolelist() {
            let search = {
                cur_page: 1,
                page_size:1000,
                keyword: ''
            }
            roleList(search).then(res => {
                if (res.errno == 0) {
                    this.rolelist = res.data.role
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
        // 创建用户
        createUser() {
            this.createUserVisible = true
            this.getRolelist()
            this.create_user = {}
        },
        submitUser() {
            if (!this.create_user.audit_name) {
                this.$message.error('账户名不能为空')
                return;
            }
            if (!this.create_user.name) {
                this.$message.error('姓名不能为空')
                return;
            }
            if (!this.create_user.audit_token1) {
                this.$message.error('密码不能为空')
                return;
            }
            if (!this.create_user.audit_token2) {
                this.$message.error('确认密码不能为空')
                return;
            }
            if (!this.create_user.role_name) {
                this.$message.error('角色不能为空')
                return;
            }
            if (this.create_user.audit_token1 == this.create_user.audit_token2) {
                let reg = /^[a-zA-Z0-9_]{8,20}$/;
                // if (new RegExp(reg).test(this.create_user.audit_token1) == true) {
                    let sendObj ={
                        audit_aname: this.create_user.audit_name,
                        audit_name: this.create_user.name,
                        audit_token: this.create_user.audit_token2,
                        audit_role: this.create_user.role_name,
                        audit_token_again:this.create_user.audit_token2?this.create_user.audit_token2:""
                    }
                    addUser(sendObj).then(res => {
                        if(res.errno ==0 ){
                            this.$message.success('恭喜你,创建成功！')
                            this.initData()
                            this.createUserVisible = false
                        }else{
                            this.$message.error(res.errmsg)
                        }
                    }).catch(err => {

                    })
                // } else {
                //     this.$message.error('密码由字母、数字、下划线组成,长度在8-20之间');
                // }
            } else {
                this.$message.error('密码输入不一致，请重新确认');
            }
        }
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

.handle-select {
    width: 120px;
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
