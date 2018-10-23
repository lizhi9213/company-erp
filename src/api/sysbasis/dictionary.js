import request from '@/utils/request' // 封装的axios请求

export function checkDictionary(data) {
  // console.log(data)
  // 校验数据是否重复
  return request({
    url: '/apiweb/api/dictionary/Repeat_Name/',
    method: 'post',
    data
  })
}
export function getDictionary() {
  // 获取数据字典列表数据
  return request({
    url: '/apiweb/api/dictionary/Show_Dictionary/',
    method: 'get'
  })
}

export function addDictionary(data) {
  // 新增字典数据子集
  return request({
    url: '/apiweb/api/dictionary/Insert_Dictionary/',
    method: 'post',
    data

  })
}
export function getDictionaryshow(DataId, KeyWord) {
  // 参数字典数据展示
  return request({
    url: '/apiweb/api/dictionary/Select_Subset/',
    method: 'get',
    params: {
      DataId,
      KeyWord
    }
  })
}
// 批量删除字典子集
export function delDictionary(Id, DataId) {
  return request({
    url: '/apiweb/api/dictionary/Delete_Subset/',
    method: 'delete',
    params: {
      Id,
      DataId
    }
  })
}
// 编辑字典数据子集
export function editorDictionary(data) {
  return request({
    url: '/apiweb/api/dictionary/Update_Subset/',
    method: 'post',
    data
  })
}
// 编辑展示
export function editorShow(id) {
  return request({
    url: '/apiweb/api/dictionary/Update_Show/',
    method: 'get',
    params: {
      id
    }

  })
}
// export function showFather(DataId) {
//   return request({
//     url: '/apiweb/api/dictionary/ShowFather/',
//     method: 'get',
//     params: {
//       DataId
//     }
//   })
// }
