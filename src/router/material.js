const material = [
    {
        path: '/materialList',
        component: () => import(/* webpackChunkName: "material" */ '@/views/material/materialList.vue'),
        meta: { title: '素材列表' }
    },
]
export default material