<template>
  <div>
    <p>上传你的图片</p>
    <el-upload
              class="upload-demo"
              action="api/upload/image"
              :data="uploadData"
              name="background"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-success="handleMapSuccess"
              :on-remove="handleRemove"
              multiple
            >
              <img v-if="short_url" :src="short_url" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <p class="inviteCode" id="inviteCode" v-text="short_url"></p>
      <el-button v-if="short_url" class="copy" @click="CopyUrl">复制链接</el-button>
  </div>
</template>
<script>
// import {
// } from "@/api/EventPage/EventPageEditing";
export default {
  name: "EventPage",
  data() {
    return {
      uploadData:{
        short_url:true
      },
      short_url:"",
      invite_code:'',
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },
  created() {},
  computed: {},
  components: {},
  methods: {
    // 复制
    CopyUrl(data){
        var Url2 = document.getElementById("inviteCode").innerText;
        var oInput = document.createElement("input");
        oInput.value = Url2;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = "oInput";
        oInput.style.display = "none";
        this.$message({
          message:"复制成功!",
          type:'success'
        })
    },
    handleMapSuccess(res, file, index) {
      //图片上传成功回调
      // this.carouse_url.img_url = res.data.image_url;

      index.forEach(element => {
        console(element.response.data)
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      console.log(file)
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 所有图片--上传图片验证
    beforeIMGUpload(file) {
      const isJPG =
        file.type == "image/jpeg" ||
        file.type == "image/jpg" ||
        file.type == "image/png" ||
        file.type == "image/bmp";
      // const isLtSize = file.size / 1024 < 300; //300kb
      const isLtSize = file.size / 1024 / 1024 < 2; //2mb
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG/BMP 格式!");
      }
      if (!isLtSize) {
        this.$message.error("上传图片大小不能超过 300kb!");
      }
      return isJPG && isLtSize;
    },
  },
  mounted() {}
};
</script>