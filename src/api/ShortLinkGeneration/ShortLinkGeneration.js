import request from '@/utils/axios'
// 短链接
//h5页面保存 list /api/act/main/listpost 
export function h5builderSave(sendObj) {
    return request({
        url: '/api/h5builder/pages/save',
        method: 'POST',
        data: sendObj,
    })
}
//h5页面详情 list /api/h5builder/pages/detail h5页面详情
export function h5builderDetail(id) {
    return request({
        url: `/api/h5builder/pages/detail?id=${id}`,
        method: 'GET',
    })
}

//h5页面列表 list /api/h5builder/pages/list h5页面详情
export function h5builderList( page, page_size) {
    return request({
        url: `/api/h5builder/pages/list?page=${page}&page_size=${page_size}`,
        method: 'GET',
    })
}

//h5页面列表 list /api/h5builder/pages/delete h5页面删除
export function h5builderdelete(id) {
    return request({
        url: `/api/h5builder/pages/delete?id=${id}`,
        method: 'GET',
    })
}

//h5页面列表 list /api/h5builder/tpl/list
export function h5builderMBlist(page,page_size) {
    return request({
        url: `/api/h5builder/tpl/list?page=1&page_size=10`,
        method: 'GET',
    })
}
