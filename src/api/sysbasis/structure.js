import request from '@/utils/request'

export function getTree() {
  // 获取组织架构右侧树形菜单数据
  return request({
    url: '/apiweb/api/structure/GetStructure/',

    method: 'get'
  })
}
export function searchNode(data) {
  // 点击查询单条组织数据
  return request({
    url: '/apiweb/api/structure/DisplayPort/',
    method: 'get',
    params: data
  })
}

export function orgCheck(pid, id, name) {
  // console.log(data)
  // 验证部门名称是否重复
  const data = {}
  data.name = name
  data.pid = pid
  data.id = id
  return request({
    url: '/apiweb/api/structure/RepeatName/',
    method: 'post',
    data
  })
}

// export function getParentList() {
//   // console.log(data)
//   // 获取上级部门数据
//   return request({
//     url: '/apiweb/api/structure/GetFather/',
//     method: 'get'
//   })
// }

export function getOrgChart() {
  // console.log(data)
  // 获取组织架构图数据
  return request({
    url: '/apiweb/api/structure/GetFigure/',
    method: 'get'
  })
}

export function organiDel(data) {
  // console.log(data)
  // 根据id来删除单条数据
  return request({
    url: '/apiweb/api/structure/DelPort/',
    method: 'delete',
    params: data
  })
}

export function organiUpdate(data) {
  console.log(data)
  // 更新单条组织架构的数据
  return request({
    url: '/apiweb/api/structure/UpdatePort/',
    method: 'post',
    data
  })
}
export function saveStruc(data) {
  // 新增组织
  return request({
    url: '/apiweb/api/structure/InsertStructure/',
    method: 'post',
    data
  })
}

// 人员管理接口
export function getPersonnel(id, keyword, current, size) {
  // 根据传入的id来获取当前组织所属人员
  return request({
    url: '/apiweb/api/structure/PostUser/',
    method: 'get',
    params: {
      id,
      keyword,
      current,
      size
    }
  })
}

export function personelList(id, keyword) {
  // 根据传入的id来获取当前新增人员列表
  return request({
    url: '/apiweb/api/structure/InsertUserChose/',
    method: 'get',
    params: {
      id,
      keyword
    }
  })
}

export function savePersonnel(pid, ids) {
  // 根据传入部门pid将选择的要新增的人员保存
  const data = {}
  data.pid = pid
  data.ids = ids
  return request({
    url: '/apiweb/api/structure/AddUserList/',
    method: 'post',
    data
  })
}

export function delPersonnel(pid, ids) {
  // 根据传入的父级pid,和要删除的子集id集合ids来批量删除或者单个删除
  const data = {}
  data.pid = pid
  data.ids = ids
  return request({
    url: '/apiweb/api/structure/DeleteUser/',
    method: 'post',
    data
  })
}

export function getEmpDetail(pid, id) {
  // 根据传入的id来获取当前人员详情
  return request({
    url: '/apiweb/api/structure/GetNameInfo/',
    method: 'get',
    params: {
      pid,
      id
    }
  })
}

export function getDepartCombo() {
  // 获取组织架构数据
  return request({
    url: '/apiweb/api/structure/getComBox/',
    method: 'get'
  })
}
