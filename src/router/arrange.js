const EventRouter = [
    {
        path: '/arrange',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/arrange/arrange.vue'),
        meta: { title: '大促id配置列表' }
    },
    {
        path: '/addArrange1',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/arrange/add-arrange1.vue'),
        meta: { title: '美妆会场配置' }
    },
    {
        path: '/addArrange2',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/arrange/add-arrange2.vue'),
        meta: { title: '零食会场配置' }
    },
    {
        path: '/addArrange3',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/arrange/add-arrange3.vue'),
        meta: { title: '轻奢会场配置' }
    },
    {
        path: '/addArrange4',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/arrange/add-arrange4.vue'),
        meta: { title: '包邮包税配置' }
    },
    {
        path: '/addArrange5',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/arrange/add-arrange5.vue'),
        meta: { title: '保健会场配置' }
    },
    {
        path: '/addArrange6',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/arrange/add-arrange6.vue'),
        meta: { title: '家居会场配置' }
    },
    {
        path: '/addArrange7',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/arrange/add-arrange7.vue'),
        meta: { title: '服饰会场配置' }
    },
    {
        path: '/addArrange8',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/arrange/add-arrange8.vue'),
        meta: { title: '主会场配置' }
    }
]
export default EventRouter