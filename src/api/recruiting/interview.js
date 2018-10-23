import request from '@/utils/request'
/**
 * 获取简历列表
 * @param {Object} params 条件
 */
export function getInterviewList(params) {
  return request({
    url: '/apiweb/api/hrresumecomm/interview',
    params
  })
}

/**
 * 标记结果
 * @param {Object} data 数据
 */
export function saveInterview(data) {
  return request({
    url: '/apiweb/api/hrresumecomm/interview',
    data,
    method: 'put'
  })
}
