const wechatRouter = [
    {
        path: '/materiallist',
        component: () => import(/* webpackChunkName: "wechat" */ '@/views/wechat/materialList.vue'),
        meta: {title: '素材管理'}
    },
    {
        path: '/templatelist',
        name:'templatelist',
        component: () => import(/* webpackChunkName: "wechat" */ '@/views/wechat/templateList.vue'),
        meta: {title: '图文管理'}
    },
    {
        path: '/templatecreate',
        component: () => import(/* webpackChunkName: "wechat" */ '@/views/wechat/templateCreate.vue'),
        meta: {title: '创建图文信息'}
    },
    {
        path: '/templateupdate',
        component: () => import(/* webpackChunkName: "wechat" */ '@/views/wechat/templateUpdate.vue'),
        meta: {title: '编辑图文信息'}
    },
    {
        path: '/templatesendlist',
        component: () => import(/* webpackChunkName: "wechat" */ '@/views/wechat/templatesendList.vue'),
        meta: {title: '微信发送记录'}
    },
    {
        path: '/wechatarticleslist',
        component: () => import(/* webpackChunkName: "wechat" */ '@/views/wechat/wechatarticlesList.vue'),
        meta: {title: '微信文章管理'}
    },
    {
        path: '/articlesstatisticallist',
        component: () => import(/* webpackChunkName: "wechat" */ '@/views/wechat/articlesstatisticalList.vue'),
        meta: {title: '文章统计'}
    },
    {
        path: '/templatepushlist',
        component: () => import(/* webpackChunkName: "wechat" */ '@/views/wechat/templatepushList.vue'),
        meta: {title: '模板推送'}
    },


//
]
export default wechatRouter