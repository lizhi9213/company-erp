import request from '@/utils/request' // 封装的axios请求

export function getClassList() {
  // 获取分类列表
  return request({
    url: '/nodeapi/flow/getClassifly',
    method: 'get'
  })
}

export function getTmpList(id) {
  // 获取分类id来获取当前分类下的流程模板列表
  return request({
    url: '/nodeapi/flow/getTemplateList',
    method: 'get',
    params: {
      id
    }
  })
}

export function saveTmp(data) {
  // 获取分类id来获取当前分类下的流程模板列表
  return request({
    url: '/nodeapi/flow/saveTmpForm',
    method: 'post',
    data
  })
}

export function delUpFiel(id) {
  // 获取分类id来获取当前分类下的流程模板列表
  return request({
    url: '/nodeapi/flow/delUploadFile',
    method: 'get',
    params: {
      id
    }
  })
}
