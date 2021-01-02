<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-time"></i> 采购提报</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form inline :model="reportForm" ref="reportForm" @submit.native.prevent>
                    <el-form-item label="活动ID" prop="act_id">
                        <el-input @keyup.enter.native="initData(),reportForm.page=1" v-model="reportForm.act_id" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="活动类型" prop="act_type">
                        <el-select v-model="reportForm.act_type" placeholder="请选择" class="w110">
                            <el-option v-for="item in configs.act_type" :key="item.value" :label="item.key" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="initData(),reportForm.page=1" size="mini" :loading="loading" plain>搜索</el-button>
                        <el-button type="warning" icon="el-icon-refresh-right" @click="reset('reportForm')" size="mini" plain>重置</el-button>
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="launchTrue({},'add')" plain>新增</el-button>
                    </el-form-item>
                </el-form>
            </el-form>
            <div>
                <el-table :data="tableData" border v-loading="loading" element-loading-text="拼命加载中" ref="multipleTable">
                    <el-table-column label="序号" type="index" width="50" align="center" fixed="left" />
                    <el-table-column label="操作" align="center" width="220">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" v-if="form.type !== 24 && form.type !== 25" icon="el-icon-edit" @click="launchTrue(scope.row,'creat')" plain>修改</el-button>
                            <el-button size="mini" type="warning" v-if="form.type !== 24 && form.type !== 25" icon="el-icon-view" @click="revisionsBut(scope.row)" plain>查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="post_id" label="提报单ID" align="center" width="130" />
                    <el-table-column prop="act_id" label="活动ID" align="center" width="130" />
                    <el-table-column prop="act_name" label="活动名称" align="center" />
                    <el-table-column prop="act_type" label="活动类型" align="center" width="120">
                        <template scope="scope">
                            <span v-for="item in configs.act_type" :key="item.value">
                                <el-tag type="success" v-if="item.value==scope.row.act_type">{{item.key}}</el-tag>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dead_line" label="提报截止时间" align="center" width="150">
                        <template slot-scope="scope">
                            <div>{{scope.row.dead_line}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_ts" label="提报创建时间" align="center" width="150">
                        <template slot-scope="scope">
                            <div>{{scope.row.create_ts}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operator" label="创建人" align="center" width="100" />
                </el-table>
                <div class="pagination">
                    <pagination v-show="total>0" :total="total" :page.sync="reportForm.page" :pagesize.sync="reportForm.page_size" @pagination="initData" />
                </div>
            </div>
        </div>
        <el-dialog title="采购提报单" :visible.sync="dialogVisible" width="80%" center>
            <el-form v-loading='loading' ref="purchaseForm" :model="purchaseForm" label-width="120px" label-position="right">
                <el-form-item label="活动id" prop="act_id">
                    <el-input v-model="purchaseForm.act_id" :disabled="is_pop"></el-input>
                </el-form-item>
                <el-form-item label="活动名称" prop="act_name">
                    <el-input v-model="purchaseForm.act_name"></el-input>
                </el-form-item>
                <el-form-item label="活动类型" prop="act_type">
                    <el-select v-model="purchaseForm.act_type" placeholder="请选择" class="w110">
                        <el-option v-for="item in configs.act_type" :key="item.value" :label="item.key" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="折扣范围" prop="from_discount">
                    <el-input v-model="purchaseForm.from_discount" type="number" placeholder="请输入数字" class="w130" />
                    到
                    <el-input v-model="purchaseForm.to_discount" type="number" placeholder="请输入数字" class="w130" />
                </el-form-item>
                <el-form-item label="需要的商品数量" prop="goods_num">
                    <el-input v-model="purchaseForm.goods_num"></el-input>
                </el-form-item>
                <el-form-item label="可供库存" prop="stock_symbol">
                    <el-select v-model="purchaseForm.stock_symbol" placeholder="请选择">
                        <el-option :value="item.value" :label="item.key" v-for="(item,index) in configs.stock_symbols" :key="index"></el-option>
                    </el-select>
                    <el-input v-model="purchaseForm.stock_num" type="number" placeholder="请输入数字" class="w130" />
                </el-form-item>
                <el-form-item label="可供成本" prop="cost_from">
                    <el-input v-model="purchaseForm.cost_from" type="number" placeholder="请输入数字" class="w130" />
                    <el-select v-model="purchaseForm.cost_symbol_from" placeholder="请选择">
                        <el-option :value="item.value" :label="item.key" v-for="(item,index) in configs.symbols" :key="index"></el-option>
                    </el-select>
                    到
                    <el-select v-model="purchaseForm.cost_symbol_to" placeholder="请选择">
                        <el-option :value="item.value" :label="item.key" v-for="(item,index) in configs.symbols" :key="index"></el-option>
                    </el-select>
                    <el-input v-model="purchaseForm.cost_to" type="number" placeholder="请输入数字" class="w130" />
                </el-form-item>
                <el-form-item label="商城30日销量" prop="sales_symbol_to">
                    <el-select v-model="purchaseForm.sales_symbol_to" placeholder="请选择">
                        <el-option :value="item.value" :label="item.key" v-for="(item,index) in configs.symbols" :key="index"></el-option>
                    </el-select>
                    <el-input v-model="purchaseForm.sales_to" type="number" placeholder="请输入数字" class="w130" />
                </el-form-item>
                <el-form-item label="商品分类" prop="defaultProps">
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
                    <el-select v-model="purchaseForm.pop_merchants" multiple filterable allow-create default-first-option remote :remote-method="remoteMethod" placeholder="请选择" class="input_width">
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
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button :loading="loading" type="success" @click="launch">发 起</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="采购提报规则修改纪录" :visible.sync="dialogTableVisible" width="80%" center>
            <el-table v-loading='loading' :data="dialogTable">
                <el-table-column label="商品分类" width="130" type="expand">
                    <template slot-scope="props">
                        <el-input type="textarea" autosize v-model="props.row.category" disabled></el-input>
                    </template>
                </el-table-column>
                <el-table-column property="date" label="日期" />
                <el-table-column property="operator" label="编辑人" />
                <el-table-column property="stock" label="可供库存" />
                <el-table-column property="cost" label="可供成本" />
                <el-table-column property="sales" label="商城30天销量" />
                <el-table-column property="is_pop" label="是否允许提报POP商品" />
                <el-table-column property="delivery_place" label="发货仓" />
                <el-table-column property="remark" label="备注" />
            </el-table>
            <el-button @click="dialogTableVisible = false">关闭</el-button>
        </el-dialog>
    </div>
</template>
<script>
const purchase_Form = {
    is_wms: true,
    pop_merchants: [],
    from_discount: 0,
    to_discount: 0,
    isIndeterminate: false,//全选
    isdeliveryAll: false,//全选 发货仓
    act_id: "",
    act_name: "", // 活动名称
    act_type: 1, // 活动类型
    goods_num: '', // 商品数量
    stock_symbol: "",
    stock_num: '',
    cost_symbol_from: "",
    cost_from: "",
    cost_symbol_to: "",
    cost_to: "",
    sales_symbol_from: "",
    sales_from: '',
    sales_symbol_to: "",
    sales_to: '',
    category4: [], // 商品主分类
    category5: [],
    category: {
        category1: [], // 商品主分类
        category2: [], // 商品主分类
        category3: [], // 商品主分类
    },
    delivery_place: [],
    dead_line: '',// 截止时间
    is_pop: false,// 是否需要POP商品
    remark: '',//备注
}
import {
    purchaseList,
    purchaseConfigs,
    revisions,
    purchaseGet,
    categoriesTree,
    purchasePost,
    merchants
} from '@/api/activity/activity'
import data from "../data.js"
import Pagination from "@/components/Pagination"
export default {
    name: 'purchasingReportList',
    components: { Pagination },
    mixins: [data],
    created() {
        categoriesTree().then(res => {
            if (res.errno == 0) {
                this.menuTreeData = res.data;
            } else {
                this.$message(res.errmsg)
            }
        })
        this.pConfigs();
        this.initData();
    },
    methods: {
        pConfigs() {
            purchaseConfigs().then(res => {
                if (res.errno == 0) {
                    this.delivery_place = res.data.delivery_place;
                    this.configs = res.data;
                } else {
                    this.$message(res.errmsg)
                }
            }).catch(err => { });
        },
        // 吊起采购提报表单 0r 重置
        launchTrue(purchaseForm, or) {
            if (or === 'add') {
                this.is_pop = false;
                this.dialogVisible = true;
                this.menuId = [];
                let that = this;
                that.$nextTick(() => {
                    that.$refs.trees.setCheckedKeys([]);//清空tree勾选
                })
                this.pConfigs();//重置 this.delivery_place ，因为下面添加了 isdisabled: true 属性
                this.purchaseForm = { ...purchase_Form };
            } else {
                this.loading = true;
                purchaseGet(purchaseForm.act_id).then(res => {
                    if (res.errno == 0) {
                        this.loading = false;
                        this.dialogVisible = true
                        if (res.data.id) {
                            this.purchaseForm = Object.assign
                                ({}, this.purchaseForm, res.data);

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
            }
        },
        disabledVplace(item) {
            if (this.purchaseForm.delivery_place)
                return this.purchaseForm.delivery_place.some(ele => ele === item.value && item.isdisabled)
        },
        //发起活动提报
        launch(row) {
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
            purchasePost(this.purchaseForm).then(res => {
                if (res.errno == 0) {
                    this.purchaseForm.dead_line = this.TimeDownX(this.purchaseForm.dead_line);
                    this.dialogVisible = false
                    this.loading = false
                    this.$message.success('提交成功');
                    this.initData();
                } else {
                    this.purchaseForm.dead_line = this.TimeDownX(this.purchaseForm.dead_line);
                    this.$message(res.errmsg)
                    this.loading = false;
                }
            }).catch(err => { });
        },
        deliveryAll(val) {
            let categorData = [];
            this.delivery_place.map(ele => {
                categorData.push(ele.value)
            });
            this.purchaseForm.delivery_place = val ? categorData : localStorage.getItem('form_delivery_place') ? JSON.parse(localStorage.getItem('form_delivery_place')) : [];
            this.purchaseForm.isdeliveryAll = false;
        },
        handleCheckChange() {
            return this.$refs.trees.getCheckedNodes();
        },
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
        // 采购提报记录查看
        revisionsBut(row) {
            this.loading = true;
            let sendObj = {
                act_id: row.act_id,
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
        reset(reportForm) {
            this.$refs[reportForm].resetFields();
            this.initData();
        },
        initData() {
            this.loading = true
            purchaseList(this.reportForm).then(res => {
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
        //时间处理
        TimeDownX(DateStr) {
            let date = DateStr * 1000;
            return date;
        },
        // 下拉框远程请求
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
    }
}
</script>

<style scoped>
.mb {
    margin-bottom: 10px;
}
.input_width {
    width: 500px;
}
</style>
