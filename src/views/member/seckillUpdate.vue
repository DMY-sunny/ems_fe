<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    {{is_edit ? '修改' : '新增'}}权益秒杀
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-col :span="20" :offset="2">
                <div class="form-box">
                    <el-form ref="form" :model="form" :rules="rules_form" label-width="110px">
                        <el-form-item label="秒杀ID">
                            <el-input v-model="form.act_id" disabled />
                        </el-form-item>
                        <el-form-item label="专场名称" prop="title">
                            <el-input v-model="form.title" placeholder="请输入活动名称" />
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-radio-group v-model="form.status">
                                <el-radio :label='0'>未发布</el-radio>
                                <el-radio :label='1'>已发布</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="开始时间" prop="start_time">
                            <el-date-picker class="all_width" v-model="form.start_time" type="datetime" placeholder="选择开始时间" :disabled="disabled">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间" prop="end_time">
                            <el-date-picker class="all_width" v-model="form.end_time" type="datetime" placeholder="选择结束时间" :disabled="disabled">
                            </el-date-picker>
                        </el-form-item>
                        <el-button type="primary" @click="onSubmit(form)" :loading="loading">确认{{is_edit ? '修改' : '创建新'}}活动</el-button>
                    </el-form>
                </div>
            </el-col>
        </div>
        <div v-if="is_edit && goods_list.length">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>
                        活动商品
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-table v-loading="loading" element-loading-text="拼命加载中" align="center" :data="goods_list" border class="table" ref="multipleTable">
                <el-table-column prop="id" label="序号" align="center"></el-table-column>
                <el-table-column label="权益ID" align="center">
                    <template slot-scope="scope">
                        <p :class="scope.row.vip_act_price < scope.row.price ? 'red' : ''">{{scope.row.goods_id}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="权益标题" align="center" width="260">
                    <template slot-scope="scope">
                        <p :class="scope.row.vip_act_price < scope.row.price ? 'red' : ''">{{scope.row.goods_name}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="权益状态" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.row.status ? '上架' : '已下架'}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="秒杀活动价" align="center">
                    <template slot-scope="scope">
                        <p :class="scope.row.vip_act_price < scope.row.price ? 'red' : ''">{{scope.row.vip_act_price}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="成本价" align="center">
                    <template slot-scope="scope">
                        <p :class="scope.row.vip_act_price < scope.row.price ? 'red' : ''">{{scope.row.price}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="stock" label="活动名额" align="center"></el-table-column>
                <el-table-column prop="use_stock" label="默认消耗" align="center"></el-table-column>
                <el-table-column prop="limit_count" label="限购数量" align="center"></el-table-column>
                <el-table-column prop="status" label="是否新人享" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.row.is_new ? '是' : '否'}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="120" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)" plain :disabled="!scope.row.status">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { format } from "@/utils/utils"
export default {
    name: "seckillupdate",
    data() {
        return {
            rules_form: {
                title: [
                    { required: true, message: '请输入专场名称', trigger: 'blur' },
                ],
                start_time: [
                    { required: true, message: '请选择开始时间', trigger: 'change' }
                ],
                end_time: [
                    { required: true, message: '请选择结束时间', trigger: 'change' }
                ],

            },
            form: {
                act_id: '',
                title: '',
                status: 0,
                start_time: '',
                end_time: ''
            },
            disabled: false,
            goods_list: [], // 秒杀商品列表
            edit_id: '',
            loading: false,
            is_edit: false // 是否修改活动
        }
    },
    created() {
        if (this.$route.query.id) {
            this.is_edit = true
            this.edit_id = this.$route.query.id
            this.getDetail()
        } else {
            this.getId()
        }
    },
    components: {
    },
    methods: {
        // 获取详情
        getDetail() {
            this.$httpAxios({
                methods: 'get',
                url: 'api/seckill/detail',
                data: {
                    id: this.edit_id
                }
            }).then(res => {
                let form_data = res.data.data
                this.form = {
                    act_id: form_data.act_id,
                    title: form_data.title,
                    status: form_data.status,
                    start_time: form_data.start_time,
                    end_time: form_data.end_time,
                    id: form_data.id
                }
                this.goods_list = form_data.goods_list
                this.disabled = form_data.time_status === 1
            })
        },
        // 获取id
        getId() {
            this.$httpAxios({
                methods: 'get',
                url: 'api/act/main/create'
            }).then(res => {
                this.form.act_id = res.data.data.act_id
            })
        },
        // 提交
        onSubmit(form) {
            if(!this.form.title) return this.$message.error('专场名称不能为空')
            if(!this.form.start_time) return this.$message.error('开始时间不能为空')
            if(!this.form.end_time) return this.$message.error('结束时间不能为空')
            this.form.start_time = format(this.form.start_time, 'yyyy-MM-dd HH:mm:ss')
            this.form.end_time = format(this.form.end_time, 'yyyy-MM-dd HH:mm:ss')
            this.$httpAxios({
                methods: 'post',
                url: `api/seckill/${this.is_edit ? 'update' : 'add'}`,
                data: this.form
            }).then(res => {
                if (res.data.errno == 0) {
                    this.$message.success('操作成功')
                    this.$router.go(-1)
                } else {
                    this.$message.error(res.data.errmsg)
                }
            })
        },
        // 删除商品
        handleDelete(id) {
            this.$confirm('此操作将下架该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$httpAxios({
                    methods: 'post',
                    url: 'api/seckill/goods/delete',
                    data: {
                        id: id
                    }
                }).then(res => {
                    if (res.data.errno == 0) {
                        this.$message.success('操作成功')
                        this.getDetail()
                    } else {
                        this.$message.error(res.data.errmsg)
                    }
                })
            }).catch(() => {
            })
        }
    }
};
</script>

<style scoped>
.red {
    color: red;
}
</style>
