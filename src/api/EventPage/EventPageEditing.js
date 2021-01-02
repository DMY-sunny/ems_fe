import request from '@/utils/axios'
// 活动保存
export function handleimgPost(sendObj) {
    return request({
        url: '/api/activity/save',
        method: 'POST',
        data: sendObj,
    })
}
//活动编辑
export function handleimgSearch(id) {
    return request({
        url: `/api/activity/detail?activity_id=${id}`,
        method: 'GET',
    })
}
//商品列表
export function activityGoods(data) {
    return request({
        url: `/api/activity/goods`,
        method: 'GET',
        params: data
    })
}
//活动删除
export function activityDelete(id) {
    return request({
        url: `/api/activity/delete?activity_id=${id}`,
        method: 'GET',
    })
}
// 活动详情列表 /api/activity/list 搜索
export function eventPageList(page, page_size, activity_title, activity_id) {
    return request({
        url: `/api/activity/list?page=${page}&page_size=${page_size}&activity_title=${activity_title}&activity_id=${activity_id}`,
        method: 'GET',
    })
}
// 活动素材下发 /activity/configs
export function eventPageConfigs() {
    return request({
        url: '/api/activity/configs',
        method: 'GET',
    })
}