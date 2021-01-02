// isShowForm: 0, //新增模块按钮 ✔️0基础表单设置 1新增模块 2导航模板 3图片热区模板 4商品模板 5子热区模块 6轮播模块 7轮播子图片上传修改处理模块 8倒计时模块 9倒计时list 10弹幕 11弹幕list 12侧边栏导航 13侧边栏导航list 14tab商品 15tab商品list 16横向滑动商品模块 17优惠券模块 18优惠券list 19百万爆品 20百万爆品list 21一键领取优惠券 22标题分类模块 23爆品v2 24文字噱头模块 25文字噱头模块list 26时间轴模块 27时间轴模块list 28爆品v3 29爆品v3listchuild 30爆品v4 31爆品v4list 32限时抢 33限时抢list 34轮播热区 35优惠券滑动模块 36翻转商品模块 37呼吸入口模块 38翻转商品模块修改
//按钮
const buttonData = [
    { i: 0, name: '页面基础配置' },
    { i: 2, name: '导航模块' },
    { i: 3, name: '图片模块' },
    { i: 4, name: '商品模块' },
    { i: 6, name: '轮播模块' },
    { i: 8, name: '倒计时模块' },
    { i: 10, name: '弹幕轮播模块' },
    // { i: 12, name: '侧边栏模块' },
    { i: 14, name: 'tab商品模块' },
    { i: 16, name: '横向滑动模块' },
    // {i:17,name:'优惠券模块'},
    // { i: 19, name: '爆款推荐模块' },
    { i: 23, name: '爆款推荐v2模块' },
    { i: 21, name: '一键领取优惠券' },
    { i: 22, name: '标题分类模块' },
    { i: 24, name: '文字噱头模块' },
    { i: 26, name: '时间轴模块' },
    { i: 28, name: '爆款推荐v3模块' },
    { i: 30, name: '爆款推荐v4模块' },
    { i: 32, name: '限时抢模块' },
    { i: 34, name: '轮播热区模块' },
    { i: 35, name: '优惠券滑动模块' },
    // { i: 36, name: '翻转商品模块' },//老版本翻转商品模块
    { i: 38, name: '翻转商品模块' },
    { i: 37, name: '呼吸入口模块' },
];
// 角色
const cityOptions = [
    { name: "会员", value: "show_with_vip" },
    { name: "非会员", value: "show_with_not_vip" },
    { name: "老用户展示", value: "show_with_old_user" },
    { name: "新用户展示", value: "show_with_new_user" },
];
//热区数据
const formData = {
    select_box_height: "60", //[热区模块专属]热区选择区域高度
    select_box_width: "90", //[热区模块专属]热区选择区域宽度
    select_box_left: "400", //[热区模块专属]热区选择区域距离所在图片左间距
    select_box_top: "300", //热区模块专属]热区选择区域距离所在图片上间距
    event_type: "link", //[热区模块专属]热区事件类型: 链接 link; 方法 function
    link_type: "1", //热区模块专属]链接类型: 1 商品; 2 3 4 ... 待补充
    goods_type: "act_goods", //[热区模块专属]商品类型: 活动商品 act_goods; 普通商品 goods
    act_type: "seckill", //活动类型: 限时秒杀 miaosha; 满减活动 manjian; 活动馆 huodongguan;
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
    embellish_img2: "",//修饰图片12.18
    embellish_img: "",//修饰图片12.18
    price_color: "",//价格颜色12.18
    title_color: "",//标题颜色12.18
    countdown_time: "",//时间差只是后台用
    begin_ts: "",//开始时间
    end_ts: "",//结束时间
    background_color: "", // 商品默认背景颜色
    template: "rows_1",
    subscript_pic: "",
    price_text: "活动价",
    act_type: "seckill",
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
    embellish_img2: "",//修饰图片12.18
    embellish_img: "",//修饰图片12.18
    price_color: "",//价格颜色12.18
    title_color: "",//标题颜色12.18
    title: "",
    title2: "",
    icon: "",
    title_img: "",//v2020-6-3 翻转商品模块专用
    background_color: "", // 商品默认背景颜色
    template: "rows_1",
    subscript_pic: '',
    price_text: "活动价",
    act_type: "seckill",
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
    act_type: '',
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
    act_type: "seckill",
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
    act_type: "seckill",
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
// 轮播热区
const carousel_hot = {
    module_type: "18", //2020-3-23
    module_title: "轮播热区模块",
    fe_module_id: "fe_module_id1566460395592", // 配合前端的冗余字段
    show_mode: [],
    show_begin_ts: "", // 开始显示时间 每个模块都增加 3.1期增加
    show_end_ts: "", // 结束显示时间 每个模块都增加 3.1期增加
    picture_list: []
};
//轮播热区list
const carousel_list = {
    background: "",
    areas: [],
};
const iconFont = [
    { id: 1, name: 'iconchaobao' },
    { id: 2, name: 'iconmingbao' },
    { id: 3, name: 'iconpeishi' },
    { id: 4, name: 'iconshoubiao' },
    { id: 5, name: 'iconxinglixiang' },
    { id: 6, name: 'iconhaixian' },
    { id: 7, name: 'iconroupinjiagong' },
    { id: 8, name: 'iconshuiguo' },
    { id: 9, name: 'iconroudan' },
    { id: 10, name: 'iconshucai' },
    { id: 11, name: 'iconlengdongshipin' },
    { id: 12, name: 'iconanmoyi' },
    { id: 13, name: 'iconshenghuodianqi' },
    { id: 14, name: 'iconchufangdianqi' },
    { id: 15, name: 'icongehudianqi' },
    { id: 16, name: 'iconshouji' },
    { id: 17, name: 'iconzhineng-saodiji' },
    { id: 18, name: 'icondajiadian' },
    { id: 19, name: 'iconchongtiaoyinpin' },
    { id: 20, name: 'iconjiulei' },
    { id: 21, name: 'iconjinkoushipin' },
    { id: 22, name: 'iconmingcha' },
    { id: 23, name: 'icondaicanbinggan' },
    { id: 24, name: 'iconyinliao' },
    { id: 25, name: 'iconqiaokelisvg' },
    { id: 26, name: 'iconxiuxianshipin' },
    { id: 27, name: 'iconzhiniaoku' },
    { id: 28, name: 'iconyingtonggehu' },
    { id: 29, name: 'iconhuiben' },
    { id: 30, name: 'iconwanju' },
    { id: 31, name: 'iconnaifenfushi' },
    { id: 32, name: 'icontongzhuang' },
    { id: 33, name: 'iconyingtongyongpin' },
    { id: 34, name: 'iconhufu' },
    { id: 35, name: 'iconcaizhuang' },
    { id: 36, name: 'icongongju' },
    { id: 37, name: 'iconxiangshui' },
    { id: 38, name: 'iconmeiti' },
    { id: 39, name: 'iconxihu' },
    { id: 40, name: 'iconchuangshangyongpin' },
    { id: 41, name: 'iconriyongbaihuo' },
    { id: 42, name: 'iconchufangyongpin' },
    { id: 43, name: 'iconjiajuqingjie' },
    { id: 44, name: 'iconzhijinshijin' },
    { id: 45, name: 'iconpaobuxie' },
    { id: 46, name: 'iconneiyi' },
    { id: 47, name: 'iconlingdai-' },
    { id: 48, name: 'iconyanjing' },
    { id: 49, name: 'iconbusinesssuit' },
    { id: 50, name: 'iconcheongsam' },
    { id: 51, name: 'iconcrown' },
    { id: 53, name: 'iconcart' },
    { id: 54, name: 'iconapparel' },
    { id: 55, name: 'iconyouhuiquan2' },
    { id: 57, name: 'icondiscount' },
    { id: 58, name: 'iconpinzhigongyingshang' },
    { id: 59, name: 'iconlabel' },
    { id: 60, name: 'iconFurniture' },
    { id: 61, name: 'iconMasonry' },
    { id: 62, name: 'iconpurse' },
    { id: 63, name: 'iconup' },
    { id: 64, name: 'icongift' },
    { id: 65, name: 'icondown' },
    { id: 66, name: 'iconfruit' },
    { id: 67, name: 'iconladybags' },
    { id: 68, name: 'iconcrown2' },
    { id: 69, name: 'iconlike' },
    { id: 70, name: 'iconshopping' },
    { id: 71, name: 'iconyouhuiquan1' },
    { id: 72, name: 'iconshoppingcart' },
    { id: 73, name: 'icongexingdazhe' },
    { id: 74, name: 'iconmoney' },
    { id: 75, name: 'iconWatch' },
    { id: 76, name: 'iconzhubaopeishi' },
    { id: 77, name: 'iconertongbaojian_mian' },
    { id: 78, name: 'iconzibuyansgheng' },
    { id: 79, name: 'iconshanshibuchong' },
    { id: 80, name: 'iconshoushenmeiti' },
];
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
export default {

    data() {
        return {
            isAddVSUp: true,//是否是新增or插入 模块
            radioChangeValue: 0,
            parentMsg: "",//单张上传base64
            backHeight: "",//单张上传获取图片高度
            materialPics: [],//多张上传数据
            dialogYouhuiquna: false,
            hot_type: "图片热区",
            activityType: '',
            urls: ['https://cdn04.kepler8.com/images/htj/activity/1ColumnStyle1.png', 'https://cdn04.kepler8.com/images/htj/activity/2ColumnStyle1big.png', 'https://cdn04.kepler8.com/images/htj/activity/3ColumnStyle1big.png', 'https://cdn04.kepler8.com/images/htj/activity/3ColumnStyle1big.png', 'https://cdn04.kepler8.com/images/htj/activity/3ColumnStyle1big.png',],
            urls2: ['https://cdn04.kepler8.com/images/htj/activity/1ColumnStyle2.png', 'https://cdn04.kepler8.com/images/htj/activity/2ColumnStyle2big.png'],
            urls3: ['https://cdn04.kepler8.com/images/htj/activity/tixingdanpai.png', 'https://cdn04.kepler8.com/images/htj/activity/tixingshangpai.png', 'https://cdn04.kepler8.com/images/htj/activity/tixingsanpai.png', 'https://cdn04.kepler8.com/images/htj/activity/tixingsanpai.png', 'https://cdn04.kepler8.com/images/htj/activity/tixingsanpai.png'],
            showYlan: false,
            dialogButton: false,
            myWidth: window.innerWidth - 1020 < 480 ? 480 + 'px' : 600 > window.innerWidth - 1020 > 480 ? 520 + 'px' : 665 + 'px',//自适应宽度
            myHeight: (window.innerHeight - 220) + 'px',//自适应高度
            butList: buttonData,//按钮数据
            iconlist: { ...iconFont },//icon
            isFold: false,//模块是否折叠
            isShowBut: 0,//模块按钮点击是否显示按钮
            dialogVisible: false,//商品编辑列表弹出框
            //标签选择样式
            activeName: "navigation",//导航模块的头部样式
            isINavsBut: 1, //导航添加按钮
            redactVSadd: 2,//1是修改2是添加
            cities_hot: cityOptions,
            rules: {
                module_title: [{ required: true, message: "请输入模块名称" }],
                background: [{ required: true, message: "请选择模块背景图" }]
            },
            activity_id: "",//存在活动id则为修改
            visible: false, //轮播热区新增图片按钮判断 为了区分模块按钮的判断
            templateIndex: 0,
            i: 1,
            redactVSadd: 0,
            numRows: 0, //搜索输入值
            ShowHidden_del_but: false,
            isShowForm: 0,
            isShowFormNavs: "0",//导航
            operatorList: [],
            listType: [],
            goodsType: [],
            act_type: [],
            index: 0,
            fileList: [],
            //轮播图模块
            carousel_map: {
                show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
                carousel_type: 1,
                picture_list: [],//轮播列表
                show_mode: [], //显示模式,十进制整数存储,目前最大为15,以二进制与运算检查权限
            },
            carouse_url: {
                img_url: '',
                goods_type: "act_goods",
                act_type: "seckill",
                link_type: "1",
                act_id: "",
                goods_id: "",
                url_h5: "",
                url_xcx: ""
            },
            carouselMapRules: {
                module_title: [
                    { required: true, message: "请输入模块名称", trigger: "blur" }
                ],
            },
            carouselMap2Rules: {
                img_url: [
                    { required: true, message: "请添加图片", trigger: "blur" }
                ],
            },
            //热区模块数据
            form: {
                show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
                show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
                module_type: 1, //模块类型: 1 热区; 2 商品;3 轮播;
                module_title: "", //模块名称
                background: "", //event_type
                back_height: 0,
                show_mode: [], //显示模式,十进制整数存储,目前最大为15,以二进制与运算检查权限
                areas: [],
                fe_module_id: "fe_module_id" + Date.now()
            },
            //热区数据
            form_data: { ...formData },
            // 商品数据
            commodityInfo: {
                somez:1,
                split_some:1,
                show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
                is_hot: false, // 是否为爆款商品: 是 true; 否 false; 3.1期增加
                show_logo: false, // 是否显示logo 11月需求增加
                show_mode: [],
                goods: []
            },
            commodityRules: {
                price_text: [
                    { required: true, message: "请输入价格文字", trigger: "blur" },
                    { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
                ],
                module_title: [
                    { required: true, message: "请输入模块名称", trigger: "blur" }
                ],
                template: [
                    { required: true, message: "请选择展示列数", trigger: "change" }
                ]
            },
            //倒计时 模块
            countdown_commod: 0,//0是商品模块1是倒计时模块2tab商品模块
            isShowCountdown_commod: 0,//倒计时模块展示
            isShowTAB_commod: 0,//tab商品模块展示
            countdownModule: {
                fe_module_id: "fe_module_id" + Date.now(),
                time_list: [],
                show_mode: []
            },
            countdownRules: {
                module_title: [
                    { required: true, message: "请输入模块名称", trigger: "blur" }
                ],
            },
            countdownChild: { ...countdown_Child },
            countdown_rules: {
                begin_ts: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                ],
                end_ts: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                ],
            },
            //导航模块
            tab_active: 1,
            form_navsChild: {
                title: "", //导航名称
                title2: "",//导航名称二
                jmp: "", //导航跳转标识
                icon: "",//icon
            },
            temp_extends: {
                navs: [],
                show_mode: []
            },
            //弹幕轮播模块
            showdanmu: false,//弹幕轮播 --- 拖拽样式切换
            barrageModule: {
                show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
                list: [],
                show_mode: [],
            },
            barrageRules: {
                module_title: [
                    { required: true, message: "请输入模块名称", trigger: "blur" }
                ],
                background: [
                    { required: true, message: "请添加图片", trigger: "blur" }
                ],
            },
            barrageList: { ...barrage_List },
            barrageListRules: {
                type_value: [
                    { required: true, message: "请填写内容", trigger: "blur" }
                ],
                url_h5: [
                    { required: true, message: "请输入h5链接", trigger: "blur" }
                ],
                url_xcx: [
                    { required: true, message: "请输入小程序链接", trigger: "blur" }
                ],
            },
            // 侧边栏导航
            sideNavs: {
                text: "", // 导航名称
                url_h5: "", // h5链接
                url_xcx: "", // 小程序链接
            },
            //tab商品模块
            TABcommodModule: {
                list: [],
                show_mode: []
            },
            TABcommodRules: {
                module_title: [
                    { required: true, message: "请输入模块名称", trigger: "blur" }
                ],
            },
            TABcommodChild: { ...TABcommod_Child },
            TABcommodChildRules: {
                title: [
                    { required: true, message: '请输入导航名称', trigger: 'blur' },
                ],
                title2: [
                    { required: true, message: '请输入导航名称', trigger: 'blur' },
                ]
            },
            //优惠券模块
            couponModule: {
                list: [],
                show_mode: [],
            },
            //优惠券list
            couponList: { ...coupon_list },
            //爆品推荐
            isShowRecChuild: 0,
            recommend: {
                background: '',
                def_img: '',
                sel_img: '',
                show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
                picture_list: [],//轮播列表
                show_mode: [],
            },
            recommend_url: { ...recommendUrl },
            recommendL_rules: {
                begin_ts: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                ],
                end_ts: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                ],
            },
            recommend_ChildUrl: { ...recommendChildUrl },
            //标题分类模块
            titleClass: {
                show_mode: [],
            },
            //文字噱头模块
            texthotIndex: 0,
            texthotModule: {
                show_mode: [],
            },
            //文字噱头模块
            texthotList: { ...texthot_List },
            //文字噱头验证
            texthotRules: {
                module_title: [{ required: true, message: "请添加模块名称" , trigger: 'blur' }],
                background: [{ required: true, message: "请选添加背景图" , trigger: 'blur' }]
            },
            //时间轴模块
            timeline_isK: 0,
            timelineModule: {
                list: [],//轮播列表
                show_mode: [], //显示模式,十进制整数存储,目前最大为15,以二进制与运算检查权限ß
            },
            timelineList: { ...timeline_list },
            timelineRules: {
                title: [{ required: true, message: '请填写内容', trigger: 'blur' }],
                date: [{ required: true, message: '请填写日期', trigger: 'blur' }],
                link_type: [{ required: true, message: '请选择一种类型', trigger: 'change' }],
            },
            // 轮播热区模块
            carouselHot: { ...carousel_hot },
            carousellist: { ...carousel_list },
            // 限时抢 模块 limitedtime_rules
            limitedtimeModule: {
                show_mode: [],
                picture_list: [],
            },
            limitedtimeList: { ...limitedtime_List },
            limitedtime_rules: {
                total: [{ required: true, message: '请填写发放总条数', trigger: 'blur' }],
                coupon_code: [{ required: true, message: '请填写券码', trigger: 'blur' }],
                begin_ts: [{ required: true, message: '请填写日期', trigger: 'blur' }],
                end_ts: [{ required: true, message: '请填写日期', trigger: 'blur' }],
                before_img: [
                    { required: true, message: "请添加图片", trigger: "blur" }
                ],
                after_img: [
                    { required: true, message: "请添加图片", trigger: "blur" }
                ],
            },
            couponSlideModule: {
                show_mode: [],
                list: [],//轮播列表
            },
            couponSlideList: {
                coupon_code: '',
                goods_id: '',
                is_sale_share: 0,
            },
            // 提交数据
            template: {
                activity_id: "", //活动ID,如果没有该参数则为创建,如果存在则为更新操作
                title: "", //活动名称--页面标题
                background_color: "#FFFFFF", //背景颜色
                background: "", //背景图片
                show_top_btn: true,
                show_bottom_ad: true,
                remark: "", //备注
                share_pic: "", //分享缩略图
                share_desc: "", //分享文案
                begin_ts: "",//活动开始时间
                finish_ts: "",
                is_countdown: 0,//是否开启倒计时
                show_more_font_color: '',//查看更多颜色
                show_more_bg_color: '',//查看更多背景颜色
                is_redenvelope: 0,
                m: [],

                side_navs_show: true,//侧边栏是否展示
                side_navs_bg_color: "#FE0F40", // 侧边导航主题颜色
                side_navs_gradient_color: "#FF8EA5", // 侧边导航渐变颜色
                side_gradient_color: "#FF3681",//侧边文字渐变颜色
                side_navs_color: "#FFFFFF", // 侧边导航字体颜色
                side_navs_text: "会场导航", // 侧边导航大按钮文案
                side_navs: [],

                extend_goods: {
                    is_warn: 0,
                    m_type: 1,//1，2，两种模板类型
                    embellish_img2: "",//修饰图片
                    embellish_img: "",//修饰图片
                    price_color: "",//价格颜色
                    title_color: "",//标题颜色
                    template: "rows_1", // 模版: 一列 rows_1; 二列 rows_2; 三列 rows_3; 2排新增rows_4;1排新增rows_5; v2020-1-15
                    price_text: "活动价", // 价格文字
                    subscript_pic: "", // 商品角标图片地址 3.1期增加
                    position: "0", // 位置: 0,1,2,3; 11月需求增加
                    price_bg_color: "", // 价格背景颜色
                },
            }
        };
    },
}
