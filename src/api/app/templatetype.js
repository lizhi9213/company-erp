import request from '@/utils/request'

export function getTempType(id) {
  return request({
    url: '/apiweb/api/templatetype/get/' + id
  })
}

export function getTempTypeList() {
  return request({
    url: '/apiweb/api/templatetype/get'
  })
}

export function addTempType(data) {
  return request({
    url: '/apiweb/api/templatetype/add',
    method: 'POST',
    data
  })
}
