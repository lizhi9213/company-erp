import request from '@/utils/request' // 封装的axios请求

export function getTmpList(id) {
  // 获取分类id来获取当前分类下的流程模板列表
  return request({
    url: '/nodejs/flow/getTemplateList',
    method: 'get',
    params: {
      id
    }
  })
}

export function seaveEditTmp(data) {
  // 获取分类id来获取当前分类下的流程模板列表
  return request({
    url: '/nodejs/flow/saveTmpForm',
    method: 'post',
    data
  })
}
