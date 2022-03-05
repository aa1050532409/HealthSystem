const groupManage = {
    path: '/expertmanage',
    name: "专家管理",
    redirect: '/expertmanage/groupmanage',
    meta: { navName: "专家管理" },
    component: () => import('@views/expertmanage/Layout.vue'),
    children: [
        {
            path: '/expertmanage/groupmanage',
            name: '专家团队',
            meta: { activeRoute: "/expertmanage", navName: "专家团队" },
            component: () => import('@views/expertmanage/groupList/groupList.vue'),
        },
        {
            path: '/expertmanage/groupdetails',
            name: '专家团队_详情',
            meta: { activeRoute: "/expertmanage", navName: "团队详情" },
            component: () => import('@views/expertmanage/groupeDetails/groupeDetails.vue'),
        }
    ]
}

export default groupManage     //导出
