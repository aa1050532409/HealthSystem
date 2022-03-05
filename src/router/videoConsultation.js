const videoconsultation = {
    path: '/videoconsultation',
    redirect: "/groupvedioconsultation/seekconsultation",
    name: '视频会诊',
    meta: { activeRoute: "/groupvedioconsultation", navName: "视频会诊" },
    component: () => import('../views/videoconsultation/Layout.vue'),
    children: [
        {
            path: "/groupvedioconsultation/seekconsultation",
            name: "视频会诊_会诊申请",
            meta: { activeRoute: "/groupvedioconsultation/seekconsultation", navName: "会诊申请" },
            component: () => import('../views/videoconsultation/applyList/PatientList.vue'),
        },
        {
            path: "/videoconsultation/applydetails",
            name: "视频会诊_会诊申请详情",
            meta: { activeRoute: "/groupvedioconsultation/seekconsultation", navName: "会诊申请详情" },
            component: () => import('../views/videoconsultation/applyDetails/ApplyDetails.vue'),
        },
        {
            path: "/groupvedioconsultation/myconsultation",
            name: "视频会诊_我的会诊",
            meta: { activeRoute: "/groupvedioconsultation/myconsultation", navName: "我的会诊" },
            component: () => import('../views/videoconsultation/patientList/PatientList.vue'),
        },
        {
            path: "/videoconsultation/consulationdetails",
            name: "视频会诊_会诊详情",
            meta: { activeRoute: "/groupvedioconsultation/myconsultation", navName: "会诊详情" },
            component: () => import('../views/videoconsultation/videoConsultationDetails/videoConsultationDetails.vue'),
        }, {
            path: "/groupvedioconsultation/historyconsultation",
            name: "视频会诊_历史会诊",
            meta: { activeRoute: "/groupvedioconsultation/historyconsultation", navName: "历史会诊" },
            component: () => import('../views/videoconsultation/historyConsultationList/HistoryConsultationList.vue'),
        },
        {
            path: "/videoconsultation/historyconsultationdetails",
            name: "视频会诊_历史会诊详情",
            meta: { activeRoute: "/groupvedioconsultation/historyconsultation", navName: "历史会诊详情" },
            component: () => import('../views/videoconsultation/hisConsulationDetails/ConsulationDetails.vue'),
        },
    ]
}

export default videoconsultation     //导出