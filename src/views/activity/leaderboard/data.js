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
            loading: false,
            tableData: [],
            cur_page: 1,
            page_size: 50,
            total: 0,
            type:'online',
            form: {
                id: 0,
                category:'',
                nav_tags:[],
            },
            categories:[],//商品类目
            category4:'',
            categories_checbox:[],
            tags:'',//标签
            search_navtag:'',//搜索标签
            nav_tags:[],
            addvsupdata:false,
            ranking_id:0,
            // 商品保存信息
            commodity_form:{
                id:'',
                desc:'',//商品推荐文案
                sku_name:'',
                goods_name:'',
                nav_tag:'',
                sku_id:'',
                goods_id:'',
            }
        }
    },
}