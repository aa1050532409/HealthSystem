const followManage = {
    path: '/followmanage',
    redirect: '/followmanage/followlist',
    meta: { activeRoute: "/followmanage", navName: "随访管理" },
    name: '随访管理',
    component: () => import('../views/followmanage/Layout.vue'),
    children: [
        {
            path: "/followmanage/followlist",
            name: "随访列表",
            meta: { activeRoute: "/followmanage", navName: "随访列表" },
            component: () => import('../views/followmanage/followlist/Followlist.vue'),
        },
        {
            path: "/followmanage/followdetails",
            name: "随访详情",
            meta: { activeRoute: "/followmanage", navName: "随访详情" },
            component: () => import('../views/followmanage/followdetails/FollowDetails.vue'),
        }
    ]
}

export default followManage     //导出