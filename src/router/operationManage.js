const operationManage = {
    path: '/operationmanage',
    redirect: '/operationmanage/applylist',
    name: '查房管理',
    meta: { activeRoute: "/operationmanage", navName: "住院患者" },
    component: () => import('../views/operationmanage/Layout.vue'),
    children: [
        {
            path: "/operationmanage/applylist",
            name: "住院申请1",
            meta: { activeRoute: "/operationmanage/applylist", navName: "住院申请" },
            component: () => import('@views/operationmanage/applylist/ApplyList.vue'),
        },
        {
            path: "/operationmanage/applydetails",
            name: "住院申请详情1",
            meta: { activeRoute: "/operationmanage/applylist", navName: "住院申请详情" },
            component: () => import('@views/operationmanage/applydetails/ApplyDetails.vue'),
        },
        {
            path: "/operationmanage/patientlist",
            name: "住院患者1",
            meta: { activeRoute: "/operationmanage/patientlist", navName: "住院患者" },
            component: () => import('@views/operationmanage/patientslist/patientsList.vue'),
        },
        {
            path: "/operationmanage/patientdetails",
            name: "住院患者详情1",
            meta: { activeRoute: "/operationmanage/patientlist", navName: "住院患者详情" },
            component: () => import('@views/operationmanage/patientdetails/PatientDetails.vue'),
        },
        {
            path: "/operationmanage/historypatient",
            name: "历史患者1",
            meta: { activeRoute: "/operationmanage/historypatient", navName: "历史患者" },
            component: () => import('@views/operationmanage/historypatientlist/PatientList.vue'),
        },
        ,
        {
            path: "/operationmanage/historypatientdetails",
            name: "历史患者详情1",
            meta: { activeRoute: "/operationmanage/historypatient", navName: "历史患者详情" },
            component: () => import('@views/operationmanage/historypatientdetails/PatientDetails.vue'),
        },
    ]
}

export default operationManage     //导出
