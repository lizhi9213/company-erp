import request from '@/utils/request' // 封装的axios请求

// 校验接口
export function checkRoleName(data) {
  // console.log(data)
  // 校验职务名称是否重复
  return request({
    url: '/apiweb/api/role/checkRoleName',
    method: 'post',
    data
  })
}

// 1. 角色管理
export function getRole() {
  // 获取角色列表数据
  return request({
    url: '/apiweb/api/role/role/',
    method: 'get'
  })
}

export function addTRole(data) {
  // 新增角色
  return request({
    url: '/apiweb/api/role/roleForm',
    method: 'post',
    data
  })
}

export function searchRole(id) {
  // 根据id查询单角色数据
  return request({
    url: '/apiweb/api/role/roleInfo/' + id + '/',
    method: 'get'
  })
}

export function updateTRole(data) {
  // 更新角色信息
  return request({
    url: '/apiweb/api/role/roleForm',
    method: 'post',
    data
  })
}

export function delTRole(id) {
  // 根据id来删单个角色
  return request({
    url: '/apiweb/api/role/roleDel/' + id + '/',
    method: 'delete'
  })
}

export function getRolePower(query) {
  // 获取单个角色权限列表数据
  return request({
    url: '/apiweb/api/role/roleMenu/' + query.id + '/',
    method: 'get'
  })
}

export function updateRpower(data, id) {
  // 保存更新角色权限
  return request({
    url: '/apiweb/api/role/rolePower/' + id + '/',
    method: 'post',
    data
  })
}

// 2. 人员管理
export function getRolePList(id, keyword, current, size) {
  // 根据角色id来查询当前角色下的人员列表
  return request({
    // url: '/apiweb/api/role/roleUser/' + id + '/', // 原来接口
    url: '/apiweb/api/role/roleUser/',
    method: 'get',
    params: {
      id,
      keyword,
      current,
      size
    }
  })
}

export function delRolePList(pid, ids) {
  // 根据id来删除当前选中的角色所属人员 Pid : 当前角色的id Cids: 要删除的该角色下的所属人员id集合，以','隔开
  const data = {}
  data.pid = pid
  data.ids = ids
  return request({
    // url: '/apiweb/api/role/delroleUser', // 原来接口
    url: '/apiweb/api/role/delroleUser/',
    method: 'post',
    data
  })
}

export function getRoleOPlist(id, keyword) {
  // 根据角色id来获取新增人员列表
  return request({
    // url: '/apiweb/api/role/roleChose/' + id + '/', // 原来接口
    url: '/apiweb/api/role/roleChose/',
    method: 'get',
    params: {
      id,
      keyword
    }
  })
}

export function saveRoleAddP(pid, ids) {
  const data = {}
  data.pid = pid
  data.ids = ids
  // 根据角色id 将新增的人员添加到当前角色下
  return request({
    // url: '/apiweb/api/role/addroleUser', // 原来接口
    url: '/apiweb/api/role/addroleUser/',
    method: 'post',
    data
  })
}

export function getEmpDetail(pid, id) {
  // 根据id查询单条人员详细信息
  return request({
    url: '/apiweb/api/role/RoleNameInfo/',
    method: 'get',
    params: {
      pid,
      id
    }
  })
}
