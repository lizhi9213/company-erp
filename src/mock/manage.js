import Mock from 'mockjs'
import {
  param2Obj
} from '@/utils'

const treeList = [{
  id: 1,
  value: 1,
  label: '总经办',
  children: [{
    id: 2,
    value: 2,
    label: '人事行政部',
    children: [{
      id: 8,
      value: 8,
      label: '招聘中心'
    }, {
      id: 9,
      value: 9,
      label: '行政中心'
    }, {
      id: 10,
      value: 10,
      label: '薪酬管理'
    }]
  }, {
    id: 3,
    value: 3,
    label: '市场销售部',
    children: [{
      id: 11,
      value: 11,
      label: '投标中心'
    }, {
      id: 12,
      value: 12,
      label: '维系中心'
    }]
  }, {
    id: 4,
    value: 4,
    label: '运营部',
    children: [{
      id: 13,
      value: 13,
      label: '品控中心'
    }, {
      id: 14,
      value: 14,
      label: '交付中心'
    }]
  }, {
    id: 5,
    value: 5,
    label: '财经部',
    children: [{
      id: 15,
      value: 15,
      label: '财务中心'
    }, {
      id: 16,
      value: 16,
      label: '经营中心'
    }]
  }, {
    id: 6,
    value: 6,
    label: 'IT部',
    children: [{
      id: 17,
      value: 17,
      label: '运维中心'
    }, {
      id: 18,
      value: 18,
      label: '研发中心'
    }, {
      id: 19,
      value: 19,
      label: '市场中心'
    }]
  }, {
    id: 7,
    value: 7,
    label: '办事处',
    children: [{
      id: 20,
      value: 20,
      label: '民航路办事处'
    }, {
      id: 21,
      value: 21,
      label: '科技园办事处'
    }, {
      id: 22,
      value: 22,
      label: '商丘办事处'
    }, {
      id: 23,
      value: 23,
      label: '安凯路办事处'
    }, {
      id: 24,
      value: 24,
      label: '政和路办事处'
    }, {
      id: 25,
      value: 25,
      label: '南三环办事处'
    }]
  }]
}]

// 单条部门详情
const node = Mock.mock({
  'isoffice|1': ['1', '0'],
  'office|1': ['民航路办事处', '科技园办事处', '商丘办事处', '政和路办事处', '南三环办事处'],
  name: '财务中心',
  parent: [1, 7, 20],
  sort: '0',
  desc: '测试财务中心职责介绍'
})

// 职务树数据
const jobTree = [{
  id: 1,
  value: 1,
  label: '全部',
  children: [{
    id: 2,
    value: 2,
    label: '总经理'
  }, {
    id: 3,
    value: 3,
    label: '副总经理'
  }, {
    id: 15,
    value: 15,
    label: '部门总经理'
  }, {
    id: 4,
    value: 4,
    label: '运营总经理',
    children: [{
      id: 9,
      value: 9,
      label: '办事处主任',
      children: [{
        id: 12,
        value: 12,
        label: '品控经理'
      }, {
        id: 13,
        value: 13,
        label: '交付经理'
      }]
    }]
  }, {
    id: 5,
    value: 5,
    label: '财经总经理'
  }, {
    id: 6,
    value: 6,
    label: '人事行政总经理',
    children: [{
      id: 10,
      value: 10,
      label: '园区发展总经理'
    }]
  }, {
    id: 7,
    value: 7,
    label: '市场部总经理'
  }, {
    id: 8,
    value: 8,
    label: '办事处主任',
    children: [{
      id: 11,
      value: 11,
      label: '运营经理',
      children: [{
        id: 14,
        value: 14,
        label: '团长'
      }]
    }]
  }]
}]

// 单条职务详情
const jobDetail = Mock.mock({
  'isoffice|1': ['1', '0'],
  'office|1': ['民航路办事处', '科技园办事处', '商丘办事处', '政和路办事处', '南三环办事处'],
  name: '财务中心',
  parent: [1, 4, 9],
  level: '3',
  sort: '0',
  desc: '测试职务职责介绍'
})

// 根据id来查询当前职务所属的人员
const parsenList = []
const img_url = 'https://i.loli.net/2017/08/21/599a521472424.jpg'
for (let i = 0; i < 16; i++) {
  parsenList.push(Mock.mock({
    id: '@increment',
    'name': '@cname',
    img_url
  }))
}
export default {
  getTree: () => {
    return treeList
  },
  getNode: () => {
    return node
  },
  saveStruc: () => {
    return {
      code: true,
      msg: '保存成功'
    }
  },
  getJobTree: () => {
    // 获取职务树形的数据
    return jobTree
  },

  getJobDetail: (config) => {
    // 根据id来查询单条的数据
    const {
      id
    } = param2Obj(config.url)
    console.log(id)
    return jobDetail
  },

  jobDel: (config) => {
    // 根据id来删当前职务
    const {
      id
    } = param2Obj(config.url)
    console.log(id)
    if (id) {
      return {
        code: true,
        msg: '删除成功！'
      }
    } else {
      return {
        code: false,
        msg: '删除失败！'
      }
    }
  },
  getParList: config => {
    // 根据id来查询当前职务所属的人员
    const {
      id
    } = param2Obj(config.url)
    if (id) {
      return parsenList
    }
  }
}
