import request from '@/utils/request'
/**
 * 获取简历列表
 * @param {Object} params 条件
 */
export function getNoticeList(params) {
  return request({
    url: '/apiweb/api/hrresumecomm/notice',
    params
  })
}

/**
 * 标记结果
 * @param {Object} data 数据
 */
export function saveNotice(data) {
  return request({
    url: '/apiweb/api/hrresumecomm/notice',
    data,
    method: 'put'
  })
}
