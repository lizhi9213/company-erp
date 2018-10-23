import request from '@/utils/request'
/**
 * 获取简历列表
 * @param {Object} params 条件
 */
export function getInvitationList(params) {
  return request({
    url: '/apiweb/api/hrresumecomm/invitation',
    params
  })
}

/**
 * 标记结果
 * @param {Object} data 数据
 */
export function saveInvitation(data) {
  return request({
    url: '/apiweb/api/hrresumecomm/invitation',
    data,
    method: 'put'
  })
}
