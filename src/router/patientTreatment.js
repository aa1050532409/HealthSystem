const patientTreatment = {
    path: '/treatment',
    redirect: '/treatment/applylist',
    name: '患者治疗',
    meta: { activeRoute: "/treatment", navName: "患者治疗" },
    component: () => import('../views/patienttreatment/Layout.vue'),
    children: [
        {
            path: "/treatment/applylist",
            name: "住院申请2",
            meta: { activeRoute: "/treatment/applylist", navName: "住院申请" },
            component: () => import('@views/patienttreatment/applylist/ApplyList.vue'),
        },
        {
            path: "/treatment/applydetails",
            name: "住院申请详情2",
            meta: { activeRoute: "/treatment/applylist", navName: "住院申请详情" },
            component: () => import('@views/patienttreatment/applydetails/ApplyDetails.vue'),
        },
        {
            path: "/treatment/patientlist",
            name: "住院患者2",
            meta: { activeRoute: "/treatment/patientlist", navName: "住院患者" },
            component: () => import('@views/patienttreatment/patientlist/PatientList.vue'),
        },
        {
            path: "/treatment/patientdetails",
            name: "住院患者详情2",
            meta: { activeRoute: "/treatment/patientlist", navName: "住院患者详情" },
            component: () => import('@views/patienttreatment/patientdetails/PatientDetails.vue'),
        },
        {
            path: "/treatment/historypatient",
            name: "历史住院患者2",
            meta: { activeRoute: "/treatment/historypatient", navName: "历史住院患者" },
            component: () => import('@views/patienttreatment/historypatientlist/PatientList.vue'),
        },
        {
            path: "/treatment/historypatientdetails",
            name: "历史住院患者详情2",
            meta: { activeRoute: "/treatment/historypatient", navName: "历史住院患者详情" },
            component: () => import('@views/patienttreatment/historypatientdetails/PatientDetails.vue'),
        },
    ]
}

export default patientTreatment     //导出
