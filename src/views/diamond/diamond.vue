<template>
    <div class="diamond">
        <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="【金刚位配置】">
                <el-form-item :label="key == 'xcx' ? '小程序' : key" v-for="(val, key, kindex) in ruleForm" :key="kindex">
                    <!-- <el-button round @click="foldKey(key)">{{val.is_show ? '折叠' : '展开'}}</el-button> -->
                    <!-- <div v-show="val.is_show"> -->
                    <el-form-item :label="'时间配置'+(index+1)" v-for="(item, index) in val" :key="index">
                        <el-button round @click="foldKey(key,index)">{{item.is_show ? '折叠' : '展开'}}</el-button>
                        <el-button type="danger" round @click="deleteCode(key,index)" v-if="index > 0">删除时间配置</el-button>
                        <div v-show="item.is_show">
                            <el-form-item label="开始时间" prop="statrt_time">
                                <el-date-picker v-model="item.start_time" type="datetime" placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="结束时间" prop="end_time">
                                <el-date-picker v-model="item.end_time" type="datetime" placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item :label="mindex == 0 ? '第一排icon' : '第二排icon'" v-for="(mitem, mindex) in item.icon" :key="mindex">
                                <el-button round @click="foldKey(key,index,mindex)">{{mitem.is_show ? '折叠' : '展开'}}</el-button>
                                <div v-show="mitem.is_show">
                                    <el-form-item :label="'icon配置'+(sindex+1)" v-for="(sitem, sindex) in mitem" :key="sindex">
                                        <el-button type="danger" round @click="deleteCode(key,index,mindex,sindex)" v-if="sindex > 0">删除icon配置</el-button>
                                        <el-button round @click="foldKey(key,index,mindex,sindex)">{{sitem.is_show ? '折叠' : '展开'}}</el-button>
                                        <div v-show="sitem.is_show">
                                            <el-form-item label="icon图片" required>
                                                <div @click="beforeUp(key,index,mindex,sindex)">
                                                    <el-upload class="uploads-demo" action="api/upload/image" name="background" list-type="picture-card" :on-success="handleAvatarSuccess" :show-file-list="false">
                                                        <img v-if="sitem.img_url" :src="sitem.img_url" class="img_auto" />
                                                        <i class="el-icon-plus" v-else></i>
                                                        <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
                                                    </el-upload>
                                                </div>
                                            </el-form-item>
                                            <el-form-item label="h5链接" v-if="key == 'h5'" required>
                                                <el-input v-model="sitem.link_url"></el-input>
                                            </el-form-item>
                                            <el-form-item label="小程序链接" v-if="key == 'xcx'" required>
                                                <el-input v-model="sitem.link_xcx"></el-input>
                                            </el-form-item>
                                            <el-form-item label="标题" required>
                                                <el-input v-model="sitem.title" maxlength="5" show-word-limit></el-input>
                                            </el-form-item>
                                            <el-form-item label="排序" required>
                                                <el-input v-model="sitem.rank"></el-input>
                                            </el-form-item>
                                            <el-form-item label="图片尺寸" required>
                                                <el-input v-model="sitem.size" placeholder="格式示例：52x52"></el-input>
                                            </el-form-item>
                                            <el-form-item label="分类id">
                                                <el-input v-model="sitem.category_id"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-form-item>
                                    <el-button type="warning" round @click="addCode(key,index,mindex)">新增icon配置</el-button>
                                </div>
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
import { featureArea } from '@/api/coupon.js'
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
        featureArea().then(res => {
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
                            this.ruleForm[key][i].end_time = this.format(this.ruleForm[key][i].end_time, 'yyyy-MM-dd HH:mm:ss')
                            this.ruleForm[key][i].start_time = this.format(this.ruleForm[key][i].start_time, 'yyyy-MM-dd HH:mm:ss')
                        }
                    }
                    console.log(this.ruleForm)
                    featureArea(this.ruleForm).then(res => {
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
        beforeUp(key, index, sindex, mindex) {
            this.key = [key, index, sindex, mindex]
        },
        handleAvatarSuccess(res, file, index) {
            console.log(this.key)
            this.ruleForm[this.key[0]][this.key[1]].icon[this.key[2]][this.key[3]].img_url = res.data.image_host + res.data.image_url
        },
        foldKey(key, index, sindex, mindex) {
            if (typeof mindex == 'number') {
                let flag = !this.ruleForm[key][index].icon[sindex][mindex].is_show
                Vue.set(this.ruleForm[key][index].icon[sindex][mindex], 'is_show', flag)
            } else if (typeof sindex == 'number') {
                let flag = !this.ruleForm[key][index].icon[sindex].is_show
                Vue.set(this.ruleForm[key][index].icon[sindex], 'is_show', flag)
            } else if (typeof index == 'number') {
                let flag = !this.ruleForm[key][index].is_show
                Vue.set(this.ruleForm[key][index], 'is_show', flag)
            } else {
                let flag = !this.ruleForm[key].is_show
                Vue.set(this.ruleForm[key], 'is_show', flag)
            }
        },
        addCode(key, index, sindex) {
            if (typeof sindex == 'number') {
                this.ruleForm[key][index].icon[sindex].push({
                    img_url: "http://cdn04.dfs800.com/images/htj/icon/icon_new1_111.png",
                    link_url: "/dist/othernav?name=beauty",
                    title: "美妆",
                    rank: 1,
                    size: "52x52"
                })
            } else {
                this.ruleForm[key].push({
                    start_time: "2019-09-09 00:00:00",
                    end_time: "2020-09-29 20:00:00",
                    icon: [
                        [
                            {
                                img_url: "http://cdn04.dfs800.com/images/htj/icon/icon_new1_111.png",
                                link_url: "/dist/othernav?name=beauty",
                                title: "美妆",
                                rank: 1,
                                size: "52x52"
                            }
                        ],
                        [
                            {
                                img_url: "http://cdn04.dfs800.com/images/htj/icon/icon_new1_111.png",
                                link_url: "/dist/othernav?name=beauty",
                                title: "美妆",
                                rank: 1,
                                size: "52x52"
                            }
                        ]
                    ]
                })
            }
        },
        deleteCode(key, index, sindex, mindex) {
            if (typeof mindex == 'number') {
                this.ruleForm[key][index].icon[sindex].splice(mindex, 1)
            } else {
                this.ruleForm[key].splice(index, 1)
            }
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