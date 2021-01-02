
export default {
    data() {
        const validatelogoUrl = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请上传商品logo图片'))
            }
            callback()
        }
        const validateName = (rule, value, callback) => {
            var pattern = new RegExp("[`~!@$^&*=|{}':;',\\[\\].<>?~！@￥……&*——|{}【】‘；：”“'。，、？%]");
            if (!value) {
                callback(new Error('请输入活动名称'))
            } else if (value.match(pattern)) {
                callback(new Error('活动名称含有非法字符'))
            } else if (value.length > 100) {
                callback(new Error('活动名称不能超过100个字'))
            } else {
                callback()
            }
        }
        return {
            options: [],//远程搜索下拉框内容
            reportForm: {
                act_id: '',
                act_type: '',
                page: 1,
                page_size: 30,
            },
            configs: {},
            total: 0,
            tableData: [],
            categories: [],
            errmsg: "",
            dialogUpdata: false,
            index: 0,
            dynamicTags: [],
            goodEditForm: {},//已选商品列表编辑时的数据(提交)
            goodEditList: [],//已选商品列表编辑时的数据（展示）
            activeName: 'second',
            totalTibao: null,//分页
            totalYixuan: null,//分页
            dialogTableVisible: false,//dialog表格
            // tree
            nodeKey: 'id',
            menuId: [],
            menuTreeData: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            is_pop: false,
            checked: false,
            checkAll: false,
            checkdeliveryAll: false,
            dialogTable: [],
            dialogTableVisible: false,
            textarea: '',//删除理由
            deleteData: {},
            isBatch: false,
            file: '',//上传文件
            clearShow: true,//上传组件显示隐藏
            loading_activity: false,
            dialogVisible: false,
            loading: false,
            SelectAll: false,
            addvsupdata: true,//添加/修改
            goods_ids: [],
            symbols: [],
            stock_symbols: [],
            delivery_place: [],
            categoriesData: [],
            categoriesChecbox: [],
            goods_count: 0,
            form: {
                allow_recalculate: true,
                background_color: "",
                from_discount: 0,
                to_discount: 0,
                open_notice: false,
                auto_calculate: false,
                cal_coefficient: '',
                price_strategy: 1,
                // 商品添加字段
                act_id: '',
                sort_order: 0,
                goods_name: '',
                type: 1,
                buy_limit: '',//限购
                sort: '',//排序
                price: '',//普通价格
                origin_price: '',//会员价格
                sku_id: '',//sku_id
                sku_name: '',//sku_name
                is_top: '',
                //活动添加字段
                title: '',//活动名称
                alias: '',
                show_at_mall: false,
                full: 0,//充分
                fulln: 0,//饱满
                cut: 0,//减
                avg_price: 0,//平均价格
                share_pic: '',//分享图
                logo_url: '',//头图链接
                start_time: '',
                end_time: '',
                status: 0,//状态
                goods_id_list: [],
                earnest_money: '', //定金
                coefficient: '', //系数
                open_selloutnotice: 1,
                earnest_money_params: {
                    start_time: '',// 收尾款开始时间
                    end_time: '',// 收尾款结束时间
                    discount_proportion: '',
                },
                advance_end: {
                    beginTime: '',
                    endTime: '',
                },
                discount_data: {
                    discount: [],//折扣专区
                    buydiscount: [],//买n减n
                },
                discount_status: 1,//折扣状态
                second_cut: [{//第二件立减
                    full: '',
                    cut: '',
                }],
                second_sale: [{//第二件xx元
                    full: '2',
                    sale: '',
                }],
                // 只展示不传
                reference_price: '',//会员参考价
                buylimit: {
                    astrict_rule_option: 0,
                    astrict_rule_amount: 1,
                    is_coupon: 1
                },
                allreturn: {
                    full: 100,
                    astrict_rule_option: 0,
                    astrict_rule_amount: 1,
                    max_full: 0,
                    goodsset: 0
                }
            },
            purchase_Form: {},//清空表单使用
            purchaseForm: {
                is_wms: true,
                pop_merchants: [],
                from_discount: 0,
                to_discount: 0,
                isIndeterminate: false,//全选
                isdeliveryAll: false,//全选 发货仓
                act_id: "",
                act_name: "", // 活动名称
                act_type: 1, // 活动类型
                goods_num: '', // 商品数量
                stock_symbol: "",
                stock_num: '',
                cost_symbol_from: "",
                cost_from: "",
                cost_symbol_to: "",
                cost_to: "",
                sales_symbol_from: "",
                sales_from: '',
                sales_symbol_to: "",
                sales_to: '',
                category4: [], // 商品主分类
                category5: [],
                category: {
                    category1: [], // 商品主分类
                    category2: [], // 商品主分类
                    category3: [], // 商品主分类
                },
                delivery_place: [],
                dead_line: '',// 截止时间
                is_pop: false,// 是否需要POP商品
                remark: '',//备注
            },
            searchForm: {
                act_id: '',
                source: '',//商品来源
                keyword: '',
                goods_status: '',//商品状态
                sold_status: '',//售卖状态
                sorted_by: '',//排序
            },
            start_time: '',// 收尾款开始时间
            end_time: '',// 收尾款结束时间
            restaurants: [],//输入建议列表
            tibaoList: [],
            skusearchList: [],
            productList: [],
            discount_num: '',
            discount_diss: '',
            goods_id: '',
            source_list: [],
            goods_status_list: [],
            sold_status_list: [],
            sorted_by_list: [],
            select_status_list: [],
            astrict_option_list: [{
                value: 0,
                label: '不限'
            }, {
                value: 1,
                label: '每人每天限购'
            }, {
                value: 2,
                label: '活动期间每人限购'
            }]
        }
    },
}