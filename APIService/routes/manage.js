var express = require('express')
var router = express.Router()
var URL = require('url')
var Mock = require('mockjs')

// 组织架构右侧树形结构数据
router.get('/getOrgTree', (req, res) => {
  const tree = [{
    id: 1,
    value: 1,
    label: '总经办',
    Employees: 456,
    IsOffice: 0,
    Description: '测试总经办描述666',
    Founder: '陈书林',
    CrteatDate: '2018-6-29',
    children: [{
      id: 2,
      value: 2,
      label: '人事行政部',
      Employees: 50,
      IsOffice: 0,
      Description: '测试人事行政部描述666',
      Founder: '陈书林',
      CrteatDate: '2018-6-29',
      children: [{
        id: 8,
        value: 8,
        label: '招聘中心',
        Employees: 66,
        IsOffice: 0,
        Description: '测试招聘中心描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }, {
        id: 9,
        value: 9,
        label: '行政中心',
        Employees: 32,
        IsOffice: 0,
        Description: '测试行政中心描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }, {
        id: 10,
        value: 10,
        label: '薪酬管理',
        Employees: 16,
        IsOffice: 0,
        Description: '测试薪酬管理描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }]
    }, {
      id: 3,
      value: 3,
      label: '市场销售部',
      Employees: 28,
      IsOffice: 0,
      Description: '测试市场销售部描述666',
      Founder: '陈书林',
      CrteatDate: '2018-6-29',
      children: [{
        id: 11,
        value: 11,
        label: '投标中心',
        Employees: 36,
        IsOffice: 0,
        Description: '测试投标中心描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }, {
        id: 12,
        value: 12,
        label: '维系中心',
        Employees: 41,
        IsOffice: 0,
        Description: '测试维系中心描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }]
    }, {
      id: 4,
      value: 4,
      label: '运营部',
      Employees: 66,
      IsOffice: 0,
      Description: '测试运营部描述666',
      Founder: '陈书林',
      CrteatDate: '2018-6-29',
      children: [{
        id: 13,
        value: 13,
        label: '品控中心',
        Employees: 43,
        IsOffice: 0,
        Description: '测试品控中心描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }, {
        id: 14,
        value: 14,
        label: '交付中心',
        Employees: 20,
        IsOffice: 0,
        Description: '测试交付中心描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }]
    }, {
      id: 5,
      value: 5,
      label: '财经部',
      Employees: 26,
      IsOffice: 0,
      Description: '测试财经部描述666',
      Founder: '陈书林',
      CrteatDate: '2018-6-29',
      children: [{
        id: 15,
        value: 15,
        label: '财务中心',
        Employees: 28,
        IsOffice: 0,
        Description: '测试财务中心描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }, {
        id: 16,
        value: 16,
        label: '经营中心',
        Employees: 14,
        IsOffice: 0,
        Description: '测试经营中心描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }]
    }, {
      id: 6,
      value: 6,
      label: 'IT部',
      Employees: 12,
      IsOffice: 0,
      Description: '测试IT部描述666',
      Founder: '陈书林',
      CrteatDate: '2018-6-29',
      children: [{
        id: 17,
        value: 17,
        label: '运维中心',
        Employees: 16,
        IsOffice: 0,
        Description: '测试运维中心描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }, {
        id: 18,
        value: 18,
        label: '研发中心',
        Employees: 26,
        IsOffice: 0,
        Description: '测试研发中心描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }, {
        id: 19,
        value: 19,
        label: '市场中心',
        Employees: 28,
        IsOffice: 0,
        Description: '测试市场中心描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }]
    }, {
      id: 7,
      value: 7,
      label: '办事处',
      Employees: 888,
      IsOffice: 0,
      Description: '测试办事处描述666',
      Founder: '陈书林',
      CrteatDate: '2018-6-29',
      children: [{
        id: 20,
        value: 20,
        label: '民航路办事处',
        Employees: 234,
        IsOffice: 1,
        Description: '测试民航路办事处描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }, {
        id: 21,
        value: 21,
        label: '科技园办事处',
        Employees: 289,
        IsOffice: 1,
        Description: '测试科技园办事处描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }, {
        id: 22,
        value: 22,
        label: '商丘办事处',
        Employees: 156,
        IsOffice: 1,
        Description: '测试商丘办事处描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }, {
        id: 23,
        value: 23,
        label: '安凯路办事处',
        Employees: 233,
        IsOffice: 1,
        Description: '测试安凯路办事处描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }, {
        id: 24,
        value: 24,
        label: '政和路办事处',
        Employees: 321,
        IsOffice: 1,
        Description: '测试政和路办事处描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }, {
        id: 25,
        value: 25,
        label: '南三环办事处',
        Employees: 186,
        IsOffice: 1,
        Description: '测试南三环办事处描述666',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }]
    }]
  }]

  res.send(tree)
})

// 组织结构数据
router.get('/getOrgChart', (req, res) => {
  const treeData = {
    label: '总经办',
    id: '001',
    children: [{
        label: '人事行政部',
        id: '002',
        children: [{
          id: '003',
          label: '招聘中心'
        }, {
          id: '005',
          label: '行政中心'
        }, {
          id: '006',
          label: '薪酬管理'
        }]
      },
      {
        label: '市场销售部',
        id: '007',
        children: [{
          id: '008',
          label: '投标中心'
        }, {
          id: '009',
          label: '维系中心'
        }]
      },
      {
        label: '运营部',
        id: '010',
        children: [{
          id: '011',
          label: '品控中心'
        }, {
          id: '012',
          label: '交付中心'
        }]
      }, {
        label: '财经部',
        id: '013',
        children: [{
          id: '014',
          label: '财务中心'
        }, {
          id: '016',
          label: '经营中心'
        }]
      }, {
        label: 'IT部',
        id: '017',
        children: [{
          id: '018',
          label: '运维中心'
        }, {
          id: '019',
          label: '研发中心'
        }, {
          id: '020',
          label: '市场中心'
        }]
      }, {
        label: '办事处',
        id: '021',
        children: [{
          id: '022',
          label: '民航路办事处'
        }, {
          id: '023',
          label: '科技园办事处'
        }, {
          id: '024',
          label: '商丘办事处'
        }, {
          id: '025',
          label: '安凯路办事处'
        }, {
          id: '026',
          label: '政和路办事处'
        }, {
          id: '027',
          label: '南三环办事处'
        }]
      }
    ]
  }
  res.send(treeData)
})

// 获取组织架构单条信息
router.get('/getOrgDetails', (req, res) => {
  var params = URL.parse(req.url, true).query
  //   console.log(params)
  const node = Mock.mock({
    'isoffice|1': ['1', '0'],
    'office|1': ['民航路办事处', '科技园办事处', '商丘办事处', '政和路办事处', '南三环办事处'],
    name: params.name,
    parent: 16,
    sort: '0',
    desc: '测试财务中心职责介绍'
  })
  if (params.id) {
    res.send(node)
  } else {
    res.send({})
  }
})

// 删除单条组织架构成员
router.get('/delOrgDetails', (req, res) => {
  var params = URL.parse(req.url, true).query
  // console.log(params)
  if (params.id && params.name) {
    res.send({
      code: true,
      msg: '操作成功！'
    })
  } else {
    res.send({
      code: false,
      msg: '操作失败！'
    })
  }
})

// 验证部门名称是否重复
router.get('/orgCheckName', (req, res) => {
  var params = URL.parse(req.url, true).query
  if (params.name) {
    res.send(Mock.mock({
      code: '@boolean()',
      msg: '测试验证名称'
    }))
  } else {
    res.send({
      code: false,
      msg: '无法获取到名称'
    })
  }
})

// 根据id更新组织架构单条部门数据
router.post('/orgUpdate', (req, res) => {
  // console.log(req.body)
  if (req.body.id) {
    res.send({
      code: true,
      msg: '更新成功！'
    })
  } else {
    res.send({
      code: false,
      msg: '操作失败！'
    })
  }
})

// 新增部门
router.post('/orgSave', (req, res) => {
  console.log(req.body)
  if (req.body) {
    res.send({
      code: true,
      msg: '保存成功！'
    })
  } else {
    res.send({
      code: false,
      msg: '操作失败！'
    })
  }
})

// 获取左侧职务树形数据
router.get('/getJobTree', (req, res) => {
  const jobTree = [{
    id: 1,
    value: 1,
    label: '全部',
    PostLevel: '级别一',
    IsOffice: 0,
    Responsibility: '测试职责介绍',
    Founder: '陈书林',
    CrteatDate: '2018-6-29',
    children: [{
      id: 2,
      value: 2,
      label: '总经理',
      PostLevel: '级别二',
      IsOffice: 0,
      Responsibility: '测试总经理职责介绍',
      Founder: '陈书林',
      CrteatDate: '2018-6-29'
    }, {
      id: 3,
      value: 3,
      label: '副总经理',
      PostLevel: '级别二',
      IsOffice: 0,
      Responsibility: '测试副总经理职责介绍',
      Founder: '陈书林',
      CrteatDate: '2018-6-29'
    }, {
      id: 15,
      value: 15,
      label: '部门总经理',
      PostLevel: '级别二',
      IsOffice: 0,
      Responsibility: '测试部门总经理职责介绍',
      Founder: '陈书林',
      CrteatDate: '2018-6-29'
    }, {
      id: 4,
      value: 4,
      label: '运营总经理',
      PostLevel: '级别二',
      IsOffice: 0,
      Responsibility: '测试运营总经理职责介绍',
      Founder: '陈书林',
      CrteatDate: '2018-6-29',
      children: [{
        id: 9,
        value: 9,
        label: '办事处主任',
        PostLevel: '级别三',
        IsOffice: 0,
        Responsibility: '测试办事处主任职责介绍',
        Founder: '陈书林',
        CrteatDate: '2018-6-29',
        children: [{
          id: 12,
          value: 12,
          label: '品控经理',
          PostLevel: '级别四',
          IsOffice: 0,
          Responsibility: '测试品控经理职责介绍',
          Founder: '陈书林',
          CrteatDate: '2018-6-29'
        }, {
          id: 13,
          value: 13,
          label: '交付经理',
          PostLevel: '级别四',
          IsOffice: 0,
          Responsibility: '测试交付经理职责介绍',
          Founder: '陈书林',
          CrteatDate: '2018-6-29'
        }]
      }]
    }, {
      id: 5,
      value: 5,
      label: '财经总经理',
      PostLevel: '级别二',
      IsOffice: 0,
      Responsibility: '测试品控经理职责介绍',
      Founder: '陈书林',
      CrteatDate: '2018-6-29'
    }, {
      id: 6,
      value: 6,
      label: '人事行政总经理',
      PostLevel: '级别二',
      IsOffice: 0,
      Responsibility: '测试人事行政总经理职责介绍',
      Founder: '陈书林',
      CrteatDate: '2018-6-29',
      children: [{
        id: 10,
        value: 10,
        label: '园区发展总经理',
        PostLevel: '级别三',
        IsOffice: 0,
        Responsibility: '测试园区发展总经理职责介绍',
        Founder: '陈书林',
        CrteatDate: '2018-6-29'
      }]
    }, {
      id: 7,
      value: 7,
      label: '市场部总经理',
      PostLevel: '级别二',
      IsOffice: 0,
      Responsibility: '测试市场部总经理职责介绍',
      Founder: '陈书林',
      CrteatDate: '2018-6-29'
    }, {
      id: 8,
      value: 8,
      label: '办事处主任',
      PostLevel: '级别二',
      IsOffice: 1,
      Responsibility: '测试办事处主任职责介绍',
      Founder: '陈书林',
      CrteatDate: '2018-6-29',
      children: [{
        id: 11,
        value: 11,
        label: '运营经理',
        PostLevel: '级别三',
        IsOffice: 1,
        Responsibility: '测试运营经理职责介绍',
        Founder: '陈书林',
        CrteatDate: '2018-6-29',
        children: [{
          id: 14,
          value: 14,
          label: '团长',
          PostLevel: '级别四',
          IsOffice: 1,
          Responsibility: '测试运营经理职责介绍',
          Founder: '陈书林',
          CrteatDate: '2018-6-29'
        }]
      }]
    }]
  }]
  res.send(jobTree)
})

// 获取单条职务的详情数据
router.get('/jobDetail', (req, res) => {
  var params = URL.parse(req.url, true).query

  const jobDetail = Mock.mock({
    'isoffice|1': ['1', '0'],
    'office|1': ['民航路办事处', '科技园办事处', '商丘办事处', '政和路办事处', '南三环办事处'],
    name: params.name,
    parent: 9,
    level: '3',
    sort: '0',
    desc: '测试职务职责介绍'
  })

  // console.log(params)
  if (params.id && params.name) {
    res.send(jobDetail)
  } else {
    res.send({
      code: false,
      msg: 'id或者name无法获取到'
    })
  }
})

// 新增职务
router.post('/saveJobAdd', (req, res) => {
  console.log(req.body)
  if (req.body.name) {
    res.send({
      code: true,
      msg: '保存成功！'
    })
  } else {
    res.send({
      code: false,
      msg: '操作失败！'
    })
  }
})

// 根据id更新职务信息
router.post('/jobUpdate', (req, res) => {
  // console.log(req)
  if (req.body.id) {
    res.send({
      code: true,
      msg: '保存成功！'
    })
  } else {
    res.send({
      code: false,
      msg: '保存失败！'
    })
  }
})

// 根据id 删除单条职务数据
router.get('/jobDel', (req, res) => {
  var params = URL.parse(req.url, true).query
  console.log(params)
  if (params.id && params.name) {
    res.send({
      code: true,
      msg: '操作成功！'
    })
  } else {
    res.send({
      code: false,
      msg: '操作失败！'
    })
  }
})

// 根据id来查询当前职务所属人员
router.get('/jobPlist', (req, res) => {
  var params = URL.parse(req.url, true).query
  // console.log(params)
  // 模拟数据
  const personnelList = []
  const img_url = 'https://i.loli.net/2017/08/21/599a521472424.jpg'
  const num = Math.floor(Math.random() * 20 + 1)
  // console.log(num)
  for (let i = 0; i < num; i++) {
    personnelList.push(Mock.mock({
      id: '@increment',
      'name': '@cname',
      'sex|1': ['男', '女'],
      'duty|1': ['部门经理', '办事处主任', '品控经理', '交付经理', '团长'],
      'phone': /^1[385][1-9]\d{8}/,
      jobnumber: '@id',
      img_url
    }))
  }

  if (params.id) {
    res.send({
      data: personnelList,
      total: num
    })
  } else {
    res.send({
      msg: '无法获取到id'
    })
  }
})

// 删除所属职务下面的人员
router.get('/jobDelPlist', (req, res) => {
  var params = URL.parse(req.url, true).query
  console.log(params)
  if (params.Pid && params.Cids) {
    res.send({
      code: true,
      msg: '删除成功！'
    })
  } else {
    res.send({
      code: false,
      msg: '删除失败！'
    })
  }
})

// 获取新增人员列表
router.get('/jobAddPlist', (req, res) => {
  var params = URL.parse(req.url, true).query
  // console.log(params)
  // 模拟数据
  const parsenList = []
  const img_url = 'https://i.loli.net/2017/08/21/599a521472424.jpg'
  const num = Math.floor(Math.random() * 20 + 1)
  for (let i = 0; i < num; i++) {
    parsenList.push(Mock.mock({
      id: '@increment',
      'name': '@cname',
      'phone': /^1[385][1-9]\d{8}/,
      img_url
    }))
  }

  if (params.id) {
    res.send(parsenList)
  } else {
    res.send({
      msg: '无法获取到id'
    })
  }
})

// 获取岗位级别列表
router.get('/getLevelList', (req, res) => {
  var params = URL.parse(req.url, true).query
  console.log(params)
  res.send([{
      LevelId: '01',
      LevelName: '级别一',
      LevelSerial: 'xr852634',
      CreateName: '陈书林',
      UpdateTime: '2016-10-03'
    },
    {
      LevelId: '01',
      LevelName: '级别一',
      LevelSerial: 'xr852634',
      CreateName: '陈书林',
      UpdateTime: '2016-10-03'
    },
    {
      LevelId: '01',
      LevelName: '级别一',
      LevelSerial: 'xr852634',
      CreateName: '陈书林',
      UpdateTime: '2016-10-03'
    }
  ])
})

// 获取单条岗位级别详情
router.get('/getLeveDetail', (req, res) => {
  var params = URL.parse(req.url, true).query
  // console.log(params)
  if (params.id) {
    res.send({
      LevelId: '06',
      LevelName: '级别三',
      LevelSerial: 'xr852634',
      CreateName: '陈书林',
      UpdateTime: '2016-10-03'
    })
  }
})

// 将新增的人员保存到所属职务下面
router.post('/saveAddPerson', (req, res) => {
  console.log(req.body)
  if (req.body.pid && req.body.ids) {
    res.send({
      code: true,
      msg: '操作成功！'
    })
  } else {
    res.send({
      code: false,
      msg: '保存失败'
    })
  }
})

// 保存新增到岗位级别
router.get('/saveLevel', (req, res) => {
  var params = URL.parse(req.url, true).query
  console.log(params)
  if (params.LevName && params.LevSerial) {
    res.send({
      code: true,
      msg: '保存成功！'
    })
  } else {
    res.send({
      code: true,
      msg: '保存失败！'
    })
  }
})

// 角色列表数据获取
router.get('/getRole', (req, res) => {
  const roleList = []
  const nameObj = ['超级管理员', '管理员', '总经理', '副总经理', '办事处主任']
  for (let i = 0; i < nameObj.length; i++) {
    roleList.push(Mock.mock({
      id: '@increment',
      name: nameObj[i]
    }))
  }
  res.send(roleList)
})

// 角色新增
router.post('/addRole', (req, res) => {
  console.log(req.body)
  if (req.body.RoleName && req.body.RoleSort) {
    res.send({
      code: true,
      msg: '操作成功！'
    })
  } else {
    res.send({
      code: false,
      msg: '操作失败！'
    })
  }
})

router.get('/searchRole', (req, res) => {
  var params = URL.parse(req.url, true).query
  if (params.id) {
    res.send({
      id: '01',
      RoleName: '管理员',
      RoleSort: '02'
    })
  } else {
    res.send({
      msg: '无法获取到id'
    })
  }
})
// 角色删除
router.get('/delRole', (req, res) => {
  var params = URL.parse(req.url, true).query
  if (params.id) {
    res.send({
      code: true,
      msg: '删除成功！'
    })
  } else {
    res.send({
      code: false,
      msg: '删除失败！'
    })
  }
})

// 角色权限列表数据获取
router.get('/getRolePower', (req, res) => {
  const powerList = [{
    id: '1',
    label: '人事行政',
    children: [{
      id: '3',
      label: '组织结构',
      children: [{
        id: '001',
        label: '查看',
        IsCheck: 1
      }, {
        id: '002',
        label: '编辑',
        IsCheck: 0
      }, {
        id: '003',
        label: '新增',
        IsCheck: 0
      }, {
        id: '004',
        label: '删除',
        IsCheck: 0
      }]
    }, {
      id: '4',
      label: '职务管理',
      children: [{
        id: '001',
        label: '查看',
        IsCheck: 0
      }, {
        id: '002',
        label: '编辑',
        IsCheck: 0
      }, {
        id: '003',
        label: '新增',
        IsCheck: 0
      }, {
        id: '004',
        label: '删除',
        IsCheck: 0
      }]
    }, {
      id: '5',
      label: '角色权限',
      children: [{
        id: '001',
        label: '查看',
        IsCheck: 0
      }, {
        id: '002',
        label: '编辑',
        IsCheck: 0
      }, {
        id: '003',
        label: '新增',
        IsCheck: 0
      }, {
        id: '004',
        label: '删除',
        IsCheck: 0
      }]
    }, {
      id: '6',
      label: '岗位级别',
      children: [{
        id: '001',
        label: '查看',
        IsCheck: 0
      }, {
        id: '002',
        label: '编辑',
        IsCheck: 0
      }, {
        id: '003',
        label: '新增',
        IsCheck: 0
      }, {
        id: '004',
        label: '删除',
        IsCheck: 0
      }]

    }, {
      id: '7',
      label: '人事信息-基础',
      children: [{
        id: '001',
        label: '查看',
        IsCheck: 0
      }, {
        id: '002',
        label: '编辑',
        IsCheck: 0
      }, {
        id: '003',
        label: '新增',
        IsCheck: 0
      }, {
        id: '004',
        label: '删除',
        IsCheck: 0
      }]
    }, {
      id: '8',
      label: '人事信息管理',
      children: [{
        id: '001',
        label: '查看',
        IsCheck: 0
      }, {
        id: '002',
        label: '编辑',
        IsCheck: 0
      }, {
        id: '003',
        label: '新增',
        IsCheck: 0
      }, {
        id: '004',
        label: '删除',
        IsCheck: 0
      }]
    }]
  }, {
    id: '2',
    label: '招聘管理',
    children: [{
      id: '9',
      label: '招聘计划',
      children: [{
        id: '001',
        label: '查看',
        IsCheck: 0
      }, {
        id: '002',
        label: '编辑',
        IsCheck: 0
      }, {
        id: '003',
        label: '新增',
        IsCheck: 0
      }, {
        id: '004',
        label: '删除',
        IsCheck: 0
      }]
    }, {
      id: '10',
      label: '简历库',
      children: [{
        id: '001',
        label: '查看',
        IsCheck: 0
      }, {
        id: '002',
        label: '编辑',
        IsCheck: 0
      }, {
        id: '003',
        label: '新增',
        IsCheck: 0
      }, {
        id: '004',
        label: '删除',
        IsCheck: 0
      }]
    }, {
      id: '11',
      label: '邀约通知',
      children: [{
        id: '001',
        label: '查看',
        IsCheck: 0
      }, {
        id: '002',
        label: '编辑',
        IsCheck: 0
      }, {
        id: '003',
        label: '新增',
        IsCheck: 0
      }, {
        id: '004',
        label: '删除',
        IsCheck: 0
      }]
    }, {
      id: '12',
      label: '面试管理',
      children: [{
        id: '001',
        label: '查看',
        IsCheck: 0
      }, {
        id: '002',
        label: '编辑',
        IsCheck: 0
      }, {
        id: '003',
        label: '新增',
        IsCheck: 0
      }, {
        id: '004',
        label: '删除',
        IsCheck: 0
      }]
    }, {
      id: '14',
      label: '通知报道',
      children: [{
        id: '001',
        label: '查看',
        IsCheck: 0
      }, {
        id: '002',
        label: '编辑',
        IsCheck: 0
      }, {
        id: '003',
        label: '新增',
        IsCheck: 0
      }, {
        id: '004',
        label: '删除',
        IsCheck: 0
      }]
    }, {
      id: '15',
      label: '员工报道',
      children: [{
        id: '001',
        label: '查看',
        IsCheck: 0
      }, {
        id: '002',
        label: '编辑',
        IsCheck: 0
      }, {
        id: '003',
        label: '新增',
        IsCheck: 0
      }, {
        id: '004',
        label: '删除',
        IsCheck: 0
      }]
    }]
  }]
  res.send(powerList)
})

router.post('/updateRolePower', (req, res) => {
  // console.log(req.body)
  if (req.body) {
    res.send({
      code: true,
      msg: '操作成功！'
    })
  } else {
    res.send({
      code: false,
      msg: '操作失败！'
    })
  }
})

// 获取当前角色下所属的人员列表
router.get('/rolePeopleList', (req, res) => {
  var params = URL.parse(req.url, true).query
  // console.log(params)
  // 模拟数据
  const parsenList = []
  const img_url = 'https://i.loli.net/2017/08/21/599a521472424.jpg'
  const num = Math.floor(Math.random() * 14 + 1)
  for (let i = 0; i < num; i++) {
    parsenList.push(Mock.mock({
      id: '@increment',
      'name': '@cname',
      img_url
    }))
  }

  if (params.id) {
    res.send(parsenList)
  } else {
    res.send({
      msg: '无法获取到id'
    })
  }
})

// 获取顶层筛选分类
router.get('/getFilter', (req, res) => {
  const filterArr = [{
    SlotName: 'filter1',
    SlotSpan: 12,
    children: [{
      Bname: '在职',
      Ename: '人',
      Sum: '962',
      id: '01',
      isAll: 1
    }, {
      Bname: '来源1',
      Ename: '人',
      Sum: '463',
      id: '02',
      isAll: 0
    }, {
      Bname: '来源2',
      Ename: '人',
      Sum: '123',
      id: '03',
      isAll: 0
    }, {
      Bname: '来源3',
      Ename: '人',
      Sum: '88',
      id: '04',
      isAll: 0
    }, {
      Bname: '来源4',
      Ename: '人',
      Sum: '66',
      id: '05',
      isAll: 0
    }, {
      Bname: '来源5',
      Ename: '人',
      Sum: '92',
      id: '06',
      isAll: 0
    }, {
      Bname: '来源6',
      Ename: '人',
      Sum: '26',
      id: '07',
      isAll: 0
    }]
  }, {
    SlotName: 'filter2',
    SlotSpan: 8,
    children: [{
      Bname: '试用期',
      Ename: '人',
      Sum: '56',
      id: '08',
      isAll: 0
    }, {
      Bname: '待离职',
      Ename: '人',
      Sum: '18',
      id: '09',
      isAll: 0
    }, {
      Bname: '正式',
      Ename: '人',
      Sum: '562',
      id: '10',
      isAll: 0
    }]
  }, {
    SlotName: 'filter3',
    SlotSpan: 4,
    children: [{
      Bname: '待入职',
      Ename: '人',
      Sum: '56',
      id: '11',
      isAll: 0
    }, {
      Bname: '已离职',
      Ename: '人',
      Sum: '562',
      id: '12',
      isAll: 0
    }]
  }]
  res.send(filterArr)
})

// 动态加载表格的表头数据
router.get('/getRosterThead', (req, res) => {
  const tableHead = [{
      title: '姓名',
      key: 'name',
      fixed: 'left',
      align: 'center',
      minWidth: 100
    },
    {
      title: '性别',
      key: 'sex',
      minWidth: 100
    },
    {
      title: '年龄',
      key: 'age',
      minWidth: 100
    },
    {
      title: '城市',
      key: 'city',
      minWidth: 100
    },
    {
      title: '地址',
      key: 'address',
      minWidth: 100
    },
    {
      title: '民族',
      key: 'nation',
      minWidth: 100
    },
    {
      title: '电话',
      key: 'phone',
      minWidth: 100
    },
    {
      title: '工号',
      key: 'jobnumber',
      minWidth: 100
    }
  ]

  res.send(tableHead)
})

// 动态加载表格的数据
router.get('/getRosterTable', (req, res) => {
  var params = URL.parse(req.url, true).query
  const tableData = []
  const Num = Math.floor(Math.random() * 80 + 1)
  for (let i = 0; i < Num; i++) {
    tableData.push(Mock.mock({
      'name': '@cname',
      id: '@increment',
      'sex|1': ['男', '女'],
      'age|1-40': 40,
      'city': '@city',
      'address': '@county',
      nation: '汉',
      'phone': /^1[385][1-9]\d{8}/,
      'jobnumber': '@id'
    }))
  }
  if (params.pageSize && params.current) {
    res.send({
      data: tableData,
      total: Num,
      current: 1,
      pagesize: 20
    })
  }
})

// 获取选择表头功能全部表头的数据
router.get('/getAllThead', (req, res) => {
  const allThead = [{
    id: '01',
    text: '姓名',
    key: 'name',
    width: 100,
    ischose: 1
  }, {
    id: '02',
    text: '性别',
    key: 'sex',
    width: 100,
    ischose: 1
  }, {
    id: '03',
    text: '年龄',
    key: 'age',
    width: 100,
    ischose: 1
  }, {
    id: '04',
    text: '城市',
    key: 'city',
    width: 100,
    ischose: 1
  }, {
    id: '05',
    text: '地址',
    key: 'addr',
    width: 100,
    ischose: 1
  }, {
    id: '06',
    text: '民族',
    key: 'national',
    width: 100,
    ischose: 1
  }, {
    id: '07',
    text: '工作电话',
    key: 'phone',
    width: 100,
    ischose: 1
  }, {
    id: '08',
    text: '工号',
    key: 'workNum',
    width: 100,
    ischose: 1
  }, {
    id: '09',
    text: '部门',
    key: 'department',
    width: 100,
    ischose: 0
  }, {
    id: '10',
    text: '岗位级别',
    key: 'level',
    width: 100,
    ischose: 0
  }, {
    id: '11',
    text: '证件类型',
    key: 'cardType',
    width: 100,
    ischose: 0
  }, {
    id: '12',
    text: '入职日期',
    key: 'induction',
    width: 100,
    ischose: 0
  }, {
    id: '13',
    text: '转正日期',
    key: 'positive',
    width: 100,
    ischose: 0
  }, {
    id: '14',
    text: '个人邮箱',
    key: 'email',
    width: 100,
    ischose: 0
  }, {
    id: '15',
    text: 'QQ号',
    key: 'qq',
    width: 100,
    ischose: 0
  }, {
    id: '16',
    text: '参加工作时间',
    key: 'WorkingDate',
    width: 100,
    ischose: 0
  }, {
    id: '17',
    text: '现居住地',
    key: 'TheLatter',
    width: 100,
    ischose: 0
  }, {
    id: '19',
    text: '银行卡卡号',
    key: 'BankCard',
    width: 100,
    ischose: 0
  }, {
    id: '20',
    text: '政治面貌',
    key: 'Political',
    width: 100,
    ischose: 0
  }, {
    id: '21',
    text: '政治面貌',
    key: 'Graduate',
    width: 100,
    ischose: 0
  }]
  res.send(allThead)
})

router.post('/saveTheadSort', (req, res) => {
  // console.log(req.body)
  if (req.body.chosen && req.body.notchoose) {
    res.send({
      code: true,
      msg: '更新成功'
    })
  } else {
    res.send({
      code: false,
      msg: '保存失败'
    })
  }
})

router.get('/getEmpDetail', (req, res) => {
  var params = URL.parse(req.url, true).query
  if (params.id) {
    res.send({
      UserName: '冯建行',
      UserPhone: '17789263654',
      PostName: '软件工程师',
      UserSex: '男',
      EntryDate: '2018-6-20',
      UserEmail: '6432165@qq.com',
      CertType: '身份证',
      CertNo: '证件号码',
      Depart: ['IT部', '研发组'],
      photoImg: null
    })
  } else {
    res.send({
      msg: '无法获取到id'
    })
  }
})

router.get('/getUserSimpleInfo', (req, res) => {
  var params = URL.parse(req.url, true).query
  if (params.id) {
    res.send({
      name: '冯建行',  // 姓名
      sex: '男',  //性别
      phone: '15031231231', //联系方式
      email: 'aaa@qq.com', //邮箱
      date: '2018-6-20', //入职日期
      bankno: '643216513214', //银行卡号
      cardbank: '卡户行', //卡户行
      bankaddr: '开户行'  //开户行
    })
  } else {
    res.send({
      msg: '无法获取到id'
    })
  }
})

router.post('/updateUserSimpleData', (req, res) => {
  // console.log(req.body)
  if (req.body.id) {
    res.send({
      code: true,
      msg: '更新成功！'
    })
  } else {
    res.send({
      code: false,
      msg: '操作失败！'
    })
  }
})

router.post('/delUserRoster', (req, res) => {
  // console.log(req.body)
  if (req.body.ids) {
    res.send({
      code: true,
      msg: '操作成功！'
    })
  } else {
    res.send({
      code: false,
      msg: '操作失败！'
    })
  }
})

router.post('/updateUserStatus', (req, res) => {
  // console.log(req.body)
  if (req.body.ids) {
    res.send({
      code: true,
      msg: '操作成功！'
    })
  } else {
    res.send({
      code: false,
      msg: '操作失败！'
    })
  }
})
module.exports = router
