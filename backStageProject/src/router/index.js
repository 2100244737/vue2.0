import Vue from 'vue'
import Router from 'vue-router'
//  首页
import index from '@/pages/index'
//  登录页
import login from '../pages/loginindex'
//  home页
import home from "@/pages/home";

// +--------------------------------------------------------
// 系统管理
// 系统管理-  角色管理
import roleManagement from "@/pages/system/roleManagement"
// 系统管理- 用户管理
import userManagement from "@/pages/system/userManagement"
import dome from "../pages/dome";
Vue.use(Router);

const routers = new Router({
  routes: [

    {path: '/', redirect: '/login', hidden: true},
      {path: '/login', name: 'login', component: login, hidden: true},
    {
      path: '/index', name: '',  meta: {title: '首页'}, component: index,
      children: [
        {path: '/index', name: 'index', meta: {
          title: '首页',
          url: '/index'
          }, component: home,},
      ]
    },
    {
      path: '/system', name: 'system', meta: {title: '系统管理'}, redirect: '/system/roleManagement', component: index,
      children: [
        {path: 'roleManagement', name: 'roleManagement', meta: {title: '角色管理'}, component: roleManagement,},
        {path: 'userManagement', name: 'userManagement', meta: {title: '用户管理'}, component: userManagement,},
      ]
    },
      {
          path: '/apply',
          name: 'apply',
          meta: {title: '应用管理'},
          component: index,
          children: [
              {path: 'apply1', name: 'apply1', meta: {title: '服务管理查询'}, component: () => import('../pages/apply/apply1'),},
              {path: 'apply2', name: 'apply2', meta: {title: 'APP应用管理'}, component: () => import('../pages/apply/apply2')},
          ]
      },
      {
          path: '/dataAdministrator',
          name: 'dataAdministrator',
          meta: {title: '数据管理'},
          component: index,
          children: [
              {path: 'liaisons', name: 'liaisons', meta: {title: '接口'}, component: () => import('../pages/dataAdministrator/liaisons.vue'),}
          ]
      }
  ]
})
export default routers
