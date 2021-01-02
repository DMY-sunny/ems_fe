<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-time"></i> 满减活动列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-button type="primary" @click="handleCreate" icon="el-icon-plus">新建满减活动</el-button>
                </el-form-item>
            </el-form>
            <div>
                <el-table :data="tableData" border v-loading="loading" element-loading-text="拼命加载中" ref="multipleTable">
                    <el-table-column prop="fullcut_id" label="满减活动ID" align="center" width="130" />
                    <el-table-column prop="title" label="标题" align="center" />
                    <el-table-column prop="logo_url" label="图片logo" align="center" width="320">
                        <template slot-scope="scope">
                            <img :src="cdn06+scope.row.logo_url" alt="" width="280" height="50">
                        </template>
                    </el-table-column>

                    <el-table-column prop="sale_count" label="销售数量" align="center" />
                    <el-table-column prop="sale_total" label="销售总额" align="center" />
                    <el-table-column prop="end_time_text" label="开始/结束时间" align="center" width="150">
                        <template slot-scope="scope">
                            <div>{{scope.row.start_time_text}}</div>
                            <div>{{scope.row.end_time_text}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center" width="100" />
                    <el-table-column label="操作" align="center" width="120">
                        <template slot-scope="scope">
                            <div style="margin-bottom: 10px">
                                <a href="javascript:void(0)" class="aintimport"><i class="el-icon-download"></i><input v-if="clearShow" class="intimport" icon="el-icon-download" type="file" @change="handleImport(scope.row.act_id)">导入</a>
                                <el-button type="primary" size="mini" icon="el-icon-upload2" @click="handlegoodsexport(scope.row.act_id)">导出</el-button>
                            </div>
                            <div class="mb">
                                <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
                            </div>
                            <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <pagination v-show="total>0" :total="total" :page.sync="cur_page" :pagesize.sync="page_size" @pagination="initData" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    fullcutList,
    fullcutDetele,
} from '@/api/activity/activity'
import Pagination from "@/components/Pagination"

export default {
    name: 'fullreductionList',
    components: { Pagination },
    data() {
        return {
            loading: false,
            tableData: [],
            cur_page: 1,
            page_size: 30,
            total: 0,
        }
    },
    created() {
        this.initData()
    },
    methods: {
        initData() {
            this.loading = true
            let params = {
                cur_page: this.cur_page,
                page_size: this.page_size,
            }
            fullcutList(params).then(res => {
                if (res.errno == 0) {
                    this.tableData = res.data.list
                    this.total = Number(res.data.total)
                } else {
                    this.$message.error(res.errmsg)
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
            })
        },
        //    操作按钮
        //    新建
        handleCreate() {
            this.$store.commit('SET_FULLCUT_ID', '1')
            this.$router.push({
                path: '/fullreductioncreate'
            })
        },
        //    修改
        handleEdit(row) {
            this.$store.commit('SET_FULLCUT_ID', row.fullcut_id)
            this.$router.push({
                path: '/fullreductioncreate'
            })
        },
        //    删除
        handleDelete(row) {
            this.$confirm('此操作将永久删除该满减活动, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let sendObj = {
                    fullcut_id: row.fullcut_id,
                }
                fullcutDetele(sendObj).then(res => {
                    if (res.errno == 0) {
                        this.$message.success('您已删除成功')
                        this.initData()
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {

                })
            }).catch(() => {

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
