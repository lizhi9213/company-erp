import {
  param2Obj
} from '@/utils'

const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}
const asyncRouterMap = [{
  path: '/permission',
  Component: 'Layout',
  redirect: '/permission/index',
  alwaysShow: 1,
  meta: {
    title: 'permission',
    icon: 'lock'
  },
  children: [{
    path: 'page',
    Component: 'permission/page',
    name: 'pagePermission',
    meta: {
      title: 'pagePermission'
    }
  }, {
    path: 'directive',
    Component: ('permission/directive'),
    name: 'directivePermission',
    meta: {
      title: 'directivePermission'
    }
  }]
},
{
  path: '/sysbasis',
  Component: 'Layout',
  redirect: 'sysbasis/index',
  alwaysShow: true,
  meta: {
    title: '基础管理',
    icon: 'personnel'
  },
  children: [{
    path: 'structure',
    Component: 'sysbasis/structure',
    name: 'structureSysbasis',
    meta: {
      title: '组织架构'
    }
  }, {
    path: 'job',
    Component: 'sysbasis/job',
    name: 'jobSysbasis',
    meta: {
      title: '职务管理'
    }
  }, {
    path: 'role',
    Component: 'sysbasis/role',
    name: 'roleSysbasis',
    meta: {
      title: '角色权限'
    }
  }, {
    path: 'd_dictionary',
    Component: 'digitaldictionary/d_dictionary',
    name: 'd_dictionary',
    meta: {
      title: '数据字典'
    }
  }]
}, {
  path: '/personnel',
  Component: 'Layout',
  redirect: 'personnel/index',
  alwaysShow: true,
  meta: {
    title: '员工管理',
    icon: 'personnel'
  },
  children: [{
    path: 'roster',
    Component: 'personnel/roster',
    name: 'rosterPersonnel',
    meta: {
      title: '员工花名册'
    }
  }, {
    path: 'archives',
    Component: 'personnel/archives',
    name: 'archivesPersonnel',
    meta: {
      title: '员工档案'
    }
  }, {
    path: 'relations',
    Component: 'personnel/relations',
    name: 'relationsPersonnel',
    meta: {
      title: '员工关系'
    }
  }]
}, {
  path: '/recruiting',
  Component: 'Layout',
  redirect: 'recruiting/index',
  alwaysShow: true,
  meta: {
    title: '招聘管理',
    icon: 'personnel'
  },
  children: [{
    path: 'plan',
    Component: 'recruiting/plan',
    name: 'planRecruiting',
    meta: {
      title: '招聘计划'
    }
  },
  {
    path: 'resume',
    Component: 'recruiting/resume',
    name: 'resumeRecruiting',
    meta: {
      title: '招聘管理'
    }
  }
  ]
},
{
  path: '*',
  redirect: '/404',
  hidden: 1
}
]

export default {
  loginByUsername: config => {
    const {
      username
    } = JSON.parse(config.body)
    return userMap[username]
  },
  getUserInfo: config => {
    const {
      token
    } = param2Obj(config.url)
    if (userMap[token]) {
      return userMap[token]
    } else {
      return false
    }
  },
  logout: () => 'success',
  getRouters: config => {
    return asyncRouterMap
  },
  getPermission: config => {
    return {
      'directivePermission': ['first', 'list']
    }
  }
}
