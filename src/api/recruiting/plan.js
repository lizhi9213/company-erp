import request from '@/utils/request'

/**
 * 获取编号列表
 * @param {string} query
 */
export function getNumberList(query) {
  const params = {
    query
  }
  return request({
    url: '/apiweb/api/recrutiment/numbers',
    method: 'get',
    params
  })
}

/**
 * 获取计划列表
 * @param {Object} params 搜索条件
 */
export function getPlanList(params) {
  return request({
    url: '/apiweb/api/recrutiment/plan',
    method: 'get',
    params
  })
}

/**
 * 获取一个新的编号
 */
export function getNewNumber() {
  return request({
    url: '/apiweb/api/recrutiment/newnumber',
    method: 'get'
  })
}

/**
 * 添加 / 更新 计划
 * @param {Object} data 保存的数据
 */
export function savePlan(data) {
  return request({
    url: '/apiweb/api/recrutiment/plan',
    method: 'post',
    data
  })
}

/**
 * 获取单个计划详情
 * @param {Int} id 计划Id
 */
export function getPlan(id) {
  return request({
    url: '/apiweb/api/recrutiment/plan/' + id
  })
}

/**
 * 获取单个计划详情
 * @param {Int} id 计划Id
 */
export function getPlanByUid(id) {
  return request({
    url: '/apiweb/api/recrutiment/planu/' + id
  })
}

/**
 * 更新计划
 * @param {Object} data 数据
 * @param {Int} id id
 */
export function updatePlan(data, id) {
  return request({
    url: '/apiweb/api/recrutiment/plan/' + id,
    method: 'put',
    data
  })
}

/**
 * 删除计划
 * @param {Int} id Id
 */
export function deletePlan(id) {
  return request({
    url: '/apiweb/api/recrutiment/plan/' + id,
    method: 'delete'
  })
}
