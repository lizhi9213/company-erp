import request from '@/utils/request' // 封装的axios请求

export function initMetaForm(id) {
  // 初始化用户top信息
  return request({
    url: '/apiweb/api/user/StaffInfo/',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function initonJobForm(id) {
  // 初始化在职信息
  return request({
    url: '/apiweb/api/user/IncumbentInfo/',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function initonStatusForm(id) {
  // 初始化员工状态
  return request({
    url: '/apiweb/api/user/StatusInfo/',
    method: 'get',
    params: {
      id: id

    }
  })
}

export function initonPersonForm(id) {
  // 初始化员工信息
  return request({
    url: '/apiweb/api/user/PersonalInfo/',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function initcontractForm(id) {
  // 初始化合同信息
  return request({
    url: '/apiweb/api/user/ContractShow/',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function saveonJobForm(data) {
  // 保存在职信息
  return request({
    url: '/apiweb/api/user/UpdateIncumbent/',
    method: 'post',
    data
  })
}

export function saveonStatusForm(data) {
  // 保存员工状态
  return request({
    url: '/apiweb/api/user/StutasUpdate/',
    method: 'post',
    data
  })
}

export function saveonPersonForm(data) {
  // 保存员工信息
  return request({
    url: '/apiweb/api/user/OnsUserUpdate/',
    method: 'post',
    data
  })
}
export function addcontractForm(data) {
  // 添加合同信息
  return request({
    url: '/apiweb/api/user/ContractAdd/',
    method: 'post',
    data
  })
}
export function savecontractForm(data) {
  // 保存合同信息
  return request({
    url: '/apiweb/api/user/ContractUpdate/',
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
