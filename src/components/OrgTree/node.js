// 判断是否叶子节点
const isLeaf = (data, prop) => {
  return !(Array.isArray(data[prop]) && data[prop].length > 0)
}

// 创建 node 节点
export const renderNode = (h, data, context, comId) => {
  const {
    props
  } = context
  const cls = ['org-tree-node']
  const childNodes = []
  const children = data[props.props.children]

  if (isLeaf(data, props.props.children)) {
    cls.push('is-leaf')
  } else if (props.collapsable && !data[props.props.expand]) {
    cls.push('collapsed')
  }
  childNodes.push(renderLabel(h, data, context, comId))

  if (!props.collapsable || data[props.props.expand]) {
    childNodes.push(renderChildren(h, children, context))
  }

  return h('div', {
    domProps: {
      className: cls.join(' ')
    }
  }, childNodes)
}

// 创建展开折叠按钮
export const renderBtn = (h, data, context) => {
  const {
    props
  } = context
  const expandHandler = context.listeners['on-expand']

  const cls = ['org-tree-node-btn']

  if (data[props.props.expand]) {
    cls.push('expanded')
  }

  return h('span', {
    domProps: {
      className: cls.join(' ')
    },
    on: {
      click: e => {
        e.stopPropagation()
        expandHandler && expandHandler(data)
      }
    }
  })
}

// 创建 label 节点
export const renderLabel = (h, data, context, comId) => {
  // console.log(data)
  // console.log(comId)
  const {
    props
  } = context
  const label = data[props.props.label]
  const renderContent = props.renderContent
  const clickHandler = context.listeners['on-node-click'] // 用户点击编辑事件
  const clickDelete = context.listeners['on-node-delete'] // 用户点击删除事件

  const childNodes = []
  if (typeof renderContent === 'function') {
    const vnode = renderContent(h, data)

    vnode && childNodes.push(vnode)
  } else {
    childNodes.push(label)
  }

  if (props.collapsable && !isLeaf(data, props.props.children)) {
    childNodes.push(renderBtn(h, data, context))
  }

  const cls = ['org-tree-node-label-inner']

  // 判断当前用户是否禁用
  if (data.IsUse === '0') {
    cls.push('is-use')
  }
  let {
    labelWidth,
    labelClassName
  } = props
  if (typeof labelWidth === 'number') {
    labelWidth += 'px'
  }
  if (typeof labelClassName === 'function') {
    labelClassName = labelClassName(data)
  }
  labelClassName && cls.push(labelClassName)
  // 判断当前是否是公司，如果是公司label只需要渲染一个div就行，无需on事件
  if (comId && data.id === comId) {
    // console.log('当前是公司label,它的数据是：')
    // console.log(data)
    return h('div', {
      domProps: {
        className: 'org-tree-node-label'
      }
    }, [h('div', {
      domProps: {
        className: cls.join(' ')
      },
      style: {
        width: labelWidth
      },
      on: {
        // click: e => clickHandler && clickHandler(e, data)
      }
    }, childNodes)])
  } else {
    // 当前不是公司的label标签需要绑定两个事件
    return h('div', {
      domProps: {
        className: 'org-tree-node-label'
      },
      props: {
        trigger: 'hover'
      }
    }, [h('div', {
      domProps: {
        className: cls.join(' ')
      },
      style: {
        width: labelWidth
      }
    }, childNodes), h('div', {
      slot: 'content'
    }, [
      h('button', {
        style: {
          marginRight: '10px',
          display: 'none'
        },
        props: {
          type: 'info',
          size: 'small'
        },
        on: {
          click: e => clickHandler && clickHandler(e, data)
        }
      }, '编辑'), h('button', {
        style: {
          display: 'none'
        },
        props: {
          type: 'error',
          size: 'small'
        },
        on: {
          click: e => clickDelete && clickDelete(e, data)
        }
      }, '删除')
    ], '')])
  }
}

// 创建 node 子节点
export const renderChildren = (h, list, context) => {
  if (Array.isArray(list) && list.length) {
    const children = list.map(item => {
      return renderNode(h, item, context)
    })

    return h('div', {
      domProps: {
        className: 'org-tree-node-children'
      }
    }, children)
  }
  return ''
}

export const render = (h, context) => {
  const {
    props
  } = context
  const comId = context.props.data.id
  return renderNode(h, props.data, context, comId)
}

export default render
