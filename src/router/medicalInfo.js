const medicalInfo = {
    path: '/medicalinfo',
    name: '医疗信息',
    redirect: '/medicalinfo/organization',
    meta: { activeRoute: "/medicalinfo", navName: "医疗信息" },
    component: () => import('../views/medicalInfo/Layout.vue'),
    children: [
        {
            path: "/medicalinfo/organization",
            name: "医疗机构",
            meta: { activeRoute: "/medicalinfo/organization", navName: "医疗机构" },
            component: () => import('../views/medicalInfo/Organization.vue'),
        },
        {
            path: "/medicalinfo/expert",
            name: "医疗专家",
            meta: { activeRoute: "/medicalinfo/expert", navName: "医疗专家" },
            component: () => import('../views/medicalInfo/Expert.vue'),
        },
        {
            path: "/medicalinfo/article",
            name: "医疗用品",
            meta: { activeRoute: "/medicalinfo/article", navName: "医疗用品" },
            component: () => import('../views/medicalInfo/Article.vue'),
        },
        {
            path: "/medicalinfo/orgdetails",
            name: "医疗机构详情",
            meta: { activeRoute: "/medicalinfo/organization", navName: "医疗机构详情" },
            component: () => import('../views/medicalInfo/orgDetails/orgDetails.vue'),
        },
        {
            path: "/medicalinfo/expertdetails",
            name: "医疗专家详情",
            meta: { activeRoute: "/medicalinfo/expert", navName: "医疗专家详情" },
            component: () => import('../views/medicalInfo/groupeDetails/groupeDetails.vue'),
        },


        {
            path: "/medicalinfo/description/shuyu",
            name: "医疗用语_医疗术语",
            meta: { activeRoute: "/medicalinfo/description/shuyu", navName: "医疗术语" },
            component: () => import('../views/medicalInfo/MedicalDescription.vue'),
        },
        {
            path: "/medicalinfo/description/biaoshu",
            name: "医疗用语_症状表述",
            meta: { activeRoute: "/medicalinfo/description/biaoshu", navName: "症状表述" },
            component: () => import('../views/medicalInfo/StateDescription.vue'),
        },

    ]
}
export default medicalInfo     //导出