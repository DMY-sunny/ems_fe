<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-time"></i> 素材列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-edit" @click="handleAdd">新增</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table v-loading="false" element-loading-text="拼命加载中" align="center" :data="tableData" border class="table" ref="multipleTable">
                <el-table-column prop="id" width="80" label="页面ID" align="center" />
                <el-table-column prop="title" width="150" label="页面名称"></el-table-column>
                <el-table-column prop="short_url" label="短链接" width="200"></el-table-column>
                <el-table-column prop="origin_url" label="原始url"></el-table-column>
                <el-table-column label="操作" align="center" width="300" fixed="right">
                    <template slot-scope="scope">
                        <div style="margin-bottom: 10px">
                            <el-button type="success" size="mini" @click="handleSaoma(scope.row)">扫码</el-button>
                            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">修改</el-button>
                            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="yulan_box" v-show="showYlan">
            <div class="yulan_box_bg" @click.stop="yulanshouw"></div>
            <div class="yulan">
                <div class="erweima_chont">
                    <div class="erweima_chont_box">
                        <p style="text-align: center;font-weight:bold;color:#D22020">扫码可在移动端预览</p>
                        <div id="qrcode"></div> <!-- 创建一个div，并设置id为qrcode -->
                    </div>  
                </div>    
            </div>
        </div>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" background :page-sizes="[30, 50, 70, 90]" @size-change="handleSizeChange" layout="sizes, prev, pager, next" :page-size="30" :total="total"></el-pagination>
        </div>
    </div>
</template>
<script>
import {
    h5builderList,
    h5builderdelete
} from "@/api/ShortLinkGeneration/ShortLinkGeneration";
import { toDate } from "@/utils/index";
import { formatDate } from "@/utils/utils";
import QRCode from 'qrcodejs2'  // 引入qrcode
import { setTimeout } from 'timers';
import { format } from 'path';
export default {
    name: "orderList",
    data() {
        return {
            tab_active: 1,
            yulanBut:1,
            tabData: {},
            tabList: [],
            list_data: [],
            showYlan: false,
            loading: false,
            tableData: [],
            cur_page: 1,
            page_size: 30,
            key_word: "",
            country: "0",
            sort: "0",
            total: 1,
            file: "",
            cityList: [],
            // 搜索
            activity_title:'',
            activity_id:''
        };
    },
    created() {
        this.initData();
    },
    components: {
    },
    methods: {
        // 控件区
        //时间
        formatTime:function(row, column, cellValue){
            return formatDate(cellValue)
        },
        colorAdjust(i) {
            if (this.tab_active === i) {
                return `background-color: ${this.tabData.background_sel_color};color: ${this.tabData.font_sel_color};font-weight:bold;`
            } else {
                return "";
            }
        },
        tabColor(i) {
            this.tab_active = i;
            const returnEle = document.querySelector(`#${i}`);
            if (returnEle) {
                returnEle.scrollIntoView(true);
            }
        },
        formatXcxUrl: function(row, column, cellValue){
            return "/pages/webview/webview?url=" + encodeURIComponent(cellValue) + "&fromx=saleact"
        },
        yulanshouw() {
            this.showYlan = false;
        },
        //删除
        handleDelete(data) {
            this.$confirm("确认删除此活动?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    h5builderdelete(data.id).then(res => {
                        this.initData();
                    });
                })
                .catch(() => { });
        },
        // 修改
        handleEdit(data) {
            this.$router.push({
                path: "/imgUrl",
                query: {
                    id: data.id
                }
            });
        },
        //预览
        handleYulan(data) {
            this.yulanBut = 1;
            this.tabData = []
            this.tabList = []
            handleimgSearch(data.activity_id).then(res => {
                if (res.errno == 0) {
                    this.showYlan = true;
                    this.list_data = res.data.list;
                    res.data.list.forEach(element => {
                        if(element.navs){
                            this.tabData = element
                            this.tabList = element.navs
                        }
                    });
                    
                } else {
                    this.$message.error(res.errmsg);
                    this.loading = false;
                }
            });
        },
        //扫码
        handleSaoma(data) {
            console.log(data)
            this.yulanBut = 0;
            // 清空上一个二维码
            $('#qrcode').html("");
            setTimeout(()=>{
                this.showYlan = true;
                let qrcode = new QRCode('qrcode', {
                    width: 180,  
                    height: 180,
                    text: data.origin_url, 
                })
            })
        },
        formatHot: function (row, column, cellValue) {
            if (cellValue === 1 || null) {
                return "上线";
            } else {
                return "下线";
            }
        },
        // 新增
        handleAdd() {
            this.$router.push({
                path: "/imgUrl"
            });
        },
        initData() {
            this.loading = true;
            h5builderList( this.cur_page, this.page_size)
                .then(res => {
                    if (res.errno == 0) {
                        this.tableData = res.data.list;
                        this.total = res.data.total;
                    } else {
                        this.$message.error(res.errmsg);
                        this.loading = false;
                    }
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        // 分页导航
        handleCurrentChange(val) {
            this.cur_page = val;
            this.initData();
        },
        // 放开自定义条数
        handleSizeChange(val) {
            this.page_size = val;
            this.initData();
        },
        //状态改变
        changeStatus() {
            this.initData();
        },
        search() {
            this.cur_page = 1;
            this.initData();
        }
    }
};
</script>

<style scoped>
/*弹框*/
.top_tab {
    width: 100%;
    height: 44px;
    background-color: #cdb182;
    box-sizing: border-box;
    /* position: absolute;
    top: 0;
    left: 0; */
    z-index: 9;
}
.tab_show {
    height: 44px;
}
.tab_box {
    padding: 11px 0;
    white-space: nowrap;
    overflow-x: auto;
    padding-right: 14px;
}
.top_tab_item {
    display: inline-block;
    vertical-align: top;
    height: 20px;
    padding: 0 9px;
    line-height: 20px;
    font-size: 14px;
    color: #333;
    -background-color: #fe0f40;
    border-radius: 10px;
    margin-left: 14px;
}
.yulan_box_bg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
}
.yulan_box {
    position: fixed;
    z-index: 101;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.yulan {
    position: relative;
    z-index: 2;
    padding-bottom: 44px;
    background: #fff;
    padding-top: 40px;
    width: 412px;
    height: 715px;
    background-size: 100% 100%;
    background-image: url("http://mint-ui.github.io/docs/static/img/phone.5909f66.png");
}
.yulan_chont {
    position: relative;
    overflow: auto;
    margin: 20px 0 0 10px;
    width: 392px;
    height: 640px;
    background-color: #fff;
}
.erweima_chont{
    position: relative;
    margin: 20px 0 0 10px;
    width: 392px;
    height: 640px;
    background-color: #fff;
}
.erweima_chont_box{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.aintimport {
    position: relative;
    color: #fff;
    background-color: #f56c6c;
    padding: 6px 14px;
    border-radius: 4px;
    margin-right: 12px;
    border-color: #f56c6c;
    cursor: pointer;
}
.intimport {
    opacity: 0;
    z-index: 10;
    position: absolute;
    right: 0px;
    top: 2px;
    width: 60px;
    height: 30px;
    cursor: pointer;
}
.handle-input {
    width: 300px;
    display: inline-block;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

.mr10 {
    margin-right: 10px;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .el-carousel__container {
    position: relative;
    height: 130px;
  }
</style>
