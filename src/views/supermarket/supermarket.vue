<template>
    <div class="diamond">
        <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item>
                <el-form-item :label="'时间配置'+(index+1)" v-for="(item, index) in ruleForm.setting_list" :key="index">
                    <el-button type="danger" round @click="deleteCode(index)" v-if="index > 0">删除时间配置</el-button>
                    <el-form-item label="导航名称" prop="name">
                        <el-input v-model="item.name"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="start_time">
                        <el-date-picker v-model="item.start_time" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="end_time">
                        <el-date-picker v-model="item.end_time" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="ems活动id" prop="activity_id">
                        <el-input v-model="item.activity_id"></el-input>
                    </el-form-item>
                    <el-form-item label="导航位置" prop="position">
                        <el-input v-model="item.position"></el-input>
                    </el-form-item>
                    <el-form-item label="导航背景色" prop="bg_color">
                        <el-input v-model="item.bg_color"></el-input>
                    </el-form-item>
                </el-form-item>
                <el-button type="warning" round @click="addCode()">新增时间配置</el-button>
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
export default {
    data() {
        return {
            ruleForm: [],
            key: '',
            new_key: '',
            dialogFormVisible: false
        }
    },
    created() {
        const loading = this.$loading({//loading 打开
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$httpAxios({
            methods: 'get',
            url: 'api/cms/index/haitunsupermarket'
        }).then(res => {
            this.ruleForm = res.data.data
            loading.close();//关闭loading
        })
    },
    methods: {
        submitForm() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    for (let i = 0; i < this.ruleForm['setting_list'].length; i++) {
                        this.ruleForm['setting_list'][i].end_time = format(this.ruleForm['setting_list'][i].end_time, 'yyyy-MM-dd HH:mm:ss')
                        this.ruleForm['setting_list'][i].start_time = format(this.ruleForm['setting_list'][i].start_time, 'yyyy-MM-dd HH:mm:ss')
                        this.ruleForm['setting_list'][i].xcx_url = `/pages/webview/webview?url=%2Fdist3%2FchildActivity%3Fid%3D${this.ruleForm['setting_list'][i].activity_id}%26currentkey%3Dsupermarket%26isTopNav%3D1&fromx=saleact`
                        this.ruleForm['setting_list'][i].h5_url = `/dist3/childActivity?id=${this.ruleForm['setting_list'][i].activity_id}&isTopNav=1&currentkey=supermarket`
                        this.ruleForm['setting_list'][i].app_url = `/dist3/childActivity?id=${this.ruleForm['setting_list'][i].activity_id}&isNav=1`
                    }
                    console.log(this.ruleForm)
                    this.$httpAxios({
                        methods: 'post',
                        url: 'api/cms/index/haitunsupermarket',
                        data: this.ruleForm
                    }).then(res => {
                        if (res.data.errno === 0) {
                            this.$notify({
                                title: '成功',
                                message: res.errmsg,
                                type: 'success'
                            })
                            this.$httpAxios({
                                methods: 'get',
                                url: 'api/cms/index/haitunsupermarket'
                            }).then(res => {
                                this.ruleForm = res.data.data
                            })
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: res.data.errmsg
                            })
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        addCode() {
            this.ruleForm['setting_list'].push({
                "activity_id": "",
                "name": "海豚超市",
                "bg_color": "#ffffff",
                "h5_url": "",
                "xcx_url": "",
                "app_url": "",
                "position": 0,
                "start_time": "2020-03-30 15:05:14",
                "end_time": "2020-03-30 15:05:14"
            })
        },
        deleteCode(index) {
            this.ruleForm['setting_list'].splice(index, 1)
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