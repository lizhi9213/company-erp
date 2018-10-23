// 处理table表格表头和表体数据
const disposeTable = data => {
  // console.log(data)
  const datarow = {}
  const cloumsData = []
  for (const [index, val] of data.formdatas.entries()) {
    const cloums = {
      title: val.label,
      key: 'key' + index,
      minWidth: 160,
      render: disposeColums(val, 'key' + index)
    }
    cloumsData.push(cloums)
    datarow['key' + index] = val.default
  }
  cloumsData.push({
    title: '删除',
    key: 'del',
    width: 80,
    fixed: 'right',
    align: 'center',
    render: (h, params) => {
      return h('i', {
        attrs: {
          class: 'el-icon-delete'
        }
      })
    }
  })
  const tableData = [cloumsData]
  const tbody = []
  tbody.push(datarow)
  tableData.push(tbody)
  // const newObj = JSON.parse(JSON.stringify(tableData))
  return tableData
}
const disposeColums = (val, key) => {
  // 出来render渲染函数
  if (val.type === 'dtext') {
    return (h, params) => {
      // console.log(params.row[key])
      return h('el-input', {
        attrs: {
          placeholder: '请输入内容',
          value: params.row[key]
        }
      })
    }
  } else if (val.type === 'date') {
    return (h, params) => {
      return h('el-date-picker', {
        style: {
          width: '100%'
        },
        props: {
          format: val.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd',
          'value-format': val.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd',
          type: val.precise ? 'datetime' : 'date'
        },
        attrs: {
          placeholder: '请选择日期',
          value: params.row[key]
        }
      })
    }
  } else if (val.type === 'number') {
    return (h, params) => {
      return h('el-input', {
        attrs: {
          placeholder: '请输入内容',
          value: params.row[key]
        }
      })
    }
  } else if (val.type === 'uniterming') {
    return (h, params) => {
      // console.log(params)
      // console.log(val)
      const optlist = []
      for (const [index, item] of val.option.entries()) {
        optlist.push(
          h('el-option', {
            props: {
              label: item.label,
              value: index
            }
          })
        )
      }
      return h(
        'el-select', {
          props: {
            value: params.row[key]
          },
          attrs: {
            placeholder: '请选择'
          }
        },
        optlist
      )
    }
  } else if (val.type === 'multiple') {
    return (h, params) => {
      const checkboxlist = []
      for (const [index, item] of val.option.entries()) {
        checkboxlist.push(
          h(
            'el-checkbox', {
              props: {
                label: index
              }
            },
            item.label
          )
        )
      }
      return h(
        'el-checkbox-group', {
          props: {
            value: params.row[key]
          },
          attrs: {
            placeholder: '请选择'
          }
        },
        checkboxlist
      )
    }
  }
}

const workflow = {
  state: {
    feildData: {}, // 当前选中的字段数据
    viewList: [], // 中间预览列表数据
    currently: [], // 当前选择的字段的坐标
    idEditForm: false, // 是否修改过表单
    clearStatus: false, // 清除状态
    baseField: [{
      id: 1,
      icon: 'g_detail',
      name: 'podpis',
      text: '描述文字'
    },
    {
      id: 2,
      icon: 'single_line',
      name: 'dtext',
      text: '单行文字'
    },
    {
      id: 3,
      icon: 'multi_line',
      name: 'mtext',
      text: '多行文字'
    },
    {
      id: 4,
      icon: 'g_date',
      name: 'date',
      text: '日期'
    },
    {
      id: 5,
      icon: 'g_email',
      name: 'email',
      text: '邮箱'
    },
    {
      id: 6,
      icon: 'g_phone',
      name: 'phone',
      text: '手机'
    },
    {
      id: 7,
      icon: 'g_number',
      name: 'number',
      text: '数字'
    },
    {
      id: 8,
      icon: 'g_link',
      name: 'link',
      text: '链接'
    },
    {
      id: 9,
      icon: 'uniterming',
      name: 'uniterming',
      text: '单项选择'
    },
    {
      id: 10,
      icon: 'drop_down',
      name: 'dropdown',
      text: '下拉选择'
    },
    {
      id: 11,
      icon: 'multiple',
      name: 'multiple',
      text: '多项选择'
    },
    {
      id: 12,
      icon: 'g_upload',
      name: 'fileupload',
      text: '附件上传'
    },
    {
      id: 13,
      icon: 'se_time',
      name: 'timerange',
      text: '起止时间'
    },
    {
      id: 14,
      icon: 'picture',
      name: 'picture',
      text: '图片选择'
    },
    {
      id: 15,
      icon: 'rich_text',
      name: 'richtext',
      text: '富文本'
    }
    ], // 基础字段
    seniorField: [{
      id: 16,
      icon: 'g_table',
      name: 'table',
      text: '表格'
    },
    {
      id: 17,
      icon: 'g_members',
      name: 'members',
      text: '成员'
    },
    {
      id: 18,
      icon: 'g_associated',
      name: 'associated',
      text: '数据关联'
    }
    ] // 高级字段
  },
  mutations: {
    /* vuex 同步*/
    setPubFeildData: (state, data) => {
      state.feildData = data
      //   console.log(state.feildData)
    },
    setViewListData: (state, data) => {
      // 根据坐标将当前传入的组数据存入预览列表中，并记录update后的坐标
      console.log(data)
      // disposeTable
      if (data[0].name === 'table') {
        // 如果是表格字段,需要处理表头和表体数据
        const tableData = disposeTable(data[0])
        // console.log(tableData)
        data[0].tablecolumns = tableData[0]
        data[0].tabledata = tableData[1]
      }
      var gindex = state.currently[0]
      if (gindex && gindex < state.viewList.length - 1) {
        state.viewList.splice(gindex + 1, 0, data)
        state.currently = []
        state.currently.push(gindex + 1, 0)
      } else {
        state.viewList.push(data)
        var nowIndex = state.viewList.length - 1
        state.currently = []
        state.currently.push(nowIndex, 0)
      }
    },
    setCoordinates: (state, data) => {
      // 设置当前选择的元素的坐标
      state.currently = data
    },
    setCurrent: (state, data) => {
      // 设置当前选中坐标
      state.currently = data
      var a = data[0]
      var b = data[1]
      // 先清除所有的选中状态，再重新把选中的状态给当前
      state.viewList.forEach(item => {
        item.forEach(info => {
          info.active = false
        })
      })
      state.viewList[a][b].active = true
      // 设置字段数据
      const feildId = state.viewList[a][b].type
      const feildData1 = state.baseField.find(v => feildId === v.id)
      const feildData2 = state.seniorField.find(v => feildId === v.id)
      if (feildData1 !== undefined) {
        state.feildData = feildData1
      }
      if (feildData2 !== undefined) {
        state.feildData = feildData2
      }
      // 切换选中不触发变化
      state.idEditForm = false
      state.clearStatus = true
    },
    delFeildGroup: (state, data) => {
      // 删除组员，如果删除后当前组无组员，则要删除当前组
      var a = data[0]
      var b = data[1]
      const group = state.viewList[a] // 当前组
      if (group[b].active) {
        // 如果是当前选中的，就清除选中序号组
        state.currently = []
        // 清空存储的字段信息
        state.feildData = {}
      }
      group.splice(b, 1)
      if (group.length === 0) {
        state.viewList.splice(a, 1)
      } else {
        // 均组员占比
        const newScale = 24 / group.length
        group.forEach(item => {
          item.scale = newScale
        })
      }
    },
    copyFeildCrew: (state, data) => {
      var a = data[0]
      var b = data[1]
      // 拷贝当前成员并向下创建一个包含该拷贝成员的组
      const copyCrew = JSON.parse(JSON.stringify(state.viewList[a][b]))
      // 创建一个新组，存入当前组员
      const newGroup = []
      // 将当前组员恢复24占比
      copyCrew.span = 24
      copyCrew.active = false
      newGroup.push(copyCrew)
      if (a === state.viewList.length - 1) {
        state.viewList.push(newGroup)
      } else {
        state.viewList.splice(a + 1, 0, newGroup)
      }
    },
    disposeElevator: (state, data) => {
      var a = data[0]
      var b = data[1]
      var c = data[2]
      // 上下跨组处理
      const nowObj = state.viewList[a][b] // 当前组成员暂存
      const group = state.viewList[a] // 当前组
      group.splice(b, 1)
      if (c === 'up') {
        // 删除当前成员在原来所占的位置
        const prior = state.viewList[a - 1] // 前一组
        // 跨组向上，将当前组添加进前一组
        prior.push(nowObj)
        // 检查当前组组员，如果没有成员则删除当前组
        if (group.length === 0) {
          state.viewList.splice(a, 1)
        } else {
          // 当前组还有组员，将当前组组员所占比例均分
          const nowScale = 24 / group.length
          group.forEach(item => {
            item.scale = nowScale
          })
        }
        // 遍历加入前一组，均分每个成员所占比例
        const newSpan = 24 / prior.length
        prior.forEach(item => {
          item.scale = newSpan
        })
        // 记录移动后的坐标
        state.currently = []
        const nowi = prior.length - 1
        state.currently.push(a - 1, nowi)
      } else if (c === 'down') {
        // 拆分向下
        // 创建一个新组，存入当前组员
        const newGroup = []

        // 将当前组员恢复24占比
        nowObj.scale = 24
        newGroup.push(nowObj)
        // 将新组插入到当前组之下
        if (a === state.viewList.length - 1) {
          state.viewList.push(newGroup)
        } else {
          state.viewList.splice(a + 1, 0, newGroup)
        }
        // 均分前一组组员占比
        const prior1 = state.viewList[a]
        const newScale = 24 / prior1.length
        prior1.forEach(item => {
          item.scale = newScale
        })
        // 记录移动后的坐标
        state.currently = []
        state.currently.push(a + 1, 0)
      }
    },
    interchange: (state, data) => {
      var a = data[0]
      var b = data[1]
      var c = data[2]
      // 左右交换位置
      // 先取出当前的数据暂存
      const nowObj = state.viewList[a][b]
      state.viewList[a].splice(b, 1)
      if (c === 'toleft') {
        // 将数据向左移动一位
        state.viewList[a].splice(b - 1, 0, nowObj)
        // 记录移动后的坐标
        state.currently = []
        state.currently.push(a, b - 1)
      } else if (c === 'toright') {
        // 将数据向右移动一位
        if (b === state.viewList[a].length - 1) {
          state.viewList[a].push(nowObj)
        } else {
          state.viewList[a].splice(b + 1, 0, nowObj)
        }
        // 记录移动后的坐标
        state.currently = []
        state.currently.push(a, b + 1)
      }
    },
    addTableFeild: (state, data) => {
      const a = data.type
      const b = data.name
      let formdata = {
        required: false, // 必填项
        norepeat: false // 是否允许重复/时间重叠
      }
      const optionList = [{
        label: '未命名',
        rnoly: false
      },
      {
        label: '未命名',
        rnoly: false
      },
      {
        label: '未命名',
        rnoly: false
      }
      ]
      switch (a) {
        case 'dtext':
          // 单行文字
          formdata.icon = 'single_line'
          formdata.name = '单行文字'
          formdata.type = a
          formdata.label = b
          formdata.default = ''
          formdata.norepeat = false // 是否允许重复值
          formdata.astrict = false // 限制选项
          formdata.maximum = -1 // 最大
          formdata.minimum = -1 // 最小
          break
        case 'date':
          // 日期
          formdata.icon = 'g_date'
          formdata.name = '日期'
          formdata.type = a
          formdata.label = b
          formdata.default = ''
          formdata.norepeat = false // 是否允许时间重叠
          formdata.precise = false // 是否精确到时分秒
          break
        case 'number':
          // 数字
          formdata.icon = 'g_number'
          formdata.name = '数字'
          formdata.type = a
          formdata.label = b
          formdata.norepeat = false // 是否允许重复值
          formdata.default = ''
          formdata.decimals = true // 是否允许小数
          break
        case 'uniterming':
          // 单项选择
          formdata = {
            icon: 'uniterming',
            type: a,
            name: '单项选择',
            label: b,
            default: '',
            required: false, // 必填项
            oFlag: false, // 是否有添加其他
            option: optionList // 下拉列表
          }
          break
        case 'multiple':
          // 多项选择
          formdata = {
            icon: 'multiple',
            name: '多项选择',
            type: a,
            label: b,
            default: [],
            required: false, // 必填项
            oFlag: false, // 是否有添加其他
            option: optionList // 下拉列表
          }
          break
        default:
          // 其他
      }
      // console.log(formdata)
      if (state.currently.length !== 0) {
        const c = state.currently[0]
        const d = state.currently[1]
        state.viewList[c][d].formdatas.push(formdata)
        // 处理表格表头/表体数据
        const tableData = disposeTable(state.viewList[c][d])
        // console.log(tableData)
        state.viewList[c][d].tablecolumns = tableData[0]
        state.viewList[c][d].tabledata = tableData[1]
      }
    },
    updateTable: (state, data) => {
      if (state.currently.length !== 0) {
        const c = state.currently[0]
        const d = state.currently[1]
        // 处理表格表头/表体数据
        if (state.viewList[c][d].name === 'table') {
          const tableData = disposeTable(state.viewList[c][d])
          state.viewList[c][d].tablecolumns = tableData[0]
          state.viewList[c][d].tabledata = tableData[1]
        }
      }
    },
    clearFlow: (state, data) => {
      state.viewList = []
      state.currently = []
      state.feildData = {}
      state.idEditForm = false
    },
    formOnChange: (state, data) => {
      state.idEditForm = data
    },
    setClearStatus: (state, data) => {
      state.clearStatus = data
    }
  },
  actions: {
    /* vuex 异步*/
    // delVisitedViews({
    //   commit,
    //   state
    // }, view) {
    //   return new Promise((resolve) => {
    //     commit('DEL_VISITED_VIEWS', view)
    //     resolve([...state.visitedViews])
    //   })
    // }
  }
}

export default workflow
