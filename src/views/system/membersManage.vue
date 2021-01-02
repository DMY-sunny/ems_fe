<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-lx-peoplefill"></i> 全部会员列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="请输入用户ID" class="handle-input mr10"
                      @input="searchChange"/>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <div class="create_account">
            <!--<el-button type="primary" @click="deleteItem" >批量删除</el-button>-->
        </div>
        <el-table v-loading="false"
                  element-loading-text="拼命加载中"
                  :data="tableData" border class="table"
                  ref="multipleTable"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" :span="1" align="center"/>
            <el-table-column prop="logo_url" label="头像" :span="1" align="center">
                <template slot-scope="scope">
                    <img v-if="scope.row.user_img" :src="scope.row.user_img" alt="用户头像" width="50" height="50">
                </template>
            </el-table-column>
            <el-table-column prop="nicked_name" label="昵称" align="center">
                <template slot-scope="scope" v-if="scope.row.nicked_name">
                    <el-tag>
                        {{scope.row.nicked_name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="channel_from" label="渠道" align="center"/>
            <el-table-column prop="pay_price" label="支付金额" align="center"/>
            <el-table-column prop="create_time_text" label="开通时间" align="center">
                <template slot-scope="scope" v-if="scope.row.create_time_text">
                    <i class="el-icon-time" />&nbsp;
                    {{scope.row.create_time_text}}
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
</div>
</template>
<script>
import {
    membersList,
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
            total:null,
            rules :{}
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
                key_word: keyword ? keyword : ''
            }
            membersList(sendObj).then(res => {
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
        //        多选
        handleSelectionChange(val) {
            this.multipleSelection = val
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
.table {
    width: 100%;
    font-size: 14px;
}
.mr10 {
    margin-right: 10px;
}
</style>
