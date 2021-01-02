<template>
    <div style="container">
        <div class="handle-box">
            <el-form :inline="true">
                <el-form-item>
                    <el-input clearable v-model="title" @keyup.enter.native="initData" placeholder="请输入banner标题"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select clearable v-model="position" placeholder="请选择banner位置" @keyup.enter.native="initData">
                        <el-option v-for="item in config.positions" :key="item.value" :label="item.key" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select clearable v-model="category" placeholder="请选择banner分类" @keyup.enter.native="initData">
                        <el-option v-for="item in config.categories" :key="item.value" :label="item.key" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select clearable v-model="show_mode" placeholder="请选择展示人群" @keyup.enter.native="initData">
                        <el-option v-for="item in config.ismember" :key="item.value" :label="item.key" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="start_time" type="datetime" placeholder="选择开始时间" @keyup.enter.native="initData">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="end_time" type="datetime" placeholder="选择结束时间" @keyup.enter.native="initData">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" type="warning" @click="initData">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click='handleCreate'>添加banner</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table align="center" :data="tableData" border class="table" v-loading="loading" ref="multipleTable">
            <el-table-column prop="position" label="位置" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.position}}</div>
                    <el-button type="danger" size="mini" v-if="scope.row.real_status == '显示'">显示</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" align="center" />
            <el-table-column prop="img_url" label="图片" align="center" width="240">
                <template slot-scope="scope" v-if="scope.row.img_url">
                    <img :src="cdn06+scope.row.img_url" width="200">
                </template>
            </el-table-column>
            <el-table-column prop="link" label="链接" align="center" />
            <el-table-column prop="start_time" label="时间" width="180">
                <template slot-scope="scope">
                    <div>开始：<span>{{scope.row.start_time}}</span></div>
                    <div>结束：<span>{{scope.row.end_time}}</span></div>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.status == 1 ? '正常' : '隐藏'}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="show_mode" label="展示人群" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.show_mode == 2 ? '非会员' : (scope.row.show_mode == 1 ? '会员' : '全部')}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="index" label="排序" align="center" />
            <el-table-column label="操作" align="center" width="300" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
                    <el-button type="warning" size="mini" icon="el-icon-circle-plus" @click="handleDisplay(scope.row)" v-if="scope.row.status == 0">显示</el-button>
                    <el-button type="info" size="mini" icon="el-icon-remove" @click="handleHide(scope.row)" v-else>隐藏</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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
import { format } from "@/utils/utils";
import { bannerList, bannerDelete, bannerDisplay, bannerHide, bannerConfig } from '@/api/rotation/rotation.js'
export default {
    data() {
        return {
            loading_activity: false,
            loading: false,
            tableData: [],
            cur_page: 1,
            page_size: 20,
            category: '',
            show_mode: '',
            start_time: '',
            end_time: '',
            title: '',
            position: '',
            count: 1,
            config: {}
        }
    },
    created() {
        this.initData()
        bannerConfig().then(res => {
            this.config = res.data
        })
    },
    methods: {
        initData(int) {
            this.loading = true
            let sendObj = {
                title: this.title,
                position: this.position,
                page: this.cur_page,
                page_size: this.page_size,
                category: this.position == 1 ? '' : this.category,
                show_mode: this.show_mode,
                start_time: this.start_time ? format(this.start_time, 'yyyy-MM-ddTHH:mm:ss') : '',
                end_time: this.end_time ? format(this.end_time, 'yyyy-MM-ddTHH:mm:ss') : '',
            }
            bannerList(sendObj).then(res => {
                if (res.errno == 0) {
                    this.tableData = res.data.list
                    this.count = Number(res.data.total)
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
        handleCurrentChange(val) {
            this.cur_page = val
            this.initData()
        },
        handleCreate() {
            this.$router.push({
                path: '/addrotation',
            })
        },
        //    修改
        handleEdit(row) {
            this.$router.push({
                path: '/addrotation?id=' + row.id,
            })
        },
        //显示
        handleDisplay(row) {
            bannerDisplay({
                id: row.id,
            }).then(res => {
                if (res.errno == 0) {
                    this.$message.success('操作成功')
                    this.initData()
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
        //隐藏
        handleHide(row) {
            bannerHide({
                id: row.id,
            }).then(res => {
                if (res.errno == 0) {
                    this.$message.success('操作成功')
                    this.initData()
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
        //    删除
        handleDelete(row) {
            if (row)
                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let sendObj = {
                        id: row.id,
                    }
                    bannerDelete(sendObj).then(res => {
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
<style>
.container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow: hidden;
}
.img_auto {
    width: 100%;
    object-fit: cover;
    height: auto;
}
</style>