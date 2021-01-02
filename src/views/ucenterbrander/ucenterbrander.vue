<template>
    <div class="ucenterbrander">
        <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item :label="'广告位配置'+(index+1)" v-for="(item, index) in ruleForm.brander" :key="index">
                <el-button round @click="foldKey(index)">{{item.is_show ? '折叠' : '展开'}}</el-button>
                <el-button type="danger" round @click="deleteCode(index)" v-if="index > 0">删除配置</el-button>
                <div v-show="item.is_show">
                    <el-form-item label="开始时间" prop="start_time">
                        <el-date-picker v-model="item.start_time" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="end_time">
                        <el-date-picker v-model="item.end_time" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="图片上传" prop="img">
                        <div @click="beforeUp(index)">
                            <el-upload class="uploads-demo" action="api/upload/image" name="background" list-type="picture-card" :on-success="handleAvatarSuccess" :show-file-list="false" accept=".png,.jpg,.jpeg,.gif" :on-progress="progress">
                                <img v-if="item.img" :src="cdn06 + item.img" class="img_auto" />
                                <i class="el-icon-plus" v-else></i>
                                <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
                            </el-upload>
                        </div>
                    </el-form-item>
                    <el-form-item label="h5链接" prop="link_h5">
                        <el-input v-model="item.link_h5" placeholder="广告位链接"></el-input>
                    </el-form-item>
                    <el-form-item label="小程序链接" prop="link">
                        <el-input v-model="item.link" placeholder="广告在列表显示的位置"></el-input>
                    </el-form-item>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" round @click="addCode()">新增时间配置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { format } from '@/utils/utils.js'
import { ucenterBrander } from '@/api/coupon.js'
export default {
    data() {
        return {
            ruleForm: {},
            key: ''
        }
    },
    created() {
        const loading = this.$loading({//loading 打开
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        ucenterBrander().then(res => {
            this.ruleForm = res.data
            loading.close();//关闭loading
        })
    },
    methods: {
        submitForm() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    for (let i = 0; i < this.ruleForm['brander'].length; i++) {
                        this.ruleForm['brander'][i].end_time = format(this.ruleForm['brander'][i].end_time, 'yyyy-MM-dd HH:mm:ss')
                        this.ruleForm['brander'][i].start_time = format(this.ruleForm['brander'][i].start_time, 'yyyy-MM-dd HH:mm:ss')
                    }
                    ucenterBrander(this.ruleForm).then(res => {
                        if (res.errno === 0) {
                            this.$notify({
                                title: '成功',
                                message: res.errmsg,
                                type: 'success'
                            })
                            ucenterBrander().then(res => {
                                this.ruleForm = res.data
                            })
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
            this.ruleForm['brander'].push({
                "start_time": "2019-09-09 00:00:00",
                "end_time": "2020-11-30 19:16:41",
                "img": "",
                "title": "1",
                "link_h5": "",
                "link": ""
            })
        },
        deleteCode(index) {
            this.ruleForm['brander'].splice(index, 1)
        },
        beforeUp(index) {
            this.key = index
        },
        handleAvatarSuccess(res, file, index) {
            if (res.errno == 0) {
                this.$set(this.ruleForm['brander'][this.key], 'img', res.data.image_url)
            } else {
                this.$notify.error({
                    title: '错误',
                    message: res.errmsg
                });
            }
            this.progress_flag = false
            let that = this
            this.$nextTick(() => {
                that.load.close()
            });
        },
        foldKey(index) {
            let flag = !this.ruleForm['brander'][index].is_show
            this.$set(this.ruleForm['brander'][index], 'is_show', flag)
        },
        progress() {
            if (!this.progress_flag) {
                this.progress_flag = true
                this.load = this.$loading({
                    fullscreen: false,
                    text: '上传中...'
                })
            }
        }
    }
}
</script>
<style>
.img_auto {
    height: auto;
    object-fit: cover;
    width: 100%;
}
</style>