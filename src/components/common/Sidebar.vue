<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs&&item.subs.length>0">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item v-if="item.index == 'dashboard'" :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-s-platform",
          index: "dashboard",
          title: "首页",
        },

        {
          icon: "el-icon-s-tools",
          index: "1",
          title: "页面配置",
          subs: [
            {
              index: "EventPageList",
              title: "页面列表",
            },
          ],
        },
        {
          icon: "el-icon-s-custom",
          index: "2",
          title: "活动管理",
          subs: [
            {
              index: "activitylist",
              title: "商品列表",
            },
            {
              index: "PopularSearchTermsList",
              title: "热门搜索列表",
            },
            {
              index: "leaderboardlist",
              title: "排行榜列表",
            },
            {
              index: "priceReviewList",
              title: "价格审核",
            },
            {
              index: "purchasingReportList",
              title: "增长活动提报",
            },
            {
              index: "onefaddishList",
              title: "一元爆款列表",
            },
          ],
        },
        {
          icon: "el-icon-monitor",
          index: "3",
          title: "运营工具",
          subs: [
            {
              index: "shortlinklist",
              title: "短链接列表",
            },
            {
              index: "seekactivity",
              title: "活动搜索",
            },
            {
              index: "msgpush",
              title: "消息推送",
            },
          ],
        },
        {
          icon: "el-icon-mouse",
          index: "4",
          title: "日常配置",
          subs: [
            {
              index: "banner",
              title: "运营弹板",
            },
            {
              index: "open",
              title: "开屏配置",
            },
            {
              index: "entrance",
              title: "大促入口",
            },
            {
              index: "rotation",
              title: "banner配置",
            },
            {
              index: "couponall",
              title: "一键领取优惠券",
            },
            {
              index: "diamond",
              title: "金刚位配置",
            },
          ],
        },
        {
          icon: "el-icon-picture",
          index: "5",
          title: "商城配置",
          subs: [
            {
              index: "thousands",
              title: "千人千面配置",
            },
            {
              index: "supermarket",
              title: "海豚超市配置",
            },
            {
              index: "ucenterbrander",
              title: "个人中心广告位",
            },
            {
              index: "tasklist",
              title: "任务系统配置",
            },
          ],
        },
        {
          icon: "el-icon-user-solid",
          index: "6",
          title: "会员配置",
          subs: [
            {
              index: "seckilllist",
              title: "权益秒杀列表",
            },
          ],
        },
        {
          icon: "el-icon-s-home",
          index: "7",
          title: "权限管理",
          subs: [
            {
              index: "userlist",
              title: "用户管理列表",
            },
            {
              index: "rolelist",
              title: "角色管理列表",
            },
            {
              index: "permissionlist",
              title: "权限管理列表",
            },
          ],
        },
      ],
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },
  created() {
    // this.getMenu();
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
    });
  },
  // methods: {
  //     getMenu(){
  //         this.items = JSON.parse(localStorage.getItem('global_menu'))
  //     }
  // }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.sidebar > ul {
  height: 100%;
}
</style>
