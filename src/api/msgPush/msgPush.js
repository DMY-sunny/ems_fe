import request from '@/utils/axios'
function qs(params) {
    let query = ''
    for (let key in params) query += key + '=' + params[key] + '&'
    query = query.slice(0, query.length - 1)
    return query
}
//获取基础信息 /api/task/push/configs
export function msgpushInfo(params) {
    return request({
        url: `/api/task/push/configs`,
        method: 'GET',
    })
}
// /api/task/push/list 消息推送列表
export function msgpushList(params) {
    return request({
        url: `/api/task/push/list?${qs(params)}`,
        method: 'GET',
    })
}
//删除 api/task/push/delete id
export function msgpushDelete(id) {
    return request({
        url: '/api/task/push/delete?id=' + id,
        method: 'GET',
    })
}
//保存推送信息 api/task/push/save
export function msgpushSave(sendObj) {
    return request({
        url: '/api/task/push/save',
        method: 'POST',
        data:sendObj
    })
}
//推送详情 msgpushDetail  api/task/push/detail
export function msgpushDetail(id) {
    return request({
        url: '/api/task/push/detail?id=' +id,
        method: 'GET',
    })
}
//测试发送 api/task/push/test
export function msgpushTest(sendObj) {
    return request({
        url: '/api/task/push/test',
        method: 'POST',
        data:sendObj
    })
}
//中断续发 /api/task/push/restore
export function msgpushRestore(sendObj) {
    return request({
        url: '/api/task/push/restore',
        method: 'POST',
        data:sendObj
    })
}