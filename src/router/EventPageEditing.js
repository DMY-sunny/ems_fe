const EventRouter = [
    {
        path: '/EventPageEditing',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/EventPageEditing/EventPageEditing.vue'),
        meta: { title: '页面编辑', keepAlive: true }
    },
    {
        path: '/EventPageList',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/EventPageEditing/EventPageList.vue'),
        meta: { title: '页面列表', keepAlive: true }
    },
    {
        path: '/banner',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/banner/banner-list.vue'),
        meta: { title: '弹版列表' }
    },
    {
        path: '/addBanner',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/banner/add-banner.vue'),
        meta: { title: '添加弹版', keepAlive: true }
    },
    {
        path: '/entrance',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/entrance/entrance-list.vue'),
        meta: { title: '大促入口列表' }
    },
    {
        path: '/addEntrance',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/entrance/add-entrance.vue'),
        meta: { title: '添加入口配置' }
    },
    {
        path: '/open',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/open/open-list.vue'),
        meta: { title: '开屏列表' }
    },
    {
        path: '/addopen',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/open/add-open.vue'),
        meta: { title: '添加开屏' }
    },
    {
        path: '/coupon',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/coupon/coupon.vue'),
        meta: { title: '优惠券列表' }
    },
    {
        path: '/couponone',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/coupon/couponone.vue'),
        meta: { title: '单张优惠券配置' }
    },
    {
        path: '/couponall',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/coupon/couponall.vue'),
        meta: { title: '一键领取优惠券配置' }
    },
    {
        path: '/diamond',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/diamond/diamond.vue'),
        meta: { title: '金刚位配置' }
    },
    {
        path: '/rotation',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/rotation/rotation.vue'),
        meta: { title: '轮播图配置' }
    },
    {
        path: '/addrotation',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/rotation/addrotation.vue'),
        meta: { title: '添加轮播图' }
    },
    {
        path: '/thousands',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/thousands/thousands.vue'),
        meta: { title: '千人千面配置' }
    },
    {
        path: '/supermarket',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/supermarket/supermarket.vue'),
        meta: { title: '海豚超市配置' }
    },
    {
        path: '/ucenterbrander',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/ucenterbrander/ucenterbrander.vue'),
        meta: { title: '个人中心广告位' }
    },
    {
        path: '/navconfig',
        component: () => import( /* webpackChunkName: "EventRouter" */ '@/views/shopping/navconfig.vue'),
        meta: {
            title: '首页导航配置'
        }
    },
    {
        path: '/tasklist',
        component: () => import( /* webpackChunkName: "EventRouter" */ '@/views/task/tasklist.vue'),
        meta: {
            title: '任务系统列表'
        }
    },
    {
        path: '/addtask',
        component: () => import( /* webpackChunkName: "EventRouter" */ '@/views/task/addtask.vue'),
        meta: {
            title: '新建任务'
        }
    }
]
export default EventRouter