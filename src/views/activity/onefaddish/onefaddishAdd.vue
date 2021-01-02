<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon iconfont el-iconshangpin"></i> {{addvsupdata?'新增':'修改'}}一元爆款活动</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <el-col :span="20" :offset="2">
                <div class="form-box">
                    <el-form ref="form" :rules="rules_form" :model="form" label-width="80px">
                        <el-form-item label="活动名称" prop="title">
                            <el-input v-model="form.title" placeholder="请输入活动名称" />
                        </el-form-item>
                        <el-form-item label="开始时间" prop="start_time">
                            <el-date-picker class="all_width" v-model="form.start_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间" prop="end_time">
                            <el-date-picker class="all_width" v-model="form.end_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary"  :loading="loading" plain @click="onSubmit('form')">确认{{addvsupdata?'新增':'修改'}}</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </div>
        <onefaddishReverse :formData="form" v-if="!addvsupdata"> </onefaddishReverse>
    </div>
</template>

<script>
import { specialAdd,specialUpdate,specialDetail } from '@/api/activity/onefaddish/onefaddish'
import onefaddishReverse from './onefaddishReverse.vue'
import { mapGetters } from 'vuex'
export default {
    name:'onefaddishAdd',
    components: {
        onefaddishReverse,
    },
    data() {
        return {
            loading: false,
            addvsupdata:false,
            rules_form: {
                title: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                ],
                start_time: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ],
                end_time: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ],

            },
            form: {
                id: 0,
                start_time: "",
                end_time: "",
                title: ""
            },
            isUp:false  //是否正在请求中
        }
    },
    computed: {
        ...mapGetters(['onefaddishId']),
        ...mapGetters(['addOnefaddish'])
    },
    mounted() {
        this.addvsupdata = this.addOnefaddish
        if(!this.addvsupdata) this.getDetail()
        
    },
    methods: {
        getDetail() {
            console.log(this.onefaddishId,this.form.id,this.addvsupdata,'1111')
            if (!this.addvsupdata && this.onefaddishId !== 0) this.form.id = this.onefaddishId;
            specialDetail(this.form.id).then(res => {
                if (res.errno == 0) {
                    this.form = Object.assign(this.form, res.data.act_info);
                    this.$store.commit('SET_ONEFADDISH_ID', this.form.id)
                } else {
                    this.$message(res.errmsg)
                    this.loading = false
                }
            }).catch(err => {
                this.loading = false
            })
        },
        onSubmit(form) {
            if(this.isUp) return
            if(!this.form.title) return this.$message.error('活动名称不能为空');
            if(!this.form.start_time) return this.$message.error('开始时间不能为空');
            if(!this.form.end_time) return this.$message.error('结束时间不能为空');
            let obj={
                title:this.form.title,
                start_time:this.form.start_time,
                end_time:this.form.end_time
            }
            if(!this.addvsupdata){  //修改活动
                obj.act_id = this.form.id
                this.isUp=true
                specialUpdate(obj).then(res => {
                    if (res.errno == 0) {
                        this.getDetail()
                        setTimeout(time => {
                            this.loading = false
                            this.$message.success('保存成功！')
                            this.addvsupdata = false
                            this.isUp=false
                        }, 3000)
                    } else {
                        this.$message(res.errmsg)
                        this.loading = false
                        this.isUp=false
                    }
                }).catch(err => {
                    this.loading = false
                })
            }else {  //新增活动
                this.isUp=true
                specialAdd(obj).then(res => {
                    if (res.errno == 0) {
                        this.form.id = res.data.act_id
                        this.getDetail()
                        setTimeout(time => {
                            this.loading = false;
                            this.$message.success('保存成功！')
                            this.addvsupdata = false
                            this.isUp=false
                        }, 3000)
                    } else {
                        this.$message(res.errmsg)
                        this.loading = false
                        this.isUp=false
                    }
                }).catch(err => {
                    this.loading = false
                })
            }
        }
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

</style>