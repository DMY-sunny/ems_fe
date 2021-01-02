<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="icon iconfont el-icon-user-solid"></i> 角色管理</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <el-button v-show="!tableData.length" type="primary" icon="el-icon-plus" @click="createUser('root')">创建新权限</el-button>
        <el-table :data="tableData"
                border
                v-loading="loading"
                ref="multipleTable">
            <el-table-column prop="id" label="角色ID" align="center">
                <template slot-scope="scope">
                    <el-tag effect="dark" type="info" >{{scope.row.id}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="角色名称" align="left">
                <template slot-scope="scope">
                    <!-- <el-tooltip class="item" effect="dark" content="角色等级" placement="top">
                    <el-tag type="warning" effect="dark">{{scope.row.level}}级</el-tag>
                    </el-tooltip> -->
                    <el-tag type="success" v-for="(item,ins) in scope.row.level" :key="ins">|-</el-tag>
                    <el-tag type="success">{{scope.row.name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="desc" label="角色描述" align="center">
                <template slot-scope="scope">
                    <el-tag type="">{{scope.row.desc}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="430">
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-plus" @click="createUser(scope.row.id)">创建</el-button>
                    <el-button type="" plain icon="el-icon-view" @click="lookUser(scope.row.id)">用户</el-button>
                    <el-button type="warning" plain icon="el-icon-s-custom" @click="handlePermis(scope.row.id)">权限</el-button>
                    <el-button type="success" plain icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" @click="handleDelete(scope.row.id)">删除</el-button>
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
            <el-form-item v-show="create_user.role_id" label="角色ID:" prop="role_id">
                <el-input prefix-icon="el-icon-star-on" v-model="create_user.role_id" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="角色名称:" prop="name">
                <el-input placeholder="只能添加英文与数字" prefix-icon="el-icon-edit" v-model="create_user.name" maxlength="32" show-word-limit></el-input>
            </el-form-item>
            <el-form-item v-if="createvsupdate == 1 && create_user.role_id " label="角色类型">
                <el-select v-model="create_user.type">
                    <el-option
                        :value="item.value"
                        :label="item.name"
                        v-for="(item,index) in roleTypeList"
                        :key="'event_type-'+index"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色描述:" prop="desc">
                <el-input prefix-icon="el-icon-edit" v-model="create_user.desc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitUser('create_user')" :loading="loading">提 交</el-button>
            <el-button @click="cancel('create_user')">取 消</el-button>
        </span>
    </el-dialog>
    <!-- 角色用户列表 -->
    <el-dialog title="当前角色下的用户" :visible.sync="roleUserVisible" width="80%" center @close="cancel('create_user')">
        <el-table :data="UserData"
                border
                v-loading="loading"
                ref="multipleTable">
            <el-table-column prop="user_id" label="用户ID" align="center">
                <template slot-scope="scope">
                    <el-tag type="info" >{{scope.row.user_id}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="user_name" label="用户名称" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" >{{scope.row.user_name}}</el-tag>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel('create_user')">取 消</el-button>
        </span>
    </el-dialog>
    <!-- 角色权限列表 -->
    <el-dialog title="当前角色下的权限" :visible.sync="rolePermisVisible" width="80%" center @close="cancel('create_user')">
        <el-table :data="PermisData"
                v-if="PermisData.length>0"
                border
                v-loading="loading"
                ref="multipleTable">
            <el-table-column prop="permission_id" label="权限ID" align="center">
                <template slot-scope="scope">
                    <el-tag effect="dark" type="info" >{{scope.row.permission_id}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="permission_desc" label="权限描述" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" >{{scope.row.permission_desc}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="project" label="所属项目" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" >{{scope.row.project}}</el-tag>
                </template>
                <el-select v-model="create_user.type">
                    <el-option
                        :value="item.value"
                        :label="item.name"
                        v-for="(item,index) in roleTypeList"
                        :key="'event_type-'+index"
                    ></el-option>
                </el-select>
            </el-table-column>
            <el-table-column prop="route" label="权限路由" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" >{{scope.row.route}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="method" label="请求方法" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" >{{scope.row.method}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="150">
                <template slot-scope="scope">
                    <el-button type="danger" plain icon="el-icon-delete" @click="Logoutpermission(scope.row.permission_id)">注销</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-alert
            title="给角色添加权限"
            type="warning"
            center
            effect="dark"
            show-icon>
        </el-alert>
        <el-form ref="create_user" :rules="rules" :model="create_user" label-width="110px">
            <el-form-item label="角色ID:" prop="role_id">
                <el-input prefix-icon="el-icon-star-on" v-model="create_user.role_id" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="选择权限">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="permischeckbox" @change="handleCheckedCitiesChange">
                    <el-checkbox
                        v-for="(item,index) in PermisDataList"
                        :label="item"
                        :key="index"
                    >{{item.desc}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitPermis('create_user')">提 交</el-button>
            <el-button @click="cancel('create_user')">取 消</el-button>
        </span>
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
const roleList = [
    {name:'子角色',value:'son'},
    {name:'兄弟角色',value:'brother'},
];
import {
    Clist,
    Ccreate,
    Cupdate,
    Cdelete,
    Cuserlist,
    Cpermissions,
    Cunbindpermission,
    Cbindpermission
} from '@/api/system/role/role';
import {Plist} from '@/api/system/permission/permission';
import { rootCertificates } from 'tls';
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
            cur_page: 1,
            page_size: 30,
            select_word: '',
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
            roleUserVisible:false,//角色用户表单
            rootShow:false,//角色id与类型
            rolePermisVisible:false,//角色权限表单
            checkAll:false,//全选按钮状态
            isIndeterminate:false,//全选按钮样式状态只负责样式
            permischeckbox:[],//选中的权限
            UserData: [],
            PermisData: [],
            PermisDataList: [],//还未拥有的权限
            create_user: {
                name: '',
                role_id:'',
                type:'son',
                desc:'',
            },
            total: null,
            rules: {
                name: [
                    {required: true, message: '请输入角色名', trigger: 'blur'},
                ],
                desc: [
                    {required: true, message: '请输入角色名描述', trigger: 'blur'},
                ],
            },
        }
    },
    inject:["reload"],
    created() {
        this.initData()
    },
    computed: {},
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
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
            this.loading = true
            Clist(this.cur_page, this.page_size).then(res => {
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
        // 创建用户
        async createUser(id) {
            this.createvsupdate = 1;
            this.create_user = {type:''};
            this.createUserVisible = true;
            if (id == 'root') return this.create_user.role_id = '';
            else return this.create_user.role_id = id;
        },
        //角色权限
        handlePermis(id){
            this.create_user.role_id = id;
            this.rolePermisVisible = true;
            Cpermissions(id,this.cur_page,1000).then(res=>{
                if(res.errno == 0){
                    this.PermisData = res.data.list;//当前角色下的权限
                    Plist(this.cur_page,1000).then(res => {
                        if (res.errno == 0) {//所有权限
                            // 去除已添加的重复数据  取两个数组的 差集!
                            this.PermisDataList=res.data.list.filter(itemF=>!this.PermisData.some(ele=>ele.permission_id===itemF.permission_id))
                            this.loading = false;
                        } else {
                            this.$message.error(res.errmsg);
                            this.loading = false;
                        }
                    }).catch(err => {
                        this.loading = false;
                    });
                }else{
                    this.$message.error(res.errmsg);
                }
            });
        },
        //查看用户
        lookUser(id){
            this.create_user.role_id = id;
            this.roleUserVisible = true;
            Cuserlist(id,this.cur_page,this.page_size).then(res=>{
                if(res.errno == 0){
                    this.UserData = res.data.list;
                }else{
                    this.$message.error(res.errmsg);
                }
            })
        },
        //取消
        cancel(create_user) {
            this.createUserVisible = false;
            this.roleUserVisible = false;
            this.rolePermisVisible = false;
            this.permischeckbox = [];
            this.create_user.permission_ids = '';
            // this.initData();
            //重置表单及验证
            // this.$nextTick(() => {
	        //     this.$refs.create_user.resetFields();
            // });
            // 在app.vue里定义刷新
            this.reload();
        },
        //提交数据
        submitUser(create_user) {
            this.loading = true;
            this.$refs[create_user].validate((valid) => {
                if (valid) {
                    this.$refs[create_user].validate((valid) => {
                        if (valid) {
                            if(this.createvsupdate == 1){
                                Ccreate(this.create_user).then(res=>{
                                    if(res.errno == 0){
                                        this.loading = false;
                                        this.$message.success('创建成功!');
                                        this.createUserVisible = false;
                                        this.create_user = { ...this.create_user};
                                    }else{
                                        this.loading = false;
                                        this.$message.error(res.errmsg);
                                    }
                                }).catch(err=>{})
                            }else{
                                Cupdate(this.create_user).then(res=>{
                                    if(res.errno == 0){
                                        this.loading = false;
                                        this.$message.success('修改成功!');
                                        this.createUserVisible = false;
                                        this.create_user = { ...this.create_user};
                                    }else{
                                        this.loading = false;
                                        this.$message.error(res.errmsg);
                                    }
                                }).catch(err=>{})
                            }
                        }
                    })
                } else {
                    this.loading = false
                }
            })
        },
        //提交表单数据
        submitData(create_user, sendObj, msg) {
            roleCreate(sendObj).then(res => {
                if (res.errno == 0) {
                    this.$message.success(msg)
                    this.initData()
                    this.createUserVisible = false
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {
            })
        },
        //提交角色权限
        async submitPermis(){
            this.roleChange();
            let sendObj = {
                role_id: this.create_user.role_id,
                permission_ids: this.create_user.permission_ids + '',
            };
            await Cbindpermission(sendObj).then(res => {
                if (res.errno == 0) {
                    this.rolePermisVisible = false;
                    this.$message.success('添加成功!');
                    this.initData();
                    this.permischeckbox = [];
                    this.create_user.permission_ids = '';
                } else {
                    this.create_user.permission_ids = '';
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {
            })
        },
        roleChange(){
            this.permischeckbox.forEach(item=>{
                if(!this.create_user.permission_ids){
                    return this.create_user.permission_ids = item.permission_id;
                }else{
                    return this.create_user.permission_ids += "," + item.permission_id;
                }
            })
        },
        // 修改用户信息 - 修改按钮
        async handleEdit(row) {
            this.create_user.role_id = row.id;
            this.create_user.name = row.name
            this.create_user.type = row.type
            this.create_user.desc = row.desc
            this.createvsupdate = 2;
            this.createUserVisible = true
        },
        handleDelete(id) {
            this.create_user.role_id = id
            this.delVisible = true
        },
        //全选
        handleCheckAllChange(val) {
            this.permischeckbox = val ? this.PermisDataList : [];
            this.isIndeterminate = false;
        },
        //单选改变全选状态
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.PermisDataList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.PermisDataList.length;
        },
        // 删除
        deleteRow() {
            let sendObj = {id: this.create_user.role_id}
            Cdelete(sendObj).then(res => {
                if (res.errno == 0) {
                    this.$message.success('删除成功')
                    this.initData()
                    this.delVisible = false
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
        // 注销
        Logoutpermission(id){
            this.$confirm("确认注销该权限?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(() => {
                let sendObj = {
                    role_id: this.create_user.role_id,
                    permission_ids: id + "",
                };
                Cunbindpermission(sendObj).then(res => {
                    if (res.errno == 0) {
                        this.rolePermisVisible = false;
                        this.$message.success('注销成功!');
                        this.initData();
                        this.permischeckbox = [];
                        this.create_user.permission_ids = '';
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {
                })
            })
            .catch(() => {});
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
    font-size: 12px;
}

.mr10 {
    margin-right: 10px;
}
</style>
