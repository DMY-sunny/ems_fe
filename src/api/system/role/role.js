//大写U(User)开头的接口为用户 C(Character)开头的为角色 P(Permission)开头的为权限
import request from '@/utils/axios'
function qs (params) {
  let query = ''
  for (let key in params) query += key + '=' + params[key] + '&'
  query = query.slice(0, query.length - 1)
  return query
}

//角色创建
export function Ccreate(sendobj) {
    return request({
        url: '/api/permission/role/create',
        method: 'POST',
        data: sendobj,
    })
}
//角色修改
export function Cupdate(sendobj) {
    return request({
        url: '/api/permission/role/update',
        method: 'POST',
        data: sendobj,
    })
}
//角色删除
export function Cdelete(sendobj) {
    return request({
        url: '/api/permission/role/delete',
        method: 'POST',
        data: sendobj,
    })
}
//角色列表 
export function Clist(page,page_size) {
    return request({
        url: `/api/permission/role/list?page=${page}&page_size=${page_size}`,
        method: 'GET',
    })
}
//角色用户列表 
export function Cuserlist(role_id,page,page_size) {
    return request({
        url: `/api/permission/role/userlist?role_id=${role_id}&page=${page}&page_size=${page_size}`,
        method: 'GET',
    })
}
//角色权限列表 
export function Cpermissions(role_id,page,page_size) {
    return request({
        url: `/api/permission/role/permissions?role_id=${role_id}&page=${page}&page_size=${page_size}`,
        method: 'GET',
    })
}
//角色取消绑定权限
export function Cunbindpermission(sendobj) {
    return request({
        url: '/api/permission/role/unbindpermission',
        method: 'POST',
        data: sendobj,
    })
}
//角色绑定权限
export function Cbindpermission(sendobj) {
    return request({
        url: '/api/permission/role/bindpermission',
        method: 'POST',
        data: sendobj,
    })
}