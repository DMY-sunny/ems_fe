<template>
    <div>
        <!-- 头部按钮区域 -->
        <div class="heder">
            <div>
                <el-button type="warning" @click="(isFold = !isFold)">一键{{isFold ? "展开" : "折叠" }}模块</el-button>
                <el-button type="success" size="mini" @click="handleSaoma">扫码预览</el-button>
                <el-button icon="el-icon-copy-document" type="info" size="mini" @click="saveData('2')">复制页面</el-button>
                <el-button icon="el-icon-notebook-2" type="danger" size="mini" :disabled="template.side_navs.length > 0" @click="newTemplate(12),redactVSadd=1">添加侧边栏</el-button>
            </div>
            <div class="hederAddBut">
                <el-button type="warning" @click="newTemplate(1,0,true)">新增模块</el-button>
            </div>
            <div class="hederSaveBut">
                <el-button icon="el-icon-edit" type="primary" @click="isShowForm = 0">页面基础配置</el-button>
                <el-button icon="el-icon-check" type="success" @click.stop="saveData">保存数据</el-button>
            </div>
        </div>
        <!-- 模块区域 -->
        <div class="content">
            <div class="disBorder" :style="dynamicBg()">
                <!-- 侧边栏导航模块 -->
                <div class="moban_item">
                    <div v-if="!isFold && template.side_navs.length" class="navigation border_dashed" :style="`background-color: ${template.side_navs_bg_color};color: ${template.side_navs_color};`">
                        <div v-for="(side,index) in template.side_navs" :key="'side'+index" class="navigation_box" @click="newTemplate(13),redactVSadd=1">
                            <span class="navigation_title">
                                <div style="width: 80px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                                    {{side.text}}
                                </div>
                            </span>
                        </div>
                    </div>
                    <div v-if="!isFold && template.side_navs.length" class="workButton">
                        <div v-if="!isFold">
                            <el-button type="danger" @click="newTemplate(12),redactVSadd=1">修改侧边栏</el-button>
                        </div>
                    </div>
                </div>
                <draggable v-model="template.m" @update="datadragEnd" :options="{animation:500}" :style="sizeFun('data')" handle=".handle">
                    <div class="moban_item" v-for="(data,index) in template.m" :key="'item-'+index" @clik.prevent="removalEvent">
                        <!-- 拖拽区 -->
                        <div draggable="true">
                            <!-- 导航模块 -->
                            <div v-if="isFold && data.module_type == 4" class="foldMod"><span>{{data.module_title}}</span></div>
                            <div v-else-if="data.module_type == 4" :ref="data.fe_module_id" class="navigation border_dashed" :style="`background-color: ${data.background_color};color: ${data.font_def_color};`">
                                <div v-for="(datam,index) in data.navs" :key="'datam'+index" class="navigation_int" @click="navsHover(index)" :style="colorControl(index)">
                                    <i :class="'iconfont '+datam.icon" class="svg_icon_daohang"></i>
                                    <div>{{datam.title}}</div>
                                    <div v-if="data.navigation_type==='double'">{{datam.title2}}</div>
                                </div>
                            </div>
                            <!-- 图片热区模快 -->
                            <div v-if="isFold && data.module_type == 1" class="foldMod"><span>{{data.module_title}}</span></div>
                            <div v-else-if="data.module_type == 1" class="border_dashed" style="position: relative;overflow: hidden;" :ref="data.fe_module_id" :class="data.fe_module_id">
                                <div @click="hotItem(form_data,data,index)" @mousedown.stop="moveStop" v-for="(form_data,index) in data.areas" :key="index" class="HotZone_box" :style="HotZone_style(form_data)">
                                    <img v-if="form_data.base64_url" :src="form_data.base64_url" width="100%" height="100%" alt="">
                                    <img v-else :src="cdn06+form_data.gif" width="100%" height="100%" alt="">
                                </div>
                                <img v-if="data.base64_url" ref="img_height" @clik="removalEvent" class="HotZone_img" :src="data.base64_url" @load="initSet(data,index,'')" />
                                <img v-else ref="img_height" @clik="removalEvent" class="HotZone_img" :src="cdn06 + data.background" @load="initSet(data,index,'')" />
                            </div>
                            <!-- 轮播热区模快 -->
                            <div v-if="isFold && data.module_type == 18" class="foldMod"><span>{{data.module_title}}</span></div>
                            <div v-else-if="data.module_type == 18" class="border_dashed" style="position: relative;overflow: hidden;">
                                <div v-for="(item,i) in data.picture_list" :key="i" :ref="item.fe_module_id" :class="item.fe_module_id">
                                    <template v-if="i===texthotIndex">
                                        <div v-for="(form_data,index) in item.areas" :key="index" class="HotZone_box" @click="hotItem(form_data,data,index,item)" @mousedown.stop="moveStop" :style="HotZone_style(form_data)">
                                            <img :src="cdn06+form_data.gif" width="100%" height="100%" alt="">
                                        </div>
                                        <img ref="img_height" @clik="removalEvent" @load="initSet(data,index,item)" class="HotZone_img" :src="cdn06 + item.background" />
                                    </template>
                                </div>
                            </div>
                            <!-- 商品模块 -->
                            <div v-if="isFold && data.module_type == 2 || isFold && data.module_type == 8 || isFold && data.module_type == 21" class="foldMod"><span>{{data.module_title}}</span></div>
                            <commodityTool v-else-if="data.module_type === 2 || data.module_type === 8 || data.module_type == 21" :ref="data.fe_module_id" :class="data.fe_module_id" :commodityTool="data" class="border_dashed"></commodityTool>
                            <!-- 轮播图模快 -->
                            <div v-if="isFold && data.module_type == 3 || isFold && data.module_type == 22" class="foldMod"><span>{{data.module_title}}</span></div>
                            <div v-else-if="data.module_type == 3 && data.length !== 0 || data.module_type == 22 && data.length !== 0" :ref="data.fe_module_id" id="carouselMap" class="border_dashed" :class="data.fe_module_id">
                                <div v-for="(map,index) in data.picture_list" :key="'map'+index" @click="hotMap(map,data,index)" class="carouselMap_box">
                                    <img v-if="map.base64_url" ref="img_height" style="cursor:pointer;width:100%" @clik.prevent :src="map.base64_url" />
                                    <img v-else ref="img_height" style="cursor:pointer;width:100%" @clik.prevent :src="cdn06 + map.img_url" />
                                </div>
                            </div>
                            <!-- 倒计时模块 -->
                            <div v-if="isFold && data.module_type == 5" class="foldMod"><span>{{data.module_title}}</span></div>
                            <div v-else-if="data.module_type == 5" class="border_dashed" :class="data.fe_module_id" :ref="data.fe_module_id" style="width:562.5px;overflow-x: auto;" :style="`background-color: ${data.djs_bg_color_def};`">
                                <div v-for="(item,index) in data.time_list" :key="'item9'+index" @click.stop="onCounBut(item,data,index)" :style="colorCounBut(index,item)" style="width:281.25px;vertical-align: middle;overflow: hidden;background-size:cover;display:inline-block;cursor:pointer;">
                                    <div style="margin: 0 auto;text-align: center;height:50px;line-height: 50px;">
                                        <el-divider direction="vertical"></el-divider>
                                        <span>{{item.countdown_time}}</span>
                                        <el-divider direction="vertical"></el-divider>
                                    </div>
                                </div>
                                <div v-for="(item,index) in data.time_list" :key="'item'+index" style="vertical-align: middle;overflow: hidden;background-size:cover;">
                                    <commodityTool v-show="isShowCountdown_commod === index" :commodityTool="item"></commodityTool>
                                </div>
                            </div>
                            <!-- 弹幕轮播模块 -->
                            <div v-if="isFold && data.module_type == 6" class="foldMod"><span>{{data.module_title}}</span></div>
                            <div v-else-if="data.module_type == 6" :ref="data.fe_module_id" class="border_dashed danmuclass" :class="data.fe_module_id">
                                <div @mousedown.stop="danmuDrag" :style="dragStyle(data,index,'danmu')" class="mosedow_rag" v-if="showdanmu">
                                    鼠标按住白色区域即可拖拽
                                </div>
                                <div v-else :style="dragStyle(data,index,'danmu')">
                                    <div v-for="(datam,index) in data.list" :key="'datam'+index" @click="clickBarrage(datam,data,index)" class="barrage_box" :style="colorBarrage(datam,index)">
                                        <img style="width: 200px;" v-if="datam.type === 'img'" :src="datam.type_value" alt="加载失败">
                                        <span v-else style="width: 80px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; letter-spacing:3px">{{datam.type_value}}</span>
                                        <img src="../../assets/img/Oval.png" alt="">
                                    </div>
                                </div>
                                <img style="overflow: hidden;" @clik="removalEvent" class="HotZone_img" :src="cdn06+data.background" />
                            </div>
                            <!-- tab商品模块 -->
                            <div v-if="isFold && data.module_type == 7" class="foldMod"><span>{{data.module_title}}</span></div>
                            <div v-else-if="data.module_type == 7" class="border_dashed" :class="data.fe_module_id" :ref="data.fe_module_id" style="width:562.5px;overflow-x: auto;" :style="`background-color: ${data.djs_bg_color_def};`">
                                <div v-for="(item,index) in data.list" :key="'iteminde'+index" @click.stop="onTABcommod(item,data,index)" :style="colorTABBut(index,item)" class="navigation_int">
                                    <i :class="'iconfont '+item.icon" class="svg_icon_daohang"></i>
                                    <div>
                                        {{item.title}}
                                    </div>
                                    <div v-if="data.navigation_type==='double'">{{item.title2}}</div>
                                </div>
                                <div v-for="(item,index) in data.list" :key="'item'+index" style="vertical-align: middle;overflow: hidden;background-size:cover;">
                                    <commodityTool v-show="isShowTAB_commod === index" :commodityTool="item"></commodityTool>
                                </div>
                            </div>
                            <!-- 优惠券模块 -->
                            <div v-if="isFold && data.module_type == 9 || isFold && data.module_type == 11 || isFold && data.module_type == 20" class="foldMod"><span>{{data.module_title}}</span></div>
                            <div v-else-if="data.module_type == 9" class="couponCla border_dashed">
                                <div v-for="(coupon,index) in data.list" :key="'coupon'+index" @click="couponClick(coupon,data,index)">
                                    <div class="couponClaSingle">
                                        <div class="couponPrice">
                                            <div class="price_rmb">
                                                <span>￥</span>
                                                <span style="font-size: 30px;color: #FE0F40">{{coupon.price}}</span>
                                            </div>
                                            <div class="price_spa">
                                                <div class="Group">{{coupon.name}}</div>
                                                <em class="priceText">{{coupon.desc}}</em>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="data.module_type == 11 || data.module_type == 20" class="couponCla_yijian border_dashed">
                                <img @click="yijianlingqu(data)" style="overflow: hidden;" class="HotZone_img" :src="cdn06+data.before_img" />
                            </div>
                            <!-- 爆款推荐模快 -->
                            <div v-if="isFold && data.module_type == 10 || isFold && data.module_type == 13" class="foldMod"><span>{{data.module_title}}</span></div>
                            <div v-else-if="data.module_type == 10 && data.length !== 0 || data.module_type == 13 && data.length !== 0" :ref="data.fe_module_id" id="carouselMap" class="border_dashed" :class="data.fe_module_id">
                                <div v-for="(map,index) in data.picture_list" :key="'map'+index" @click="recoCurrent(map,data,index)" class="carouselMap_box">
                                    <div>
                                        <img ref="img_height" style="cursor:pointer;width:100%" @clik.prevent :src="cdn06 + map.img_url" />
                                    </div>
                                </div>
                            </div>
                            <!-- 爆款v3推荐模快 -->
                            <div v-if="isFold && data.module_type == 16" class="foldMod"><span>{{data.module_title}}</span></div>
                            <div v-else-if="data.module_type == 16" :ref="data.fe_module_id" id="carouselMapX" class="border_dashed" :class="data.fe_module_id">
                                <div v-for="(map,index) in data.picture_list" :key="'item9'+index" @click.stop="onRecChuildBut(map,data,index)" class="recChuildclass">
                                    <div :style="colorRecChuildBut(index,map)" style="width:281.25px;cursor:pointer;">
                                        <div style="margin: 0 auto;text-align: center;">
                                            <el-divider direction="vertical"></el-divider>
                                            <span>开始：{{formatTime(map.begin_ts)}}</span>
                                            <el-divider direction="vertical"></el-divider>
                                        </div>
                                        <div style="margin: 0 auto;text-align: center;">
                                            <el-divider direction="vertical"></el-divider>
                                            <span>结束：{{formatTime(map.end_ts)}}</span>
                                            <el-divider direction="vertical"></el-divider>
                                        </div>
                                    </div>
                                    <div class="recchuildTemplate" v-if="isShowRecChuild===index">
                                        <div v-for="(item,index) in map.list" :key="'item'+index" @click.stop="recoChuildCurrent(item,map,data,index)" class="crechuild">
                                            <img ref="img_height" style="cursor:pointer;width:100%;height:60px;" @clik.prevent :src="cdn06 + item.img_url" />
                                        </div>
                                    </div>
                                    <div class="recchuildTemplate" v-else>
                                        <div style="height:90px;"></div>
                                    </div>
                                </div>
                            </div>
                            <!-- 爆款v4推荐模快 -->
                            <div v-if="isFold && data.module_type == 17" class="foldMod"><span>{{data.module_title}}</span></div>
                            <div v-else-if="data.module_type == 17" :ref="data.fe_module_id" id="carouselMapX" class="border_dashed" :class="data.fe_module_id">
                                <div v-for="(map,index) in data.picture_list" :key="'item9'+index" @click.stop="onRecChuildBut(map,data,index)" class="recChuildclass">
                                    <div :style="colorRecChuildBut(index,map)" style="width:281.25px;cursor:pointer;">
                                        <div style="margin: 0 auto;text-align: center;">
                                            <el-divider direction="vertical"></el-divider>
                                            <span>开始：{{formatTime(map.begin_ts)}}</span>
                                            <el-divider direction="vertical"></el-divider>
                                        </div>
                                        <div style="margin: 0 auto;text-align: center;">
                                            <el-divider direction="vertical"></el-divider>
                                            <span>结束：{{formatTime(map.end_ts)}}</span>
                                            <el-divider direction="vertical"></el-divider>
                                        </div>
                                    </div>
                                    <div class="recchuildTemplate" v-if="isShowRecChuild===index">
                                        <div class="crechuild">
                                            <img ref="img_height" style="cursor:pointer;width:100%;height:60px;" @clik.prevent :src="cdn06 + map.background" />
                                        </div>
                                    </div>
                                    <div class="recchuildTemplate" v-else>
                                        <div style="height:90px;"></div>
                                    </div>
                                </div>
                            </div>
                            <!-- 标题分类 模块 -->
                            <div v-if="isFold && data.module_type == 12" class="foldMod"><span>{{data.module_title}}</span></div>
                            <div v-else-if="data.module_type == 12" class="border_dashed">
                                <div class="titleClassW" :style="titleClassStyle(data)">
                                    <i :class="'iconfont '+data.icon" class="svg_icon"></i>
                                    <div class="titleCmargin">{{data.title}}</div>
                                    <i :class="'iconfont '+data.icon" class="svg_icon"></i>
                                </div>
                            </div>
                            <!-- 文字噱头 模块 -->
                            <div v-if="isFold && data.module_type == 14" class="foldMod"><span>{{data.module_title}}</span></div>
                            <div v-else-if="data.module_type == 14" :ref="data.fe_module_id" class="border_dashed danmuclass" :class="data.fe_module_id">
                                <div @mousedown.stop="wenziDrag" :style="dragStyle(data,index,'wenzi')" class="mosedow_rag" v-if="showdanmu">
                                    点击白色区域即可拖拽
                                </div>
                                <div v-else :style="dragStyle(data,index,'wenzi')">
                                    <div v-for="(datam,index) in data.list" :key="'datam'+index">
                                        <img v-show="texthotIndex === index" style="width:100%" :src="cdn06+datam.img_url" alt="加载失败">
                                    </div>
                                </div>
                                <img style="overflow: hidden;" @clik="removalEvent" class="HotZone_img" :src="cdn06+data.background" />
                            </div>
                            <!-- 时间轴 模块 -->
                            <div v-if="isFold && data.module_type == 15" class="foldMod"><span>{{data.module_title}}</span></div>
                            <div v-else-if="data.module_type == 15" :ref="data.fe_module_id" class="border_dashed danmuclass" :class="data.fe_module_id" :style="`background-color: ${data.bg_def_color};color: ${data.font_def_color};display:flex`">
                                <div class="time_aixs" v-for="(item,index) in data.list" :key="index" @click.stop="onTimeline(item,data,index)" :style="colortimelineBut(item,index)">
                                    <p class="line"></p>
                                    <div class="time_aixs_box">
                                        <div class="time_aix_red">
                                            <p class="dot"></p>
                                            <p class="text_top">{{item.date}}</p>
                                            <p class="text_bottom">{{item.title}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 限时抢 模块 -->
                            <div v-if="isFold && data.module_type == 19" class="foldMod"><span>{{data.module_title}}</span></div>
                            <div v-else-if="data.module_type == 19" :ref="data.fe_module_id" id="carouselMapX" class="border_dashed" :class="data.fe_module_id">
                                <div v-for="(map,index) in data.picture_list" :key="'item9'+index" @click.stop="limitedtimeImg(map,data,index)" class="recChuildclass">
                                    <div style="width:281.25px;cursor:pointer;">
                                        <div style="margin: 0 auto;text-align: center;">
                                            <el-divider direction="vertical"></el-divider>
                                            <span>开始：{{formatTime(map.begin_ts)}}</span>
                                            <el-divider direction="vertical"></el-divider>
                                        </div>
                                        <div style="margin: 0 auto;text-align: center;">
                                            <el-divider direction="vertical"></el-divider>
                                            <span>结束：{{formatTime(map.end_ts)}}</span>
                                            <el-divider direction="vertical"></el-divider>
                                        </div>
                                        <div class="recchuildTemplate" v-if="isShowRecChuild===index">
                                            <img ref="before_img" style="cursor:pointer;width:140px" @clik.prevent :src="cdn06 + map.before_img" />
                                            <img ref="after_img" style="cursor:pointer;width:140px" @clik.prevent :src="cdn06 + map.after_img" />
                                        </div>
                                        <div class="recchuildTemplate" v-else>
                                            <div style="height:90px;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 工作按钮区域  -->
                        <div class="workButton">
                            <div v-if="!isFold">
                                <el-button type="primary" @click="templateItem(data,index)">修改模块</el-button>
                            </div>
                            <div v-if="isFold">
                                <el-button type="success" icon="el-icon-rank" class="handle"></el-button>
                            </div>
                            <div v-if="!isFold">
                                <el-button type="success" @click="newTemplate(1,index,false)">插入模块</el-button>
                            </div>
                        </div>
                    </div>
                    <!-- </transition-group> -->
                </draggable>
            </div>
            <!-- 工作区表单区域 -->
            <!-- 基本页面配置信息 -->
            <div v-bind:style="{ width: myWidth}" class="right_form" v-show="isShowForm === 0">
                <el-alert title="页面基础配置信息" show-icon="" effect="dark" type="info"></el-alert>
                <el-form class="height500" v-bind:style="{height: myHeight}" ref="template" :model="template" size="mini" label-width="120px">
                    <el-form-item label="活动名称">
                        <el-input v-model="template.title" placeholder="请输入活动名称"></el-input>
                    </el-form-item>
                    <el-form-item label="显示倒计时">
                        <el-radio-group v-model="template.is_countdown">
                            <el-radio :label="0" border>否</el-radio>
                            <el-radio :label="1" border>是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="显示红包雨">
                        <el-radio-group v-model="template.is_redenvelope">
                            <el-radio :label="0" border>否</el-radio>
                            <el-radio :label="1" border>是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="begin_ts">
                        <el-date-picker v-model="template.begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="finish_ts">
                        <el-date-picker v-model="template.finish_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="按钮开关">
                        <el-checkbox v-model="template.show_top_btn">置顶按钮显示</el-checkbox>
                    </el-form-item>
                    <el-form-item label="广告开关">
                        <el-checkbox v-model="template.show_bottom_ad">商品广告显示</el-checkbox>
                    </el-form-item>
                    <el-form-item label="背景图片" prop="background">
                        <pic-upload :limit="1" v-model="template.background" />
                    </el-form-item>
                    <el-form-item label="填写备注">
                        <el-input v-model="template.remark" placeholder="请输入备注-不用于前端显示"></el-input>
                    </el-form-item>
                    <el-form-item label="分享图片" prop="share_pic">
                        <pic-upload v-model="template.share_pic" />
                    </el-form-item>
                    <el-form-item label="分享文案" prop="share_desc">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="分享文案" v-model="template.share_desc"></el-input>
                    </el-form-item>
                    <el-alert title="以下为商品通用配置" show-icon="" type="error"></el-alert>
                    <el-form-item :label="template.extend_goods.is_warn === 1?'未提醒修饰图':'修饰图上传'" prop="embellish_img">
                        <pic-upload v-model="template.extend_goods.embellish_img" />
                    </el-form-item>
                    <el-form-item v-if="template.extend_goods.embellish_img">
                        <el-button type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('template','extend_goods','embellish_img')">删除{{template.extend_goods.is_warn === 1?'未提醒':'修饰图'}}</el-button>
                    </el-form-item>
                    <el-form-item v-show="template.extend_goods.is_warn === 1" label="已提醒修饰图" prop="embellish_img2">
                        <pic-upload v-model="template.extend_goods.embellish_img2" />
                    </el-form-item>
                    <el-form-item v-if="template.extend_goods.embellish_img2&&template.extend_goods.is_warn===1">
                        <el-button type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('template','extend_goods','embellish_img2')">删除已提醒</el-button>
                    </el-form-item>
                    <el-form-item label="商品提醒">
                        <el-radio-group v-model="template.extend_goods.is_warn">
                            <el-radio :label="0" border>关闭</el-radio>
                            <el-radio :label="1" border>开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="显示列数" prop="template">
                        <el-radio-group v-model="template.extend_goods.template">
                            <el-radio-button label="rows_1">单列</el-radio-button>
                            <el-radio-button label="rows_2">双列</el-radio-button>
                            <el-radio-button label="rows_3">三列</el-radio-button>
                            <el-radio-button label="rows_4">双排</el-radio-button>
                            <el-radio-button label="rows_5">单排</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="template.extend_goods.embellish_img" class="image_placeholder">
                        <p style="color:red;"><i class="el-icon-bottom"></i> 点击图片可查看大图</p>
                        <div class="block" v-show="template.extend_goods.is_warn !== 1">
                            <p class="demonstration">模板一</p>
                            <el-image v-for="(url, index) in urls" :key="index" v-show="template.extend_goods.template=='rows_'+(index+1)" class="w100h100" :src="url" :preview-src-list="getSrcList(index , 'urls')"></el-image>
                        </div>
                        <div v-show="template.extend_goods.template!=='rows_3'&&template.extend_goods.template!=='rows_4'&&template.extend_goods.template!=='rows_5'&&template.extend_goods.is_warn !== 1" class="block">
                            <p class="demonstration">模板二</p>
                            <el-image v-for="(url, index) in urls2" :key="index" v-show="template.extend_goods.template=='rows_'+(index+1)" class="w100h100" :src="url" :preview-src-list="getSrcList(index , 'urls2')"></el-image>
                        </div>
                        <div class="block">
                            <p class="demonstration">模板三</p>
                            <el-image v-for="(url, index) in urls3" :key="index" v-show="template.extend_goods.template=='rows_'+(index+1)" class="w100h100" :src="url" :preview-src-list="getSrcList(index , 'urls3')"></el-image>
                        </div>
                    </div>
                    <el-form-item v-if="template.extend_goods.embellish_img" label="选择模板">
                        <el-radio-group v-model="template.extend_goods.m_type">
                            <el-radio v-show="template.extend_goods.is_warn !== 1" :label="1" border>模板一</el-radio>
                            <el-radio v-show="template.extend_goods.template!=='rows_3'&&template.extend_goods.template!=='rows_4'&&template.extend_goods.template!=='rows_5'&&template.extend_goods.is_warn !== 1" :label="2" border>模板二</el-radio>
                            <el-radio :label="3" border>模板三</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="!template.extend_goods.embellish_img" label="价格文字" prop="price_text">
                        <el-input v-model="template.extend_goods.price_text" maxlength="5" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="背景颜色" prop="background_color">
                        <el-color-picker v-model="template.background_color"></el-color-picker>
                    </el-form-item>
                    <div v-if="template.extend_goods.embellish_img && template.extend_goods.m_type !== 3">
                        <el-form-item label="标题颜色" v-if="template.extend_goods.template!=='rows_1'">
                            <el-color-picker v-model="template.extend_goods.title_color"></el-color-picker>
                        </el-form-item>
                        <el-form-item label="价格颜色">
                            <el-color-picker v-model="template.extend_goods.price_color"></el-color-picker>
                        </el-form-item>
                    </div>
                    <el-form-item label="价格颜色" v-else>
                        <el-color-picker v-model="template.extend_goods.price_bg_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="商品角标" prop="subscript_pic">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="template.extend_goods.subscript_pic" />
                    </el-form-item>
                    <el-form-item v-if="template.extend_goods.subscript_pic">
                        <el-button type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('template','extend_goods','subscript_pic')">删除当前图片</el-button>
                    </el-form-item>
                    <el-form-item label="角标位置">
                        <el-radio-group v-model="template.extend_goods.position">
                            <el-radio-button v-if="!template.extend_goods.show_logo" label="0">左上</el-radio-button>
                            <el-radio-button v-if="template.extend_goods.template !== 'rows_1'" label="1">右上</el-radio-button>
                            <el-radio-button label="2">左下</el-radio-button>
                            <el-radio-button v-if="template.extend_goods.template !== 'rows_1'" label="3">右下</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="查看更多字体颜色" prop="show_more_font_color">
                        <el-color-picker v-model="template.show_more_font_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="查看更多背景颜色" prop="show_more_bg_color">
                        <el-color-picker v-model="template.show_more_bg_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="更新已配置">
                        <el-button icon="el-icon-refresh-left" type="success" @click="goodsUpdate">更新配置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 热区模块-->
            <div class="right_form" v-show="isShowForm === 3">
                <el-alert title="热区模块-一级表单" show-icon="" effect="dark" type="info"></el-alert>
                <el-form class="height500" v-bind:style="{ width: myWidth,height: myHeight}" :rules="rules" ref="form" :model="form" size="mini" label-width="100px">
                    <el-form-item label="模块名称" prop="module_title">
                        <el-input v-model="form.module_title"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="show_begin_ts">
                        <el-date-picker v-model="form.show_begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="show_end_ts">
                        <el-date-picker v-model="form.show_end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="添加图片" prop="background">
                        <pic-upload v-model="form.background" :msg.sync="parentMsg" :back_height.sync="backHeight" />
                    </el-form-item>
                    <el-form-item v-if="redactVSadd===2" label="批量上传">
                        <multi-pic-upload :limit='10' v-model="materialPics" />
                    </el-form-item>
                    <el-form-item label="显示选择">
                        <el-checkbox-group v-model="form.show_mode">
                            <el-checkbox v-for="city in cities_hot" :label="city.value" :key="city.value">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="moban('form')">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                        <el-button v-if="redactVSadd===2" type="warning" @click="batchMoban">批量创建模块</el-button>
                        <el-button v-if="redactVSadd===1" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai">删除当前模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 热区list-->
            <div class="right_form" v-show="isShowForm === 5">
                <el-alert :title="`${hot_type}--二级表单`" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" class="height500" ref="form_data" :model="form_data" size="mini" label-width="120px">
                    <el-form-item label="热区名称" prop="name">
                        <el-input v-model="form_data.name"></el-input>
                    </el-form-item>
                    <el-form-item label="添加图片" prop="background">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="form_data.gif" />
                    </el-form-item>
                    <el-form-item label="热区事件">
                        <el-select label="事件类型" v-model="form_data.event_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in operatorList" :key="'event_type-'+index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="链接类型" v-show="form_data.event_type!=='anchor'">
                        <el-select v-model="form_data.link_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in listType" :key="'link_type-'+index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品类型" v-show="form_data.link_type==='1'&&form_data.event_type!=='anchor'">
                        <el-select v-model="form_data.goods_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in goodsType" :key="'goods_type-'+index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动类型" v-show="form_data.link_type==='1' && form_data.goods_type ==='act_goods'&&form_data.event_type!=='anchor' || form_data.link_type==='3' && form_data.goods_type ==='act_goods'&&form_data.event_type!=='anchor'">
                        <el-select v-model="form_data.act_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in act_type" :key="'act_type-'+index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="锚点定位" v-show="form_data.event_type==='anchor'">
                        <el-select v-model="form_data.jmp">
                            <el-option v-for="item in filterM" :key="item.fe_module_id" :label="item.module_title" :value="item.fe_module_id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动 I D" v-show="form_data.link_type==='1' && form_data.goods_type ==='act_goods' &&form_data.event_type!=='anchor'|| form_data.link_type==='3' && form_data.goods_type ==='act_goods'&&form_data.event_type!=='anchor'" prop="act_id">
                        <el-input v-model="form_data.act_id"></el-input>
                    </el-form-item>
                    <el-form-item label="GOODS_ID" v-show="form_data.link_type==='1'&&form_data.event_type!=='anchor'" prop="goods_id">
                        <el-input v-model="form_data.goods_id"></el-input>
                    </el-form-item>
                    <el-form-item label="H5链接" v-show="form_data.link_type==='2'&&form_data.event_type!=='anchor'" prop="url_h5" :rules="[{required: true,message:'请输入H5链接',trigger:'blur'},{pattern:/\/dist/,message:'H5链接类型有误',trigger:'blur'}]">
                        <el-input v-model.trim="form_data.url_h5"></el-input>
                    </el-form-item>
                    <el-form-item label="小程序链接" v-show="form_data.link_type==='2'&&form_data.event_type!=='anchor'" prop="url_xcx" :rules="[{required:true,message:'请输入小程序链接',trigger:'blur'},{pattern:/\/pages/,message:'小程序链接类型有误',trigger:'blur'}]">
                        <el-input v-model.trim="form_data.url_xcx"></el-input>
                    </el-form-item>
                    <el-form-item label="是否置灰" prop="show_disable_tips">
                        <el-switch v-model="form_data.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
                    </el-form-item>
                    <el-form-item v-if="form_data.show_disable_tips" label="置灰文案" prop="disable_tips">
                        <el-input v-model="form_data.disable_tips"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-edit" type="primary" @click="requBut(form_data)">{{this.redactVSadd ===1?'修改':this.redactVSadd ===0?'创建':''}}{{hot_type}}</el-button>
                        <el-button v-if="redactVSadd===1" type="primary" size="mini" @click.stop="DeleteRequ(form_data)">删除热区</el-button>
                    </el-form-item>
                    <el-alert title="热区之间不可重叠，重叠会导致数据混乱！" type="error"></el-alert>
                </el-form>
            </div>
            <!-- 侧边栏导航模块 -->
            <div class="right_form" v-show="isShowForm === 12">
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" label-width="110px" ref="template" :model="template" class="height500">
                    <el-form-item label="是否展示侧边栏">
                        <el-checkbox v-model="template.side_navs_show"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="侧边导航大按钮文案">
                        <el-input v-model="template.side_navs_text"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="sideBut(0)">设置侧边栏</el-button>
                        <el-button type="danger" size="mini" @click.stop="sideBut(1)">删除模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 侧边栏导航模块list -->
            <div class="right_form" v-show="isShowForm === 13">
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" class="height500" ref="sideNavs" :model="sideNavs" size="mini" label-width="150px">
                    <div>
                        <ul>
                            <draggable v-model="template.side_navs" @update="datadragEnd" :options="{animation:500}" :style="sizeFun('data')" handle=".handle">
                                <li v-for="(tab,index) in template.side_navs" :key="'navs'+index" style="display:flex;height:35px">
                                    <el-button type="warning" icon="el-icon-rank" class="handle" circle></el-button>
                                    <el-input placeholder="导航名称" v-model="tab.text"></el-input>
                                    <span style="white-space:nowrap;"><i style="line-height:2" class="el-icon-right"></i></span>
                                    <el-input placeholder="跳转H5" v-model.lazy.trim="tab.url_h5"></el-input>
                                    <el-input placeholder="跳转小程序" v-model.lazy.trim="tab.url_xcx"></el-input>
                                    <el-button icon="el-icon-delete-solid" type="danger" @click="deleteSideNavs(index)" circle></el-button>
                                    <el-button class="ml0" icon="el-icon-circle-plus" type="success" @click="sideNavsBut(tab,index)" circle></el-button>
                                </li>
                            </draggable>
                        </ul>
                    </div>
                </el-form>
                <el-button v-if="isINavsBut === 1" type="primary" @click="sideNavsBut(1)">添加导航</el-button>
            </div>
            <!-- 导航模块 -->
            <div class="right_form height500" v-bind:style="{ width: myWidth,height: myHeight}" v-show="isShowForm === 2">
                <el-alert title="导航模块" show-icon="" effect="dark" type="info"></el-alert>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="导航模块" name="navigation"></el-tab-pane>
                    <el-tab-pane label="外观" name="naviExterior"></el-tab-pane>
                    <el-tab-pane label="显示" name="naviDisplay"></el-tab-pane>
                </el-tabs>
                <el-form ref="temp_extends" :model="temp_extends" size="mini" label-width="120px">
                    <div v-show="isShowFormNavs === '0'">
                        <ul>
                            <draggable v-model="temp_extends.navs" @update="datadragEnd" :options="{animation:500}" :style="sizeFun('data')" handle=".handle">
                                <li v-for="(tab,index) in temp_extends.navs" :key="'navs'+index" style="display:flex;height:35px">
                                    <el-button type="warning" icon="el-icon-rank" class="handle" size="mini" circle></el-button>
                                    <el-input @change="singleCheng" v-model="tab.title" :maxlength="temp_extends.navigation_type==='double'?'5':'8'" show-word-limit></el-input>
                                    <el-input v-show="temp_extends.navigation_type==='double'" v-model="tab.title2" maxlength="5" show-word-limi></el-input>
                                    <el-select v-model="tab.icon" placeholder="请选择icon" class="inputwidth">
                                        <el-option v-for="item in iconlist" :key="'temp_extends'+item.id" :value="item.name">
                                            &nbsp;&nbsp;&nbsp;
                                            <i style="font-size:28px" :class="'iconfont '+item.name"></i>
                                        </el-option>
                                    </el-select>
                                    <span style="white-space:nowrap;"><i style="line-height:2" class="el-icon-right"></i></span>
                                    <el-select v-model="tab.jmp">
                                        <el-option v-for="item in filterM" :key="item.fe_module_id" :label="item.module_title" :value="item.fe_module_id"></el-option>
                                    </el-select>
                                    <el-button type="danger" icon="el-icon-delete" circle @click="deleteNavs(index)" size="mini"></el-button>
                                    <el-button class="ml0" type="success" @click="addToNavs(tab,index)" circle icon="el-icon-bottom" size="mini"></el-button>
                                </li>
                            </draggable>
                        </ul>
                    </div>
                    <div v-show="isShowFormNavs === '1'">
                        <el-form-item label="背景颜色" prop="background_color">
                            <el-color-picker v-model="temp_extends.background_color"></el-color-picker>
                            <el-input v-model="temp_extends.background_color"></el-input>
                        </el-form-item>
                        <el-form-item label="字体颜色" prop="font_def_color">
                            <el-color-picker v-model="temp_extends.font_def_color"></el-color-picker>
                            <el-input v-model="temp_extends.font_def_color"></el-input>
                        </el-form-item>
                        <el-form-item :label="temp_extends.navigation_type==='double' ? '下拉框背景颜色' : '选中字体色'" prop="font_sel_color">
                            <el-color-picker v-model="temp_extends.font_sel_color"></el-color-picker>
                            <el-input v-model="temp_extends.font_sel_color"></el-input>
                        </el-form-item>
                        <el-form-item label="选中背景颜色" prop="background_sel_color">
                            <el-color-picker v-model="temp_extends.background_sel_color"></el-color-picker>
                            <el-input v-model="temp_extends.background_sel_color"></el-input>
                        </el-form-item>
                    </div>
                    <div v-show="isShowFormNavs === '2'">
                        <el-form-item label="开始时间" prop="show_begin_ts">
                            <el-date-picker v-model="temp_extends.show_begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间" prop="show_end_ts">
                            <el-date-picker v-model="temp_extends.show_end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="导航模板">
                            <el-radio-group v-model="temp_extends.navigation_type" size="small">
                                <el-radio-button label="single" border>导航模板1</el-radio-button>
                                <el-radio-button label="double" border>导航模板2</el-radio-button>
                                <el-radio-button label="triangle" border>导航模板3</el-radio-button>
                                <el-radio-button label="radius" border>导航模板4</el-radio-button>
                                <el-radio-button label="line" border>导航模板5</el-radio-button>
                                <el-radio-button label="bigtri" border>导航模板6</el-radio-button>
                            </el-radio-group>
                            <img :src="cdn04 + 'activity/'+temp_extends.navigation_type+'.jpg'" alt="" class="width_auto">
                        </el-form-item>
                        <el-form-item label="显示选择">
                            <el-checkbox-group v-model="temp_extends.show_mode">
                                <el-checkbox v-for="city in cities_hot" :label="city.value" :key="city.value">{{city.name}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </div>
                </el-form>
                <el-button v-if="isINavsBut === 1" type="primary" @click="addToNavs(1)">添加导航</el-button>
                <el-button type="primary" @click="addToNavsModule">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                <el-button v-if="isINavsBut === 2" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai(4)">删除当前模块</el-button>
            </div>
            <!-- 商品模块 -->
            <div class="right_form" v-show="isShowForm === 4 || isShowForm === 16 || isShowForm === 38">
                <el-alert :title="isShowForm === 4?'商品模块': isShowForm === 16?'横向滑动模块':'翻转商品模块'" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" label-position="left" label-width="110px" ref="commodityInfo" :rules="commodityRules" :model="commodityInfo" class="height500">
                    <el-form-item label="模块名称" prop="module_title">
                        <el-input v-model="commodityInfo.module_title"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="show_begin_ts">
                        <el-date-picker v-model="commodityInfo.show_begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="show_end_ts">
                        <el-date-picker v-model="commodityInfo.show_end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item v-if="isShowForm === 4 || isShowForm === 38" label="显示列数" prop="template">
                        <el-radio-group v-model="commodityInfo.template" @change="rowsChang">
                            <el-radio-button label="rows_1">单列</el-radio-button>
                            <el-radio-button label="rows_2">双列</el-radio-button>
                            <el-radio-button label="rows_3">三列</el-radio-button>
                            <el-radio-button v-if="isShowForm !== 38" label="rows_4">双排</el-radio-button>
                            <el-radio-button v-if="isShowForm !== 38" label="rows_5">单排</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="isShowForm === 38" label="分屏数量" prop="split_some" :rules="[{ required: true, message: '分屏数量不能为空'}]">
                        <el-input type="number" v-model="commodityInfo.split_some" oninput="if(value>6)value=6;if(value<0) value=0" placeholder="可填最大值为6" @change="rowsChang"></el-input>
                    </el-form-item>
                    <el-form-item v-if="isShowForm === 38" label="单屏商品排数" prop="some" :rules="[{ required: true, message: '商品数量不能为空'}]">
                        <el-input type="number" v-model="commodityInfo.some" oninput="if(value<0) value=0" placeholder="数字" @input="updateTotal($event)" @change="rowsChang"></el-input>
                    </el-form-item>
                    <el-alert v-if="isShowForm === 38" title="1列最大5排，2列最大4排，3列最大3排" show-icon="" effect="dark" type="info"></el-alert>
                    <el-form-item v-if="isShowForm === 4" label="头部图片上传" prop="type_value">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="commodityInfo.head_img" />
                    </el-form-item>
                    <el-form-item v-if="commodityInfo.head_img">
                        <el-button type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('','commodityInfo','head_img')">删除当前头图</el-button>
                    </el-form-item>
                    <el-form-item v-else-if="isShowForm === 4 || isShowForm === 16" label="顶部修饰图片" prop="title_img">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="commodityInfo.title_img" />
                    </el-form-item>
                    <el-form-item v-if="commodityInfo.title_img">
                        <el-button type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('','commodityInfo','title_img')">删除当前头图</el-button>
                    </el-form-item>
                    <el-form-item v-if="isShowForm !== 38" label="爆款商品" prop="is_hot">
                        <el-switch v-model="commodityInfo.is_hot" active-text="存在爆款商品" inactive-text="不存在爆款商品"></el-switch>
                    </el-form-item>
                    <el-form-item :label="commodityInfo.is_warn === 1&&isShowForm === 4 || isShowForm === 38?'未提醒修饰图':'修饰图上传'" prop="embellish_img">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="commodityInfo.embellish_img" />
                        <el-button v-if="commodityInfo.embellish_img" type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('','commodityInfo','embellish_img')">删除{{commodityInfo.is_warn === 1&&isShowForm === 4?'未提醒':'修饰图'}}</el-button>
                    </el-form-item>
                    <el-form-item v-show="isShowForm === 4 || isShowForm === 38 &&commodityInfo.is_warn === 1" label="已提醒修饰图" prop="embellish_img2">
                        <pic-upload v-model="commodityInfo.embellish_img2" />
                    </el-form-item>
                    <el-form-item v-if="isShowForm === 4 || isShowForm === 38&&commodityInfo.embellish_img2&&commodityInfo.is_warn===1">
                        <el-button type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('','commodityInfo','embellish_img2')">删除已提醒</el-button>
                    </el-form-item>
                    <el-form-item v-if="isShowForm === 4 || isShowForm === 38" label="商品提醒">
                        <el-radio-group v-model="commodityInfo.is_warn">
                            <el-radio :label="0" border>关闭</el-radio>
                            <el-radio :label="1" border>开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="isShowForm === 4 || isShowForm === 38 &&commodityInfo.embellish_img" class="image_placeholder">
                        <p style="color:red;"><i class="el-icon-bottom"></i> 点击图片可查看大图</p>
                        <div class="block" v-show="commodityInfo.is_warn !== 1">
                            <p class="demonstration">模板一</p>
                            <el-image v-for="(url, index) in urls" :key="index" v-show="commodityInfo.template=='rows_'+(index+1)" class="w100h100" :src="url" :preview-src-list="getSrcList(index , 'urls')"></el-image>
                        </div>
                        <div v-show="commodityInfo.template!=='rows_3'&&commodityInfo.template!=='rows_4'&&commodityInfo.template!=='rows_5'&&commodityInfo.is_warn !== 1" class="block">
                            <p class="demonstration">模板二</p>
                            <el-image v-for="(url, index) in urls2" :key="index" v-show="commodityInfo.template=='rows_'+(index+1)" class="w100h100" :src="url" :preview-src-list="getSrcList(index , 'urls2')"></el-image>
                        </div>
                        <div class="block">
                            <p class="demonstration">模板三</p>
                            <el-image v-for="(url, index) in urls3" :key="index" v-show="commodityInfo.template=='rows_'+(index+1)" class="w100h100" :src="url" :preview-src-list="getSrcList(index , 'urls3')"></el-image>
                        </div>
                    </div>
                    <el-form-item v-if="isShowForm === 4 || isShowForm === 38 && commodityInfo.embellish_img" label="选择模板">
                        <el-radio-group v-model="commodityInfo.m_type">
                            <el-radio v-show="commodityInfo.is_warn !== 1" :label="1" border>模板一</el-radio>
                            <el-radio v-show="commodityInfo.template!=='rows_3'&&commodityInfo.template!=='rows_4'&&commodityInfo.template!=='rows_5'&&commodityInfo.is_warn !== 1" :label="2" border>模板二</el-radio>
                            <el-radio :label="3" border>模板三</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="!commodityInfo.embellish_img" label="价格文字" prop="price_text">
                        <el-input v-model="commodityInfo.price_text" maxlength="5" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="背景颜色">
                        <el-color-picker v-model="commodityInfo.background_color"></el-color-picker>
                    </el-form-item>
                    <div v-if="isShowForm === 4 || isShowForm === 38">
                        <div v-if="commodityInfo.embellish_img && commodityInfo.m_type !== 3">
                            <el-form-item label="标题颜色" v-if="commodityInfo.template!=='rows_1'">
                                <el-color-picker v-model="commodityInfo.title_color"></el-color-picker>
                            </el-form-item>
                            <el-form-item label="价格颜色">
                                <el-color-picker v-model="commodityInfo.price_color"></el-color-picker>
                            </el-form-item>
                        </div>
                        <el-form-item label="价格颜色" v-else>
                            <el-color-picker v-model="commodityInfo.price_bg_color"></el-color-picker>
                        </el-form-item>
                    </div>
                    <div v-if="isShowForm !== 4 && isShowForm !== 38 && commodityInfo.embellish_img">
                        <el-form-item label="价格颜色">
                            <el-color-picker v-model="commodityInfo.price_color"></el-color-picker>
                        </el-form-item>
                    </div>
                    <el-form-item label="添加商品">
                        <el-button type="primary" @click="commodityList(0)">编辑商品列表</el-button>
                    </el-form-item>
                    <el-form-item label="跳转小程序">
                        <el-input v-model="commodityInfo.more_url_xcx"></el-input>
                    </el-form-item>
                    <el-form-item label="跳转H5">
                        <el-input v-model="commodityInfo.more_url_h5"></el-input>
                    </el-form-item>
                    <el-form-item v-if="isShowForm !== 16" label="商品logo" prop="logo">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="commodityInfo.logo" />
                    </el-form-item>
                    <el-form-item v-if="isShowForm !== 16" label="logo是否显示" prop="show_logo">
                        <el-switch v-model="commodityInfo.show_logo" active-text="显示" inactive-text="隐藏"></el-switch>
                    </el-form-item>
                    <el-form-item v-if="isShowForm !== 16" label="商品角标" prop="subscript_pic">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="commodityInfo.subscript_pic" />
                    </el-form-item>
                    <el-form-item v-if="commodityInfo.subscript_pic">
                        <el-button type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('','commodityInfo','subscript_pic')">删除当前图片</el-button>
                    </el-form-item>
                    <el-form-item v-if="isShowForm !== 16" label="角标位置">
                        <el-radio-group v-model="commodityInfo.position">
                            <el-radio-button v-if="!commodityInfo.show_logo" label="0">左上</el-radio-button>
                            <el-radio-button v-if="commodityInfo.template !== 'rows_1'" label="1">右上</el-radio-button>
                            <el-radio-button label="2">左下</el-radio-button>
                            <el-radio-button v-if="commodityInfo.template !== 'rows_1'" label="3">右下</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否置灰" prop="show_disable_tips">
                        <el-switch v-model="commodityInfo.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
                    </el-form-item>
                    <el-form-item v-if="commodityInfo.show_disable_tips" label="置灰文案" prop="disable_tips">
                        <el-input v-model="commodityInfo.disable_tips"></el-input>
                    </el-form-item>
                    <el-form-item label="显示选择">
                        <el-checkbox-group v-model="commodityInfo.show_mode">
                            <el-checkbox v-for="city in cities_hot" :label="city.value" :key="city.value">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onEstablish">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                        <el-button v-show="redactVSadd===1" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai">删除当前模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 轮播模块 呼吸入口 新建模块-->
            <div class="right_form" v-show="isShowForm === 6 || isShowForm === 37">
                <el-alert :title="`${isShowForm === 6?'轮播':'呼吸入口'}模块-一级表单`" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" label-width="110px" ref="carousel_map" :model="carousel_map" :rules="carouselMapRules" class="height500">
                    <el-form-item label="模块名称" prop="module_title">
                        <el-input v-model="carousel_map.module_title"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="show_begin_ts">
                        <el-date-picker v-model="carousel_map.show_begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="show_end_ts">
                        <el-date-picker v-model="carousel_map.show_end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item v-if="isShowForm === 6">
                        <el-radio-group v-model="carousel_map.carousel_type">
                            <el-radio :label="1" border>默认样式</el-radio>
                            <el-radio :label="2" border>三图轮播</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="isShowForm === 37" label="模板样式">
                        <el-radio-group v-model="carousel_map.template">
                            <el-radio label="type_1" border>呼吸效果</el-radio>
                            <el-radio label="type_2" border>翻转效果</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否置灰" prop="show_disable_tips">
                        <el-switch v-model="carousel_map.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
                    </el-form-item>
                    <el-form-item v-if="carousel_map.show_disable_tips" label="置灰文案" prop="disable_tips">
                        <el-input v-model="carousel_map.disable_tips"></el-input>
                    </el-form-item>
                    <el-form-item label="显示选择">
                        <el-checkbox-group v-model="carousel_map.show_mode">
                            <el-checkbox v-for="city in cities_hot" :label="city.value" :key="city.value">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onCarouselMap">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                        <el-button v-show="redactVSadd===1" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai">删除当前模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 轮播模块 呼吸入口 修改处理图片-->
            <div class="right_form" v-show="isShowForm === 7">
                <el-alert :title="`${carousel_map.module_type === 3?'轮播':'呼吸入口'}模块-二级表单`" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" label-width="110px" ref="carouse_url" :rules="carouselMap2Rules" :model="carouse_url" class="height500">
                    <el-form-item label="图片上传" prop="img_url">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="carouse_url.img_url" />
                    </el-form-item>
                    <el-form-item label="链接类型">
                        <el-select v-model="carouse_url.link_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in listType" :key="'link_type-'+index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品类型" v-show="carouse_url.link_type==='1'">
                        <el-select v-model="carouse_url.goods_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in goodsType" :key="'goods_type-'+index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动类型" v-show="carouse_url.link_type==='1' && carouse_url.goods_type ==='act_goods' || carouse_url.link_type==='3' && carouse_url.goods_type ==='act_goods'">
                        <el-select v-model="carouse_url.act_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in act_type" :key="'act_type-'+index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动 I D" v-show="carouse_url.link_type==='1' && carouse_url.goods_type == 'act_goods' || carouse_url.link_type==='3' && carouse_url.goods_type == 'act_goods'" prop="act_id">
                        <el-input v-model="carouse_url.act_id"></el-input>
                    </el-form-item>
                    <el-form-item label="GOODS_ID" v-show="carouse_url.link_type==='1'" prop="goods_id">
                        <el-input v-model="carouse_url.goods_id"></el-input>
                    </el-form-item>
                    <el-form-item label="H5链接" v-show="carouse_url.link_type==='2'" prop="url_h5" :rules="[{required: true,message:'请输入H5链接',trigger:'blur'},{pattern:/\/dist/,message:'H5链接类型有误',trigger:'blur'}]">
                        <el-input v-model.trim="carouse_url.url_h5"></el-input>
                    </el-form-item>
                    <el-form-item label="小程序链接" v-show="carouse_url.link_type==='2'" prop="url_xcx" :rules="[{required:true,message:'请输入小程序链接',trigger:'blur'},{pattern:/\/pages/,message:'小程序链接类型有误',trigger:'blur'}]">
                        <el-input v-model.trim="carouse_url.url_xcx"></el-input>
                    </el-form-item>
                    <el-alert v-if="carousel_map.module_type === 22" title="为了您页面的美观，呼吸效果尽量配置3张或者4张图片。翻转效果配置6张（前三张为正面后三张为背面）或8张（前四张为正面后四张为背面）图片" type="warning">
                    </el-alert>
                    <el-form-item>
                        <el-button type="primary" @click="mapBut(carouse_url)">{{redactVSadd===1?'修改':redactVSadd===2?'添加':''}}图片</el-button>
                        <el-button v-if="redactVSadd===1" type="danger" size="mini" @click.stop="DelCarouselMap">删除图片</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 倒计时模块 -->
            <div class="right_form" v-show="isShowForm === 8">
                <el-alert title="倒计时模块-一级表单" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" class="height500" label-width="110px" size="mini" label-position="right" ref="countdownModule" :rules="countdownRules" :model="countdownModule">
                    <el-form-item label="模块名称" prop="module_title">
                        <el-input v-model="countdownModule.module_title"></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="倒计时背景颜色">
                                <el-color-picker v-model="countdownModule.djs_bg_color_def"></el-color-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="title选中背景颜色">
                                <el-color-picker v-model="countdownModule.background_sel_color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="title默认字体颜色">
                                <el-color-picker v-model="countdownModule.font_def_color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="title选中字体颜色">
                                <el-color-picker v-model="countdownModule.font_sel_color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="时间描述文字颜色">
                                <el-color-picker v-model="countdownModule.time_des_color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="时,分字体颜色">
                                <el-color-picker v-model="countdownModule.hour_color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="时,分背景颜色">
                                <el-color-picker v-model="countdownModule.hour_bg_color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="已开始秒字体颜色">
                                <el-color-picker v-model="countdownModule.has_color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="已开始秒背景颜色">
                                <el-color-picker v-model="countdownModule.has_bg_color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="未开始秒字体颜色">
                                <el-color-picker v-model="countdownModule.has_not_color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="未开始秒背景颜色">
                                <el-color-picker v-model="countdownModule.has_not_bg_color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="显示选择">
                        <el-checkbox-group v-model="countdownModule.show_mode">
                            <el-checkbox v-for="city in cities_hot" :label="city.value" :key="city.value">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onCountdownModule">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                        <el-button v-show="redactVSadd===1" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai">删除当前模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 倒计时 list -->
            <div class="right_form" v-show="isShowForm === 9">
                <el-alert title="倒计时模块-二级表单" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" class="height500" :rules="countdown_rules" label-width="110px" ref="countdownChild" :model="countdownChild">
                    <el-form-item label="开始时间" prop="begin_ts">
                        <el-date-picker v-model="countdownChild.begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="end_ts">
                        <el-date-picker v-model="countdownChild.end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item :label="countdownChild.is_warn === 1?'未提醒修饰图':'修饰图上传'" prop="embellish_img">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="countdownChild.embellish_img" />
                        <el-button v-if="countdownChild.embellish_img" type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('','countdownChild','embellish_img')">删除{{countdownChild.is_warn === 1?'未提醒':'修饰图'}}</el-button>
                    </el-form-item>
                    <el-form-item v-show="countdownChild.is_warn === 1" label="已提醒修饰图" prop="embellish_img2">
                        <pic-upload v-model="countdownChild.embellish_img2" />
                    </el-form-item>
                    <el-form-item v-if="countdownChild.embellish_img2&&countdownChild.is_warn === 1">
                        <el-button type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('','countdownChild','embellish_img2')">删除已提醒</el-button>
                    </el-form-item>
                    <el-form-item label="商品提醒">
                        <el-radio-group v-model="countdownChild.is_warn">
                            <el-radio :label="0" border>关闭</el-radio>
                            <el-radio :label="1" border>开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="显示列数" prop="template">
                        <el-radio-group v-model="countdownChild.template" @change="rowsChang">
                            <el-radio-button label="rows_1">单列</el-radio-button>
                            <el-radio-button label="rows_2">双列</el-radio-button>
                            <el-radio-button label="rows_3">三列</el-radio-button>
                            <el-radio-button label="rows_4">双排</el-radio-button>
                            <el-radio-button label="rows_5">单排</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="countdownChild.embellish_img" class="image_placeholder">
                        <p style="color:red;"><i class="el-icon-bottom"></i> 点击图片可查看大图</p>
                        <div class="block" v-show="countdownChild.is_warn !== 1">
                            <p class="demonstration">模板一</p>
                            <el-image v-for="(url, index) in urls" :key="index" v-show="countdownChild.template=='rows_'+(index+1)" class="w100h100" :src="url" :preview-src-list="getSrcList(index , 'urls')"></el-image>
                        </div>
                        <div v-show="countdownChild.template!=='rows_3'&&countdownChild.template!=='rows_4'&&countdownChild.template!=='rows_5'&&countdownChild.is_warn !== 1" class="block">
                            <p class="demonstration">模板二</p>
                            <el-image v-for="(url, index) in urls2" :key="index" v-show="countdownChild.template=='rows_'+(index+1)" class="w100h100" :src="url" :preview-src-list="getSrcList(index , 'urls2')"></el-image>
                        </div>
                        <div class="block">
                            <p class="demonstration">模板三</p>
                            <el-image v-for="(url, index) in urls3" :key="index" v-show="countdownChild.template=='rows_'+(index+1)" class="w100h100" :src="url" :preview-src-list="getSrcList(index , 'urls3')"></el-image>
                        </div>
                    </div>
                    <el-form-item v-if="countdownChild.embellish_img" label="选择模板">
                        <el-radio-group v-model="countdownChild.m_type">
                            <el-radio v-show="countdownChild.is_warn !== 1" :label="1" border>模板一</el-radio>
                            <el-radio v-show="countdownChild.template!=='rows_3'&&countdownChild.template!=='rows_4'&&countdownChild.template!=='rows_5'&&countdownChild.is_warn !== 1" :label="2" border>模板二</el-radio>
                            <el-radio :label="3" border>模板三</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="!countdownChild.embellish_img" label="价格文字" prop="price_text">
                        <el-input v-model="countdownChild.price_text" maxlength="5" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="商品背景颜色">
                        <el-color-picker v-model="countdownChild.background_color"></el-color-picker>
                    </el-form-item>
                    <div v-if="countdownChild.embellish_img && countdownChild.m_type !== 3">
                        <el-form-item label="标题颜色" v-if="countdownChild.template!=='rows_1'">
                            <el-color-picker v-model="countdownChild.title_color"></el-color-picker>
                        </el-form-item>
                        <el-form-item label="价格颜色">
                            <el-color-picker v-model="countdownChild.price_color"></el-color-picker>
                        </el-form-item>
                    </div>
                    <el-form-item label="价格颜色" v-else>
                        <el-color-picker v-model="countdownChild.price_bg_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="添加商品">
                        <el-button type="primary" @click="commodityList(1)">编辑商品列表</el-button>
                    </el-form-item>
                    <el-form-item label="跳转小程序">
                        <el-input v-model="countdownChild.more_url_xcx"></el-input>
                    </el-form-item>
                    <el-form-item label="跳转H5">
                        <el-input v-model="countdownChild.more_url_h5"></el-input>
                    </el-form-item>
                    <el-form-item label="商品logo" prop="logo">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="countdownChild.logo" />
                    </el-form-item>
                    <el-form-item label="logo是否显示" prop="show_logo">
                        <el-switch v-model="countdownChild.show_logo" active-text="显示" inactive-text="隐藏"></el-switch>
                    </el-form-item>
                    <el-form-item label="商品角标" prop="subscript_pic">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="countdownChild.subscript_pic" />
                    </el-form-item>
                    <el-form-item v-if="countdownChild.subscript_pic">
                        <el-button type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('','countdownChild','subscript_pic')">删除当前图片</el-button>
                    </el-form-item>
                    <el-form-item label="角标位置">
                        <el-radio-group v-model="countdownChild.position">
                            <el-radio-button v-if="!countdownChild.show_logo" label="0">左上</el-radio-button>
                            <el-radio-button v-if="countdownChild.template !== 'rows_1'" label="1">右上</el-radio-button>
                            <el-radio-button label="2">左下</el-radio-button>
                            <el-radio-button v-if="countdownChild.template !== 'rows_1'" label="3">右下</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否置灰" prop="show_disable_tips">
                        <el-switch v-model="countdownChild.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
                    </el-form-item>
                    <el-form-item v-if="countdownChild.show_disable_tips" label="置灰文案" prop="disable_tips">
                        <el-input v-model="countdownChild.disable_tips"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="countdownBut(countdownChild)">{{redactVSadd===1?'确认修改':redactVSadd===2?'添加':''}}模块修改</el-button>
                        <el-button type="danger" size="mini" @click.stop="DelCountdown">删除时间模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 弹幕轮播模块 -->
            <div class="right_form" v-show="isShowForm === 10">
                <el-alert title="弹幕轮播模块-一级表单" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" class="height500" label-width="110px" ref="barrageModule" :rules="barrageRules" :model="barrageModule">
                    <el-form-item label="模块名称" prop="module_title">
                        <el-input v-model="barrageModule.module_title"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="show_begin_ts">
                        <el-date-picker v-model="barrageModule.show_begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="show_end_ts">
                        <el-date-picker v-model="barrageModule.show_end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="添加图片" prop="background">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="barrageModule.background" />
                    </el-form-item>
                    <el-form-item label="内容位置" prop="template">
                        <el-radio-group v-model="barrageModule.text_align">
                            <el-radio-button label="left">左对齐</el-radio-button>
                            <el-radio-button label="center">居中</el-radio-button>
                            <el-radio-button label="right">右对齐</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否置灰" prop="show_disable_tips">
                        <el-switch v-model="barrageModule.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
                    </el-form-item>
                    <el-form-item v-if="barrageModule.show_disable_tips" label="置灰文案" prop="disable_tips">
                        <el-input v-model="barrageModule.disable_tips"></el-input>
                    </el-form-item>
                    <el-form-item label="显示选择">
                        <el-checkbox-group v-model="barrageModule.show_mode">
                            <el-checkbox v-for="city in cities_hot" :label="city.value" :key="city.value">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onBarrageModule(barrageModule)">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                        <el-button v-show="redactVSadd===1" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai">删除当前模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 弹幕轮播模块 list -->
            <div class="right_form" v-show="isShowForm === 11">
                <el-alert title="弹幕轮播模块-二级表单" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" label-width="110px" ref="barrageList" :rules="barrageListRules" :model="barrageList" class="height500">
                    <!-- <el-form-item label="类型">
                        <el-select v-model="barrageList.type" placeholder="请选择">
                            <el-option key="0" label="文字" value="text"></el-option>
                            <el-option key="1" label="图片" value="img"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="barrageList.type === 'img'" label="添加图片" prop="type_value">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="barrageList.type_value" />
                    </el-form-item> -->
                    <el-form-item label="弹幕文字" prop="type_value">
                        <el-input v-model="barrageList.type_value" maxlength="8" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="H5链接" prop="url_h5" :rules="[{required: true,message:'请输入H5链接',trigger:'blur'},{pattern:/\/dist/,message:'H5链接类型有误',trigger:'blur'}]">
                        <el-input v-model="barrageList.url_h5"></el-input>
                    </el-form-item>
                    <el-form-item label="小程序链接" prop="url_xcx" :rules="[{required:true,message:'请输入小程序链接',trigger:'blur'},{pattern:/\/pages/,message:'小程序链接类型有误',trigger:'blur'}]">
                        <el-input v-model="barrageList.url_xcx"></el-input>
                    </el-form-item>
                    <el-form-item label="文字默认颜色">
                        <el-color-picker v-model="barrageList.font_def_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="文字背景颜色">
                        <el-color-picker v-model="barrageList.background_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="barrageListBut(barrageList)">{{redactVSadd===1?'修改':redactVSadd===2?'添加':''}}弹幕</el-button>
                        <el-button type="info" size="mini" v-show="redactVSadd===1" @click.stop="xinzeng('danmu')">新增弹幕</el-button>
                        <el-button type="success" size="mini" @click.stop="danmuPosition">{{showdanmu?"修改完成":"修改位置"}}</el-button>
                        <el-button v-show="redactVSadd===1" type="danger" size="mini" @click.stop="DeletList('dm')">删除弹幕</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- TAB商品模块 -->
            <div class="right_form" v-show="isShowForm === 14">
                <el-alert :title="`${isShowForm === 14?'TAB':'翻转'}商品模块-一级表单`" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" class="height500" label-width="110px" size="mini" label-position="right" ref="TABcommodModule" :rules="TABcommodRules" :model="TABcommodModule">
                    <el-form-item label="模块名称" prop="module_title">
                        <el-input v-model="TABcommodModule.module_title"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="show_begin_ts">
                        <el-date-picker v-model="TABcommodModule.show_begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="show_end_ts">
                        <el-date-picker v-model="TABcommodModule.show_end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item v-if="TABcommodModule.module_type===7" label="导航模板">
                        <el-radio-group v-model="TABcommodModule.navigation_type" size="small">
                            <el-radio-button label="single" border>导航模板1</el-radio-button>
                            <el-radio-button label="double" border>导航模板2</el-radio-button>
                            <el-radio-button label="triangle" border>导航模板3</el-radio-button>
                            <el-radio-button label="radius" border>导航模板4</el-radio-button>
                            <el-radio-button label="line" border>导航模板5</el-radio-button>
                            <el-radio-button label="bigtri" border>导航模板6</el-radio-button>
                        </el-radio-group>
                        <img :src="cdn04 + 'activity/'+TABcommodModule.navigation_type+'.jpg'" alt="" class="width_auto">
                    </el-form-item>
                    <el-row v-if="TABcommodModule.module_type===7">
                        <el-col :span="12">
                            <el-form-item label="默认背景颜色">
                                <el-color-picker v-model="TABcommodModule.bg_color_def"></el-color-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="选中背景颜色">
                                <el-color-picker v-model="TABcommodModule.bg_sel_color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="TABcommodModule.module_type===7">
                        <el-col :span="12">
                            <el-form-item label="字体颜色">
                                <el-color-picker v-model="TABcommodModule.font_def_color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="TABcommodModule.navigation_type==='double' ? '下拉框背景颜色' : '选中字体色'">
                                <el-color-picker v-model="TABcommodModule.font_sel_color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="显示选择">
                        <el-checkbox-group v-model="TABcommodModule.show_mode">
                            <el-checkbox v-for="city in cities_hot" :label="city.value" :key="city.value">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onTABcommodModule">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                        <el-button v-show="redactVSadd===1" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai">删除当前模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- TAB商品 list -->
            <div class="right_form" v-show="isShowForm === 15">
                <el-alert :title="`${TABcommodModule.module_type===7?'TAB':'翻转'}商品模块-二级表单`" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" class="height500" label-width="110px" ref="TABcommodChild" :rules="TABcommodChildRules" :model="TABcommodChild">
                    <el-form-item label="导航文案1" prop="title" v-if="TABcommodModule.module_type===7">
                        <el-input v-model="TABcommodChild.title" :maxlength="TABcommodModule.navigation_type==='double'?'5':'8'" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item v-if="TABcommodModule.navigation_type==='double' && TABcommodModule.module_type===7" label="导航文案2" prop="title2">
                        <el-input v-model="TABcommodChild.title2" maxlength="5" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="icon" v-if="TABcommodModule.module_type===7">
                        <el-select v-model="TABcommodChild.icon" placeholder="请选择icon" class="inputwidth">
                            <el-option v-for="(item,index) in iconlist" :key="index" :value="item.name">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <i style="font-size:28px" :class="'iconfont '+item.name"></i>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="TABcommodChild.is_warn === 1?'未提醒修饰图':'修饰图上传'" prop="embellish_img">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="TABcommodChild.embellish_img" />
                        <el-button v-if="TABcommodChild.embellish_img" type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('','TABcommodChild','embellish_img')">删除{{TABcommodChild.is_warn === 1?'未提醒':'修饰图'}}</el-button>
                    </el-form-item>
                    <el-form-item v-show="TABcommodChild.is_warn === 1" label="已提醒修饰图" prop="embellish_img2">
                        <pic-upload v-model="TABcommodChild.embellish_img2" />
                    </el-form-item>
                    <el-form-item v-if="TABcommodChild.embellish_img2&& TABcommodChild.is_warn===1">
                        <el-button type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('','TABcommodChild','embellish_img2')">删除已提醒</el-button>
                    </el-form-item>
                    <el-form-item label="商品提醒">
                        <el-radio-group v-model="TABcommodChild.is_warn">
                            <el-radio :label="0" border>关闭</el-radio>
                            <el-radio :label="1" border>开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="显示列数" prop="template">
                        <el-radio-group v-model="TABcommodChild.template" @change="rowsChang">
                            <el-radio-button label="rows_1">单列</el-radio-button>
                            <el-radio-button label="rows_2">双列</el-radio-button>
                            <el-radio-button label="rows_3">三列</el-radio-button>
                            <el-radio-button label="rows_4">双排</el-radio-button>
                            <el-radio-button label="rows_5">单排</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="TABcommodChild.embellish_img" class="image_placeholder">
                        <p style="color:red;"><i class="el-icon-bottom"></i> 点击图片可查看大图</p>
                        <div class="block" v-show="TABcommodChild.is_warn !== 1">
                            <p class="demonstration">模板一</p>
                            <el-image v-for="(url, index) in urls" :key="index" v-show="TABcommodChild.template=='rows_'+(index+1)" class="w100h100" :src="url" :preview-src-list="getSrcList(index , 'urls')"></el-image>
                        </div>
                        <div v-show="TABcommodChild.template!=='rows_3'&&TABcommodChild.template!=='rows_4'&&TABcommodChild.template!=='rows_5'&&TABcommodChild.is_warn !== 1" class="block">
                            <p class="demonstration">模板二</p>
                            <el-image v-for="(url, index) in urls2" :key="index" v-show="TABcommodChild.template=='rows_'+(index+1)" class="w100h100" :src="url" :preview-src-list="getSrcList(index, 'urls2')"></el-image>
                        </div>
                        <div class="block">
                            <p class="demonstration">模板三</p>
                            <el-image v-for="(url, index) in urls3" :key="index" v-show="TABcommodChild.template=='rows_'+(index+1)" class="w100h100" :src="url" :preview-src-list="getSrcList(index , 'urls3')"></el-image>
                        </div>
                    </div>
                    <el-form-item v-if="TABcommodChild.embellish_img" label="选择模板">
                        <el-radio-group v-model="TABcommodChild.m_type">
                            <el-radio v-show="TABcommodChild.is_warn !== 1" :label="1" border>模板一</el-radio>
                            <el-radio v-show="TABcommodChild.template!=='rows_3'&&TABcommodChild.template!=='rows_4'&&TABcommodChild.template!=='rows_5'&&TABcommodChild.is_warn !== 1" :label="2" border>模板二</el-radio>
                            <el-radio :label="3" border>模板三</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="!TABcommodChild.embellish_img" label="价格文字" prop="price_text">
                        <el-input v-model="TABcommodChild.price_text" maxlength="5" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="商品背景颜色">
                        <el-color-picker v-model="TABcommodChild.background_color"></el-color-picker>
                    </el-form-item>
                    <div v-if="TABcommodChild.embellish_img&&TABcommodChild.m_type !== 3">
                        <el-form-item label="标题颜色" v-if="TABcommodChild.template!=='rows_1'">
                            <el-color-picker v-model="TABcommodChild.title_color"></el-color-picker>
                        </el-form-item>
                        <el-form-item label="价格颜色">
                            <el-color-picker v-model="TABcommodChild.price_color"></el-color-picker>
                        </el-form-item>
                    </div>
                    <el-form-item label="价格颜色" v-else>
                        <el-color-picker v-model="TABcommodChild.price_bg_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="添加商品">
                        <el-button type="primary" @click="commodityList(2)">编辑商品列表</el-button>
                    </el-form-item>
                    <el-form-item label="跳转小程序">
                        <el-input v-model="TABcommodChild.more_url_xcx"></el-input>
                    </el-form-item>
                    <el-form-item label="跳转H5">
                        <el-input v-model="TABcommodChild.more_url_h5"></el-input>
                    </el-form-item>
                    <el-form-item label="商品logo" prop="logo">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="TABcommodChild.logo" />
                    </el-form-item>
                    <el-form-item label="logo是否显示" prop="show_logo">
                        <el-switch v-model="TABcommodChild.show_logo" active-text="显示" inactive-text="隐藏"></el-switch>
                    </el-form-item>
                    <el-form-item label="商品角标" prop="subscript_pic">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="TABcommodChild.subscript_pic" />
                    </el-form-item>
                    <el-form-item v-if="TABcommodChild.subscript_pic">
                        <el-button type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('','TABcommodChild','subscript_pic')">删除当前图片</el-button>
                    </el-form-item>
                    <el-form-item label="角标位置">
                        <el-radio-group v-model="TABcommodChild.position">
                            <el-radio-button v-if="!TABcommodChild.show_logo" label="0">左上</el-radio-button>
                            <el-radio-button v-if="TABcommodChild.template !== 'rows_1'" label="1">右上</el-radio-button>
                            <el-radio-button label="2">左下</el-radio-button>
                            <el-radio-button v-if="TABcommodChild.template !== 'rows_1'" label="3">右下</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否置灰" prop="show_disable_tips">
                        <el-switch v-model="TABcommodChild.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
                    </el-form-item>
                    <el-form-item v-if="TABcommodChild.show_disable_tips" label="置灰文案" prop="disable_tips">
                        <el-input v-model="TABcommodChild.disable_tips"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="TABcommodChildBut(TABcommodChild)">{{redactVSadd===1?'修改':redactVSadd===2?'添加':''}}商品</el-button>
                        <el-button type="danger" size="mini" @click.stop="DelTABcommod">删除商品</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 优惠券模块 -->
            <div class="right_form" v-show="isShowForm === 17 || isShowForm === 21 ">
                <el-alert title="优惠券模块-一级表单" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" class="height500" label-width="110px" size="mini" label-position="right" ref="couponModule" :model="couponModule">
                    <el-form-item label="模块名称" prop="module_title">
                        <el-input v-model="couponModule.module_title"></el-input>
                    </el-form-item>
                    <el-form-item label="商品ID" prop="goods_id">
                        <el-input v-model="couponModule.goods_id"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="show_begin_ts">
                        <el-date-picker v-model="couponModule.show_begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="show_end_ts">
                        <el-date-picker v-model="couponModule.show_end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="活动可用">
                        <el-radio-group v-model="couponModule.is_sale_share">
                            <el-radio :label="0" border>否</el-radio>
                            <el-radio :label="1" border>是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="领取方式">
                        <el-select v-model="couponModule.collection_method" placeholder="请选择">
                            <el-option key="0" label="一键领取" value="onekey"></el-option>
                            <el-option v-if="isShowForm === 17" key="1" label="单张领取" value="single"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="领取频率">
                        <el-select v-model="couponModule.collection_rate" placeholder="请选择">
                            <el-option key="0" label="一天一次" value="1day1"></el-option>
                            <el-option key="1" label="只有一次" value="once"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="isShowForm === 21" label="领取前图片" prop="before_img">
                        <pic-upload :back_height.sync="backHeight" v-model="couponModule.before_img" />
                    </el-form-item>
                    <el-form-item v-if="isShowForm === 21" label="领取后图片" prop="after_img">
                        <pic-upload :back_height.sync="backHeight" v-model="couponModule.after_img" />
                    </el-form-item>
                    <el-form-item label="显示选择">
                        <el-checkbox-group v-model="couponModule.show_mode">
                            <el-checkbox v-for="city in cities_hot" :label="city.value" :key="city.value">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onCouponModule">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                        <el-button v-show="redactVSadd===1" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai">删除当前模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 优惠券 list -->
            <div class="right_form" v-show="isShowForm === 18">
                <el-alert title="优惠券模块-二级表单" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" class="height500" label-width="110px" ref="couponList" :model="couponList">
                    <el-form-item v-if="couponModule.module_type == 9" label="优惠券码" prop="text">
                        <el-input v-model="couponList.coupon_code"></el-input>
                    </el-form-item>
                    <el-form-item v-if="couponModule.module_type == 9" label="优惠券类型">
                        <el-select v-model="couponList.type" placeholder="请选择">
                            <el-option key="0" label="满减" value="discount"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="couponModule.module_type == 9" label="优惠券金额" prop="price">
                        <el-input v-model="couponList.price"></el-input>
                    </el-form-item>
                    <el-form-item v-if="couponModule.module_type == 9" label="优惠券名称" prop="name">
                        <el-input v-model="couponList.name"></el-input>
                    </el-form-item>
                    <el-form-item v-if="couponModule.module_type == 9" label="优惠券描述" prop="desc">
                        <el-input v-model="couponList.desc"></el-input>
                    </el-form-item>
                    <el-form-item v-if="couponModule.module_type == 9" label="满多少可领" prop="full">
                        <el-input v-model="couponList.full"></el-input>
                    </el-form-item>
                    <div v-if="couponModule.module_type == 11">
                        <ul>
                            <draggable v-model="couponModule.list" @update="datadragEnd" :options="{animation:500}" :style="sizeFun('data')" handle=".handle">
                                <li v-for="(tab,index) in couponModule.list" :key="'list'+index" style="display:flex;height:35px">
                                    <el-button type="success" icon="el-icon-rank" class="handle"></el-button>
                                    <el-input v-model="tab.coupon_code"></el-input>
                                    <el-button type="danger" @click.stop="deleteyijianlingqu(index)">删除</el-button>
                                    <el-button type="success" @click="addToyijianlingqu(tab,index)">添加</el-button>
                                </li>
                            </draggable>
                        </ul>
                    </div>
                    <el-form-item v-if="couponModule.module_type == 9">
                        <el-button type="primary" @click="couponChildBut(couponList)">{{redactVSadd===1?'修改':redactVSadd===2?'添加':''}}数据</el-button>
                        <el-button type="danger" size="mini" @click.stop="DelCoupon">删除数据</el-button>
                    </el-form-item>
                    <el-form-item v-else>
                        <el-button type="primary" @click="saveData('1')">保存数据</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 爆品推荐 新建模块-->
            <div class="right_form" v-show="isShowForm === 19 || isShowForm === 23 || isShowForm === 28 || isShowForm === 30">
                <el-alert title="爆品推荐模块-一级" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" label-width="110px" ref="recommend" :model="recommend" class="height500">
                    <el-form-item label="模块名称" prop="module_title">
                        <el-input v-model="recommend.module_title"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="show_begin_ts">
                        <el-date-picker v-model="recommend.show_begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="show_end_ts">
                        <el-date-picker v-model="recommend.show_end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="按钮默认背景色">
                        <el-color-picker v-if="recommend.module_type == 13" v-model="recommend.bg_color_def"></el-color-picker>
                        <el-color-picker v-else v-model="recommend.bg_def_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="按钮选中背景色">
                        <el-color-picker v-model="recommend.bg_sel_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="字体默认颜色">
                        <el-color-picker v-model="recommend.font_def_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="字体选中颜色">
                        <el-color-picker v-model="recommend.font_sel_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="是否置灰" prop="show_disable_tips">
                        <el-switch v-model="recommend.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
                    </el-form-item>
                    <el-form-item v-if="recommend.show_disable_tips" label="置灰文案" prop="disable_tips">
                        <el-input v-model="recommend.disable_tips"></el-input>
                    </el-form-item>
                    <el-form-item label="显示选择">
                        <el-checkbox-group v-model="recommend.show_mode">
                            <el-checkbox v-for="city in cities_hot" :label="city.value" :key="city.value">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onRecommend">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                        <el-button v-show="redactVSadd===1" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai">删除当前模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 爆品推荐 list-->
            <div class="right_form" v-show="isShowForm === 20 || isShowForm === 31">
                <el-alert title="爆品推荐模块-二级" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" label-width="110px" ref="recommend_url" :model="recommend_url" class="height500" :rules="recommendL_rules" label-position="left">
                    <el-form-item label="开始时间" prop="begin_ts">
                        <el-date-picker v-model="recommend_url.begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="end_ts">
                        <el-date-picker v-model="recommend_url.end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item v-if="recommend.module_type == 17" label="背景图" prop="background">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="recommend_url.background" />
                    </el-form-item>
                    <el-form-item v-if="recommend.module_type == 17" label="默认修饰图" prop="def_img">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="recommend_url.def_img" />
                    </el-form-item>
                    <el-form-item v-if="recommend.module_type == 17" label="选中修饰图" prop="sel_img">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="recommend_url.sel_img" />
                    </el-form-item>
                    <el-form-item v-if="recommend.module_type == 17" label="添加商品">
                        <el-button type="primary" @click="commodityList(3)">编辑商品列表</el-button>
                    </el-form-item>
                    <el-form-item v-if="recommend.module_type !== 16 &&recommend.module_type !== 17" label="图片上传" prop="img_url">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="recommend_url.img_url" />
                    </el-form-item>
                    <el-form-item v-show="recommend.module_type == 10" label="H5链接" prop="url_h5" :rules="[{required: true,message:'请输入H5链接',trigger:'blur'},{pattern:/\/dist/,message:'H5链接类型有误',trigger:'blur'}]">
                        <el-input v-model="recommend_url.url_h5"></el-input>
                    </el-form-item>
                    <el-form-item v-show="recommend.module_type == 10" label="小程序链接" prop="url_xcx" :rules="[{required:true,message:'请输入小程序链接',trigger:'blur'},{pattern:/\/pages/,message:'小程序链接类型有误',trigger:'blur'}]">
                        <el-input v-model="recommend_url.url_xcx"></el-input>
                    </el-form-item>
                    <el-form-item v-show="recommend.module_type == 13||recommend.module_type === 16" label="活动类型" prop="act_type">
                        <el-select v-model="recommend_url.act_type" placeholder="活动类型" class="inputwidth">
                            <el-option v-for="item in act_type" :key="item.value" :label="item.key" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="recommend.module_type === 13||recommend.module_type === 16" label="活动ID" prop="act_id">
                        <el-input v-model="recommend_url.act_id" placeholder="活动ID"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="recoBut(recommend_url,3)">{{redactVSadd===1?'修改':redactVSadd===2?'添加':''}}</el-button>
                        <el-button type="primary" @click="recoBut(recommend_url,2)">新增</el-button>
                        <el-button v-if="redactVSadd===1 && recommend.module_type !== 17 && recommend.module_type !== 13" type="success" size="mini" @click.stop="recoBut(recommend_url,1)">新增图片</el-button>
                        <el-button v-if="redactVSadd===1" type="danger" size="mini" @click.stop="DelRecommend('f')">删除</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-alert title="点击展示区配置的时间可添加图片" type="success"></el-alert>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 爆品推荐 list chuild-->
            <div class="right_form" v-show="isShowForm === 29">
                <el-alert title="爆品推荐模块-三级" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" label-width="110px" ref="recommend_url" :model="recommend_ChildUrl" class="height500" label-position="left">
                    <el-form-item label="图片上传" prop="img_url">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="recommend_ChildUrl.img_url" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="recoChuildBut(recommend_ChildUrl)">{{redactVSadd===1?'修改':redactVSadd===2?'添加':''}}</el-button>
                        <el-button type="danger" size="mini" @click.stop="DelRecommend('c')">删除</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 标题分类 模块-->
            <div class="right_form" v-show="isShowForm === 22">
                <el-alert title="标题分类模块" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" label-width="110px" ref="titleClass" :model="titleClass" class="height500">
                    <el-form-item label="模块名称" prop="module_title">
                        <el-input v-model="titleClass.module_title"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="show_begin_ts">
                        <el-date-picker v-model="titleClass.show_begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="show_end_ts">
                        <el-date-picker v-model="titleClass.show_end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="背景颜色">
                        <el-color-picker v-model="titleClass.bg_color"></el-color-picker>
                    </el-form-item>
                    <!-- <el-form-item label="标题颜色">
                        <el-color-picker v-model="titleClass.font_color"></el-color-picker>
                    </el-form-item> -->
                    <el-form-item label="标题">
                        <el-input maxlength="12" show-word-limit v-model="titleClass.title"></el-input>
                    </el-form-item>
                    <el-form-item label="icon">
                        <el-select v-model="titleClass.icon" placeholder="请选择icon" class="inputwidth">
                            <el-option v-for="(item,index) in iconlist" :key="index" :value="item.name">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <i style="font-size:28px" :class="'iconfont '+item.name"></i>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否置灰" prop="show_disable_tips">
                        <el-switch v-model="titleClass.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
                    </el-form-item>
                    <el-form-item v-if="titleClass.show_disable_tips" label="置灰文案" prop="disable_tips">
                        <el-input v-model="titleClass.disable_tips"></el-input>
                    </el-form-item>
                    <el-form-item label="显示选择">
                        <el-checkbox-group v-model="titleClass.show_mode">
                            <el-checkbox v-for="city in cities_hot" :label="city.value" :key="city.value">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onTitleClass">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                        <el-button v-show="redactVSadd===1" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai">删除当前模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 文字噱头 模块 -->
            <div class="right_form" v-show="isShowForm === 24">
                <el-alert title="文字噱头模块-一级表单`" show-icon="" effect="dark" type="info"></el-alert>
                <el-form orm v-bind:style="{ width: myWidth,height: myHeight}" class="height500" label-width="110px" ref="texthotModule" :rules="texthotRules" :model="texthotModule">
                    <el-form-item label="模块名称" prop="module_title">
                        <el-input v-model="texthotModule.module_title"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="show_begin_ts">
                        <el-date-picker v-model="texthotModule.show_begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="show_end_ts">
                        <el-date-picker v-model="texthotModule.show_end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="添加图片" prop="background">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="texthotModule.background" />
                    </el-form-item>
                    <el-form-item label="是否置灰" prop="show_disable_tips">
                        <el-switch v-model="texthotModule.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
                    </el-form-item>
                    <el-form-item v-if="texthotModule.show_disable_tips" label="置灰文案" prop="disable_tips">
                        <el-input v-model="texthotModule.disable_tips"></el-input>
                    </el-form-item>
                    <el-form-item label="显示选择" prop="show_mode">
                        <el-checkbox-group v-model="texthotModule.show_mode">
                            <el-checkbox v-for="city in cities_hot" :label="city.value" :key="city.value">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onTexthotModule(texthotModule)">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                        <el-button v-show="redactVSadd===1" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai">删除当前模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 文字噱头 模块 list -->
            <div class="right_form" v-show="isShowForm === 25">
                <el-alert title="文字噱头模块-二级表单" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" label-width="110px" ref="texthotList" :model="texthotList" class="height500">
                    <el-form-item label="图片上传" prop="type_value">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="texthotList.img_url" />
                    </el-form-item>
                    <p v-if="texthotModule.list">图片列表:</p>
                    <div v-if="texthotModule.list">
                        <ul>
                            <draggable v-model="texthotModule.list" @update="datadragEnd" :options="{animation:500}" :style="sizeFun('data')" handle=".handle">
                                <li v-for="(tab,index) in texthotModule.list" :key="index" style="display:flex; width:200px;" @click="texthotImgClick(tab,index)">
                                    <el-button style="height:35px;margin:auto;" type="success" icon="el-icon-rank" class="handle"></el-button>
                                    <img style="width:250px" :src="cdn06+tab.img_url" alt="图片没有加载出来">
                                </li>
                            </draggable>
                        </ul>
                    </div>
                    <el-alert v-if="texthotModule.list" title="点击列表图片可修改相应配置" type="error">
                    </el-alert>
                    <el-form-item label="链接类型">
                        <el-select v-model="texthotList.link_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in listType" :key="'link_type-'+index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品类型" v-show="texthotList.link_type==='1'">
                        <el-select v-model="texthotList.goods_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in goodsType" :key="'goods_type-'+index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动类型" v-show="texthotList.link_type==='1' && texthotList.goods_type ==='act_goods' || texthotList.link_type==='3' && texthotList.goods_type ==='act_goods'">
                        <el-select v-model="texthotList.act_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in act_type" :key="'act_type-'+index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动 I D" v-show="texthotList.link_type==='1' && texthotList.goods_type == 'act_goods' || texthotList.link_type==='3' && texthotList.goods_type == 'act_goods'" prop="act_id">
                        <el-input v-model="texthotList.act_id"></el-input>
                    </el-form-item>
                    <el-form-item label="GOODS_ID" v-show="texthotList.link_type==='1'" prop="goods_id">
                        <el-input v-model="texthotList.goods_id"></el-input>
                    </el-form-item>
                    <el-form-item label="H5链接" v-show="texthotList.link_type==='2'" prop="url_h5" :rules="[{required: true,message:'请输入H5链接',trigger:'blur'},{pattern:/\/dist/,message:'H5链接类型有误',trigger:'blur'}]">
                        <el-input v-model.trim="texthotList.url_h5"></el-input>
                    </el-form-item>
                    <el-form-item label="小程序链接" v-show="texthotList.link_type==='2'" prop="url_xcx" :rules="[{required:true,message:'请输入小程序链接',trigger:'blur'},{pattern:/\/pages/,message:'小程序链接类型有误',trigger:'blur'}]">
                        <el-input v-model.trim="texthotList.url_xcx"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="texthotListBut(texthotList)">{{redactVSadd===1?'修改':redactVSadd===2?'添加':''}}</el-button>
                        <el-button type="info" size="mini" v-show="redactVSadd===1" @click.stop="xinzeng('wzxt')">新增</el-button>
                        <el-button type="success" size="mini" @click.stop="texthotPosition(texthotList)">{{showdanmu?"修改完成":"修改位置"}}</el-button>
                        <el-button v-show="redactVSadd===1" type="danger" size="mini" @click.stop="DeletList('wzxt')">删除</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 时间轴模块 -->
            <div class="right_form" v-show="isShowForm == 26">
                <el-alert title="时间轴模块-一级表单" show-icon="" effect="dark" type="info"></el-alert>
                <el-form class="height500" v-bind:style="{ width: myWidth,height: myHeight}" ref="timelineModule" :model="temp_extends" size="mini" label-width="150px">
                    <el-form-item label="模块名称" prop="module_title">
                        <el-input v-model="timelineModule.module_title"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="show_begin_ts">
                        <el-date-picker v-model="timelineModule.show_begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="show_end_ts">
                        <el-date-picker v-model="timelineModule.show_end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="默认背景颜色">
                        <el-color-picker v-model="timelineModule.bg_def_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="选中背景颜色">
                        <el-color-picker v-model="timelineModule.bg_sel_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="默认字体颜色">
                        <el-color-picker v-model="timelineModule.font_def_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="选中字体颜色">
                        <el-color-picker v-model="timelineModule.font_sel_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onTimelineModule(texthotModule)">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                        <el-button v-show="redactVSadd===1" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai">删除当前模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 时间轴 模块 list -->
            <div class="right_form" v-show="isShowForm === 27">
                <el-alert title="时间轴模块-二级表单" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" label-width="110px" ref="timelineList" :model="timelineList" class="height500" :rules="timelineRules">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="timelineList.title" maxlength="7" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="时间" prop="date">
                        <el-input v-model="timelineList.date"></el-input>
                    </el-form-item>
                    <el-alert v-if="timelineModule.list.length>0" title="点击右侧标题可修改相应配置" type="error">
                    </el-alert>
                    <el-form-item label="链接类型" prop="link_type">
                        <el-select v-model="timelineList.link_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in listType" :key="'link_type-'+index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品类型" v-show="timelineList.link_type==='1'">
                        <el-select v-model="timelineList.goods_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in goodsType" :key="'goods_type-'+index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动类型" v-show="timelineList.link_type==='1' && timelineList.goods_type == 'act_goods' || timelineList.link_type==='3' && timelineList.goods_type == 'act_goods'">
                        <el-select v-model="timelineList.act_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in act_type" :key="'act_type-'+index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动 I D" v-show="timelineList.link_type==='1' && timelineList.goods_type == 'act_goods' || timelineList.link_type==='3' && timelineList.goods_type == 'act_goods'" prop="act_id">
                        <el-input v-model="timelineList.act_id"></el-input>
                    </el-form-item>
                    <el-form-item label="GOODS_ID" v-show="timelineList.link_type==='1'" prop="goods_id">
                        <el-input v-model="timelineList.goods_id"></el-input>
                    </el-form-item>
                    <el-form-item label="H5链接" v-show="timelineList.link_type==='2'" prop="url_h5" :rules="[{required: true,message:'请输入H5链接',trigger:'blur'},{pattern:/\/dist/,message:'H5链接类型有误',trigger:'blur'}]">
                        <el-input v-model.trim="timelineList.url_h5"></el-input>
                    </el-form-item>
                    <el-form-item label="小程序链接" v-show="timelineList.link_type==='2'" prop="url_xcx" :rules="[{required:true,message:'请输入小程序链接',trigger:'blur'},{pattern:/\/pages/,message:'小程序链接类型有误',trigger:'blur'}]">
                        <el-input v-model.trim="timelineList.url_xcx"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="timelineBut(timelineList)">{{redactVSadd===1?'修改':redactVSadd===2?'添加':''}}</el-button>
                        <el-button type="info" size="mini" v-show="redactVSadd===1" @click.stop="xinzeng('shijianzhou')">新增</el-button>
                        <el-button v-show="redactVSadd===1" type="danger" size="mini" @click.stop="DeletList('sjz')">删除</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 轮播热区模块 -->
            <div class="right_form" v-show="isShowForm===34">
                <el-alert title="轮播热区模块-一级表单" show-icon="" effect="dark" type="info"></el-alert>
                <el-form class="height500" v-bind:style="{ width: myWidth,height: myHeight}" :rules="rules" ref="carouselHot" :model="carouselHot" size="mini" label-width="100px">
                    <el-form-item label="模块名称" prop="module_title">
                        <el-input v-model="carouselHot.module_title"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="show_begin_ts">
                        <el-date-picker v-model="carouselHot.show_begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="show_end_ts">
                        <el-date-picker v-model="carouselHot.show_end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="添加图片" prop="background">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="carousellist.background" />
                    </el-form-item>
                    <el-alert title="画热区后不准改变轮播图顺序！" show-icon="" effect="dark" type="info"></el-alert>
                    <el-form-item>
                        <el-button type="primary" @click="carouselhotListBut">{{visible?'添加':'修改'}}背景图</el-button>
                        <el-button type="info" size="mini" v-show="!visible" @click.stop="xinzeng('lunbuHot')">新增</el-button>
                        <el-button v-show="!visible" type="danger" size="mini" @click.stop="DeletList('lunbuHot')">删除背景图</el-button>
                    </el-form-item>
                    <p v-if="carouselHot.picture_list.length>0">图片列表:</p>
                    <div v-if="carouselHot.picture_list">
                        <ul>
                            <draggable v-model="carouselHot.picture_list" @update="datadragEnd" :options="{animation:500}" :style="sizeFun('data')" handle=".handle">
                                <li v-for="(tab,index) in carouselHot.picture_list" :key="index" style="display:flex; width:200px;" @click="carouselhotClick(tab,index)">
                                    <el-button style="height:35px;margin:auto;" type="success" icon="el-icon-rank" class="handle"></el-button>
                                    <img style="width:250px" :src="cdn06+tab.background" alt="图片没有加载出来">
                                </li>
                            </draggable>
                        </ul>
                    </div>
                    <el-form-item label="显示选择">
                        <el-checkbox-group v-model="carouselHot.show_mode">
                            <el-checkbox v-for="city in cities_hot" :label="city.value" :key="city.value">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="carouselHot.picture_list.length>0" type="primary" @click="carouselModule">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                        <el-button v-if="redactVSadd===1" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai">删除模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 限时抢 模块 -->
            <div class="right_form" v-show="isShowForm === 32">
                <el-alert title="限时抢模块-一级表单" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" class="height500" label-width="110px" size="mini" label-position="right" ref="limitedtimeModule" :model="limitedtimeModule">
                    <el-form-item label="模块名称" prop="module_title">
                        <el-input v-model="limitedtimeModule.module_title"></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="title背景色">
                                <el-color-picker v-model="limitedtimeModule.bg_def_color" show-alpha></el-color-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="title选中字体颜色">
                                <el-color-picker v-model="limitedtimeModule.font_sel_color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="显示选择">
                        <el-checkbox-group v-model="limitedtimeModule.show_mode">
                            <el-checkbox v-for="city in cities_hot" :label="city.value" :key="city.value">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onLimitedtimeModule">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                        <el-button v-show="redactVSadd===1" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai">删除当前模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 限时抢 list -->
            <div class="right_form" v-show="isShowForm === 33">
                <el-alert title="限时抢模块-二级表单" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" class="height500" :rules="limitedtime_rules" label-width="110px" ref="limitedtimeList" :model="limitedtimeList">
                    <el-form-item label="开始时间" prop="begin_ts">
                        <el-date-picker v-model="limitedtimeList.begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="end_ts">
                        <el-date-picker v-model="limitedtimeList.end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="优惠券图片" prop="before_img">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="limitedtimeList.before_img" />
                    </el-form-item>
                    <el-form-item label="优惠券已抢光" prop="after_img">
                        <pic-upload :msg.sync="parentMsg" :back_height.sync="backHeight" v-model="limitedtimeList.after_img" />
                    </el-form-item>
                    <el-form-item label="优惠券码" prop="coupon_code">
                        <el-input v-model="limitedtimeList.coupon_code" placeholder="可填多个 逗号分隔"></el-input>
                    </el-form-item>
                    <el-form-item label="发放总条数" prop="total">
                        <el-input v-model.number="limitedtimeList.total" placeholder="数字"></el-input>
                    </el-form-item>
                    <el-form-item label="活动可用" prop="is_sale_share">
                        <el-radio-group v-model="limitedtimeList.is_sale_share">
                            <el-radio :label="0" border>否</el-radio>
                            <el-radio :label="1" border>是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="limitedtimeBut">
                        <el-button type="primary" @click="limitedtimeBut('limitedtimeList')">{{redactVSadd===1?'确认修改':redactVSadd===2?'添加':''}}模块</el-button>
                        <el-button type="danger" size="mini" @click.stop="DelLimiteddown">删除</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 优惠券滑动 模块 -->
            <div class="right_form" v-show="isShowForm === 35">
                <el-alert title="优惠券滑动-一级表单" show-icon="" effect="dark" type="info"></el-alert>
                <el-form v-bind:style="{ width: myWidth,height: myHeight}" class="height500" label-width="110px" size="mini" label-position="right" ref="couponSlideModule" :model="couponSlideModule">
                    <el-form-item label="模块名称" prop="module_title">
                        <el-input v-model="couponSlideModule.module_title"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="show_begin_ts">
                        <el-date-picker v-model="couponSlideModule.show_begin_ts" type="datetime" format="yyyy-MM-dd HH-mm-ss" value-format="timestamp" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="show_end_ts">
                        <el-date-picker v-model="couponSlideModule.show_end_ts" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH-mm-ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="优惠券模板" prop="template">
                        <el-radio-group v-model="couponSlideModule.template" @change="radioChange">
                            <el-radio-button :label="1">单张模板</el-radio-button>
                            <el-radio-button :label="2">两张模板</el-radio-button>
                            <el-radio-button :label="3">多张模板</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="领取频率" prop="collection_rate">
                        <el-select v-model="couponSlideModule.collection_rate" placeholder="请选择">
                            <el-option key="0" label="一天一次" value="1day1"></el-option>
                            <el-option key="1" label="只有一次" value="once"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="领取前图片" prop="before_img">
                        <pic-upload :back_height.sync="backHeight" v-model="couponSlideModule.before_img" />
                    </el-form-item>
                    <el-form-item label="领取后图片" prop="after_img">
                        <pic-upload :back_height.sync="backHeight" v-model="couponSlideModule.after_img" />
                    </el-form-item>
                    <el-form-item label="title默认字体颜色">
                        <el-color-picker v-model="couponSlideModule.font_def_color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="配置优惠券">
                        <i class="el-icon-bottom">&nbsp;</i>
                    </el-form-item>
                    <ul>
                        <li v-for="(tab,index) in couponSlideModule.list" :key="'navs'+index" style="display:flex;height:35px">
                            <!-- el-checkbox 绑定非布尔值类型时使用 true-lable false-label -->
                            <el-checkbox v-model="tab.is_sale_share" :true-label="1" :false-label="0" border>活动可用</el-checkbox>
                            <el-input @change="singleCheng" v-model="tab.coupon_code" placeholder="优惠券券码"></el-input>
                            <span style="white-space:nowrap">&nbsp; 商品id: &nbsp;</span>
                            <el-input v-model="tab.goods_id" placeholder="商品id"></el-input>
                            <el-button type="danger" icon="el-icon-delete" circle @click="deleteNavs(index,'优惠券滑动')" size="mini"></el-button>
                            <el-button type="success" @click="addTocoupon(tab,index)" circle icon="el-icon-bottom" size="mini"></el-button>
                        </li>
                    </ul>
                    <el-form-item label="显示选择" prop="show_mode">
                        <el-checkbox-group v-model="couponSlideModule.show_mode">
                            <el-checkbox v-for="city in cities_hot" :label="city.value" :key="city.value">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onCouponSlideModule">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                        <el-button v-show="redactVSadd===1" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai">删除当前模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- 弹出框 商品编辑列表 -->
        <el-dialog title="商品编辑列表" :visible.sync="dialogVisible" width="1000px">
            <div v-if="countdown_commod === 0">
                <el-select v-model="commodityInfo.act_type" placeholder="活动类型" class="inputwidth">
                    <el-option v-for="item in act_type" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
                <el-input v-model="commodityInfo.act_id" placeholder="活动ID" class="inputwidth"></el-input>
                <el-input v-model="numRows" placeholder="请添加商品展示几排" class="inputwidth" @change="onChangeRows(numRows)" :disabled="isShowForm===38"></el-input>
                <el-button @click="seekCommodity(0)">搜索</el-button>
                <div>
                    <el-table :data="commodityInfo.goods" height="450" border style="width: 100%">
                        <el-table-column prop="date" label="商品图片" width="110">
                            <template slot-scope="scope">
                                <img style="width:70px" :src="cdn06+scope.row.logo_url" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
                        <el-table-column prop="china_goods_price" label="原价"></el-table-column>
                        <el-table-column prop="china_vip_price" label="现价"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div v-else-if="countdown_commod === 1">
                <el-select v-model="countdownChild.act_type" placeholder="活动类型" class="inputwidth">
                    <el-option v-for="item in act_type" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
                <el-input v-model="countdownChild.act_id" placeholder="活动ID" class="inputwidth"></el-input>
                <el-input v-model="numRows" placeholder="请添加商品展示几排" class="inputwidth" @change="onChangeRows(numRows)"></el-input>
                <el-button @click="seekCommodity(1)">搜索</el-button>
                <div>
                    <el-table :data="countdownChild.goods" height="450" border style="width: 100%">
                        <el-table-column prop="date" label="商品图片" width="110">
                            <template slot-scope="scope">
                                <img style="width:70px" :src="cdn06+scope.row.logo_url" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
                        <el-table-column prop="china_goods_price" label="原价"></el-table-column>
                        <el-table-column prop="china_vip_price" label="现价"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div v-else-if="countdown_commod === 2">
                <el-select v-model="TABcommodChild.act_type" placeholder="活动类型" class="inputwidth">
                    <el-option v-for="item in act_type" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
                <el-input v-model="TABcommodChild.act_id" placeholder="活动ID" class="inputwidth"></el-input>
                <el-input v-model="numRows" placeholder="请添加商品展示几排" class="inputwidth" @change="onChangeRows(numRows)"></el-input>
                <el-button @click="seekCommodity(2)">搜索</el-button>
                <div>
                    <el-table :data="TABcommodChild.goods" height="450" border style="width: 100%">
                        <el-table-column prop="date" label="商品图片" width="110">
                            <template slot-scope="scope">
                                <img style="width:70px" :src="cdn06+scope.row.logo_url" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
                        <el-table-column prop="china_goods_price" label="原价"></el-table-column>
                        <el-table-column prop="china_vip_price" label="现价"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div v-else>
                <el-select v-model="recommend_url.act_type" placeholder="活动类型" class="inputwidth">
                    <el-option v-for="item in act_type" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
                <el-input v-model="recommend_url.act_id" placeholder="活动ID" class="inputwidth"></el-input>
                <el-input v-model="recommend_url.show" placeholder="请添加商品展示几个" class="inputwidth"></el-input>
                <el-button @click="seekCommodity(3)">搜索</el-button>
                <div>
                    <el-table :data="recommend_url.goods" height="450" border style="width: 100%">
                        <el-table-column prop="date" label="商品图片" width="110">
                            <template slot-scope="scope">
                                <img style="width:70px" :src="cdn06+scope.row.logo_url" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
                        <el-table-column prop="china_goods_price" label="原价"></el-table-column>
                        <el-table-column prop="china_vip_price" label="现价"></el-table-column>
                    </el-table>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="seekCommodity(countdown_commod,'confirm')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="选择模块" :visible.sync="dialogButton" width="32%" center>
            <el-row :gutter="20">
                <el-col v-for="(dataA,index) in butList" :key="index" :span="8">
                    <el-button plain @click="newTemplate(dataA.i,templateIndex,isAddVSUp)">{{dataA.name}}</el-button>
                </el-col>
            </el-row>
        </el-dialog>
        <el-dialog title="模板已修改" :visible.sync="dialogYouhuiquna" width="16%" center>
            <el-link center icon="el-icon-warning">{{`当前可配置${radioChangeValue===3?"多":radioChangeValue}张优惠券`}}</el-link>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogYouhuiquna = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 预览 -->
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
    </div>
</template>
<script>
//热区数据
const formData = {
    select_box_height: "60", //[热区模块专属]热区选择区域高度
    select_box_width: "90", //[热区模块专属]热区选择区域宽度
    select_box_left: "400", //[热区模块专属]热区选择区域距离所在图片左间距
    select_box_top: "300", //热区模块专属]热区选择区域距离所在图片上间距
    event_type: "link", //[热区模块专属]热区事件类型: 链接 link; 方法 function
    link_type: "1", //热区模块专属]链接类型: 1 商品; 2 3 4 ... 待补充
    goods_type: "act_goods", //[热区模块专属]商品类型: 活动商品 act_goods; 普通商品 goods
    act_type: "actlist", //活动类型: 限时秒杀 miaosha; 满减活动 manjian; 活动馆 huodongguan;
    act_id: "", //活动ID act_id(该活动ID指的是秒杀、满减等活动的ID)
    goods_id: "", //商品SKU_ID goods_id
    url_h5: "",
    url_xcx: "",
    appends: "", //附加数据 appends (目前只在链接类型为固定前缀类型的时候会用到)
    show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
    disable_tips: "活动未开始", // 置灰文案; 3.1期增加
    jmp: '',
    gif: '',
    name: '',
};
// 倒计时模块list
const countdown_Child = {
    is_warn: 0,
    m_type: 1,//1，2，两种模板类型12.18
    embellish_img: "",//修饰图片12.18
    embellish_img2: "",//修饰图片12.18
    price_color: "",//价格颜色12.18
    title_color: "",//标题颜色12.18
    countdown_time: "",//时间差只是后台用
    begin_ts: "",//开始时间
    end_ts: "",//结束时间
    background_color: "", // 商品默认背景颜色
    template: "rows_1",
    subscript_pic: "",
    price_text: "活动价",
    act_type: "actlist",
    act_id: "",
    url_h5_format: "",
    url_xcx_format: "",
    max_rows: "",
    more_url_xcx: "",
    more_url_h5: "",
    show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
    disable_tips: "活动未开始", // 置灰文案; 3.1期增加
    position: "0", // 位置: 一列商品 0,左上1,左下二列,三列商品0,左上1,右上2,左下3,右下 11月需求增加
    subscript: "", // 角标 11月需求增加
    price_bg_color: "#DC2992",//价格颜色
    logo: "", // logo 11月需求增加
    show_logo: false, // 是否显示logo 11月需求增加
    goods: [],
};
// tab商品模块list
const TABcommod_Child = {
    is_warn: 0,
    m_type: 1,//1，2，两种模板类型12.18
    embellish_img: "",//修饰图片12.18
    embellish_img2: "",//修饰图片12.18
    price_color: "",//价格颜色12.18
    title_color: "",//标题颜色12.18
    title: "",
    title2: "",
    icon: "",
    background_color: "", // 商品默认背景颜色
    template: "rows_1",
    subscript_pic: '',
    price_text: "活动价",
    act_type: "actlist",
    act_id: "",
    url_h5_format: "",
    url_xcx_format: "",
    max_rows: "",
    more_url_xcx: "",
    more_url_h5: "",
    show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
    disable_tips: "活动未开始", // 置灰文案; 3.1期增加
    more_text_font: "#eeee", // 查看更多文案颜色 3.1期增加
    more_bg_color: "#eeee", // 查看更多背景颜色 3.1期增加
    position: "0", // 位置: 一列商品 0,左上1,左下二列,三列商品0,左上1,右上2,左下3,右下 11月需求增加
    subscript: "", // 角标 11月需求增加
    price_bg_color: "#DC2992",//价格颜色
    logo: "", // logo 11月需求增加
    show_logo: false, // 是否显示logo 11月需求增加
    goods: [],
};
// 弹幕轮播模块list
const barrage_List = {
    type: "text", // 类型: img 图片; text 文字;
    type_value: "", // 类型值,type为img该值为图片地址,type为text,类型值为文本
    url_h5: "", // h5链接
    url_xcx: "", // 小程序链接
    font_def_color: "#DEDEDE", // 文字默认颜色
    font_sel_color: "#ffffff", // 文字选中颜色
    background_color: "#6F6F6F", // 背景颜色
};
//爆品推荐模块
const recommendUrl = {
    img_url: '',
    url_xcx: '',
    act_type: 'actlist',
    act_id: '',
    url_h5: '',
    begin_ts: '', // 开始时间
    end_ts: '', // 结束时间
    list: [],
    goods: [],
    background: '',
    def_img: '',
    sel_img: '',
    show: '',
};
//爆品v3
const recommendChildUrl = {
    img_url: "", // 图片地址
};
//文字噱头模块
const texthot_List = {
    img_url: "",
    goods_type: "act_goods",
    act_type: "actlist",
    act_id: "",
    goods_id: "",
    url_h5: "",
    url_xcx: ""
};
//时间轴模块listt
const timeline_list = {
    title: "",
    date: '',
    goods_type: "act_goods",
    act_type: "actlist",
    act_id: "",
    goods_id: "",
    url_h5: "",
    url_xcx: ""
};
//优惠券list
const coupon_list = {
    coupon_code: "", // 优惠券码
    type: "discount", // 优惠券类型: 满减 discount;
    price: "", // 优惠券金额
    name: "", // 优惠券名称
    desc: "", // 优惠券描述
    full: "" // 门槛
};
//轮播热区list
const carousel_list = {
    fe_module_id: '',
    background: "",
    areas: [],
};
// 限时抢 模块
const limitedtime_List = {
    "begin_ts": "", // 开始显示时间 每个模块都增加 3.1期增加
    "end_ts": "", // 结束显示时间 每个模块都增加 3.1期增加
    "before_img": "", // 优惠券图片
    "after_img": "",//优惠券已抢光图片
    "coupon_code": "",//优惠券码 可填多个 逗号分隔
    "total": "",//发放总数
    "is_sale_share": 0,//是否活动可用 0 不可用 1 可用
    "scene_id": ""//场次ID，新增后台生成，默认为空，修改需要回传
}
import Vue from 'vue';
import draggable from "vuedraggable";
import {
    handleimgSearch,
    handleimgPost,
    eventPageConfigs,
    activityGoods
} from "@/api/EventPage/EventPageEditing";
import { formatDate } from "@/utils/utils";
import { parse } from "path";
import commodityTool from "./commodity";
import { setTimeout } from "timers";
import QRCode from 'qrcodejs2'  // 引入qrcode
import { log } from 'util';
import { thistle } from 'color-name';
import PicUpload from '../tools/pic-upload.vue';
import MultiPicUpload from '../tools/multi-pic-upload.vue';
import data from './data.js';
//将浏览器默认拖拽图片事件关掉
export default {
    name: "EventPageEditing",
    inject: ['reload'],
    mixins: [data],
    created() {
        eventPageConfigs().then(res => {
            this.operatorList = res.data.event_type || [];
            this.listType = res.data.link_type || [];
            this.goodsType = res.data.goods_type || [];
            // this.act_type_old = res.data.activity_type;
            this.act_type = res.data.new_activity_type;
        });
        if (this.$route.query.id) {
            this.template.activity_id = this.$route.query.id;
            if (this.template.activity_id) {
                this.actSearch();
            }
        }
        if (this.form.module_title == "") this.ShowHidden_del_but = false;
        else this.ShowHidden_del_but = true;
        this.changeActivityType("");
    },
    watch: {
        // 监听数据的变化输出 newV 改变的值，oldV 改变之前的值
        parentMsg(newV, oldV) { },
        backHeight(newV, oldV) { },
    },
    computed: {
        //过滤导航模块
        filterM() {
            return this.template.m.filter(item => item.module_type != 4)//过滤导航模块
        },
    },
    components: {
        draggable,
        commodityTool,
        PicUpload,
        MultiPicUpload
    },
    methods: {
        //input组件有时候不能删除已写入的内容或者不能写入
        updateTotal: function (e) {
            this.$forceUpdate();
        },
        radioChange(value) {
            this.radioChangeValue = value
            this.dialogYouhuiquna = true;
        },
        changeActivityType(value) {
            switch (this.countdown_commod) {
                case 0:
                    this.commodityInfo.act_type = value;
                    break;
                case 1:
                    this.countdownChild.act_type = value;
                    break;
                default:
                    this.TABcommodChild.act_type = value;
                    break;
            }
        },
        singleCheng(value) {
            if (!value) {
                return this.$message.error('导航标题不能为空！');
            }
        },
        // 更新商品通用模块数据
        goodsUpdate() {
            this.template.m.forEach((item, index, array) => {
                switch (array[index].module_type) {
                    case 2:
                    case 8:
                    case 21:
                        array[index] = Object.assign({}, item, this.template.extend_goods);
                        array[index].background_color = this.template.background_color || "";
                        break;
                    case 5:
                        if (array[index].time_list) {
                            array[index].time_list.forEach((ele, i, arr) => {
                                arr[i] = Object.assign({}, ele, this.template.extend_goods);
                                arr[i].background_color = this.template.background_color || "";
                            })
                        };
                        break;
                    case 7:
                        if (array[index].list) {
                            array[index].list.forEach((ele, i, arr) => {
                                arr[i] = Object.assign({}, ele, this.template.extend_goods);
                                arr[i].background_color = this.template.background_color || "";
                                if (item.module_type === 21 && ele.template === 'rows_4' || item.module_type === 21 && ele.template === 'rows_5') {
                                    arr[i].template = 'rows_1'
                                };
                            })
                        };
                        break;
                }
            })
            this.$nextTick(() => {
                this.saveData('1');
            });
        },
        //编辑商品列表--活动搜索
        seekCommodity(i, but) {
            switch (i) {
                case 0:
                    let obj = {
                        act_type: this.commodityInfo.act_type,
                        act_id: this.commodityInfo.act_id,
                        max_rows: this.commodityInfo.max_rows
                    };
                    activityGoods(obj).then(res => {
                        if (res.errno === 1) {
                            this.$message.error(res.errmsg)
                            return;
                        } else {
                            this.commodityInfo.goods = res.data.list || [];
                            if (!res.data.list) return this.$message.error('此场馆没有商品！')
                            this.commodityInfo.url_xcx_format = res.data.url_xcx_format;
                            this.commodityInfo.url_h5_format = res.data.url_h5_format;
                            this.commodityInfo.act_type = res.data.select_act_type || this.commodityInfo.act_type;
                            if (but === 'confirm') {
                                this.commodityInfo.more_url_h5 = res.data.url_h5;
                                this.commodityInfo.more_url_xcx = res.data.url_xcx;
                                this.dialogVisible = false
                            }
                        }
                    });
                    break;
                case 1:
                    let obj1 = {
                        act_type: this.countdownChild.act_type,
                        act_id: this.countdownChild.act_id,
                        max_rows: this.countdownChild.max_rows
                    };
                    activityGoods(obj1).then(res => {
                        if (res.errno === 1) {
                            this.$message.error(res.errmsg)
                            return;
                        } else {
                            this.countdownChild.goods = res.data.list || [];
                            if (!res.data.list) return this.$message.error('此场馆没有商品！')
                            this.countdownChild.url_xcx_format = res.data.url_xcx_format;
                            this.countdownChild.url_h5_format = res.data.url_h5_format;
                            this.countdownChild.act_type = res.data.select_act_type || this.countdownChild.act_type;
                            if (but === 'confirm') {
                                this.countdownChild.more_url_h5 = res.data.url_h5;
                                this.countdownChild.more_url_xcx = res.data.url_xcx; this.dialogVisible = false
                            }
                        }
                    });
                    break;
                case 2:
                    let obj2 = {
                        act_type: this.TABcommodChild.act_type,
                        act_id: this.TABcommodChild.act_id,
                        max_rows: this.TABcommodChild.max_rows
                    };
                    activityGoods(obj2).then(res => {
                        if (res.errno === 1) {
                            this.$message.error(res.errmsg)
                            return;
                        } else {
                            this.TABcommodChild.goods = res.data.list || [];
                            if (!res.data.list) return this.$message.error('此场馆没有商品！')
                            this.TABcommodChild.url_xcx_format = res.data.url_xcx_format;
                            this.TABcommodChild.url_h5_format = res.data.url_h5_format;
                            this.TABcommodChild.act_type = res.data.select_act_type || this.TABcommodChild.act_type;
                            if (but === 'confirm') {
                                this.TABcommodChild.more_url_h5 = res.data.url_h5;
                                this.TABcommodChild.more_url_xcx = res.data.url_xcx;
                                this.dialogVisible = false
                            }
                        }
                    });
                    break;
                case 3:
                    let obj3 = {
                        act_type: this.recommend_url.act_type,
                        act_id: this.recommend_url.act_id,
                        max_rows: this.recommend_url.show
                    };
                    activityGoods(obj3).then(res => {
                        if (res.errno === 1) {
                            this.$message.error(res.errmsg)
                            return;
                        } else {
                            this.recommend_url.goods = res.data.list || [];
                            if (!res.data.list) return this.$message.error('此场馆没有商品！')
                            this.recommend_url.act_type = res.data.select_act_type || this.recommend_url.act_type;
                            if (but === 'confirm') {
                                this.dialogVisible = false;
                            }
                        }
                    })
                    break;
            }
        },
        //编辑商品列表 0商品模块 1倒计时模块
        commodityList(i) {
            //isShowForm === 38 为商品翻转模块 split_some 为 分屏数量
            if (this.isShowForm === 38) {
                switch (this.commodityInfo.template) {
                    case "rows_1":
                        //一列时 最多一页展示 5 
                        this.commodityInfo.max_rows = this.commodityInfo.split_some * this.commodityInfo.some;
                        break;
                    case "rows_2":
                        //二列时 最多一页展示 2*4 
                        this.commodityInfo.max_rows = this.commodityInfo.split_some * (this.commodityInfo.some * 2);
                        break;
                    case "rows_3":
                        //三列时 最多一页展示 3*3 
                        this.commodityInfo.max_rows = this.commodityInfo.split_some * (this.commodityInfo.some * 3);
                        break;
                }
            };
            this.countdown_commod = i
            const actions = () => {
                return new Map([
                    [0, 'commodityInfo'],
                    [1, 'countdownChild'],
                    [2, 'TABcommodChild'],
                    [3],
                ])
            }
            let action = [...actions()].filter(([key, value]) => (key == i));
            action.map(([key, value]) => {
                this.dialogVisible = true;
                if (key == 3) return;
                switch (this[value].template) {
                    case "rows_1":
                    case "rows_5":
                        this.numRows = this[value].max_rows / 1;
                        break;
                    case "rows_2":
                    case "rows_4":
                        this.numRows = this[value].max_rows / 2
                        break;
                    case "rows_3":
                        this.numRows = this[value].max_rows / 3
                        break;
                }
            })
        },
        // 商品弹窗添加数触发
        onChangeRows(num) {
            const actions = () => {
                return new Map([
                    [0, 'commodityInfo'],
                    [1, 'countdownChild'],
                    [2, 'TABcommodChild'],
                ])
            };
            let action = [...actions()].filter(([key, value]) => (key == this.countdown_commod));
            action.map(([key, value]) => {
                switch (this[value].template) {
                    case "rows_1":
                    case "rows_5":
                        this[value].max_rows = num * 1;
                        break;
                    case "rows_2":
                    case "rows_4":
                        this[value].max_rows = num * 2;
                        break;
                    case "rows_3":
                        this[value].max_rows = num * 3;
                        break;
                }
            })
        },
        //商品模块 确认创建/修改 
        onEstablish() {
            if (this.commodityInfo.is_warn === 1) {
                if (!this.commodityInfo.embellish_img || !this.commodityInfo.embellish_img2)
                    return this.$message.error('请上传修饰图')
            }
            if (this.commodityInfo.show_logo && this.commodityInfo.position == 0) {
                this.$notify({
                    title: "左上角为logo!",
                    message: "请重新选择角标位置",
                    type: "warning"
                });
                return;
            }
            let valids = true;
            this.$refs.commodityInfo.validate(valid => {
                if (valid) {
                    valids = false;
                } else {
                    valids = true;
                    return false;
                }
            });
            if (valids) return;
            if (!this.commodityInfo.goods.length) {
                this.$notify({
                    title: "注意!",
                    message: "还没有选择商品",
                    type: "warning"
                });
                return;
            }
            if (this.redactVSadd === 1) {
                this.template.m[this.templateIndex] = { ...this.commodityInfo };
                this.$forceUpdate();//强制重新渲染
            } else {
                this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, { ...this.commodityInfo });
            }
            this.isShowForm = "";
            this.saveData('1');//当运营想要一个实时保存的功能时
        },
        addTocoupon(tab, index) {
            if (tab.coupon_code == '') {
                this.$notify({
                    title: "错误",
                    message: "请填写优惠券码"
                });
                return;
            }
            let module_len = this.couponSlideModule.list.length;
            let template = this.couponSlideModule.template
            if (module_len === template && template < 3)
                return this.$message.error(`当前模板只能填写${template}个券码`);
            let obj1 = JSON.parse(JSON.stringify(this.couponSlideList))//这里使用深度复制使其点击添加按钮生成的表单值具有唯一性
            this.couponSlideModule.list.splice(index + 1, 0, obj1);
        },
        //导航条新增
        addToNavs(tab, index) {
            if (tab.icon == '') {
                this.$notify({
                    title: "请选择icon",
                    message: "请选择一个icon"
                });
                return;
            }
            let tab_actdata = this.template.m.filter(item => item.module_type != 4)//过滤导航模块
            if (this.temp_extends.navs.length + 1 > tab_actdata.length) {
                this.$notify({
                    title: "当前只有" + tab_actdata.length + "个模块",
                    message: "请先新增模块,不可选取导航模块!"
                });
            } else {
                if (index == undefined) {
                    this.isINavsBut = 0;
                    let obj = JSON.parse(JSON.stringify(this.form_navsChild))
                    this.temp_extends.navs.push(obj);
                    return;
                }
                let obj1 = JSON.parse(JSON.stringify(this.form_navsChild))//这里使用深度复制使其点击添加按钮生成的表单值具有唯一性
                this.temp_extends.navs.splice(index + 1, 0, obj1);
                // }
            }
        },
        //导航条模块新增/修改
        addToNavsModule() {
            if (this.temp_extends.navigation_type === 'double') {
                let title = this.temp_extends.navs.some(res => res.title2 == '');
                if (title) {
                    return this.$message.error('导航标题不能为空！');
                }
            }
            if (this.redactVSadd === 1) {
                this.isShowForm = ''//隐藏表单
                this.template.m[this.templateIndex] = { ...this.temp_extends }
                this.saveData('1');//当运营想要一个实时保存的功能时
                return;
            } else {
                this.isShowForm = ''
                let obj = JSON.parse(JSON.stringify(this.temp_extends))
                this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, obj);
                this.saveData('1');//当运营想要一个实时保存的功能时
                return;
            }
        },
        // 导航条删除
        deleteNavs(index, orm) {
            this.$confirm("确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    if (orm === "优惠券滑动") {
                        this.couponSlideModule.list.splice(index, 1);
                        if (this.couponSlideModule.list.length === 0) {
                            this.isINavsBut = 1;
                            this.isShowForm = '';
                        }
                    } else {
                        this.temp_extends.navs.splice(index, 1);
                        if (this.temp_extends.navs.length === 0) {
                            this.isINavsBut = 1;
                            this.isShowForm = ''
                            this.template.m.splice(this.templateIndex, 1);
                        }
                    }
                })
                .catch(() => { });
        },
        //新增按钮
        xinzeng(type) {
            const actions = () => {
                return new Map([
                    ['danmu', 'barrageList', 'barrage_List'],
                    ['wzxt', 'texthotList', 'texthot_List'],
                    ['shijianzhou', 'timelineList', 'timeline_list'],
                    ['gif', 'gifModuleList', 'gifModule_List'],
                    ['lunbuHot', 'carousellist', 'carousel_list'],
                ])
            }
            let action = [...actions()].filter(([key, v1, v2]) => (key == type));
            action.forEach(([key, v1, v2]) => {
                this[v1] = { ...[v2] };
                if (key !== type) return this.redactVSadd = 2;
                else return this.visible = true;
            })
        },
        //确认创建/修改 轮播模块
        onCarouselMap() {
            let valids = true;
            this.$refs.carousel_map.validate(valid => {
                if (valid) {
                    valids = false;
                } else {
                    valids = true;
                    return false;
                }
            });
            if (valids) return;
            if (this.redactVSadd === 1) {
                this.redactVSadd = 2
                this.template.m[this.templateIndex] = this.carousel_map;
            } else {
                this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, this.carousel_map);
            }
            this.isShowForm = 7
            this.carouse_url = {
                img_url: '',
                goods_type: "act_goods",
                act_type: "actlist",
                link_type: "1",
                act_id: "",
                goods_id: "",
                url_h5: "",
                url_xcx: ""
            }
        },
        //创建/修改 轮播图片
        mapBut(carouse_url) {
            let valids = true;
            this.$refs.carouse_url.validate(valid => {
                if (valid) {
                    valids = false;
                } else {
                    valids = true;
                    return false;
                }
            });
            if (valids) return;
            if (this.backHeight > this.carousel_map.back_height) {
                this.carousel_map.back_height = this.backHeight;
            }
            let obj = JSON.parse(JSON.stringify(this.carouse_url));
            if (this.redactVSadd === 1) {
                this.redactVSadd = 2;
                this.carousel_map.picture_list.splice(this.index, 1, obj);
            } else {
                obj.base64_url = this.parentMsg;
                this.carousel_map.picture_list.push(obj);
            }
            // this.saveData('1');
            // 清空表单
            this.carouse_url = {
                img_url: '',
                goods_type: "act_goods",
                act_type: "actlist",
                link_type: "1",
                act_id: "",
                goods_id: "",
                url_h5: "",
                url_xcx: ""
            }
        },
        //轮播模块选中图片
        hotMap(map, data, index) {
            this.parentMsg = map.base64_url;
            this.carouse_url = map;
            this.carousel_map = data;
            this.redactVSadd = 1;
            this.index = index;
            this.isShowForm = 7;
        },
        //轮播图片删除
        DelCarouselMap() {
            this.$confirm("确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                switch (this.carousel_map.picture_list.length) {
                    case 1:
                        this.isShowForm = '';
                        break;
                }
                this.carousel_map.picture_list.splice(this.carousel_map.picture_list.indexOf(this.carouse_url), 1);
                this.carouse_url = {
                    img_url: '',
                    goods_type: "act_goods",
                    act_type: "actlist",
                    link_type: "1",
                    act_id: "",
                    goods_id: "",
                    url_h5: "",
                    url_xcx: ""
                }
            }).catch(() => { });
        },
        DeletList(type_value) {
            this.$confirm("确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                switch (type_value) {
                    case 'dm':
                        this.barrageModule.list.splice(this.barrageModule.list.indexOf(this.barrageList), 1);
                        if (this.barrageModule.list.length === 0) {
                            this.barrageList = { ...barrage_List }
                        }
                        break;
                    case 'wzxt':
                        this.texthotModule.list.splice(this.texthotModule.list.indexOf(this.texthotList), 1);
                        if (this.texthotModule.list.length === 0) {
                            this.texthotList = { ...texthot_List }
                        }
                        break;
                    case 'sjz':
                        this.timelineModule.list.splice(this.timelineModule.list.indexOf(this.timelineList), 1);
                        if (this.timelineModule.list.length === 0) {
                            this.timelineList = { ...timeline_list }
                        }
                        break;
                    case 'lunbuHot':
                        this.carouselHot.picture_list.splice(this.carouselHot.picture_list.indexOf(this.carousellist), 1);
                        this.texthotIndex = 0;
                        if (this.carouselHot.picture_list.length === 0) {//如果轮播列表是空则，模块删除
                            this.template.m = this.template.m.filter((res, index) => index !== this.templateIndex);
                            this.carousellist = { ...carousel_list }
                            this.isShowForm = ''; //弹幕表单
                            return;
                        } else {
                            this.carousellist = this.carouselHot.picture_list[0]
                            return;
                        }
                        break;
                }
            }).catch(() => { });
        },
        //动态样式
        sizeFun(data) {
            return `width: ${data.width} ; height: ${data.height} ;top: ${data.top};left: ${data.left} `;
        },
        colorControl(index) {
            if (this.tab_active === index) {
                return `background-color: ${this.temp_extends.background_sel_color};color: ${this.temp_extends.font_sel_color};font-weight:bold;`
            } else {
                return "";
            }
        },
        colorTABBut(index) {
            if (this.isShowTAB_commod === index) {
                return `background-color: ${this.TABcommodModule.bg_sel_color};color: ${this.TABcommodModule.font_sel_color};font-weight:bold;`
            } else {
                return "";
            }
        },
        colorCounBut(index, item) {
            if (this.isShowCountdown_commod === index) {
                return `background-color: ${this.countdownModule.background_sel_color};color: ${this.countdownModule.font_sel_color};font-weight:bold;`
            } else {
                return "";
            }
        },
        colorRecChuildBut(index, item) {
            if (this.isShowRecChuild === index) {
                return `background-color: ${this.recommend.bg_sel_color};color: ${this.recommend.font_sel_color};font-weight:bold;`
            } else {
                return "";
            }
        },
        // 弹幕样式
        colorBarrage(datam, index) {
            if (this.index === index) {
                return `background-color:${datam.background_color};color:${datam.font_sel_color};  overflow: auto;margin:10px 0 0 0;`
            }
            return `background-color:${datam.background_color};color:${datam.font_def_color};  overflow: auto;margin:10px 0 0 0;`
        },
        // 标题分类模块背景颜色
        titleClassStyle(color) {
            return `background-color: ${color.bg_color};`;
        },
        //弹幕
        //弹幕容器
        dragStyle(data, index, type) {
            switch (type) {
                case 'danmu':
                    if (this.showdanmu) { return `background-color: #ffffff; filter:alpha(opacity = 70) ; opacity:0.7; width: 192px;height: 130px;overflow-y: auto;position: absolute;top: ${data.top}px;left: ${data.left}px;border:1px solid #000;cursor: pointer;text-align:${data.text_align};` } else {                        return `width: 192px;height: 130px;overflow-y: auto;position: absolute;top: ${data.top}px;left: ${data.left}px;border:1px dashed #000;cursor: pointer;text-align:${data.text_align};`
                    }
                    break;
                case 'wenzi':
                    if (this.showdanmu) { return `background-color: #ffffff; filter:alpha(opacity = 70) ;width:70%;height:129px; opacity:0.7;position: absolute;top: ${data.top}px;left: ${data.left}px;border:1px solid #000;cursor: pointer;` } else {                        return `overflow-y: auto; width:70%;height:129px;position: absolute;top: ${data.top}px;left: ${data.left}px;border:1px dashed #000;cursor: pointer;`
                    }
            }

        },
        //弹幕模块添加
        barrageListBut(data) {
            let valids = true;
            this.$refs.barrageList.validate(valid => {
                if (valid) {
                    valids = false;
                } else {
                    valids = true;
                    return false;
                }
            });
            if (valids) return;
            if (this.redactVSadd === 1) {
                this.redactVSadd = 2;
                let obj = JSON.parse(JSON.stringify(data));
                this.barrageList.type_value = "";
                this.barrageModule.list.splice(this.index, 1, obj);
            } else if (this.barrageModule.list.length > 5) {
                this.$notify({
                    title: "错误!",
                    message: "最多可以添加6条弹幕!",
                    type: "warning"
                });
                return;
            } else {
                let obj1 = JSON.parse(JSON.stringify(data));
                this.barrageModule.list.push(obj1);
                this.barrageList.type_value = "";
            };
            this.saveData('1');//当运营想要一个实时保存的功能时
        },
        //修改弹幕位置
        danmuPosition() {
            if (this.showdanmu) {
                this.saveData('1');//当运营想要一个实时保存的功能时
                this.showdanmu = false;
            } else return this.showdanmu = true;
        },
        //弹幕鼠标按下拖拽
        danmuDrag(e) {
            let that = this //重定义
            var oDiv = e.path[0];//当前移动的div
            var fDivWidth = e.path[1].clientWidth;//父div的宽度
            var fDivHeight = e.path[1].clientHeight;//父div的高度
            var disX = e.clientX - oDiv.offsetLeft;//+ 20
            var disY = e.clientY - oDiv.offsetTop;//+ 130
            document.onmousemove = function (e) {
                e.preventDefault();//取消事件的默认动作。
                //定位当前div位置
                var l = e.clientX - disX;
                var t = e.clientY - disY;
                // 自动吸附
                var l1 = fDivWidth - oDiv.offsetWidth;//限制小div在大div中拖拽,计算能拖拽的max距离并 , 吸附边框
                var t1 = fDivHeight - oDiv.offsetHeight;
                if (l > l1 - 30) l = l1;
                if (l < 30) l = 0;
                if (t > t1 - 30) t = t1;
                if (t < 50) t = 0;
                oDiv.style.left = l + "px"
                oDiv.style.top = t + "px"
                that.barrageModule.top = t + "px"
                that.barrageModule.left = l + "px"
            }
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        },
        //选中当前弹幕
        clickBarrage(datam, data, index) {
            this.barrageList = datam;
            this.barrageModule = data;
            this.redactVSadd = 1;
            this.index = index;
            this.redactVSadd = 1;//1修改状态,2添加
            this.isShowForm = 11; //弹幕表单
        },
        navsHover(index) {
            this.tab_active = index;
        },
        onBarrageModule(data) {
            this.isShowForm = 11;
            this.barrageModule.back_height = this.backHeight;
            this.$refs.barrageModule.validate(valid => {
                if (valid) {
                    if (this.redactVSadd === 2) {
                        this.barrageModule.fe_module_id = "fe_module_id" + Date.now();
                        this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, this.barrageModule);
                    } else {
                        //插入模块表单
                        this.template.m.splice(this.templateIndex, 1, this.barrageModule);
                    }
                    this.redactVSadd = 2;
                } else {
                    this.isShowForm = 10
                    return false;
                }
            });
        },
        //侧边栏创建模板
        sideBut(isAddVSDel) {
            //isAddVSDel 0添加修改 1删除
            switch (isAddVSDel) {
                case 0:
                    if (this.template.side_navs.length > 0) {
                        this.$message({
                            message: "修改信息成功!",
                            type: "success"
                        });
                        this.isShowForm = 13
                        return;
                    } else {
                        this.$message({
                            message: "创建模块成功!",
                            type: "success"
                        });
                        this.isINavsBut = 0;
                        let obj = JSON.parse(JSON.stringify(this.sideNavs))
                        this.template.side_navs.push(obj);
                        this.isShowForm = 13
                        return;
                    }
                    break;
                case 1:
                    this.$confirm("确认删除侧边栏?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        this.template.side_navs_show = true
                        this.template.side_navs_bg_color = "#FE0F40"
                        this.template.side_navs_gradient_color = "#FF8EA5"
                        this.template.side_gradient_color = "#FF3681"
                        this.template.side_navs_color = "#FFFFFF"
                        this.template.side_navs_text = "会场导航"
                        this.template.side_navs = []
                    }).catch(() => { });
                    break;
            }
        },
        //侧边栏list
        sideNavsBut(tab, index) {
            if (new RegExp(/\/dist/).test(tab.url_h5) == false) {
                return this.$message.error('请填写正确的H5链接');
            }
            if (new RegExp(/\/pages/).test(tab.url_xcx) == false) {
                return this.$message.error('请填写正确的小程序链接');
            }
            if (index == undefined) {
                this.isINavsBut = 0;
                let obj = JSON.parse(JSON.stringify(this.sideNavs))
                this.template.side_navs.push(obj);
                return;
            } else if (this.template.side_navs.length > 11) {
                this.$notify({
                    title: "错误!",
                    message: "最多可添加12个导航!",
                    type: "warning"
                });
                return;
            } else {
                let obj1 = JSON.parse(JSON.stringify(this.sideNavs))//这里使用深度复制使其点击添加按钮生成的表单值具有唯一性
                this.template.side_navs.splice(index + 1, 0, obj1);
                // 清空表单
                this.sideNavs = {
                    text: '',
                    url_xcx: '',
                    url_h5: ''
                }
            }
        },
        // 删除侧边栏
        deleteSideNavs(index) {
            this.$confirm("确认删除此模块?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.template.side_navs.splice(index, 1);
                    if (this.template.side_navs.length === 0) {
                        this.isShowForm = ''
                        this.template.side_navs_show = true
                        this.template.side_navs_bg_color = "#FE0F40"
                        this.template.side_navs_gradient_color = "#FF8EA5"
                        this.template.side_gradient_color = "#FF3681"
                        this.template.side_navs_color = "#FFFFFF"
                        this.template.side_navs_text = "会场导航"
                        this.template.side_navs = []
                    }
                })
                .catch(() => { });
        },
        //TAB商品模块 确认创建/修改
        onTABcommodModule() {
            this.TABcommodChild = { ...TABcommod_Child };
            let valids = true;
            this.$refs.TABcommodModule.validate(valid => {
                if (valid) {
                    valids = false;
                } else {
                    valids = true;
                    return false;
                }
            });
            if (valids) return;
            if (this.redactVSadd === 1) {
                this.redactVSadd = 2
                this.template.m[this.templateIndex] = { ...this.TABcommodModule };
            } else {
                this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, this.TABcommodModule);
            }
            this.isShowForm = 15//打开子模板
            this.TABcommodChild = Object.assign(this.TABcommodChild, this.template.extend_goods);
            this.TABcommodChild.background_color = this.template.background_color || '';
        },
        //TAB商品模块 list
        TABcommodChildBut(TABcommodChild) {
            if (this.TABcommodChild.is_warn === 1) {
                if (!this.TABcommodChild.embellish_img || !this.TABcommodChild.embellish_img2)
                    return this.$message.error('请上传修饰图')
            }
            let valids = true;
            this.$refs.TABcommodChild.validate(valid => {
                if (valid) {
                    valids = false;
                } else {
                    valids = true;
                    return false;
                }
            });
            if (valids) return;
            if (this.TABcommodChild.show_logo && this.TABcommodChild.position == 0) {
                this.$notify({
                    title: "左上角为logo!",
                    message: "请重新选择角标位置",
                    type: "warning"
                });
                return;
            }
            if (this.redactVSadd === 1) {
                this.TABcommodModule.list.splice(this.TABcommodModule.list.indexOf(this.TABcommodChild), 1, TABcommodChild);
                this.redactVSadd = 2;
            } else if (this.TABcommodModule.list.length > 7) {
                this.$notify({
                    message: "tab商品模块最多只能添加8个",
                    offset: 100,
                    type: "warning"
                });
            } else {
                this.TABcommodModule.list.push(TABcommodChild);
            }
            setTimeout(() => {
                this.isShowForm = 15;
                this.TABcommodChild = { ...TABcommod_Child };
                this.TABcommodChild = Object.assign(this.TABcommodChild, this.template.extend_goods);
                this.TABcommodChild.background_color = this.template.background_color || '';
            })
            this.saveData('1');//当运营想要一个实时保存的功能时
        },
        //tab子模块删除
        DelTABcommod() {
            this.$confirm("确认删除此?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                switch (this.TABcommodModule.list.length) {
                    case 1:
                        this.isShowForm = '';
                        break;
                }
                this.TABcommodModule.list.splice(this.TABcommodModule.list.indexOf(this.TABcommodChild), 1);
                this.TABcommodChild = { ...TABcommod_Child }
            }).catch(() => { });
        },
        // tab商品模块list选中时间
        onTABcommod(item, data, index) {
            this.TABcommodChild = item;
            this.TABcommodModule = data;
            this.redactVSadd = 1;
            this.isShowTAB_commod = index
            this.isShowForm = 15; //倒计时表单
        },
        //确认创建/修改 倒计时模块
        onCountdownModule() {
            this.countdownChild = { ...countdown_Child };
            let valids = true;
            this.$refs.countdownModule.validate(valid => {
                if (valid) {
                    valids = false;
                } else {
                    valids = true;
                    return false;
                }
            });
            if (valids) return;
            if (this.redactVSadd === 1) {
                this.redactVSadd = 2
                this.template.m[this.templateIndex] = { ...this.countdownModule };
            } else {
                this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, this.countdownModule);
            }
            this.isShowForm = 9//打开倒计时子模板
            this.countdownChild = Object.assign(this.countdownChild, this.template.extend_goods);
            this.countdownChild.background_color = this.template.background_color || '';
        },
        //倒计时模块 list
        countdownBut(childModule) {
            if (this.countdownChild.is_warn === 1) {
                if (!this.countdownChild.embellish_img || !this.countdownChild.embellish_img2)
                    return this.$message.error('请上传修饰图')
            }
            let valids = true;
            this.$refs.countdownChild.validate(valid => {
                if (valid) {
                    valids = false;
                } else {
                    valids = true;
                    return false;
                }
            });
            if (valids) return;
            if (this.redactVSadd === 1) {
                this.redactVSadd = 2;
                this.countdownModule.time_list.splice(this.countdownModule.time_list.indexOf(this.countdownChild), 1, childModule);
                this.TimeDown(childModule.end_ts)
                setTimeout(() => {
                    this.isShowForm = 9;
                    this.countdownChild = { ...countdown_Child };
                    this.countdownChild = Object.assign(this.countdownChild, this.template.extend_goods);
                    this.countdownChild.background_color = this.template.background_color || '';
                })
            } else {
                this.countdownModule.time_list.push(childModule);
                this.TimeDown(childModule.end_ts)
                setTimeout(() => {
                    this.isShowForm = 9;
                    this.countdownChild = { ...countdown_Child };
                    this.countdownChild = Object.assign(this.countdownChild, this.template.extend_goods);
                    this.countdownChild.background_color = this.template.background_color || '';
                })
            }
            this.saveData('1');//当运营想要一个实时保存的功能时
        },
        // //倒计时时间差计算与转换
        TimeDown(endDateStr) {
            let date = new Date(endDateStr);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = date.getDate() + ' ';
            let h = date.getHours() + ':';
            let m = date.getMinutes() + ':';
            let s = date.getSeconds();
            this.countdownChild.countdown_time = Y + M + D + h + m + s;
            return Y + M + D + h + m + s;
        },
        // //倒计时模块list模块选中时间
        onCounBut(item, data, index) {
            this.countdownChild = item;
            this.countdownModule = data;
            this.redactVSadd = 1;
            this.isShowCountdown_commod = index
            this.isShowForm = 9; //倒计时表单
        },
        // //倒计时时间删除
        DelCountdown() {
            this.$confirm("确认删除此?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                switch (this.countdownModule.time_list.length) {
                    case 1:
                        this.isShowForm = '';
                        break;
                }
                this.countdownModule.time_list.splice(this.countdownModule.time_list.indexOf(this.countdownChild), 1);
                this.countdownChild = { ...countdown_Child }
            }).catch(() => { });
        },
        // //限时抢时间删除
        DelLimiteddown() {
            this.$confirm("确认删除此?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                switch (this.limitedtimeModule.picture_list.length) {
                    case 1:
                        this.isShowForm = '';
                        break;
                }
                this.limitedtimeModule.picture_list.splice(this.limitedtimeModule.picture_list.indexOf(this.limitedtimeList), 1);
                this.limitedtimeList = { ...limitedtime_List };
            }).catch(() => { });
        },
        //优惠券模块
        onCouponModule() {
            if (this.redactVSadd === 1) {
                this.redactVSadd = 2
                this.template.m[this.templateIndex] = { ...this.couponModule };
                this.$message({
                    message: "修改信息成功!",
                    type: "success"
                });
            } else {
                this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, this.couponModule);
                let obj = JSON.parse(JSON.stringify(this.couponList))
                this.couponModule.list.push(obj);
            }
            this.isShowForm = 18//打开优惠券子模块
        },
        // 优惠券list
        couponChildBut(couponList) {
            if (this.redactVSadd === 1) {
                this.couponModule.list.splice(this.couponModule.list.indexOf(this.couponList), 1, couponList);
                setTimeout(() => {
                    this.isShowForm = 18;
                    this.couponList = { ...coupon_list };
                })
                this.redactVSadd = 2;
                this.saveData('1');//当运营想要一个实时保存的功能时
                return;
            } else {
                this.couponModule.list.push(couponList);
                setTimeout(() => {
                    this.isShowForm = 18;
                    this.couponList = { ...coupon_list };
                })
                this.saveData('1');//当运营想要一个实时保存的功能时
            }
        },
        //优惠券滑动模块
        onCouponSlideModule() {
            this.couponSlideModule.back_height = this.backHeight;
            if (this.redactVSadd === 1) {
                this.template.m[this.templateIndex] = { ...this.couponSlideModule };
                this.$message({
                    message: "修改信息成功!",
                    type: "success"
                });
            } else {
                this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, this.couponSlideModule);
            }
        },
        //一键领取优惠券条新增
        addToyijianlingqu(tab, index) {
            let obj1 = JSON.parse(JSON.stringify(this.couponList))//这里使用深度复制使其点击添加按钮生成的表单值具有唯一性
            this.couponModule.list.splice(index + 1, 0, obj1);
        },
        // 一键领取条删除
        deleteyijianlingqu(index) {
            this.$confirm("确认删除此模块?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    if (this.couponModule.list.length < 2) {
                        this.$notify({
                            message: "最少添加一个优惠券码!",
                            offset: 100,
                            type: "warning"
                        });
                    } else {
                        this.couponModule.list.splice(index, 1);
                    }
                })
                .catch(() => { });
        },
        //选中当前一键领取优惠券
        yijianlingqu(data) {
            switch (data.module_type) {
                case 9:
                case 11:
                    this.couponModule = data;
                    this.isShowForm = 18; //优惠券表单
                    break;
                case 20:
                    this.couponSlideModule = data;
                    this.isShowForm = 35;
                    break;
            }
        },
        //优惠券list删除    
        DelCoupon() {
            this.$confirm("确认删除此?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                switch (this.couponModule.list.length) {
                    case 1:
                        this.isShowForm = '';
                        break;
                }
                this.couponModule.list.splice(this.couponModule.list.indexOf(this.couponList), 1);
                this.couponList = { ...coupon_list };
            }).catch(() => { });
        },
        //选中当前优惠券
        couponClick(coupon, data, index) {
            this.couponList = coupon;
            this.couponModule = data;
            this.redactVSadd = 1;
            this.index = index;
            this.isShowForm = 18; //优惠券表单
        },
        //爆品推荐 模块
        onRecommend() {
            if (this.redactVSadd === 1) {
                this.redactVSadd = 2
                this.template.m[this.templateIndex] = { ...this.recommend };
            } else {
                this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, { ...this.recommend });
            }
            this.recommend_url = { ...recommendUrl }
            this.isShowForm = 20;
        },
        //创建/修改 爆款推荐图片
        recoBut(recommend_url, m_type) {
            this.recommend.back_height = this.backHeight;
            let obj = JSON.parse(JSON.stringify(this.recommend_url));
            let valids = true;
            this.$refs.recommend_url.validate(valid => {
                if (valid) { valids = false; } else { valids = true; return false; }
            });
            if (valids) return;
            if (!recommend_url.begin_ts && !recommend_url.begin_ts)
                return this.$message.error('请选择时间');
            if (this.redactVSadd === 1) {
                this.redactVSadd = 2;
                if (m_type === 1) { return this.isShowForm = 29; } else if (m_type === 2) {
                    this.redactVSadd = 2;
                }
                this.recommend.picture_list.splice(this.isShowRecChuild, 1, obj);
            } else {
                this.recommend.picture_list.push(obj);
                this.sortfunc(this.recommend.picture_list);
            }
            this.recommend_url = JSON.parse(JSON.stringify(recommendUrl));
        },
        //爆品v3 模块 添加图片
        recoChuildBut() {
            let obj = Object.assign({}, this.recommend_ChildUrl)
            if (this.redactVSadd === 1) {
                this.redactVSadd = 2;
                this.recommend_url.list.splice(this.isShowRecChuild, 1, obj);
                this.saveData('1');//当运营想要一个实时保存的功能时
                this.recommend_ChildUrl = JSON.parse(JSON.stringify(recommendChildUrl))
                return;
            } else {
                this.recommend_url.list.push(obj);
                this.saveData('1');//当运营想要一个实时保存的功能
                this.recommend_ChildUrl = JSON.parse(JSON.stringify(recommendChildUrl))
            }
        },
        //爆款推荐选中图片
        recoCurrent(map, data, index) {
            this.recommend_url = map;
            this.recommend = data;
            this.redactVSadd = 1;
            this.isShowRecChuild = index;
            this.isShowForm = 20;
        },
        // 点击爆品时间
        onRecChuildBut(item, data, index) {
            this.recommend_url = item;
            this.recommend = data;
            this.redactVSadd = 1;
            this.isShowRecChuild = index
            this.isShowForm = 20; //倒计时表单
        },
        //爆款v3推荐选中图片
        recoChuildCurrent(item, map, data, index) {
            this.recommend_ChildUrl = item;
            this.recommend_url = map;
            this.recommend = data;
            this.redactVSadd = 1;
            this.isShowRecChuild = index;
            this.isShowForm = 29;
        },
        //爆款v1v2v3删除二级页面删除
        DelRecommend(type) {
            this.$confirm("确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                switch (this.recommend.picture_list.length) {
                    case 1:
                        this.isShowForm = '';
                        break;
                }
                if (type === 'c') {
                    this.recommend_url.list.splice(this.recommend_url.list.indexOf(this.recommend_ChildUrl), 1);
                    this.recommend_ChildUrl = { ...recommendChildUrl };
                    return;
                } else {
                    this.recommend.picture_list.splice(this.recommend.picture_list.indexOf(this.recommend_url), 1);
                    this.recommend_url = { ...recommendUrl };
                }
            }).catch(() => { });
        },
        //标题分类模块
        onTitleClass() {
            if (this.redactVSadd === 1) {
                this.redactVSadd = 2
                this.template.m[this.templateIndex] = { ...this.titleClass };
            } else {
                this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, { ...this.titleClass });
            }
            this.saveData('1')
            this.isShowForm = "";
        },
        // 图片上放置gif 选中图片
        gifImgClick(tab, index) {
            this.gifModuleList = tab;
            this.redactVSadd = 1;
            this.gifIndex = index
        },
        //新增 文字噱头 模块
        onTexthotModule(data) {
            this.texthotModule.back_height = this.backHeight;
            this.$refs.texthotModule.validate(valid => {
                if (valid) {
                    this.isShowForm = 25
                    if (this.redactVSadd === 2) {
                        this.texthotModule.fe_module_id = "fe_module_id" + Date.now();
                        // this.template.m.push(this.barrageModule); //插入模块表单
                        this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, this.texthotModule);
                        this.texthotList = { ...texthot_List };
                    } else {
                        //插入模块表单
                        this.template.m.splice(this.templateIndex, 1, this.texthotModule);
                        this.texthotList = { ...texthot_List };
                    }
                    this.redactVSadd = 2;
                } else {
                    return false;
                }
            });
        },
        //文字噱头鼠标按下拖拽
        wenziDrag(e) {
            let that = this //重定义
            var oDiv = e.path[0];//当前移动的div
            var fDivWidth = e.path[1].clientWidth;//父div的宽度
            var fDivHeight = e.path[1].clientHeight;//父div的高度
            var disX = e.clientX - oDiv.offsetLeft;//+ 20
            var disY = e.clientY - oDiv.offsetTop;//+ 130
            document.onmousemove = function (e) {
                e.preventDefault();//取消事件的默认动作。
                //定位当前div位置
                var l = e.clientX - disX;
                var t = e.clientY - disY;
                // 自动吸附
                var l1 = fDivWidth - oDiv.offsetWidth;//限制小div在大div中拖拽,计算能拖拽的max距离并 , 吸附边框
                var t1 = fDivHeight - oDiv.offsetHeight;
                if (l > l1 - 30) l = l1;
                if (l < 30) l = 0;
                if (t > t1 - 30) t = t1;
                if (t < 50) t = 0;
                oDiv.style.left = l + "px"
                oDiv.style.top = t + "px"
                that.texthotModule.top = t + "px"
                that.texthotModule.left = l + "px"
            }
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        },
        //文字噱头list添加
        texthotListBut(data) {
            if (this.redactVSadd === 1) {
                this.redactVSadd = 2;
                let obj = JSON.parse(JSON.stringify(data));
                this.texthotModule.list.splice(this.texthotIndex, 1, obj);
                this.texthotList = { ...texthot_List };
            } else if (this.texthotModule.list.length > 4) {
                this.$notify({
                    title: "错误!",
                    message: "最多可以添加5个图片!",
                    type: "warning"
                });
                return;
            } else {
                let obj1 = JSON.parse(JSON.stringify(data));
                this.texthotModule.list.push(obj1);
                this.texthotList = { ...texthot_List };
            };
            this.saveData('1');//当运营想要一个实时保存的功能时
        },
        //修改 文字噱头 图片位置
        texthotPosition(datam) {
            this.texthotList = datam
            if (this.showdanmu) {
                this.saveData('1');//当运营想要一个实时保存的功能时
                this.showdanmu = false;
            } else return this.showdanmu = true;
        },
        //选中当前图片
        texthotImgClick(tab, index) {
            this.texthotList = tab;
            this.redactVSadd = 1;
            this.texthotIndex = index
        },
        //新增 时间轴 模块
        onTimelineModule(data) {
            this.isShowForm = 27;
            let obj = { ...this.timelineModule };
            if (this.redactVSadd === 2) {
                this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, obj);
                this.timelineList = { ...timeline_list };
            } else {
                //插入模块表单
                this.template.m.splice(this.templateIndex, 1, obj);
                this.timelineList = { ...timeline_list };
            }
            this.redactVSadd = 2;
        },
        //时间轴 list添加
        timelineBut(timelineList) {
            let valids = true;
            this.$refs.timelineList.validate(valid => {
                if (valid) {
                    valids = false;
                } else {
                    valids = true;
                    return false;
                }
            });
            if (valids) return;
            let obj = JSON.parse(JSON.stringify(this.timelineList));
            if (this.redactVSadd === 1) {
                this.redactVSadd = 2;
                this.timelineModule.list.splice(this.timeline_isK, 1, obj);
                this.timelineList = { ...timeline_list };
            } else if (this.timelineModule.list.length > 3) {
                this.$notify({
                    title: "错误!",
                    message: "最多可添加4条时间线!",
                    type: "warning"
                });
                return;
            } else {
                this.timelineModule.list.push(obj);
                this.timelineList = { ...timeline_list };
            };
            this.saveData('1');//当运营想要一个实时保存的功能时
        },
        // 时间轴模块list选中
        onTimeline(item, data, index) {
            this.timelineList = item;
            this.timelineModule = data;
            this.redactVSadd = 1;
            this.timeline_isK = index
            this.isShowForm = 27; //倒计时表单
        },
        colortimelineBut(item, index) {
            if (this.timeline_isK === index) {
                return `background-color: ${this.timelineModule.bg_sel_color};color: ${this.timelineModule.font_sel_color};font-weight:bold;`
            } else {
                return "";
            }
        },
        //新增 限时抢 模块
        onLimitedtimeModule(data) {
            this.limitedtimeList = { ...limitedtime_List };
            if (this.redactVSadd === 2) {
                this.limitedtimeModule.fe_module_id = "fe_module_id" + Date.now();
                this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, this.limitedtimeModule);
            } else {
                this.template.m.splice(this.templateIndex, 1, this.limitedtimeModule);
            }
            this.redactVSadd = 2;
            this.isShowForm = 33;
        },
        //限时抢 list
        limitedtimeBut(limitedtimeList) {
            let valids = true;
            this.$refs.limitedtimeList.validate(valid => {
                if (valid) {
                    valids = false;
                } else {
                    valids = true;
                    return false;
                }
            });
            if (valids) return;
            this.limitedtimeModule.back_height = this.backHeight;
            if (this.redactVSadd === 1) {
                this.redactVSadd = 2;
                this.limitedtimeModule.picture_list.splice(this.limitedtimeModule.picture_list.indexOf(this.limitedtimeList), 1, this.limitedtimeList);
            } else {
                this.limitedtimeModule.picture_list.push(this.limitedtimeList);
            }
            setTimeout(() => {
                this.limitedtimeList = { ...limitedtime_List };
            })
            this.saveData('1');//当运营想要一个实时保存的功能时
        },
        //限时抢选中图片
        limitedtimeImg(map, data, index) {
            this.limitedtimeList = map;
            this.limitedtimeModule = data;
            this.redactVSadd = 1;
            this.isShowRecChuild = index,
                this.isShowForm = 33;
        },
        // --------------------公共区域--------------------

        //新增模块
        newTemplate(i, index, isAddVSUp) {
            const extend = this.template.extend_goods;
            this.templateIndex = index || 0;//templateIndex 模板创建和时的index
            this.isAddVSUp = isAddVSUp;
            this.isShowForm = i;
            this.redactVSadd = 2;
            this.visible = true;
            this.dialogButton = false;
            const show_mode_data = ["show_with_vip", "show_with_not_vip", "show_with_old_user", "show_with_new_user"];
            switch (i) {
                case 1:
                    this.dialogButton = true;
                    break;
                case 2:
                    this.template.m.forEach(item => {
                        if (item.module_type === 4) {
                            this.isShowForm = '';
                            this.isINavsBut = 0
                            this.$notify({
                                title: "导航已存在!",
                                message: "只能添加一个导航模块!",
                                offset: 100,
                                type: "warning"
                            });
                            return;
                        }
                    })
                    if (this.template.m.length === 0) {
                        this.isShowForm = '';
                        this.isINavsBut = 0
                        this.$notify({
                            title: "没有模块",
                            message: "请先创建其他模块",
                            offset: 100
                        });
                        return;
                    }
                    this.temp_extends = {
                        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
                        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
                        module_type: 4,
                        module_title: "导航模块",
                        navigation_type: "single",//导航模板
                        fe_module_id: "",
                        background_color: "", //背景颜色
                        background_sel_color: "", //选中背景颜色
                        font_def_color: "", //默认字体颜色
                        font_sel_color: "", //选中字体颜色
                        navs: [],
                        show_mode: [...show_mode_data]
                    }
                    break;
                case 3:
                    this.form = {
                        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
                        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
                        module_type: 1, //模块类型: 1 热区; 2 商品; 3 轮播
                        module_title: "", //模块名称
                        background: "", //event_type
                        back_height: 0,
                        show_mode: [...show_mode_data],
                        areas: [],
                        fe_module_id: "fe_module_id" + Date.now()
                    };
                    break;
                case 4:
                case 38:
                    this.commodityInfo = {
                        is_warn: extend.is_warn || 0,
                        m_type: extend.m_type || 1,//1，2，两种模板类型12.18
                        split_some: 1,
                        some: 1,
                        embellish_img: extend.embellish_img || '',//修饰图片12.18
                        embellish_img2: extend.embellish_img2 || '',//修饰图片12.18
                        price_color: extend.price_color || '',//价格颜色12.18
                        title_color: extend.title_color || '',//标题颜色12.18
                        more_text_font: "", // 查看更多文案颜色 3.1期增加
                        more_bg_color: "", // 查看更多背景颜色 3.1期增加
                        show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
                        disable_tips: "活动未开始", // 置灰文案; 3.1期增加
                        is_hot: false, // 是否为爆款商品: 是 true; 否 false; 3.1期增加
                        module_type: i === 4 ? 2 : 21,
                        head_img: '',
                        subscript_pic: extend.subscript_pic,//爆款商品角标
                        module_title: "",
                        background: "",
                        back_height: 0,
                        background_color: this.template.background_color || '',
                        template: extend.template || '', //模板类型
                        price_text: extend.price_text || '', //活动价名称
                        act_type: "actlist", //活动类型
                        act_id: "", //活动id
                        url_h5_format: "", //活动详情h5链接格式
                        url_xcx_format: "", //活动详情小程序链接格式
                        max_rows: "", //显示多少个商品
                        more_url_xcx: "", //[商品模块专属]更多内容 - 小程序链接
                        more_url_h5: "", //[商品模块专属]更多内容 - h5链接
                        position: extend.position || '', // 位置: 一列商品 0,左上1,左下二列,三列商品0,左上1,右上2,左下3,右下 11月需求增加
                        subscript: "", // 角标 11月需求增加
                        price_bg_color: extend.price_bg_color || "#DC2992",//价格颜色
                        logo: "", // logo 11月需求增加
                        show_logo: false, // 是否显示logo 11月需求增加
                        show_mode: [...show_mode_data],
                        fe_module_id: "fe_module_id" + Date.now(),
                        goods: []
                    };
                    break;
                case 6:
                case 37:
                    this.carousel_map = {
                        back_height: 0,
                        template: "type_1", // 模版: ; type_1呼吸效果模板，type_2翻转效果模版
                        module_type: i === 6 ? 3 : 22, //模块类型: 1 热区; 2 商品; 3 轮播;
                        module_title: "", //模块名称
                        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
                        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
                        show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
                        disable_tips: "活动未开始", // 置灰文案; 3.1期增加
                        picture_list: [],//轮播列表
                        fe_module_id: "fe_module_id" + Date.now(),
                        show_mode: [...show_mode_data],
                    }
                    break;
                case 8:
                    this.countdownModule = {
                        module_type: 5,
                        module_title: "倒计时模块",
                        djs_bg_color_def: "#FFFFFF",// 倒计时默认背景颜色
                        background_sel_color: "#FE0F40",// 选中背景颜色
                        font_def_color: "#333333",// 默认字体颜色
                        font_sel_color: "#FFFFFF",// 选中字体颜色
                        time_des_color: "#333333", // 时间描述文字颜色
                        hour_color: "#FFFFFF", // 时,分字体颜色
                        hour_bg_color: "#474245", // 时,分背景颜色
                        has_color: "#FFFFFF", // 已开始秒字体颜色
                        has_bg_color: "#FF124D", // 已开始秒背景颜色
                        has_not_color: "#FFFFFF", // 未开始秒字体颜色
                        has_not_bg_color: "#49D37C", // 未开始秒背景颜色
                        fe_module_id: "fe_module_id" + Date.now(),
                        show_mode: [...show_mode_data],
                        time_list: [],
                    }
                    this.countdownChild = { ...countdown_Child }
                    break;
                case 10:
                    this.barrageModule = {
                        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
                        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
                        show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
                        disable_tips: "活动未开始", // 置灰文案; 3.1期增加
                        module_type: 6,
                        module_title: "",
                        background: "", //背景图片
                        top: 85,
                        left: 260,
                        text_align: "right",//left 左对齐 right 右对齐 center居中
                        list: [],
                        show_mode: [...show_mode_data],
                        fe_module_id: "fe_module_id" + Date.now(),
                    }
                    break;
                case 14:
                case 36:
                    this.TABcommodModule = {
                        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
                        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
                        module_type: i === 14 ? 7 : 21,
                        module_title: "",
                        navigation_type: "single",//导航模板
                        bg_color_def: "#FFFFFF",// 默认背景颜色
                        bg_sel_color: "#FE0F40",// title选中背景颜色
                        font_def_color: "#333333",// title默认字体颜色
                        font_sel_color: "#FFFFFF",// title选中字体颜色
                        fe_module_id: "fe_module_id" + Date.now(),
                        show_mode: [...show_mode_data],
                        list: [],
                    }
                    this.TABcommodChild = { ...TABcommod_Child }
                    break;
                case 16:
                    this.commodityInfo = {
                        is_warn: extend.is_warn || 0,
                        title_img: '',//横向滑动内部头图12.18新增
                        embellish_img: extend.embellish_img || '',//修饰图片12.18新增
                        embellish_img2: extend.embellish_img2 || '',//修饰图片12.18新增
                        price_color: extend.price_color || '',//价格颜色12.18
                        more_text_font: "", // 查看更多文案颜色 3.1期增加
                        more_bg_color: "", // 查看更多背景颜色 3.1期增加
                        show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
                        disable_tips: "活动未开始", // 置灰文案; 3.1期增加
                        is_hot: false, // 是否为爆款商品: 是 true; 否 false; 3.1期增加
                        module_type: 8,
                        subscript_pic: extend.subscript_pic || '',//爆款商品角标
                        module_title: "横向滑动模块",
                        background: '',
                        back_height: 0,
                        background_color: this.template.background_color || '',
                        template: extend.template || '', //模板类型
                        price_text: extend.price_text || '', //活动价名称
                        act_type: "actlist", //活动类型
                        act_id: "", //活动id
                        url_h5_format: "", //活动详情h5链接格式
                        url_xcx_format: "", //活动详情小程序链接格式
                        max_rows: "", //显示多少个商品
                        more_url_xcx: "", //[商品模块专属]更多内容 - 小程序链接
                        more_url_h5: "", //[商品模块专属]更多内容 - h5链接
                        position: extend.position || '', // 位置: 一列商品 0,左上1,左下二列,三列商品0,左上1,右上2,左下3,右下 11月需求增加
                        subscript: "", // 角标 11月需求增加
                        price_bg_color: extend.price_bg_color || "#DC2992",//价格颜色
                        logo: "", // logo 11月需求增加
                        show_logo: false, // 是否显示logo 11月需求增加
                        show_mode: [...show_mode_data],
                        fe_module_id: "fe_module_id" + Date.now(),
                        goods: []
                    };
                    break;
                case 17:
                    this.couponModule = {
                        module_type: 9,
                        module_title: "优惠券模块",
                        background: "",
                        bg_color: "",//背景颜色
                        before_img: "",
                        after_img: "",
                        collection_method: "onekey", // 领取方式: 一键领取 onekey; 单张领取 single;
                        collection_rate: "1day1", // 领取频率: 一天一次 1day1; 一次 once;
                        list: [],
                        fe_module_id: "fe_module_id" + Date.now(),
                        show_mode: [...show_mode_data],
                        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
                        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
                    }
                    break;
                case 19:
                    this.recommend = {
                        module_type: 10, //模块类型: 1 热区; 2 商品; 3 轮播;
                        module_title: "爆品推荐模块", //模块名称
                        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
                        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
                        show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
                        disable_tips: "活动未开始", // 置灰文案; 3.1期增加
                        bg_def_color: '#ffffff',//按钮的默认背景色
                        bg_sel_color: '#fdf3ad',//按钮的选中背景色
                        font_def_color: '#000000',//字体默认颜色
                        font_sel_color: '#000000',//字体选中颜色
                        picture_list: [],//轮播列表
                        show_mode: [...show_mode_data],
                        fe_module_id: "fe_module_id" + Date.now(),
                    }
                    break;
                case 21:
                    this.couponModule = {
                        module_type: 11,
                        module_title: "一键领取优惠券",
                        goods_id: '',//商品ID 20191129新增
                        background: "",
                        bg_color: "",//背景颜色
                        before_img: "",
                        after_img: "",
                        is_sale_share: 0,//是否活动可用
                        collection_method: "onekey", // 领取方式: 一键领取 onekey; 单张领取 single;
                        collection_rate: "1day1", // 领取频率: 一天一次 1day1; 一次 once;
                        list: [],
                        show_mode: [...show_mode_data],
                        fe_module_id: "fe_module_id" + Date.now(),
                        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
                        show_end_ts: '' // 结束显示时间 每个模块都增加 3.1期增加
                    }
                    break
                case 22:
                    this.titleClass = {
                        module_type: 12,
                        module_title: "标题分类模块",
                        icon: "", // 图标
                        title: "", // 标题
                        font_color: "#ffffff", // 标题颜色
                        bg_color: "", // 背景颜色
                        fe_module_id: "fe_module_id" + Date.now(),// 配合前端的冗余字段
                        show_mode: [...show_mode_data],
                        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
                        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
                    }
                    break
                case 23:
                    this.recommend = {
                        module_type: 13, //模块类型: 1 热区; 2 商品; 3 轮播;
                        module_title: "爆品推荐模块v2", //模块名称
                        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
                        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
                        show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
                        disable_tips: "活动未开始", // 置灰文案; 3.1期增加
                        bg_color_def: '#ffffff',//按钮的默认背景色
                        bg_sel_color: '#fdf3ad',//按钮的选中背景色
                        font_def_color: '#000000',//字体默认颜色
                        font_sel_color: '#000000',//字体选中颜色
                        picture_list: [],//轮播列表
                        fe_module_id: "fe_module_id" + Date.now(),
                        show_mode: [...show_mode_data],
                    }
                    break;
                case 24:
                    this.texthotModule = {
                        back_height: '文字噱头模块',
                        module_type: 14, //模块类型: 1 热区; 2 商品; 3 轮播;
                        module_title: "", //模块名称
                        show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
                        disable_tips: "活动未开始", // 置灰文案; 3.1期增加
                        list: [],//轮播列表
                        fe_module_id: "fe_module_id" + Date.now(),
                        top: 308,
                        left: 60,
                        background: '',
                        show_mode: [...show_mode_data],
                    }
                    break;
                case 26:
                    this.template.m.forEach(item => {
                        if (item.module_type === 15) {
                            this.isShowForm = '';
                            this.$notify({
                                title: "时间轴模块已存在!",
                                message: "只能添加一个时间轴模块!",
                                offset: 100,
                                type: "warning"
                            });
                            return;
                        }
                    });
                    this.timelineModule = {
                        module_type: 15, //模块类型: 1 热区; 2 商品; 3 轮播;
                        module_title: "时间轴模块", //模块名称
                        show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
                        disable_tips: "活动未开始", // 置灰文案; 3.1期增加
                        bg_def_color: '#F22E50',// 默认背景颜色
                        bg_sel_color: '#FFFFFF',// 选中背景颜色
                        font_def_color: '#80142A',//默认字体颜色
                        font_sel_color: '#F22E50',//选中字体颜色
                        list: [],//轮播列表
                        fe_module_id: "fe_module_id" + Date.now(),
                        show_mode: [...show_mode_data],
                    }
                    break;
                case 28:
                    this.recommend = {
                        module_type: 16, //模块类型: 1 热区; 2 商品; 3 轮播;
                        module_title: "爆品推荐v3模块", //模块名称
                        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
                        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
                        show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
                        disable_tips: "活动未开始", // 置灰文案; 3.1期增加
                        bg_def_color: '#ffffff',//按钮的默认背景色
                        bg_sel_color: '#fdf3ad',//按钮的选中背景色
                        font_def_color: '#000000',//字体默认颜色
                        font_sel_color: '#000000',//字体选中颜色
                        picture_list: [],
                        fe_module_id: "fe_module_id" + Date.now(),
                        show_mode: [...show_mode_data],
                    }
                    break;
                case 30:
                    this.recommend = {
                        module_type: 17, //模块类型: 1 热区; 2 商品; 3 轮播;
                        module_title: "爆品推荐v4模块", //模块名称
                        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
                        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
                        show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
                        disable_tips: "活动未开始", // 置灰文案; 3.1期增加
                        bg_def_color: '#ffffff',//按钮的默认背景色
                        bg_sel_color: '#fdf3ad',//按钮的选中背景色
                        font_def_color: '#000000',//字体默认颜色
                        font_sel_color: '#000000',//字体选中颜色
                        picture_list: [],
                        template: 'rows_1',
                        fe_module_id: "fe_module_id" + Date.now(),
                        show_mode: [...show_mode_data],
                    }
                    break;
                case 32:
                    this.limitedtimeModule = {
                        module_type: 19,
                        module_title: "限时抢模块",
                        bg_def_color: "#FFFFFF",// 倒计时默认背景颜色
                        bg_sel_color: "#FE0F40",// 选中背景颜色
                        font_def_color: "#333333",// 默认字体颜色
                        font_sel_color: "#FFFFFF",// 选中字体颜色
                        fe_module_id: "fe_module_id" + Date.now(),
                        picture_list: [],
                        show_mode: [...show_mode_data],
                    }
                    this.countdownChild = { ...countdown_Child }
                    break;
                case 34:
                    this.carouselHot = {
                        module_type: 18, //模块类型: 1 热区; 2 商品; 3 轮播;
                        module_title: "轮播热区模块", //模块名称
                        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
                        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
                        show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
                        disable_tips: "活动未开始", // 置灰文案; 3.1期增加
                        picture_list: [],
                        fe_module_id: "fe_module_id" + Date.now(),
                        show_mode: [...show_mode_data],
                    };
                    this.carousellist = { ...carousel_list }
                    break;
                case 35:
                    this.couponSlideModule = {
                        module_type: 20,
                        module_title: "优惠券滑动模块",
                        before_img: "",
                        after_img: "",
                        collection_rate: "1day1", // 领取频率: 一天一次 1day1; 一次 once;
                        list: [{ coupon_code: '', goods_id: '' }],
                        fe_module_id: "fe_module_id" + Date.now(),
                        template: 1,
                        font_def_color: '#000000',
                        show_mode: [...show_mode_data],
                        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
                        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
                    }
                    break;
                default:
                    this.dialogButton = false;
            }
        },
        // 提交数据
        saveData(noUpdata) {
            // 侧边栏校验
            if (this.template.side_navs.length > 0) {
                let len = this.template.side_navs.length;
                let navs = this.template.side_navs[(len - 1)];
                if (new RegExp(/\/dist/).test(navs.url_h5) == false) {
                    return this.$message.error('请填写正确的H5链接');
                }
                if (new RegExp(/\/pages/).test(navs.url_xcx) == false) {
                    return this.$message.error('请填写正确的小程序链接');
                }
                if (!navs.text || !navs.url_h5 || !navs.url_xcx) return this.$message.error('测边栏未配完');
            }
            // 商品基础配置校验
            if (this.template.extend_goods.is_warn === 1) {
                if (!this.template.extend_goods.embellish_img || !this.template.extend_goods.embellish_img2)
                    return this.$message.error('请上传修饰图');
            }
            switch (this.template.is_countdown) {
                case 1:
                    if (!this.template.begin_ts || !this.template.finish_ts) return this.$message.error('请填写活动开始时间与结束时间')
                    break;
            }
            const loading = this.$loading({//loading 打开
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.timeToolD();//时间转化成时间戳秒值后台需求
            // 保存前判断活动中activity_id是否存在templatePost对象中，而不是activity_id是否为空。没有此字段不可保存
            let templatePost = this.template;
            if (!templatePost.hasOwnProperty('activity_id')) return alert('请刷新页面!');
            if (noUpdata == 2) templatePost.activity_id = '';
            handleimgPost(templatePost).then(res => {
                //如果没有ID则不需要使用
                if (res.data.activity_id) {
                    this.template.activity_id = res.data.activity_id
                }
                if (res.errno == 0) {
                    loading.close();//关闭loading
                    if (noUpdata == 1) {
                        this.timeToolM();
                        this.$message({
                            message: "信息保存成功!",
                            type: "success"
                        });
                    } else if (noUpdata == 3) { //轮播热区新建模块时要刷新下页面，保证数据的准确性待解决
                        return window.location.reload();
                    } else {
                        let fL = this.template.m.filter(item => {
                            if (item.module_type === 15) {
                                if (item.list.length < 3) {
                                    this.timeToolM();
                                    return this.$message.error('时间轴模块时间线必须填写3到4个!');
                                }
                            } else if (item.module_type === 22) {
                                if (item.template === 'type_1') {
                                    if (item.picture_list.length < 3 || item.picture_list.length > 4) {
                                        this.timeToolM();
                                        return this.$message.error('呼吸效果请添加3~4张图片')
                                    }
                                } else if (item.template === 'type_2') {
                                    if (item.picture_list.length !== 6 && item.picture_list.length !== 8) {
                                        this.timeToolM();
                                        return this.$message.error('翻转效果请添加6或者8张图片')
                                    }
                                }
                            }
                        }).length;
                        if (fL < 1) {
                            this.$router.push({
                                path: "/EventPageList",
                            });
                            return
                        }
                    }
                    return;
                } else {
                    loading.close();//关闭loading
                    this.$message.error(res.errmsg);
                    // 上传失败后还原时间
                    this.timeToolM();
                }
            }).catch(err => {
                loading.close();//关闭loading
                this.$message.error(err);
                // 上传失败后还原时间
                this.timeToolM();
            });
        },
        // 编辑时间处理函数
        editTime(time) {
            if (time == undefined) return;
            if (time.toString().length < 13) {
                time = time * 1000
                return time
            } else if (time.toString().length > 13) {
                time = time / 1000
                return time
            }
        },
        //保存时间处理
        saveTime(time) {
            if (time == undefined) return;
            if (time.toString().length < 10) {
                time = time * 1000
                return time
            } else if (time.toString().length > 10) {
                time = time / 1000
                return time
            }
        },
        //编辑 修改时接口数据赋值
        actSearch() {
            handleimgSearch(this.template.activity_id).then(res => {
                //先使用Object.assign 将返回值赋值
                this.template = Object.assign({}, this.template, res.data)
                res.data.list.forEach(item => {
                    switch (item.module_type) {
                        case 1:
                            if (item.areas) {
                                item.areas.forEach(value => {
                                    if (value.act_type !== 'seckill' && value.act_type !== 'topic') {
                                        value.act_type = 'actlist';
                                    }
                                })
                            }
                            break;
                        case 2:
                            if (item.act_type !== 'seckill' && item.act_type !== 'topic') {
                                item.act_type = 'actlist';
                            }
                            break;
                        case 3:
                            if (item.picture_list)
                                item.picture_list.forEach(value => {
                                    if (value.act_type !== 'seckill' && value.act_type !== 'topic') {
                                        value.act_type = 'actlist';
                                    }
                                })
                        case 4:
                        case 6:
                        case 7:
                            if (item.list)
                                item.list.forEach(value => {
                                    if (value.act_type !== 'seckill' && value.act_type !== 'topic') {
                                        value.act_type = 'actlist';
                                    }
                                })
                            break;
                        case 8:
                        case 9:
                        case 11:
                        case 12:
                        case 14:
                            if (item.list)
                                item.list.forEach(value => {
                                    if (value.act_type !== 'seckill' && value.act_type !== 'topic') {
                                        value.act_type = 'actlist';
                                    }
                                })
                            break;
                        case 15:
                            if (item.list)
                                item.list.forEach(value => {
                                    if (value.act_type !== 'seckill' && value.act_type !== 'topic') {
                                        value.act_type = 'actlist';
                                    }
                                })
                            break;
                        case 18:
                            if (item.picture_list) {
                                item.picture_list.forEach(pic => {
                                    if (pic.areas) {
                                        pic.areas.forEach(value => {
                                            if (value.act_type !== 'seckill' && value.act_type !== 'topic') {
                                                value.act_type = 'actlist';
                                            }
                                        })
                                    }
                                })
                            }
                            break;
                        case 5:
                            if (item.time_list) {
                                item.time_list.forEach(idata => {
                                    if (idata.act_type !== 'seckill' && idata.act_type !== 'topic') {
                                        idata.act_type = 'actlist';
                                    }
                                })
                            }
                            break;
                        case 10:
                            if (item.picture_list)
                                item.picture_list.forEach(value => {
                                    if (value.act_type !== 'seckill' && value.act_type !== 'topic') {
                                        value.act_type = 'actlist';
                                    }
                                })
                            break;
                        case 13:
                            if (item.picture_list)
                                item.picture_list.forEach(value => {
                                    if (value.act_type !== 'seckill' && value.act_type !== 'topic') {
                                        value.act_type = 'actlist';
                                    }
                                })
                            break;
                        case 16:
                            if (item.picture_list)
                                item.picture_list.forEach(value => {
                                    if (value.act_type !== 'seckill' && value.act_type !== 'topic') {
                                        value.act_type = 'actlist';
                                    }
                                })
                            break;
                        case 17:
                            if (item.picture_list) {
                                item.picture_list.forEach(idata => {
                                    if (idata.act_type !== 'seckill' && idata.act_type !== 'topic') {
                                        idata.act_type = 'actlist';
                                    }
                                })
                            }
                            break;
                        case 19:
                        case 20:
                        case 21:
                        case 22:
                            if (item.picture_list)
                                item.picture_list.forEach(value => {
                                    if (value.act_type !== 'seckill' && value.act_type !== 'topic') {
                                        value.act_type = 'actlist';
                                    }
                                })
                            break;
                    }
                    return item;
                })
                //最后将this.template.m 数组赋值,将数据实现返显
                this.template.m = res.data.list;
                this.timeToolM();
                delete this.template.list;
            });
        },
        // 时间处理函数乘法  秒值转换成毫秒值
        timeToolM() {
            // 如果上传成功后还原时间 为什么不直接调用编辑函数呢?因为修改函数调用的时候会让数组的数据双向绑定失效 解释:调用编辑函数后会重新给this.template赋值
            if (this.template.begin_ts.toString().length < 13) {
                this.template.begin_ts = this.template.begin_ts * 1000 || '';
                this.template.finish_ts = this.template.finish_ts * 1000 || '';
                this.template.m.forEach((item, index, arrar) => {
                    if (item.module_type == 1 || item.module_type == 2 || item.module_type == 3 || item.module_type == 4 || item.module_type == 6 || item.module_type == 7 || item.module_type == 8 || item.module_type == 9 || item.module_type == 11 || item.module_type == 12 || item.module_type == 14 || item.module_type == 15 || item.module_type == 18 || item.module_type == 20 || item.module_type == 21 || item.module_type == 22) {
                        arrar[index].show_begin_ts = item.show_begin_ts * 1000 || '';
                        arrar[index].show_end_ts = item.show_end_ts * 1000 || '';
                    } else if (item.module_type == 5) {
                        if (arrar[index].time_list)
                            arrar[index].time_list.forEach(idata => {
                                idata.begin_ts = idata.begin_ts * 1000 || '';
                                idata.end_ts = idata.end_ts * 1000 || '';
                            })
                    } else if (item.module_type == 10 || item.module_type == 13 || item.module_type == 16 || item.module_type == 17) {
                        arrar[index].show_begin_ts = item.show_begin_ts * 1000 || '';
                        arrar[index].show_end_ts = item.show_end_ts * 1000 || '';
                        if (item.picture_list) {
                            arrar[index].picture_list.forEach(idata => {
                                idata.begin_ts = idata.begin_ts * 1000 || '';
                                idata.end_ts = idata.end_ts * 1000 || '';
                            })
                        }
                    } else if (item.module_type == 19) {
                        if (item.picture_list) {
                            arrar[index].picture_list.forEach(idata => {
                                idata.begin_ts = idata.begin_ts * 1000 || '';
                                idata.end_ts = idata.end_ts * 1000 || '';
                            })
                        }
                    }
                    // forEach 里面尽量不要使用switch进行多条件判断
                })
            }
        },
        // 时间除法 毫秒值转换成秒值
        timeToolD() {
            this.template.begin_ts = this.saveTime(this.template.begin_ts)
            this.template.finish_ts = this.saveTime(this.template.finish_ts)
            if (!this.template.m) {
                return;
            }
            this.template.m.forEach((item, index, arrar) => {
                switch (arrar[index].module_type) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 11:
                    case 12:
                    case 14:
                    case 15:
                    case 18:
                    case 20:
                    case 21:
                    case 22:
                        arrar[index].show_begin_ts = this.saveTime(arrar[index].show_begin_ts)
                        arrar[index].show_end_ts = this.saveTime(arrar[index].show_end_ts)
                        break;
                    case 5:
                        if (arrar[index].time_list) {
                            arrar[index].time_list.forEach(idata => {
                                idata.begin_ts = this.saveTime(idata.begin_ts)
                                idata.end_ts = this.saveTime(idata.end_ts)
                            })
                        }
                        break;
                    case 10:
                    case 13:
                    case 16:
                    case 17:
                        arrar[index].show_begin_ts = this.saveTime(arrar[index].show_begin_ts)
                        arrar[index].show_end_ts = this.saveTime(arrar[index].show_end_ts)
                        if (arrar[index].picture_list) {
                            arrar[index].picture_list.forEach(idata => {
                                idata.begin_ts = this.saveTime(idata.begin_ts)
                                idata.end_ts = this.saveTime(idata.end_ts)
                            })
                        }
                        break;
                    case 19:
                        if (arrar[index].picture_list) {
                            arrar[index].picture_list.forEach(idata => {
                                idata.begin_ts = this.saveTime(idata.begin_ts)
                                idata.end_ts = this.saveTime(idata.end_ts)
                            })
                        }
                        break;
                    default:
                        arrar[index].show_begin_ts = this.saveTime(item.show_begin_ts)
                        arrar[index].show_end_ts = this.saveTime(item.show_end_ts)
                        break;
                }
            })
        },
        //修改模块
        templateItem(data, index) {
            this.templateIndex = index;
            this.redactVSadd = 1;
            switch (data.module_type) {
                case 2:
                    this.isShowForm = 4;
                    this.commodityInfo = data;
                    break;
                case 8:
                    this.isShowForm = 16;
                    this.commodityInfo = data;
                    break;
                case 1:
                    this.isShowForm = 3;
                    this.form = Object.assign({}, data);
                    if (data.module_title == "") this.ShowHidden_del_but = false;
                    else this.ShowHidden_del_but = true;
                    break;
                case 3:
                    this.isShowForm = 6;
                    this.carousel_map = data
                    this.carouse_url = {
                        img_url: '',
                        goods_type: "act_goods",
                        act_type: "actlist",
                        link_type: "1",
                        act_id: "",
                        goods_id: "",
                        url_h5: "",
                        url_xcx: ""
                    }
                    break;
                case 4:
                    this.isShowForm = 2;
                    this.temp_extends = data;
                    if (this.temp_extends.navs.length === 0) {
                        this.isINavsBut = 1;
                    } else {
                        this.isINavsBut = 2;
                    }
                    break;
                case 5:
                    this.isShowForm = 8;
                    this.countdownModule = data;
                    break;
                case 6:
                    this.isShowForm = 10;
                    this.barrageModule = data;
                    this.barrageList = {
                        type: "text", // 类型: img 图片; text 文字;
                        type_value: "", // 类型值,type为img该值为图片地址,type为text,类型值为文本
                        url_h5: "", // h5链接
                        url_xcx: "", // 小程序链接
                        font_def_color: "", // 文字默认颜色
                        font_sel_color: "", // 文字选中颜色
                        background_color: "", // 背景颜色
                    }
                    break;
                case 7:
                    this.isShowForm = 14
                    this.TABcommodModule = data
                    break;
                case 9:
                    this.isShowForm = 17
                    this.couponModule = data
                    break;
                case 10:
                    this.isShowForm = 19
                    this.recommend = data
                    break;
                case 11:
                    this.isShowForm = 21
                    this.couponModule = data
                    break;
                case 12:
                    this.isShowForm = 22
                    this.titleClass = data
                    break;
                case 13:
                    this.isShowForm = 19;
                    this.recommend = data;
                    break;
                case 14:
                    this.isShowForm = 24;
                    this.texthotModule = data;
                    break;
                case 15:
                    this.isShowForm = 26;
                    this.timelineModule = data;
                    break;
                case 16:
                    this.isShowForm = 28;
                    this.recommend = data;
                    break;
                case 17:
                    this.isShowForm = 30;
                    this.recommend = data;
                    break;
                case 18:
                    this.carouselHot = data;
                    this.carousellist = data.picture_list[this.texthotIndex];
                    this.isShowForm = 34;
                    this.visible = false;
                    break;
                case 19:
                    this.isShowForm = 32;
                    this.limitedtimeModule = data;
                    break;
                case 20:
                    this.isShowForm = 35
                    this.couponSlideModule = data;
                    break;
                case 21:
                    this.isShowForm = 38
                    this.commodityInfo = data;
                    switch (data.template) {
                        case 'rows_1':
                            this.commodityInfo.some = data.max_rows / data.split_some;
                            break;
                        case 'rows_2':
                            this.commodityInfo.some = data.max_rows / data.split_some / 2;
                            break;
                        case 'rows_3':
                            this.commodityInfo.some = data.max_rows / data.split_some / 3;
                            break;
                        default:
                            break;
                    }
                    break;
                case 22:
                    this.isShowForm = 37;
                    this.carousel_map = data
                    break;
            };
        },
        //删除模块
        DeleteMokuai(i) {
            this.$confirm("确认删除此模块?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.isINavsBut = 1; //删除导航模块后添加按钮显示
                    // this.form.hotspots._stop();
                    this.isShowForm = ''
                    this.template.m = this.template.m.filter((res, index) => index !== this.templateIndex);
                    // this.template.m = this.template.m.splice(this.templateIndex, 1);
                })
                .catch(() => { });
        },
        //删除图片
        Deletehead_img(key0, key, value) {
            this.$confirm("确认删除此图片?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    return key0 ? this[key0][key][value] = '' : this[key][value] = '';
                })
                .catch(() => { });
        },
        //扫码
        async handleSaoma() {
            if (this.template.activity_id) {
                let url = '/dist3/childActivity?id=' + this.template.activity_id;
                // 清空上一个二维码
                $('#qrcode').html("");
                setTimeout(() => {
                    this.showYlan = true;
                    let qrcode = new QRCode('qrcode', {
                        width: 180,
                        height: 180,
                        text: 'http://h5.dfs800.com' + url, // 二维码地址-正式
                        // text: 'http://csqa54.test.dfs800.com' + url, // 二维码地址-测试
                    })
                })
            } else {
                return this.$message.error('您的活动还没创建成功！');
            }
        },
        yulanshouw() {
            this.showYlan = false;
        },
        //mousedown.stop 事假终止
        moveStop() {
            return false;
        },
        // 拖动排序 - start
        datadragEnd(evt) {
            evt.preventDefault();
            if (this.template.m[evt.oldIndex].module_type) {
                if (this.template.m[evt.oldIndex].module_type === 1) {
                    this.template.m[evt.oldIndex].hotspots._stop();
                    this.template.m[evt.oldIndex].hotspots = null;
                    setTimeout(() => {
                        this.initData(this.template.m[evt.oldIndex]);
                    });
                }
                if (this.template.m[evt.newIndex].module_type === 1) {
                    this.template.m[evt.newIndex].hotspots._stop();
                    this.template.m[evt.newIndex].hotspots = null;
                    setTimeout(() => {
                        this.initData(this.template.m[evt.newIndex]);
                    });
                }
            }
        },
        //权限显示
        handleClick(tab, event) {
            this.isShowFormNavs = tab.index;
        },
        // 点击事件禁止冒泡
        removalEvent() {
            return false;
        },
        // //时间
        formatTime: function (cellValue) {
            let date = cellValue / 1000
            return formatDate(date)
        },
        // 背景颜色
        dynamicBg() {
            return `background-color: ${this.template.background_color}`
        },
        //自动排序sort
        sortfunc(array) {
            function sortNumber(a, b) {
                return a.end_ts - b.end_ts;
            };
            return array.sort(sortNumber);
        },
        // 预览大图
        getSrcList(index, key) {
            return this[key].slice(index).concat(this[key].slice(0, index))
        },
        rowsChang() {
            this.$notify({
                title: "警告，您已修改显示方式!",
                message: "请重新添加商品！！！",
                type: "warning"
            });
        },
        //热区模块陈旧代码
        //轮播图热区模块
        carouselhotListBut() {
            if (!this.carousellist.background) return this.$message.error('请先上传图片');
            this.carousellist.fe_module_id = "fe_module_id" + Date.now();
            let obj = JSON.parse(JSON.stringify(this.carousellist));
            if (!this.visible) {
                this.visible = true;
                this.carouselHot.picture_list.splice(this.texthotIndex, 1, obj);
            } else {
                this.carouselHot.picture_list.push(obj);
            };
            this.carousellist = { ...carousel_list };
            // this.saveData('3');
        },
        //轮播图热区模块 选中当前图片
        carouselhotClick(tab, index) {
            this.carousellist = tab;
            this.visible = false;
            this.texthotIndex = index
        },
        //新建轮播热区模板
        carouselModule() {
            this.carouselHot.back_height = this.backHeight;
            this.hot_type = "轮播热区";
            this.isShowForm = "";
            if (this.redactVSadd === 2) {
                this.form.fe_module_id = "fe_module_id" + Date.now();
                this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, JSON.parse(JSON.stringify(this.carouselHot)));
            } else {
                this.template.m.splice(this.templateIndex, 1, this.carouselHot);
                this.redactVSadd = 2;
            }
            this.saveData('3');
        },
        // 批量创建热区模块
        batchMoban() {
            this.hot_type = "图片热区";
            this.isShowForm = "";
            this.materialPics.map(item => {
                setTimeout(() => {
                    this.form.fe_module_id = "fe_module_id" + Date.now();
                    this.form.background = item.image_url;
                    this.form.module_title = item.name;
                    this.form.base64_url = item.base64_url;
                    this.form.back_height = item.back_height;
                    this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, JSON.parse(JSON.stringify(this.form)));
                    this.materialPics.shift();
                }, 100);
            });
        },
        //新建热区模板
        moban(form) {
            this.hot_type = "图片热区";
            this.form.base64_url = this.parentMsg;
            this.form.back_height = this.backHeight;
            this.$refs[form].validate(valid => {
                if (valid) {
                    if (this.redactVSadd === 2) {
                        if (this.form.module_title == "") this.ShowHidden_del_but = false;
                        else this.ShowHidden_del_but = true;
                        this.form.fe_module_id = "fe_module_id" + Date.now();
                        this.template.m.splice((this.isAddVSUp ? 0 : this.templateIndex + 1), 0, JSON.parse(JSON.stringify(this.form)));
                        //新增插入模块表单
                    } else {
                        //修改
                        if (this.form.module_title == "") this.ShowHidden_del_but = false;
                        else this.ShowHidden_del_but = true;
                        this.template.m.splice(this.templateIndex, 1, this.form);
                    }
                    this.isShowForm = "";
                    this.redactVSadd = 2;
                } else {
                    return false;
                }
            });
        },
        //立即创建热区表单
        requBut(form_data, index) {
            let hotfrom = {};
            this.form_data.url_h5 = form_data.url_h5.replace(/\ +/g, "");
            this.form_data.url_xcx = form_data.url_xcx.replace(/\ +/g, "");
            // this.form_data.base64_url = this.parentMsg;
            if (this.hot_type === "轮播热区") {
                hotfrom = this.carousellist;
            }
            else {
                hotfrom = this.form;
            }
            this.form_data.container_height = "10";
            this.form_data.container_width = "10";
            this.form_data.select_box_height = hotfrom.hotspots.get().selectBoxHeight;
            this.form_data.select_box_width = hotfrom.hotspots.get().selectBoxWidth;
            this.form_data.select_box_left = hotfrom.hotspots.get().selectBoxLeft;
            this.form_data.select_box_top = hotfrom.hotspots.get().selectBoxTop;
            let obj = JSON.parse(JSON.stringify(this.form_data));
            if (this.redactVSadd === 0) {
                hotfrom.areas.push(obj); //把选中热区表单 插入当前模块
            } else {
                this.redactVSadd = 0;
                hotfrom.areas.splice(hotfrom.areas.indexOf(this.form_data), 1, obj);
            }
            hotfrom.hotspots._removeDiv();
            if (this.hot_type === "轮播热区") this.carousellist = hotfrom;
            else this.form = hotfrom;
            this.isShowForm = 0;
            this.form_data = { ...formData };
            this.saveData('1');//当运营想要一个实时保存的功能时
        },
        //form_data 当前模块的热区  data 当前模块的数据 index当前模块顺序
        hotItem(form_data, data, index, item) {
            this.isShowForm = 5; //热区表单
            switch (data.module_type) {
                case 1:
                    this.form = data;
                    this.hot_type = "图片热区"
                    this.setHotSpots(data, form_data)
                    break;
                case 18:
                    this.carouselHot = data;
                    this.hot_type = "轮播热区"
                    this.carousellist = item;
                    this.setHotSpots(item, form_data)
                    break;
            }
            this.redactVSadd = 1;
            this.form_data = form_data;
            this.index = index;
        },
        setHotSpots(data, form_data) {
            setTimeout(() => {
                data.hotspots.set({
                    // 相对容器宽度
                    containerHeight: document.getElementsByClassName(data.fe_module_id)[0].offsetHeight, //获取模块的高度
                    // 相对容器高度
                    containerWidth: 560,
                    // 相对选区宽度
                    selectBoxHeight: form_data.select_box_height,
                    // 相对选区宽度
                    selectBoxLeft: form_data.select_box_left,
                    // 相对选区offsetLeft
                    selectBoxTop: form_data.select_box_top,
                    // 相对选区offsetTop
                    selectBoxWidth: form_data.select_box_width
                });
            });
            return data;
        },
        //删除热区
        DeleteRequ(form_data) {
            let f_name = form_data.name ? form_data.name : '';
            //删除当前选中热区
            this.$confirm("确认删除  <" + f_name + ">  热区?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    //功能: 删除当前模块上的最后一个热区后工作区隐藏 问题:进页面画第一个热区时会处发导致画第二次才会出现工作区===待解决
                    if (this.hot_type === "图片热区") {
                        switch (this.form.areas.length) {
                            case 0:
                                this.isShowForm = "";
                                break;
                        };
                        this.form.areas.splice(this.form.areas.indexOf(this.form_data), 1);
                        this.form.hotspots._removeDiv();
                    } else if (this.hot_type === "轮播热区") {
                        switch (this.carousellist.areas.length) {
                            case 0:
                                this.isShowForm = "";
                                break;
                        };
                        this.carousellist.areas.splice(this.carousellist.areas.indexOf(this.form_data), 1);
                        this.carousellist.hotspots._removeDiv();
                    }
                    this.form_data = { ...formData };
                })
                .catch(() => { });
        },
        // 热区div
        HotZone_style(form_data) {
            //将画完的热区坐标辅助给div
            return `width: ${form_data.select_box_width}px ; height: ${form_data.select_box_height}px ;top: ${form_data.select_box_top}px;left: ${form_data.select_box_left}px;`;
        },
        initSet(data, index, item) {
            this.initData(data, item);
        },
        // 建立热区
        initData(form, carouse) {
            let that = this; //this 重定义
            function createRect(parent) {
                //创建div
                const rect = document.createElement("div");
                rect.style.cssText =
                    "position: absolute; box-sizing: border-box; border: 2px solid red; left: auto; top: auto; right: auto; bottom: auto;background-color: rgba(0, 0, 0, .3);";
                const mouseDownAndMove = new MouseDownAndMove(rect);
                mouseDownAndMove.before("down", e => e.target === rect);
                mouseDownAndMove.on("move", (e, start) => {
                    rect.style.transform = `translate3d(${e.x - start.x}px, ${e.y -
                        start.y}px, 0)`;
                });
                mouseDownAndMove.on("up", (e, start) => {
                    rect.style.transform = "none";
                    rect.style.top = rect.offsetTop + e.y - start.y + "px";
                    rect.style.left = rect.offsetLeft + e.x - start.x + "px";
                    rect.style.bottom = "auto";
                    rect.style.right = "auto";
                });
                parent.appendChild(rect);
                return rect;
            }
            function createRound(parent, top, left) {
                const size = "8px";
                const round = document.createElement("div");
                round.style.cssText = `position: absolute; width: ${size}; height: ${size}; border: 1px solid red; border-radius: ${size};background-color: white;`;
                round.style.top = typeof top === "string" ? top : top + "px";
                round.style.left = typeof left === "string" ? left : left + "px";
                parent.appendChild(round);
                return round;
            }
            class MouseDownAndMove {
                constructor(node) {
                    this._onHooks = {};
                    this._beforeHooks = {};
                    this.ele = node;
                    this.mousedown = e => {
                        if (e.button === 0 && this._runHook("before", "down", e)) {
                            this._isDown = true;
                            this._start = {
                                x: e.x,
                                y: e.y,
                                offsetX: e.offsetX,
                                offsetY: e.offsetY
                            };
                            this._runHook("on", "down", e);
                        }
                    };
                    this.mouseup = e => {
                        if (e.button === 0 && this._isDown) {
                            this._isDown = false;
                            this._runHook("on", "up", e);
                        }
                    };
                    this.mousemove = e => {
                        if (this._isDown) {
                            e.preventDefault();
                            this._runHook("on", "move", e);
                        }
                    };
                    node.addEventListener("mousedown", this.mousedown);
                    node.addEventListener("mouseup", this.mouseup);
                    node.addEventListener("mousemove", this.mousemove);
                }

                _stop() {
                    this.ele.removeEventListener("mousedown", this.mousedown, false);
                    this.ele.removeEventListener("mouseup", this.mouseup, false);
                    this.ele.removeEventListener("mousemove", this.mousemove, false);
                }

                _runHook(type, name, e) {
                    const hook =
                        type === "on" ? this._onHooks[name] : this._beforeHooks[name];
                    if (typeof hook === "function") return hook(e, this._start);
                    return true;
                }

                on(name, handler) {
                    this._onHooks[name] = handler;
                }

                before(name, handler) {
                    this._beforeHooks[name] = handler;
                }
            }
            function createRounds(parent) {
                const size = 5;
                const positions = [
                    {
                        top: -size,
                        left: [
                            -size,
                            `-webkit-calc(50% - ${size}px)`,
                            `-webkit-calc(100% - ${size}px)`
                        ]
                    },
                    {
                        top: `-webkit-calc(50% - ${size}px)`,
                        left: [-size, `-webkit-calc(100% - ${size}px)`]
                    },
                    {
                        top: `-webkit-calc(100% - ${size}px)`,
                        left: [
                            -size,
                            `-webkit-calc(50% - ${size}px)`,
                            `-webkit-calc(100% - ${size}px)`
                        ]
                    }
                ];
                let code = 0;
                const cursors = [
                    "nwse",
                    "ns",
                    "nesw",
                    "ew",
                    "ew",
                    "nesw",
                    "ns",
                    "nwse"
                ];
                for (let { top, left } of positions) {
                    for (let _left of left) {
                        const round = createRound(parent, top, _left);
                        round._roundCode = code++;
                        round.style.cursor = cursors[round._roundCode] + "-resize";
                    }
                }
            }
            class Hotspots {
                constructor(container) {
                    //根据拖拽 画选区
                    this._container = container;
                    this._containerRect = this._container.getBoundingClientRect();
                    this.mouseDownAndMove = new MouseDownAndMove(this._container);
                    this.mouseDownAndMove.before(
                        "down",
                        e =>
                            e.target.hasOwnProperty("_roundCode") || e.target !== this._rect
                    );
                    this.mouseDownAndMove.on("down", (e, start) => {
                        this._target = e.target;
                        if (e.target.hasOwnProperty("_roundCode")) {
                            const roundCode = e.target._roundCode;
                            this._rect.style.cursor = e.target.style.cursor;
                            const rect = this._getRect();
                            const isTop = roundCode > 2;
                            const isLeft = [2, 4, 7].indexOf(roundCode) !== -1;
                            this._start = {
                                offsetX: isLeft ? rect.left + 2 : rect.right,
                                offsetY: isTop ? rect.top + 2 : rect.bottom
                            };
                            const x = e.x - e.offsetX + 8;
                            const y = e.y - e.offsetY - 2;
                            this._start.x = isLeft ? x - rect.width : x + rect.width;
                            this._start.y = isTop ? y - rect.height : y + rect.height;
                        } else if (e.target !== this._rect) {
                            this._start = start;
                            if (this._rect) {
                                this._container.removeChild(this._rect);
                                this._rect = null;
                            }
                        }
                    });
                    this.mouseDownAndMove.on("up", () => {
                        if (form.module_type === 1) { that.hot_type = "图片热区" }
                        else if (form.module_type === 18) { that.hot_type = "轮播热区" }
                        if (!this._rect) {
                            return;
                        }
                        if (!this._target.hasOwnProperty("_roundCode")) {
                            //选区事件处发
                            that.redactVSadd = 0;
                            if (that.hot_type === "轮播热区") {
                                that.carouselHot = form;
                                that.carousellist = carouse;
                            } else {
                                that.form = form;
                            }
                            that.isShowForm = 5;
                            //清空当前热区数据
                            that.form_data = { ...formData };
                            createRounds(this._rect);
                        } else {
                            this._rect.style.cursor = "move";
                        }
                    });
                    this.mouseDownAndMove.on("move", e => {
                        if (!this._rect) this._rect = createRect(this._container);
                        const w = e.x - this._start.x;
                        const h = e.y - this._start.y;
                        this._setPosition("left", w);
                        this._setPosition("top", h);
                        const roundCode = this._target._roundCode;
                        if ([1, 6].indexOf(roundCode) === -1)
                            this._rect.style.width = Math.abs(w) + "px";
                        if ([3, 4].indexOf(roundCode) === -1)
                            this._rect.style.height = Math.abs(h) + "px";
                    });
                }
                _stop() {
                    const container = this._container;
                    this._removeDiv();
                    this.mouseDownAndMove._stop();
                }
                _removeDiv() {
                    if (this._rect) {
                        this._container.removeChild(this._rect);
                        this._rect = null;
                    }
                }
                _setPosition(type, size) {
                    const attr = {
                        left: ["right", "width", "offsetX"],
                        top: ["bottom", "height", "offsetY"]
                    }[type];
                    const rect = this._rect;
                    if (size < 0 && rect.style[attr[0]] === "auto") {
                        rect.style[attr[0]] =
                            this._containerRect[attr[1]] - this._start[attr[2]] + "px";
                        rect.style[type] = "auto";
                    } else if (size > 0 && rect.style[type] === "auto") {
                        rect.style[attr[0]] = "auto";
                        rect.style[type] = this._start[attr[2]] + "px";
                    }
                }
                _getRect() {
                    const rect = this._rect.getBoundingClientRect();
                    return {
                        left: this._rect.offsetLeft,
                        right: this._rect.offsetLeft + rect.width,
                        top: this._rect.offsetTop,
                        bottom: this._rect.offsetTop + rect.height,
                        width: rect.width,
                        height: rect.height
                    };
                }
                set(spots) {
                    const container = this._container;
                    if (this._rect) container.removeChild(this._rect);
                    if (!spots) return (this._rect = null);
                    this._rect = createRect(container);
                    const { width, height } = this._containerRect;
                    const {
                        selectBoxLeft,
                        selectBoxTop,
                        selectBoxWidth,
                        selectBoxHeight,
                        containerWidth,
                        containerHeight
                    } = spots;
                    const xRate = width / containerWidth;
                    const yRate = height / containerHeight;
                    this._rect.style.left = selectBoxLeft * xRate + "px";
                    this._rect.style.top = selectBoxTop * yRate + "px";
                    this._rect.style.width = selectBoxWidth * xRate + "px";
                    this._rect.style.height = selectBoxHeight * yRate + "px";
                    createRounds(this._rect);
                }
                get() {
                    //处发get 将选区坐标赋值
                    if (!this._rect) return;
                    const {
                        width: containerWidth,
                        height: containerHeight
                    } = this._containerRect;
                    let { left, top, width, height } = this._getRect();
                    return {
                        containerWidth,
                        containerHeight,
                        selectBoxLeft: left,
                        selectBoxTop: top,
                        selectBoxWidth: width,
                        selectBoxHeight: height //将selectBoxheight
                    };
                }
            }
            // 鼠标事件创建div结束再显示选取容器
            // form为当前表单 form.hotspots就是在当前表单建立热区
            that.$nextTick(() => {//视图更新后加载  判断：轮播热区和热区模块的结构不同
                if (that.$refs[carouse.fe_module_id]) {
                    carouse.hotspots = new Hotspots(
                        that.$refs[carouse.fe_module_id][0]
                    );
                    return;
                } else if (that.$refs[form.fe_module_id]) {
                    form.hotspots = new Hotspots(
                        that.$refs[form.fe_module_id][0]
                    );
                    return;
                }
            })
        },
    },
    mounted() {
        //为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
        document.body.ondrop = function (event) {
            event.preventDefault();
            event.stopPropagation();
        };
        // 注：window.onresize(onresize如果有多个那么只会执行一个)
        window.onresize = () => {
            return (() => {
                // 通过捕获系统的onresize事件触发我们需要执行的事件
                this.myHeight = (window.innerHeight - 220) + 'px';
                // this.myWidth = (window.innerWidth - 1100)/14 + 'rem';
                this.myWidth = window.innerWidth - 1020 < 480 ? 480 + 'px' : 600 > window.innerWidth - 1020 > 480 ? 560 + 'px' : 665 + 'px';//自适应宽度
            })();
        }
    },
};
</script>

<style scoped>
ul li {
    list-style: none;
    padding: 0px;
    margin: 0px;
}
.inputwidth {
    width: 200px;
}
.heder {
    width: 100%;
    display: flex;
    position: absolute;
    z-index: 999;
    background-color: rgba(0 0 0, 0.5);
}
.hederAddBut {
    left: 60%;
    position: absolute;
}
.hederSaveBut {
    left: 70%;
    position: absolute;
}
.content {
    display: flex;
    padding-top: 40px;
}
.right_form {
    left: 60%;
    position: absolute;
    /* background-color: rgba(201,231,255); */
}
.HotZone_box {
    position: absolute;
    background-color: rgba(255, 100, 97, 0.5);
    /* background:url('../../assets/img/touxiang.gif'); */
}
.HotZone_img {
    width: 562.5px;
    vertical-align: top;
}
#carouselMap {
    width: 546.5px;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    padding-right: 14px;
}
.carouselMap_box {
    display: inline-block;
    width: 110.5px;
}
.crechuild {
    margin: 18px 5px 0 5px;
    display: inline-block;
    width: 110.5px;
}
.moban_item {
    display: flex;
    align-items: center;
}
/* 导航 */
.navigation {
    width: 562.5px;
    white-space: nowrap;
    overflow-x: auto;
}
.border_dashed {
    border: 1px dashed #000;
    margin: 1px;
}
.navigation_box {
    display: inline-block;
    width: 110.5px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: solid 2px #c8c5c5;
}
.navigation_int {
    display: inline-block;
    width: 110.5px;
    text-align: center;
    line-height: 25px;
    border: solid 2px #c8c5c5;
}
.barrage_box {
    height: 30px;
    line-height: 30px;
    /* overflow-y: auto; */
}
.workButton div {
    margin: 5px 0 5px 0;
}
.headeList ul {
    display: flex;
}
.foldMod {
    height: 30px;
    width: 100px;
    text-align: content;
    line-height: 30px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.foldMod:hover {
    width: auto;
    /* text-overflow:inherit; 
  overflow: visible; 
  white-space: pre-line;     
  合并空白符序列，但是保留换行符。 */
}
.couponCla {
    width: 562.5px;
    /* height: 150px; */
    text-align: content;
    line-height: 150px;
}
.couponCla_yijian {
    width: 562.5px;
    text-align: content;
}
.couponClaSingle {
    margin: 0 auto;
    width: 430px;
    height: 86px;
    background: url("./../../assets/img/couponCla.png") 10% 10% no-repeat;
    background-size: cover;
}
.couponPrice {
    display: flex;
}
.price_rmb {
    width: 100px;
    font-weight: bold;
    font-size: 20px;
    margin: 0 0 0 24px;
    line-height: 90px;
}
.price_spa {
    line-height: 30px;
    font-size: 18px;
    padding-top: 14px;
}
.Group {
    font-weight: bold;
}
.height500 {
    padding: 5px;
    /* width: 470px; */
    /* height: 500px; */
    overflow-y: auto;
    border: 5px solid #e3e197;
    box-shadow: 0 0 5px #e3e197 inset;
}
.disBorder {
    width: 700px;
    /* height: 575px; */
    overflow-y: auto;
    overflow-x: hidden;
    box-shadow: 0 0 5px rgba(201, 231, 255) inset;
    padding: 5px;
    border: 5px solid rgba(201, 231, 255);
    /* background-color: #e3e197; */
}
.el-button--small {
    width: 128px !important;
}
.coupon_title {
    width: 130px;
    vertical-align: middle;
    overflow: hidden;
    background-size: cover;
    display: inline-block;
    cursor: pointer;
    box-shadow: 0 0 1px rgba(201, 231, 255) inset;
    border: 1px solid rgba(201, 231, 255);
}
.coupon_title :hover {
    background-color: antiquewhite;
}
.titleClassW {
    display: flex;
    width: 562.5px;
    /* height: ; */
    color: #ffffff;
}
.titleCmargin {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    margin: 0 auto;
}
.svg_icon {
    width: 30px;
    height: 60px;
    margin: 0 70px;
    line-height: 60px;
}
.svg_icon_list {
    width: 30px;
    height: 30px;
    margin: 0 80px;
}
.svg_icon_tab {
    width: 30px;
    height: 30px;
    margin: 0 80px;
}
.danmuclass {
    width: 562.5px;
    position: relative;
    overflow: hidden;
}
.mosedow_rag {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 100%;
    color: #000000;
    z-index: 9999;
}
.time_aixs {
    position: relative;
    text-align: center;
    width: 25%;
    height: 64px;
}
.time_aixs .line {
    width: 97.4%;
    height: 0.05rem;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 1.3%;
    -webkit-transform: translateX(-0.025rem);
    transform: translateX(-0.025rem);
}
.time_aixs .time_aixs_box {
    width: 97%;
    position: absolute;
    top: 0;
    left: 1.5%;
}
.time_aixs .time_aixs_box div {
    font-size: 16px;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    position: relative;
    height: 64px;
    line-height: 26px;
}
.time_aixs .time_aixs_box div .dot {
    background: #fff;
    width: 0.225rem;
    height: 0.225rem;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-0.1125rem, -0.1125rem);
    transform: translate(-0.1125rem, -0.1125rem);
    border-radius: 50%;
}
.time_aixs .time_aixs_box .time_aix_red .text_bottom {
    border-radius: 0.325rem;
    padding: 0 8%;
}
.time_aixs .time_aixs_box div .text_bottom {
    display: inline-block;
    margin-top: 9px;
}
/* 预览 */
.yulan_box {
    position: fixed;
    z-index: 9990;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.yulan_box_bg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
}
.yulan {
    position: relative;
    z-index: 9992;
    padding-bottom: 44px;
    background: #fff;
    padding-top: 40px;
    width: 412px;
    height: 715px;
    background-size: 100% 100%;
    background-image: url("http://mint-ui.github.io/docs/static/img/phone.5909f66.png");
}
.erweima_chont {
    position: relative;
    margin: 20px 0 0 10px;
    width: 392px;
    height: 640px;
    background-color: #fff;
}
.erweima_chont_box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.image_placeholder {
    text-align: center;
}
.block {
    display: inline-block;
    margin: 0 20px 0 20px;
}
.w100h100 {
    width: 200px;
}
#carouselMapX {
    width: 560.5px;
    height: 135px;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    position: relative;
}
#carouselV4 {
    width: 560.5px;
    height: 65px;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    position: relative;
}
.recChuildclass {
    display: inline-block;
}
.recchuildTemplate {
    position: absolute;
}
.tab_title {
    width: 112px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.width_auto {
    width: 70%;
    height: auto;
    margin-top: 10px;
}
.ml0 {
    margin-left: 0;
}
</style>
