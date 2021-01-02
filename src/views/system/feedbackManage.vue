<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-lx-peoplefill"></i> 意见反馈</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="请输入用户ID或昵称" class="handle-input mr10"
                      @input="searchChange"/>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <el-table
              v-loading="false"
              element-loading-text="拼命加载中"
              :data="tableData" border class="table"
              ref="multipleTable"
              >
            <el-table-column prop="id" label="ID" align="center" width="80"/>
            <el-table-column prop="user_id" label="用户ID" align="center" width="150"/>
            <el-table-column prop="content" label="反馈内容" align="center" />
            <el-table-column prop="phone" label="联系方式" align="center" width="130"/>
            <el-table-column prop="create_time" label="提交时间" align="center" width="180">
                <template slot-scope="scope" v-if="scope.row.create_time">
                    <i class="el-icon-time" />&nbsp;
                    {{scope.row.create_time}}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="120">
                <template slot-scope="scope">
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
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="lock_flag" width="300px" center>
        <div class="del-dialog-cnt">您确定要删除该意见吗？</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="lock_flag = false">取 消</el-button>
            <el-button type="primary" @click="saveDelete">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
import {
    feedbackList,
    deleteFeedback
} from '@/api/system/user/user'
export default {
    name: 'feedbackManage',
    data() {
        return {
            loading: false,
            tableData: [],
            cur_page: 1,
            page_size: 30,
            lock_flag: false,
            multipleSelection: [],
            select_word: '',
            total:null,
        }
    },
    created() {
        this.initData()
    },
    computed: {},
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
                searchword: keyword ? keyword : ''
            }
            feedbackList(sendObj).then(res => {
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
    //    删除
        // 点击删除
        deleteItem(row) {
            this.lock_flag = true
            this.lock_name = row.id
        },
        saveDelete() {
            let sendObj = {id: this.lock_name}
            deleteFeedback(sendObj).then(res => {
                if (res.errno == 0) {
                    this.$message.success('删除意见成功')
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
