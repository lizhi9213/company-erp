import request from '@/utils/request' // 封装的axios请求

export function getFilterCard() {
  // 获取顶部筛选卡片数据
  return request({
    url: '/apiweb/api/user/getFilter/',
    method: 'get'
  })
}

export function getOrgList() {
  // 获取组织架构数据
  return request({
    url: '/apiweb/api/structure/GetStructure/',
    method: 'get'
  })
}

export function getTables(query) {
  // 获取表格tbody数据 query参数如下：
  // pageSize每页多少条数据 / current当前页码 / classifica顶部卡片统计当前选择的id / depid当前选择的部门
  // sorting: 1工号降序/2工号升序/3按最早入职排序/4按最近入职排序/5按最近入职排序（传数字给后台）
  return request({
    url: '/apiweb/api/user/getRosterTable/',
    method: 'get',
    params: query
  })
}

export function getAllThead() {
  // modal框选择表头，读取全部的表头数据，已选择和未选择的表头需要做标记
  return request({
    url: '/apiweb/api/user/GetHead/',
    method: 'get'
  })
}

export function getUserSimpleInfo(query) {
  // 获取用户简单信息
  return request({
    url: '/apiweb/api/user/LookUser/',
    method: 'get',
    params: query
  })
}

export function updateUserSimpleData(data) {
  // 保存用户简单信息
  return request({
    url: '/apiweb/api/user/UpdateUser/',
    method: 'post',
    data
  })
}

export function delUserRoster(data) {
  // 删除用户
  return request({
    url: '/apiweb/api/user/BatchDelete/',
    method: 'post',
    data
  })
}

export function updateUserStatus(data) {
  // 修改用户简单信息
  return request({
    url: '/apiweb/api/user/BatchUpdate/',
    method: 'post',
    data
  })
}
export function resetPasswordUser(data) {
  // 重置密码
  return request({
    url: '/apiweb/api/user/SetUserPwd/',
    method: 'post',
    data
  })
}

export function phoneCheck(UserPhone, id) {
  // console.log(data)
  // 验证手机号是否重复
  const data = {}
  data.UserPhone = UserPhone
  data.id = id
  return request({
    url: '/apiweb/api/user/RepeatPhone/',
    method: 'post',
    data
  })
}
