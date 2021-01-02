import request from '@/utils/axios'

//登录 /api/auth/login
export function login(formData) {
    return request({
        url: '/api/auth/login',
        method: 'POST',
        data: formData,
    })
}
//退出登录 /api/auth/logout
export function logout(formData) {
    return request({
        url: '/api/auth/logout',
        method: 'POST',
        data: formData,
    })
}
//获取用户信息 /api/auth/me
export function logme(formData) {
    return request({
        url: '/api/auth/me',
        method: 'POST',
        data: formData,
    })
}