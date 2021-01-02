<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-time"></i> 活动列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form class="demo-form-inline" inline @submit.native.prevent>
                <el-form-item>
                    <el-input clearable v-model="keyword_data.key_word" placeholder="请输入活动名称或活动id" @keyup.enter.native="search" class="handle-input mr10" />
                </el-form-item>
                <el-form-item>
                    <el-select v-model="keyword_data.order_by" placeholder="默认排序">
                        <el-option :value="item.value" :label="item.key" v-for="(item,index) in order_bylist" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="keyword_data.status" placeholder="全部状态">
                        <el-option :value="item.value" :label="item.key" v-for="(item,index) in status_list" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="keyword_data.type" placeholder="场馆类型">
                        <el-option :value="item.value" :label="item.key" v-for="(item,index) in type_data" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input clearable v-model="keyword_data.creator" placeholder="请输入创建人全名" @keyup.enter.native="search" class="handle-input mr10" />
                </el-form-item>
                <el-form-item label="创建时间" prop="create_time">
                    <!-- <el-date-picker v-model="keyword_data.create_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择创建时间">
                    </el-date-picker> -->
                    <el-date-picker v-model="keyword_data.create_time" type="daterange" range-separator="至" start-placeholder="创建开始日期" end-placeholder="创建结束日期" value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                    <el-button type="warning" icon="el-icon-refresh-right" @click="search('Reset')">重置</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="handletoCreate">创建新活动</el-button>
                </el-form-item>
            </el-form>
            <div>
                <el-table align="center" :data="tableData" border class="table" v-loading="loading_activity" ref="multipleTable">
                    <el-table-column prop="act_id" label="活动ID" align="center" fixed="left">
                        <template scope="scope">
                            {{scope.row.act_id}}
                            <el-button type="text" @click="copyText(scope.row)">复制</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="活动名称" align="center" />
                    <el-table-column prop="logo_url" label="活动图片" align="center" width="310">
                        <template slot-scope="scope" v-if="scope.row.logo_url">
                            <img :src="cdn06+scope.row.logo_url" width="240">
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="活动类型" align="center">
                        <template slot-scope="scope">
                            <el-link v-if="scope.row.type" :underline="false" type="success">{{scope.row.type}}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="goods_total_num" label="商品数量" align="center">
                        <template slot-scope="scope">
                            <el-tag type="warning">{{scope.row.goods_total_num}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="goods_online_num" label="在线数据" align="center">
                        <template slot-scope="scope">
                            <el-tag type="danger">{{scope.row.goods_online_num}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                        <template slot-scope="scope">
                            <el-link v-if="scope.row.status" :underline="false" type="success">{{scope.row.status}}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="tag_list" label="标签" align="center">
                        <template slot-scope="scope" v-if="scope.row.tag_list[0]">
                            <el-tag type="danger">{{scope.row.tag_list[0]}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="creator" label="创建人" align="center" />
                    <el-table-column prop="create_time_text" label="创建时间" align="center" />
                    <el-table-column prop="start_time_text" label="开始时间" align="center" />
                    <el-table-column prop="end_time_text" label="结束时间" align="center" />
                    <el-table-column label="操作" align="center" width="180" fixed="right">
                        <template slot-scope="scope">
                            <div style="margin-bottom: 10px">
                                <el-button type="warning" size="mini" icon="el-icon-view" @click="handleEdit(scope.row)">查看</el-button>
                                <el-button type="primary" size="mini" icon="el-icon-upload2" @click="handlegoodsexport(scope.row.act_id)">导出</el-button>
                            </div>
                            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                        </template>+-
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination background @current-change="handleCurrentChange" :page-sizes="[30, 50, 70, 90]" @size-change="handleSizeChange" layout="sizes, prev, pager, next" :page-size='30' :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    activityList,
    activitylistDelete,
    listGETConfigs
} from '@/api/activity/activity'
import { toDate } from '@/utils/index'
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'activityaList',
    data() {
        return {
            loading_activity: false,
            loading: false,
            tableData: [],
            type_data: [],
            cur_page: 1,
            page_size: 30,
            country: '0',
            sort: '0',
            total: null,
            file: '',
            cityList: [],
            clearShow: true,
            order_bylist: [
                { key: "创建时间由远及近", value: "create-time-asc" },
                { key: "创建时间由近及远", value: "create-time-desc" },
                { key: "商品数量由少到多", value: "goods-count-asc" },
                { key: "商品数量由多到少", value: "goods-count-desc" },
                { key: "销售数量由少到多", value: "goods-sales-asc" },
                { key: "销售数量由多到少", value: "goods-sales-desc" },
                { key: "销售总额由少到多", value: "sales-amount-asc" },
                { key: "销售总额由多到少", value: "sales-amount-desc" },
            ],
            status_list: [
                { key: "已失效", value: "expired" },
                { key: "未失效", value: "not-expired" },
            ],
            keyword_data: {
                status: 'not-expired',
                order_by: '',
                key_word: '',
                type: '',
                creator: '',
                create_time: ''
            },
        }
    },
    created() {
        this.initData();
        listGETConfigs().then(res => {
            this.type_data = res.type
        }).catch(err => { })
    },
    computed: {
        ...mapGetters(['keyWord'])
    },
    methods: {
        //复制
        copyText(row) {
            let Url2 = row.act_id;  //每一行的某个值，如选中的当前行的url
            let oInput = document.createElement('input');     //创建一个隐藏input
            oInput.value = Url2;    //赋值
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.className = 'oInput';
            oInput.style.display = 'none';
            this.$message.success('复制成功!')
        },
        // 分页导航
        handleCurrentChange(val) {
            this.cur_page = val
            this.initData('search')
        },
        // 放开自定义条数
        handleSizeChange(val) {
            this.page_size = val
            this.initData()
        },
        //状态改变
        changeStatus() {
            this.initData()
        },
        search(reset) {
            this.cur_page = 1
            if (reset === 'Reset') return this.initData('Reset');
            else return this.initData('search');
        },
        initData(key_type) {
            if (key_type === 'Reset') {
                this.keyword_data.status = '';
                this.keyword_data.order_by = '';
                this.keyword_data.key_word = '';
                this.keyword_data.type = '';
                this.keyword_data.creator = '';
                this.keyword_data.create_time = '';
            }
            let params = {
                cur_page: this.cur_page,
                page_size: this.page_size,
                status: this.keyword_data.status,
                order_by: this.keyword_data.order_by,
                key_word: this.keyword_data.key_word,
                type: this.keyword_data.type,
                creator: this.keyword_data.creator,
                create_time: this.keyword_data.create_time,
            }
            if (key_type !== 'search' && key_type !== 'Reset') {
                if (this.keyWord) {
                    params = Object.assign(params, JSON.parse(this.keyWord));
                    this.keyword_data = params;//keyword_data值显示出来
                }
            }
            this.loading_activity = true
            activityList(params).then(res => {
                if (res.errno == 0) {
                    this.loading_activity = false
                    this.tableData = res.data.list
                    this.total = res.data.total - 0
                } else {
                    this.$message.error(res.errmsg)
                    this.loading_activity = false
                }
            }).catch(err => {
                this.loading_activity = false
            })
        },
        //新创建活动
        handletoCreate(index, row) {
            // localStorage.setItem('order_id',row.order_id)
            this.$router.push({
                path: '/activityacreate',
            })
        },
        //表格排序修改
        handlerRanknum(row) {
            let sendObj = {
                activity_id: row.act_id,
                rank_num: row.rank_num
            }
            activityranknumUpdate(sendObj).then(res => {
                if (res.errno == 0) {
                    this.$message.success('您已修改成功')
                    this.initData()
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
        //    是否展示
        handleIsshow(row) {
            let sendObj = {
                activity_id: row.activity_id,
                btn_status: row.is_show_str
            }
            activitylistIsshow(sendObj).then(res => {
                if (res.errno == 0) {
                    // this.$message.success('您已删除成功')
                    this.initData()
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
        //    修改
        handleEdit(row) {
            this.$store.commit('SET_ACTIVITY_ID', row.act_id)
            this.$router.push({
                path: '/activityaupdate'
            })
        },
        //    删除
        handleDelete(row) {
            this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let sendObj = {
                    act_id: row.act_id,
                }
                activitylistDelete(sendObj).then(res => {
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
        // 导出
        handlegoodsexport(id) {
            let export_url = `/api/act/main/goodsexport?act_id=${id}`
            window.location.href = export_url
            this.$message({
                message: "导出成功!",
                type: "success"
            });
        }
    },
    beforeDestroy() {
        this.$store.commit('SET_KEYWORD', JSON.stringify(this.keyword_data));
    }
}
</script>

<style scoped>
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
.handle-input {
    width: 200px;
    display: inline-block;
}

.table {
    width: 100%;
    font-size: 12px;
}

.red {
    color: #ff0000;
}

.mr10 {
    margin-right: 10px;
}
</style>
