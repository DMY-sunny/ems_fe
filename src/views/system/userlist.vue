<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="icon iconfont el-icon-user"></i> 用户管理</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <div class="handle-box">
            <el-input v-model="key_words" @keyup.enter.native="search" placeholder="请输入关键词" class="handle-input mr10"/>
        </div>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-table :data="tableData"
                border
                v-loading="loading"
                ref="multipleTable">
            <el-table-column prop="login_id" label="用户ID" align="center">
                <template slot-scope="scope">
                    <el-tag effect="dark" type="info" >{{scope.row.login_id}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="login_name" label="用户名称" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" >{{scope.row.login_name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="中文名" align="center">
                <template slot-scope="scope">
                    <el-tag type="" >{{scope.row.name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="250">
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" @click="Addrole(scope.row)">角色</el-button>
                    <el-button type="" plain icon="el-icon-plus" @click="temporarypermis(scope.row.login_id)">临时权限</el-button>
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
    <!-- 给用户添加角色弹出框 -->
    <el-dialog title="角色信息" :visible.sync="createUserVisible" width="80%" center @close="cancel('create_user')">
        <el-table :data="tableData_roles"
                v-if="tableData_roles.length>0"
                border
                v-loading="loading"
                ref="multipleTable">
            <el-table-column prop="role_id" label="所属角色ID" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="当前角色ID" placement="top">
                        <el-button style="margin: 1px;" type="danger" plain >{{scope.row.role_id}}</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="所属角色标识" align="center">
                <template slot-scope="scope">
                    <el-tag style="margin: 1px;" type="success" effect="dark">{{scope.row.name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="所属角色描述" align="center">
                <template slot-scope="scope">
                    <el-tag style="margin: 1px;" type="warning" effect="dark">{{scope.row.desc}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="150">
                <template slot-scope="scope">
                    <el-button type="danger" plain icon="el-icon-delete"  @click="logoutrole(scope.row.role_id,scope.row.login_id)">注销</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-alert
            title="给用户添加角色"
            type="warning"
            center
            effect="dark"
            show-icon>
        </el-alert>
        <el-form ref="create_user" :rules="rules" :model="create_user" label-width="110px">
            <el-form-item label="用户ID:" prop="user_id">
                <el-input v-model="create_user.user_id" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="选择角色">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="rolecheckbox" @change="handleCheckedCitiesChange">
                    <el-checkbox
                        v-for="(item,index) in ClistData"
                        :label="item"
                        :key="index"
                    >{{item.desc}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitUserRole('create_user')">提 交</el-button>
            <el-button @click="cancel('create_user')">取 消</el-button>
        </span>
    </el-dialog>
    <!-- 给用户添加临时权限弹出框 -->
    <el-dialog title="权限信息" :visible.sync="temporaryVisible" width="80%" center @close="cancel('create_user')">
        <el-table :data="temporaryList"
                border
                v-if="temporaryList.length>0"
                v-loading="loading"
                ref="multipleTable">
            <el-table-column prop="permission_id" label="权限ID" align="center">
                <template slot-scope="scope">
                    <el-tag type="info" >{{scope.row.permission_id}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="project" label="所属项目" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" >{{scope.row.project}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="desc" label="权限描述" align="center">
                <template slot-scope="scope">
                    <el-tag type="" >{{scope.row.desc}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="expire_at" label="失效时间" align="center" :formatter="formatTime"> </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="120">
                <template slot-scope="scope">
                    <el-button type="success" plain icon="el-icon-edit" @click="handleEdit(scope.row)">修改时间</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-alert
            title="给用户添加临时权限"
            type="warning"
            center
            effect="dark"
            show-icon>
        </el-alert>
        <el-form ref="create_user" :model="create_user" label-width="110px" label-position="left">
            <el-form-item label="请选择权限">
                <el-select v-model="create_user.permission_id">
                    <el-option
                        :value="item.permission_id"
                        :label="item.desc"
                        v-for="(item,index) in permisList"
                        :key="'event_type-'+index"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="请选择到期时间">
                <el-date-picker
                v-model="create_user.expire_at"
                value-format="timestamp"
                type="datetime"
                placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitUserpermis('create_user')">提 交</el-button>
            <el-button @click="cancel('create_user')">取 消</el-button>
        </span>
        <el-dialog
            width="34%"
            title="修改到期时间"
            :visible.sync="innerVisible"
            append-to-body>
            当前修改的权限id:
            <el-tag type="success">
                {{create_user.permission_id}}
            </el-tag>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-date-picker
                v-model="create_user.expire_at"
                value-format="timestamp"
                type="datetime"
                placeholder="选择日期时间">
            </el-date-picker>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="submitUserpermis('create_user')">提 交</el-button>
        </el-dialog>
    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
        <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="deleteRow">确 定</el-button>
            <el-button @click="delVisible = false">取 消</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
const userData={
    user_id:'',
    role_ids:'',
    permission_id:'',
    expire_at:'',
};
const roleList = [
    {name:'子角色',value:'son'},
    {name:'兄弟角色',value:'brother'},
];
import {
    UserList,
    Ulogoutrole,
    Upermissions,
    Usetrole,
    Urevokerole,
    Usettemppermission,
} from '@/api/system/user/user'
import {
    Clist,
} from '@/api/system/role/role'
import { formatDate } from "@/utils/utils";
import {mapGetters} from 'vuex'
export default {
    name: 'roleManage',
    data() {
        return {
            loading:false,
            defaultProps: {
                children: 'children',
                label: 'description',
                id: 'id'
            },
            tableData: [],
            tableData_roles: [],
            cur_page: 1,
            page_size: 30,
            key_words: '',//条件
            delVisible: false,
            createUserVisible: false,
            rolelist: [],
            filterText:'',
            oldrolelist: [],
            tagslist: [],
            role_checklist: [],
            tags_checklist: [],
        
            // 新增与应用
            createvsupdate:1,//1是创建2是更新
            roleTypeList: roleList,//角色类型
            roleUserVisible:false,
            ClistData:[],//用户还未拥有的角色(可勾选)
            permisList:[],//用户已经拥有的权限
            temporaryList:[],// 已拥有的临时权限
            rolecheckbox:[],//选中的角色
            temporaryVisible:false,//用户临时权限列表显示/隐藏
            checkAll:false,//全选按钮状态
            isIndeterminate:false,//全选按钮样式状态只负责样式
            innerVisible:false,//内层dialog
            create_user: { ...userData},
            total: null,
            rules: {
                user_id: [
                    {required: true, message: '请选择一个用户', trigger: 'blur'},
                ],
                role_ids: [
                    {type: 'array', required: true, message: '请至少选择一个角色', trigger: 'blur'},
                ],
            },
        }
    },
    created() {
        // this.initData();
    },
    computed: {
        ...mapGetters(['userId'])
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        //时间处理
        formatTime:function(row, column, cellValue){
            return formatDate(cellValue)
        },
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
            this.loading = true
            UserList(this.key_words, this.cur_page, this.page_size).then(res => {
                if (res.errno == 0) {
                    this.tableData = res.data.list
                    this.total = res.data.total - 0
                    this.loading = false
                } else {
                    this.$message.error(res.errmsg)
                    this.loading = false
                }
            }).catch(err => {
                this.loading = false
            })
        },
        // 给用户添加角色
        async Addrole(row) {
            this.tableData_roles = row.roles;
            this.create_user.user_id = row.login_id;
            this.createUserVisible = true;
            Clist(this.cur_page, this.page_size).then(res => {
            if (res.errno == 0) {
                //取数组的 差集 --- 用户还未拥有的角色
                this.ClistData = res.data.list.filter(item => !this.tableData_roles.some(ele => ele.role_id === item.id))
            } else {
                this.$message.error(res.errmsg)
            }
        }).catch(err => {
                this.loading = false
        });
        },
//        取消
        cancel(formName) {
            this.$refs[formName].resetFields()
            this.createUserVisible = false
            this.temporaryVisible = false
            this.create_user.role_ids = '',
            this.initData()
            this.createvsupdate = 1
        },
        //提交数据角色数据
        submitUserRole(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            if(this.createvsupdate == 1){
                                this.roleChange();
                                let sendObj = {
                                    role_ids: this.create_user.role_ids + '',
                                    user_id: this.create_user.user_id,
                                }
                                Usetrole(sendObj).then(res=>{
                                    if(res.errno == 0){
                                        this.$message.success('创建成功!')
                                        this.createUserVisible = false
                                        this.create_user.role_ids = '',
                                        this.rolecheckbox = []
                                    }else{
                                        this.rolecheckbox = []
                                        this.create_user.role_ids = '',
                                        this.$message.error(res.errmsg)
                                    }
                                }).catch(err=>{})
                            }else{
                            }
                        }
                    })
                } else {
                    this.loading = false
                }
            })
        },
        //添加临时权限
        temporarypermis(id){
            console.log(this.userId);
            this.temporaryVisible = true;
            this.create_user.user_id = id;
            Upermissions(this.userId).then(res => {
                if (res.errno == 0) {
                    this.permisList = res.data.role_based;
                } else {
                    this.$message.error(res.errmsg);
                }
            }).catch(err => {
                    this.loading = false;
            });
            Upermissions(id).then(res => {
                if (res.errno == 0) {
                    this.temporaryList = res.data.user_based;
                } else {
                    this.$message.error(res.errmsg);
                }
            }).catch(err => {
                    this.loading = false;
            });
        },
        //添加临时权限--提交
        submitUserpermis(){
            this.create_user.expire_at = this.create_user.expire_at / 1000;
            console.log(this.create_user)
            Usettemppermission(this.create_user).then(res=>{
                if(res.errno == 0){
                    this.$message.success('创建成功!');
                    this.innerVisible = false;
                    this.temporaryVisible = false;
                    this.create_user = { ...userData};
                    this.create_user.expire_at = this.create_user.expire_at * 1000
                }else{
                    this.$message.error(res.errmsg);
                    this.create_user.expire_at = this.create_user.expire_at * 1000

                }
            }).catch(err=>{})
        },
        //修改临时权限
        handleEdit(row){
            this.create_user.permission_id = row.permission_id;
            this.innerVisible = true;
        },
        roleChange(){
            this.rolecheckbox.forEach(item=>{
                if(!this.create_user.role_ids){
                    return this.create_user.role_ids = item.id
                }else{
                    return this.create_user.role_ids += "," + item.id 
                }
            })
        },
        checkboxChange(){
            this.rolecheckbox = this.create_user.role_ids.split(',');
        },
        //全选
        handleCheckAllChange(val) {
            this.rolecheckbox = val ? this.ClistData : [];
            this.isIndeterminate = false;
        },
        //单选改变全选状态
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.ClistData.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.ClistData.length;
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
        // 删除
        deleteRow() {
            let sendObj = {
                role_id: this.create_user.role_id,
                user_id: this.create_user.user_id
            }
            Urevokerole(sendObj).then(res=>{
                if(res.errno == 0){
                    this.$message.success('是删除角色成功!');
                    this.initData();
                    this.delVisible = false;
                    this.createUserVisible = false;
                }else{
                    this.$message.error(res.errmsg);
                }
            })
        },
        // 注销用户角色
        logoutrole(role_id){
            this.create_user.role_id = role_id
            this.delVisible = true
        },
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
    font-size: 12px;
}

.mr10 {
    margin-right: 10px;
}
.mr1px{
    margin: 1px;
}
</style>
