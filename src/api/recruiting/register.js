import request from '@/utils/request'
/**
 * 获取简历列表
 * @param {Object} params 条件
 */
export function getRegisterList(params) {
  return request({
    url: '/apiweb/api/hrresumecomm/register',
    params
  })
}

/**
 * 标记结果
 * @param {Object} data 数据
 */
export function saveRegister(data) {
  return request({
    url: '/apiweb/api/hrresumecomm/register',
    data,
    method: 'put'
  })
}
