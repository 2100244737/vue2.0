import Vue from 'vue'
import Router from 'vue-router'
//  首页
import index from '@/pages/index'
//  登录页
import login from '../pages/loginindex'
//  home页
import home from "@/pages/home";

// +--------------------------------------------------------
//路径查询
import pathQuery from '../pages/queryPath/pathQuery'
// 系统管理
// 系统管理-  角色管理
import roleManagement from "@/pages/system/roleManagement"
// 系统管理- 用户管理
import userManagement from "@/pages/system/userManagement"
// 系统管理 - 查询日志
import logQuery from "../pages/system/logQuery";

// 设备管理
// 设备备案
import equipment from "../pages/deviceManager/equipment";
// 设备部署
import equipmentDeploy from "../pages/deviceManager/equipmentDeploy";
// 测试
import dome from '../pages/dome'
Vue.use(Router);

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const routers = new Router({
  routes: [

    {path: '/', redirect: '/login', hidden: true},
      {path: '/login', name: 'login', component: login, hidden: true},
    //   {path: '/', redirect: '/demo', hidden: true},
    //   {path: '/demo', name: 'demo', component: dome, hidden: true},
    {
      path: '/index', name: 'index', meta: {title: '首页'}, component: index,
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
        {path: 'logQuery', name: 'logQuery', meta: {title: '查询日志'}, component: logQuery,},
      ]
    },
    {
      path: '/queryPath', name: 'queryPath', meta: {title: '路径查询'},
      component: index,
      children: [{
        path: 'pathQuery', name: 'pathQuery', meta: {title: '查询路径'}, component: pathQuery,
      }]
    },
    {
      path: '/deviceManager', name: 'deviceManager', meta: {title: '设备管理'},
      component: index,
      children: [
        {path: 'equipment', name: 'equipment', meta: {title: '设备备案'}, component: equipment,},
        {path: 'equipmentDeploy', name: 'equipmentDeploy', meta: {title: '设备部署'}, component: equipmentDeploy,},
      ]
    }
  ]
})
export default routers
