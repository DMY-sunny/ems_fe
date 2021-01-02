import request from '@/utils/axios'
// import { send } from '_@types_q@1.5.2@@types/q'
function qs(params) {
    let query = ''
    for (let key in params) query += key + '=' + params[key] + '&'
    query = query.slice(0, query.length - 1)
    return query
}

//活动管理 list /api/act/main/listpost 活动列表
export function activityList(sendObj) {
    return request({
        url: `/api/act/main/listpost?keyword=${sendObj.key_word}&order_by=${sendObj.order_by}&status=${sendObj.status}&page=${sendObj.cur_page}&page_size=${sendObj.page_size}&type=${sendObj.type}&creator=${sendObj.creator}&create_time=${sendObj.create_time}`,
        method: 'GET',
    })
}

//活动管理 /act/main/autocomplete 
export function autocomplete(sendObj) {
    return request({
        url: '/api/act/main/autocomplete',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /api/act/main/skusearch 获取商品名称及sku
export function skusearch(sendObj) {
    return request({
        url: '/api/act/main/skusearch',
        method: 'POST',
        data: sendObj,
    })
}

// /api/act/skusearch/v2
export function skusearchv2(data) {
    return request({
        url: `/api/act/skusearch/v2`,
        method: 'GET',
        params: data,
    })
}

//活动管理 /api/act/main/goodslist 商品列表
export function goodslist(sendObj) {
    return request({
        url: '/api/act/main/goodslist',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /api/act/main/goodsdel 商品列表删除
export function goodsdel(sendObj) {
    return request({
        url: ' /api/act/main/goodsdel/v2',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /api/act/main/updatepost 修改提交
export function goodsupdatepost(sendObj) {
    return request({
        url: '/api/act/main/updatepost',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /api/act/main/detail 修改获取活动详情
export function actdetail(sendObj) {
    return request({
        url: `/api/act/main/detail?act_id=${sendObj}`,
        method: 'GET',
    })
}
//活动管理 /api/act/main/createpost  新增提交
export function goodscreatepost(sendObj) {
    return request({
        url: '/api/act/main/createpost',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /api/act/main/create  新增获取活动ID
export function createAppId(sendObj) {
    return request({
        url: '/api/act/main/create',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /api/act/main/goodsadd  添加新增商品
export function goodsadd(sendObj) {
    return request({
        url: '/api/act/main/goodsadd',
        method: 'POST',
        data: sendObj,
    })
}

//商品修改 /api/act/main/import 
export function goodsupdate(sendObj) {
    return request({
        url: 'api/act/main/goodsupdate',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /api/act/main/delete 删除活动列表
export function activitylistDelete(sendObj) {
    return request({
        url: '/api/act/main/delete',
        method: 'POST',
        data: sendObj,
    })
}

//商品xlsx文件导入 /api/act/main/import 
export function goosxlsximport(sendObj, id) {
    return request({
        url: `/api/act/main/import?act_id=${id}`,
        method: 'POST',
        data: sendObj,
    })
}

// /api/act/goods/import 商品导入
export function goodsImport(sendObj,id) {
    return request({
        url: `/api/act/goods/import?act_id=${id}`,
        method: 'POST',
        data: sendObj,
    })
}

//商品xlsx文件导出 /api/act/main/goodsexport 
export function goosxlsxgoodsexport(sendObj) {
    return request({
        url: `/api/act/main/goodsexport?act_id=${sendObj}`,
        method: 'GET',
    })
}

//商品联想搜索接口 /api/act/main/autocomplete/v2?keyword=
export function actautocomplete(sendObj) {
    return request({
        url: `/api/act/main/autocomplete/v2?keyword=${sendObj}`,
        method: 'GET',
    })
}

//banner上传服务器 /api/act/main/import 
export function bannerUpdata(sendObj) {
    return request({
        url: `/api/act/main/update`,
        method: 'POST',
        data: sendObj,
    })
}
// 张风尘
//搜索热词列表 /api/hotsearchkey/list 
export function hotsearchkeylist(params) {
    return request({
        url: `/api/hotsearchkey/list?title=${params.key_word}&page=${params.cur_page}&page_size=${params.page_size}`,
        method: 'GET',
    })
}

//编辑保存接口 /api/act/main/import 
export function hotsearchkeydetail(sendObj) {
    return request({
        url: `/api/hotsearchkey/detail`,
        method: 'POST',
        data: sendObj,
    })
}

//新增保存接口 /api/hotsearchkey/save
export function hotsearchkeysave(sendObj) {
    return request({
        url: `/api/hotsearchkey/save`,
        method: 'POST',
        data: sendObj,
    })
}

//修改热词状态 /api/hotsearchkey/changestatus
export function hotsearchkeychangestatuse(sendObj) {
    return request({
        url: `/api/hotsearchkey/changestatus`,
        method: 'POST',
        data: sendObj,
    })
}
//满减活动管理 list /fullcut/main/listpost
export function fullcutList(sendObj) {
    return request({
        url: `/api/act/fullcut/listpost?page=${sendObj.cur_page}&page_size=${sendObj.page_size}`,
        method: 'GET',
    })
}

//删除满减活动 /fullcut/main/delete  fullcut_id
export function fullcutDetele(sendObj) {
    return request({
        url: '/api/act/fullcut/delete',
        method: 'POST',
        data: sendObj,
    })
}

//满减活动管理 创建获取满减活动id  /fullcut/main/createnew
export function fullcutallId(sendObj) {
    return request({
        url: '/api/act/fullcut/createnew',
        method: 'post',
        data: sendObj,
    })
}

//满减活动添加单个商品 /fullcut/main/goodsaddnew 
export function fullcutsinglegoodsAdd(sendObj) {
    return request({
        url: '/api/act/fullcut/goodsadd',
        method: 'POST',
        data: sendObj,
    })
}

//满减活动创建提交保存 /fullcut/main/createpostnew
export function fullcutsingleCreate(sendObj) {
    return request({
        url: '/api/act/fullcut/createpostnew',
        method: 'POST',
        data: sendObj,
    })
}

//满减活动 获取详情 /fullcut/main/updatenew?fullcut_id=15220536353849
export function fullcutsingleDetail(id) {
    return request({
        url: '/api/act/fullcut/updatenew?fullcut_id=' + id,
        method: 'POST',
    })
}

//满减活动 修改保存 /fullcut/main/updatepostnew
export function fullcutsingleUpdate(sendObj) {
    return request({
        url: '/api/act/fullcut/updatepostnew',
        method: 'POST',
        data: sendObj,
    })
}
//获取所有goods  /seckill/main/specialautocomplete
export function seckillspecialgoodsList(sendObj) {
    return request({
        url: '/api/act/fullcut/specialautocomplete',
        method: 'POST',
        data: sendObj,
    })
}
//秒杀专场 删除专场产品 /seckill/main/specialgoodsdel
export function seckillspecialgoodsDetele(sendObj) {
    return request({
        url: '/seckill/main/specialgoodsdel',
        method: 'POST',
        data: sendObj,
    })
}
//提报单页面基础配置 /api/act/purchase/configs
export function purchaseConfigs() {
    return request({
        url: `/api/act/purchase/configs`,
        method: 'GET',
    })
}
//商品分类 /api/goods/categories
export function categories(parent_id) {
    return request({
        url: `/api/goods/categories?parent_id=${parent_id}`,
        method: 'GET',
    })
}
//商品分类2 /api/goods/categories/v2
export function categories2(parent_id) {
    return request({
        url: `/api/goods/categories/v2?parent_ids=${parent_id}`,
        method: 'GET',
    })
}
//发起采购提报单(包括修改)/api/act/purchase/post
export function purchasePost(sendObj) {
    return request({
        url: '/api/act/purchase/post',
        method: 'POST',
        data: sendObj,
    })
}
//采购提报单详情 /api/act/purchase/post
export function purchaseGet(act_id) {
    return request({
        url: `/api/act/purchase/post?act_id=${act_id}`,
        method: 'GET',
    })
}
//活动馆商品列表配置 /api/act/main/goodslist/configs
export function goodslistConfigs(sendObj) {
    return request({
        url: '/api/act/main/goodslist/configs',
        method: 'POST',
        data: sendObj,
    })
}
// 采购提报记录 /api/act/purchase/revisions
export function revisions(sendObj) {
    return request({
        url: `/api/act/purchase/revisions`,
        method: 'GET',
        params: sendObj,
    })
}
// 活动馆列表配置 /api/act/main/listpost/configs
export function listGETConfigs() {
    return request({
        url: `/api/act/main/listpost/configs`,
        method: 'GET',
    })
}
//树状商品分类接口 /api/goods/categories/tree
export function categoriesTree() {
    return request({
        url: `/api/goods/categories/tree`,
        method: 'GET',
    })
}
///api/act/main/goods/settop 批量置顶
export function settop(sendObj) {
    return request({
        url: `/api/act/main/goods/settop`,
        method: 'POST',
        data: sendObj,
    })
}
// /api/act/purchase/goods/list 已提报商品列表
export function tibaoGoodsList(data) {
    return request({
        url: `/api/act/goods/purchase`,
        method: 'GET',
        params: data
    })
}
// /api/act/goods/list  已选商品列表
export function xuanpinGoodsList(data) {
    return request({
        url: `/api/act/goods/list`,
        method: 'GET',
        params: data
    })
}
// /api/act/purchase/manual 选中sku选品
export function manual(sendObj) {
    return request({
        url: `/api/act/purchase/manual`,
        method: 'POST',
        data: sendObj,
    })
}
// /api/act/goods/changeprice/postaudit 提交审核
export function postaudit(sendObj) {
    return request({
        url: `/api/act/goods/changeprice/postaudit`,
        method: 'POST',
        data: sendObj,
    })
}
// /api/act/tag/list 活动馆标签列表 
export function tagList(sendObj) {
    return request({
        url: `/api/act/tag/list`,
        method: 'GET',
        params:sendObj,
    })
}
// /api/act/tag/delete
export function tagDelete(sendObj) {
    return request({
        url: `/api/act/tag/delete`,
        method: 'POST',
        data: sendObj,
    })
}
// /api/act/tag/store
export function tagStore(sendObj) {
    return request({
        url: `/api/act/tag/store`,
        method: 'POST',
        data: sendObj,
    })
}
// /api/audit/configs 价格审核配置信息 
export function auditConfigs() {
    return request({
        url: `/api/audit/configs`,
        method: 'GET',
    })
}
// /api/audit/list  价格审核列表
export function auditList(data) {
    return request({
        url: `/api/audit/list`,
        method: 'GET',
        params: data
    })
}
// /api/audit/accept  过审
export function auditAccept(sendObj) {
    return request({
        url: `/api/audit/accept`,
        method: 'POST',
        data: sendObj
    })
}
// /api/audit/reject  驳回
export function auditReject(sendObj) {
    return request({
        url: `/api/audit/reject`,
        method: 'POST',
        data: sendObj
    })
}
// /api/audit/list  详情
export function auditDetail(data) {
    return request({
        url: `/api/audit/detail`,
        method: 'GET',
        params: data
    })
}
// /api/act/purchase/list
export function purchaseList(data) {
    return request({
        url: `/api/act/purchase/list`,
        method: 'GET',
        params: data
    })
}
// /api/supply-chain/merchants
export function merchants(data) {
    return request({
        url: `/api/supply-chain/merchants`,
        method: 'GET',
        params: data
    })
}

// 会员秒杀商品导入
export function seckillGoodsImport(sendObj,id) {
    return request({
        url: `/api/seckill/upload?id=${id}`,
        method: 'POST',
        data: sendObj
    })
}