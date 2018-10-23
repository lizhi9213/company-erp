import request from '@/utils/request'

/**
 * 获取带部门的用户树
 * @param {boolean} depart 部门是否可选 default=false
 */
export function getUserTreeByDepart(depart = false) {
  const params = {
    depart
  }
  return request({
    url: '/apiweb/api/user/getUserTreeByDepart',
    method: 'GET',
    params
  })
}

/**
 * 获取职务树
 */
export function getJobTree() {
  return request({
    url: '/apiweb/api/management/getComBox/',
    method: 'get'
  })
}

export function getDepartTree() {
  // 获取组织架构数据
  return request({
    url: '/apiweb/api/structure/getComBox/',
    method: 'get'
  })
}

export function getDutiesTree() {
  // 获取岗位架构数据
  return request({
    url: '/apiweb/api/management/getComBox/',
    method: 'get'
  })
}

/**
 * 获取数据字典树
 * @param {String} id 数据字典guid
 */
export function getDataDictTree(id) {
  return request({
    url: '/apiweb/api/data/comboxtree/',
    method: 'get',
    params: {
      pId: id
    }
  })
}

export function getOfficeTree() {
  return request({
    url: '/apiweb/api/combobox/office'
  })
}
