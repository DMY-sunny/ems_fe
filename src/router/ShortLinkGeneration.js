const ShortLinkGeneration = [
    {
        path: '/imgUrl',
        component: () => import(/* webpackChunkName: "ShortLinkGeneration" */ '@/views/ShortLinkGeneration/imgUrl.vue'),
        meta: { title: '生成短链接' }
    },
    {
        path: '/shortlinklist',
        component: () => import(/* webpackChunkName: "ShortLinkGeneration" */ '@/views/ShortLinkGeneration/shortlinklist.vue'),
        meta: { title: '短链接列表' }
    },
    {
        path: '/seekactivity',
        component: () => import(/* webpackChunkName: "ShortLinkGeneration" */ '@/views/ShortLinkGeneration/seekactivity.vue'),
        meta: { title: '活动搜索' }
    }
]
export default ShortLinkGeneration