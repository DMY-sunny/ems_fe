import request from '@/utils/axios'
import Qs from 'qs'
//banner 列表
export function actType(data) {
    return request({
        url: `api/get/act/type`,
        method: 'GET',
        params: data
    })
}
export const cmsCreateData = (obj) => request({
    method: 'POST',
    url: `api/v1/configs/create`,
    transformRequest: [function (data) {
        data = Qs.stringify(obj)
        return data
    }]
})
export const cmsGetData = (obj) => request({
    method: 'POST',
    url: `api/v1/configs/get`,
    transformRequest: [function (data) {
        data = Qs.stringify(obj)
        return data
    }]
})