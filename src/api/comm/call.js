import request from '@/utils/request'

/**
 * 语音接口 -- 添加分机
 * @param {Number} code code  绑定用户id
 * @param {Number} display display  显示名/用户名
 * @param {Number} comid comid  公司id
 */
export function agentAdd(data) {
  return request({
    url: '/apiwss/user/adduser',
    method: 'POST',
    data
  })
}
