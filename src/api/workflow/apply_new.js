import request from '@/utils/request' // 封装的axios请求

export function getClassList() {
  // 获取分类列表
  return request({
    url: '/nodeapi/flow/getClassifly',
    method: 'get'
  })
}

export function getApplyList(id) {
  // 获取分类id来获取当前分类下的流程模板列表
  return request({
    url: 'http://localhost:6603/flow/getTemplateList',
    method: 'get',
    params: {
      id
    }
  })
}

export function getApplyForm(id) {
  // 获取分类id来获取当前分类下的流程模板列表
  return request({
    url: 'http://localhost:6603/flow/applyForm',
    method: 'get',
    params: {
      id
    }
  })
}
