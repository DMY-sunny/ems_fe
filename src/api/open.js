import request from '@/utils/axios'
//open 列表
export function openList(data) {
    return request({
        url: `api/app/open/list`,
        method: 'GET',
        params: data
    })
}
export function openSave(data) {
    let str = data.open_id ? 'update' : 'save'
    return request({
        url: `api/app/open/${str}`,
        method: 'post',
        data: data
    })
}
export function openDetail(data) {
    return request({
        url: `api/app/open/detail`,
        method: 'GET',
        params: data
    })
}
export function deleteOpen(data) {
    return request({
        url: `api/app/open/del`,
        method: 'post',
        params: data
    })
}