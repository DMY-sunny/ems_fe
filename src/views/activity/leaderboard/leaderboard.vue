<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon iconfont el-iconshangpin"></i> {{addvsupdata?'新增':'修改'}}活动</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-col :span="20" :offset="2">
                <div class="form-box">
                    <el-form ref="form" :rules="rules_form" :model="form" label-width="80px">
                        <el-form-item label="活动名称" prop="name">
                            <el-input v-model="form.name" placeholder="请输入活动名称" />
                        </el-form-item>
                        <el-form-item label="副标题" prop="alias">
                            <el-input v-model="form.alias" placeholder="请输入副标题" />
                        </el-form-item>
                        <el-form-item label="活动banner" label-width="90px">
                            <el-upload class="upload-demo" action="api/upload/image" name="background" list-type="picture-card" :on-success="handleBannerSuccess" :before-upload="beforeUpload" :show-file-list="false">
                                <i class="el-icon-plus"></i>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="banner" prop="banner">
                            <img v-if="form.banner" :src="cdn06 + form.banner" class="logo" width="200">
                        </el-form-item>
                        <el-form-item label="开始时间" prop="start_time">
                            <el-date-picker class="all_width" v-model="form.start_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间" prop="end_time">
                            <el-date-picker class="all_width" v-model="form.end_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="category">
                            <el-select v-model="form.category" placeholder="全部一级分类">
                                <el-option :value="item.category_id" :label="item.category_name" v-for="(item,index) in categories" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="导航分类" prop="nav_tags">
                            <el-row>
                                <el-col v-for="(item,index) in nav_tags" :key="index" @click="navClick(item,index)" :span="4">
                                    <div>
                                        <el-image :src='cdn06+item.tag_img' fit='fit' style="width: 30px; height: 30px" />
                                        <el-tag closable @close="buynfreemDelete(item,index)">
                                            {{item.tag}}
                                        </el-tag>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-input v-model="tags" maxlength="6" show-word-limit placeholder="添加分类" />
                            <el-upload class="upload-demo" action="api/upload/image" name="background" list-type="picture-card" :on-success="handleNavsSuccess" :before-upload="beforeUpload" :show-file-list="false">
                                <i class="el-icon-plus"></i>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
                            </el-upload>
                            <el-image v-if="image_url" :src="cdn06 + image_url" style="width: 140px; height: 140px" />
                        </el-form-item>
                        <el-form-item class="mb">
                            <el-button @click="buydiscountAdd('form')" type="success" plain :loading="loading" class="">添加</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit('form')" :loading="loading" plain>确认{{addvsupdata?'新增':'修改'}}</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </div>
        <onTheList :formData="form" :nav_tags='nav_tags' v-if="!addvsupdata" :ref="form"> </onTheList>
    </div>
</template>
<script>
import {
    rankingTagsPost,
    rankingTagsDelete,
    rankingSave,
    rankingGet,
} from '@/api/activity/leaderboard/leaderboard'
import {
    categories
} from '@/api/activity/activity'
import { mapGetters } from 'vuex'
// import data from './data.js';
import onTheList from "./onTheList.vue";
export default {
    name: 'activityaUpdate',
    components: {
        onTheList,
    },
    // mixins: [data],

    data() {
        const validatelogoUrl = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请上传商品logo图片'))
            }
            callback()
        }
        const validateName = (rule, value, callback) => {
            var pattern = new RegExp("[`~!@$^&*=|{}':;',\\[\\].<>?~！@￥……&*——|{}【】‘；：”“'。，、？%]");
            if (!value) {
                callback(new Error('请输入活动名称'))
            } else if (value.match(pattern)) {
                callback(new Error('活动名称含有非法字符'))
            } else if (value.length > 100) {
                callback(new Error('活动名称不能超过100个字'))
            } else {
                callback()
            }
        }
        return {
            loading: false,
            form: {
                id: 0,
                category: '',
                nav_tags: [],
                banner: '',
                alias: '',
                start_time: "",
                end_time: "",
                name: ""
            },
            categories: [],//商品类目
            category4: '',
            categories_checbox: [],
            tags: '',//标签
            image_url: '',
            nav_tags: [],
            addvsupdata: false,
            ranking_id: 0,
            rules_form: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                ],
                alias: [
                    { required: true, message: '请输入副标题', trigger: 'blur' },
                ],
                banner: [
                    { required: true, message: '请添加图片', trigger: 'blur' },
                ],
                start_time: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ],
                end_time: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ],
                category: [
                    { required: true, message: '请选择类目', trigger: 'change' }
                ],

            }
        }
    },
    created() {
        categories(0).then(res => {
            if (res.errno == 0) {
                this.categories = res.data
            } else {
                this.$message(res.errmsg)
            }
        }).catch(err => { });
    },
    mounted() {
        this.getBrandData();
    },
    computed: {
        ...mapGetters(['leaderId']),
        ...mapGetters(['addvsup'])
    },
    methods: {
        //商品分类
        getCategories(type) {
            categories(this.category4).then(res => {
                if (res.errno == 0) {
                    if (this.categories[0].category_name == res.data[0].category_name) this.categories_checbox = [];
                    else this.categories_checbox = res.data;
                } else {
                    this.$message(res.errmsg)
                }
            }).catch(err => { });
            if (type !== 1) return this.form.category = [];
        },
        //提交数据 +1
        onSubmit(form) {
            this.form.nav_tags = this.nav_tags.map(item => {
                return item.tag_id
            });
            if(!this.form.nav_tags.length) return this.$message.error('至少添加一个导航分类！');
            rankingSave(this.form).then(res => {
                if (res.errno == 0) {
                    this.form.id = res.data;
                    this.getBrandData();
                    setTimeout(time => {
                        this.loading = false;
                        this.$message.success('保存成功！')
                        this.addvsupdata = false
                    }, 3000)
                } else {
                    this.$message(res.errmsg)
                    this.loading = false
                }
            }).catch(err => {
                this.loading = false
            })
        },
        //获取排行榜详情
        getBrandData() {
            this.addvsupdata = this.addvsup
            if (!this.addvsupdata && this.leaderId !== 0) this.form.id = this.leaderId;
            rankingGet(this.form.id).then(res => {
                if (res.errno == 0) {
                    this.form = Object.assign(this.form, res.data);
                    this.$store.commit('SET_LEADER_ID', this.form.id)
                    this.nav_tags = res.data.nav_tags
                } else {
                    this.$message(res.errmsg)
                    this.loading = false
                }
            }).catch(err => {
                this.loading = false
            })
        },
        // 标签添加
        buydiscountAdd(form) {
            let valids = true;
            this.$refs[form].validate((valid) => {
                if (valid) {
                    valids = false;
                } else {
                    valids = true;
                    return false;
                }
            });
            if (valids) return;
            let that = this
            if (!this.nav_tags) this.nav_tags = [];
            if (this.tags && this.image_url) {
                that.loading = true;
                rankingTagsPost({ name: this.tags, img_url: this.image_url }).then(res => {
                    if (res.errno == 0) {
                        that.nav_tags.push({ tag: that.tags, tag_id: res.data.tag_id, tag_img: that.image_url });
                        that.tags = '';
                        that.image_url = '';
                        that.loading = false;
                        this.onSubmit();
                    } else {
                        return that.$message(res.errmsg);
                        that.loading = false;
                    }
                })
            }
            else
                return this.$message.error('标签与图片不能为空！')
        },
        // 标签删除
        buynfreemDelete(item, index) {
            if (!this.form.id) return this.$message.error('只能修改时删除！')
            this.$confirm('分类将被删除，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let sendObj = {
                    ranking_id: this.form.id,
                    nav_tags: [item.tag_id],
                }
                rankingTagsDelete(sendObj).then(res => {
                    if (res.errno == 0) {
                        this.$message.success('您已删除成功')
                        this.nav_tags.splice(index, 1);
                    } else {
                        this.$message.error(res.errmsg)
                    }
                })
            })
        },
        handleBannerSuccess(res, file, index) { //图片上传成功回调
            this.form.banner = res.data.image_url
        },
        handleNavsSuccess(res, file, index) {
            this.image_url = res.data.image_url
        },
        beforeUpload(file) {
            const isJPG = (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/bmp');
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG/PNG/BMP 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 点击导航分类
        navClick(item, i) {
            this.image_url = item.img_url;
            this.tags = item.tag;
        }
    }
}
</script>
<style scoped>
/* 线上引入 */
.mb {
    margin-bottom: 10px;
}

.form-box {
    margin: 0 auto;
}

.fr {
    float: right;
}
.fl {
    float: left;
}
.fr button {
    display: block;
    width: 100%;
    margin: 5px 0 0;
}

.drag-list {
    float: left;
    padding: 10px;
    width: 205px;
    border: 1px solid #dcdfe6;
    border-radius: 10px;
    margin: 10px;
    font-size: 12px;
}

.el-table th,
.el-table tr.el-table__row {
    float: left !important;
}

.el-table tr {
    float: left !important;
}

.red {
    color: #ff0000;
}
.float_right {
    float: right;
}
.w130 {
    width: 130px;
}
.w110 {
    width: 110px;
}
.div_inline {
    display: inline;
}
</style>
