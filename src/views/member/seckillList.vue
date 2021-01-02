<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-time"></i> 会员权益秒杀列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true">
                    <el-form-item>
                        <el-input clearable v-model="act_id" @keyup.enter.native="init" placeholder="请输入专场ID"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="start_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" @change="init" placeholder="请选择活动开始时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="end_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" @change="init" placeholder="请选择活动结束时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" type="warning" @click="init">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-edit" @click="handleAdd('')">添加秒杀</el-button>
                    </el-form-item>
                    <el-form-item>
                        <a href="http://ems.dfs800.com/api/seckill/download" download="excel.xls" class="aintimport"><i class="el-icon-download"></i>模板下载</a>
                    </el-form-item>
                </el-form>
            </div>
            <el-table v-loading="loading" element-loading-text="拼命加载中" align="center" :data="tableData" border class="table" ref="multipleTable">
                <el-table-column prop="act_id" label="专场ID" align="center"></el-table-column>
                <el-table-column prop="title" label="专场名" align="center"></el-table-column>
                <el-table-column label="权益总数/已上架数" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.row.goods_total}}/{{scope.row.online_goods_total}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="creator" label="开始/结束时间" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.row.start_time}}<br>{{scope.row.end_time}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="status_name" label="状态" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="260" fixed="right">
                    <template slot-scope="scope">
                        <a v-if="scope.row.time_status == 0" href="javascript:void(0)" class="gray_btn"><i class="el-icon-folder-opened"></i><input v-if="clear_show" class="intimport" icon="el-icon-download">导入</a>
                        <a v-else href="javascript:void(0)" class="aintimport"><i class="el-icon-folder-opened"></i><input v-if="clear_show" class="intimport" icon="el-icon-download" type="file" @change="handleImport(scope.row.id)">导入</a>
                        <el-button type="primary" size="mini" @click="handleEdit(scope.row.id)" :disabled="scope.row.time_status == 0">修改</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)" plain :disabled="scope.row.time_status == 0 || scope.row.status == 0">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" background :page-sizes="[30, 50, 70, 90]" @size-change="handleSizeChange" layout="sizes, prev, pager, next" :page-size="30" :total="total"></el-pagination>
        </div>
    </div>
</template>
<script>
import { seckillGoodsImport } from '@/api/activity/activity'
import Vue from 'vue'
export default {
    name: "seckilllist",
    data() {
        return {
            loading: false,
            tableData: [],
            total: 0,
            page: 1,
            page_size: 30,
            act_id: '',
            start_time: '',
            end_time: '',
            clear_show: true
        }
    },
    created() {
        this.init()
    },
    components: {
    },
    methods: {
        // 加载数据
        init() {
            this.loading = true
            this.$httpAxios({
                methods: 'get',
                url: 'api/seckill/list',
                data: {
                    act_id: this.act_id,
                    start_time: this.start_time,
                    end_time: this.end_time,
                    page: this.page,
                    page_size: this.page_size
                }
            }).then(res => {
                this.tableData = res.data.data.list
                this.total = Number(res.data.data.total)
                this.loading = false
            })
        },
        search() {
            this.page = 1
            this.init()
        },
        // 分页导航
        handleCurrentChange(val) {
            this.page = val
            this.init()
        },
        // 放开自定义条数
        handleSizeChange(val) {
            this.page_size = val
            this.init()
        },
        // 添加秒杀
        handleAdd(id) {
            this.$router.push({
                path: '/seckillupdate',
                query: {
                    id: id || ''
                }
            })
        },
        //导入
        handleImport(id) {
            var windowURL = window.URL || window.webkitURL
            this.file = event.target.files[0]
            this.clear_show = false
            if (this.file.size > 0) {
                let formdata = new FormData()
                formdata.append('file', this.file)
                seckillGoodsImport(formdata, id).then(res => {
                    if (res.errno == 0) {
                        this.$message.success('导入成功')
                        this.init()
                    } else {
                        this.$message.error(res.errmsg)
                    }
                    this.clear_show = true
                }).catch(err => {
                    this.clear_show = true
                })
            }
        },
        // 修改
        handleEdit(id) {
            this.$router.push({
                path: '/seckillupdate',
                query: {
                    id: id
                }
            })
        },
        // 删除
        handleDelete(id) {
            this.$confirm('此操作将下线该活动, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$httpAxios({
                    methods: 'post',
                    url: 'api/seckill/delete',
                    data: {
                        id: id
                    }
                }).then(res => {
                    if (res.data.errno == 0) {
                        this.$message.success('操作成功')
                        this.init()
                    } else {
                        this.$message.error(res.data.errmsg)
                    }
                })
            }).catch(() => {
            })
        }
    }
};
</script>

<style scoped>
.intimport {
    opacity: 0;
    z-index: 10;
    position: absolute;
    right: 0px;
    top: 2px;
    width: 60px;
    height: 30px;
    cursor: pointer;
}
.aintimport {
    position: relative;
    color: #fff;
    background-color: #f56c6c;
    padding: 5px 10px;
    border-radius: 4px;
    margin-right: 12px;
    border-color: #f56c6c;
    cursor: pointer;
}
.gray_btn {
    color: #fff;
    position: relative;
    background-color: #999;
    padding: 5px 10px;
    border-radius: 4px;
    margin-right: 12px;
    border-color: #999;
    cursor: pointer;
}
</style>
