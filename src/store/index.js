import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
const store = new Vuex.Store({
    ...app,
    strict: process.env.NODE_ENV !== 'production',
    plugins: [
        createPersistedState({
            key: 'manage-sysem',
            storage: window.sessionStorage,   // 默认是 plugins: [createPersistedState()]，对应的是window.localstorage
            reducer(val) {
                return {
                    // 此处存储需要持久化的state属性
                    activityId:val.activityId,
                    userName:val.userName,
                    userId:val.userId,
                    fullcutId:val.fullcutId,
                    leaderId:val.leaderId,
                    addvsup:val.addvsup,
                    keyWord:val.keyWord,
                    orderBy:val.orderBy,
                    onefaddishId:val.onefaddishId,
                    addOnefaddish:val.addOnefaddish
                }
            }
        })
    ]
})
export default store
