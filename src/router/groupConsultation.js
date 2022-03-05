const groupConsultation = {
  path: '/groupconsultation',
  redirect: "/groupconsultation/todayconsultation",
  meta: { activeRoute: "/groupconsultation", navName: "普通会诊" },
  name: '普通会诊3',
  component: () => import('../views/groupconsultation/Layout.vue'),
  children: [
    {
      path: "/groupconsultation/todayconsultation",
      name: "今日患者3",
      meta: { activeRoute: "/groupconsultation/todayconsultation", navName: "当前会诊" },
      component: () => import('../views/groupconsultation/patientList/PatientList.vue'),
    },
    {
      path: "/groupconsultation/consulationdetails",
      name: "会诊详情3",
      meta: { activeRoute: "/groupconsultation/todayconsultation", navName: "会诊详情" },
      component: () => import('../views/groupconsultation/consulationDetails/ConsulationDetails.vue'),
    },
    {
      path: "/groupconsultation/historyconsultation",
      name: "历史患者3",
      meta: { activeRoute: "/groupconsultation/historyconsultation", navName: "历史患者" },
      component: () => import('../views/groupconsultation/historyPatientList/History.vue'),
    },
    {
      path: "/groupconsultation/hisconsulationdetails",
      name: "会诊详情4",
      meta: { activeRoute: "/groupconsultation/historyconsultation", navName: "会诊详情" },
      component: () => import('../views/groupconsultation/hisConsulationDetails/ConsulationDetails.vue'),
    },
  ]
}

export default groupConsultation     //导出