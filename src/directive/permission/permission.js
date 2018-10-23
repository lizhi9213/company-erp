import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const {
      value
    } = binding
    const permission = store.getters && store.getters.permission
    if (value && value instanceof Object && !!value.page && !!value.name) {
      const permissionRoles = value
      let hasPermission = false
      if (permission[permissionRoles.page]) {
        hasPermission = permission[permissionRoles.page].some(name => {
          return permissionRoles.name === name
        })
      }
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`规则定义错误，ex:{page:$options.name,name:'first'}`)
    }
  }
}
