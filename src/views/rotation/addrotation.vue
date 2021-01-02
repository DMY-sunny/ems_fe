<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-form-item label="标题" required prop="title">
                <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="站点">
                <el-radio-group v-model="ruleForm.used">
                    <el-radio :label="item.value" v-for="(item,index) in config.used" :key="index">{{item.key}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="位置">
                <el-radio-group v-model="ruleForm.position">
                    <el-radio :label="item.value" v-for="(item,index) in config.positions" :key="index">{{item.key}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="分类" v-if="ruleForm.position != 1">
                <el-radio-group v-model="ruleForm.category_id">
                    <el-radio :label="item.value" v-for="(item,index) in config.categories" :key="index">{{item.key}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="完整链接" required prop="link">
                <el-input v-model.trim="ruleForm.link"></el-input>
            </el-form-item>
            <el-form-item label="排序" required prop="index">
                <el-input v-model="ruleForm.index"></el-input>
            </el-form-item>
            <el-form-item label="导航背景色" required prop="bg_color">
                <el-input v-model="ruleForm.bg_color"></el-input>
            </el-form-item>
            <el-form-item label="展示人群" v-if="ruleForm.position == 1">
                <el-select v-model="ruleForm.show_mode">
                    <el-option v-for="item in config.ismember" :key="item.value" :label="item.key" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间" required prop="start_time">
                <el-date-picker v-model="ruleForm.start_time" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" required prop="end_time">
                <el-date-picker v-model="ruleForm.end_time" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="banner图片" required>
                <el-upload class="uploads-demo" action="api/upload/image" name="background" list-type="picture-card" :on-success="handleAvatarSuccess" :show-file-list="false">
                    <img v-if="ruleForm.img_url" :src="cdn06 + ruleForm.img_url" />
                    <i class="el-icon-plus" v-else></i>
                    <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即{{ruleForm.id?"修改":"创建"}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { format } from "@/utils/utils";
import { bannerSave, bannerDetail, bannerConfig } from '@/api/rotation/rotation.js'
let loading
export default {
    data() {
        return {
            image_host: "",
            ruleForm: {
                id: '',
                bg_color: '#fff',
                show_mode: 0,
                img_url: '',
                end_time: "",
                start_time: "",
                used: 1,
                position: 1,
                category_id: 0,
                title: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ]
            },
            load: '',
            progress_flag: false,
            config: {}
        };
    },
    created() {
        let id = this.$route.query.id
        if (id) {
            bannerDetail(id).then(res => {
                this.ruleForm = res.data
                this.image_host = res.data.image_host
            })
        }
        bannerConfig().then(res => {
            this.config = res.data
        })
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.ruleForm.end_time = format(this.ruleForm.end_time, 'yyyy-MM-ddTHH:mm:ss')
                    this.ruleForm.start_time = format(this.ruleForm.start_time, 'yyyy-MM-ddTHH:mm:ss')
                    if (this.ruleForm.position == 1) {
                        this.ruleForm.category_id = 0
                    }
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
                                type: 'error'
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
            this.ruleForm.img_url = res.data.image_url || res.data.path
            this.image_host = res.data.image_host || res.data.host
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
.img_auto {
    height: 200px;
    object-fit: cover;
    width: auto;
}
</style>