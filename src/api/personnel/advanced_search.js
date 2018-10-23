import request from '@/utils/request' // 封装的axios请求

export function getSearchTables(query) {
  // 获取表格tbody数据 query参数如下：
  // pageSize每页多少条数据 / current当前页码 / classifica顶部卡片统计当前选择的id / depid当前选择的部门
  // sorting: 1工号降序/2工号升序/3按最早入职排序/4按最近入职排序/5按最近入职排序（传数字给后台）
  return request({
    // url: '/nodejs/manage/getRosterTable',
    url: '/apiweb/api/user/SearchRoster/',
    method: 'get',
    params: query
  })
}
export function phoneCheck(phone, id) {
  // console.log(data)
  // 验证手机号是否重复
  const data = {}
  data.phone = phone
  data.id = id
  return request({
    url: '/apiweb/api/user/RepeatPhone/',
    method: 'post',
    data
  })
}
