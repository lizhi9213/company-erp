import request from '@/utils/request'
export function saveDealLink(data) {
  return request({
    url: '/apiweb/api/hrresumecomm/link',
    data,
    method: 'post'
  })
}

/**
 * 保存呼叫记录
 * @param {Object} data 保存的数据
 */
export function addDial(data) {
  return request({
    url: '/apiweb/api/hrresumecomm/dial',
    data,
    method: 'post'
  })
}
