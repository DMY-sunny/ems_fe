<template>
    <div style="background:#fff">
        <div>
            <el-button type="primary" @click='addpopup'>添加开屏</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="open_id" label="开屏信息" width="180">
                <template slot-scope="scope">
                    <div>open_id：<span>{{scope.row.open_id}}</span></div>
                    <div>名称：<span>{{scope.row.name}}</span></div>
                    <div>状态：<span>{{scope.row.status === 1?"显示":"隐藏"}}</span></div>
                </template>
            </el-table-column>
            <el-table-column prop="advertising_url" label="ios/非会员/无刘海" width="100">
                <template slot-scope="scope">
                    <img style="width:80px" :src="image_host+scope.row.advertising_url" v-if="scope.row.advertising_url_type == 1"/>
                    <video :src="image_host+scope.row.advertising_url" id="videoPlay" class="img_auto" v-else>您的浏览器不支持 video 视屏播放。</video>
                </template>
            </el-table-column>
            <el-table-column prop="url_x" label="ios/非会员/有刘海" width="100">
                <template slot-scope="scope">
                    <img style="width:80px" :src="image_host+scope.row.url_x" v-if="scope.row.url_x_type == 1"/>
                    <video :src="image_host+scope.row.url_x" id="videoPlay" class="img_auto" v-else>您的浏览器不支持 video 视屏播放。</video>
                </template>
            </el-table-column>
            <el-table-column prop="vip_url" label="ios/会员/无刘海" width="100">
                <template slot-scope="scope">
                    <img style="width:80px" :src="image_host+scope.row.vip_url"  v-if="scope.row.vip_url_type == 1"/>
                    <video :src="image_host+scope.row.vip_url" id="videoPlay" class="img_auto" v-else>您的浏览器不支持 video 视屏播放。</video>
                </template>
            </el-table-column>
            <el-table-column prop="vip_url_x" label="ios/会员/有刘海" width="100">
                <template slot-scope="scope">
                    <img style="width:80px" :src="image_host+scope.row.vip_url_x" v-if="scope.row.vip_url_x_type == 1" />
                    <video :src="image_host+scope.row.vip_url_x" id="videoPlay" class="img_auto" v-else>您的浏览器不支持 video 视屏播放。</video>
                </template>
            </el-table-column>
            <el-table-column prop="advertising_url_b" label="安卓开屏" width="100">
                <template slot-scope="scope">
                    <img style="width:80px" :src="image_host+scope.row.advertising_url_b" v-if="scope.row.advertising_url_b_type == 1" />
                    <video :src="image_host+scope.row.advertising_url_b" id="videoPlay" class="img_auto" v-else>您的浏览器不支持 video 视屏播放。</video>
                </template>
            </el-table-column>
            <el-table-column prop="open_url" label="链接"></el-table-column>
            <el-table-column prop="start_time" label="时间" width="180">
                <template slot-scope="scope">
                    <div>开始：<span>{{formatDate(scope.row.start_time)}}</span></div>
                    <div>结束：<span>{{formatDate(scope.row.end_time)}}</span></div>
                </template>
            </el-table-column>
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
import { openList, deleteOpen } from '@/api/open.js'
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
            openList({ page: that.page }).then(res => {
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
                path: "/addopen",
                query: {
                    id: data.open_id
                }
            })
        },
        addpopup() {
            this.$router.push({
                path: "/addopen"
            })
        },
        deleteObj(data) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteOpen({ open_id: data.open_id }).then(res => [
                    this.requestCreated()
                ])
            })

        }


    }
}
</script>
<style>
.img_auto {
    width: 100%;
    object-fit: cover;
    height: auto;
}
</style>