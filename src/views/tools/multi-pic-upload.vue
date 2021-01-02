<template>
    <div>
        <el-upload :disabled="disabled" v-if="!isMax" :class="['avatar-uploader', disabled && 'is-disable']" action="api/upload/image" :show-file-list="false" :on-success="handleSuccess" :on-progress="handleProgress" :before-upload="beforeUpload" name="background" :multiple="multiple" :limit="limit" :file-list="fileList" :on-exceed="handleExceed" :on-error="handleError">
            <i class="el-icon-plus avatar-uploader-icon">{{ placeholder }}</i>
        </el-upload>
        <div class="pic-list" v-for="(file, index) in fileList" :key="file.uid">
            <div v-if="file.status === 'uploading'" class="uploading">
                <span>文件上传中</span>
                <div class="progress">
                    <div class="bar" :style="{ width: `${file.percentage}%` }"></div>
                </div>
            </div>
            <div v-else-if="file.status === 'success'">
                <img :src="cdn06+file.response.data.image_url" alt="" />
                <div class="opt-cover">
                    <div class="opt-btn">
                        <a :href="cdn06+file.response.data.image_url" target="_blank">查看</a>
                    </div>
                    <div v-if="!disabled" class="opt-btn" @click="handleRemove(index)">删除</div>
                </div>
            </div>
            <div v-else class="upload-error">
                <span>文件上传失败</span>
                <div class="opt-btn" @click="handleRemove(index)">删除</div>
            </div>
        </div>
        <div v-if="isShowTip" slot="tip" class="el-upload__tip">
            {{ tip }}
            <slot name="tip"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "MultiPicUpload",
    model: {
        event: "change"
    },
    props: {
        disabled: Boolean,
        value: {
            type: Array,
            default() {
                return [];
            }
        },
        limit: {
            type: Number,
            default: 1
        },
        multiple: {
            type: Boolean,
            default: true
        },
        placeholder: {
            type: String,
            default: "上传照片"
        },
        tip: {
            type: String,
            default: "仅支持 .jpg、.jpeg、.bmp、.png 、.gif格式，图片大小为 5M 以内"
        },
        isShowTip: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isClick: null,
            loading: false,
            fileList: [],
            isInit: true,
            base64: '',
            back_height: '',
        };
    },
    computed: {
        isMax() {
            return this.fileList.length >= this.limit;
        }
    },
    watch: {
        value(val) {
            if (this.fileList.length === 0 && this.isInit) {
                this.transferValue(val);
                this.isInit = false;
            }
            if (!val.length) {//监控父组件值的变化，如果没有长度了则清空
                this.fileList = [];
            }
        }
    },
    mounted() {
        if (this.fileList.length === 0) {
            this.transferValue(this.value);
        }
    },
    methods: {
        transferValue(val) {
            if (val) {
                // 编辑时构造一个跟上传文件相同的数据结构
                this.fileList = val.map(item => ({
                    uid: Date.now() + Math.random(),
                    status: "success",
                    response: {
                        image_url: item.image_url
                    },
                }));
            }
        },
        handleProgress(res, f, fl) {
            this.fileList = fl;
        },
        handleRemove(index) {
            this.fileList.splice(index, 1);
            if (this.fileList.length === 0) {
                this.$emit("change", null);
                return;
            }
            const rawFileList = [];
            this.fileList.forEach(item => {
                if (item.response) {
                    const {
                        response: { data: { image_url } }
                    } = item;
                    let fl_name = item.name.split('.')[0];
                    if (item.status === "success") {
                        rawFileList.push({
                            name: fl_name,//文件名称
                            uid: item.uid,
                            image_url: item.response.data.image_url
                        });
                    }
                }
            });
            if (rawFileList.length > 0) {
                this.$emit("change", rawFileList);
            } else {
                this.$emit("change", null);
            }
        },
        handleExceed() {
            this.$message.error("上传文件数量超限");
        },
        handleSuccess(res, f, fl) {
            const rawFileList = [];
            fl.forEach(item => {
                if (item.response) {
                    const {
                        response: { data: { image_url } }
                    } = item;
                    let fl_name = item.name.split('.')[0];
                    // 使用base64编码做回显
                    var This = this;
                    var reader = new FileReader();
                    reader.readAsDataURL(item.raw);
                    reader.onload = function (e) {
                        this.result; // 这个就是base64编码了
                        This.base64 = this.result;
                        rawFileList.forEach(res => {//二，根据uid区分 由于异步原因导致 先执行push
                            if (res.uid == item.uid) {
                                return res.base64_url = This.base64
                            }
                        })
                        //获取图片上传时的高度
                        let img = new Image();
                        img.src = reader.result;
                        img.onload = () => {
                            if (img.width / img.height !== 2) {
                                rawFileList.forEach(res => { //三，同上
                                    if (res.uid == item.uid) {
                                        return res.back_height = (img.height / img.width).toFixed(2);
                                    }
                                })
                            }
                        }
                    }
                    if (item.status === "success") {//一， 异步原因导致，push时base64和back_height还未获得到 
                        // 写入rawFileList
                        rawFileList.push({
                            name: fl_name,//文件名称
                            uid: item.uid,
                            image_url: item.response.data.image_url,
                            base64_url: This.base64,
                            back_height: This.back_height,
                        });

                    }
                }
            });
            if (rawFileList.length > 0) {
                this.setTimeoutMessage(rawFileList);//防止多个图片上传时，提示信息弹出多条
            }
        },
        setTimeoutMessage(rawFileList) {
            clearTimeout(this.isClick);
            this.isClick = setTimeout(() => {
                this.$message.success("上传成功");
                this.$emit("change", rawFileList);
            }, 500);
        },
        handleError(err, file, fileList) {
            this.$emit("on-error", err, file, fileList);
            this.$message.error("上传失败");
        },
        beforeUpload(file) {
            const isValid = false;
            const isImage =
                file.type === "image/jpeg" || file.type === "image/bmp" || file.type === "image/png" || file.type === "image/gif";
            if (!isImage) {
                this.$message.error("只能上传 jpg、jpeg、bmp、png 类型的图片!");
                return isValid;
            }
            const isLt5M = file.size / 1024 / 1024 <= 5;
            if (!isLt5M) {
                this.$message.error("图片大小不能超过 5MB!");
                return isValid;
            }
            return !isValid;
        }
    }
};
</script>

<style scoped>
.avatar-uploader {
    width: 112px;
    height: 112px;
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
    margin-bottom: 10px;
}

.avatar-uploader /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader /deep/ .el-upload:hover {
    border-color: #409eff;
}

.avatar-uploader.is-disable /deep/ .el-upload:hover {
    border-color: #d9d9d9;
    cursor: not-allowed;
}

.avatar-uploader-icon {
    font-size: 14px;
    color: #20a0ff;
    width: 110px;
    height: 110px;
    line-height: 110px;
    text-align: center;
}
.avatar-uploader.is-disable .avatar-uploader-icon {
    color: #aaa;
}

.avatar {
    width: 110px;
    height: 110px;
    display: block;
}

.el-upload__tip {
    margin-top: -4px;
    line-height: 1.5;
    color: #c4c8cf;
}

.avatar-uploader-icon /deep/ .el-loading-spinner {
    top: 0;
    margin-top: 15px;
}
.pic-list {
    position: relative;
    width: 112px;
    height: 112px;
    box-sizing: border-box;
    display: inline-block;
    border: 1px solid #c0ccda;
    margin-right: 10px;
    margin-bottom: 10px;
    vertical-align: top;
}
.pic-list img {
    width: 110px;
    height: 110px;
}
.opt-cover {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: background-color 200ms;
    font-size: 12px;
    flex-direction: column;
    align-items: center;
}
.pic-list:hover .opt-cover {
    display: flex;
}
.opt-cover:hover {
    background-color: rgba(0, 0, 0, 0.3);
}
.opt-cover .opt-btn:first-child {
    margin-top: 26px;
}
.opt-cover .opt-btn {
    border: 1px solid #ccc;
    line-height: 24px;
    text-align: center;
    width: 50%;
    cursor: pointer;
    margin-top: 10px;
    background: #fff;
}
.opt-cover .opt-btn a {
    text-decoration: none;
    color: inherit;
}
.progress {
    width: 100px;
    height: 3px;
    background: rgba(120, 120, 120, 0.2);
    margin: 0 auto;
}
.progress .bar {
    width: 0;
    height: 100%;
    background: #1890ff;
    /*background: #52c41a;*/
}
.pic-list .uploading {
    font-size: 12px;
    text-align: center;
}
.pic-list .uploading span {
    line-height: 60px;
}
.pic-list .upload-error {
    font-size: 12px;
    text-align: center;
}
.pic-list .upload-error span {
    color: #f56c6c;
    line-height: 60px;
}
.pic-list .upload-error .opt-btn {
    margin: 0 auto;
    border: 1px solid #ccc;
    line-height: 24px;
    text-align: center;
    width: 50%;
    cursor: pointer;
    background: #fff;
}
</style>
