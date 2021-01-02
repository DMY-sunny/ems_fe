<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-chat-square"></i> 消息推送列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="searchForm" @submit.native.prevent label-width="120px">
                    <el-form-item label="任务名称/创建人">
                        <el-input v-model="searchForm.keyword" placeholder="请输入任务名称/创建人" @keyup.enter.native="search" />
                    </el-form-item>
                    <el-form-item label="消息类型">
                        <el-select v-model="searchForm.type" @change="search" placeholder="申请状态">
                            <el-option value="" label="全部"></el-option>
                            <el-option value="push" label="PUSH"></el-option>
                            <el-option value="sms" label="短信"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发送时间">
                        <el-date-picker v-model="searchForm.begin_ts" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间" />
                        --
                        <el-date-picker v-model="searchForm.end_ts" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" />
                    </el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                    <el-button type="warning" icon="el-icon-refresh-left" @click="handleReset">重置</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="handlecreateedit('add',{})">新增</el-button>
                </el-form>
            </div>
            <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" border ref="multipleTable">
                <el-table-column prop="id" label="任务ID" align="center" width="100" />
                <el-table-column prop="debug_mode" label="推送模式" :formatter="formatHot"></el-table-column>
                <el-table-column prop="task_name" label="任务名称" align="center" />
                <el-table-column prop="creator" label="创建人" align="center" />
                <el-table-column prop="success" label="实际推送数量" align="center" />
                <el-table-column prop="failed" label="推送失败数量" align="center" />
                <el-table-column prop="type" label="推送类型" align="center" />
                <el-table-column prop="create_ts" label="创建时间" align="center" width="142" />
                <el-table-column prop="begin_ts" label="推送时间" align="center" width="142" />
                <el-table-column prop="end_ts" label="结束时间" align="center" width="142" />
                <el-table-column label="操作" align="center" fixed="right" width="280">
                    <template slot-scope="scope">
                        <el-button type="success" icon="el-icon-edit" @click="handlecreateedit('copy',scope.row)">复制</el-button>
                        <el-button type="primary" icon="el-icon-view" @click="handlecreateedit('edit',scope.row)">查看</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :page-sizes="[30, 50, 70, 90]" @size-change="handleSizeChange" layout="sizes, prev, pager, next" :page-size='30' :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="推送消息信息" :visible.sync="pushVisible" width="60%" center @close="cancle" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                <el-form-item label="推送模式" prop="type">
                    <el-select v-model="form.debug_mode" placeholder="请选择推送模式">
                        <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.debug_mode" :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="推送日期" prop="begin_tst">
                    <el-date-picker v-model="form.begin_ts" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择推送时间" />
                </el-form-item>
                <el-form-item label="推送类型" prop="type">
                    <el-radio-group v-model="form.type">
                        <el-radio :value="item.value" :label="item.value" v-for="item in itemForm.types" :key="item.value" border>{{item.key}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="数据来源" prop="data_source">
                    <el-radio-group v-model="form.data_source">
                        <el-radio :value="item.value" :label="item.value" v-for="(item,index) in itemForm.data_source" :key="index" border>{{item.key}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="form.data_source=='file'">
                    <el-form-item label="文件上传" prop="filename">
                        <global-uploader v-model="form.filename"></global-uploader>
                    </el-form-item>
                    <el-form-item v-if="!isShowEdit" prop="filename">
                        <el-button @click="BusUpload"> 选择文件 </el-button>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="用户类型" prop="user_type_logic">
                        <el-select v-model="form.user_type_logic" placeholder="请选择状态">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.logic" :key="index"></el-option>
                        </el-select>
                        &nbsp;&nbsp;
                        <el-checkbox-group v-model="form.user_types" style="display: inline-block;">
                            <el-checkbox v-for="city in itemForm.user_type" :label="city.value" :key="city.value">{{city.key}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="注册时间" prop="registration_time_logic">
                        <el-select v-model="form.registration_time_logic" placeholder="请选择状态">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.logic" :key="index"></el-option>
                        </el-select>
                        <el-date-picker v-model="form.registration_from_date" type="date" value-format="yyyy-MM-dd" placeholder="选择开始时间" />
                        -
                        <el-date-picker v-model="form.registration_to_date" type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间" />
                    </el-form-item>
                    <el-form-item label="订单支付时间" prop="nicked_name">
                        <el-select v-model="form.pay_date_logic" placeholder="请选择状态">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.logic" :key="index"></el-option>
                        </el-select>
                        <el-select v-model="form.pay_date_type" placeholder="请选择">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.pay_date_type" :key="index"></el-option>
                        </el-select>
                        <el-select v-model="form.pay_date_status" placeholder="订单状态">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.pay_date_value" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="最后支付时间" prop="last_pay_date_logic">
                        <el-select v-model="form.last_pay_date_logic" placeholder="请选择状态">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.logic" :key="index"></el-option>
                        </el-select>
                        <el-select v-model="form.last_pay_days_symbol" placeholder="请选择">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.symbols" :key="index"></el-option>
                        </el-select>
                        近
                        <el-input v-model="form.last_pay_days" type="number" placeholder="天数" class="w200" />
                        天
                    </el-form-item>
                    <el-form-item label="累计订单数量" prop="sum_orders_logic">
                        <el-select v-model="form.sum_orders_logic" placeholder="请选择状态">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.logic" :key="index"></el-option>
                        </el-select>
                        <el-select v-model="form.sum_orders_symbol" placeholder="请选择">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.symbols" :key="index"></el-option>
                        </el-select>
                        <el-input v-model="form.sum_orders_num" type="number" placeholder="请输入整数" class="w200" />
                    </el-form-item>
                    <el-form-item label="品类偏好" prop="like_category_logic">
                        <el-select v-model="form.like_category_logic" placeholder="请选择状态">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.logic" :key="index"></el-option>
                        </el-select>
                        <el-select v-model="form.like_category_type" placeholder="请选择品类偏好">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.like_category" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户ID后缀" prop="uid_suffix_logic">
                        <el-select v-model="form.uid_suffix_logic" placeholder="请选择状态">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.logic" :key="index"></el-option>
                        </el-select>
                        <el-input v-model="form.uid_suffix" type="number" placeholder="用户ID后缀" class="w200" />
                    </el-form-item>
                    <el-form-item label="最后一次订单金额" prop="last_payment_amount_logic">
                        <el-select v-model="form.last_payment_amount_logic" placeholder="请选择状态">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.logic" :key="index"></el-option>
                        </el-select>
                        <el-select v-model="form.last_payment_amount_symbol" placeholder="请选择">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.symbols" :key="index"></el-option>
                        </el-select>
                        <el-tooltip class="item" effect="dark" content="单位（元）" placement="top-start">
                            <el-input v-model="form.last_payment_amount" type="number" placeholder="请输入整数" class="w200" />
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="累计金额" prop="sum_amount_logic">
                        <el-select v-model="form.sum_amount_logic" placeholder="请选择状态">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.logic" :key="index"></el-option>
                        </el-select>
                        <el-select v-model="form.sum_amount_symbol" placeholder="请选择">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.symbols" :key="index"></el-option>
                        </el-select>
                        <el-tooltip class="item" effect="dark" content="单位（元）" placement="top-start">
                            <el-input v-model="form.sum_amount" type="number" placeholder="请输入整数" class="w200" />
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="平均客单价" prop="avg_amount_logic">
                        <el-select v-model="form.avg_amount_logic" placeholder="请选择状态">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.logic" :key="index"></el-option>
                        </el-select>
                        <el-select v-model="form.avg_amount_symbol" placeholder="请选择">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.symbols" :key="index"></el-option>
                        </el-select>
                        <el-tooltip class="item" effect="dark" content="单位（元）" placement="top-start">
                            <el-input v-model="form.avg_amount" type="number" placeholder="请输入整数" class="w200" />
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="用户来源筛选" prop="reg_source_logic">
                        <el-select v-model="form.reg_source_logic" placeholder="请选择状态">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.logic" :key="index"></el-option>
                        </el-select>
                        &nbsp;&nbsp;
                        <el-checkbox-group v-model="form.reg_source" style="display: inline-block;">
                            <el-checkbox v-for="city in itemForm.reg_source" :label="city.value" :key="city.value">{{city.key}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="点击行为用户" prop="hit_date_logic">
                        <el-select v-model="form.hit_date_logic" placeholder="用户点击匹配逻辑">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.logic" :key="index"></el-option>
                        </el-select>
                        <el-select v-model="form.hit_date_type" placeholder="用户点击时间类型">
                            <el-option :value="item.value+''" :label="item.key" v-for="(item,index) in itemForm.common_date_type" :key="index"></el-option>
                        </el-select>
                        <!-- <el-select v-model="form.hit_date_status" placeholder=" 用户点击状态">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.hit_date_status" :key="index"></el-option>
                        </el-select> -->
                        <el-checkbox-group v-model="form.hit_date_categories" placeholde="用户点击商品所属类目" style="display: inline-block;">
                            <el-checkbox v-for="city in itemForm.like_category" :label="city.value" :key="city.value">{{city.key}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="加购行为用户" prop="cart_date_logic">
                        <el-select v-model="form.cart_date_logic" placeholder="用户加购匹配逻辑">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.logic" :key="index"></el-option>
                        </el-select>
                        <el-select v-model="form.cart_date_type" placeholder="用户加购时间类型">
                            <el-option :value="item.value +''" :label="item.key" v-for="(item,index) in itemForm.common_date_type" :key="index"></el-option>
                        </el-select>
                        <!-- <el-select v-model="form.cart_date_status" placeholder="用户加购状态">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.cart_date_status" :key="index"></el-option>
                        </el-select> -->
                        <el-checkbox-group v-model="form.cart_date_categories" aria-placeholder="用户加购商品所属类目" style="display: inline-block;">
                            <el-checkbox v-for="city in itemForm.like_category" :label="city.value" :key="city.value">{{city.key}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="启动App用户" prop="startup_date_logic">
                        <el-select v-model="form.startup_date_logic" placeholder="用户启动匹配逻辑">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.logic" :key="index"></el-option>
                        </el-select>
                        <el-select v-model="form.startup_date_type" placeholder="用户启动时间类型">
                            <el-option :value="item.value+''" :label="item.key" v-for="(item,index) in itemForm.common_date_type" :key="index"></el-option>
                        </el-select>
                        <el-select v-model="form.startup_date_status" placeholder="用户启动状态">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in itemForm.start_up_status" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <el-form-item label="任务名" prop="task_name">
                    <el-input v-model="form.task_name" placeholder="请输入用户名" />
                </el-form-item>
                <span v-if="form.type=='push'">
                    <el-form-item label="标题" prop="push_title">
                        <el-input v-model="form.push_title" placeholder="请输入标题" />
                    </el-form-item>
                    <el-form-item label="跳转类型" prop="push_type">
                        <el-select v-model="form.push_type" placeholder="PUSH跳转类型">
                            <el-option :value="item.value+''" :label="item.key" v-for="(item,index) in itemForm.push_types" :key="index" />
                        </el-select>
                    </el-form-item>
                    <template v-if="form.push_type === '2'">
                        <el-form-item label="连接" prop="push_link">
                            <el-input v-model="form.push_link" placeholder="请输入推送链接" />
                        </el-form-item>
                    </template>
                    <template v-else-if="form.push_type === '1'">
                        <el-form-item label="直播id" prop="push_live_id">
                            <el-input v-model="form.push_live_id" placeholder="请输入直播id" />
                        </el-form-item>
                        <el-form-item label="直播推流" prop="push_live_stream">
                            <el-input v-model="form.push_live_stream" placeholder="请输入直播链接" />
                        </el-form-item>
                    </template>
                    <el-form-item label="用户id" prop="test_user_id">
                        <el-input v-model="form.test_user_id" placeholder="请输入用户id" />
                    </el-form-item>
                    <el-form-item label="PUSH内容" prop="push_content">
                        <el-input v-model="form.push_content" type="textarea" rows="5" placeholder="请输入推送内容" />
                    </el-form-item>
                </span>
                <span v-if="form.type=='sms'">
                    <el-form-item label="短信内容" prop="sms_content">
                        <el-input v-model="form.sms_content" type="textarea" rows="5" placeholder="请输入推送内容" />
                    </el-form-item>
                    <el-form-item label="手机号" prop="test_mobile" v-if="form.type=='sms'">
                        <el-input v-model="form.test_mobile" placeholder="请输入手机号" />
                    </el-form-item>
                </span>
                <el-form-item>
                    <el-button type="primary" @click="handleSave('form','test')">测试发送</el-button>
                    <el-button v-if="isShowEdit" type="success" @click="handleCarryon">中断续发</el-button>
                </el-form-item>
                <el-form-item v-if="!isShow">
                    <div>
                        成功：<span class="red">{{form.success}}</span>
                    </div>
                    <div>
                        失败：<span class="red">{{form.failed}}</span>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancle">取 消</el-button>
                <el-button type="primary" @click="handleSave('form','submit')" v-if="isShow">确 定 提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {
    msgpushList,
    msgpushDelete,
    msgpushInfo,
    msgpushSave,
    msgpushDetail,
    msgpushTest,
    msgpushRestore,
} from "@/api/msgPush/msgPush";
import Pagination from "@/components/Pagination"
import { formatDate } from '@/utils/utils.js'
import GlobalUploader from "../tools/vue-simple-uploader/globalUploader.vue"
import Bus from '../tools/vue-simple-uploader/js/bus.js';
export default {
    name: "msgpushList",
    components: { Pagination },
    data() {
        return {
            loading: false,
            tableData: [],
            page: 1,
            page_size: 30,
            total: 0,
            searchForm: {
                type: '',
                keyword: '',
                begin_ts: '',
                end_ts: ''
            },
            begin_tst: "",
            end_tst: "",
            formatDate: formatDate,
            pushVisible: false,
            form: {
                data_source: 'db',
                type: 'push',
            },
            rules: {},
            itemForm: {},
            isShow: true,
            isShowEdit: false,
        };
    },
    created() {
        this.initData();
        this.initInfo()
    },
    components: {
        GlobalUploader,
    },
    methods: {
        // 分页导航
        handleCurrentChange(val) {
            this.page = val
            this.initData();
        },
        // 放开自定义条数
        handleSizeChange(val) {
            this.page_size = val
            this.initData()
        },
        BusUpload() {
            //吊起上传
            Bus.$emit('openUploader', {})
        },
        //推送模式
        formatHot: function (row, column, cellValue) {
            if (cellValue === 1 || null) {
                return " 跑数模式";
            } else {
                return "发送模式";
            }
        },
        search() {
            this.page = 1;
            this.initData();
        },
        //    新增 修改
        handlecreateedit(type, row) {
            if (type == 'add') {
                this.isShow = true;
                this.isShowEdit = false;
                this.form = {
                    type: 'push',
                    push_type: '2',
                    data_source: 'db',
                    registration_time_logic: 'invalid',
                    pay_date_logic: 'invalid',
                    user_type_logic: 'invalid',
                    last_pay_date_logic: 'invalid',
                    sum_orders_logic: 'invalid',
                    like_category_logic: 'invalid',
                    uid_suffix_logic: 'invalid',
                    last_payment_amount_logic: 'invalid',
                    sum_amount_logic: 'invalid',
                    avg_amount_logic: 'invalid',
                    reg_source_logic: 'invalid',
                    hit_date_logic: 'invalid',
                    cart_date_logic: 'invalid',
                    startup_date_logic: 'invalid',
                    last_pay_days_symbol: '',
                    user_types: [],
                    reg_source: [],
                    hit_date_categories: [],
                    cart_date_categories: [],
                }
                this.pushVisible = true
                this.form.id = ''
            } else if (type == 'edit') {
                this.isShow = false;
                this.isShowEdit = true;
                msgpushDetail(row.id).then(res => {
                    if (res.errno == 0) {
                        this.form = res.data
                        // this.form.pay_date_status = res.data.pay_date_status+''
                        this.pushVisible = true
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {
                })
            } else if (type == 'copy') {
                this.isShow = true;
                this.isShowEdit = false;
                this.pushVisible = true;
                msgpushDetail(row.id).then(res => {
                    if (res.errno == 0) {
                        this.form = res.data
                        this.form.begin_ts = '';
                        this.form.id = '';
                        // this.form.pay_date_status = res.data.pay_date_status+''
                        this.pushVisible = true
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {
                })
            }
        },
        //取消
        cancle() {
            this.pushVisible = false
            this.$refs['form'].resetFields()
        },
        //中断续发
        handleCarryon() {
            msgpushRestore({ id: this.form.id }).then(res => {
                if (res.errno == 0) {
                    this.pushVisible = false
                } else {
                    this.$message.error(res.errmsg);
                }
            }).catch(err => {
            })
        },
        //保存
        handleSave(form, type) {
            if (type == 'submit') {
                msgpushSave(this.form).then(res => {
                    if (res.errno == 0) {
                        this.$message.success('操作成功')
                        this.pushVisible = false
                        this.initData()
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => { })
            } else if (type == 'test') {
                msgpushTest(this.form).then(res => {
                    if (res.errno == 0) {
                        this.$message.success('测试发送成功')
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {
                    this.$message.error(res.errmsg)
                })
            }
        },
        //重置
        handleReset() {
            this.cur_page = 1;
            this.searchForm = {
                type: '',
                keyword: '',
                begin_ts: '',
                end_ts: ''
            }
            this.initData()
        },
        // 渲染列表
        initData() {
            this.loading = true;
            this.searchForm.page = this.page
            this.searchForm.page_size = this.page_size
            msgpushList(this.searchForm).then(res => {
                if (res.errno == 0) {
                    this.tableData = res.data.list;
                    this.total = Number(res.data.total);
                } else {
                    this.$message.error(res.errmsg);
                }
                this.loading = false;
            }).catch(err => {
                this.loading = false;
            });
        },
        //    删除
        handleDelete(row) {
            this.$confirm('此操作将永删除该推送消息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                msgpushDelete(row.id).then(res => {
                    if (res.errno == 0) {
                        this.$message.success('操作成功')
                        this.initData()
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {

                })
            }).catch(() => {

            })
        },
        //获取基础信息
        initInfo() {
            msgpushInfo().then(res => {
                if (res.errno == 0) {
                    this.itemForm = res.data
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
    },
};
</script>

<style scoped>
.handle-box {
    float: left;
    margin-bottom: 20px;
}
.w200 {
    width: 200px;
}
.red {
    color: red;
}
</style>
