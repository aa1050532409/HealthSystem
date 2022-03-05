const vedioChafang = {
  path: '/yuyue',
  name: "查房预约",
  // redirect: '/chafang/todayRounds',
  meta: { navName: "视频查房" },
  component: () => import('@views/docvediochafang/Layout.vue'),
  children: [
    {
      path: '/yuyue',
      name: '查房预约',
      meta: { activeRoute: "/yuyue", navName: "查房预约" },
      component: () => import('@views/docvediochafang/yuyue/yuyue.vue'),
    },
    {
      path: "/yuyue/yuyueDetail",
      name: "患者详情",
      meta: { activeRoute: "/yuyue", navName: "患者详情" },
      component: () => import('@views/docvediochafang/yuyue/yueyueDetail.vue'),
    },
    {
      path: '/zhuyuan',
      name: '住院患者',
      meta: { activeRoute: "/zhuyuan", navName: "住院患者" },
      component: () => import('@views/docvediochafang/zhuyuan/zhuyuan.vue'),
    },
    {
      path: "/zhuyuan/patientDetail",
      name: "患者详情",
      meta: { activeRoute: "/zhuyuan", navName: "患者详情" },
      component: () => import('@views/docvediochafang/zhuyuan/patientDetail.vue'),
    }
  ]
}

export default vedioChafang     //导出