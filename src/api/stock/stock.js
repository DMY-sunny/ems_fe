import request from '@/utils/axios'

//商品库存查询 /stock/main/stocklistpost
export function stockList( sendObj) {
    return request({
        url: '/stock/main/stocklistpost2',
        method: 'POSt',
        data: sendObj,
    })
}
//获取真实库存 /stock/main/stockneed
export function stockReal( sendObj) {
    return request({
        url: '/stock/main/stockneed',
        method: 'POSt',
        data: sendObj,
    })
}
//商品库存列表 备注修改 /goods/main/goodsskureamrkupdate
export function stocklistmarkUpdate( sendObj) {
    return request({
        url: '/goods/main/goodsskureamrkupdate',
        method: 'POSt',
        data: sendObj,
    })
}
//商品库存列表 商备修改 /goods/main/goodsreamrkupdate
export function stocklistgoodsUpdate( sendObj) {
    return request({
        url: '/goods/main/goodsreamrkupdate',
        method: 'POSt',
        data: sendObj,
    })
}
//商品库存列表 条码修改 /goods/main/goodsskuscancodeupdate
export function stocklistscancodeUpdate( sendObj) {
    return request({
        url: '/goods/main/goodsskuscancodeupdate',
        method: 'POSt',
        data: sendObj,
    })
}

//商品库存列表 货架修改 /goods/main/goodsskushelvesupdate
export function stocklistshelvesUpdate( sendObj) {
    return request({
        url: '/goods/main/goodsskushelvesupdate',
        method: 'POSt',
        data: sendObj,
    })
}

//库存查询列表跳转 入库历史 /stock/main/stockhistorypost
export function stockhistoryList( sendObj) {
    return request({
        url: '/stock/main/stockhistorypost',
        method: 'POSt',
        data: sendObj,
    })
}
//入库历史 详情 /stock/main/stockdetail?stock_id
export function stockhistoryDetail(id) {
    return request({
        url: '/stock/main/stockdetail?stock_id='+id,
        method: 'GET',
    })
}
// 入库历史 详情页 操作记录 /stock/main/stockupdatepage
export function stockhistoryupdatDetail(sendObj) {
    return request({
        url: '/stock/main/stockupdatepage',
        method: 'POST',
        data:sendObj
    })
}
//入库历史 修改入库单保存 /stock/main/stockupdatepost
export function stockhistoryStockUpdate(sendObj) {
    return request({
        url: '/stock/main/stockupdatepost',
        method: 'POST',
        data:sendObj
    })
}
//创建入库单

//入库单 品牌list /stock/main/stockautocomplete
export function stockgoodscompleteList(sendObj) {
    return request({
        url: '/stock/main/stockautocomplete',
        method: 'GET',
        // data:sendObj
    })
}
//入库单 根据商品回显sku /stock/main/stockskusug
export function stockSkuList(sendObj) {
    return request({
        url: '/stock/main/stockskusug',
        method: 'POST',
        data:sendObj
    })
}
//入库单 输入条码 回车显示详情 /stock/main/stockscan2sku
export function stockscantoDetail(sendObj) {
    return request({
        url: '/stock/main/stockscan2skunew',
        method: 'POST',
        data:sendObj
    })
}
//入库单 绑定条码 /stock/main/stockskubarcode
export function stockbarCode(sendObj) {
    return request({
        url: '/stock/main/stockskubarcode',
        method: 'POST',
        data:sendObj
    })
}
//入库单 商品sku 回显详情 /stock/main/autostockcost
export function stockDetail(sendObj) {
    return request({
        url: '/stock/main/stockskusug',
        method: 'POST',
        data:sendObj
    })
}
//r入库单 添加入库单 /stock/main/stockcreatepost
export function stocktoCreate(sendObj) {
    return request({
        url: '/stock/main/stockcreatepost',
        method: 'POST',
        data:sendObj
    })
}
//采购入库单 列表 /stock/main/stockpurlistpost
export function stockpurList(sendObj) {
    return request({
        url: '/stock/main/stockpurlistpost',
        method: 'POST',
        data:sendObj
    })
}
//采购入库单列表 修改数量 /stock/main/stockitemupdatecount
export function stockpurlistUpdateCount(sendObj) {
    return request({
        url: '/stock/main/stockitemupdatecount',
        method: 'POST',
        data:sendObj
    })
}
//采购入库单列表 删除 /stock/main/stockitemdelete
export function stockpurlistDelete(sendObj) {
    return request({
        url: '/stock/main/stockitemdelete',
        method: 'POST',
        data:sendObj
    })
}
//审核入库单 /stock/main/stockexaminelistpost
export function stockauditputList(sendObj) {
    return request({
        url: '/stock/main/stockexaminelistpost',
        method: 'POST',
        data:sendObj
    })
}
//操作人列表  /stock/main/stockrecordoperatorpost
export function stockoperatorList() {
    return request({
        url: '/stock/main/stockrecordoperatorpost',
        method: 'POST',
    })
}
//审核列表 修改条形码 /goods/main/goodsskuscancodeupdate
//审核入库单列表 操作 审核通过/stock/main/stockitemegis
export function stockauditputPass(sendObj) {
    return request({
        url: '/stock/main/stockitemegis',
        method: 'POST',
        data:sendObj
    })
}
//审核入库单 批量审核 /stock/main/stockitemegispost
export function stockauditBatchReview(sendObj) {
    return request({
        url: '/stock/main/stockitemegispost',
        method: 'POST',
        data:sendObj
    })
}
//审核入库单 操作 生成条码 /goods/main/goodsskubarcodegeneration
export function stockauditputBarcode(sendObj) {
    return request({
        url: '/goods/main/goodsskubarcodegeneration',
        method: 'POST',
        data:sendObj
    })
}
///审核入库单 获取货架列表 shelves/main/getemptyshelves
export function stockauditshelvesList(sendObj) {
    return request({
        url: '/shelves/main/getemptyshelves',
        method: 'POST',
        data:sendObj
    })
}
// 审核入库单 修改货架  /goods/main/goodsskushelvesupdate
export function stockgoodsshelvesUpdate(sendObj) {
    return request({
        url: '/goods/main/goodsskushelvesupdate',
        method: 'POST',
        data:sendObj
    })
}
//入库单列表 /stock/main/stockrecordlistpost
export function stockpustList(sendObj) {
    return request({
        url: '/stock/main/stockrecordlistpost',
        method: 'POST',
        data:sendObj
    })
}
//每日入库商品详情查看 llist /stock/main/stockitemlistpost
export function stockpustdetailList(sendObj) {
    return request({
        url: '/stock/main/stockitemlistpost',
        method: 'POST',
        data:sendObj
    })
}
//货架列表 list /shelves/main/shelvesinfo
export function stockshelvesList(sendObj) {
    return request({
        url: '/shelves/main/shelvesinfo',
        method: 'POST',
        data:sendObj
    })
}
//货架列表 区域 和货架号  /shelves/main/getdata
export function stockshelvesGetdata(sendObj) {
    return request({
        url: '/shelves/main/getdata',
        method: 'POST',
        data:sendObj
    })
}
//货架管理 删除货架list/shelves/main/goodsshelveslist
export function stockshelvesdeleteList(sendObj) {
    return request({
        url: '/shelves/main/goodsshelveslist',
        method: 'POST',
        data:sendObj
    })
}
//关闭 开启货架 /shelves/main/delshelves
export function stockshelvesDelete(sendObj) {
    return request({
        url: '/shelves/main/delshelves',
        method: 'POST',
        data:sendObj
    })
}
//创建仓库 /shelves/main/createwarehouse
export function stockshelvesCreatewarehouse(sendObj) {
    return request({
        url: '/shelves/main/createwarehouse',
        method: 'POST',
        data:sendObj
    })
}
//创建区域 /shelves/main/createregion
export function stockshelvesCreatearea(sendObj) {
    return request({
        url: '/shelves/main/createregion',
        method: 'POST',
        data:sendObj
    })
}
//创建货架 保存 /shelves/main/createshelves
export function stockshelvesCreate(sendObj) {
    return request({
        url: '/shelves/main/createshelves',
        method: 'POST',
        data:sendObj
    })
}
//商品历史储位信息 /shelves/main/gethistoryshelves
export function stockshelveshistoryList(sendObj) {
    return request({
        url: '/shelves/main/gethistoryshelves',
        method: 'POST',
        data:sendObj
    })
}
//采购活动列表 /procurement/main/procurementlistpost
export function stockactivitygooodsList(sendObj) {
    return request({
        url: '/procurement/main/procurementlistpost',
        method: 'POST',
        data:sendObj
    })
}
//近60天销量分级统计 /order/main/ordersalecount60dayspost
export function stocknearl60List(sendObj) {
    return request({
        url: '/order/main/ordersalecount60dayspost',
        method: 'POST',
        data:sendObj
    })
}