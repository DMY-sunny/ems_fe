import request from '@/utils/axios'

//一元爆款活动列表
export function specialList(sendObj) {
    return request({
        url: `/api/special/main/list?keyword=${sendObj.keyword}&order_by=${sendObj.order_by}&status=${sendObj.status}&page=${sendObj.page}&page_size=${sendObj.page_size}&type=${sendObj.type}`,
        method: 'GET',
    })
}
//创建一元爆款活动保存
export function specialAdd(sendObj) {
    return request({
        url: '/api/special/main/add',
        method: 'POST',
        data: sendObj,
    })
}
//修改或删除活动接口
// 修改  act_id,title,start_time,end_time
// 删除  act_id，status:2  
export function specialUpdate(sendObj) {
    return request({
        url: '/api/special/main/update',
        method: 'POST',
        data: sendObj,
    })
}
//活动详情接口
export function specialDetail(id) {
    return request({
        url: `/api/special/main/detail?act_id=${id}`,
        method: 'GET',
    })
}

//一元爆款商品联动添加商品保存
export function specialGoodsAdd(sendObj) {
    return request({
        url: `/api/special/main/goodsadd`,
        method: 'POST',
        data: sendObj,
    })
}


//一元爆款商品列表list接口
export function specialGoodsList(id) {
    return request({
        url: `/api/special/main/goodslist?act_id=${id}`,
        method: 'GET',
    })
}
//一元爆款商品列表调整排序或删除
// 排序传参  id，order_sort
// 删除传参  id，status=2
export function specialGoodsUpdate(sendObj) {
    return request({
        url: `/api/special/main/goodsupdate`,
        method: 'POST',
        data: sendObj,
    })
}

