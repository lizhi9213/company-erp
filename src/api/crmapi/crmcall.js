import request from '@/utils/request'

export function generateAccount(data) {
  return request({
    url: '/apiweb/api/crmapi/generateAccount',
    method: 'post',
    data
  })
}
