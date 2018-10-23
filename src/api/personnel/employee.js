import request from '@/utils/request' // 封装的axios请求

export function saveUserForm(data) {
  // 添加员工接口
  return request({
    url: '/apiweb/api/user/AddUserInfo/',
    method: 'post',
    data
  })
}

export function phoneCheck(UserPhone, id) {
  // console.log(data)
  // 验证手机号是否重复
  const data = {}
  data.UserPhone = UserPhone
  data.id = id
  return request({
    url: '/apiweb/api/user/RepeatPhone/',
    method: 'post',
    data
  })
}

export function numberCheck(UserNo, id) {
  // console.log(data)
  // 验证工号是否重复
  const data = {}
  data.UserNo = UserNo
  data.id = id
  return request({
    url: '/apiweb/api/user/RepeatNo/',
    method: 'post',
    data
  })
}

export function usernumberCheck(AccountNo, id) {
  // console.log(data)
  // 验证账号是否重复
  const data = {}
  data.AccountNo = AccountNo
  data.id = id
  return request({
    url: '/apiweb/api/user/RepeatAccountNo/',
    method: 'post',
    data
  })
}
