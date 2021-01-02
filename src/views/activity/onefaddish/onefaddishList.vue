<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-time"></i> 一元爆款列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <el-form class="demo-form-inline" inline @submit.native.prevent>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus"  @click="handleCreate">创建活动</el-button>
                </el-form-item>
            </el-form>
            <div>
                <el-table  border :data="tableData" v-loading="loading" element-loading-text="拼命加载中" ref="multipleTable">
                    <el-table-column prop="id" label="活动ID" align="center" width="130" />
                    <el-table-column prop="title" label="活动名称" align="center" width="130" />
                    <el-table-column prop="time" label="开始/结束时间" align="center" width="150">
                        <template slot-scope="scope">
                            <div>{{scope.row.start_time_text}}</div>
                            <div>{{scope.row.end_time_text}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="120">
                        <template slot-scope="scope">
                            <div class="mb">
                                <el-button type="primary" icon="el-icon-edit" plain @click="handleEdit(scope.row)">修改</el-button>
                            </div>
                            <el-button type="danger" icon="el-icon-delete" plain @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <pagination v-show="total>0" :total="total" :page.sync="cur_page" :pagesize.sync="page_size" @pagination="initData"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { specialList,specialUpdate } from '@/api/activity/onefaddish/onefaddish'
import Pagination from "@/components/Pagination"
export default {
    name: 'leaderboardList',
    components: { Pagination },
    data() {
        return {
            loading: false,
            tableData: [],
            cur_page: 1,
            page_size: 50,
            total: 0,
            clearShow: true,
        }
    },
    created() {
        this.initData();
    },
    methods: {
        //获取活动列表数据
        initData(int) {
            this.loading = true

            let sendObj = {
                keyword:'',
                order_by:'',
                status:'',
                page: this.cur_page,
                page_size: this.page_size,
                type:''
            }
            specialList(sendObj).then(res => {
                if (res.errno == 0) {
                    this.tableData = res.data.list
                    this.tableData.forEach(item => {
                        if(item.title.length>20){
                            item.title=item.title.substring(0,20)
                        }
                    })
                    this.total = Number(res.data.totalNum)
                } else {
                    this.$message.error(res.errmsg)
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
            })
        },
        //    新建
        handleCreate() {
            this.$store.commit('SET_ONEFADDISH_ID', 0)
            this.$store.commit('SET_ADD_ONEFADDISH', true)
            this.$router.push({
                path: '/onefaddishAdd',
            })
        },
         //    修改
        handleEdit(row) {
            this.$store.commit('SET_ONEFADDISH_ID', row.id)
            this.$store.commit('SET_ADD_ONEFADDISH', false)
            this.$router.push({
                path: '/onefaddishAdd',
            })
        },
        //     删除
        handleDelete(row) {
            if (row)
                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let sendObj = {
                        act_id: row.id,
                        status:2   
                    }
                    specialUpdate(sendObj).then(res => {
                        if (res.errno == 0) {
                            this.$message.success('您已删除成功')
                            this.initData()
                        } else {
                            this.$message.error(res.errmsg)
                        }
                    }).catch(err => {

                    })
                })
        },
    }
}
</script>

<style scoped>
    .mb {
        margin-bottom: 10px;
    }  
</style>