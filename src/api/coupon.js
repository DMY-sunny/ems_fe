import request from '@/utils/axios'
import Qs from 'qs'
// 优惠券 - 一键领取配置保存/详情
export const onKeyReceive = (obj) => request({
    method: obj ? 'POST' : 'GET',
    url: `api/cms/coupon/onkeyreceive`,
    transformRequest: [function (data) {
        data = Qs.stringify(obj)
        return data
    }]
})
// 优惠券 - 单张领取配置保存/详情
export const singleReceive = (obj) => request({
    method: obj ? 'POST' : 'GET',
    url: `api/cms/coupon/singlereceive`,
    transformRequest: [function (data) {
        data = Qs.stringify(obj)
        return data
    }]
})
// 金刚位配置保存/详情
export const featureArea = (obj) => request({
    method: obj ? 'POST' : 'GET',
    url: `api/cms/index/featurearea`,
    transformRequest: [function (data) {
        data = Qs.stringify(obj)
        return data
    }]
})
// 千人千面配置保存/详情
export const modulesAds = (obj) => request({
    method: obj ? 'POST' : 'GET',
    url: `api/cms/ads/modulesads`,
    transformRequest: [function (data) {
        data = Qs.stringify(obj)
        return data
    }]
})
// 个人中心广告位配置保存/详情
export const ucenterBrander = (obj) => request({
    method: obj ? 'POST' : 'GET',
    url: `api/cms/ads/ucenterbrander`,
    transformRequest: [function (data) {
        data = Qs.stringify(obj)
        return data
    }]
})