<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="icon iconfont el-icon-s-custom"></i> 权限管理</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container" style="border:none">
        <div class="handle-box">
            <!-- <el-input v-model="key_words" placeholder="请输入关键词" class="handle-input mr10"/> -->
        </div>
        <!-- <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button> -->
        <el-button type="primary" icon="el-icon-plus" @click="createPower">创建新权限</el-button>
        <el-table v-loading="false"
                :data="tableTemp"
                element-loading-text="拼命加载中"
                border class="table" ref="multipleTable">
            <el-table-column prop="permission_id" label="权限ID" align="center">
                <template slot-scope="scope">
                    <el-tag effect="dark" type='info'>{{scope.row.permission_id}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="project" label="所属项目" align="center">
                <template slot-scope="scope">
                    <el-tag type='success'>{{scope.row.project}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="method" label="api路由" align="center">
                <template slot-scope="scope">
                    <el-tag>{{scope.row.method}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="desc" label="权限描述" align="center">
                <template slot-scope="scope">
                    <el-tag effect="dark" type="warning">
                        {{scope.row.desc}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="250">
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" @click="handleDelete(scope.row.permission_id)">删除</el-button>
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
                    :page-size='30'
                    :total="total">
            </el-pagination>
        </div>
    </div>
    <!-- 创建权限弹出框 -->
    <el-dialog title="新增权限" :visible.sync="createPowerVisible" width="40%" center>
        <el-form ref="form" :model="create_power" label-width="100px">
            <el-form-item label="所属项目:">
                <el-select v-model="create_power.project">
                    <el-option :label="item" :value="item" v-for="(item,index) in parentList" :key="index">
                        {{item}}
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="权限描述:">
                <el-input v-model="create_power.desc"/>
            </el-form-item>
            <el-form-item label="显示路径:">
                <el-input v-model="create_power.route"/>
            </el-form-item>
            <el-form-item label="请求方式:">
                <el-select v-model="create_power.method">
                    <el-option label="全部" value="any" key="1">
                    </el-option>
                    <el-option label="GET" value="get" key="2">
                    </el-option>
                    <el-option label="POST" value="post" key="3">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUser" :disabled="isDisable">提 交</el-button>
        <el-button @click="createPowerVisible = false">取 消</el-button>
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
import {
    Psave,
    Pdelete,
    Plist,
    Pprojects
} from '@/api/system/permission/permission'

export default {
    name: 'permissionlist',
    data() {
        return {
            loading: false,
            tableData: [],
            cur_page: 1,
            page_size: 30,
            key_words: '',
            editVisible: false,
            createPowerVisible: false,
            delVisible:false,//删除提示
            isDisable:false,//按钮是否可用
            create_power: {
                // type:0,
                // menu_type:0
            },
            edit_power: {},
            total: null,
            parentList: []
        }
    },
    created() {
        this.initData()
    },
    computed: {
        tableTemp() {
            if (this.tableData) {
                return this.tableData.filter((d) => {
                    if (Number(d.type) != 0) {
                        d.type_text = '有效'
                        d.is_type = 'success'
                    } else {
                        d.type_text = '无效'
                        d.is_type = 'danger'
                    }
                    return d;
                })
            }
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
        search() {
            this.cur_page = 1
            this.initData()
        },
        // 获取 easy-mock 的模拟数据
        initData() {
            this.loading = true
            Plist(this.cur_page,this.page_size).then(res => {
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
        // 权限修改 - 唤起弹版
        handleEdit(row) {
            this.create_power = row
            this.createPowerVisible = true
        },
        // 创建权限 - 唤起弹版
        createPower() {
            Pprojects().then(res => {
                if (res.errno == 0) {
                    this.parentList = res.data
                    this.create_power = {
                        permission_id: '',
                    }
                    this.createPowerVisible = true
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
        // 创建权限 - 提交按钮
        submitUser() {
            this.isDisable = true;
            setTimeout(()=>{
                this.isDisable = false;
            },2000);
            if (!this.create_power.project) {
                this.$message.error('请选择所属项目')
                return
            }
            if (!this.create_power.desc) {
                this.$message.error('权限描述不能为空')
                return
            }
            Psave(this.create_power).then(res => {
                if (res.errno == 0) {
                    this.$message.success('创建成功')
                    this.initData()
                    this.createPowerVisible = false;

                } else {

                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
        //点击删除
        handleDelete(id) {
            this.create_power.permission_id = id
            this.delVisible = true
        },
        //删除
        deleteRow() {
            let sendObj = {permission_id: this.create_power.permission_id}
            Pdelete(sendObj).then(res => {
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

.create_account {
    float: left;
    margin-left: 40px;
}

.handle-input {
    width: 300px;
    display: inline-block;
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
