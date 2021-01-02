<template>
    <div class="couponall">
        <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="优惠券配置" required>
                <el-button type="primary" round @click="dialogFormVisible = true">新增一键领取key</el-button>
                <el-form-item :label="key" v-for="(val, key, sindex) in ruleForm" :key="sindex">
                    <el-button type="primary" round @click="deleteKey(key)" v-if="key != 'ysmm' && key != 'ysmm2' && key != 'ysmm3'">删除一键领取key</el-button>
                    <el-button round @click="foldKey(key)">{{val.is_show ? '折叠' : '展开'}}</el-button>
                    <div v-show="val.is_show">
                        <el-form-item label="一键领取key">
                            {{key}}
                            <el-button type="text" @click="copyText(key)">复制</el-button>
                        </el-form-item>
                        <el-form-item label="背景图片" required>
                            <div @click="beforeUp(key)">
                                <el-upload class="uploads-demo" action="api/upload/image" name="background" list-type="picture-card" :on-success="handleAvatarSuccess" :show-file-list="false">
                                    <img v-if="val.background" :src="val.background" class="img_auto" />
                                    <i class="el-icon-plus" v-else></i>
                                    <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="小程序跳转链接">
                            <el-input v-model="val.back_url"></el-input>
                        </el-form-item>
                        <el-form-item label="h5跳转链接">
                            <el-input v-model="val.back_h5url"></el-input>
                        </el-form-item>
                        <el-form-item :label="'优惠券code'+(index+1)" v-for="(item, index) in val.couponlist" :key="index">
                            <el-input value="不可操作" disabled="disabled" v-if="index < 1"></el-input>
                            <el-button type="danger" round @click="deleteCode(key,index)" v-else>删除优惠券code</el-button>
                            <el-form-item label="优惠券code" required>
                                <el-input v-model="item.coupon_code"></el-input>
                            </el-form-item>
                            <el-form-item label="活动是否可用">
                                <el-radio-group v-model="item.is_sale_share">
                                    <el-radio label="1">是</el-radio>
                                    <el-radio label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-button type="warning" round @click="addCode(key)" v-if="index == (val.couponlist.length-1)">新增优惠券code</el-button>
                        </el-form-item>
                    </div>
                </el-form-item>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">保存</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="新建优惠券key" :visible.sync="dialogFormVisible">
            <el-form>
                <el-form-item label="优惠券key">
                    <el-input v-model="new_key"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addKey">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Vue from 'vue'
import { onKeyReceive } from '@/api/coupon.js'
export default {
    data() {
        return {
            ruleForm: {},
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
        onKeyReceive().then(res => {
            this.ruleForm = res.data
            loading.close();//关闭loading
        })
    },
    methods: {
        submitForm() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    onKeyReceive(this.ruleForm).then(res => {
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
        beforeUp(key) {
            this.key = key
        },
        handleAvatarSuccess(res, file, index) {
            this.ruleForm[this.key].background = res.data.image_host + res.data.image_url
        },
        addKey() {
            const loading = this.$loading({//loading 打开
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.dialogFormVisible = false
            this.ruleForm[this.new_key] = {
                flag: "0111" + this.new_key,
                background: "http://cdn06.kepler8.com/image/201912/c79tseoulz.jpg",
                back_url: "",
                back_h5url: "",
                couponlist: [{
                    coupon_code: "111",
                    is_sale_share: "0"
                }]
            }
            onKeyReceive(this.ruleForm).then(res => {
                if (res.errno === 0) {
                    onKeyReceive().then(res => {
                        this.ruleForm = res.data
                        loading.close();//关闭loading
                    })
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res.errmsg
                    })
                }
            })
        },
        deleteKey(key) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const loading = this.$loading({//loading 打开
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.$delete(this.ruleForm, key);
                onKeyReceive(this.ruleForm).then(res => {
                    if (res.errno === 0) {
                        onKeyReceive().then(res => {
                            this.ruleForm = res.data
                            loading.close();//关闭loading
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        })
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: res.errmsg
                        })
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        foldKey(key) {
            let flag = !this.ruleForm[key].is_show
            Vue.set(this.ruleForm[key], 'is_show', flag)
        },
        addCode(key) {
            this.ruleForm[key].couponlist.push({
                coupon_code: "",
                is_sale_share: "0"
            })
        },
        deleteCode(key, index) {
            this.ruleForm[key].couponlist.splice(index, 1)
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
        },
        //复制
        copyText(key) {
            let Url2 = key;
            let oInput = document.createElement("input"); //创建一个隐藏input（重要！）
            oInput.value = Url2; //赋值
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.className = "oInput";
            oInput.style.display = "none";
            this.$message.success("复制成功!");
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
    height: 300px;
    object-fit: cover;
    width: auto;
}
</style>