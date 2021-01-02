<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-lx-peoplefill"></i> 机器人列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <el-table v-loading="false"
                  element-loading-text="拼命加载中"
                  :data="tableTemp" border class="table"
                  ref="multipleTable"
                  >
            <el-table-column prop="user_id" label="用户ID" align="center"/>
            <el-table-column prop="nicked_name" label="用户昵称" align="center">
                <template slot-scope="scope" v-if="scope.row.nicked_name">
                    <el-tag>
                        {{scope.row.nicked_name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="logo_url" label="用户头像" :span="1" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.user_img" alt="" width="50" height="50">
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="200">
                <!--<template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
                    <el-button type="text" icon="el-icon-edit" class="red" @click="deleteItem(scope.row)">删除</el-button>
                </template>-->
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
</div>
</template>
<script>
import {
    robotList,
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
            modify_user: {
                is_vip:'0',
                qr_status:'0'
            },
            total:null,
            rules :{}
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
                // key_word: keyword ? keyword : ''
            }
            robotList(sendObj).then(res => {
                if(res.errno == 0){
                    this.loading = false
                    this.tableData = res.data.user_list
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
