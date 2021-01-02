<template>
    <el-upload class="avatar-uploader" :action="useto == 'gray' ? 'api/upload/placeholder' : 'api/upload/image'" :show-file-list="false" :on-change="changeFile" :on-success="handleUploadSuccess" :on-error="handleUploadError" :before-upload="beforeUpload" :name="useto == 'gray' ? 'file' : 'background'" :accept="useto == 'gray' ? '.jpg,.jpeg' : ''">
        <img v-if="isUpload&&msg" :src="msg" class="avatar" alt="" />
        <img v-else-if="preview" :src="cdn06+preview" class="avatar" alt="" />
        <i v-loading="loading" v-else class="el-icon-plus avatar-uploader-icon">{{ placeholder }}</i>
        <div v-if="isShowTip" slot="tip" class="el-upload__tip">
            {{ tip }}
            <slot name="tip"></slot>
        </div>
    </el-upload>
</template>

<script>

export default {
    name: "PicUpload",
    model: {
        event: "change"
    },
    props: {
        msg: String,
        back_height: String,
        value: {
            type: String,
            default() {
                return "";
            }
        },
        placeholder: {
            type: String,
            default() {
                return "上传照片";
            }
        },
        tip: {
            type: String,
            default() {
                return "仅支持 .jpg、.jpeg、.bmp、.png、.gif 格式，图片大小为 1M 以内";
            }
        },
        isShowTip: {
            type: Boolean,
            default() {
                return true;
            }
        },
        useto: {
            type: String,
            default() {
                return "";
            }
        }
    },
    data() {
        return {
            isUpload: false,
            loading: false,
            preview: "",
        };
    },
    watch: {
        value(val) {
            this.isUpload = false;
            this.preview = val;
        }
    },
    mounted() {
        this.preview = this.value
    },
    methods: {
        // 使用base64编码做回显
        changeFile(file, fileList) {
            var This = this;
            var reader = new FileReader();
            reader.readAsDataURL(file.raw);
            reader.onload = function (e) {
                this.result; // 这个就是base64编码了
                This.$emit('update:msg', this.result);//父组件msg.sync 调用 .sync父子组件双向绑定

                //获取图片上传时的高度
                let img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    if (img.width / img.height !== 2) {
                        let back_height = (img.height / img.width).toFixed(2);
                        This.$emit('update:back_height', back_height);
                    }
                }
            }
        },
        handleUploadSuccess(res) {
            if (res && res.errno === 0) {
                this.preview = (this.useto == 'gray' ? res.data.path : res.data.image_url);
                this.$message.success("上传成功");
                this.isUpload = true;
                this.$emit("change", (this.useto == 'gray' ? res.data.path : res.data.image_url));
            } else {
                this.$message.error((res && res.message) || "上传图片失败");
            }
            this.loading = false;
        },
        handleUploadError(err, file, fileList) {
            this.loading = false;
            this.$emit("on-error", err, file, fileList);
            this.$message.error("上传失败");
        },
        checkImage(file) {
            const isValid = false;
            const isImage =
                file.type === "image/jpeg" || file.type === "image/bmp" || file.type === "image/png" || file.type === "image/gif";
            if (!isImage) {
                this.$message.error("只能上传 jpg、jpeg、bmp、png、gif 类型的图片!");
                return isValid;
            }
            const isLt5M = file.size / 1024 / 1024 < 1;
            if (!isLt5M) {
                this.$message.error("图片大小不能超过 1MB!");
                return isValid;
            }
            return !isValid;
        },
        beforeUpload(file) {
            this.loading = true;
            const isValid = this.checkImage(file);
            if (!isValid) {
                this.loading = false;
            } else {
                this.imageUrl = "";
            }
            return isValid;
        }
    }
};
</script>

<style scoped>
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

.avatar-uploader-icon {
    font-size: 14px;
    color: #20a0ff;
    width: 110px;
    height: 110px;
    line-height: 110px;
    text-align: center;
}

.avatar {
    width: 110px;
    height: 110px;
    display: block;
}

.el-upload__tip {
    margin-top: -6px;
    line-height: 1.5;
    color: #c4c8cf;
}

.avatar-uploader-icon /deep/ .el-loading-spinner {
    top: 0;
    margin-top: 15px;
}
</style>
