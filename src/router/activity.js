const activityRouter = [
    {
        path: '/activitylist',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/activityaList.vue'),
        meta: {title: '活动列表'}
    },
    {
        path: '/activityacreate',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/activityaCreate.vue'),
        meta: {title: '创建活动'}
    },
    {
        path: '/activityaupdate',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/activityaUpdate.vue'),
        meta: {title: '修改活动'}
    },
    {
        path:'/commodityList',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/commodityList.vue'),
        meta: {title: '商品列表'}
    },
    {
        path: '/PopularSearchTermsList',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/PopularSearchTermsList.vue'),
        meta: {title: '修改活动'}
    },
    {
        path:'/fullreductionlist',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/fullreduction/fullreductionList.vue'),
        meta: {title: '满减活动列表'}
    },
    {
        path:'/fullreductioncreate',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/fullreduction/fullreductionCreate.vue'),
        meta: {title: '满减活动详情'}
    },
    {
        path:'/leaderboardList',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/leaderboard/leaderboardList.vue'),
        meta: {title: '排行榜列表'}
    },
    {
        path:'/leaderboard',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/leaderboard/leaderboard.vue'),
        meta: {title: '排行榜详情页'}
    },
    {
        path:'/priceReviewList',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/priceReview/priceReviewList.vue'),
        meta: {title: '价格审核页'}
    },
    {
        path:'/purchasingReportList',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/purchasingReport/purchasingReportList.vue'),
        meta: {title: '增长活动提报'}
    },
    {
        path:'/onefaddishList',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/onefaddish/onefaddishList.vue'),
        meta: {title: '一元爆款页'}
    },
    {
        path:'/onefaddishAdd',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/onefaddish/onefaddishAdd.vue'),
        meta: {title: '一元爆款详情页'}
    },
]
export  default activityRouter