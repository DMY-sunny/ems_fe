import * as types from '../mutation-types'

const app = {
    state: {
        userName: '',//用户名
        userId:'',//当前用户登陆ID
        activityId:'',//活动列表 查看详情id
        fullcutId:'',//满减活动列表 id
        leaderId:'',//排行榜ID
        addvsup:true,//新增or修改
        keyWord:'',//活动列表搜索关键词
        orderBy:'',//测试对象
        onefaddishId:'',//一元爆款ID
        addOnefaddish:true,//一元爆款新增or修改
    },
    mutations: {
        [types.SET_ACTIVITY_ID](state, activityId) {
            state.activityId = activityId
        },
        [types.SET_ORDERBY](state, orderBy) {
            state.orderBy = orderBy
        },
        [types.SET_KEYWORD](state, keyWord) {
            state.keyWord = keyWord
        },
        [types.SET_USER_NAME](state, userName) {
            state.userName = userName
        },
        [types.SET_USER_ID](state, userId) {
            state.userId = userId
        },
        [types.SET_FULLCUT_ID](state, fullcutId) {
            state.fullcutId = fullcutId
        },
        [types.SET_LEADER_ID](state, leaderId) {
            state.leaderId = leaderId
        },
        [types.SET_ADDVSUP](state, addvsup) {
            state.addvsup = addvsup
        },
        [types.SET_ONEFADDISH_ID](state, onefaddishId){
            state.onefaddishId = onefaddishId
        },
        [types.SET_ADD_ONEFADDISH](state, addOnefaddish){
            state.addOnefaddish = addOnefaddish
        }
   
    },
    actions: {
        setActivityId({commit}, activityId) {
            commit(types.SET_ACTIVITY_ID, activityId)
        },
        setOrderBy({commit}, orderBy) {
            commit(types.SET_ORDERBY, orderBy)
        },
        setKeyWord({commit}, keyWord) {
            commit(types.SET_KEYWORD, keyWord)
        },
        setUserName({commit}, userName) {
            commit(types.SET_USER_NAME, userName)
        },
        setUserId({commit}, userId) {
            commit(types.SET_USER_ID, userId)
        },
        setFullcutId({commit},fullcutId){
            commit(types.SET_FULLCUT_ID,fullcutId)
        },
        setLeaderId({commit},leaderId){
            commit(types.SET_LEADER_ID,leaderId)
        },
        setAddvsup({commit}, addvsup) {
            commit(types.SET_ADDVSUP, addvsup)
        },
        setLeaderId({commit},onefaddishId){
            commit(types.SET_ONEFADDISH_ID,onefaddishId)
        },
        setAddvsup({commit}, addOnefaddish) {
            commit(types.SET_ADD_ONEFADDISH, addOnefaddish)
        },
    },
    getters: {
        activityId: state => {
            return state.activityId
        },
        orderBy: state => {
            return state.orderBy
        },
        keyWord: state => {
            return state.keyWord
        },
        userName: state => {
            return state.userName
        },
        userId: state => {
            return state.userId
        },
        fullcutId:state=>{
            return state.fullcutId
        },
        leaderId:state=>{
            return state.leaderId
        },
        addvsup:state=>{
            return state.addvsup
        },
        onefaddishId:state=>{
            return state.onefaddishId
        },
        addOnefaddish:state=>{
            return state.addOnefaddish
        },
    }
}
export default app
