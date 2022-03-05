const groupManage = {
    path: '/organizationmanage',
    name: "机构管理",
    redirect: '/organizationmanage/orgmanage',
    meta: { navName: "专家管理" },
    component: () => import('@views/orgmanage/Layout.vue'),
    children: [
        {
            path: '/organizationmanage/orgmanage',
            name: '机构管理_列表',
            meta: { activeRoute: "/organizationmanage", navName: "医疗机构" },
            component: () => import('@views/orgmanage/orgList/orgList.vue'),
        },
        {
            path: '/organizationmanage/orgdetails',
            name: '机构管理_详情',
            meta: { activeRoute: "/organizationmanage", navName: "机构详情" },
            component: () => import('@views/orgmanage/groupeDetails/groupeDetails.vue'),
        }
    ]
}

export default groupManage     //导出
