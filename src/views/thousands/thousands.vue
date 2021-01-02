<template>
    <div class="diamond">
        <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item>
                <el-form-item :label="key == 'index' ? '[首页]' : (key == 'cart' ? '[购物车]' : '[个人中心]')" v-for="(val, key, kindex) in ruleForm" :key="kindex">
                    <!-- <el-button round @click="foldKey(key)">{{val.is_show ? '折叠' : '展开'}}</el-button> -->
                    <!-- <div v-show="val.is_show"> -->
                    <el-form-item :label="'时间配置'+(index+1)" v-for="(item, index) in val" :key="index">
                        <el-button round @click="foldKey(key,index)">{{item.is_show ? '折叠' : '展开'}}</el-button>
                        <el-button type="danger" round @click="deleteCode(key,index)" v-if="index > 0">删除时间配置</el-button>
                        <div v-show="item.is_show">
                            <el-form-item label="开始时间" prop="start_time">
                                <el-date-picker v-model="item.start_time" type="datetime" placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="结束时间" prop="end_time">
                                <el-date-picker v-model="item.end_time" type="datetime" placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="资源类型" prop="ad_type">
                                <el-radio-group v-model="item.ad_type">
                                    <el-radio label='1'>静态/动态图片</el-radio>
                                    <el-radio label='2'>mp4视频</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="图片上传" prop="ad_img" v-if="item.ad_type == 1">
                                <div @click="beforeUp(key,index)">
                                    <el-upload class="uploads-demo" action="api/upload/image" name="background" list-type="picture-card" :on-success="handleAvatarSuccess" :show-file-list="false" accept=".png,.jpg,.jpeg,.gif" :on-progress="progress">
                                        <img v-if="item.ad_img" :src="cdn06 + item.ad_img" class="img_auto" />
                                        <i class="el-icon-plus" v-else></i>
                                        <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，图片尺寸344*540，且不超过300kb</div>
                                    </el-upload>
                                </div>
                            </el-form-item>
                            <el-form-item label="视频封面上传" prop="ad_videoimg" v-if="item.ad_type == 2">
                                <div @click="beforeUp(key,index)">
                                    <el-upload class="uploads-demo" action="api/upload/image" name="background" list-type="picture-card" :on-success="handleAvatarSuccess1" :show-file-list="false" accept=".png,.jpg,.jpeg,.gif" :on-progress="progress">
                                        <img v-if="item.ad_videoimg" :src="cdn06 + item.ad_videoimg" class="img_auto" />
                                        <i class="el-icon-plus" v-else></i>
                                        <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，图片尺寸344*540，且不超过300kb</div>
                                    </el-upload>
                                </div>
                            </el-form-item>
                            <el-form-item label="视频上传" prop="ad_video" v-if="item.ad_type == 2">
                                <div @click="beforeUp(key,index)">
                                    <el-upload class="uploads-demo" action="api/upload/file" name="file" list-type="picture-card" :on-success="handleAvatarSuccess2" :show-file-list="false" accept=".mp4" :on-progress="progress">
                                        <video v-if="item.ad_video" :src="cdn06 + item.ad_video" id="videoPlay" class="img_auto">您的浏览器不支持 video 视屏播放。</video>
                                        <i class="el-icon-plus" v-else></i>
                                        <div slot="tip" class="el-upload__tip">只能上传MP4文件，尺寸344*540，且不超过2M</div>
                                    </el-upload>
                                </div>
                            </el-form-item>
                            <el-form-item label="小程序链接" prop="ad_url" v-if="item.ad_type == 1">
                                <el-input v-model="item.ad_url" placeholder="广告位链接"></el-input>
                            </el-form-item>
                            <el-form-item label="h5链接" prop="ad_url_h5" v-if="item.ad_type == 1">
                                <el-input v-model="item.ad_url_h5" placeholder="广告位链接"></el-input>
                            </el-form-item>
                            <el-form-item label="展示环境" prop="show_item">
                                <el-checkbox-group v-model="item.show_item" :min="1">
                                    <el-checkbox label='1'>小程序</el-checkbox>
                                    <el-checkbox label='2'>h5</el-checkbox>
                                    <el-checkbox label='3'>app</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="展示人群" prop="show_user">
                                <el-checkbox-group v-model="item.show_user" :min="1">
                                    <el-checkbox label='1'>非会员</el-checkbox>
                                    <el-checkbox label='2'>会员</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="新人展示" prop="show_isnew">
                                <el-checkbox-group v-model="item.show_isnew" :min="1">
                                    <el-checkbox label='1'>非新人</el-checkbox>
                                    <el-checkbox label='2'>新人</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="展示位置" prop="show_position">
                                <el-input v-model="item.show_position" placeholder="广告在列表显示的位置"></el-input>
                            </el-form-item>
                        </div>
                    </el-form-item>
                    <el-button type="warning" round @click="addCode(key)">新增时间配置</el-button>
                    <!-- </div> -->
                </el-form-item>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import Vue from 'vue'
import { format } from '@/utils/utils.js'
import { modulesAds } from '@/api/coupon.js'
export default {
    data() {
        return {
            ruleForm: {},
            key: '',
            new_key: '',
            dialogFormVisible: false,
            rules: {
                show_position: [
                    { required: true, message: '请输入广告位展示位置', trigger: 'blur' }
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
        modulesAds().then(res => {
            this.ruleForm = res.data
            loading.close();//关闭loading
        })
    },
    methods: {
        submitForm() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    for (let key in this.ruleForm) {
                        for (let i = 0; i < this.ruleForm[key].length; i++) {
                            this.ruleForm[key][i].end_time = format(this.ruleForm[key][i].end_time, 'yyyy-MM-dd HH:mm:ss')
                            this.ruleForm[key][i].start_time = format(this.ruleForm[key][i].start_time, 'yyyy-MM-dd HH:mm:ss')
                        }
                    }
                    console.log(this.ruleForm)
                    modulesAds(this.ruleForm).then(res => {
                        if (res.errno === 0) {
                            this.$notify({
                                title: '成功',
                                message: res.errmsg,
                                type: 'success'
                            })
                            modulesAds().then(res => {
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
        addCode(key, index) {
            this.ruleForm[key].push({
                "ad_img": "",
                "ad_url": "/pages",
                "ad_url_h5": "/dist",
                "ad_video": "",
                "ad_videoimg": "",
                "ad_type": "1",
                "start_time": "2020-03-30 15:05:14",
                "end_time": "2020-03-30 15:05:14",
                "show_item": ["1", "2", "3"],
                "show_user": ["1", "2"],
                "show_isnew": ["1", "2"],
                "show_position": 3
            })
        },
        deleteCode(key, index, sindex, mindex) {
            if (typeof mindex == 'number') {
                this.ruleForm[key][index].icon[sindex].splice(mindex, 1)
            } else {
                this.ruleForm[key].splice(index, 1)
            }
        },
        beforeUp(key, index) {
            this.key = [key, index]
        },
        handleAvatarSuccess(res, file, index) {
            if (res.errno == 0) {
                Vue.set(this.ruleForm[this.key[0]][this.key[1]], 'ad_img', res.data.image_url)
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
        handleAvatarSuccess1(res, file, index) {
            if (res.errno == 0) {
                Vue.set(this.ruleForm[this.key[0]][this.key[1]], 'ad_videoimg', res.data.image_url)
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
        handleAvatarSuccess2(res, file, index) {
            if (res.errno == 0) {
                Vue.set(this.ruleForm[this.key[0]][this.key[1]], 'ad_video', res.data.path)
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
        foldKey(key, index) {
            if (typeof index == 'number') {
                let flag = !this.ruleForm[key][index].is_show
                Vue.set(this.ruleForm[key][index], 'is_show', flag)
            } else {
                let flag = !this.ruleForm[key].is_show
                Vue.set(this.ruleForm[key], 'is_show', flag)
            }
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
    min-width: 100px;
    line-height: normal;
}
.img_auto {
    height: 100px;
    object-fit: cover;
    width: auto;
}
</style>