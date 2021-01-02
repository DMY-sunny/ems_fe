<template>
    <div v-if="formtype !== 25">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon iconfont el-iconshangpin"></i> 商品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item v-if="addvsupdata" label="活动产品" prop="goods_name">
                    <el-autocomplete style="width: 100%;margin-bottom: 10px" v-model="form.goods_name" :fetch-suggestions="querySearch" placeholder="请输入商品名称" :trigger-on-focus="false" @select="handleSelect">
                        <template slot="append">
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <el-form-item v-else label="活动产品">
                    <el-input v-model="form.goods_name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item v-if="addvsupdata">
                    <el-select v-model="form.sku_id" placeholder="SKU名称">
                        <el-option v-for="item in skusearchList" :key="item.sku_id" :label="item.sku_name" :value="item.sku_id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="限购数量" v-if="form.type !== 22">
                    <el-input v-model="form.buy_limit" placeholder="添加数字"></el-input>
                </el-form-item>
                <el-form-item v-if="form.type == 13" label="预付定金">
                    <el-input v-model="form.earnest_money" placeholder="添加数字"></el-input>
                </el-form-item>
                <el-form-item v-if="form.type == 13" label="系数">
                    <el-input v-model="form.coefficient" placeholder="添加数字"></el-input>
                </el-form-item>
                <el-form-item label="普通价格" v-if="form.type !== 23">
                    <el-input v-model="form.price" placeholder="添加数字"></el-input>
                </el-form-item>
                <el-form-item label="会员价格">
                    <el-input v-model="form.origin_price" placeholder="添加数字"></el-input>
                </el-form-item>
                <el-form-item label="是否允许重算价格">
                    <el-checkbox v-model="form.allow_recalculate"></el-checkbox>
                </el-form-item>
                <!-- <el-form-item v-if="form.type == 23" label="会员参考价">
                    <el-input v-model="form.reference_price" placeholder="添加数字" disabled></el-input>
                </el-form-item> -->
                <el-form-item>
                    <el-button @click="handleAdd(productList),addvsupdata = true" type="success" size="medium" plain class="">添加</el-button>
                    <span style="color:red ">&nbsp; &nbsp;选择以上条目后,然后点击添加按钮保存活动产品</span>
                </el-form-item>
            </el-form>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="已提报商品列表" name="first"></el-tab-pane>
                <el-tab-pane label="已选品商品列表" name="second"></el-tab-pane>
                <el-tab-pane :label="'当前已选品SPU数量：'+goods_count" disabled></el-tab-pane>
            </el-tabs>
            <el-form inline :model="searchForm" @submit.native.prevent>
                <el-form-item>
                    <el-input @keyup.enter.native="getcountryData(1)" v-model="searchForm.goods_keyword" placeholder="输入商品ID或商品名称" clearable />
                </el-form-item>
                <el-form-item>
                    <el-input @keyup.enter.native="getcountryData(1)" v-model="searchForm.sku_keyword" placeholder="输入SKUID或SKU名称" clearable />
                </el-form-item>
                <el-form-item label="商品来源">
                    <el-select v-model="searchForm.source" placeholder="商品来源" class="w110">
                        <el-option v-for="item in source_list" :key="item.value" :label="item.key" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品状态" v-if="activeName==='second'" key="goods_status">
                    <el-select v-model="searchForm.goods_status" placeholder="商品状态" class="w110">
                        <el-option v-for="item in goods_status_list" :key="item.value" :label="item.key" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" v-if="activeName==='second'" key="sorted_by">
                    <el-select v-model="searchForm.sorted_by" placeholder="排序" class="w110">
                        <el-option v-for="item in sorted_by_list" :key="item.value" :label="item.key" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选品状态" v-if="activeName==='first'" key="select_status">
                    <el-select v-model="searchForm.select_status" placeholder="选品状态" class="w110">
                        <el-option v-for="item in select_status_list" :key="item.value" :label="item.key" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="activeName==='second'" label="商品分类">
                    <tree-select :data="menuTreeData" :defaultProps="defaultProps" :multiple="false" :nodeKey="nodeKey" :checkedKeys="menuId" :clearable="true" @popoverHide="popoverHide"></tree-select>
                </el-form-item>
                <el-form-item v-if="activeName==='second'" label="发货仓" prop="delivery">
                    <el-select v-model="searchForm.delivery" placeholder="排序" class="w110">
                        <el-option v-for="item in delivery_place" :key="item.value" :label="item.key" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="最小销量" v-if="activeName==='second'" key="form_sales">
                    <el-input v-model="searchForm.from_sales" placeholder="最小销量" class="w110"></el-input>
                </el-form-item>
                <el-form-item label="最大销量" v-if="activeName==='second'" key="to_sales">
                    <el-input v-model="searchForm.to_sales" placeholder="最大销量" class="w110"></el-input>
                </el-form-item>
                <el-form-item label="最小会员价" v-if="activeName==='second'" key="from_origin_price">
                    <el-input v-model="searchForm.from_origin_price" placeholder="最小会员价" class="w110"></el-input>
                </el-form-item>
                <el-form-item label="最大会员价" v-if="activeName==='second'" key="to_origin_price">
                    <el-input v-model="searchForm.to_origin_price" placeholder="最大会员价" class="w110"></el-input>
                </el-form-item>
                <el-form-item label="库存" v-if="activeName==='second'" key="stock">
                    <el-input v-model.number="searchForm.stock" placeholder="库存" class="w110"></el-input>
                </el-form-item>
                <el-form-item v-if="activeName==='second'" prop="stock_symbol">
                    <el-select v-model="searchForm.stock_symbol" placeholder="库存符号" class="w110">
                        <el-option v-for="item in stock_symbol_list" :key="item.value" :label="item.key" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="getcountryData(1)" size="mini" :loading="loading_activity" plain>搜索</el-button>
                    <el-button v-if="activeName==='first'" key="firstSKU" type="success" icon="el-icon-search" @click="manualPost()" size="mini" :loading="loading_activity" plain>选中sku选品</el-button>
                    <el-button v-else-if="activeName==='second'" type="danger" icon="el-icon-delete" @click="handleDelete(item,index,true)" size="mini" plain>取消sku选品</el-button>
                    <el-button type="warning" icon="el-icon-refresh-right" @click="getcountryData(2)" size="mini" plain>重置</el-button>
                </el-form-item>
                <el-form-item v-if="activeName==='second'">
                    <div style="margin-bottom: 10px">
                        <a href="http://cdn06.kepler8.com/ems/dev/filetooss/20200424/l0okBpSK1U.xlsx" class="aintimport"><i class="el-icon-download"></i>SKU模板下载</a>
                        <a href="http://cdn06.kepler8.com/ems/dev/filetooss/20200424/DdQwwpf74n.xlsx" class="aintimport"><i class="el-icon-download"></i>SPU模板下载</a>
                        <a href="javascript:void(0)" class="aintimport"><i class="el-icon-folder-opened"></i><input v-if="clearShow" icon="el-icon-download" class="intimport" type="file" @change="handleImport()">导入</a>
                    </div>
                </el-form-item>
            </el-form>
            <!-- 提报 -->
            <el-table v-if="activeName==='first'" key="first" :data="tibaoList" style="width: 100%" @selection-change="handleSelectionChange" border>
                <el-table-column align="center" type="selection" width="55" fixed="left" />Î
                <el-table-column align="center" label="序号" type="index" width="50" fixed="left" />
                <el-table-column prop="sku_img" label="SKU图片" align="center" width="120">
                    <template slot-scope="scope" v-if="scope.row.sku_img">
                        <img :src="cdn06+scope.row.sku_img" width="100">
                    </template>
                </el-table-column>
                <el-table-column prop="goods_id" label="商品ID" align="center">
                    <template scope="scope">
                        {{scope.row.goods_id}}
                    </template>
                </el-table-column>
                <el-table-column prop="goods_name" width="140" label="商品名称" align="center" />
                <el-table-column prop="sku_id" label="SKUID" align="center" />
                <el-table-column prop="sku_name" width="140" label="SKU名称" align="center" />
                <el-table-column prop="source" label="来源" align="center" />
                <el-table-column prop="price" label="普通价格" align="center" />
                <el-table-column prop="origin_price" label="会员价格" align="center" />
                <el-table-column prop="goods_status" label="商品状态" align="center" width="140">
                    <template scope="scope">
                        <span v-for="item in goods_status_list" :key="item.value">
                            <el-tag type="success" v-if="item.value==scope.row.goods_status">{{item.key}}</el-tag>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="current_cost" label="当前成本" align="center" />
                <el-table-column prop="status" label="选品状态" align="center">
                    <template scope="scope">
                        <span v-for="item in select_status_list" :key="item.value">
                            <el-tag type="primary" v-if="item.value==scope.row.status">{{item.key}}</el-tag>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center" />
            </el-table>
            <!-- 已选 -->
            <el-table v-if="activeName==='second'" key="second" :data="productList" style="width: 100%" @selection-change="handleSelectionChange" border>
                <el-table-column align="center" type="selection" width="55" fixed="left" />Î
                <el-table-column align="center" label="操作" fixed="left">
                    <template slot-scope="scope">
                        <el-button type="success" size="mini" plain @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="序号" type="index" width="50" fixed="left" />
                <el-table-column prop="sku_img" label="SKU图片" align="center" width="120">
                    <template slot-scope="scope" v-if="scope.row.sku_img">
                        <img :src="cdn06+scope.row.sku_img" width="100">
                    </template>
                </el-table-column>
                <el-table-column prop="goods_id" label="商品ID" align="center" />
                <el-table-column prop="goods_name" width="140" label="商品名称" align="center" />
                <el-table-column prop="sku_id" label="SKUID" align="center" />
                <el-table-column prop="sku_name" width="140" label="SKU名称" align="center" />
                <el-table-column prop="source" label="来源" align="center" />
                <el-table-column prop="is_top" label="是否置顶" align="center">
                    <template scope="scope">
                        <el-tag type='info'>{{scope.row.is_top?'是':'否'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="display_type" label="是否外漏" align="center">
                    <template scope="scope">
                        <el-tag type="info">{{scope.row.outside?'是':'否'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="普通价格" align="center" />
                <el-table-column prop="origin_price" label="会员价格" align="center" />
                <el-table-column prop="goods_status" label="商品状态" align="center" width="140">
                    <template scope="scope">
                        <span v-for="item in goods_status_list" :key="item.value">
                            <el-tag type="success" v-if="item.value==scope.row.goods_status">{{item.key}}</el-tag>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="category" label="商品类目" align="center">
                    <template scope="scope">
                        <span v-for="item in categories" :key="item.category_id">
                            <div type="warning" v-if="item.category_id==scope.row.category">{{item.category_name}}</div>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="buy_limit" label="限购数量" align="center" />
                <el-table-column prop="stock" label="库存" align="center" />
                <el-table-column prop="allow_recalculate" label="是否允许重新计算价格" align="center">
                    <template scope="scope">
                        <el-tag type="info">{{scope.row.allow_recalculate?'是':'否'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column v-if="form.type==13" prop="earnest_money" label="膨胀定金" align="center" />
                <el-table-column v-if="form.type==13" prop="coefficient" label="膨胀系数" align="center" />
                <el-table-column prop="sort" label="SPU排序" align="center" />
            </el-table>
            <div class="pagination" v-if="activeName==='first'" key="firstT">
                <el-pagination background @current-change="handleCurrentChange" :page-sizes="[30, 50, 70, 90]" @size-change="handleSizeChange" layout="sizes, prev, pager, next" :page-size='30' :total="totalTibao">
                </el-pagination>
            </div>
            <div class="pagination" v-if="activeName==='second'" key="secondY">
                <el-pagination background @current-change="handleCurrentChange" :page-sizes="[30, 50, 70, 90]" @size-change="handleSizeChange" layout="sizes, prev, pager, next" :page-size='30' :total="totalYixuan">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="商品维护信息" center :visible.sync="dialogTableVisible" width="80%">
            <el-table :data="goodEditList">
                <el-table-column align="center" label="序号" type="index" fixed="left" />
                <el-table-column prop="sku_img" label="SKU图片" align="center" width="120">
                    <template slot-scope="scope" v-if="scope.row.sku_img">
                        <img :src="cdn06+scope.row.sku_img" width="100">
                    </template>
                </el-table-column>
                <el-table-column prop="goods_name" label="商品名称" align="center" />
                <el-table-column align="center" label="SPU置顶">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.is_top"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否外漏">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.outside"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="SPU排序" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.sort"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="buy_limit" label="限购数量" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.buy_limit"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="普通价格" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.price" :disabled="form.type==1||form.type==5||form.type==7||form.type==18||form.type==21||form.type==23"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="origin_price" label="会员价格" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.origin_price" :disabled="form.type==1||form.type==5||form.type==7||form.type==18||form.type==21||form.type==23&&scope.row.source==='pop'"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="allow_recalculate" label="是否允许重算价格" align="center">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.allow_recalculate"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column v-if="form.type==13" prop="earnest_money" label="膨胀定金" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.earnest_money"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="slotdialog" label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <el-button @click="dialogTableVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleEditGoods(scope.row)">确 定</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <span>理由</span>
            <el-link icon="el-icon-view el-icon--right" type="danger" disabled>pop,wps提报商品必填！</el-link>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="textarea">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="goodsDelete">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示信息" center :visible.sync="dialogUpdata" width="60%">
            <el-alert :title="errmsg" type="error" center show-icon>
            </el-alert>
            <el-link icon="el-icon-view el-icon--right" type="danger" disabled>继续修改后商品将进入人工审核页面！</el-link>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogUpdata = false">取 消 修 改</el-button>
                <el-button type="primary" @click="goodsupdataLog">继 续 修 改</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
const search_Form = {
    act_id: "",//活动id
    goods_keyword: '',//商品ID或商品名称
    sku_keyword: '',//SKU_ID或SKU名称
    source: '',//来源
    goods_status: '',//商品状态
    category: '',//商品一级类目
    category2: '',//商品二级类目
    category3: '',//商品三级类目
    delivery: '', //仓
    from_sales: '',//最小销量
    to_sales: '',//最大销量
    from_origin_price: '',//最小会员价
    to_origin_price: '',//最大会员价
    select_status: '',//选品状态
    page: 1,//当前页码
    page_size: 30,//每页显示数量
    sorted_by: '',//排序
    stock: '',//库存
    stock_symbol: '',//库存符号
};
import {
    tibaoGoodsList,
    xuanpinGoodsList,
    actdetail,
    skusearch,
    skusearchv2,
    goodsdel,
    goodsadd,
    goodsupdate,
    actautocomplete,
    purchaseConfigs,
    categories,
    goodslistConfigs,
    settop,
    manual,
    goosxlsximport,
    postaudit,
    categoriesTree
} from '@/api/activity/activity'
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import { type } from 'os'
import { send } from 'q'
import { DH_NOT_SUITABLE_GENERATOR } from 'constants'
import data from './data.js';
import TreeSelect from '../tools/tree-select';

export default {
    name: 'commodityList',
    mixins: [data],
    props: ['formgoodscount', 'formtype'],
    components: {
        draggable,
        TreeSelect
    },
    computed: {
        ...mapGetters(['activityId'])
    },
    watch: {
        formtype(val) {
            this.form.type = val;
        },
        formgoodscount(val) {
            this.goods_count = val;
        }
    },
    created() {
        categories(0).then(res => {
            if (res.errno == 0) {
                this.categories = res.data
            } else {
                this.$message(res.errmsg)
            }
        }).catch(err => { });
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
                this.select_status_list = res.data.select_status;
                this.stock_symbol_list = res.data.stock_symbol;
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
        this.getcountryData(2);
        // 组建中增加了监听数据变化的，
        // 此处初始化defaultCheckedKeys的值，有效果
        this.menuId = [];
    },
    methods: {
        // 树状组件
        initChecked() {
            this.defaultCheckedKeys = [1024, 1007];
        },
        popoverHide(checkedIds, checkedData) {
            this.searchForm.category = '';
            this.searchForm.category2 = '';
            this.searchForm.category3 = '';
            const actions = [
                [1, 'category'],
                [2, 'category2'],
                [3, 'category3']
            ];
            if (checkedData.level) {
                const action = [...actions].filter(([key, value]) => (key === checkedData.level));
                action.forEach(([key, value]) => {
                    this.searchForm[value] = checkedIds;
                })
            }
        },
        manualPost() {
            if (this.goods_ids.length < 1) return this.$message.error("至少选择一个商品！");
            manual({ import_ids: this.goods_ids }).then(res => {
                if (res.errno == 0) {
                    this.getcountryData(2);
                    if (res.data.errors.length > 0) {
                        let errors_string = res.data.errors.toString();
                        this.$notify({
                            title: '提示',
                            dangerouslyUseHTMLString: true,
                            message: `<div style='height:200px;overflow-y:scroll;'>失败的商品：${errors_string} </div>`,
                            duration: 0,
                            type: 'success'
                        });
                    }
                } else {
                    this.$message.error(res.errmsg)
                }
                this.loading_activity = false
            }).catch(err => {
                this.loading_activity = false
            })
        },
        handleSelectionChange(val) {//勾选table
            this.goods_ids = [];
            val.map(item => {
                this.goods_ids.push(item.id);
            });
        },
        handleClick(tab, event) {//切换导航
            this.searchForm.page = 1;
            this.activeName = tab.name;
            this.goods_ids = [];
            this.getcountryData();
        },
        handleCurrentChange(val) {
            this.searchForm.page = val
            this.getcountryData();
        },
        // 放开自定义条数
        handleSizeChange(val) {
            this.searchForm.page_size = val
            this.getcountryData();
        },
        isdisabledprice() {
            return this.form.type == 1 || this.form.type == 5 || this.form.type == 7 || this.form.type == 18 || this.form.type == 21 || this.form.type == 23
        },
        isdisablememberprice() {
            switch (this.form.type) {
                case 1:
                case 5:
                case 7:
                case 18:
                case 21:
                    return true;
            }
        },
        //搜搜获取 数据goodslist
        getcountryData(mobile) {
            console.log(this.searchForm);
            if (mobile === 1) this.searchForm.page = 1;
            else if (mobile === 2) this.searchForm = { ...search_Form };
            this.form.act_id = this.activityId;
            this.searchForm.act_id = this.activityId;
            this.loading_activity = true;
            if (this.activeName === 'second') {
                xuanpinGoodsList(this.searchForm).then(res => {
                    if (res.errno == 0) {
                        this.totalYixuan = res.data.total;
                        this.loading_activity = false
                        this.productList = res.data.list
                    } else {
                        this.$message.error(res.errmsg)
                        this.loading_activity = false
                    }
                }).catch(err => {
                    this.loading_activity = false
                })
            } else {
                //已提报商品数据
                tibaoGoodsList(this.searchForm).then(res => {
                    if (res.errno == 0) {
                        this.totalTibao = res.data.total;
                        this.loading_activity = false;
                        this.tibaoList = res.data.list;
                    } else {
                        this.$message.error(res.errmsg)
                        this.loading_activity = false
                    }
                }).catch(err => {
                    this.loading_activity = false
                })
            }
        },
        formParams(res, params) {
            if (res.data.act_info.extent_info[params] !== undefined)
                this.form[params] = res.data.act_info.extent_info[params];
        },
        //添加活动产品
        handleAdd(item) {
            let objSend = { auto_calculate: this.form.auto_calculate }
            switch (this.form.type) {
                case 5:
                case 7:
                    this.form.discount_data = Object.assign({}, this.form.discount_data, objSend);
                    break;
                case 13:
                    this.form.earnest_money_params = Object.assign({}, this.form.earnest_money_params, objSend)
                    break;
            }
            let sendObj = {
                act_id: this.form.act_id,
                goods_id: this.goods_id,
                buy_limit: this.form.buy_limit,
                sort: this.form.sort,
                price: this.form.price,
                origin_price: this.form.origin_price,
                allow_recalculate: this.form.allow_recalculate,
                sku_id: this.form.sku_id,
                earnest_money: this.form.earnest_money,
                is_top: this.form.is_top,
                outside: this.form.outside,
            }
            goodsadd(sendObj).then(res => {
                if (res.errno == 0) {
                    if (res.data.errors.length > 0) {
                        const errors_string = res.data.errors.toString();
                        this.$notify({
                            title: '提示',
                            dangerouslyUseHTMLString: true,
                            message: `<div style='height:200px;overflow-y:scroll;'>失败的商品：${errors_string} </div>`,
                            duration: 0,
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: "添加成功!",
                            type: "success"
                        });
                    }
                    // this.productList.unshift(res.data);
                    this.getcountryData(2);
                    this.form.goods_name = '';
                    this.form.is_top = false;
                    this.form.outside = false;
                    return;
                } else {
                    this.$message.error(res.errmsg);
                    this.form.goods_id_list.shift();
                }
            }).catch(err => {
                alert('请刷新页面')
                this.form.goods_id_list.pop()
            })
        },
        handleEdit(i, row) {
            this.index = i
            this.goodEditList = [];
            this.dialogTableVisible = true;
            this.goodEditList.push(row);
        },
        // 修改商品
        handleEditGoods(row) {
            this.goodEditForm = {
                "id": row.id,
                "goods_id": row.goods_id,
                "buy_limit": row.buy_limit,
                "sort": row.sort,
                "price": row.price,
                "origin_price": row.origin_price,
                "allow_recalculate": row.allow_recalculate,
                "earnest_money": row.earnest_money,
                "is_top": row.is_top,
                "outside": row.outside,
            };
            goodsupdate(this.goodEditForm).then(res => {
                if (res.errno == 0) {
                    let productObj = {};
                    Object.assign(productObj, res.data);
                    this.productList.splice(this.index, 1, productObj);
                    this.$message({
                        message: "修改成功!",
                        type: "success"
                    });
                    this.dialogTableVisible = false;
                    this.addvsupdata = true
                } else if (res.errno == 1403) {
                    this.dialogTableVisible = false;
                    this.dialogUpdata = true;
                    this.errmsg = res.errmsg;
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {
            })
        },
        goodsupdataLog() {
            this.loading_activity = true;
            let sendObj = {
                "detail_id": this.goodEditForm.id,
                "price": this.goodEditForm.price,
                "origin_price": this.goodEditForm.origin_price,
                "earnest_money": this.goodEditForm.earnest_money,
            }
            postaudit(sendObj).then(res => {
                if (res.errno == 0) {
                    this.dialogUpdata = false;
                } else {
                    this.$message.error(res.errmsg)
                }
                this.loading_activity = false;
            })
        },
        //input 触发事件
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
        handleSelect(item) { //选中品牌
            this.form.brand_name = item.value
            this.goods_id = item.goods_id
            let that = this
            skusearchv2({ goods_name: item.value }).then(res => {//获取选中场馆商品的信息
                if (res.errno == 0) {
                    that.form.sku_id = "";
                    that.skusearchList = [{ sku_name: '全选', sku_id: '' }].concat(res.data);
                } else {
                    that.$message.error(res.errmsg)
                }
            }).catch(err => {
            })
        },
        handleDelete(item, index, isBatch) {
            this.dialogVisible = true;
            this.deleteData = item;
            // this.isBatch = isBatch;
        },
        //删除活动商品
        goodsDelete() {
            // if (!this.isBatch) { this.goods_ids = []; this.goods_ids.push(this.deleteData.primary_id); }
            this.dialogVisible = false;
            if (this.goods_ids.length <= 0) return this.$message.error('请至少选择一个商品！');
            let sendObj = {
                primary_ids: this.goods_ids,
                reason: this.textarea
            }
            goodsdel(sendObj).then(res => {
                this.textarea = ''
                if (res.errno == 0) {
                    if (res.data.errors.length < 1) {
                        this.$message.success("删除成功");
                        this.addvsupdata = true
                        this.getcountryData(3);
                    } else {
                        let errors_string = res.data.errors.toString();
                        this.$notify({
                            title: '提示',
                            dangerouslyUseHTMLString: true,
                            message: "<div style='height:200px;overflow-y:scroll;'>失败的商品： " + errors_string + "'</div>'",
                            duration: 0,
                            type: 'success'
                        });
                    }
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {
            })
        },
        //时间处理
        TimeDownX(DateStr) {
            let date = DateStr * 1000;
            return date;
        },
        disabledEdit(item) {
            if (item.source === 'pop') return true
            else return false
        },
        //导入
        handleImport() {
            var windowURL = window.URL || window.webkitURL;
            this.file = event.target.files[0];
            this.clearShow = false;
            if (this.file.size > 0) {
                let formdata = new FormData()
                formdata.append('file', this.file)
                goosxlsximport(formdata, this.form.act_id).then(res => {
                    if (res.errno == 0) {
                        this.$notify({
                            title: '提示',
                            dangerouslyUseHTMLString: true,
                            message: "<div style=height:200px;overflow-y:scroll;>共 " + res.data.ok + "条数据，导入失败数据的商品名称是：" + res.data.goodsNameNull + "</div>",
                            duration: 0,
                            type: 'success'
                        });
                        setTimeout(() => {
                            this.getcountryData(2);
                        }, 2000)
                    } else {
                        this.$notify.error({
                            title: '提示',
                            message: res.errmsg,
                            duration: 0
                        });
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
.w280 {
    width: 280px;
}
.w130 {
    width: 130px;
}
.w110 {
    width: 110px;
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
</style>
