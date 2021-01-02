import request from '@/utils/axios'
// 任务事件列表
export function taskList(sendObj) {
    return request({
        url: `api/taskevent/list?page=${sendObj.page}&page_size=30&type=${sendObj.type}&start_time=${sendObj.start_time}&end_time=${sendObj.end_time}`,
        method: 'GET'
    })
}
// 创建/修改任务事件
export function taskSave(data) {
    let str = data.id ? 'update' : 'create'
    return request({
        url: `api/taskevent/${str}`,
        method: 'post',
        data: data
    })
}
// 任务事件详情
export function taskDetail(data) {
    return request({
        url: `api/taskevent/detail`,
        method: 'GET',
        params: data
    })
}
// 任务事件删除
export function taskDel(data) {
    return request({
        url: `api/taskevent/delete`,
        method: 'post',
        params: data
    })
}
// 更改事件禁用启用状态
export function changeStatus(data) {
    return request({
        url: `api/taskevent/changestatus`,
        method: 'post',
        params: data
    })
}
// 任务事件类型列表
export function typeConfig() {
    return request({
        url: `api/taskevent/typelist`,
        method: 'GET'
    })
}
// 根据ID或者名称查询品牌
export function searchBrand(search) {
    return request({
        url: `api/taskevent/searchbrand?search=${search}`,
        method: 'GET'
    })
}
// 根据ID或者名称查询品类
export function searchCategory() {
    return request({
        url: `api/taskevent/categorylist`,
        method: 'GET'
    })
}