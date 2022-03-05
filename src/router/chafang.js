const chafangManage = {
  path: '/todayRounds',
  name: "今日查房",
  // redirect: '/chafang/todayRounds',
  meta: { navName: "查房管理" },
  component: () => import('@views/chafang/Layout.vue'),
  children: [
    {
      path: '/todayRounds',
      name: '今日查房',
      meta: { activeRoute: "/todayRounds", navName: "今日查房" },
      component: () => import('@views/chafang/todayRounds/todayRounds.vue'),
    },
    {
      path: "/todayRounds/chafangDetail",
      name: "患者详情",
      meta: { activeRoute: "/todayRounds", navName: "患者详情" },
      component: () => import('@views/chafang/todayRounds/chafangDetail.vue'),
    },
    {
      path: '/historyRounds',
      name: '历史查房',
      meta: { activeRoute: "/historyRounds", navName: "历史查房" },
      component: () => import('@views/chafang/historyRounds/historyRounds.vue'),
    },
    {
      path: "/historyRounds/chafangDetail",
      name: "患者详情",
      meta: { activeRoute: "/historyRounds", navName: "患者详情" },
      component: () => import('@views/chafang/historyRounds/chafangDetail.vue'),
    }
  ]
}

export default chafangManage     //导出
