<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-time"></i> 排行榜列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form class="demo-form-inline" inline @submit.native.prevent>
                <el-form-item label="商品分类" prop="category">
                    <el-select v-model="category" placeholder="全部一级分类" @change="initData">
                        <el-option :value="item.category_id" :label="item.category_name" v-for="(item,index) in categories" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始时间" prop="start_time">
                    <el-date-picker class="all_width" v-model="start_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" @change="initData" placeholder="选择开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="end_time">
                    <el-date-picker class="all_width" v-model="end_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" @change="initData" placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" icon="el-icon-refresh-right" :loading="loading" @click="initData(1)" size="mini" plain>重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleCreate" icon="el-icon-plus">新建排行榜活动</el-button>
                </el-form-item>
                <el-form-item>
                    <a href="https://cdn06.kepler8.com/ems/production/filetooss/20200220/eqrnkl40x7.xlsx
" class="aintimport"><i class="el-icon-download"></i>模板下载</a>
                </el-form-item>
            </el-form>
            <el-form :inline="true" class="demo-form-inline">
            </el-form>
            <div>
                <el-table :data="tableData" border v-loading="loading" element-loading-text="拼命加载中" ref="multipleTable">
                    <el-table-column prop="id" label="排行榜id" align="center" width="130" />
                    <el-table-column prop="name" label="排行榜名称" align="center" width="130" />
                    <el-table-column prop="category" label="类目" align="center">
                        <template slot-scope="scope">
                            <p>{{scope.row.category}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="time" label="开始/结束时间" align="center" width="150">
                        <template slot-scope="scope">
                            <div>{{scope.row.start_time}}</div>
                            <div>{{scope.row.end_time}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="120">
                        <template slot-scope="scope">
                            <div class="mb">
                                <a href="javascript:void(0)" class="aintimport"><i class="el-icon-folder-opened"></i><input v-if="clearShow" class="intimport" icon="el-icon-download" type="file" @change="handleImport(scope.row.id)">导入</a>
                            </div>
                            <div class="mb">
                                <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)" plain>修改</el-button>
                            </div>
                            <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)" plain>删除</el-button>
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
    rankingList,
    goodsImport,
    rankingDelete
} from '@/api/activity/leaderboard/leaderboard'
import Pagination from "@/components/Pagination"
import {
    categories
} from '@/api/activity/activity'
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
            categories: [],
            category: '',
            start_time: '',
            end_time: '',
            clearShow: true,
        }
    },
    created() {
        this.initData();
        categories(0).then(res => {
            let catAll = [{category_id:'',category_name:'全部'}]
            if (res.errno == 0) {
                this.categories = catAll.concat(res.data) 
            } else {
                this.$message(res.errmsg)
            }
        }).catch(err => { });
    },
    methods: {
        initData(int) {
            this.loading = true
            this.category = int === 1 ? '' : this.category;
            this.start_time = int === 1 ? '' : this.start_time;
            this.end_time = int === 1 ? '' : this.end_time;
            let sendObj = {
                page: this.cur_page,
                page_size: this.page_size,
                category: this.category,
                start_time: this.start_time,
                end_time: this.end_time,
            }
            rankingList(sendObj).then(res => {
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
            this.$store.commit('SET_LEADER_ID', 0)
            this.$store.commit('SET_ADDVSUP', true)
            this.$router.push({
                path: '/leaderboard',
            })
        },
        //    修改
        handleEdit(row) {
            this.$store.commit('SET_LEADER_ID', row.id)
            this.$store.commit('SET_ADDVSUP', false)
            this.$router.push({
                path: '/leaderboard',
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
                    rankingDelete(sendObj).then(res => {
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
        //导入
        handleImport(id) {
            var windowURL = window.URL || window.webkitURL
            this.file = event.target.files[0]
            this.clearShow = false;
            if (this.file.size > 0) {
                let formdata = new FormData()
                formdata.append('import_goods', this.file);
                goodsImport(formdata, id).then(res => {
                    if (res.errno == 0) {
                        this.$notify({
                            title: '提示',
                            dangerouslyUseHTMLString: true,
                            message: "<div style='height:200px;overflow-y:scroll;'>共 " + res.data.total + "条数据，导入成功的数量是：" + res.data.success+"。      原因:"+res.data.errors+"'</div>'",
                            duration: 0,
                            type: 'success'
                        });
                        this.initData();
                    } else {
                        this.$message.error(res.errmsg)
                    }
                    this.clearShow = true;
                }).catch(err => {
                    this.clearShow = true;
                })
            }
        },
    }
}
</script>

<style scoped>
.mb {
    margin-bottom: 10px;
}
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
</style>
