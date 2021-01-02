import axios from 'axios'
import Qs from 'qs'
import { Message, Loading } from 'element-ui'
import Router from '@/router/index'
const ui = require('element-ui')

// create axios instance
let loading        //定义全局loading变量
function startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({
        lock: false,
        text: '正在拼命加载中……',
        background: 'rgba(0, 0, 0, 0.7)',
        duration: 1 * 1000
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
    timeout: 100000
})

//添加请求拦截器
service.interceptors.request.use(config => {
    // showFullScreenLoading()
    return config
}, err => {
    Promise.reject(err)
})
//添加响应拦截
service.interceptors.response.use(response => {
    const res = response.data
    if (res.errno == 2021) { //如果接口2021跳转登录
        setTimeout(() => {
            window.location.href = '/#login'
            location.reload()
        }, 600)
        return;
    }else if(res.errno == 403){
        // ui.Message({
        //     message: '您可以找您的上级'+res.data[0].user_name + '开通此权限',
        //     type: 'warning'
        // })
        Router.push({path: '/403'})
    }
    tryHideFullScreenLoading()
    return res
}, err => {
    let xtr = err.response.status
    switch (xtr) {
        case 401:
            Message({
                type: 'error',
                message: '登录失效，请重新登录',
                duration: 2 * 1000
            })
            localStorage.clear()
            Cookies.remove('global_supply_chain_backend_session')
            setTimeout(function () {
                window.location.href = '/#login'
                location.reload()
            }, 600)
            break
        case 400:
            Message({
                type: 'error',
                message: '服务器请求错误',
                duration: 2 * 1000
            })
            tryHideFullScreenLoading()
            break
        case 403:
            Message({
                type: 'error',
                message: '您暂无权限操作该功能',
                duration: 2 * 1000
            })
            tryHideFullScreenLoading()
            break
            /*setTimeout(function () {
                window.location.href = '/#403'
                location.reload()
            }, 200)*/
            break
        case 404:
            Message({
                type: 'error',
                message: '对不起，您请求资源不存在',
                duration: 2 * 1000
            })
            tryHideFullScreenLoading()
            break
        case 500:
            Message({
                type: 'error',
                message: '系统出错，稍后再试',
                duration: 2 * 1000
            })
            tryHideFullScreenLoading()
            break
        case 504:
            Message({
                type: 'error',
                message: '访问网络不好,请稍后',
                duration: 2 * 1000
            })
            tryHideFullScreenLoading()
            break
    }
})

export const httpAxios = function (params) {
    if (params.methods === 'get') {
        const paramsObj = Qs.stringify(params.data)
        return axios({
            method: 'GET',
            url: `/${params.url}?${paramsObj}`
        })
    } else if (params.methods === 'post') {
        return axios({
            method: 'POST',
            url: `/${params.url}`,
            transformRequest: [function (data) {
                data = Qs.stringify(params.data)
                return data
            }]
        })
    }
}
export default service
