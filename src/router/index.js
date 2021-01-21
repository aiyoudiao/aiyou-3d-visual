import Vue from 'vue'
import Router from 'vue-router'
import MachineRoom from '@/views/MachineRoom/MachineRoom'

// const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [

  {
    path: '',
    redirect: '/machine-room'
  },
  {
    path: '/',
    redirect: '/machine-room',
    name: 'home',
    hidden: false
  },
  {
    path: '/machine-room',
    component: MachineRoom,
    name: 'MachineRoom',
    meta: {
      title: '3D可视化机房'
    },
    hidden: false
  },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: false },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: false },
  {
    path: '/errorLog',
    component: () => import('@/views/errorLog/errorLog'),
    meta: { title: 'Errorlog', icon: 'errorLog' }
  },
  // 报表
  // {
  //   path: '/dashboard',
  //   component: Layout,
  //   meta: { title: 'dashboard', icon: 'dashboard' },
  //   children: [
  //     {
  //       path: 'dashboard',
  //       name: 'dashboard',
  //       component: () => import('@/views/dashboard/dashboard'),
  //       meta: { title: 'dashboard', icon: 'dashboard' }
  //     }
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
