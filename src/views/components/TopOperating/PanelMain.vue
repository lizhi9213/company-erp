<script>
export default {
  name: 'PanelMain',
  props: {
    name: {
      type: String,
      default: () => {
        return this.name || '请绑定名称'
      }
    },
    number: {
      type: String || Number,
      default: () => {
        return this.number || 0
      }
    },
    endname: {
      type: String,
      default: () => {
        return this.name || '请绑定名称'
      }
    },
    istitle: {
      type: Boolean,
      default: false
    },
    current: {
      type: Boolean,
      default: false
    }
  },
  render(h, ctx) {
    if (!this.istitle) {
      return h(
        'div',
        {
          class: {
            current: this.current,
            panel_main: true
          }
        },
        [
          h(
            'div',
            {
              attrs: {
                class: 'sub_main'
              }
            },
            [
              h('div', {
                attrs: {
                  class: 'sub_title'
                },
                domProps: {
                  innerHTML: this.name
                }
              }),
              h('div', {
                attrs: {
                  class: 'sub_value'
                },
                domProps: {
                  innerHTML: this.number + this.endname
                }
              })
            ]
          )
        ]
      )
    } else {
      return h(
        'div',
        {
          class: {
            current: this.current,
            panel_title: true
          }
        },
        [
          h(
            'div',
            {
              attrs: {
                class: 'title'
              }
            },
            [
              h('span', {
                domProps: {
                  innerHTML: this.name
                }
              }),
              h('span', {
                domProps: {
                  innerHTML: this.number
                }
              }),
              h('span', {
                domProps: {
                  innerHTML: this.endname
                }
              })
            ]
          )
        ]
      )
    }
  }
}
</script>
