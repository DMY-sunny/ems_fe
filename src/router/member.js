const memberRouter = [
    {
        path: '/seckilllist',
        component: () => import(/* webpackChunkName: "member" */ '@/views/member/seckillList.vue'),
        meta: {title: '秒杀列表'}
    },
    {
        path: '/seckillupdate',
        component: () => import(/* webpackChunkName: "member" */ '@/views/member/seckillUpdate.vue'),
        meta: {title: '新增秒杀'}
    }
]
export  default memberRouter