<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon iconfont el-iconshangpin"></i> 新增活动</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-col :span="20" :offset="2">
                <div class="form-box">
                    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                        <el-form-item label="活动ID">
                            <el-input v-model="form.act_id" disabled />
                        </el-form-item>
                        <el-form-item label="活动名称" prop="title">
                            <el-input v-model="form.title" placeholder="请输入活动名称" />
                        </el-form-item>
                        <el-form-item label="活动短名" prop="alias">
                            <el-input v-model="form.alias" maxlength="5" show-word-limit placeholder="请输入短名称" />
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
                            <el-radio-group v-model="form.price_strategy">
                                <el-radio :label='1'>会员价、非会员价不同</el-radio>
                                <el-radio :label='2'>会员价、非会员价相同</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="form.type == 23" label="折扣范围">
                            <el-input v-model="form.from_discount" type="number" placeholder="请输入整数" class="w130" />
                            到
                            <el-input v-model="form.to_discount" type="number" placeholder="请输入整数" class="w130" />
                        </el-form-item>
                        <el-form-item v-if="form.type == 6 || form.type == 8|| form.type == 24" label="自动计算价格系数">
                            <el-input v-model="form.cal_coefficient" placeholder="请填写数字"></el-input>
                        </el-form-item>
                        <el-form-item label="自动计算" v-if="form.type !== 13 && form.type !== 23 && form.type !== 25">
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
                            <el-input v-model="form.fulln" placeholder="0" />
                            选
                            <el-input v-model="form.cut" placeholder="0" />
                        </el-form-item>
                        <!-- 折扣额度 -->
                        <el-form-item label="折扣额度" prop="discount" v-if="form.type == 5">
                            <el-tag v-for="(tag,index) in form.discount_data.discount" :key="index" closable @close="discountDelete(index)">
                                {{tag.num}}件{{tag.dis}}折
                            </el-tag>
                            <el-input v-model="discount_num" placeholder="0" :span="20" />
                            件
                            <el-input v-model="discount_diss" placeholder="0" :span="20" />
                            折
                            <el-button @click="discountAdd()" type="success" size="medium" plain class="">添加</el-button>
                        </el-form-item>
                        <!-- 买N免M -->
                        <el-form-item label="买N免M" prop="buydiscount" v-if="form.type == 7">
                            <el-tag v-for="(tag,index) in form.discount_data.buydiscount" :key="index" closable @close="buynfreemDelete(index)">
                                买{{tag.num}}免{{tag.dis}}
                            </el-tag>
                            买
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
                            <el-input v-model="form.earnest_money_params.discount_proportion" placeholder="折扣额度必须大于86" @change="inputend" />
                        </el-form-item>
                        <!-- 第二件立减 -->
                        <el-form-item :label="form.type == 17?'第N件减M':'满减'" v-if="form.type == 17||form.type == 21">
                            N
                            <el-input v-model="form.second_cut[0].full" placeholder="0" />
                            M
                            <el-input v-model="form.second_cut[0].cut" placeholder="0" />
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
                            <el-radio-group v-model="form.sort_order">
                                <el-radio :label='0'>后台排序</el-radio>
                                <el-radio :label='1'>销量排序</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="背景颜色">
                            <el-color-picker v-model="form.background_color"></el-color-picker>
                        </el-form-item>
                        <el-form-item v-if="form.type !== 23" label="上传banner">
                            <pic-upload v-model="form.logo_url" />
                            <el-button type="danger" @click="deleteImg" v-if="form.logo_url">删除图片</el-button>
                        </el-form-item>
                        <el-form-item label="上传分享图">
                            <pic-upload v-model="form.share_pic" />
                        </el-form-item>
                        <el-form-item label="活动标签" prop="nav_tags">
                            <el-tag v-for="(tag,index) in dynamicTags" :key="index" closable @close="handleClose(tag,index)" type="danger" size="medium">
                                {{tag.tag_name}}
                            </el-tag>
                            <el-input maxlength="5" show-word-limit class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" />
                            <el-badge v-else value="new" class="item">
                                <el-button class="button-new-tag" @click="showInput">+ 新增标签</el-button>
                            </el-badge>
                        </el-form-item>
                        <el-form-item>
                            <el-alert title="回车即可添加标签" type="warning" center show-icon />
                        </el-form-item>
                        <el-button type="primary" @click="onSubmit(form)" :loading="loading">确认创建新活动</el-button>
                    </el-form>
                </div>
            </el-col>
        </div>
    </div>
</template>
<script>
import {
    autocomplete,
    skusearch,
    goodscreatepost,
    createAppId,
    actautocomplete,
    bannerUpdata,
    tagStore,
    tagDelete
} from '@/api/activity/activity'
import draggable from 'vuedraggable'
import PicUpload from '../tools/pic-upload.vue'
import { type } from 'os'
import { send } from 'q'
export default {
    name: 'activityaCreate',
    components: {
        draggable,
        PicUpload
    },
    data: function () {
        const validatelogoUrl = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请上传商品logo图片'))
            } else {
                callback()
            }
        }
        const validateName = (rule, value, callback) => {
            var pattern = new RegExp("[`~!@$^&*=|{}':;',\\[\\].<>?~！@￥……&*——|{}【】‘；：”“'。，、？%]");
            if (!value) {
                callback(new Error('请输入活动名称'))
            } else if (value.match(pattern)) {
                callback(new Error('活动名称含有非法字符'))
            } else if (value.length > 100) {
                callback(new Error('活动名称不能超过100个字'))
            } else {
                callback()
            }
        }
        return {
            timeout: "",//定义节流函数
            loading: false,
            // 标签
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            form: {
                background_color: "",
                from_discount: 0,
                to_discount: 0,
                open_notice: false,
                cal_coefficient: '',
                price_strategy: 1,
                auto_calculate: false,
                // 商品添加字段
                act_id: '',
                goods_name: '',
                type: 0,
                sort_order: 0,
                buy_limit: '',//限购
                sort: '',//排序
                price: '',//普通价格
                memberprice: '',//会员价格
                sku_id: '',//sku_id
                sku_name: '',//sku_name
                is_top: '',
                goods_id_list: [],//goods_id_list
                //活动添加字段
                title: '',//活动名称
                alias: '',
                show_at_mall: false,
                full: 0,//充分
                fulln: 0,//饱满
                cut: 0,//减
                avg_price: 0,//平均价格
                logo_url: '',//头图链接
                share_pic: '',//分享图片
                start_time: '',
                end_time: '',
                status: 0,//状态
                discount_status: 1,//折扣状态
                earnest_money: '', //定金
                coefficient: '', //系数
                open_selloutnotice: 1,
                earnest_money_params: {
                    start_time: '',// 收尾款开始时间
                    end_time: '',// 收尾款结束时间
                },
                advance_end: {
                    beginTime: '',
                    endTime: '',
                },
                discount_data: {
                    discount: [],//折扣专区
                    buydiscount: [],//买n减n
                },
                second_cut: [{//第二件立减
                    full: '',
                    cut: '',
                }],
                second_sale: [{//第二件xx元
                    full: '2',
                    sale: '',
                }],
                buylimit: {
                    astrict_rule_option: 0,
                    astrict_rule_amount: 1,
                    is_coupon: 0
                },
                allreturn: {
                    full: 100,
                    astrict_rule_option: 0,
                    astrict_rule_amount: 1,
                    max_full: 0,
                    goodsset: 0
                }

            },
            start_time: '',// 收尾款开始时间
            end_time: '',// 收尾款结束时间
            restaurants: [],//输入建议列表
            productList: [],
            discount_num: '',
            discount_diss: '',
            goods_id: '',
            dragOptions: {
                animation: 150,
                scroll: true,
                group: 'sortlist',
                ghostClass: 'ghost-style'
            },
            rules: {
                goods_name: [
                    { required: true, message: '请输入产品名称', trigger: 'blur' },
                ],
                sort: [
                    { required: true, message: '排序不能为空!' },
                ],
                buy_limit: [
                    { required: true, message: '限购数量不能为空!' },
                ],
                price: [
                    { required: true, message: '普通价格不能为空!' },
                ],
            },
            astrict_option_list: [{
                value: 0,
                label: '不限'
            }, {
                value: 1,
                label: '每人每天限购'
            }, {
                value: 2,
                label: '活动期间每人限购'
            }]
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        deleteImg() {
            this.form.logo_url = ''
        },
        // 提交额度大于86
        inputend() {
            if (this.form.earnest_money_params.discount_proportion < 86) {
                this.$message.error('折扣额度必须大于86')
                this.form.earnest_money_params.discount_proportion = ''
            }
        },
        // 提交数据
        onSubmit(formName) {
            if (this.form.show_at_mall) {
                if (!this.form.alias) {
                    return this.$message.error('请填写活动短名称');
                }
            }
            if (this.form.type == 17 || this.form.type == 21) {
                if (!this.form.second_cut[0].full || !this.form.second_cut[0].cut) return this.$message.error('满 减,为必填字段');
            } else if (this.form.type == 18) {
                if (!this.form.second_sale[0].full || !this.form.second_sale[0].sale) return this.$message.error('满 卖,为必填字段');
            } else if (this.form.type == 23) {
                this.form.logo_url = 'ems/dev/imagetooss/20200327/HzQ66ftg87.gif'
            }
            this.form.earnest_money_params.start_time = this.form.earnest_money_params.start_time / 1000;
            this.form.earnest_money_params.end_time = this.form.earnest_money_params.end_time / 1000;
            this.form.advance_end.beginTime = this.form.advance_end.beginTime / 1000;
            this.form.advance_end.endTime = this.form.advance_end.endTime / 1000;
            let sendObj = {
                act_id: formName.act_id,
                title: formName.title,
                alias: formName.alias,
                show_at_mall: formName.show_at_mall,
                type: formName.type,
                sort_order: formName.sort_order,
                full: this.form.second_cut[0].full || formName.full,
                fulln: formName.fulln,
                cut: this.form.second_cut[0].cut || formName.cut,
                avg_price: formName.avg_price,
                logo_url: this.form.logo_url,
                share_pic: formName.share_pic,
                start_time: formName.start_time,
                end_time: formName.end_time,
                status: formName.status,
                discount_status: formName.discount_status,

                goods_id_list: this.form.goods_id_list,
                discount_data: this.form.discount_data,
                earnest_money_params: this.form.earnest_money_params,
                advance_end: this.form.advance_end,
                second_cut: this.form.second_cut,
                second_sale: this.form.second_sale,
                cal_coefficient: this.form.cal_coefficient,
                price_strategy: this.form.price_strategy,
                auto_calculate: this.form.auto_calculate,
                open_selloutnotice: this.form.open_selloutnotice,
                from_discount: this.form.from_discount,
                to_discount: this.form.to_discount,
                buylimit: formName.buylimit,
                allreturn: formName.allreturn,
                background_color: this.form.background_color
            }
            this.loading = true;
            goodscreatepost(sendObj).then(res => {
                if (res.errno == 0) {
                    this.$message.success('您成功创建活动');
                    this.$store.commit('SET_ACTIVITY_ID', this.form.act_id)
                    setTimeout(res => {
                        this.$router.push({
                            path: '/activityaupdate'
                        })
                        this.loading = false;
                    }, 3000)
                } else {
                    this.$message(res.errmsg)
                    this.loading = false;
                    this.form.earnest_money_params.start_time = this.form.earnest_money_params.start_time * 1000;
                    this.form.earnest_money_params.end_time = this.form.earnest_money_params.end_time * 1000;
                    this.form.advance_end.beginTime = this.form.advance_end.beginTime * 1000;
                    this.form.advance_end.endTime = this.form.advance_end.endTime * 1000;
                }
            }).catch(err => {
                this.loading = false;
            })
        },
        getData() {
            createAppId().then(res => {
                if (res.errno == 0) {
                    this.form.act_id = res.data.act_id;
                } else {
                    this.$message.error(res.errmsg);
                }
            }).catch(err => {
            })
        },
        //input 提示功能
        querySearch(queryString, cb) {
            actautocomplete(queryString).then(res => {
                if (res.errno == 0) {
                    for (var i = 0; i < res.data.list.length; i++) {
                        res.data.list[i].value = res.data.list[i].name;
                    }
                    var restaurants = res.data.list
                    // var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                    var results = queryString ? restaurants : restaurants;
                    cb(results);
                } else {
                    this.$message.error(res.errmsg)
                }
            })
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
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
        buydiscountAdd() { // 买n减m
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

        // 活动标签
        handleClose(tag, index) {//删除
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            let sendObj = {
                id: tag.id
            }
            tagDelete(sendObj).then(res => {
                if (res.errno == 0) {
                    this.$message.success('已删除')
                } else {
                    this.$message.error(res.errmsg);
                }
            })
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            // let is_repeat = this.isRepeat(this.dynamicTags);
            // 节流 防止短时间多次触发请求
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                let inputValue = this.inputValue;
                this.inputVisible = false;
                let sendObj = {
                    act_id: this.form.act_id,
                    tag_name: this.inputValue,
                    id: 0,
                }
                // if (is_repeat) return this.$message.error("请删除重复标签");
                if (!this.inputValue) return;
                tagStore(sendObj).then(res => {
                    if (res.errno == 0) {
                        this.inputValue = '';
                        this.dynamicTags.push({ tag_name: inputValue, id: res.data });
                        this.$message.success('添加成功')
                    } else {
                        this.$message.error(res.errmsg);
                    }
                })
            }, 500);
        },
        // 哈希判断素组是否有相同的值
        isRepeat(arr) {
            var hash = {};
            for (var i in arr) {
                if (hash[arr[i].tag_name]) {
                    return true;
                }
                hash[arr[i].tag_name] = true;
            }
            return false;
        }
    }
}
</script>
<style scoped>
.sku_item {
    margin-right: 10px;
}
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
    width: 140px;
    height: 260px;
    border: 1px solid #dcdfe6;
    border-radius: 10px;
    margin: 10px;
    font-size: 12px;
}
.drag-list > div {
    height: 50px;
    overflow: hidden;
}

.red {
    color: #ff0000;
}
.w130 {
    width: 130px;
}
.input_width {
    width: 200px;
}
/* 标签样式 */
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
/* 标签样式 end */
</style>
