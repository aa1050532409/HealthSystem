

const patientInfo = {
    path: '/patientinfo',
    name: '患者信息',
    redirect: '/patientinfo/mypatient',
    meta: { activeRoute: "/patientinfo", navName: "患者信息" },
    component: () => import('../views/patientdiag/Layout.vue'),
    children: [
        {
            path: "/patientinfo/mypatient",
            name: "患者信息_我的患者",
            meta: { activeRoute: "/patientinfo/mypatient", navName: "我的患者" },
            component: () => import('../views/patientInfo/patientList/PatientList.vue'),
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

export default patientInfo     //导出
