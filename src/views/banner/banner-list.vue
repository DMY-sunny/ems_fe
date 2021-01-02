<template>
    <div style="background:#fff">
        <div>
            <el-button type="primary" @click='addpopup'>添加弹版</el-button>
            <el-button type="warning" @click='deleteCache'>删除弹版缓存</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="toast_id" label="弹版信息" width="180">
                <template slot-scope="scope">
                    <div>toast_id：<span>{{scope.row.toast_id}}</span></div>
                    <div>名称：<span>{{scope.row.name}}</span></div>
                    <div>状态：<span>{{scope.row.status === 1?"显示":"隐藏"}}</span></div>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="name" label="名称" width="100"></el-table-column> -->
            <el-table-column prop="image_url" label="图片" width="100">
                <template slot-scope="scope">
                    <img style="width:80px" :src="image_host+scope.row.image_url" />
                </template>
            </el-table-column>
            <el-table-column prop="redirect_url_h5" label="H5链接"></el-table-column>
            <el-table-column prop="redirect_url" label="小程序链接"></el-table-column>
            <el-table-column prop="description" label="description" width="100"></el-table-column>
            <el-table-column prop="toast_sort" label="权重" width="100" align="center">
                <template slot-scope="scope">
                    <el-tag type="">{{scope.row.toast_sort}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="start_time" label="时间" width="180">
                <template slot-scope="scope">
                    <div>开始：<span>{{formatDate(scope.row.start_time)}}</span></div>
                    <div>结束：<span>{{formatDate(scope.row.end_time)}}</span></div>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="status" label="状态" width="70">
                <template slot-scope="scope">
                    <span>{{scope.row.status === 1?"显示":"隐藏"}}</span>
                </template>
            </el-table-column> -->
            <el-table-column prop="address" label="地址" width="90">
                <template slot-scope="scope">
                    <div>
                        <el-button type="primary" @click="modification(scope.row)" size='mini'>修改</el-button>
                    </div>

                    <el-button type="danger" @click="deleteObj(scope.row)" size='mini'>删除</el-button>
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
import { bannerList, bannerdeltoast, delactCache } from '@/api/banner.js'
import { formatDate } from '@/utils/utils.js'
export default {
    data() {
        return {
            tableData: [],
            image_host: "",
            formatDate: formatDate,
            count: 1,
            page: 1
        }
    },
    created() {
        this.requestCreated()
    },
    methods: {
        requestCreated() {
            let that = this
            bannerList({ page: that.page }).then(res => {
                that.tableData = res.data.list
                that.count = res.data.count
                that.image_host = res.data.image_host
            })
        },
        handleCurrentChange(val) {
            this.page = val
            this.requestCreated()
        },
        modification(data) {
            this.$router.push({
                path: "/addBanner",
                query: {
                    id: data.toast_id
                }
            })
        },
        addpopup() {
            this.$router.push({
                path: "/addBanner"
            })
        },
        deleteObj(data) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                bannerdeltoast({ toast_id: data.toast_id }).then(res => [
                    this.requestCreated()
                ])
            })

        },
        deleteCache() {
            this.$prompt('请输入用户id', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                delactCache(value).then(res => {
                    this.$message({
                        type: 'warning',
                        message: res.errmsg
                    })
                })
            }).catch(() => {
            });
        }
    }
}
</script>