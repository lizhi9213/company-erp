import request from '@/utils/request'

/**
 * 根据外键Id获取文件列表
 * @param {String} AttachId 外键Id
 */
export function getFilesByAttachId(AttachId) {
  return request({
    url: '/apiweb/api/upload/list/' + AttachId
  })
}

/**
 * 删除附件
 * @param {Number} id 主键Id
 */
export function removeFileById(id) {
  return request({
    url: '/apiweb/api/upload/anyfile/' + id,
    method: 'delete'
  })
}

/**
 * 根据Id下载文件，返回文件流，回调中调用utils中download函数
 * @param {Number} id 主键Id
 */
export function downloadFileById(id) {
  return request({
    url: '/apiweb/api/upload/download/' + id,
    method: 'get',
    responseType: 'blob'
  })
}
