<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="11">
                <el-card shadow="hover" class="mgb20">
                    <div class="user-info">
                        <img src="../assets/img/touxiang.gif" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">用户名: &nbsp;{{userName}}</div>
                            <br />
                            用户id: &nbsp;{{login_user_id}}
                        </div>
                    </div>
                    <!-- <div class="user-info-list">上次登录时间：<span>{{ loginTime }}</span></div> -->
                </el-card>
            </el-col>
            <el-col :span="11">
                <el-card shadow="hover" class="mgb20 ovorflot">
                    <div slot="header" class="clearfix">
                        <span>角色信息</span>
                        <!-- <el-button @click="buttest('用户信息')" style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                    </div>
                    <div class="text item">
                        <el-table :data="roles" style="width: 100%">
                            <el-table-column prop="role_id" label="角色id" align="center">
                                <template slot-scope="scope">
                                    <el-tag effect="dark" type="info">{{scope.row.role_id}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="中文名:" align="center">
                                <template slot-scope="scope">
                                    <el-tag type="">{{scope.row.name}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="desc" label="所属角色" align="center">
                                <template slot-scope="scope">
                                    <el-tag type="success">{{scope.row.desc}}</el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="40">
            <el-col :span="40">
                <el-card shadow="hover" class="mgb20">
                    <div id="pDate">
                        <span class="text">珍惜当下</span>
                        <span id="dateY"></span>
                        <span id="time"></span>
                    </div>
                    <el-calendar v-model="value" id="calendar">
                        <template slot="dateCell" slot-scope="{date, data}">
                            <p :class="data.isSelected ? 'is-selected' : ''">
                                <div>
                                    <!-- <div class="calendar-day">{{ data.day.split('-').slice(2).join('-') }}</div> -->
                                    <p :class="data.isSelected ? 'is-selected' : ''">{{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '☆' : ''}}</p>
                                    <div v-for="(item,index) in calendarData" :key="index">
                                        <div v-if="(item.months).indexOf(data.day.split('-').slice(1)[0])!=-1">
                                            <div v-if="(item.days).indexOf(data.day.split('-').slice(2).join('-'))!=-1">
                                                <el-tooltip class="itemClass" effect="dark" :content="item.things" placement="right">
                                                    <div class="is-things">{{item.things}}</div>
                                                </el-tooltip>
                                            </div>
                                            <div v-else></div>
                                        </div>
                                        <div v-else></div>
                                    </div>
                                </div>
                        </template>
                    </el-calendar>
                </el-card>
            </el-col>
        </el-row>
        <!-- 页面loading -->
        <div>
        </div>
    </div>
</template>
<script>
let moment = require("moment");
const sWeek = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
const dNow = new Date();
// const CalendarData = new Array(100);
const madd = new Array(12);
const tgString = "甲乙丙丁戊己庚辛壬癸";
const dzString = "子丑寅卯辰巳午未申酉戌亥";
const numString = "一二三四五六七八九十";
const monString = "正二三四五六七八九十冬腊";
const sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
var cYear, cMonth, cDay, TheDate;
madd[0] = 0;
madd[1] = 31;
madd[2] = 59;
madd[3] = 90;
madd[4] = 120;
madd[5] = 151;
madd[6] = 181;
madd[7] = 212;
madd[8] = 243;
madd[9] = 273;
madd[10] = 304;
madd[11] = 334;
import bus from '../components/common/bus'
import CityInfo from '@/utils/city-data.js'
import { logout, logme } from '@/api/login'
import { mapGetters, mapState } from 'vuex'
export default {
    name: 'home',
    data() {
        return {
            timer: null,  // 定时器名称
            show2: true,
            name: '',
            userInformation: '',
            outerVisible: false,
            form: {
                city: '',
                erae: '',
                minerae: '',
                selectedOptions: [],//地区筛选数组
            },
            CityInfo: CityInfo,
            city1: '',
            roles: [],
            login_user_id: '',
            userName: '',
            // 日历
            calendarData: [
                { months: ['12', '11'], days: ['15'], things: '元旦' },
                { months: ['12', '11'], days: ['23'], things: '春节' },
                { months: ['12'], days: ['02'], things: '日常工作' },
                { months: ['12'], days: ['17'], things: "学习加工作" },
                { months: ['12'], days: ['28'], things: "加班工作" }
            ],
            value: new Date()
        }
    },
    //监控data里的数据
    watch: {},
    computed: {},
    //dom实例(html)没有渲染出来前执行created()
    created() {
        logme().then(res => {
            this.roles = res.data.roles;
            this.userName = res.data.login_user_name;
            this.login_user_id = res.data.login_user_id;
            this.$store.commit('SET_USER_ID', res.data.login_user_id)
        });
    },
    //dom(html)渲染后执行mounted()
    mounted() {
        let CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);
        function GetBit(m, n) {
            return (m >> n) & 1;
        };
        function e2c() {
            TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
            var total, m, n, k;
            var isEnd = false;
            var tmp = TheDate.getFullYear();
            total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;
            if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
                total++;
            }
            for (m = 0; ; m++) {
                k = (CalendarData[m] < 0xfff) ? 11 : 12;
                for (n = k; n >= 0; n--) {
                    if (total <= 29 + GetBit(CalendarData[m], n)) {
                        isEnd = true;
                        break;
                    }
                    total = total - 29 - GetBit(CalendarData[m], n);
                }
                if (isEnd) break;
            }
            cYear = 1921 + m;
            cMonth = k - n + 1;
            cDay = total;
            if (k == 12) {
                if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
                    cMonth = 1 - cMonth;
                }
                if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
                    cMonth--;
                }
            }
        };
        /*戊戌狗年 腊月廿*/
        function GetcDateString() {
            var tmp = "";
            tmp += tgString.charAt((cYear - 4) % 10);
            tmp += dzString.charAt((cYear - 4) % 12);
            tmp += sx.charAt((cYear - 4) % 12);
            tmp += "年 ";
            if (cMonth < 1) {
                tmp += "(闰)";
                tmp += monString.charAt(-cMonth - 1);
            } else {
                tmp += monString.charAt(cMonth - 1);
            }
            tmp += "月";
            tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
            if (cDay % 10 != 0 || cDay == 10) {
                tmp += numString.charAt((cDay - 1) % 10);
            }
            return tmp;
        }
        function GetLunarDay(solarYear, solarMonth, solarDay) {
            if (solarYear < 1921 || solarYear > 2020) {
                return "";
            } else {
                solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
                e2c(solarYear, solarMonth, solarDay);
                return GetcDateString();
            }
        }
        function getFullYear(d) { // 修正firefox下year错误
            var yr = d.getYear();
            if (yr < 1000) yr += 1900;
            return yr;
        }
        /*写入页面*/
        let This = this;
        function showDate() {
            var D = new Date();
            var yy = D.getFullYear();
            var mm = D.getMonth() + 1;
            var dd = D.getDate();
            var ww = D.getDay();
            var ss = parseInt(D.getTime() / 1000);
            var h = D.getHours();
            var m = D.getMinutes();
            var s = D.getSeconds();
            let sValueYear = getFullYear(dNow) + "年" + (dNow.getMonth() + 1) + "月" + dNow.getDate() + "日";
            let sValueDate = sWeek[dNow.getDay()] + " ";
            sValueDate += GetLunarDay(yy, mm, dd);
            sValueDate += shapetime(h, m, s);
            document.getElementById("dateY").innerHTML = sValueYear;
            document.getElementById("time").innerHTML = sValueDate;
            This.timer = setTimeout(function () {
                showDate();
            }, 500);
        };
        /*格式化时间*/
        function shapetime(h, m, s) {
            if (s <= 9) s = "0" + s;
            if (m <= 9) m = "0" + m;
            if (h <= 9) h = "0" + h;
            return h + ":" + m + ":" + s
        }
        window.onload = showDate;
    },
    methods: {

    },
    // vue 过滤器
    filters: {
        myAddressCity(value) {
            for (let y in CityInfo) {
                if (CityInfo[y].value == value) {
                    return value = CityInfo[y].label
                }
            }
        },
        myAddressErae(value) {
            for (let y in CityInfo) {
                for (let z in CityInfo[y].children) {
                    if (CityInfo[y].children[z].value == value && value != undefined) {
                        return value = CityInfo[y].children[z].label;
                    }
                }
            }
        },
        myAddressMinerae(value) {
            for (let y in CityInfo) {
                for (let z in CityInfo[y].children) {
                    for (let i in CityInfo[y].children[z].children) {
                        if (CityInfo[y].children[z].children[i].value == value && value != undefined) {
                            return value = CityInfo[y].children[z].children[i].label
                        }
                    }
                }
            }
        },
    },
    beforeDestroy() {
        clearImmediate(this.timer);
        // this.$once('hook:beforeDestroy', () => {
        // })
    },
}
</script>
<style scoped lang="scss">
.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    // border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}
.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}
.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}
.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}
.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}
.user-info-list span {
    margin-left: 70px;
}
.mgb20 {
    margin-bottom: 20px;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;
}

.box-card {
    width: 480px;
}
.transition-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #409eff;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    margin-right: 20px;
}
/* dialog动画效果 */
.dialog-fade-enter-active .el-dialog.way {
    animation: anim-open 0.3s;
}
.dialog-fade-leave-active .el-dialog.way {
    animation: anim-close 0.3s;
}
@keyframes anim-open {
    0% {
        transform: translate3d(100%, 0, 0);
        opacity: 0;
    }
    100% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
}
@keyframes anim-close {
    0% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
    100% {
        transform: translate3d(100%, 0, 0);
        opacity: 0;
    }
}
.calendar-day {
    text-align: center;
    color: #202535;
    line-height: 30px;
    font-size: 12px;
}
.is-selected {
    color: #409eff;
    font-size: 18px;
    margin-top: 5px;
}
.is-things {
    color: #f8a535;
    font-size: 10px;
    margin-top: 5px;
}
#calendar
    .el-button-group
    > .el-button:not(:first-child):not(:last-child):after {
    content: "当月";
}
// 时钟
#pDate {
    font-family: "Microsoft YaHei", "Lantinghei SC", "Open Sans", Arial,
        "Hiragino Sans GB", "STHeiti", "WenQuanYi Micro Hei", "SimSun",
        sans-serif;
    color: #606266;
    // text-align: center;
    // position: absolute;
    // left: 50%;
    // top: 50%;
    // -webkit-transform: translate(-50%, -50%);
    // transform: translate(-50%, -50%);
    // text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
}
#pDate #time {
    letter-spacing: 0.05em;
    font-size: 20px;
    padding: 5px 0;
}
#pDate #date {
    letter-spacing: 0.1em;
    font-size: 12px;
}
#pDate .text {
    letter-spacing: 0.1em;
    font-size: 12px;
    padding: 20px 0 0;
}
</style>
