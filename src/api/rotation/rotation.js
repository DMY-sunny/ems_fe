import request from '@/utils/axios'

function qs(params) {
    let query = ''
    for (let key in params) query += key + '=' + params[key] + '&'
    query = query.slice(0, query.length - 1)
    return query
}
//banenr详情
export function bannerDetail(id) {
    return request({
        url: `/api/banner?id=${id}`,
        method: 'GET',
    })
}
//banner配置
export function bannerConfig() {
    return request({
        url: `/api/banner/configs`,
        method: 'GET',
    })
}
//banner列表
export function bannerList(sendObj) {
    return request({
        url: `/api/banner/list?title=${sendObj.title}&position=${sendObj.position}&category=${sendObj.category}&show_mode=${sendObj.show_mode}&start_time=${sendObj.start_time}&end_time=${sendObj.end_time}&page=${sendObj.page}&page_size=${sendObj.page_size}`,
        method: 'GET',
    })
}
//banner保存
export function bannerSave(sendObj) {
    return request({
        url: '/api/banner',
        method: 'POST',
        data: sendObj,
    })
}
//banner显示
export function bannerDisplay(sendObj) {
    return request({
        url: '/api/banner/display',
        method: 'POST',
        data: sendObj,
    })
}
//banner隐藏
export function bannerHide(sendObj) {
    return request({
        url: '/api/banner/hide',
        method: 'POST',
        data: sendObj,
    })
}
//banner删除
export function bannerDelete(sendObj) {
    return request({
        url: '/api/banner',
        method: 'DELETE',
        data: sendObj,
    })
}