<template>
    <div>
        <el-form :model="ruleForm" ref="ruleForm" label-width="180px" class="demo-ruleForm">
            <el-form-item label="任务名称" required prop="task_name">
                <el-input v-model="ruleForm.task_name" placeholder="请输入" maxlength="50" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="奖励类型" required prop="reward_type">
                <el-radio-group v-model="ruleForm.reward_type">
                    <el-radio :label=1>金豆</el-radio>
                    <el-radio :label=2>余额</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="任务类型" required prop="task_type">
                <el-select v-model="ruleForm.task_type" @change="change">
                    <el-option v-for="(key,value) in task_type" :key="key" :label="key" :value="value">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 浏览页面持续时长 -->
            <div v-if="ruleForm.task_type == 1">
                <el-form-item label="浏览页面地址" inline required prop="visit_url">
                    <el-input v-model="ruleForm.visit_url" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="持续时间>=" required prop="continue_time">
                    <el-input v-model="ruleForm.continue_time" type="number" min="3" max="60" placeholder="最小值为3，最大值为60" class="inline_i"></el-input> 秒
                </el-form-item>
            </div>
            <!-- 首单支付金额 -->
            <div v-if="ruleForm.task_type == 2" prop="actual_price">
                <el-form-item label="订单实付金额>=" required>
                    <el-input v-model="ruleForm.actual_price" class="inline_i" placeholder="请输入" min="0"></el-input> 元
                </el-form-item>
            </div>
            <!-- 累计订单数 -->
            <div v-if="ruleForm.task_type == 3" prop="order_count">
                <el-form-item label="订单数量>=" required>
                    <el-input v-model="ruleForm.order_count" type="number" min="2" max="99" placeholder="最小值为2，最大值为99"></el-input>
                </el-form-item>
            </div>
            <!-- 购买指定品类 -->
            <div v-if="ruleForm.task_type == 4">
                <el-form-item label="是否包含" required prop="is_include">
                    <el-radio-group v-model="ruleForm.is_include">
                        <el-radio :label=1>包含</el-radio>
                        <el-radio :label=2>不包含</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="品类集合" required prop="category_ids">
                    <el-tag :key="tag.brand_id" v-for="(tag,index) in ruleForm.category_ids" closable :disable-transitions="false" @close="handleClose1(index)">
                        {{tag.value}}
                    </el-tag>
                    <el-select v-model="input_value" placeholder="请选择" @change="handleSelect1" v-if="input_visible" style="margin-left:10px;">
                        <el-option v-for="item in category_list" :key="item.category_ids" :label="item.value" :value="item">
                        </el-option>
                    </el-select>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 品类</el-button>
                </el-form-item>
            </div>
            <!-- 助力活动 -->
            <div v-if="ruleForm.task_type == 5">
                <el-form-item label="助力人数" required prop="help_count">
                    <el-input v-model="ruleForm.help_count" min="1" max="99" placeholder="请输入"></el-input>
                </el-form-item>
                <div v-if="ruleForm.reward_type == 1">
                    <el-form-item label="分享人获得金豆范围/次" required prop="min_share_beans">
                        <el-input v-model="ruleForm.min_share_beans" class="inline_i" placeholder="请输入" min="1" max="9999"></el-input>
                        -
                        <el-input v-model="ruleForm.max_share_beans" class="inline_i" placeholder="请输入" min="1" max="9999"></el-input>
                    </el-form-item>
                    <el-form-item label="助力人获得金豆范围/次" required prop="min_help_beans">
                        <el-input v-model="ruleForm.min_help_beans" class="inline_i" placeholder="请输入" min="1" max="9999"></el-input>
                        -
                        <el-input v-model="ruleForm.max_help_beans" class="inline_i" placeholder="请输入" min="1" max="9999"></el-input>
                    </el-form-item>
                </div>
                <div v-else>
                    <el-form-item label="分享人获得余额数/次" required prop="share_redpack_price">
                        <el-input v-model="ruleForm.share_redpack_price" class="inline_i" placeholder="请输入" min="0.01" max="99.99"></el-input>
                    </el-form-item>
                    <el-form-item label="助力人获得余额数/次" required prop="help_redpack_price">
                        <el-input v-model="ruleForm.help_redpack_price" class="inline_i" placeholder="请输入" min="0.01" max="99.99"></el-input>
                    </el-form-item>
                </div>
            </div>
            <!-- 购买指定品牌 -->
            <div v-if="ruleForm.task_type == 6">
                <el-form-item label="是否包含" required prop="is_include">
                    <el-radio-group v-model="ruleForm.is_include">
                        <el-radio :label=1>包含</el-radio>
                        <el-radio :label=2>不包含</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="品牌集合" required prop="brander_ids">
                    <el-tag :key="tag.brand_id" v-for="(tag,index) in ruleForm.brander_ids" closable :disable-transitions="false" @close="handleClose(index)">
                        {{tag.value}}
                    </el-tag>
                    <el-autocomplete class="input-new-tag" v-if="input_visible" v-model="input_value" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 品牌</el-button>
                </el-form-item>
            </div>
            <el-form-item label="任务有效期" required prop="start_time">
                <el-date-picker v-model="ruleForm.start_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间">
                </el-date-picker>
                -
                <el-date-picker v-model="ruleForm.end_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="排序" required prop="sort">
                <el-input v-model="ruleForm.sort"></el-input>
            </el-form-item>
            <el-form-item label="任务奖励限制" required prop="task_limit_count">
                <el-input placeholder="奖励次数" v-model="ruleForm.task_limit_count" class="input-with-select" type="number" max="999">
                    <el-select v-model="ruleForm.task_limit_type" slot="prepend" placeholder="请选择" style="width:130px;">
                        <el-option label="每天" :value="1"></el-option>
                        <el-option label="任务有效期内" :value="2" v-if="ruleForm.task_type != 2"></el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <el-form-item label="跳转小程序链接" required prop="jump_xcx_url">
                <el-input v-model="ruleForm.jump_xcx_url" placeholder="请填写"></el-input>
            </el-form-item>
            <el-form-item label="跳转h5链接" required prop="jump_h5_url">
                <el-input v-model="ruleForm.jump_h5_url" placeholder="请填写"></el-input>
            </el-form-item>
            <el-form-item label="获得金豆范围" required v-if="ruleForm.task_type != 5 && ruleForm.reward_type == 1" prop="min_beans">
                <el-input v-model="ruleForm.min_beans" class="inline_i" placeholder="请输入" min="1" max="9999" type="number"></el-input>
                -
                <el-input v-model="ruleForm.max_beans" class="inline_i" placeholder="请输入" min="1" max="9999" type="number"></el-input>
            </el-form-item>
            <el-form-item label="获得余额数/次" required v-if="ruleForm.task_type != 5 && ruleForm.reward_type == 2" prop="redpack_price">
                <el-input v-model="ruleForm.redpack_price" class="inline_i" placeholder="请输入" type="number"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" required prop="status">
                <el-radio-group v-model="ruleForm.status">
                    <el-radio :label=1>启用</el-radio>
                    <el-radio :label=0>停用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即{{ruleForm.id?"修改":"创建"}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { format } from "@/utils/utils";
import { taskSave, taskDetail, typeConfig, searchBrand, searchCategory } from '@/api/task.js'
let scale = 0
export default {
    data() {
        return {
            ems_id: '',
            ruleForm: {
                task_name: '',
                task_type: "1",
                start_time: '',
                end_time: '',
                sort: 0,
                status: 1,
                task_limit_type: 1,
                task_limit_count: "1",
                jump_xcx_url: "",
                jump_h5_url: "",
                reward_type: 2,
                min_beans: "",
                max_beans: "",
                min_redpack: "",
                max_redpack: "",
                visit_url: "",
                continue_time: "",
                actual_price: "",
                order_count: "",
                is_include: 1,
                category_ids: [],
                help_count: "",
                min_share_beans: "",
                max_share_beans: "",
                min_help_beans: "",
                max_help_beans: "",
                min_share_redpack: "",
                max_share_redpack: "",
                min_help_redpack: "",
                max_help_redpack: "",
                brander_ids: [],
                category_list: []
            },
            task_type: {},
            input_visible: false,
            input_value: '',
            category_list: []
        };
    },
    created() {
        let task_id = this.$route.query.id
        if (task_id) {
            taskDetail({ task_id: task_id }).then(res => {
                this.ruleForm = res.data
                this.ruleForm.end_time = new Date(res.data.end_time * 1000)
                this.ruleForm.start_time = new Date(res.data.start_time * 1000)
                this.ruleForm.task_type = this.ruleForm.task_type.toString()
            })
        }
        typeConfig().then(res => {
            this.task_type = res.data
        })
        searchCategory().then(res => {
            this.category_list = res.data
        })
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.ruleForm.task_type = Number(this.ruleForm.task_type)
                    this.ruleForm.end_time = this.ruleForm.end_time ? format(this.ruleForm.end_time, 'yyyy-MM-dd HH:mm:ss') : ''
                    this.ruleForm.start_time = this.ruleForm.start_time ? format(this.ruleForm.start_time, 'yyyy-MM-dd HH:mm:ss') : ''
                    console.log(this.ruleForm)
                    taskSave(this.ruleForm).then(res => {
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
                            this.ruleForm.task_type = this.ruleForm.task_type.toString()
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        showInput() {
            this.input_visible = true
        },
        change(e) {
            switch (e) {
                case '2':
                    this.ruleForm.task_limit_type = 1
                    break
                    break
                case '4':
                    this.ruleForm.is_include = 1
                    this.ruleForm.category_ids = []
                    break
                case '6':
                    this.ruleForm.is_include = 1
                    this.ruleForm.brander_ids = []
                    break
            }
            this.input_visible = false
            this.input_value = ''
        },
        querySearch(queryString, cb) {
            searchBrand(queryString).then(res => {
                var results = res.data
                console.log(results)
                // 调用 callback 返回建议列表的数据
                cb(results);
            })
        },
        handleSelect(item) {
            this.ruleForm.brander_ids.push(item)
            this.input_visible = false
            this.input_value = ''
        },
        handleSelect1(item) {
            let flag = false
            for (let i = 0; i < this.ruleForm.category_ids.length; i++) {
                if (item.category_id == this.ruleForm.category_ids[i].category_id) {
                    this.$notify.error({
                        title: '错误',
                        message: '请选择不同品类'
                    })
                    flag = true
                    break
                }
            }
            if (flag) return
            this.ruleForm.category_ids.push(item)
            this.input_visible = false
            this.input_value = ''
            console.log(this.ruleForm.category_ids)
        },
        handleClose(index) {
            this.ruleForm.brander_ids.splice(index, 1)
        },
        handleClose1(index) {
            this.ruleForm.category_ids.splice(index, 1)
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
.inline_i {
    width: 200px;
    display: inline-block;
}
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 150px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>