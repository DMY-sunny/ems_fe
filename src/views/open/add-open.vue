<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-form-item label="标题" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="h5跳转链接" prop="open_url">
                <el-input v-model.trim="ruleForm.open_url"></el-input>
            </el-form-item>
            <el-form-item label="开屏时长(秒)" prop="duration">
                <el-input v-model="ruleForm.duration"></el-input>
            </el-form-item>
            <el-form-item label="ios/非会员/无刘海" prop="advertising_url_type">
                <el-radio-group v-model="ruleForm.advertising_url_type">
                    <el-radio :label=1>静态/动态图片</el-radio>
                    <el-radio :label=0>mp4视频</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="ios/非会员/无刘海">
                <el-upload class="uploads-demo" :action="ruleForm.advertising_url_type == 1 ? 'api/upload/image' : 'api/upload/file'" :name="ruleForm.advertising_url_type == 1 ? 'background' : 'file'" list-type="picture-card" :on-success="handleAvatarSuccess" :show-file-list="false" :accept="ruleForm.advertising_url_type == 1 ? '.png,.jpg,.jpeg,.gif' : '.mp4'" :on-progress="progress">
                    <img v-if="ruleForm.advertising_url && ruleForm.advertising_url_type == 1" :src="cdn06 + ruleForm.advertising_url" class="img_auto" />
                    <video v-if="ruleForm.advertising_url && ruleForm.advertising_url_type == 0" :src="cdn06 + ruleForm.advertising_url" id="videoPlay" class="img_auto">您的浏览器不支持 video 视屏播放。</video>
                    <i class="el-icon-plus" v-if="!ruleForm.advertising_url"></i>
                    <div slot="tip" class="el-upload__tip" v-if="ruleForm.advertising_url_type == 1">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
                    <div slot="tip" class="el-upload__tip" v-else>只能上传MP4文件，且不超过2M</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="ios/非会员/有刘海" prop="url_x_type">
                <el-radio-group v-model="ruleForm.url_x_type">
                    <el-radio :label=1>静态/动态图片</el-radio>
                    <el-radio :label=0>mp4视频</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="ios/非会员/有刘海">
                <el-upload class="uploads-demo" :action="ruleForm.url_x_type == 1 ? 'api/upload/image' : 'api/upload/file'" :name="ruleForm.url_x_type == 1 ? 'background' : 'file'" list-type="picture-card" :on-success="handleAvatarSuccess4" :show-file-list="false" :accept="ruleForm.url_x_type == 1 ? '.png,.jpg,.jpeg,.gif' : '.mp4'" :on-progress="progress">
                    <img v-if="ruleForm.url_x && ruleForm.url_x_type == 1" :src="cdn06 + ruleForm.url_x" class="img_auto" />
                    <video v-if="ruleForm.url_x && ruleForm.url_x_type == 0" :src="cdn06 + ruleForm.url_x" id="videoPlay" class="img_auto">您的浏览器不支持 video 视屏播放。</video>
                    <i class="el-icon-plus" v-if="!ruleForm.url_x"></i>
                    <div slot="tip" class="el-upload__tip" v-if="ruleForm.url_x_type == 1">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
                    <div slot="tip" class="el-upload__tip" v-else>只能上传MP4文件，且不超过2M</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="ios/会员/无刘海" prop="vip_url_type">
                <el-radio-group v-model="ruleForm.vip_url_type">
                    <el-radio :label=1>静态/动态图片</el-radio>
                    <el-radio :label=0>mp4视频</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="ios/会员/无刘海">
                <el-upload class="uploads-demo" :action="ruleForm.vip_url_type == 1 ? 'api/upload/image' : 'api/upload/file'" :name="ruleForm.vip_url_type == 1 ? 'background' : 'file'" list-type="picture-card" :on-success="handleAvatarSuccess1" :show-file-list="false" :accept="ruleForm.vip_url_type == 1 ? '.png,.jpg,.jpeg,.gif' : '.mp4'" :on-progress="progress">
                    <img v-if="ruleForm.vip_url && ruleForm.vip_url_type == 1" :src="cdn06 + ruleForm.vip_url" class="img_auto" />
                    <video v-if="ruleForm.vip_url && ruleForm.vip_url_type == 0" :src="cdn06 + ruleForm.vip_url" id="videoPlay" class="img_auto">您的浏览器不支持 video 视屏播放。</video>
                    <i class="el-icon-plus" v-if="!ruleForm.vip_url"></i>
                    <div slot="tip" class="el-upload__tip" v-if="ruleForm.vip_url_type == 1">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
                    <div slot="tip" class="el-upload__tip" v-else>只能上传MP4文件，且不超过2M</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="ios/会员/有刘海" prop="vip_url_x_type">
                <el-radio-group v-model="ruleForm.vip_url_x_type">
                    <el-radio :label=1>静态/动态图片</el-radio>
                    <el-radio :label=0>mp4视频</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="ios/会员/有刘海">
                <el-upload class="uploads-demo" :action="ruleForm.vip_url_x_type == 1 ? 'api/upload/image' : 'api/upload/file'" :name="ruleForm.vip_url_x_type == 1 ? 'background' : 'file'" list-type="picture-card" :on-success="handleAvatarSuccess2" :show-file-list="false" :accept="ruleForm.vip_url_x_type == 1 ? '.png,.jpg,.jpeg,.gif' : '.mp4'" :on-progress="progress">
                    <img v-if="ruleForm.vip_url_x && ruleForm.vip_url_x_type == 1" :src="cdn06 + ruleForm.vip_url_x" class="img_auto" />
                    <video v-if="ruleForm.vip_url_x && ruleForm.vip_url_x_type == 0" :src="cdn06 + ruleForm.vip_url_x" id="videoPlay" class="img_auto">您的浏览器不支持 video 视屏播放。</video>
                    <i class="el-icon-plus" v-if="!ruleForm.vip_url_x"></i>
                    <div slot="tip" class="el-upload__tip" v-if="ruleForm.vip_url_x_type == 1">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
                    <div slot="tip" class="el-upload__tip" v-else>只能上传MP4文件，且不超过2M</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="安卓开屏" prop="advertising_url_b_type">
                <el-radio-group v-model="ruleForm.advertising_url_b_type">
                    <el-radio :label=1>静态/动态图片</el-radio>
                    <el-radio :label=0>mp4视频</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="安卓开屏">
                <el-upload class="uploads-demo" :action="ruleForm.advertising_url_b_type == 1 ? 'api/upload/image' : 'api/upload/file'" :name="ruleForm.advertising_url_b_type == 1 ? 'background' : 'file'" list-type="picture-card" :on-success="handleAvatarSuccess3" :show-file-list="false" :accept="ruleForm.advertising_url_b_type == 1 ? '.png,.jpg,.jpeg,.gif' : '.mp4'" :on-progress="progress">
                    <img v-if="ruleForm.advertising_url_b && ruleForm.advertising_url_b_type == 1" :src="cdn06 + ruleForm.advertising_url_b" class="img_auto" />
                    <video v-if="ruleForm.advertising_url_b && ruleForm.advertising_url_b_type == 0" :src="cdn06 + ruleForm.advertising_url_b" id="videoPlay" class="img_auto">您的浏览器不支持 video 视屏播放。</video>
                    <i class="el-icon-plus" v-if="!ruleForm.advertising_url_b"></i>
                    <div slot="tip" class="el-upload__tip" v-if="ruleForm.advertising_url_b_type == 1">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
                    <div slot="tip" class="el-upload__tip" v-else>只能上传MP4文件，且不超过2M</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="开始时间" required prop="start_time">
                <el-date-picker v-model="ruleForm.start_time" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" required prop="end_time">
                <el-date-picker v-model="ruleForm.end_time" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即{{ruleForm.open_id?"修改":"创建"}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
// import { Loading } from 'element-ui';
import { openSave, openDetail } from '@/api/open.js'
let loading
export default {
    data() {
        return {
            image_host: "",
            ruleForm: {
                name: '',
                advertising_url: "",
                open_url: "",
                vip_url: "",
                url_x: "",
                vip_url_x: "",
                open_id: "",
                end_time: "",
                start_time: "",
                advertising_url_b: '',
                duration: 1,
                advertising_url_b_type: 1,
                vip_url_x_type: 1,
                advertising_url_type: 1,
                vip_url_type: 1,
                url_x_type: 1
            },
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ],
                // vip_url_x: [
                //     { required: true, message: '请输入vip_url_x值', trigger: 'blur' }
                // ],
                // vip_url: [
                //     { required: true, message: '请输入h5链接', trigger: 'blur' }
                // ],

                // start_time: [
                //     { type: 'date', required: true, message: '请输入开始时间', trigger: 'change' }
                // ],
                // end_time: [
                //     { type: 'date', required: true, message: '请输入结束时间', trigger: 'change' }
                // ]

            },
            load: '',
            progress_flag: false
        };
    },
    created() {
        let open_id = this.$route.query.id
        if (open_id) {
            openDetail({ 'open_id': open_id }).then(res => {
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
                    openSave(this.ruleForm).then(res => {
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
            this.ruleForm.advertising_url = res.data.image_url || res.data.path
            this.image_host = res.data.image_host || res.data.host
            this.closeFullScreen();
        },
        handleAvatarSuccess1(res, file, index) {
            this.ruleForm.vip_url = res.data.image_url || res.data.path
            this.image_host = res.data.image_host || res.data.host
            this.closeFullScreen();
        },
        handleAvatarSuccess2(res, file, index) {
            this.ruleForm.vip_url_x = res.data.image_url || res.data.path
            this.image_host = res.data.image_host || res.data.host
            this.closeFullScreen();
        },
        handleAvatarSuccess3(res, file, index) {
            this.ruleForm.advertising_url_b = res.data.image_url || res.data.path
            this.image_host = res.data.image_host || res.data.host
            this.closeFullScreen();
        },
        handleAvatarSuccess4(res, file, index) {
            this.ruleForm.url_x = res.data.image_url || res.data.path
            this.image_host = res.data.image_host || res.data.host
            this.closeFullScreen();
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        closeFullScreen() {
            this.progress_flag = false
            let that = this
            this.$nextTick(() => {
                that.load.close()
            });
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