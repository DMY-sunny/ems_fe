
export default {
    data() {
        return {
            timestamp:[],
            auditConfigs: {},
            searchForm: {
                "business_type": "", // 业务类型,详见审批配置
                "status": "", // 审核状态,详见审批配置
                "from_user": "", // 发起人,详见审批配置
                "from_time": "", // 发起开始时间
                "to_time": "", // 发起结束时间
                "page": 1, // 当前页码
                "page_size": 30 // 每页显示数量
            },
            auditForm: {},
            but_type: "",
            reason: "",
            productList: [],
            goodEditList: [],
            total: 0,
            dialogTableVisible:false,
            dialogVisibleNo:false,
            dialogVisible:false,
        }
    }
}