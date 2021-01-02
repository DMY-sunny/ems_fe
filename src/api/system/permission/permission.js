import request from '@/utils/axios'
function qs (params) {
  let query = ''
  for (let key in params) query += key + '=' + params[key] + '&'
  query = query.slice(0, query.length - 1)
  return query
}
//权限创建/修改
export function Psave(sendobj) {
  return request({
      url: '/api/permission/save',
      method: 'POST',
      data: sendobj,
  })
}
//权限删除
export function Pdelete(sendobj) {
  return request({
      url: '/api/permission/delete',
      method: 'POST',
      data: sendobj,
  })
}
//权限列表
export function Plist(page,page_size) {
  return request({
      url: `/api/permission/list?page=${page}&page_size=${page_size}`,
      method: 'GET',
  })
}
//权限支持的项目 /api/permission/projects
export function Pprojects() {
  return request({
      url: `/api/permission/projects`,
      method: 'GET',
  })
}