import {
  constantRouterMap,
  componentsMap
} from '@/router'

import request from '@/utils/request'

/**
 * parseRouters 格式化路由表
 * @param params 路由数组
 */
function parseRouters(params) {
  const routers = []
  if (params) {
    params.map(item => {
      if (item.children) {
        item.children = parseRouters(item.children)
      }
      if (item.Component !== undefined) {
        item.component = componentsMap[item.Component]
      }
      routers.push(item)
    })
  }
  return routers
}
const asyncRouterMap = [{
  path: '*',
  redirect: '/404',
  hidden: 1
}]
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    permission: {} // 权限列表
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_PERMISSION: (state, permission) => {
      state.permission = permission
    }
  },
  actions: {
    GenerateRoutes({
      commit
    }, data) {
      return new Promise(resolve => {
        request({
          url: '/apiweb/api/login/getRouters'
        }).then((result) => {
          commit('SET_ROUTERS', parseRouters(result.data.concat(asyncRouterMap)))
          console.log(result.data)
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    },
    GeneratePermission({
      commit
    }) {
      return new Promise(resolve => {
        request({
          url: '/apiweb/api/login/getButtons'
        }).then(resuslt => {
          commit('SET_PERMISSION', resuslt.data)
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }
  }
}

export default permission
