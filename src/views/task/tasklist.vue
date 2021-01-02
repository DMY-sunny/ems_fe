<template>
    <div style="background:#fff;padding:20px;">
        <el-form class="demo-form-inline" inline @submit.native.prevent>
            <el-form-item label="任务有效期" prop="create_time">
                <el-date-picker v-model="keyword_data.start_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间">
                </el-date-picker>
                -
                <el-date-picker v-model="keyword_data.end_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="requestCreated">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addpopup">创建新任务</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border style="width: 100%;">
            <el-table-column prop="task_name" label="任务名称" align="center"></el-table-column>
            <el-table-column prop="task_type" label="任务事件" align="center">
                <template slot-scope="scope">
                    {{task_type[scope.row.task_type]}}
                </template>
            </el-table-column>
            <el-table-column prop="start_time" label="任务开始时间" align="center"></el-table-column>
            <el-table-column prop="end_time" label="任务结束时间" align="center"></el-table-column>
            <el-table-column prop="sort" label="排序" align="center"></el-table-column>
            <el-table-column prop="creator" label="创建人" align="center"></el-table-column>
            <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="task_name" label="状态" width="60px" align="center">
                <template slot-scope="scope">
                    {{scope.row.status == 1 ? '启用' : '停用'}}
                </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" width="220px" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" @click="modification(scope.row)" size='mini'>修改</el-button>
                    <el-button type="danger" @click="deleteObj(scope.row)" size='mini'>删除</el-button>
                    <el-button :type="scope.row.status == 1 ? 'info' : 'success'" size='mini' @click="changeStatus(scope.row)">{{scope.row.status == 1 ? '停用' : '启用'}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align:center">
            <el-pagination @current-change="handleCurrentChange" :page-size="20" :pager-count="11" layout="prev, pager, next" :total="count">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { taskList, taskDel, typeConfig, changeStatus } from '@/api/task.js'
export default {
    data() {
        return {
            tableData: [],
            image_host: "",
            count: 1,
            page: 1,
            keyword_data: {
                start_time: '',
                end_time: ''
            },
            task_type: []
        }
    },
    created() {
        this.requestCreated()
        typeConfig().then(res => {
            this.task_type = res.data
        })
    },
    methods: {
        requestCreated() {
            let that = this
            let params = {
                page: this.page,
                start_time: this.keyword_data.start_time,
                end_time: this.keyword_data.end_time,
            }
            taskList(params).then(res => {
                if (res.errno == 0) {
                    that.tableData = res.data.list
                    that.count = res.data.total
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res.errmsg
                    });
                }
            })
        },
        handleCurrentChange(val) {
            this.page = val
            this.requestCreated()
        },
        modification(data) {
            this.$router.push({
                path: "/addTask",
                query: {
                    id: data.id
                }
            })
        },
        addpopup() {
            this.$router.push({
                path: "/addTask"
            })
        },
        changeStatus(data) {
            changeStatus({ task_id: data.id }).then(res => [
                this.requestCreated()
            ])
        },
        deleteObj(data) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                taskDel({ task_id: data.id }).then(res => [
                    this.requestCreated()
                ])
            })

        }


    }
}
</script>