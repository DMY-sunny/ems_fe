<template>
    <div class="couponone">
        <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="开始时间" prop="statrt_time">
                <el-date-picker v-model="ruleForm.time.statrt_time" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="end_time">
                <el-date-picker v-model="ruleForm.time.end_time" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="【优惠券配置】" required>
                <el-button type="primary" round @click="addCode">新增优惠券code</el-button>
                <el-form-item :label="'优惠券code'+(index+1)" v-for="(item,index) in ruleForm.coupon" :key="index">
                    <el-input value="不可操作" disabled="disabled" v-if="index < 1"></el-input>
                    <el-button type="primary" round @click="deleteCode(index)" v-else>删除优惠券code</el-button>
                    <el-form-item label="优惠券code" required>
                        <el-input v-model="item.coupon_code"></el-input>
                    </el-form-item>
                    <el-form-item label="优惠券商品id">
                        <el-input v-model="item.goods_id"></el-input>
                    </el-form-item>
                    <el-form-item label="活动是否可用">
                        <el-radio-group v-model="item.is_sale_share">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form-item>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>

import { singleReceive } from '@/api/coupon.js'
export default {
    data() {
        return {
            ruleForm: {
                time: {
                    statrt_time: "",
                    end_time: ""
                },
                coupon: [
                    {
                        coupon_code: "",
                        goods_id: "",
                        is_sale_share: "0"
                    }
                ]
            }
        }
    },
    created() {
        const loading = this.$loading({//loading 打开
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        singleReceive().then(res => {
            this.ruleForm = res.data
            loading.close();//关闭loading
        })
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.ruleForm.time.end_time = this.format(this.ruleForm.time.end_time, 'yyyy-MM-dd HH:mm:ss')
                    this.ruleForm.time.statrt_time = this.format(this.ruleForm.time.statrt_time, 'yyyy-MM-dd HH:mm:ss')
                    singleReceive(this.ruleForm).then(res => {
                        if (res.errno === 0) {
                            this.$notify({
                                title: '成功',
                                message: res.errmsg,
                                type: 'success'
                            })
                            this.$router.go(-1)
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: res.errmsg
                            })
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        addCode() {
            this.ruleForm.coupon.push({
                coupon_code: "",
                goods_id: "",
                is_sale_share: "0"
            })
        },
        deleteCode(index) {
            this.ruleForm.coupon.splice(index, 1)
        },
        format(time, format) {
            var t = new Date(time);
            var tf = function (i) { return (i < 10 ? '0' : '') + i };
            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
                switch (a) {
                    case 'yyyy':
                        return tf(t.getFullYear());
                        break;
                    case 'MM':
                        return tf(t.getMonth() + 1);
                        break;
                    case 'mm':
                        return tf(t.getMinutes());
                        break;
                    case 'dd':
                        return tf(t.getDate());
                        break;
                    case 'HH':
                        return tf(t.getHours());
                        break;
                    case 'ss':
                        return tf(t.getSeconds());
                        break;
                }
            })
        }
    }
}
</script>
<style>
</style>