const zhuanzhen = {
    path: '/referralmechanisms',
    name: '转诊管理',
    meta: { activeRoute: "/referralmechanisms", navName: "转诊管理" },
    component: () => import('@views/zhuanzhen/Layout.vue'),
    children: [
        {
            path: "/referralmechanisms/patients",
            name: "转诊管理_我的患者",
            meta: { activeRoute: "/referralmechanisms/patients", navName: "转诊患者" },
            component: () => import('@views/zhuanzhen//patientList/PatientList.vue'),
        },
        {
            path: "/patientinfo/addpatient",
            name: "患者信息_新增患者",
            meta: { activeRoute: "/patientinfo/addpatient", navName: "新增患者" },
            component: () => import('../views/patientInfo/newPatient/PatientList.vue'),
        },
        {
            path: "/patientinfo/patientdetails",
            name: "患者信息_患者详情",
            meta: { activeRoute: "/patientinfo/mypatient", navName: "患者详情" },
            component: () => import('../views/patientInfo/patientDetails/PatientDetails.vue'),
        },
        {
            path: "/patientinfo/newpatientdetails",
            name: "患者信息_新增患者信息",
            meta: { activeRoute: "/patientinfo/addpatient", navName: "新增患者信息" },
            component: () => import('../views/patientInfo/newPatientDetails/PatientDetails.vue'),
        }
    ]
}

export default zhuanzhen     //导出
