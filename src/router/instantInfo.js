const instantInfo = {
    path: '/instantinfo',
    redirect: '/patientdiag/todayconsultation',
    name: '即时信息',
    meta: { activeRoute: "/instantinfo", navName: "即时信息" },
    component: () => import('../views/instantinfo/Layout.vue'),
    children: [
        {
            path: "/instantinfo/message",
            name: "消息会话",
            meta: { activeRoute: "/instantinfo/message", navName: "消息会话" },
            component: () => import('../views/instantinfo/Message.vue'),
        },
        {
            path: "/instantinfo/groupconsultation",
            name: "会诊消息",
            meta: { activeRoute: "/instantinfo/groupconsultation", navName: "会诊消息" },
            component: () => import('../views/instantinfo/GroupConsolution.vue'),
        }
    ]
}

export default instantInfo     //导出