import request from '@/utils/request'

export function getCaller(params) {
  return request({
    url: '/apiwss/api/system/getcaller',
    params
  })
}

export function setCaller(data) {
  return request({
    url: '/apiwss/api/system/updatecaller',
    data,
    method: 'POST'
  })
}
