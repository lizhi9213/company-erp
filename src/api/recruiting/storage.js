import request from '@/utils/request'

/**
 * 入库 / 快速入库
 * @param {Object} data 表单
 */
export function storage(data) {
  return request({
    url: '/apiweb/api/hrresumecomm/resume',
    data,
    method: 'post'
  })
}

/**
 * 获取简历库列表
 * @param {Object} params 检索条件
 */
export function getResumeList(params) {
  return request({
    url: '/apiweb/api/hrresumecomm/resume',
    params,
    method: 'get'
  })
}

/**
 * 获取简历
 * @param {Number} id Id
 */
export function getResume(id) {
  return request({
    url: '/apiweb/api/hrresumecomm/resume/' + id
  })
}

/**
 *
 * @param {Number} id Id
 * @param {Object} data 更新数据
 */
export function updateResume(id, data) {
  return request({
    url: '/apiweb/api/hrresumecomm/resume/' + id,
    data,
    method: 'put'
  })
}

/**
 * 删除单个简历
 * @param {Number} id Id
 */
export function deleteResume(id) {
  return request({
    url: '/apiweb/api/hrresumecomm/resume/' + id,
    method: 'delete'
  })
}

/**
 * 删除单个简历
 * @param {Array} ids Ids
 */
export function deleteResumes(ids) {
  return request({
    url: '/apiweb/api/hrresumecomm/resume',
    method: 'delete',
    data: {
      ids
    }
  })
}

/**
 * 导入简历
 * @param {Array} data 数组
 */
export function importRe(data) {
  return request({
    url: '/apiweb/api/hrresumecomm/import',
    data,
    method: 'post'
  })
}
