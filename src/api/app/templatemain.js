import request from '@/utils/request'

export function getTempListByType(typeid) {
  return request({
    url: '/apiweb/api/templatemain/get',
    params: {
      typeid
    }
  })
}

export function addTemp(data) {
  return request({
    url: '/apiweb/api/templatemain/add',
    data,
    method: 'post'
  })
}
