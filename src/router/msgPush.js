const msgpushRouter = [
    {
        path: '/msgpush',
        component: () => import(/* webpackChunkName: "msgPush" */ '@/views/msgPush/msgpushList.vue'),
        meta: {title: '消息推送列表'}
    },
]
export  default msgpushRouter