import request from '@/utils/request'
/**
 * 获取简历列表
 * @param {Object} params 条件
 */
export function getTrainList(params) {
  return request({
    url: '/apiweb/api/hrresumecomm/train',
    params
  })
}

/**
 * 标记结果
 * @param {Object} data 数据
 */
export function saveTrain(data) {
  return request({
    url: '/apiweb/api/hrresumecomm/train',
    data,
    method: 'put'
  })
}
