import request from '@/utils/axios'
//entrance 列表
export function entranceList(data) {
    return request({
        url: `api/activity/settings/list`,
        method: 'GET',
        params: data
    })
}
export function entranceSave(data) {
    let str = data.activity_id ? 'update' : 'create'
    return request({
        url: `api/activity/settings/${str}`,
        method: 'post',
        data: data
    })
}
export function entranceDetail(data) {
    return request({
        url: `api/activity/settings/detail`,
        method: 'GET',
        params: data
    })
}
export function entrancedeltoast(data) {
    return request({
        url: `api/activity/settings/delete`,
        method: 'post',
        params: data
    })
}
export function atcGoods(id) {
    return request({
        url: `api/search/act/goods?goods_id=${id}`,
        method: 'GET'
    })
}