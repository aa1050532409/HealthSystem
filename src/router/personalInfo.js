const personalInfo = {
    path: '/personalinfo',
    redirect: "/personalinfo/basicinfo",
    name: '个人信息',
    meta: { activeRoute: "/personalinfo", navName: "个人信息" },
    component: () => import('@views/personalInfo/Layout.vue'),
    children: [
        {
            path: "/personalinfo/basicinfo",
            name: "基本信息",
            meta: { activeRoute: "/personalinfo/basicinfo", navName: "基本信息" },
            component: () => import('@views/personalInfo/BasicInfo.vue'),
        },
        {
            path: "/personalinfo/personalfinance",
            name: "个人财务",
            meta: { activeRoute: "/personalinfo/personalfinance", navName: "个人财务" },
            component: () => import('@views/personalInfo/Finance.vue'),
        },
        {
            path: "/personalinfo/bankaccount",
            name: "银行卡管理",
            meta: { activeRoute: "/personalinfo/bankaccount", navName: "银行卡管理" },

            component: () => import('@views/personalInfo/BankAccount.vue'),
        },
        {
            path: "/personalinfo/settings",
            name: "个人设置",
            meta: { activeRoute: "/personalinfo/settings", navName: "个人设置" },

            component: () => import('@views/personalInfo/Settings.vue'),
        },
        {
            path: "/personalinfo/mange",
            name: "日程管理",
            meta: { activeRoute: "/personalinfo/mange", navName: "日程管理" },
            component: () => import('@views/personalInfo/MyPlan.vue'),
        },
    ]
}
export default personalInfo     //导出
