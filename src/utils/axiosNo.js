import axios from 'axios'
import {Message ,Loading } from 'element-ui'
//create axios instance
let loading        //定义全局loading变量
function startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        text: '正在拼命加载中……',
        background: 'rgba(0, 0, 0, 0.7)',
        duration:1*1000
    })
}
function endLoading() {    //使用Element loading-close 方法
    loading.close()
}
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}
export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}
import Cookies from 'js-cookie';
const service = axios.create({
    timeout:100000
})
//添加请求拦截器
service.interceptors.request.use(config =>{
    let role = Cookies.get('supply_chain_backend_session')
    if(role != undefined){
        config.headers.Authorization = role
    }
    //配置方式调用axios
    config = {
          ...config,
          // baseURL: 'http://scb.dfs800.com',
          timeout: 100000,
          withCredentials: true,
          crossDomain: true,
       // 主要是对于上传或者导入，不需要进行转换使用 需注释掉
       /* transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],*/
      }
    showFullScreenLoading()
    return config
},err =>{
    Promise.reject(err)
})
//添加响应拦截
service.interceptors.response.use(response => {
    const res = response.data
    tryHideFullScreenLoading()
    return res
}, err => {
    let xtr = err.response.status
    if(xtr==401){
        Message({
            type:'error',
            message:'登录失效，请重新登录',
            duration:2*1000
        })
        localStorage.clear()
        Cookies.remove('supply_chain_backend_session')
        setTimeout(function(){
            window.location.href='/#login'
            location.reload()
        },600)
    }else if(xtr==400){
        Message({
            type:'error',
            message:'服务器请求错误',
            duration:2*1000
        })
        tryHideFullScreenLoading()
    }else if(xtr==403){
        Message({
            type:'error',
            message:'您无权限访问该页面',
            duration:2*1000
        })
        tryHideFullScreenLoading()
        // setTimeout(function(){
        //     window.location.href='/#403'
        //     location.reload()
        // },600)
    }else if(xtr==500){
        Message({
            type:'error',
            message:'系统出错，稍后再试',
            duration:2*1000
        })
        tryHideFullScreenLoading()
    }
})
export default service
