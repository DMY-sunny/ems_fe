const systemRouter = [
    {
        path: '/userlist',
        component: () => import(/* webpackChunkName: "system" */ '@/views/system/userlist.vue'),
        meta: {title: '用户列表'}
    },
    {
        path: '/rolelist',
        component: () => import(/* webpackChunkName: "system" */ '@/views/system/rolelist.vue'),
        meta: {title: '角色列表'}
    },
    {
        path: '/permissionlist',
        component: () => import(/* webpackChunkName: "system" */ '@/views/system/permissionList.vue'),
        meta: {title: '权限列表'}
    },
]
export default systemRouter
