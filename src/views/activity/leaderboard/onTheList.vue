<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon iconfont el-iconshangpin"></i> 排行榜商品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-col :span="20" :offset="2">
                <div class="form-box">
                    <el-form ref="commodity_form" :rules="rules" :model="commodity_form" label-width="80px">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-autocomplete style="width: 100%;margin-bottom: 10px" v-model="commodity_form.goods_name" :fetch-suggestions="querySearch" placeholder="请输入商品名称" :trigger-on-focus="false" @select="handleSelect">
                                <template slot="append">
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                        <el-form-item label="sku名字">
                            <el-input v-model="commodity_form.sku_name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="skuID">
                            <el-input v-model="commodity_form.sku_id" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="商品ID">
                            <el-input v-model="commodity_form.goods_id" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="导航分类" prop="nav_tag">
                            <el-radio-group v-model="commodity_form.nav_tag">
                                <el-radio v-for="item in form.nav_tags" :label="item.tag_id" :key="item.tag_id">{{item.tag}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="推荐文案" prop="desc">
                            <el-input v-model="commodity_form.desc" maxlength="20" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="handle('commodity_form')" type="success" size="medium" plain class="">添加</el-button>
                            <span style="color:red ">&nbsp; &nbsp;选择以上条目后,然后点击添加按钮保存商品</span>
                        </el-form-item>
                        <div>
                            <el-card class="box-card mb">
                                <div slot="header" class="clearfix"><span>排行榜商品{{type==='online'?'上榜':'下榜'}}列表</span>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <el-button @click="cutover" icon="el-icon-thumb" size="mini" type="info" plain>切换列表</el-button>
                                    <el-form inline @submit.native.prevent>
                                        <el-form-item label="导航分类">
                                            <el-select v-model="search_navtag" class="w110">
                                                <el-option v-for="item in form.nav_tags" :key="item.tag_id" :label="item.tag" :value="item.tag_id" />
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" icon="el-icon-search" @click="initData(1)" size="mini" :loading="loading" plain>搜索</el-button>
                                            <el-button type="warning" icon="el-icon-refresh-right" :loading="loading" @click="initData(2)" size="mini" plain>重置</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <el-table v-loading="false" element-loading-text="拼命加载中" align="center" :data="tableData" border class="table" ref="multipleTable">
                                    <el-table-column fixed="left" label="商品排序" v-if="type=='online'" key="index" type="index" align="center" width="80">
                                    </el-table-column>
                                    <el-table-column prop="goods_name" label="商品名称" width="200">
                                        <template slot-scope="scope">
                                            {{scope.row.goods_name}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="type!=='online'" key="sort1" prop="sort" label="原始排序">
                                        <template slot-scope="scope">
                                            <el-tag type="success">{{scope.row.sort}}</el-tag>
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="type==='online'" key="goods_id" prop="goods_id" label="商品id" />
                                    <el-table-column v-if="type==='online'" key="sku_name" prop="sku_name" label="SKU名" width="200" />
                                    <el-table-column v-if="type==='online'" key="sort" prop="sort" label="调整排序" width="160">
                                        <template slot-scope="scope">
                                            <el-row>
                                                <el-col :span="14">
                                                    <el-input type="number" v-model="scope.row.sort"></el-input>
                                                </el-col>
                                                <el-col :span="2">
                                                    &nbsp;
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-button @click="sortClick(scope.row)" type="primary" icon="el-icon-s-unfold" plain></el-button>
                                                </el-col>
                                            </el-row>
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="type==='online'" key="desc" prop="desc" label="推荐文案" />
                                    <el-table-column v-if="type==='online'" key="status" prop="status" label="商品状态" />
                                    <el-table-column v-if="type==='online'" key="is_top" prop="is_top" align="center" label="是否置顶">
                                        <template slot-scope="scope">
                                            <el-tag type="success">{{scope.row.is_top=='1'?'否':'是'}}</el-tag>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" align="center" width="180" fixed="right">
                                        <template slot-scope="scope">
                                            <div v-if="type==='online'" style="margin-bottom: 10px">
                                                <el-button :type="scope.row.is_top=='1'?'primary':'info'" size="mini" @click="handleTop(scope.row),addvsupdata = false" plain>{{scope.row.is_top=='1'?'置顶':'撤销'}}</el-button>
                                                <el-button type="danger" size="mini" @click="handleDown(scope.row)" plain>下榜</el-button>
                                            </div>
                                            <div v-else style="margin-bottom: 10px">
                                                <el-button type="warning" size="mini" @click="handleOn(scope.row)" plain>上榜</el-button>
                                                <el-button type="danger" size="mini" @click="handleDelete(scope.row)" plain>删除</el-button>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="pagination">
                                    <pagination v-show="total>0" :total="total" :page.sync="cur_page" :pagesize.sync="page_size" @pagination="initData" />
                                </div>
                            </el-card>
                        </div>
                    </el-form>
                </div>
            </el-col>
        </div>
    </div>
</template>
<script>
const commodityForm = {
    id: '',
    desc: '',//商品推荐文案
    sku_name: '',
    goods_name: '',
    nav_tag: '',
    sku_id: '',
    goods_id: '',
};
import {
    actautocomplete,
    skusearch,
} from '@/api/activity/activity'
import {
    rankingGoods,
    goodsList,
    goodsDelete,
    goodsTop,
    goodsOnline,
    goodsOffline,
    goodsSort,
    goodsTopCancel,
} from '@/api/activity/leaderboard/leaderboard'
// import data from './data.js';
import Pagination from "@/components/Pagination"
import { mapGetters } from 'vuex'
export default {
    name: 'onTheList',
    data() {
        return {
            tableData: [],
            total: 0,
            cur_page: 1,
            page_size: 50,
            loading: false,
            search_navtag: '',//搜索标签
            type: 'online',
            // 商品保存信息
            commodity_form: { ...commodityForm },
            good_list: [],
            form: {},
            rules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                nav_tag: [
                    { required: true, message: '请选择导航分类', trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '请输入推荐文案', trigger: 'blur' },
                ]
            }
        }
    },
    computed: {
        ...mapGetters(['leaderId']),
    },
    props: ['formData', 'nav_tags'],
    components: { Pagination },
    watch: {
        formData: {
            handler(val) {
                this.form = val;
                if (val.nav_tags.length > 0) {
                    this.initData();
                }
            },
            deep: true,
            immediate: true,
        },
    },
    created() {
        // this.initData();
    },
    methods: {

        // 商品上榜
        handleOn(row) {
            this.$confirm("确认上榜?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let sendObj = {
                    ids: [row.id],
                }
                goodsOnline(sendObj).then(res => {
                    if (res.errno == 0) {
                        this.$message({
                            message: "上榜成功!",
                            type: "success"
                        });
                        this.initData();
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {
                })
            })
        },
        // 商品下榜
        handleDown(row) {
            this.$confirm("确认下榜?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let sendObj = {
                    ids: [row.id],
                }
                goodsOffline(sendObj).then(res => {
                    if (res.errno == 0) {
                        this.$message({
                            message: "下榜成功!",
                            type: "success"
                        });
                        this.initData();
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {
                })
            })
        },
        //添加商品
        handle(commodity_form) {
            // if (!addvsupdata)
            //     this.commodity_form = Object.assign({}, row);
            let valids = true;
            this.$refs[commodity_form].validate((valid) => {
                if (valid) {
                    valids = false;
                } else {
                    valids = true;
                    return false;
                }
            });
            if (valids) return;
            this.commodity_form.ranking_id = this.form.id;
            rankingGoods(this.commodity_form).then(res => {
                if (res.errno == 0) {
                    this.$message({
                        message: "操作成功!",
                        type: "success"
                    });
                    this.commodity_form = { ...commodityForm };
                    this.initData();
                    return;
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {
                // alert('请刷新页面')
            })
        },
        //input 触发事件
        querySearch(queryString, cb) {
            actautocomplete(queryString).then(res => {
                if (res.errno == 0) {
                    for (var i = 0; i < res.data.list.length; i++) {
                        res.data.list[i].value = res.data.list[i].name;
                    }
                    var restaurants = res.data.list;
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
            this.commodity_form.goods_name = item.value
            this.commodity_form.goods_id = item.goods_id
            this.commodity_form.desc = item.short_name
            let that = this
            skusearch({ goods_name: item.value }).then(res => {//获取选中场馆商品的信息
                if (res.errno == 0) {
                    that.commodity_form.sku_id = res.data.skuInfo.sku_id
                    that.commodity_form.sku_name = res.data.skuInfo.sku_name
                } else {
                    that.$message.error(res.errmsg)
                }
            }).catch(err => {
            })
        },
        //删除活动商品
        handleDelete(row) {
            this.$confirm("确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let sendObj = {
                        ids: [row.id],
                    }
                    goodsDelete(sendObj).then(res => {
                        if (res.errno == 0) {
                            this.$message({
                                message: "删除成功!",
                                type: "success"
                            });
                            this.initData();
                        } else {
                            this.$message.error(res.errmsg)
                        }
                    }).catch(err => {
                    })
                })
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
        // 切换排行榜按钮
        cutover() {
            if (this.type === 'online')
                this.type = 'offline';
            else
                this.type = 'online';
            this.initData();
        },
        //置顶
        handleTop(row) {
            this.$confirm("确认执行此操作？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let sendObj = {
                    ids: [row.id],
                }
                switch (row.is_top) {
                    case '1':
                        // 置顶
                        goodsTop(sendObj).then(res => {
                            if (res.errno == 0) {
                                this.$message({
                                    message: "置顶成功!",
                                    type: "success"
                                });
                                this.initData();
                            } else {
                                this.$message.error(res.errmsg)
                            }
                        }).catch(err => {
                        })
                        break;
                    case '2':
                        // 取消置顶
                        goodsTopCancel(sendObj).then(res => {
                            if (res.errno == 0) {
                                this.$message({
                                    message: "取消置顶成功!",
                                    type: "success"
                                });
                                this.initData();
                            } else {
                                this.$message.error(res.errmsg)
                            }
                        }).catch(err => {
                        })
                        break;
                }
            })
        },
        // 对象数组排序处理
        compare(key) {
            return function (obj1, obj2) {
                var val1 = obj1[key];
                var val2 = obj2[key];
                if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                    val1 = Number(val1);
                    val2 = Number(val2);
                }
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        },
        //排序
        sortClick(row) {
            this.good_list.forEach(res => {
                res.sort = res.id === row.id ? row.sort : res.sort;
            })
            this.good_list.sort(this.compare('sort'));
            this.$confirm("确认更新排序?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let sendObj = {
                    goods: this.good_list,
                }
                goodsSort(sendObj).then(res => {
                    if (res.errno == 0) {
                        this.$message({
                            message: "操作成功!",
                            type: "success"
                        });
                        this.sort_input = '';
                        this.initData();
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {
                })
            })
        },
        initData(item) {
            this.search_navtag = item === 1 ? this.search_navtag : this.form.nav_tags[0].tag_id
            let sendObj = {
                type: this.type,//列表类型: online 上榜; offline 下榜;
                ranking_id: this.leaderId,
                nav_tag: item === 1 ? this.search_navtag : this.form.nav_tags[0].tag_id,
                page: this.cur_page,
                page_size: this.page_size,
            }
            if (!this.form.nav_tags[0].tag_id) return;
            this.good_list = [];
            goodsList(sendObj).then(res => {
                if (res.errno == 0) {
                    this.total = Number(res.data.total)
                    this.tableData = res.data.list
                    for (let i = 0; i < res.data.list.length + 1; i++) {
                        this.good_list.push({ id: res.data.list[i].id, sort: res.data.list[i].sort })
                    }
                } else {
                    this.$message.error(res.errmsg)
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
            })
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
.w130 {
    width: 130px;
}
.w110 {
    width: 110px;
}
.div_inline {
    display: inline;
}
</style>
