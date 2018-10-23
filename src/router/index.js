import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/authredirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: {
          title: '首页',
          icon: 'home',
          noCache: true
        }
      }
    ]
  },
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     component: () =>
  //       import('@/views/svg-icons/index'),
  //     name: 'icons',
  //     meta: {
  //       title: '图标',
  //       icon: 'icon',
  //       noCache: true
  //     }
  //   }]
  // },
  {
    path: '/hide',
    component: Layout,
    children: [
      {
        path: 'flow_creat/:id',
        component: () => import('@/views/workflow/flow_creat'),
        name: 'flow_creatWorkflow',
        meta: {
          title: '流程模板设计',
          noCache: true
        }
      }
    ],
    hidden: true
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

//  模块表，key与数据库中Component对应
export const componentsMap = {
  Layout: Layout,
  'sysbasis/structure': () => import('@/views/sysbasis/structure'),
  'sysbasis/job': () => import('@/views/sysbasis/job'),
  'sysbasis/role': () => import('@/views/sysbasis/role'),
  'personnel/roster': () => import('@/views/personnel/roster'),
  'personnel/archives': () => import('@/views/personnel/archives'),
  'personnel/relations': () => import('@/views/personnel/relations'),
  'personnel/emp_deatils': () => import('@/views/personnel/emp_deatils'),
  'personnel/employee': () => import('@/views/personnel/employee'),
  'recruiting/plan': () => import('@/views/recruiting/plan'),
  'recruiting/resume': () => import('@/views/recruiting/resume'),
  'workflow/flow_tmp': () => import('@/views/workflow/flow_tmp'),
  'workflow/apply_new': () => import('@/views/workflow/apply_new'),
  'workflow/apply_mine': () => import('@/views/workflow/apply_mine'),
  'personnel/advanced_search': () =>
    import('@/views/personnel/advanced_search'),
  'digitaldictionary/d_dictionary': () =>
    import('@/views/digitaldictionary/d_dictionary')
}
