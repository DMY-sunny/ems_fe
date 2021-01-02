<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="标题" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="description值" prop="description">
                <el-input v-model="ruleForm.description"></el-input>
            </el-form-item>
            <el-form-item label="h5链接" prop="redirect_url_h5">
                <el-input v-model.trim="ruleForm.redirect_url_h5"></el-input>
            </el-form-item>
            <el-form-item label="小程序链接" prop="redirect_url">
                <el-input v-model.trim="ruleForm.redirect_url"></el-input>
            </el-form-item>
            <el-form-item label="开始时间" required prop="start_time">
                <el-date-picker v-model="ruleForm.start_time" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" required prop="end_time">
                <el-date-picker v-model="ruleForm.end_time" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="权重">
                <el-input type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model.number="ruleForm.toast_sort"></el-input>
            </el-form-item>
            <el-form-item label="banner图片">
                <el-upload class="uploads-demo" action="api/upload/image" name="background" list-type="picture-card" :on-success="handleAvatarSuccess" :show-file-list="false">
                    <img v-if="ruleForm.image_url" :src="cdn06 + ruleForm.image_url" />
                    <i class="el-icon-plus" v-else></i>
                    <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
                </el-upload>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即{{ruleForm.toast_id?"修改":"创建"}}</el-button>

            </el-form-item>
        </el-form>
    </div>
</template>
<script>

import { bannerSave, bannerDetail } from '@/api/banner.js'
export default {
    data() {
        return {
            image_host: "",
            ruleForm: {
                name: '',
                image_url: "",
                redirect_url: "",
                redirect_url_h5: "",
                end_time: "",
                start_time: "",
                description: "",
                is_ems_url: "",
                toast_id: "",
                description: "",
                toast_sort:0,
            },
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '请输入description值', trigger: 'blur' }
                ],
                start_time: [
                    { type: 'date', required: true, message: '请输入开始时间', trigger: 'change' }
                ],
                end_time: [
                    { type: 'date', required: true, message: '请输入结束时间', trigger: 'change' }
                ]

            }
        };
    },
    created() {
        let toast_id = this.$route.query.id
        if (toast_id) {
            bannerDetail({ toast_id: toast_id }).then(res => {
                this.ruleForm = res.data
                this.image_host = res.data.image_host
                this.ruleForm.end_time = new Date(res.data.end_time * 1000)
                this.ruleForm.start_time = new Date(res.data.start_time * 1000)
            })
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    bannerSave(this.ruleForm).then(res => {
                        if (res.errno === 0) {
                            this.$notify({
                                title: '成功',
                                message: res.errmsg,
                                type: 'success'
                            })
                            this.$router.go(-1)
                        } else {
                            this.$notify({
                                title: '错误',
                                message: res.errmsg,
                                type: 'errno'
                            })
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleAvatarSuccess(res, file, index) {
            this.ruleForm.image_url = res.data.image_url
            this.image_host = res.data.image_host
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>
<style>
.uploads-demo .el-upload {
    width: auto;
    height: auto;
    min-width: 146px;
}
</style>