import request from '@/utils/request' // 封装的axios请求

// 校验接口
export function checkJobName(data) {
  // console.log(data)
  // 校验职务名称是否重复
  return request({
    url: '/apiweb/api/management/checkJobName',
    method: 'post',
    data
  })
}

export function checkLevName(data) {
  // 校验岗位级别名称是否重复
  return request({
    url: '/apiweb/api/level/checkLevelName',
    method: 'post',
    data
  })
}

export function checkLevSerial(data) {
  // 校验岗位级别编号是否重复
  return request({
    url: '/apiweb/api/level/checkLevelNum',
    method: 'post',
    data
  })
}

// 1. 职务管理接口
export function getJobTree() {
  // 获取职务树形的数据
  return request({
    url: '/apiweb/api/management/post/',
    method: 'get'
  })
}

export function saveJobAdd(data) {
  console.log(data)
  // 新增职务
  return request({
    url: '/apiweb/api/management/postForm',
    method: 'post',
    data
  })
}

export function getJobDetail(query) {
  // 根据id 获取单条职务详情
  return request({
    url: '/apiweb/api/management/postInfo/' + query.id + '/',
    method: 'get'
  })
}

export function jobUpdate(data) {
  // console.log(data)
  // 保存并更新职务
  return request({
    url: '/apiweb/api/management/postForm',
    method: 'post',
    data
  })
}

export function jobDel(query) {
  // console.log(query)
  // 根据id 删除单条职务数据
  return request({
    url: '/apiweb/api/management/postInfo/' + query.id + '/',
    method: 'delete'
  })
}

// 3. 人员管理接口
export function getParList(id, keyword, current, size) {
  // 根据职务id来查询当前职务下所属人员列表
  return request({
    // url: '/apiweb/api/management/postUser/' + id + '/', // 这里是原来接口
    url: '/apiweb/api/management/postUser',
    method: 'get',
    params: {
      id,
      keyword,
      current,
      size
    }
  })
}

export function delParList(pid, ids) {
  const data = {}
  data.pid = pid
  data.ids = ids
  // 根据id来删除当前选中的职务所属人员 Pid : 当前职务的id Cids: 要删除的该职务下的所属人员id集合，以','隔开
  return request({
    // url: '/apiweb/api/management/delpostUser/',
    // url: '/apiweb/api/management/delpostUser', // 原来接口
    url: '/apiweb/api/management/delpostUser/',
    method: 'post',
    data
  })
}

export function getpersonSlist(id, keyword) {
  // 根据当前职务id来获取要新增的人员列表（根据当前职务id来查询除了当前职务下人员的其他人员）
  return request({
    // url: '/apiweb/api/management/postChose/' + id + '/', // 原来接口
    url: '/apiweb/api/management/postChose/',
    method: 'get',
    params: {
      id,
      keyword
    }
  })
}

export function saveAddPer(pid, ids) {
  // 根据职务id 将新增的人员添加到当前职务下
  const data = {}
  data.pid = pid
  data.ids = ids
  return request({
    // url: '/apiweb/api/management/addpostUser', // 原来接口
    url: '/apiweb/api/management/addpostUser/',
    method: 'post',
    data
  })
}

export function getEmpDetail(pid, id) {
  // 根据id查询单条人员详细信息
  return request({
    url: '/apiweb/api/management/PostNameInfo/',
    method: 'get',
    params: {
      pid,
      id
    }
  })
}

// 3. 岗位级别接口
export function getLeveList() {
  // 获取岗位级别下拉列表
  return request({
    url: '/apiweb/api/management/jobLevelCombo',
    method: 'get'
  })
}

export function getLeves(KeyWord) {
  // 获取岗位级别table数据
  return request({
    url: '/apiweb/api/level/level/',
    method: 'get',
    params: {
      KeyWord
    }
  })
}

export function getLeveDetail(id) {
  // 根据id 获取单条岗位级别详情
  return request({
    url: '/apiweb/api/level/levelInfo/' + id + '/',
    method: 'get'
  })
}

export function saveLevel(data) {
  // 新增岗位级别
  return request({
    url: '/apiweb/api/level/levelForm',
    method: 'post',
    data
  })
}

export function updateLevel(data) {
  // 新增岗位级别
  return request({
    url: '/apiweb/api/level/levelForm',
    method: 'post',
    data
  })
}

export function delLevel(id) {
  // 根据id 删除单条岗位级别
  return request({
    url: '/apiweb/api/level/levelDel/' + id + '/',
    method: 'delete'
  })
}
