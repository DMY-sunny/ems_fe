<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="icon iconfont el-iconquanxianguanli"></i> 角色管理</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="请输入管理员账号或名称" class="handle-input mr10"/>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="createUser()">创建角色</el-button>
        </div>
        <el-table :data="tableData" border
                  class="table"
                  ref="multipleTable">
            <el-table-column prop="name" label="角色" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" >{{scope.row.name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" align="center"/>
            <el-table-column label="操作" align="center" fixed="right" width="250">
                <template slot-scope="scope" v-if="scope.row.name!='渠道'">
                    <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row.id)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)">删除
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
                    :page-size='10'
                    :total="total">
            </el-pagination>
        </div>
    </div>

    <!-- 创建角色弹出框 -->
    <el-dialog title="角色信息" :visible.sync="createUserVisible" width="80%" center @close="cancel('create_user')">
        <el-form ref="create_user" :rules="rules" :model="create_user" label-width="110px">
            <el-form-item label="角色名:" prop="name">
                <el-input v-model="create_user.name"></el-input>
            </el-form-item>
            <el-form-item label="角色描述:" prop="description">
                <el-input v-model="create_user.description"></el-input>
            </el-form-item>
            <el-form-item label="新操作权限:" prop="role_access_id">
                <div style="max-height: 500px;overflow-y:scroll">
                    <el-tree
                            :data="rolelist"
                            show-checkbox
                            node-key="id"
                            ref="tree"
                            default-expand-all
                            :props="defaultProps">
                    </el-tree>
                </div>
            </el-form-item>
            <el-form-item label="旧操作权限:" prop="role_checklist">
                <div>
                    <el-checkbox-group v-model="role_checklist">
                        <el-checkbox v-for="item in oldrolelist" :key="item.id" :label="item.id">
                            {{item.description}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </el-form-item>
            <el-form-item label="显示权限:" prop="tags_checklist">
                <el-checkbox-group v-model="tags_checklist">
                    <el-checkbox v-for="(item ,index) in tagslist" :key="index" :label="item.id">
                        {{item.description}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-alert
                    title="完成保存操作之后请退出重登录"
                    type="error"
                    :closable="false"
                    center>
            </el-alert>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel('create_user')">取 消</el-button>
            <el-button type="primary" @click="submitUser('create_user')">提 交</el-button>
        </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
        <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteRow">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import {
    roleList,
    getMenulist,
    roleCreate,
    roleDetail,
    roleDelete
} from '@/api/system/role/role'
export default {
    name: 'roleManage',
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'description',
                id: 'id'
            },
            tableData: [],
            cur_page: 1,
            page_size: 30,
            select_word: '',
            delVisible: false,
            createUserVisible: false,
            rolelist: [],
            oldrolelist: [],
            tagslist: [],
            role_checklist: [],
            tags_checklist: [],
            create_user: {
                name: '',
                description: '',
            },
            total: null,
            rules: {
                name: [
                    {required: true, message: '请输入角色名', trigger: 'blur'},
                ],
                description: [
                    {required: true, message: '请输入角色名描述', trigger: 'blur'},
                ],
            },
        }
    },
    created() {
        this.initData()
    },
    computed: {},
    methods: {
        // 分页导航
        handleCurrentChange(val) {
            this.cur_page = val
            this.initData()
        },
        //        放开自定义条数
        handleSizeChange(val) {
            this.page_size = val
            this.initData()
        },
        //搜索
        search() {
            this.cur_page = 1
            this.initData()
        },
        // 渲染列表
        initData() {
            let search = {
                cur_page: this.cur_page,
                page_size: this.page_size,
                key_word: this.select_word?this.select_word:''
            }
            roleList(search).then(res => {
                if (res.errno == 0) {
                    this.tableData = res.data.list
                    this.total = res.data.total - 0
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
        // 创建用户
        async createUser() {
            let that = this
            await that.getRolelist()
            that.create_user = {}
            that.role_checklist = []
            that.tags_checklist = []
            that.createUserVisible = true
            that.$nextTick(() => {
                that.$refs.tree.setCheckedKeys([])
            })
        },
//        取消
        cancel(formName) {
            this.$refs[formName].resetFields()
            this.createUserVisible = false
            this.initData()
        },
        // 点击创建角色 - 获取权限列表
        getRolelist() {
            this.role_checklist = []
            let sendObj = {
                page: this.cur_page,
                page_size: 1000
            }
            getMenulist(sendObj).then(res => {
                if (res.errno == 0) {
                    this.rolelist = res.data.ops_new
                    this.oldrolelist = res.data.ops_old
                    this.tagslist = res.data.tags
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
        //创建角色
        submitUser(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.create_user.access_ids = this.$refs.tree.getCheckedKeys()
                            let arrparent = this.$refs.tree.getHalfCheckedKeys()
                            let arr = [...this.role_checklist, ...this.create_user.access_ids,...arrparent]
                            this.create_user.audit_ops = arr
                            if (arr <= 0) {
                                this.$message.error('请您勾选操作权限')
                                return
                            }
                            this.create_user.audit_tags = this.tags_checklist
                            if (this.create_user.id) {
                                this.create_user.op = '1'
                                this.submitData('create_user', this.create_user, '角色修改成功')
                            } else {
                                this.create_user.op = '0'
                                this.submitData('create_user', this.create_user, '角色创建成功')
                            }
                        }
                    })
                } else {
                    this.loading = false
                }
            })
        },
        //提交表单数据
        submitData(formName, sendObj, msg) {
            roleCreate(sendObj).then(res => {
                if (res.errno == 0) {
                    this.$message.success(msg)
                    this.initData()
                    this.$refs[formName].resetFields()
                    this.createUserVisible = false
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
        // 修改用户信息 - 修改按钮
        async handleEdit(id) {
            let that = this
            this.role_checklist = [], that.tags_checklist = []
            await this.getRolelist()
            this.create_user.id = id
            roleDetail(id).then(res => {
                if (res.errno == 0) {
                    this.create_user = res.data.audit_info
                    that.role_checklist = res.data.ops_old
                    that.tags_checklist = res.data.tags_ops
                    that.$nextTick(() => {
                        that.$refs.tree.setCheckedKeys(res.data.ops_new)
                    })
                    that.createUserVisible = true
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
        handleDelete(id) {
            this.audit_id = id
            this.delVisible = true
        },
        // 删除
        deleteRow() {
            let sendObj = {audit_id: this.audit_id}
            roleDelete(sendObj).then(res => {
                if (res.errno == 0) {
                    this.$message.success('删除成功')
                    this.initData()
                    this.delVisible = false
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        }
    }
}

</script>

<style scoped>
.handle-box {
    float: left;
    margin-bottom: 20px;
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

.mr10 {
    margin-right: 10px;
}
</style>
