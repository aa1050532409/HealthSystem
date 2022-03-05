

const patientDiag = {
    path: '/patientdiag',
    redirect: '/patientdiag/todaydiagnosis',
    name: '患者诊断',
    meta: { activeRoute: "/patientdiag", navName: "患者诊断" },
    component: () => import('../views/patientdiag/Layout.vue'),
    children: [
        {
            path: "/patientdiag/details",
            name: "患者详情",
            meta: { activeRoute: "/patientdiag/todaydiagnosis", navName: "患者详情" },
            component: () => import('../views/patientdiag/PatientDetails.vue'),
        },
        {
            path: "/patientdiag/todaydiagnosis",
            name: "当前患者",
            meta: { activeRoute: "/patientdiag/todaydiagnosis", navName: "今日待诊" },
            component: () => import('../views/patientdiag/PatientDiag.vue'),
        }, {
            path: "/patientdiag/historydiagnosis",
            name: "历史就诊",
            meta: { activeRoute: "/patientdiag/historydiagnosis", navName: "历史就诊" },
            component: () => import('../views/patientdiag/HistoryPatient.vue'),
        }, {
            path: "/patientdiag/historydetails",
            name: "历史患者详情",
            meta: { activeRoute: "/patientdiag/historydiagnosis", navName: "历史患者详情" },
            component: () => import('../views/patientdiag/HistoryPatientDetails.vue'),
        },
        {
            path: "/patientdiag/discussion",
            name: "患者诊断_病情探讨",
            meta: { activeRoute: "/patientdiag/discussion", navName: "病情探讨" },
            component: () => import('../views/patientdiag/discussion/list/List.vue'),
        },
        {
            path: "/patientdiag/discussion/details",
            name: "患者诊断_病情探讨_患者病情",
            meta: { activeRoute: "/patientdiag/discussion", navName: "病情探讨" },
            component: () => import('../views/patientdiag/discussion/details/Details.vue'),
        },
        {
            path: "/diagApply",
            name: "患者诊断_就诊申请",
            meta: { activeRoute: "/diagApply", navName: "就诊申请" },
            component: () => import('../views/patientdiag/PatientApply.vue'),
        },
        {
            path: "/diagApply/details",
            name: "患者诊断_就诊申请详情",
            meta: { activeRoute: "/diagApply", navName: "就诊申请详情" },
            component: () => import('../views/patientdiag/PatientApplyDetails.vue'),
        },
    ]
}

export default patientDiag     //导出
