import request from '@/utils/axios'
//大写U(User)开头的接口为用户 C(Character)开头的为角色 P(Permission)开头的为权限
function qs(params) {
    let query = ''
    for (let key in params) query += key + '=' + params[key] + '&'
    query = query.slice(0, query.length - 1)
    return query
}
//用户列表
export function UserList(keyword,page,page_size) {
    return request({
        url: `/api/user/list?keyword=${keyword}&page=${page}&page_size=${page_size}`,
        method: 'GET',
    })
}
//用户注销角色
export function Ulogoutrole(role_id) {
    return request({
        url: `/api/permission/user/logoutrole?role_id=${role_id}`,
        method: 'GET',
    })
}
//用户拥有权限
export function Upermissions(user_id) {
    return request({
        url: `/api/permission/user/permissions?user_id=${user_id}`,
        method: 'GET',
    })
}
//给用户设置角色
export function Usetrole(sendobj) {
    return request({
        url: '/api/permission/user/setrole',
        method: 'POST',
        data: sendobj,
    })
}
//给用户设置临时权限
export function Usettemppermission(sendobj) {
    return request({
        url: '/api/permission/user/settemppermission',
        method: 'POST',
        data: sendobj,
    })
}
//给用户撤销角色
export function Urevokerole(sendobj) {
    return request({
        url: '/api/permission/user/revokerole',
        method: 'POST',
        data: sendobj,
    })
}
