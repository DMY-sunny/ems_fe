<template>
  <div>
    <div class="yijianzhedie">
      <el-button type="warning" @click="foldBut">一键{{this.isFold ? "展开" : "折叠" }}模块</el-button>
    </div>
    <div class="content">
      <div class="left">
        <draggable v-model="form.attributes.img_list" :options="{animation:500}" :style="sizeFun('data')" handle=".handle">
          <div class="moban_item" v-for="(item,index) in form.attributes.img_list" :key="index">
            <div v-if="isFold" style="width:220px;height: 240px;overflow:auto;">
              <img style="width:260px;" draggable="true" :src="item" alt="加载失败" @click="imgClick(item,index)">
            </div>
            <div v-else style="width:500px;" >
              <img style="width:500px;" draggable="true" :src="item" alt="加载失败" @click="imgClick(item,index)">
            </div>
            <div class="workButton">
              <div>
                <el-button type="success" icon="el-icon-rank" class="handle"></el-button>
              </div>
              <div>
                <el-button type="danger" icon="el-icon-delete" plain @click="DeleteUrl(index)"></el-button>
              </div>
            </div>
          </div>
        </draggable>
      </div>
      <div class="right height500">
        <div class="saveData">
          <div style="margin: 20px;"></div>
          <el-form label-position="left" label-width="80px" :model="form">
            <el-form-item v-if="createdvsadd" label="页面ID">
              <el-input v-model="form.id" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="页面标题">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="选择模板">
              <el-select v-model="form.tpl_id">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="统计标识">
              <el-input v-model="form.identity"></el-input>
            </el-form-item>
            <el-form-item v-if="form.tpl_id == 2" label="类型">
              <el-select v-model="form.attributes.type">
                <el-option
                  label="h5内嵌页"
                  value="h5">
                </el-option>
                <el-option
                  label="商品详情页"
                  value="goodsdetail">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品ID" v-if="form.tpl_id == 2 && form.attributes.type == 'goodsdetail'">
              <el-input v-model="form.attributes.goods_id"></el-input>
            </el-form-item>
            <el-form-item label="活动ID" v-if="form.tpl_id == 2 && form.attributes.type == 'goodsdetail'">
              <el-input v-model="form.attributes.act_id"></el-input>
            </el-form-item>
            <el-form-item
            label="活动类型"
            v-if="form.tpl_id == 2 && form.attributes.type == 'goodsdetail'"
          >
            <el-select placeholder="非必选" v-model="form.attributes.p_from">
              <el-option
                :value="item.value"
                :label="item.key"
                v-for="(item,index) in act_type"
                :key="'act_type-'+index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="url" v-if="form.tpl_id == 2 && form.attributes.type == 'h5'">
              <el-input v-model="form.attributes.url"></el-input>
              <el-alert
                title="必须添加域名https://app.dfs800.com"
                type="error"
              >
          </el-alert>
          </el-form-item>
          
          </el-form>
        </div>
        <div v-if="form.tpl_id == 1">
          <p>已上传的图片</p>
          <el-upload
            class="upload-demo"
            action="api/upload/image"
            :data="uploadData"
            name="background"
            list-type="picture-card"
            :on-success="handlePicSuccess"
            :before-upload="beforeIMGUpload"
            :on-remove="handleRemove"
            multiple
          >
          <i class="el-icon-plus"></i>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
          </el-upload>
        </div>
        <!-- 生成短链接 -->
        <el-button v-if="createdvsadd" type="primary" plain @click="saveData(2)">修改数据</el-button>
        <el-button v-else type="primary" plain @click="saveData(1)">生成短连接</el-button>
      <!-- <p class="inviteCode" id = "inviteCode" v-text="short_url"></p>
      <el-button v-if="short_url" class="copy" @click="CopyUrl">复制链接</el-button> -->
      </div>
    </div>
  </div>
</template>
<script>
const typesList = [
  {label: 'h5内嵌页',value: 'h5'},
  {label: '商品详情页',value: 'goodsdetail'},
];
const cityOptions = [
  { name: "会员", value: "show_with_vip" },
  { name: "非会员", value: "show_with_not_vip" },
];
import {
  h5builderSave,
  h5builderDetail,
  h5builderMBlist,
} from "@/api/ShortLinkGeneration/ShortLinkGeneration";
import {
  eventPageConfigs,
} from "@/api/EventPage/EventPageEditing";
import {mapGetters} from "vuex";
import draggable from "vuedraggable";
export default {
  name: "EventPage",
  data() {
    return {
      types: typesList,
      act_type:[],
      uploadData:{
        short_url:true
      },
      short_url:"",
      invite_code:'',
      dialogImageUrl:'',
      dialogVisible: false,
      labelPosition: 'left',
      createdvsadd:true,
      imgUrl:'',//当前图片地址
      indexD:0,//当前图片 index
      isFold:false,//模块是否折叠
      options:[],//模板内容
      //提交
      form:{
        id: '',
        title:'',
        tpl_id:'',
        identity:'',
        attributes:{
          type:'',//// 必填，只能填写: h5、goodsdetail，type=goodsdetail跳转app内原生商品详情,type=h5跳转app内任意h5
          goods_id:'',// 商品ID，type=goodsdetail时为必填
          act_id:'',// 活动ID，type=goodsdetail时用，非必填
          p_from:'', // 此处为活动类型,同 http://10.81.8.30:3000/project/123/interface/api/257 下发中活动类型值，type=goodsdetail时用，非必填
          url:'', // type=h5时url为必填
          img_list:[]
        }
      },
      
    }
  },
  created() {
    this.form.id = this.$route.query.id;
      if (this.form.id) {
        this.createdvsadd = true
        //详情下发
        h5builderDetail(this.form.id).then(res=>{
          if (res.errno == 0) {
            this.form = Object.assign({},res.data) 
          } else {
          this.$message.error(res.errmsg);
          }
          this.form = res.data
        }).catch(err=>{
        })
      }else{
        this.createdvsadd = false;
      }
    h5builderMBlist().then(res=>{
      this.options = res.data.list
    })

    eventPageConfigs().then(res => {
      this.operatorList = res.data.event_type;
      this.listType = res.data.link_type;
      this.goodsType = res.data.goods_type;
      this.act_type = res.data.activity_type;
    });
    
  },
  computed: {
    // ...mapGetters(['ShortLinkPageid'])
  },
  components: {
    draggable,
  },
  methods: {
    // 一键折叠
    foldBut(){
        if(!this.isFold){
          this.isFold = true
        }else{
          this.isFold = false
        }
    },
    //拖拽时动态获取位置动态样式
    sizeFun(data) {
      return `width: ${data.width} ; height: ${data.height} ;top: ${data.top};left: ${data.left} `;
    },
    imgClick(item,index) {
      this.imgUrl = item
      this.indexD = index
    },
    //图片上传
    handlePicSuccess(res, file, index) {
        index.forEach(element => {
          this.form.attributes.img_list.push(element.response.data.image_host+element.response.data.image_url)
        });
        let set = new Set(this.form.attributes.img_list)//去掉重复数据
        this.form.attributes.img_list = Array.from(set);//将set处理成数组
    },
    // 图片删除
    handleRemove(file, fileList) {
        // this.form.attributes.img_list.splice(this.form.attributes.img_list.indexOf(file.response.data.image_url),1)
    },
    // 删除当前图片
    DeleteUrl(index) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.form.attributes.img_list.splice(index,1)         
        })
        .catch(() => {});
    },
    // 所有图片--上传图片验证
    beforeIMGUpload(file) {
      const isJPG =
        file.type == "image/jpeg" ||
        file.type == "image/jpg" ||
        file.type == "image/png" ||
        file.type == "image/gif" ||
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
    // 提交数据
    saveData(cvsa){
      //新增
        h5builderSave(this.form).then(res=>{
          if (res.errno == 0) {
              this.$message({
                message: "保存成功!",
                type: "success"
              });
              this.$router.push({
                path:"/shortlinklist",
                query:{}
              })
          } else {
            this.$message.error(res.errmsg);
          }
        }).catch((err) => {
          console.log(err)
        });
    },
  },
  mounted() {}
};
</script>
<style scoped>
.workButton div{
  margin: 5px 0 5px 0;
}
.moban_item {
  display: flex;
  align-items: center;
}
.content {
  display: flex;
  padding-top: 40px;
}
.right{
  /* background-color: blanchedalmond; */
  left: 50%;
  position: absolute;
  background-color: #f0f2f5;
  height: 500px;
  overflow-y: auto
}
.height500{
  padding: 5px;
  width: 510px;
  height: 500px;
  overflow-y: auto;
  border: 5px solid #e3e197;
  box-shadow:0 0 5px #e3e197 inset;
}
.yijianzhedie{
  position: absolute;
}
</style>