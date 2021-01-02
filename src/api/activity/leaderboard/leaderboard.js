import request from '@/utils/axios'
// import Axios from '_axios@0.18.1@axios'

// import { send } from '_@types_q@1.5.2@@types/q'
function qs(params) {
    let query = ''
    for (let key in params) query += key + '=' + params[key] + '&'
    query = query.slice(0, query.length - 1)
    return query
}
//排行榜列表
export function rankingList(sendObj) {
    return request({
        url: `/api/ranking/list?category=${sendObj.category}&start_time=${sendObj.start_time}&end_time=${sendObj.end_time}&page=${sendObj.page}&page_size=${sendObj.page_size}`,
        method: 'GET',
    })
}
//标签添加
export function rankingTagsPost(sendObj) {
    return request({
        url: '/api/ranking/tags',
        method: 'POST',
        data: sendObj,
    })
}
//排行榜删除 /api/ranking
export function rankingDelete(sendObj) {
    return request({
        url: '/api/ranking',
        method: 'DELETE',
        data: sendObj,
    })
}
//标签删除 /api/ranking/tags
export function rankingTagsDelete(sendObj) {
    return request({
        url: '/api/ranking/tags',
        method: 'DELETE',
        data: sendObj,
    })
}
// 排行榜保存/api/ranking
export function rankingSave(sendObj) {
    return request({
        url: '/api/ranking',
        method: 'POST',
        data: sendObj,
    })
}
// 商品保存/api/ranking/goods
export function rankingGoods(sendObj) {
    return request({
        url: '/api/ranking/goods',
        method: 'POST',
        data: sendObj,
    })
}
// 商品列表/api/ranking/goods/list
export function goodsList(sendObj) {
    return request({
        url: `/api/ranking/goods/list?type=${sendObj.type}&ranking_id=${sendObj.ranking_id}&nav_tag=${sendObj.nav_tag}&page=${sendObj.page}&page_size=${sendObj.page_size}`,
        method: 'GET',
    })
}
// 商品删除DELETE
export function goodsDelete(sendObj) {
    return request({
        url: '/api/ranking/goods',
        method: 'DELETE',
        data: sendObj,
    })
}
// 商品置顶/api/ranking/goods/top
export function goodsTop(sendObj) {
    return request({
        url: '/api/ranking/goods/top',
        method: 'POST',
        data: sendObj,
    })
}
// 商品取消置顶/api/ranking/goods/top/cancel
export function goodsTopCancel(sendObj) {
    return request({
        url: '/api/ranking/goods/top/cancel',
        method: 'POST',
        data: sendObj,
    })
}
// 商品上榜 /api/ranking/goods/online
export function goodsOnline(sendObj) {
    return request({
        url: '/api/ranking/goods/online',
        method: 'POST',
        data: sendObj,
    })
}
// 商品下榜 /api/ranking/goods/offline
export function goodsOffline(sendObj) {
    return request({
        url: '/api/ranking/goods/offline',
        method: 'POST',
        data: sendObj,
    })
}
// 排行榜详情 /api/ranking
export function rankingGet(id) {
    return request({
        url: `/api/ranking?id=${id}`,
        method: 'GET',
    })
}
//商品导入 /api/ranking/goods/import
export function goodsImport(sendObj, id) {
    return request({
        url: `/api/ranking/goods/import?ranking_id=${id}`,
        method: 'POST',
        data: sendObj,
    })
}
//商品排序 /api/ranking/goods/sort
export function goodsSort(sendObj) {
    return request({
        url: `/api/ranking/goods/sort`,
        method: 'POST',
        data: sendObj,
    })
}