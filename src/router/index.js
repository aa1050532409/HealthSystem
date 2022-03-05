import Vue from "vue";
import VueRouter from "vue-router";
import { Message } from 'element-ui';
import patientDiag from './patientDiag.js'
import patientTreatment from './patientTreatment.js'
import instantInfo from './instantInfo.js'
import operationManage from './operationManage.js'
import followManage from './followManage.js'
import groupConsultation from './groupConsultation.js'
import patientInfo from './patientInfo.js'
import videoConsultation from './videoConsultation.js'
import medicalInfo from './medicalInfo.js'
import personalInfo from './personalInfo.js'
import zhuanzhen from './zhuanzhen.js'
// import test1 from './test1.js'
// import test2 from './test2.js'
import orgManage from './orgManage.js'
import expertGroupManage from './expertGroupManage.js'
import chafangManage from './chafang.js'
import vedioChafang from './docVedioChafang'


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    meta: { activeRoute: "/", navName: "index" },
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    meta: { activeRoute: "/login", navName: "login" },
    component: () => import('../views/Login.vue')
  },
  {
    path: "/video",
    name: "Meeting",
    meta: { activeRoute: "/video", navName: "video" },
    component: () => import('../views/videomeeting/videomeeting.vue')
  },
  {
    path: "/index",
    redirect: "/recommend",
    name: "Layout",
    component: () => import('../views/layout/Layout.vue'),
    children: [
      {
        path: '/recommend',
        name: '更多推荐',
        meta: { activeRoute: "/recommend", navName: "更多推荐" },
        component: () => import('../views/more/More.vue')
      },
      personalInfo,
      // 医疗信息
      medicalInfo,
      // 患者诊断
      patientDiag,
      // 患者治疗
      patientTreatment,
      // 查房管理
      operationManage,
      followManage,
      groupConsultation,
      patientInfo,
      videoConsultation,
      zhuanzhen,
      orgManage,
      expertGroupManage,
      chafangManage,
      vedioChafang,
      // {
      //   path: '/organizationmanage',
      //   redirect: '/organizationmanage/orgmanage',
      //   name: '机构管理',
      //   meta: { activeRoute: "/organizationmanage", navName: "/" },
      //   component: () => import('../views/orgmanage/Layout.vue'),
      //   children: [
      //     {
      //       path: "/organizationmanage/orgdetails",
      //       name: "机构管理_医疗机构详情",
      //       meta: { activeRoute: "/organizationmanage/orgdetails", navName: "医疗机构详情" },
      //       component: () => import('../views/orgmanage/Details.vue'),
      //     },
      //     {
      //       path: "/organizationmanage/orgmanage",
      //       name: "机构管理_机构管理",
      //       meta: { activeRoute: "/organizationmanage/orgmanage", navName: "机构管理" },
      //       component: () => import('../views/orgmanage/OrgManage.vue'),
      //     },
      //   ]
      // },
      // {
      //   path: '/expertmanage',
      //   redirect: '/expertmanage/expmanage',
      //   name: '专家管理',
      //   meta: { activeRoute: "/expertmanage", navName: "/" },
      //   component: () => import('../views/expertmanage/Layout.vue'),
      //   children: [
      //     {
      //       path: "/expertmanage/details",
      //       name: "专家管理_专家团队详情",
      //       meta: { activeRoute: "/expertmanage/details", navName: "专家团队详情" },
      //       component: () => import('../views/expertmanage/Details.vue'),
      //     },
      //     {
      //       path: "/expertmanage/expmanage",
      //       name: "专家管理_专家管理",
      //       meta: { activeRoute: "/expertmanage/expmanage", navName: "专家管理" },
      //       component: () => import('../views/expertmanage/ExpManage.vue'),
      //     },
      //   ]
      // },
      // 即时信息模块
      instantInfo,
      {
        path: '/*',
        name: '未知页面',
        meta: { activeRoute: "/*", navName: "未知页面" },
        component: () => import('@views/404/404.vue')
      },
    ]
  },
];

const router = new VueRouter({
  mode: 'hash',
  routes
});


let freePages = ['/login', '/video']
router.beforeEach((to, from, next) => {
  // if (to.path != '/login') {
  if (freePages.indexOf(to.path) == -1) {
    if (localStorage.getItem("token")) {
      next()
    } else {
      Message.error('您尚未登录！');
      next('/login')
    }
  } else {
    next()
  }

})


// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router;
