<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="标题" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="开始时间" required prop="start_time">
                <el-date-picker v-model="ruleForm.start_time" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" required prop="end_time">
                <el-date-picker v-model="ruleForm.end_time" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="入口图片展示">
                <el-radio-group v-model="ruleForm.show_user">
                    <el-radio :label=1>全部显示</el-radio>
                    <el-radio :label=2>区分会员显示</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="入口图片" v-if="ruleForm.show_user == 1">
                <pic-upload v-model="ruleForm.en_img" :back_height.sync="ruleForm.en_img_scale" @change="change" />
            </el-form-item>
            <el-form-item label="会员入口图片" v-if="ruleForm.show_user == 2">
                <pic-upload v-model="ruleForm.en_img_member" :back_height.sync="ruleForm.member_scale" @change="change" />
            </el-form-item>
            <el-form-item label="非会员入口图片" v-if="ruleForm.show_user == 2">
                <pic-upload v-model="ruleForm.en_img_nonmember" :back_height.sync="ruleForm.nomember_scale" />
            </el-form-item>
            <el-form-item label="入口链接" prop="description">
                <el-radio-group v-model="ruleForm.entrance_type">
                    <el-radio :label=1>ems配置</el-radio>
                    <el-radio :label=0>原生大促</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="ems活动id" prop="ems_id" v-if="ruleForm.entrance_type == 1">
                <el-input v-model="ruleForm.ems_id" placeholder="只需填入数字id"></el-input>
            </el-form-item>
            <el-form-item label="原生select" prop="select" v-if="ruleForm.entrance_type == 0">
                <el-input v-model="ruleForm.select" placeholder="如需更换请询问技术"></el-input>
            </el-form-item>
            <el-form-item label="是否自动跳转">
                <el-radio-group v-model="ruleForm.jump">
                    <el-radio :label=1>是</el-radio>
                    <el-radio :label=0>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="新用户自动跳转" v-if="ruleForm.jump == 1">
                <el-radio-group v-model="ruleForm.jump_new">
                    <el-radio :label=1>是</el-radio>
                    <el-radio :label=0>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="顶部导航文案" prop="top_nav">
                <el-input v-model="ruleForm.top_nav"></el-input>
            </el-form-item>
            <el-form-item label="顶部导航图片" prop="top_nav_img">
                <pic-upload v-model="ruleForm.top_nav_img" :back_height.sync="ruleForm.top_scale" />
                <el-button type="danger" @click="deleteImg" v-if="ruleForm.top_nav_img">删除图片</el-button>
            </el-form-item>
            <el-form-item label="分享文案" required prop="share_text">
                <el-input v-model="ruleForm.share_text"></el-input>
            </el-form-item>
            <el-form-item label="分享图片" required>
                <pic-upload v-model="ruleForm.share_img" />
            </el-form-item>
            <el-form-item label="灰色占位图" required>
                <pic-upload v-model="ruleForm.gray_img" useto="gray" />
            </el-form-item>
            <el-form-item label="入口占位图" required>
                <pic-upload v-model="ruleForm.en_gray_img" />
            </el-form-item>
            <el-form-item label="展示商品展示框">
                <el-radio-group v-model="ruleForm.act_flag">
                    <el-radio :label=1>显示</el-radio>
                    <el-radio :label=0>不显示</el-radio>
                </el-radio-group>
                <pic-upload v-model="ruleForm.goods_act_img" v-if="ruleForm.act_flag == 1" />
            </el-form-item>
            <el-form-item label="价格倒计时展示" v-if="ruleForm.act_flag == 1">
                <el-radio-group v-model="ruleForm.djs_flag">
                    <el-radio :label=1>是</el-radio>
                    <el-radio :label=0>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="展示底部子入口">
                <el-radio-group v-model="ruleForm.bottom_flag">
                    <el-radio :label=1>是</el-radio>
                    <el-radio :label=0>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="app入口高度" prop="webview_height" v-if="ruleForm.bottom_flag == 1">
                <el-input v-model="ruleForm.webview_height"></el-input>
                <el-alert title="2020年5月14号以后新创建的配置可不配置高度，自动获取数值。更新数值方法：重新上传主入口及子入口图" type="warning" class="warning_txt">
                </el-alert>
            </el-form-item>
            <el-form-item label="子入口配置" v-if="ruleForm.bottom_flag == '1'">
                <el-button type="primary" round @click="addBottomEntrance">新增子入口</el-button>
                <el-form-item :label="'子入口'+(index+1)" v-for="(item,index) in ruleForm.bottom" :key="index">
                    <el-input value="不可操作" :disabled="disabled" v-if="index < 1"></el-input>
                    <el-button type="primary" round @click="deleteBottomEntrance(index)" v-else>删除子入口</el-button>
                    <el-form-item label="背景图片" required>
                        <pic-upload v-model="item.bg_img" :back_height.sync="item.bg_scale" @change="change" />
                    </el-form-item>
                    <el-form-item label="子入口热区">
                        <el-radio-group v-model="item.m_type">
                            <el-radio label="link">链接跳转</el-radio>
                            <el-radio label="coupon">领取优惠券</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="优惠券key值" required v-if="item.m_type == 'coupon'">
                        <el-input v-model="item.code" placeholder="一键领取优惠券key值，示例：ysmm"></el-input>
                    </el-form-item>
                    <el-form-item label="链接列表" v-if="item.m_type == 'link'">
                        <el-button type="primary" round @click="addBottomLink(index)">新增链接</el-button>
                        <el-form-item :label="'链接'+(sindex+1)" v-for="(sitem,sindex) in item.link_list" :key="sindex">
                            <el-input value="不可操作" :disabled="disabled" v-if="sindex < 1"></el-input>
                            <el-button type="primary" round @click="deleteBottomLink(index,sindex)" v-else>删除链接</el-button>
                            <el-form-item label="小程序链接" required>
                                <el-input v-model="sitem.link"></el-input>
                            </el-form-item>
                            <el-form-item label="h5链接">
                                <el-input v-model="sitem.h5_link"></el-input>
                            </el-form-item>
                        </el-form-item>
                    </el-form-item>
                </el-form-item>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即{{ruleForm.activity_id?"修改":"创建"}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import PicUpload from '../tools/pic-upload.vue'
import { entranceSave, entranceDetail } from '@/api/entrance.js'
let scale = 0
export default {
    components: {
        PicUpload
    },
    data() {
        return {
            image_host: "",
            top_scale: "",//单张上传获取图片高度
            ems_id: '',
            disabled: true,
            bottom_img_index: 0,
            ruleForm: {
                name: '',
                jump: 0,
                jump_new: 0,
                entrance_type: 1,
                select: 2,
                top_nav: '活动',
                top_nav_img: "",
                top_scale: "",
                share_text: "",
                end_time: "",
                start_time: "",
                share_img: "",
                gray_img: "",
                en_gray_img: "",
                show_user: 1,
                en_img_member: "",
                en_img_nonmember: "",
                en_img: "",
                en_link: "",
                en_img_scale: '0',
                member_scale: '0',
                nomember_scale: '0',
                en_link_app: '',
                show_link: "",
                bottom_flag: 0,
                show_type: 0,
                act_flag: 0,
                djs_flag: 0,
                goods_act_img: '',
                select: 2,
                is_xcx: true,
                is_h5: true,
                is_app: true,
                bottom: [{ 'bg_img': '', 'bg_scale': '0', m_type: 'link', code: '', link_list: [{ 'link': '', 'h5_link': '' }] }],
                webview_height: 200
            },
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ],
                share_text: [
                    { required: true, message: '请输入分享文案', trigger: 'blur' }
                ],
                en_img: [
                    { required: true, message: '请上传入口图片', trigger: 'blur' }
                ],
                start_time: [
                    { type: 'date', required: true, message: '请输入开始时间', trigger: 'change' }
                ],
                end_time: [
                    { type: 'date', required: true, message: '请输入结束时间', trigger: 'change' }
                ],
                ems_id: [
                    { required: true, message: '请输入ems活动的id,必须是数字', trigger: 'blur' }
                ]
            }
        };
    },
    watch: {
        // 监听数据的变化输出 newV 改变的值，oldV 改变之前的值
        top_scale(newV, oldV) { },
    },
    created() {
        let activity_id = this.$route.query.id
        if (activity_id) {
            entranceDetail({ activity_id: activity_id }).then(res => {
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
                    // this.ruleForm.top_scale = this.top_scale
                    if (this.ruleForm.entrance_type == 0) {
                        this.ruleForm.ems_id = ''
                        this.ruleForm.en_link = ''
                        this.ruleForm.en_link_app = ''
                        this.ruleForm.show_link = '/dist/index/saleact'
                    } else {
                        if (this.ruleForm.ems_id == '') {
                            this.$notify({
                                title: '请填写ems配置的活动id',
                                message: res.errmsg,
                                type: 'error'
                            })
                            return
                        }
                        let gray_name = this.ruleForm.gray_img ? this.ruleForm.gray_img.replace('ems/dev/placeholder/', '').replace('.jpeg', '') : ''
                        this.ruleForm.en_link = `/dist3/childActivity?id=${this.ruleForm.ems_id}&isTopNav=1&gray=${gray_name}`
                        this.ruleForm.en_link_app = `/dist3/childActivity?id=${this.ruleForm.ems_id}&isNav=1&gray=${gray_name}`
                        this.ruleForm.show_link = `/dist3/childActivity?id=${this.ruleForm.ems_id}&gray=${gray_name}`
                    }
                    console.log(this.ruleForm)
                    entranceSave(this.ruleForm).then(res => {
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
        change() {
            scale = Number(this.ruleForm.show_user === 1 ? this.ruleForm.en_img_scale : this.ruleForm.member_scale)
            // console.log(scale)
            for (let i = 0; i < this.ruleForm.bottom.length; i++) {
                scale += Number(this.ruleForm.bottom[i].bg_scale)
                // console.log(scale)
            }
            if (isNaN(scale)) {
                return
            }
            this.ruleForm.webview_height = Math.floor(750 * scale)
        },
        deleteImg() {
            this.ruleForm.top_nav_img = ''
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        addBottomEntrance() {
            this.ruleForm.bottom.push({ 'bg_img': '', 'bg_scale': '0', m_type: 'link', code: '', link_list: [{ 'link': '', 'h5_link': '' }] })
        },
        deleteBottomEntrance(index) {
            this.ruleForm.bottom.splice(index, 1)
        },
        addBottomLink(index) {
            this.ruleForm.bottom[index].link_list.push({ 'link': '', 'h5_link': '' })
        },
        deleteBottomLink(index, sindex) {
            this.ruleForm.bottom[index].link_list.splice(sindex, 1)
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
.warning_txt {
    width: 700px;
    margin-top: 10px;
    padding: 0;
}
</style>