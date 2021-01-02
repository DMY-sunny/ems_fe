<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon iconfont el-iconshangpin"></i> {{detailTitle}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-button type="primary" size="medium" plain @click="onSubmit" :loading="loading"> {{detailTitle}}</el-button>

        <div class="container">
            <el-col :span="19" :offset="2">
                <div class="form-box" :span="12" :offset="6">
                    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                        <el-form-item label="满减活动ID">
                            <el-input v-model="form.fullcut_id" :disabled="true" />
                        </el-form-item>
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="form.title" placeholder="请输入标题" />
                        </el-form-item>
                        <el-form-item label="满减额度" prop="cut">
                            满
                            <el-input v-model="form.full" placeholder="请输入满XXX" />
                            减
                            <el-input v-model="form.cut" placeholder="请输入减XXX" />
                        </el-form-item>
                        <el-form-item label="开始时间" prop="start_time">
                            <el-date-picker v-model="form.start_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间" prop="end_time">
                            <el-date-picker v-model="form.end_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-radio-group v-model="form.status">
                                <el-radio :label='0'>未发布</el-radio>
                                <el-radio :label='1'>已发布</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="上传banner图">
                            <el-upload class="upload-demo" :action='action' list-type="picture-card" name="background" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :show-file-list="false">
                                <i class="el-icon-plus"></i>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="当前banner图" prop="logo_url">
                            <img v-if="form.logo_url" :src="cdn06 + form.logo_url" class="logo" width="250">
                        </el-form-item>
                        <el-form-item label="满减产品列表(请拖动排序)" v-if="productList&&productList.length>0">
                            <div class="drag-box">
                                <div class="drag-box-item">
                                    <draggable v-model="productList" :options="dragOptions">
                                        <transition-group tag="div" id="todo" style="clear: both">
                                            <div v-for="(item,index) in productList" class="drag-list" :key="item.goods_id">
                                                <div style="height: 54px;overflow: hidden">{{item.name}}</div>
                                                <div><img :src="item.image_host+item.logo_url" width="100%"></div>
                                                <div>
                                                    原价:{{item.goods_price}}
                                                </div>
                                                <div>价格:
                                                    <el-input v-model="item.price" placeholder="" />
                                                </div>
                                                <div class="mb">限购:
                                                    <el-input v-model="item.buy_limit" placeholder="" />
                                                </div>
                                                <div>
                                                    <el-button type="primary" size="mini" @click="handleEditGoods(item)" :loading="loading">修改</el-button>
                                                    <el-button type="danger" size="mini" @click="handletoDetele(item,index)">删除</el-button>
                                                </div>
                                            </div>
                                        </transition-group>
                                    </draggable>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form ref="addform" :model="addform" :rules="addrules" label-width="110px">
                            <el-form-item label="活动产品" prop="goods_name">
                                <el-autocomplete style="width: 100%;" v-model="addform.goods_name" :fetch-suggestions="querySearch" placeholder="请输入商品名称" :trigger-on-focus="false" @select="handleSelect" class="mb" />
                            </el-form-item>
                            <el-form-item label="会员价格" prop="price">
                                <el-input v-model="addform.price" placeholder="请输入秒杀价格" class="mb" />
                            </el-form-item>
                            <el-form-item label="商品限购数量" prop="buy_limit">
                                <el-input v-model="addform.buy_limit" placeholder="请输入限购数量" />
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="addDomain('addform')" type="success" size="medium" plain class="mb">添加商品</el-button>
                                <span style="color:red ">&nbsp; &nbsp;输入以上条目后,然后点击添加按钮保存商品</span>
                            </el-form-item>
                        </el-form>·
                        <el-button type="primary" size="medium" plain @click="onSubmit(productList,'form')" :loading="loading"> {{detailTitle}}</el-button>
                    </el-form>
                </div>
            </el-col>
        </div>
    </div>
</template>
<script>
import {
    fullcutallId,
    fullcutsinglegoodsAdd,
    seckillspecialgoodsDetele,
    seckillspecialgoodsList,
    fullcutsingleCreate,
    fullcutsingleDetail,
    fullcutsingleUpdate,
    actautocomplete,
    skusearch,
} from '@/api/activity/activity'
import { stockgoodscompleteList } from '@/api/stock/stock'
import draggable from 'vuedraggable'
import { toDate, Appendzero } from '@/utils/index'
import { mapGetters } from 'vuex'
import Sortable from 'sortablejs'
export default {
    name: 'goodsAdd',
    components: {
        draggable
    },
    data: function () {
        const validatelogoUrl = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请上传商品logo图片'))
            }
            callback()
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
        const validateStock = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入库存数量'))
            } else if (value > 100000) {
                callback(new Error('库存数量不能超过100000'))
            } else {
                callback()
            }
        }
        return {
            loading: false,
            dragOptions: {
                animation: 120,
                scroll: true,
                group: 'sortlist',
                ghostClass: 'ghost-style'
            },
            form: {
                title: '',
                logo_url: '',
                status: 0,
                fullcut_id:'',
            },
            detailTitle: '',
            productList: [],
            rules: {
                title: [
                    { required: true, validator: validateName, trigger: 'blur' }
                ],
                cut: [
                    { required: true, message: '请输入满减数', trigger: 'blur' }
                ],
                logo_url: [
                    { required: true, validator: validatelogoUrl, trigger: 'blur' }
                ],
            },
            goods_id: '',
            goods_name: '',
            img_list: [],
            image_host: '',
            action: '',
            addform: {},
            addrules: {
                goods_name: [
                    { required: true, message: '请输入选择商品', trigger: 'blur' }
                ],
                price: [
                    { required: true, message: '请输入秒杀价格', trigger: 'blur' }
                ],
                buy_limit: [
                    { required: true, message: '请输入限购数量', trigger: 'blur' }
                ],
            }
        }
    },
    mounted() {
        this.getBrandData()
        this.getData()
    },
    computed: {
        ...mapGetters(['fullcutId'])
    },
    methods: {
        //        提交数据
        onSubmit(item, formName) {
            let that = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true
                    var item_list = '####'
                    for (var i in item) {
                        item_list =
                            item_list + `=${item[i].goods_id}%${item[i].name}%${item[i].goods_price}%${item[i].buy_limit}%${item[i].price}%${this.form.fullcut_id}`
                    }
                    this.form.goods_id_list = item_list
                    if (this.form.goods_id_list == '####') {
                        this.$message.error('请至少选择一件商品')
                        this.loading = false
                        return
                    }
                    if (this.fullcutId != 1) {
                        fullcutsingleUpdate(this.form).then(res => {
                            if (res.errno == 0) {
                                this.$message.success('满减活动修改成功')
                                setTimeout(function () {
                                    that.$router.replace({
                                        path: '/fullreductionlist'
                                    })
                                }, 500)
                                this.loading = false
                            } else {
                                this.$message.error(res.errmsg)
                                this.loading = false
                            }
                        }).catch(err => {
                            this.loading = false
                        })
                    } else {
                        fullcutsingleCreate(this.form).then(res => {
                            if (res.errno == 0) {
                                this.$message.success('满减活动创建成功')
                                setTimeout(function () {
                                    that.$router.replace({
                                        path: '/fullreductionlist'
                                    })
                                }, 400)
                                this.loading = false
                            } else {
                                this.$message.error(res.errmsg)
                                this.loading = false
                            }
                        }).catch(err => {
                            this.loading = false
                        })
                    }
                } else {
                    this.loading = false
                }
            })
        },
        //        获取 数据
        getData() {
            if (this.fullcutId == 1) {
                this.detailTitle = '新添满减活动商品'
                fullcutallId().then(res => {
                    if (res.errno == 0) {
                        this.form.fullcut_id = res.data.fullcut_id
                        this.action = 'api/upload/image?id=' + res.data.fullcut_id
                        // var date = new Date()
                        // let y = Appendzero(date.getFullYear())
                            // , m = Appendzero(date.getMonth() + 1)
                            // , d = Appendzero(date.getDate())
                            // , hour = Appendzero(date.getHours())
                            // , min = Appendzero(date.getMinutes())
                            // , time = y + '-' + m + '-' + d + ' ' + hour + ':' + min;
                        // this.form.start_time = time
                        // this.form.end_time = time
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {

                })
            } else {
                this.detailTitle = '修改满减活动商品'
                fullcutsingleDetail(this.fullcutId).then(res => {
                    if (res.errno == 0) {
                        this.action = 'api/upload/image?id=' + res.data.fullcut_info.fullcut_id
                        this.form = res.data.fullcut_info
                        this.productList = res.data.list
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {

                })
            }
        },
        //获取商品 list
        getBrandData() {
            seckillspecialgoodsList().then(res => {
                if (res.errno == 0) {
                    this.goods_name = res.data.list
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
        //添加专场产品
        addDomain(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let sendObj = {
                        fullcut_id: this.form.fullcut_id,
                        goods_name: this.addform.goods_name,
                        price: this.addform.price,
                        buy_limit: this.addform.buy_limit,
                        start_time: this.form.start_time,
                        end_time: this.form.end_time,
                        status: this.form.status
                    }, arr = []
                    fullcutsinglegoodsAdd(sendObj).then(res => {
                        if (res.errno == 0) {
                            const option = res.data.list[0].goods_id
                            if (this.productList.length > 0) {
                                for (let i in this.productList) {
                                    arr.push(this.productList[i].goods_id)
                                }
                                if (arr.indexOf(option) > -1) {
                                    this.$message.error('该商品已经添加过了,请换一件吧')
                                } else {
                                    this.productList = [...this.productList, ...res.data.list]
                                }
                            } else {
                                this.productList = [...this.productList, ...res.data.list]
                                arr.push(res.data.list[0].goods_id)
                            }
                            this.addform = {}
                            this.$refs[formName].resetFields()
                        } else {
                            this.$message.error(res.errmsg)
                        }
                    }).catch(err => {

                    })
                }
            })
        },
        //单个秒杀商品修改
        handleEditGoods(row) {
            var pattern = new RegExp("^[0-9]*$")
            if (!(row.price).match(pattern)) {
                this.$message.error('商品价格为数字')
                return
            } else if (!(row.buy_limit).match(pattern)) {
                this.$message.error('限购数量为数字')
                return
            }
            this.$message.success('该商品修改成功')
        },
        //删除专场产品
        handletoDetele(item, index) {
            this.productList.splice(index, 1)
        },
        handleAvatarSuccess(res, file, index) { //图片上传成功回调
            this.form.image_host = res.data.image_host,
                this.form.logo_url = res.data.image_url
        },
        beforeAvatarUpload(file) {
            const isJPG = (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/bmp');
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG/PNG/BMP 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        //商品自筛选
        querySearch(queryString, cb) {
            actautocomplete(queryString).then(res => {
                if (res.errno == 0) {
                    for (var i = 0; i < res.data.list.length; i++) {
                        res.data.list[i].value = res.data.list[i].name;
                    }
                    var restaurants = res.data.list
                    var results = queryString ? restaurants : restaurants;
                    cb(results);
                } else {
                    this.$message.error(res.errmsg)
                }
            })
        },
        createFilter(queryString) { // 品牌与已有品牌对应判断
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        handleSelect(item) { //选中品牌名称
            this.form.brand_name = item.value
            this.goods_id = item.goods_id
            let that = this
            skusearch({ goods_name: item.value, type: this.form.type }).then(res => {//获取选中场馆商品的信息
                if (res.errno == 0) {
                    that.form.sku_id = res.data.skuInfo.sku_id
                    that.form.sku_name = res.data.skuInfo.sku_name
                    that.form.price = res.data.skuInfo.price
                    that.form.memberprice = res.data.skuInfo.origin_price
                } else {
                    that.$message.error(res.errmsg)
                }
            }).catch(err => {
            })
        },
    }
}
</script>
<style scoped>
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
    width: 310px;
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
</style>
