<template>
    <div style="background:#fff">
        <div>
            <el-button type="primary" @click='addpopup'>添加入口配置</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="name" label="入口标题" width="120"></el-table-column>
            <el-table-column prop="en_img" label="会员入口图" width="150">
                <template slot-scope="scope">
                    <img style="width:100%;height:auto" :src="cdn06 + (scope.row.show_user == 1 ? scope.row.en_img : scope.row.en_img_member)" />
                </template>
            </el-table-column>
            <el-table-column prop="en_img" label="非会员入口图" width="150">
                <template slot-scope="scope">
                    <img style="width:100%;height:auto" :src="cdn06 + (scope.row.show_user == 1 ? scope.row.en_img : scope.row.en_img_nonmember)" />
                </template>
            </el-table-column>
            <el-table-column prop="show_link" label="入口链接_H5" width="190"></el-table-column>
            <el-table-column prop="show_link" label="入口链接_小程序" width="190" :formatter="formatXcxUrl"></el-table-column>
            <el-table-column prop="jump" label="自动跳转" width="60">
                <template slot-scope="scope">
                    <div>{{scope.row.jump == 1 ? '是' : '否'}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="bottom_flag" label="子入口展示" width="60">
                <template slot-scope="scope">
                    <div>{{scope.row.bottom_flag == 1 ? '展示' : '不展示'}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="act_flag" label="商品展示框" width="60">
                <template slot-scope="scope">
                    <div>{{scope.row.act_flag == 1 ? '展示' : '不展示'}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="share_text" label="分享文案" width="180">
                <template slot-scope="scope" width="80">
                    <div>{{scope.row.share_text}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="share_img" label="分享图" width="100">
                <template slot-scope="scope">
                    <img style="width:100%;height:auto" :src="cdn06 + scope.row.share_img" />
                </template>
            </el-table-column>
            <el-table-column prop="start_time" label="时间" width="180">
                <template slot-scope="scope">
                    <div>开始：<span>{{formatDate(scope.row.start_time)}}</span></div>
                    <div>结束：<span>{{formatDate(scope.row.end_time)}}</span></div>
                </template>
            </el-table-column>
            <el-table-column prop="operator" label="创建人" width="80"></el-table-column>
            <el-table-column prop="activity_id" label="id" width="120"></el-table-column>
            <el-table-column prop="address" label="地址" width="80">
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
import { entranceList, entrancedeltoast } from '@/api/entrance.js'
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
            entranceList({ page: that.page }).then(res => {
                that.tableData = res.data.list
                that.count = res.data.count
                that.image_host = res.data.image_host
            })
        },
        handleCurrentChange(val) {
            this.page = val
            this.requestCreated()
        },
        formatXcxUrl: function (row, column, cellValue) {
            return "/pages/webview/webview?url=" + encodeURIComponent(cellValue) + "&fromx=saleact"
        },
        modification(data) {
            this.$router.push({
                path: "/addEntrance",
                query: {
                    id: data.activity_id
                }
            })
        },
        addpopup() {
            this.$router.push({
                path: "/addEntrance"
            })
        },
        deleteObj(data) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                entrancedeltoast({ activity_id: data.activity_id }).then(res => [
                    this.requestCreated()
                ])
            })

        }


    }
}
</script>