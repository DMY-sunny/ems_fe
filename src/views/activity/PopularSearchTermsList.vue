<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-zoom-in"></i>搜索热门列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form class="demo-form-inline" inline @submit.native.prevent>
                <el-input v-model="key_word" placeholder="请输入活动名称或活动id" @keyup.enter.native="search" class="handle-input mr10" />
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="handletoCreate">新增</el-button>
                </el-form-item>
            </el-form>
            <div>
                <el-table align="center" :data="tableData" border class="table" v-loading="loading_activity" ref="multipleTable">
                    <el-table-column prop="id" label="活动ID" align="center">
                        <template scope="scope">
                            {{scope.row.id}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="使用环境" align="center">
                        <template scope="scope">
                            <el-tag v-for="(item,index) in scope.row.client_limit" :key="index">{{item==1?'仅app可用':item==2?'仅小程序可用':item==3?'仅公众号可用':''}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="热门搜索标题" align="center" />
                    <el-table-column prop="start_time" label="开始时间" :formatter="formatTime"></el-table-column>
                    <el-table-column prop="end_time" label="结束时间" :formatter="formatTime"></el-table-column>
                    <el-table-column prop="logo_url" label="活动图片" align="center" width="310">
                        <template slot-scope="scope" v-if="scope.row.logo_url">
                            <img :src="scope.row.logo_url" width="240" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="是否下架" align="center">
                        <template slot-scope="scope">
                            {{scope.row.status==0?"下架":"上架"}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="活动类型" align="center">
                        <template slot-scope="scope">
                            {{scope.row.type==1?"拼团":scope.row.type==2?"活动":''}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="link_app_url" label="H5地址" align="center">
                        <template slot-scope="scope">
                            {{scope.row.link_app_url}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="link_xcx_url" label="小程序地址" align="center">
                        <template slot-scope="scope">
                            {{scope.row.link_xcx_url}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="260" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
                            <el-button v-if="scope.row.status == 0" type="warning" size="mini" icon="el-icon-upload2" @click="handleDelete(scope.row,1)">上架</el-button>
                            <el-button v-if="scope.row.status == 1" type="warning" size="mini" icon="el-icon-download" @click="handleDelete(scope.row,0)">下架</el-button>
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row,2)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination background @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" @size-change="handleSizeChange" layout="sizes, prev, pager, next" :page-size="10" :total="total"></el-pagination>
                </div>
            </div>
        </div>
        <!-- //新增 or 修改 弹窗 -->
        <el-dialog :title="VStext" :visible.sync="dialogVisible" width="70%">
            <el-form :model="form">
                <el-form-item style="display:flex" label="使用环境">
                    <el-checkbox-group v-model="form.client_limit">
                        <el-checkbox v-if="false" label="0">全部</el-checkbox>
                        <el-checkbox label="1">仅app可用</el-checkbox>
                        <el-checkbox label="2">仅小程序可用</el-checkbox>
                        <el-checkbox label="3">仅公众号可用</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="热门搜索标题" :label-width="formLabelWidth">
                    <el-input v-model="form.title" maxlength="20" show-word-limit autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth" prop="start_time">
                    <el-date-picker v-model="form.start_time" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth" prop="end_time">
                    <el-date-picker v-model="form.end_time" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动类型">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="1">拼团</el-radio>
                        <el-radio :label="2">活动</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="活动图片" :label-width="formLabelWidth">
                    <el-input v-model="form.logo_url" maxlength="200" show-word-limit autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="form.logo_url" label="活动图片" prop="logo_url">
                    <img :src="form.logo_url" class="logo" width="200" />
                </el-form-item>
                <el-form-item label="H5地址" :label-width="formLabelWidth">
                    <el-input v-model="form.link_app_url" maxlength="200" show-word-limit autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="小程序地址" :label-width="formLabelWidth">
                    <el-input v-model="form.link_xcx_url" maxlength="200" show-word-limit autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit" :loading="loading">{{VStext}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
const cityOptions = ['仅app可用', '仅小程序可用', '仅公众号可用'];
import {
    hotsearchkeylist,
    hotsearchkeydetail,
    hotsearchkeysave,
    hotsearchkeychangestatuse
} from "@/api/activity/activity";
import { formatDate } from "@/utils/utils";
import { toDate } from "@/utils/index";
export default {
    name: "orderList",
    data() {
        return {
            cities: cityOptions,
            dialogVisible: false,
            statusVisible: false,
            VStext: "新增",
            formLabelWidth: "120px",
            createdVSupdate: true,
            loading_activity: false,
            loading: false,
            tableData: [],
            cur_page: 1,
            page_size: 10,
            key_word: "",
            total: null,
            form: {
                client_limit: [],
            }
        };
    },
    created() {
        this.initData();
        // this.getCity()
    },
    computed: {},
    methods: {
        // 分页导航
        handleCurrentChange(val) {
            this.cur_page = val;
            this.initData();
        },
        //        放开自定义条数
        handleSizeChange(val) {
            this.page_size = val;
            this.initData();
        },
        //状态改变
        // changeStatus() {
        //     this.initData();
        // },
        initData() {
            this.loading_activity = true;
            let params = {
                key_word: this.key_word,
                cur_page: this.cur_page,
                page_size: this.page_size
            };
            hotsearchkeylist(params)
                .then(res => {
                    if (res.errno == 0) {
                        this.loading_activity = false;
                        this.tableData = res.data.list;
                        this.total = res.data.count - 0;
                    } else {
                        this.$message.error(res.errmsg);
                        this.loading_activity = false;
                    }
                })
                .catch(err => {
                    this.loading_activity = false;
                });
        },
        search() {
            this.cur_page = 1;
            this.initData();
        },
        //新创建活动
        handletoCreate(index, row) {
            this.createdVSupdate = true;
            this.VStext = "新增";
            this.key_word = '';
            this.form = {
                logo_url: '',
                start_time: '',
                end_time: '',
                client_limit: [],
                type: 1,
            };
            this.dialogVisible = true;
        },
        //修改
        handleEdit(row) {
            this.createdVSupdate = false;
            this.VStext = "修改";
            this.key_word = '';
            this.form = Object.assign({}, row);
            this.dialogVisible = true;
        },
        // 确定按钮
        onSubmit() {
            if (this.createdVSupdate) {
                (this.form.id = ""),
                    hotsearchkeysave(this.form).then(res => {
                        this.loading = false;
                        if (res.errno == 0) {
                            this.$message.success("新增成功！");
                            this.dialogVisible = false;
                            this.initData(); //刷新列表
                            return;
                        } else {
                            this.$message.error(res.errmsg);
                        }
                    });
            } else {
                hotsearchkeysave(this.form).then(res => {
                    this.loading = false;
                    if (res.errno == 0) {
                        this.$message.success("修改成功！");
                        this.dialogVisible = false;
                        this.initData(); //刷新列表
                        return;
                    } else {
                        this.$message.error(res.errmsg);
                    }
                });
            }
        },
        //    删除 下架 上架
        handleDelete(row, type) {
            let tishi = type == 0 ? "下架" : type == 1 ? "上架" : type == 2 ? "删除" : '';
            this.$confirm("此操作将" + tishi + "该活动，是否继续？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let sendObj = {
                        id: row.id,
                        status: type,
                    };
                    hotsearchkeychangestatuse(sendObj)
                        .then(res => {
                            if (res.errno == 0) {
                                this.$message.success("您已成功" + tishi + "该活动！");
                                this.initData();
                            } else {
                                this.$message.error(res.errmsg);
                            }
                        })
                        .catch(err => { });
                })
                .catch(() => { });
        },
        //时间
        formatTime: function (row, column, cellValue) {
            cellValue = cellValue / 1000;
            return formatDate(cellValue);
        },
        //处理数组类型（将字符串类型转换成数字类型）
        // turnNum(nums) {
        //     return nums.map(Number);
        // }
    }
};
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
    width: 300px;
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
