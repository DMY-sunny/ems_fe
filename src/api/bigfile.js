import request from '@/utils/axios'
//大文件上传 列表
export function bigfile(sendObj) {
    return request({
        url: `/api/upload/bigfile`,
        method: 'POST',
        params: sendObj
    })
}