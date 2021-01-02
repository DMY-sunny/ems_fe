<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon iconfont el-iconshangpin"></i> 修改活动</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-col :span="20" :offset="2">
                <div class="form-box">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="活动ID">
                            <el-row :gutter="0">
                                <el-col :span="22">
                                    <el-input v-model="form.act_id" disabled />
                                </el-col>
                                <el-col :span="2">
                                    <el-button type="info" @click="copyText(form.act_id)">复制id</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="活动名称" prop="title">
                            <el-input v-model="form.title" placeholder="请输入活动名称" />
                        </el-form-item>
                        <el-form-item label="活动短名" prop="alias">
                            <el-input v-model="form.alias" maxlength="5" show-word-limit placeholder="请输入活动名称" />
                        </el-form-item>
                        <el-form-item label="活动类型" prop="type">
                            <el-radio-group v-model="form.type">
                                <el-radio :label='1'>第二件半价</el-radio>
                                <el-radio :label='2'>换购</el-radio>
                                <el-radio :label='100'>0元购</el-radio>
                                <el-radio :label='101'>微信分享</el-radio>
                                <el-radio :label='3'>N元任选</el-radio>
                                <el-radio :label='4'>买A赠B</el-radio>
                                <el-radio :label='5'>折扣专区</el-radio>
                                <el-radio :label='6'>限量秒杀</el-radio>
                                <el-radio :label='7'>买N免M</el-radio>
                                <el-radio :label='8'>预付定金</el-radio>
                                <el-radio :label='9'>前五分钟半价</el-radio>
                                <el-radio :label='13'>定金膨胀</el-radio>
                                <el-radio :label='17'>第二件立减</el-radio>
                                <el-radio :label='18'>第二件XX元</el-radio>
                                <!-- <el-radio :label='20'>一件包邮</el-radio> -->
                                <el-radio :label='21'>满减</el-radio>
                                <el-radio :label='22'>包邮活动</el-radio>
                                <el-radio :label='23'>聚划算</el-radio>
                                <!-- <el-radio :label='24'>用券专区</el-radio> -->
                                <el-radio :label='25'>全额返活动</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="价格策略" v-if="form.type !== 23">
                            <el-radio-group v-model="form.price_strategy" disabled>
                                <el-radio :label='1'>会员价、非会员价不同</el-radio>
                                <el-radio :label='2'>会员价、非会员价相同</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="form.type == 23" label="折扣范围">
                            <el-input v-model="form.from_discount" type="number" placeholder="请输入数字" class="w130" />
                            到
                            <el-input v-model="form.to_discount" type="number" placeholder="请输入数字" class="w130" />
                        </el-form-item>
                        <el-form-item v-if="form.type == 6 || form.type == 8 || form.type == 24" label="自动计算价格系数">
                            <el-input v-model="form.cal_coefficient" placeholder="请填写数字"></el-input>
                        </el-form-item>
                        <el-form-item label="自动计算" v-if="form.type !== 13 && form.type!==23 && form.type !== 25">
                            <el-checkbox v-model="form.auto_calculate">自动计算</el-checkbox>
                        </el-form-item>
                        <el-form-item label="售罄提醒" v-if="form.type !== 22 && form.type !== 25">
                            <el-radio-group v-model="form.open_selloutnotice">
                                <el-radio :label='1'>开启</el-radio>
                                <el-radio :label='2'>关闭</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="是否在商城显示">
                            <el-checkbox v-model="form.show_at_mall"></el-checkbox>
                        </el-form-item>
                        <!-- 换购 -->
                        <el-form-item label="换购额度" prop="cut" v-if="form.type == 2">
                            满
                            <el-input v-model="form.full" placeholder="0" />
                            加
                            <el-input v-model="form.avg_price" placeholder="0" />
                        </el-form-item>
                        <!-- N元任选 -->
                        <el-form-item label="N元任选" prop="purchase_data" v-if="form.type == 3">
                            满
                            <el-input v-model="form.full" placeholder="0" />
                            选
                            <el-input v-model="form.cut" placeholder="0" />
                        </el-form-item>
                        <!-- 折扣额度 -->
                        <el-form-item label="折扣额度" prop="discount" v-if="form.type == 5">
                            <el-tag v-for="(tag,index) in form.discount_data.discount" :key="index">
                                {{tag.num}}件{{tag.dis}}折
                            </el-tag>
                            <el-input v-model="discount_num" placeholder="0" :span="20" />
                            件
                            <el-input v-model="discount_diss" placeholder="0" :span="20" />
                            折
                            <el-button @click="discountAdd()" type="success" size="medium" plain class="">添加</el-button>
                        </el-form-item>
                        <!-- 买N免N -->
                        <el-form-item label="买N免N" prop="buydiscount" v-if="form.type == 7">
                            买
                            <el-tag v-for="(tag,index) in form.discount_data.buydiscount" :key="index" closable @close="buynfreemDelete(index)">
                                买{{tag.num}}免{{tag.dis}}
                            </el-tag>
                            <el-input v-model="discount_num" placeholder="0" />
                            免
                            <el-input v-model="discount_diss" placeholder="0" />
                            <el-button @click="buydiscountAdd()" type="success" size="medium" plain class="">添加</el-button>
                        </el-form-item>
                        <!-- 预付定金 -->
                        <el-form-item label="尾款时间" prop="cut" v-if="form.type == 8">
                            支付尾款开始时间
                            <el-date-picker class="all_width" value-format="timestamp" v-model="form.advance_end.beginTime" type="datetime" placeholder="选择开始时间">
                            </el-date-picker>
                            支付尾款结束时间
                            <el-date-picker class="all_width" value-format="timestamp" v-model="form.advance_end.endTime" type="datetime" placeholder="选择结束时间">
                            </el-date-picker>
                        </el-form-item>
                        <!-- 定金膨胀 -->
                        <el-form-item label="尾款时间" prop="cut" v-if="form.type == 13">
                            支付尾款开始时间
                            <el-date-picker class="all_width" value-format="timestamp" v-model="form.earnest_money_params.start_time" type="datetime" placeholder="选择开始时间">
                            </el-date-picker>
                            支付尾款结束时间
                            <el-date-picker class="all_width" value-format="timestamp" v-model="form.earnest_money_params.end_time" type="datetime" placeholder="选择结束时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="折扣" v-if="form.type == 13">
                            <el-input v-model="form.earnest_money_params.discount_proportion" placeholder="折扣额度必须大于86" />
                        </el-form-item>
                        <!-- 第二件立减 -->
                        <el-form-item :label="form.type == 17?'第N件减M':'满减'" v-if="form.type == 17||form.type == 21">
                            N
                            <el-input v-if="form.type == 17" v-model="form.second_cut[0].full" placeholder="0" />
                            <el-input v-else v-model="form.full" placeholder="0" />
                            M
                            <el-input v-if="form.type == 17" v-model="form.second_cut[0].cut" placeholder="0" />
                            <el-input v-else v-model="form.cut" placeholder="0" />
                        </el-form-item>
                        <!-- 第二件xx元 -->
                        <el-form-item label="第二件xx元" v-if="form.type == 18">
                            <el-input v-model="form.second_sale[0].sale" placeholder="0" />
                        </el-form-item>
                        <!-- 包邮活动 -->
                        <div v-if="form.type == 22">
                            <el-form-item label="限购规则">
                                <el-select v-model="form.buylimit.astrict_rule_option" placeholder="请选择">
                                    <el-option v-for="item in astrict_option_list" :key="item.value" :value='item.value' :label="item.label">{{item.label}}</el-option>
                                </el-select>
                                <div v-if="form.buylimit.astrict_rule_option!=0">
                                    <el-input type="number" min="1" class="input_width" v-model.number="form.buylimit.astrict_rule_amount" />
                                    <span>每人每天可购买商品件数(必须大于等于1的正整数)</span>
                                </div>
                            </el-form-item>
                            <el-form-item label="是否可用优惠券">
                                <el-radio-group v-model="form.buylimit.is_coupon">
                                    <el-radio :label='1'>是</el-radio>
                                    <el-radio :label='0'>否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                        <!-- 全额返活动 -->
                        <div v-if="form.type == 25">
                            <el-form-item label="全额返" prop="cut">
                                满
                                <el-input v-model="form.allreturn.full" placeholder="0" style="width:110px;" />
                                可参与
                            </el-form-item>
                            <el-form-item label="全额返" prop="number">
                                <el-input placeholder="请输入内容" v-model="form.allreturn.astrict_rule_amount" class="input-with-select">
                                    <el-select v-model="form.allreturn.astrict_rule_option" slot="prepend" placeholder="请选择" style="width:160px;">
                                        <el-option label="不限" :value="0"></el-option>
                                        <el-option label="每人每天限购" :value="1"></el-option>
                                        <el-option label="活动期间每人限购" :value="2"></el-option>
                                    </el-select>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="最大订单金额">
                                <el-input v-model="form.allreturn.max_full" placeholder="0" />
                            </el-form-item>
                            <el-form-item label="商品范围">
                                <el-radio-group v-model="form.allreturn.goodsset">
                                    <el-radio :label='1'>部分商品</el-radio>
                                    <el-radio :label='0'>全场商品</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                        <!-- 待修改 -->
                        <el-form-item label="开始时间" prop="start_time">
                            <el-date-picker class="all_width" v-model="form.start_time" type="datetime" value-format="yyyy-MM-ddTHH:mm:ss" placeholder="选择开始时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间" prop="end_time">
                            <el-date-picker class="all_width" v-model="form.end_time" type="datetime" value-format="yyyy-MM-ddTHH:mm:ss" placeholder="选择结束时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-radio-group v-model="form.status">
                                <el-radio :label='0'>未发布</el-radio>
                                <el-radio :label='1'>已发布</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="排序" prop="sort_order">
                            <el-radio-group v-model="form.sort_order" @change="sort_Change">
                                <el-radio :label='0'>后台排序</el-radio>
                                <el-radio :label='1'>销量排序</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="背景颜色">
                            <el-color-picker v-model="form.background_color"></el-color-picker>
                        </el-form-item>
                        <el-form-item v-if="form.type !== 23" label="上传banner">
                            <pic-upload v-model="form.logo_url" @change="logoLoad" />
                            <el-button type="danger" @click="(form.logo_url = '')" v-if="form.logo_url">删除图片</el-button>
                        </el-form-item>
                        <el-form-item label="上传分享图">
                            <pic-upload v-model="form.share_pic" />
                        </el-form-item>
                        <el-form-item label="活动标签" prop="dynamicTags">
                            <el-tag v-for="(tag,index) in dynamicTags" :key="index" type="danger" size="medium">
                                {{tag.tag_name}}
                            </el-tag>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="onSubmit(form)" :loading="loading" plain>确认修改</el-button>
                            <el-button type="warning" @click="launchTrue" v-if="form.type !== 24 && form.type !== 25" plain>发起采购提报申请</el-button>
                            <el-button type="primary" @click="revisionsBut" v-if="form.type !== 24 && form.type !== 25" plain>采购提报纪录</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </div>
        <commodity-list :formgoodscount="goods_count" :formtype="form.type"> </commodity-list>
        <el-dialog title="采购提报单" :visible.sync="dialogVisible" width="80%">
            <el-form v-loading='loading' ref="purchaseForm" :model="purchaseForm" label-width="120px" label-position="right">
                <el-form-item label="折扣范围">
                    <el-input v-model="purchaseForm.from_discount" type="number" placeholder="请输入数字" class="w130" />
                    到
                    <el-input v-model="purchaseForm.to_discount" type="number" placeholder="请输入数字" class="w130" />
                </el-form-item>
                <el-form-item label="需要的商品数量" prop="goods_num">
                    <el-input v-model="purchaseForm.goods_num"></el-input>
                </el-form-item>
                <el-form-item label="可供库存" prop="stock_symbol">
                    <el-select v-model="purchaseForm.stock_symbol" placeholder="请选择">
                        <el-option :value="item.value" :label="item.key" v-for="(item,index) in stock_symbols" :key="index"></el-option>
                    </el-select>
                    <el-input v-model="purchaseForm.stock_num" type="number" placeholder="请输入数字" class="w130" />
                </el-form-item>
                <el-form-item label="可供成本" prop="cost_from">
                    <el-input v-model="purchaseForm.cost_from" type="number" placeholder="请输入数字" class="w130" />
                    <el-select v-model="purchaseForm.cost_symbol_from" placeholder="请选择">
                        <el-option :value="item.value" :label="item.key" v-for="(item,index) in symbols" :key="index"></el-option>
                    </el-select>
                    到
                    <el-select v-model="purchaseForm.cost_symbol_to" placeholder="请选择">
                        <el-option :value="item.value" :label="item.key" v-for="(item,index) in symbols" :key="index"></el-option>
                    </el-select>
                    <el-input v-model="purchaseForm.cost_to" type="number" placeholder="请输入数字" class="w130" />
                </el-form-item>
                <el-form-item label="商城30日销量" prop="sales_symbol_to">
                    <el-select v-model="purchaseForm.sales_symbol_to" placeholder="请选择">
                        <el-option :value="item.value" :label="item.key" v-for="(item,index) in symbols" :key="index"></el-option>
                    </el-select>
                    <el-input v-model="purchaseForm.sales_to" type="number" placeholder="请输入数字" class="w130" />
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-tree :data="menuTreeData" :default-checked-keys="menuId" ref="trees" show-checkbox highlight-current accordion check-strictly node-key="id" :props="defaultProps" @check="clickDeal" @check-change="handleCheckChange">
                    </el-tree>
                </el-form-item>
                <el-form-item label="发货仓" prop="delivery_place">
                    <el-checkbox :indeterminate="purchaseForm.isdeliveryAll" v-model="checkdeliveryAll" @change="deliveryAll">全选</el-checkbox>
                    <el-checkbox-group v-model="purchaseForm.delivery_place" style="display: inline-block;">
                        <el-checkbox v-for="city in delivery_place" :label="city.value" :key="city.value" :disabled="disabledVplace(city)">{{city.key}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="是否需要POP商品" prop="is_pop">
                    <el-checkbox v-model="purchaseForm.is_pop" :disabled="purchaseForm.is_pop && is_pop"></el-checkbox>
                </el-form-item>
                <el-form-item label="是否需要WMS商品" prop="is_wms">
                    <el-checkbox v-model="purchaseForm.is_wms"></el-checkbox>
                </el-form-item>
                <el-form-item label="指定POP商家">
                    <el-select v-model="purchaseForm.pop_merchants" multiple filterable allow-create default-first-option remote :remote-method="remoteMethod" placeholder="请选择" class="input_width500">
                        <el-option v-for="item in options" :key="item.merchant_id" :label="item.merchant" :value="item.merchant_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="提报截止日期" prop="dead_line">
                    <el-date-picker v-model="purchaseForm.dead_line" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="purchaseForm.remark">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" icon="el-icon-refresh-right" @click="launchTrue('purchaseForm')" plain>重 置</el-button>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button :loading="loading" type="success" @click="launch">发 起</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="采购提报规则修改纪录" :visible.sync="dialogTableVisible" width="80%">
            <el-table v-loading='loading' :data="dialogTable">
                <el-table-column label="商品分类" width="130" type="expand">
                    <template slot-scope="props">
                        <el-input type="textarea" autosize v-model="props.row.category" disabled></el-input>
                    </template>
                </el-table-column>
                <el-table-column property="date" label="日期"></el-table-column>
                <el-table-column property="operator" label="编辑人"></el-table-column>
                <el-table-column property="stock" label="可供库存"></el-table-column>
                <el-table-column property="cost" label="可供成本"></el-table-column>
                <el-table-column property="sales" label="商城30天销量"></el-table-column>
                <el-table-column property="is_pop" label="是否允许提报POP商品"></el-table-column>
                <el-table-column property="delivery_place" label="发货仓"></el-table-column>
                <el-table-column property="remark" label="备注"></el-table-column>
            </el-table>
            <el-button @click="dialogTableVisible = false">关闭</el-button>
        </el-dialog>
    </div>
</template>
<script>
const search_Form = {
    act_id: '',
    source: '',//商品来源
    keyword: '',
    goods_status: '',//商品状态
    sold_status: '',//售卖状态
    sorted_by: '',//排序
};
import {
    goodslist,
    actdetail,
    goodsupdatepost,
    bannerUpdata,
    purchaseConfigs,
    categories2,
    purchasePost,
    purchaseGet,
    goodslistConfigs,
    revisions,
    categoriesTree,
    tagList,
    merchants
} from '@/api/activity/activity'
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import { type, loadavg } from 'os'
import { send } from 'q'
import { DH_NOT_SUITABLE_GENERATOR, EACCES } from 'constants'
import data from './data.js';
import commodityList from "./commodityList.vue";
import PicUpload from '../tools/pic-upload.vue'
import { readSync } from 'fs';
import { get } from 'http';
import { CLIENT_RENEG_LIMIT } from 'tls';
export default {
    name: 'activityaUpdate',
    components: {
        draggable,
        commodityList,
        PicUpload,
    },
    mixins: [data],
    computed: {
        ...mapGetters(['activityId'])
    },
    created() {
        this.purchase_Form = JSON.parse(JSON.stringify(this.purchaseForm));
        tagList({ act_id: this.activityId }).then(res => {//获取活动标签列表
            if (res.errno == 0) {
                this.dynamicTags = res.data.list;
            } else {
                this.$message(res.errmsg)
            }
        }).catch(err => { });
        this.form.act_id = this.activityId
        purchaseConfigs().then(res => {
            if (res.errno == 0) {
                this.symbols = res.data.symbols;
                this.stock_symbols = res.data.stock_symbols;
                this.delivery_place = res.data.delivery_place;
            } else {
                this.$message(res.errmsg)
            }
        }).catch(err => { });
        goodslistConfigs().then(res => {
            if (res.errno == 0) {
                this.source_list = res.data.source;
                this.goods_status_list = res.data.goods_status;
                this.sold_status_list = res.data.sold_status;
                this.sorted_by_list = res.data.sorted_by;
            } else {
                this.$message(res.errmsg)
            }
        }).catch(err => { });
        categoriesTree().then(res => {
            if (res.errno == 0) {
                this.menuTreeData = res.data
            } else {
                this.$message(res.errmsg)
            }
        })
    },
    mounted() {
        this.getBrandData();
    },
    methods: {
        // 采购提报记录查看
        revisionsBut() {
            this.loading = true;
            let sendObj = {
                act_id: this.form.act_id,
                page: 1,
                page_size: 50,
            }
            revisions(sendObj).then(res => {
                this.loading = false;
                if (res.errno == 0) {
                    this.dialogTableVisible = true
                    this.dialogTable = res.data.list || [];
                } else {
                    this.$message(res.errmsg)
                }
            }).catch(err => { });
        },
        //获取商品分类
        getCategories() {
            this.checked = false;
            categories2(this.purchaseForm.category4).then(res => {
                if (res.errno == 0) {
                    if (!this.purchaseForm.category4.length) this.categoriesChecbox = [];
                    else {
                        this.categoriesChecbox = res.data;
                    }
                    let arrObject = {};
                    this.purchaseForm.category5 = [];
                    for (let cal in this.purchaseForm.category) {
                        let findCal = this.purchaseForm.category4.find(item => item == cal);
                        if (findCal) {
                            this.purchaseForm.category[cal].map(ry5 => {
                                this.purchaseForm.category5.push(ry5)
                            })
                            arrObject[cal] = this.purchaseForm.category[cal]
                        }
                    }
                    this.purchaseForm.category = arrObject;
                    Object.keys(this.categoriesChecbox).forEach(box => {
                        this.categoriesChecbox[box].forEach(item => {
                            if (localStorage.getItem('category5')) {
                                JSON.parse(localStorage.getItem('category5')).map(mm => {
                                    if (item.category_id === mm) {
                                        return item = Object.assign(item, { isdisabled: true });
                                    }
                                });
                            }
                        })
                    });
                } else {
                    this.$message(res.errmsg);
                }
            }).catch(err => { });
        },
        // 吊起采购提报表单 0r 重置
        launchTrue(purchaseForm) {
            let that = this
            this.purchaseForm = JSON.parse(JSON.stringify(this.purchase_Form));
            this.loading = true;
            purchaseGet(this.form.act_id).then(res => {
                if (res.errno == 0) {
                    this.loading = false;
                    this.dialogVisible = true
                    if (res.data.id) {
                        this.purchaseForm = Object.assign
                            (this.purchaseForm, res.data);
                        this.purchaseForm.dead_line = this.TimeDownX(this.purchaseForm.dead_line);
                        if (!res.data.category || res.data.category.length == 0) {
                            this.purchaseForm.category = {
                                category1: [],
                                category2: [],
                                category3: [],
                            }
                        }
                        this.menuId = res.data.category.category1.concat(res.data.category.category2, res.data.category.category3)
                        if (this.purchaseForm.is_pop) {
                            this.is_pop = true
                        }
                        this.delivery_place.forEach((eac) => {
                            this.purchaseForm.delivery_place.map(mm => {
                                if (eac.value === mm) {
                                    return eac = Object.assign(eac, { isdisabled: true });
                                }
                            })
                        });
                        this.options = res.data.pop_merchants;
                        this.purchaseForm.pop_merchants = []
                        res.data.pop_merchants.map(pop => {
                            this.purchaseForm.pop_merchants.push(pop.merchant_id)
                        })
                        localStorage.setItem('form_delivery_place', JSON.stringify(this.purchaseForm.delivery_place));
                    }
                } else {
                    this.loading = false;
                    this.$message(res.errmsg)
                }
            }).catch(err => { this.loading = false; });
        },
        //发起活动提报
        launch() {
            this.$refs.trees.getCheckedNodes().map(res => {
                switch (res.level) {
                    case 1:
                        this.purchaseForm.category.category1.push(res.id);
                        break;
                    case 2:
                        this.purchaseForm.category.category2.push(res.id);
                        break;
                    case 3:
                        this.purchaseForm.category.category3.push(res.id);
                        break;
                }
            });
            let set1 = new Set(this.purchaseForm.category.category1)//去掉重复数据
            this.purchaseForm.category.category1 = Array.from(set1);//将set处理成数组
            let set2 = new Set(this.purchaseForm.category.category2)//去掉重复数据
            this.purchaseForm.category.category2 = Array.from(set2);//将set处理成数组
            let set3 = new Set(this.purchaseForm.category.category3)//去掉重复数据
            this.purchaseForm.category.category3 = Array.from(set3);//将set处理成数组
            this.loading = true;
            this.purchaseForm.dead_line = this.purchaseForm.dead_line / 1000;
            this.purchaseForm.act_id = this.form.act_id;
            this.purchaseForm.act_name = this.form.title;
            this.purchaseForm.act_type = this.form.type;
            this.purchaseForm.from_discount = this.purchaseForm.from_discount || this.form.from_discount;
            this.purchaseForm.to_discount = this.purchaseForm.to_discount || this.form.to_discount;
            purchasePost(this.purchaseForm).then(res => {
                if (res.errno == 0) {
                    this.purchaseForm.dead_line = this.TimeDownX(this.purchaseForm.dead_line);
                    this.dialogVisible = false
                    this.loading = false
                } else {
                    this.purchaseForm.dead_line = this.TimeDownX(this.purchaseForm.dead_line);
                    this.$message(res.errmsg)
                    this.loading = false;
                }
            }).catch(err => { });
        },
        // 上传banner图片调用函数
        logoLoad() {
            let sendObj = {
                act_id: this.form.act_id,
                type: 0,
                logo_url: this.form.logo_url,
            }
            bannerUpdata(sendObj).then(res => {
                if (res.errno == 0) {
                } else {
                    this.$message(res.errmsg)
                    this.loading = false
                }
            }).catch(err => {
                this.loading = false
            })
        },
        //改变排序处发
        sort_Change(type) {
            let sendObj = {
                act_id: this.form.act_id,
                type: 1,
                sort_order: this.form.sort_order,
            }
            bannerUpdata(sendObj).then(res => {
                if (res.errno == 0) {
                } else {
                    this.$message(res.errmsg)
                    this.loading = false
                }
            }).catch(err => {
                this.loading = false
            })
        },
        //提交数据 +1
        onSubmit(formName, routerType) {
            if (this.form.show_at_mall) {
                if (!this.form.alias) {
                    return this.$message.error('请填写活动短名称');
                }
            }
            if (this.form.show_at_mall) {
                if (!this.form.alias) {
                    return this.$message.error('请填写活动短名称');
                }
            }
            if (this.form.type == 5){
                if (this.form.discount_data.discount.length<1)
                    return this.$message.error('请添加折扣额度')
            }else if (this.form.type == 7){
                if (this.form.discount_data.buydiscount.length<1)
                    return this.$message.error('请添加买免数值');
            }
            if (this.form.type == 17 || this.form.type == 21) {
                if (!this.form.second_cut[0].full || !this.form.second_cut[0].cut) return this.$message.error('满 减,为必填字段');
            } else if (this.form.type == 18) {
                if (!this.form.second_sale[0].full || !this.form.second_sale[0].sale) return this.$message.error('满 卖,为必填字段');
            } else if (this.form.type == 23) {
                this.form.logo_url = 'ems/dev/imagetooss/20200327/HzQ66ftg87.gif'
            }
            this.form.earnest_money_params.start_time = this.form.earnest_money_params.start_time / 1000
            this.form.earnest_money_params.end_time = this.form.earnest_money_params.end_time / 1000
            this.form.advance_end.beginTime = this.form.advance_end.beginTime / 1000;
            this.form.advance_end.endTime = this.form.advance_end.endTime / 1000;
            let that = this, goodsIdList = "####"
            this.loading = true
            let sendObj = {
                act_id: this.form.act_id,
                title: this.form.title,
                alias: this.form.alias,
                show_at_mall: this.form.show_at_mall,
                logo_url: this.form.logo_url,
                type: this.form.type,
                avg_price: this.form.avg_price,
                full: this.form.full,
                fulln: this.form.fulln,
                cut: this.form.cut,
                start_time: this.form.start_time,
                end_time: this.form.end_time,
                status: this.form.status,
                sort_order: this.form.sort_order,
                goods_id_list: this.form.goods_id_list,
                discount_data: this.form.discount_data,
                discount_status: this.form.discount_status,
                earnest_money_params: this.form.earnest_money_params,
                second_cut: this.form.second_cut,
                second_sale: this.form.second_sale,
                cal_coefficient: this.form.cal_coefficient,
                price_strategy: this.form.price_strategy,
                auto_calculate: this.form.auto_calculate,
                share_pic: this.form.share_pic,
                advance_end: this.form.advance_end,
                open_selloutnotice: this.form.open_selloutnotice,
                from_discount: this.form.from_discount,
                to_discount: this.form.to_discount,
                buylimit: this.form.buylimit,
                allreturn: this.form.allreturn,
                background_color: this.form.background_color
            }
            goodsupdatepost(sendObj).then(res => {
                if (res.errno == 0) {
                    this.$message.success(routerType === 'commodity' ? '商品列表' : '您成功修改活动')
                    this.$router.replace({
                        path: routerType === 'commodity' ? '/commodityList' : '/activitylist'
                    })
                    this.loading = false
                } else {
                    this.$message(res.errmsg)
                    this.loading = false
                    this.form.earnest_money_params.start_time = this.TimeDownX(this.form.earnest_money_params.start_time);
                    this.form.earnest_money_params.end_time = this.TimeDownX(this.form.earnest_money_params.end_time);
                    this.form.advance_end.beginTime = this.form.advance_end.beginTime * 1000;
                    this.form.advance_end.endTime = this.form.advance_end.endTime * 1000;
                }
            }).catch(err => {
                this.loading = false
            })

        },
        //获取活动详情
        getBrandData() {
            actdetail(this.activityId).then(res => {
                this.form.background_color = res.data.act_info.extent_info.background_color || "";
                this.goods_count = res.data.act_info.goods_count;
                this.form.price_strategy = res.data.act_info.price_strategy;
                this.form.discount_data.discount = res.data.act_info.extent_info.discount || [];
                this.form.discount_data.buydiscount = res.data.act_info.extent_info.buydiscount || [];
                this.form.avg_price = res.data.act_info.avg_price;
                this.form.cut = res.data.act_info.cut;
                this.form.full = res.data.act_info.full;
                this.form.fulln = res.data.act_info.fulln;
                this.form.logo_url = res.data.act_info.logo_url;
                this.form.share_pic = res.data.act_info.share_pic;
                this.form.status = res.data.act_info.status;
                this.form.sort_order = res.data.act_info.sort_order;
                this.form.title = res.data.act_info.title;
                this.form.alias = res.data.act_info.alias;
                this.form.show_at_mall = res.data.act_info.show_at_mall;
                this.form.type = res.data.act_info.type;
                this.form.start_time = res.data.act_info.start_time
                this.form.end_time = res.data.act_info.end_time
                this.form.buylimit = res.data.act_info.extent_info.buylimit || {
                    astrict_rule_option: 0,
                    astrict_rule_amount: 1,
                    is_coupon: 0
                }
                this.form.allreturn = res.data.act_info.extent_info.allreturn || {
                    full: 100,
                    astrict_rule_option: 0,
                    astrict_rule_amount: 1,
                    max_full: 0,
                    goodsset: 0
                }
                this.form.earnest_money_params.start_time = this.TimeDownX(res.data.act_info.extent_info.start_time)
                this.form.earnest_money_params.end_time = this.TimeDownX(res.data.act_info.extent_info.end_time)
                this.form.earnest_money_params.discount_proportion = res.data.act_info.extent_info.discount_proportion;
                this.form.open_selloutnotice = res.data.act_info.extent_info.open_selloutnotice || 1;
                if (res.data.act_info.extent_info.advance_end) {
                    this.form.advance_end.beginTime = this.TimeDownX(res.data.act_info.extent_info.advance_end.beginTime);
                    this.form.advance_end.endTime = this.TimeDownX(res.data.act_info.extent_info.advance_end.endTime);
                }
                if (this.form.type == 17 || this.form.type == 18 || this.form.type == 21) {
                    this.formParams(res, "second_cut");
                    this.formParams(res, "second_sale");
                }
                this.formParams(res, "auto_calculate");
                this.formParams(res, "cal_coefficient");
                this.formParams(res, "from_discount");
                this.formParams(res, "to_discount");
            })
        },
        formParams(res, params) {
            if (res.data.act_info.extent_info[params] !== undefined)
                this.form[params] = res.data.act_info.extent_info[params];
        },
        discountAdd() { // 折扣标签添加
            let arr = this.form.discount_data.discount
            arr.push({ num: this.discount_num, dis: this.discount_diss })
            arr.sort(function (a, b) {
                return a.num - b.num
            })
            this.form.discount_data.discount = arr
            setTimeout(res => {
                this.discount_num = '',
                    this.discount_diss = ''
            }, 500)
        },
        discountDelete(index) { // 折扣标签删除
            this.form.discount_data.discount.splice(index, 1);
        },
        buydiscountAdd() { // 折扣标签添加
            let arr = this.form.discount_data.buydiscount
            arr.push({ num: this.discount_num, dis: this.discount_diss })
            arr.sort(function (a, b) {
                return a.num - b.num
            })
            this.form.discount_data.buydiscount = arr
            setTimeout(res => {
                this.discount_num = '',
                    this.discount_diss = ''
            }, 500)
        },
        buynfreemDelete(index) { // 折扣标签删除
            this.form.discount_data.buydiscount.splice(index, 1);
        },
        //时间处理
        TimeDownX(DateStr) {
            let date = DateStr * 1000;
            return date;
        },
        disabledVplace(item) {
            return this.purchaseForm.delivery_place.some(ele => ele === item.value && item.isdisabled)
        },
        //复制
        copyText(row) {
            let Url2 = row;  //每一行的某个值，如选中的当前行的url
            let oInput = document.createElement('input');     //创建一个隐藏input
            oInput.value = Url2;    //赋值
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.className = 'oInput';
            oInput.style.display = 'none';
            this.$message.success('复制成功!')
        },
        // 下拉远程请求
        remoteMethod(query) {
            if (query !== '') {
                setTimeout(() => {
                    merchants({ name: query, page: 1, page_size: 1000 }).then(res => {
                        if (res.errno == 0) {
                            this.options = res.data.list;
                        } else {
                            this.$message(res.errmsg);
                        }
                    }).catch(err => { })
                }, 200);
            } else {
                this.options = [];
            }
        },
        // 商品分类，tree树状多选处理
        clickDeal(currentObj, treeStatus) {
            // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
            let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
            // 选中
            if (selected !== -1) {
                // 子节点只要被选中父节点就被选中
                this.selectedParent(currentObj)
                // 统一处理子节点为相同的勾选状态
                this.uniteChildSame(currentObj, true)
            } else {
                // 未选中 处理子节点全部未选中
                this.uniteChildSame(currentObj, false)
            }
        },
        uniteChildSame(treeList, isSelected) {
            this.$refs.trees.setChecked(treeList.id, isSelected)
            if (treeList.children) {
                for (let i = 0; i < treeList.children.length; i++) {
                    this.uniteChildSame(treeList.children[i], isSelected)
                }
            }
        },
        // 统一处理父节点为选中
        selectedParent(currentObj) {
            let currentNode = this.$refs.trees.getNode(currentObj)
            if (currentNode.parent.key !== undefined) {
                this.$refs.trees.setChecked(currentNode.parent, true)
                this.selectedParent(currentNode.parent);
            }
        },
        handleCheckChange() {
            return this.$refs.trees.getCheckedNodes();
        },
        deliveryAll(val) {
            let categorData = [];
            this.delivery_place.map(ele => {
                categorData.push(ele.value)
            });
            this.purchaseForm.delivery_place = val ? categorData : localStorage.getItem('form_delivery_place') ? JSON.parse(localStorage.getItem('form_delivery_place')) : [];
            this.purchaseForm.isdeliveryAll = false;
        },
    },
    beforeDestroy() {
        localStorage.setItem('category4', []);
        localStorage.setItem('category5', []);
        localStorage.setItem('form_delivery_place', []);
    }
}
</script>
<style scoped>
/* 线上引入 */
.mb {
    margin-bottom: 10px;
}

.form-box {
    margin: 0 auto;
}

.fr {
    float: right;
}

.fr button {
    display: block;
    width: 100%;
    margin: 5px 0 0;
}

.drag-list {
    float: left;
    padding: 10px;
    width: 205px;
    border: 1px solid #dcdfe6;
    border-radius: 10px;
    margin: 10px;
    font-size: 12px;
}

.el-table th,
.el-table tr.el-table__row {
    float: left !important;
}

.el-table tr {
    float: left !important;
}

.red {
    color: #ff0000;
}
.float_right {
    float: right;
}
.w130 {
    width: 130px;
}
.w110 {
    width: 110px;
}
.input_width {
    width: 200px;
}
.input_width500 {
    width: 500px;
}
</style>
