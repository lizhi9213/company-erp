import request from '@/utils/request'

/**
 * 获取数据字典下拉框
 * @param {Number} id ID
 */
export function getDataDict(id) {
  return request({
    url: '/apiweb/api/data/combox/',
    params: {
      pId: id
    }
  })
}

/**
 * 获取省市区下拉框
 * @param {Number} id 父级id
 */
export function getProvCombox(id, isEnd) {
  return request({
    url: '/apiweb/api/city/combox/',
    params: {
      pId: id,
      isEnd: isEnd
    }
  })
}
export function getProvCombox1(num) {
  return request({
    url: '/apiweb/api/user/GetAddress/',
    params: {
      num: num
    }
  })
}
export function getPlanList(type, query) {
  return request({
    url: '/apiweb/api/recrutiment/plan/combox/' + type + '/' + (query || '')
  })
}
