<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-peoplefill"></i> 用户详情
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- <div class="handle-box">
            <el-input v-model="select_word" placeholder="请输入用户ID或妮称" class="handle-input mr10"/>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>-->
      <div class="table_title" style="overflow:hidden;">
        用户信息
        <el-button type="danger" style="float:right;">禁用</el-button>
      </div>
      <el-table
        v-loading="false"
        :data="userDetails"
        border
        class="table table_bot"
        ref="multipleTable"
      >
        <el-table-column prop="user_id" label="用户ID" align="center" />
        <el-table-column prop="user_id" label="用户昵称" align="center" />
        <el-table-column prop="user_id" label="VIP" align="center" />
        <el-table-column prop="user_id" label="渠道" align="center" />
        <el-table-column prop="user_id" label="折扣等级" align="center" />
        <el-table-column prop="user_id" label="生日" align="center" />
        <el-table-column prop="user_id" label="性别" align="center" />
        <el-table-column prop="user_id" label="绑定手机" align="center" />
        <el-table-column prop="user_id" label="邀请码" align="center" />
        <el-table-column prop="user_id" label="邀请数" align="center" />
      </el-table>
      <div class="table_title">钱包信息</div>
      <el-table
        v-loading="false"
        :data="userDetails"
        border
        class="table table_bot"
        ref="multipleTable"
      >
        <el-table-column prop="user_id" label="金豆数" align="center" width="170" />
        <el-table-column prop="user_id" label="余额" align="center" width="170" />
        <el-table-column prop="user_id" label="会员等级" align="center" width="170" />
        <el-table-column prop="user_id" label="会员到期" align="center" width="170" />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              class="prebutton"
              type="primary"
              icon="el-icon-edit"
              @click="goldbeandetailClick(scope.row)"
            >金豆明细</el-button>
            <el-button
              class="prebutton"
              type="primary"
              icon="el-icon-edit"
              @click="goldbeanEdit(scope.row)"
            >补发金豆</el-button>
            <el-button
              class="prebutton"
              type="primary"
              icon="el-icon-edit"
              @click="balanceDetailClick(scope.row)"
            >金额明细</el-button>
            <el-button
              class="prebutton"
              type="primary"
              icon="el-icon-edit"
              @click="balanceEdit(scope.row)"
            >补发金额</el-button>
            <el-button
              class="prebutton"
              type="primary"
              icon="el-icon-edit"
              @click="memberEdit(scope.row)"
            >修改到期日</el-button>
            <el-button
              class="prebutton"
              type="primary"
              icon="el-icon-edit"
              @click="membershipEdit(scope.row)"
            >会员等级修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table_title address_div">
        收货地址
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="float:right;"
          @click="addressEdit"
        >添加收货地址</el-button>
      </div>
      <el-table
        v-loading="false"
        :data="userDetails"
        border
        class="table table_bot"
        ref="multipleTable"
      >
        <el-table-column prop="0" label="序号" align="center" width="55" />
        <el-table-column prop="user_id" label="收件人" align="center" />
        <el-table-column prop="user_id" label="手机号" align="center" />
        <el-table-column prop="user_id" label="身份证号" align="center" />
        <el-table-column prop="user_id" label="地址所属区域" align="center" />
        <el-table-column prop="user_id" label="详细地址" align="center" />
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button
              style="margin-bottom:10px;"
              type="primary"
              icon="el-icon-edit"
              @click="addressEdit(scope.row)"
            >编辑</el-button>
            <br />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog title="当前用户信息" :visible.sync="editVisible" width="40%" center>
      <el-form ref="form" :rules="rules" :model="modify_user" label-width="100px">
        <el-form-item>
          <img :src="modify_user.user_img" alt="用户头像" width="100" height="100" />
        </el-form-item>
        <el-form-item label="ID:" prop="user_id">
          <el-input v-model="modify_user.user_id" readonly disabled />
        </el-form-item>
        <el-form-item label="openid:" prop="open_id">
          <el-input v-model="modify_user.open_id" readonly disabled />
        </el-form-item>
        <el-form-item label="昵称:" prop="nicked_name">
          <el-input v-model="modify_user.nicked_name" readonly disabled />
        </el-form-item>
        <el-form-item label="性别:" prop="nicked_name">
          <el-input v-model="modify_user.nicked_name" readonly disabled />
        </el-form-item>
        <el-form-item label="国家:" prop="country">
          <el-input v-model="modify_user.country" readonly disabled />
        </el-form-item>
        <el-form-item label="省:" prop="province">
          <el-input v-model="modify_user.province" readonly disabled />
        </el-form-item>
        <el-form-item label="市:" prop="city">
          <el-input v-model="modify_user.city" readonly disabled />
        </el-form-item>
        <el-form-item label="连续签到天数:" prop="day">
          <el-input v-model="modify_user.day" readonly disabled />
        </el-form-item>
        <el-form-item label="会员信息:" prop="user_info">
          <div>普通会员，消费0元</div>
        </el-form-item>
        <el-form-item label="用户类型" prop="is_vip">
          <el-radio-group v-model="modify_user.is_vip">
            <el-radio label="0">普通</el-radio>
            <el-radio label="1">VIP</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分销权限" prop="qr_status">
          <el-radio-group v-model="modify_user.qrcode_status">
            <el-radio label="0">关闭</el-radio>
            <el-radio label="1">一级分销</el-radio>
            <el-radio label="2">二级分销</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="lock_flag" width="300px" center>
      <div class="del-dialog-cnt">您确定要删除该用户吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lock_flag = false">取 消</el-button>
        <el-button type="primary" @click="saveDelete">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 补发金豆提示窗 -->
    <el-dialog title="补发金豆" :visible.sync="goldbean_dialog" width="30%">
      <el-input v-model="goldbean_num" autocomplete="off" placeholder="请输入整数" :autofocus="true"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goldbean_dialog = false">取 消</el-button>
        <el-button type="primary" @click="goldbeanSure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 补发余额提示窗 -->
    <el-dialog title="补发余额" :visible.sync="balance_dialog" width="30%">
      <el-input v-model="balance_num" autocomplete="off" :autofocus="true"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="balance_dialog = false">取 消</el-button>
        <el-button type="primary" @click="balanceSure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改会员到期日 -->
    <el-dialog title="修改会员到期日" :visible.sync="member_dialog" width="30%">
      <el-date-picker v-model="member_date" type="date" placeholder="选择日期"></el-date-picker>
      <div slot="footer" class="dialog-footer">
        <el-button @click="member_dialog = false">取 消</el-button>
        <el-button type="primary" @click="memberSure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 会员等级修改 -->
    <el-dialog title="会员等级修改" :visible.sync="membership_dialog" width="30%">
      <el-select
        v-model="membership_type"
        placeholder="状态"
        class="mr10"
        @change="changemembershipStatus"
      >
        <el-option value="银卡" label="银卡"></el-option>
        <el-option value="金卡" label="金卡"></el-option>
        <el-option value="白金" label="白金"></el-option>
        <el-option value="钻石" label="钻石"></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="membership_dialog = false">取 消</el-button>
        <el-button type="primary" @click="membershipSure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加收货地址 -->
    <el-dialog
      title="收货地址信息"
      :visible.sync="addressVisible"
      width="50%"
      center
      @close="cancel(create_power)"
    >
      <el-form :ref="create_power" :model="create_power" :rules="rules" label-width="100px">
        <el-form-item label="收货人:" prop="warehouse_name">
          <el-input v-model="create_power.warehouse_name" placeholder="请输入收货人姓名" />
        </el-form-item>
        <el-form-item label="手机号:" prop="warehouse_phone">
          <el-input v-model="create_power.warehouse_phone" placeholder="请输入收货人手机号" />
        </el-form-item>
        <el-form-item label="选择地址" prop="address">
          <el-cascader
            :options="options"
            style="width:100%;"
            placeholder="请选择地址"
            v-model="create_power.address"
            :props="optionProps"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址:" prop="delivery_address">
          <el-input v-model="create_power.delivery_address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="身份证号:" prop="warehouse_phone">
          <el-input v-model="create_power.warehouse_peonum" placeholder="请输入收货人身份证号" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel(create_power)">取 消</el-button>
        <el-button type="primary" @click="submitForm(create_power)">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { userList, userDelete, updateUser } from "@/api/system/user/user";
import CityInfo from "@/utils/city";
export default {
  name: "userManage",
  data() {
    return {
      options: CityInfo,
      optionProps: {
        value: "region_id",
        label: "region_name",
        children: "children"
      },
      create_power: {},
      addressVisible: false,
      userDetails: [
        {
          user_id: "9"
        }
      ],
      loading: false,
      tableData: [],
      cur_page: 1,
      page_size: 30,
      select_word: "",
      lock_name: "",
      del_list: [],
      editVisible: false,
      lock_flag: false,
      modify_user: {
        is_vip: "0",
        qr_status: "0"
      },
      total: null,
      rules: {},
      total_count: {},
      coupon_type: "全部优惠券",
      goldbean_dialog: false,
      balance_dialog: false,
      member_dialog: false,
      membership_dialog: false,
      membership_type: "银卡",
      goldbean_num: "",
      balance_num: "",
      member_date: "2019-10-10"
    };
  },
  created() {
    this.initData();
  },
  computed: {
    tableTemp() {
      if (this.tableData) {
        return this.tableData.filter(d => {
          let is_del = false;
          for (let i = 0; i < this.del_list.length; i++) {
            if (d.name === this.del_list[i].name) {
              is_del = true;
              break;
            }
          }
          if (Number(d.wrong_times) >= 5) {
            d.user_status = "已锁定";
            d.lock = "解锁";
            d.icon = "el-icon-lx-unlock";
          } else {
            d.user_status = "正常";
            d.lock = "锁定";
            d.icon = "el-icon-lx-lock";
          }
          return d;
        });
      }
    }
  },
  methods: {
    changeStatus(val) {
      // console.log(val)
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.initData();
    },
    //        放开自定义条数
    handleSizeChange(val) {
      this.page_size = val;
      this.initData();
    },
    searchChange() {
      this.cur_page = 1;
      this.initData(this.select_word);
    },
    search() {
      this.cur_page = 1;
      this.initData(this.select_word);
    },
    // 渲染列表
    initData(keyword) {
      this.loading = true;
      let sendObj = {
        cur_page: this.cur_page,
        page_size: this.page_size,
        key_word: keyword ? keyword : ""
      };
      userList(sendObj)
        .then(res => {
          if (res.errno == 0) {
            this.loading = false;
            this.tableData = res.data.list;
            this.total = res.data.total - 0;
            this.total_count = res.data.total_count;
          } else {
            this.$message.error(res.errmsg);
            this.tableData = res.data.list;
            this.total = res.data.total - 0;
            this.loading = false;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    cancel(formName) {
      this.$refs[formName].resetFields();
      this.addressVisible = false;
      // this.initData();
    },
    // 创建权限 - 提交按钮
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.create_power.delivery_province = this.create_power.address[0];
          this.create_power.delivery_city = this.create_power.address[1];
          this.create_power.delivery_county = this.create_power.address[2];
          if (this.create_power.id) {
            console.log("修改", this.create_power);
            // this.submitDate(this.create_power, "PUT", "仓库修改成功");
          } else {
            console.log("创建", this.create_power);
            // this.submitDate(this.create_power, "POST", "仓库创建成功");
          }
        } else {
          this.loading = false;
        }
      });
    },
    // 修改用户信息 - 修改按钮
    handleEdit(row) {
      let id = row.audit_name;
      this.modify_user = row;
      this.editVisible = true;
    },
    // 修改用户信息 - 保存按钮
    saveEdit() {
      let sendObj = {
        user_id: this.modify_user.user_id,
        is_vip: this.modify_user.is_vip,
        qr_status: this.modify_user.qrcode_status
      };
      updateUser(sendObj)
        .then(res => {
          if (res.errno == 0) {
            this.$message.success("恭喜你，修改成功！");
            this.initData();
            this.editVisible = false;
          } else {
            this.$message.error(res.errmsg);
            this.editVisible = false;
          }
        })
        .catch(err => {});
    },
    // 点击删除
    deleteItem(row) {
      this.lock_flag = true;
      this.lock_name = row.user_id;
    },
    // 删除
    saveDelete() {
      let sendObj = { user_id: this.lock_name };
      userDelete(sendObj)
        .then(res => {
          if (res.errno == 0) {
            this.$message.success("删除用户成功");
            this.initData();
          } else {
            this.$message.error(res.errmsg);
          }
        })
        .catch(err => {});
      this.lock_flag = false;
    },
    // 用户详情
    touserDetail(row) {
      console.log(row.user_id);
    },
    // 编辑收货地址
    addressEdit() {
      this.addressVisible = true;
    },
    // 补发金豆
    goldbeanEdit() {
      this.goldbean_num = "";
      this.goldbean_dialog = true;
    },
    goldbeanSure() {
      this.goldbean_dialog = false;
      //   console.log(this.goldbean_num);
    },
    //金豆明细
    goldbeandetailClick() {
      this.$router.push({
        path: "/goldbeanDetail"
      });
    },
    //金额明细
    balanceDetailClick() {
      this.$router.push({
        path: "/balanceDetail"
      });
    },
    //补发余额
    balanceEdit() {
      this.balance_num = "";
      this.balance_dialog = true;
    },
    balanceSure() {
      this.balance_dialog = false;
      //   console.log("补发余额：",this.balance_num)
    },
    //修改会员到期日
    memberEdit() {
      //   this.member_date = "";
      this.member_dialog = true;
    },
    memberSure() {
      this.member_dialog = false;
      // console.log("修改会员到期日：",new Date(this.member_date).getTime() / 1000)
    },
    //会员等级修改
    membershipEdit() {
      //   this.member_date = "";
      this.membership_dialog = true;
    },
    membershipSure() {
      this.membership_dialog = false;
      //   console.log("修改会员等级：",this.membership_type)
    },
    changemembershipStatus(val) {}
  }
};
</script>

<style scoped>
.handle-box {
  float: left;
  margin-bottom: 20px;
}
.user-detail-title {
  float: left;
  width: 100%;
  margin-bottom: 20px;
  clear: both;
}
.user-first-title {
  float: left;
  padding-right: 2%;
}
.user-second-title {
  float: left;
  padding-right: 6%;
}
.create_account {
  float: left;
  margin-left: 40px;
}
.handle-input {
  width: 300px;
  display: inline-block;
}

.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
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
.table_title {
  font-size: 16px;
  margin-bottom: 15px;
}
.table_bot {
  margin-bottom: 20px;
}
.address_div {
  overflow: hidden;
}
.prebutton {
  margin: 5px;
}
</style>
