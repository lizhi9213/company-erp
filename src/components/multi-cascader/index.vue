<template lang='html'>
    <div class='vk-multil-cascader'>
        <el-popover placement='top-start' popper-class='vk-multi-cascader-popover' :visible-arrow='showArrow' trigger='click' @hide='whenPopoverHide' @show='whenPopoverShow'>
            <muContent
                :height='height'
                :width='width'
                :option='options'
                :indep='indep'
                v-model='value'
                @handleOutPut='whenOutPut'
                :selectedValues='selectedValues'
                :outputType='outputType'
                :disabledPair='disabledPair'>
            </muContent>
            <div popper-class='slect-panel' slot='reference'>
              <el-input :placeholder='selectedValues.length > 0 ? "" : placeholder' readonly :suffix-icon='inputArrow'>
              </el-input>
              <div
              class="eldiv">
                <template v-for="(tag, index) in selectedValues">
                  <el-tag
                  class='eltag'
                    :key="tag"
                    v-if='index < shownumber'
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{ getTagShow(tag) }}
                  </el-tag>
                </template>
                <el-badge
v-if='selectedValues.length > shownumber'
:value="selectedValues.length - shownumber"
                  class="item elbadge">
                  <el-tag>其他</el-tag>
                </el-badge>
              </div>
            </div>
        </el-popover>
    </div>
</template>

<script>
import muContent from './multiContent'
// 基于 vue.js && element-ui 的多选级联选择器
export default {
  name: 'multiCascader',
  props: {
    value: '',
    options: {
      type: Array,
      default() {
        return []
      }
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    // 输出值的类型
    outputType: {
      type: String,
      default() {
        return 'value'
      }
    },
    disabledPair: {
      type: Object,
      default() {
        return {}
      }
    },
    // 提示信息
    placeholder: {
      type: String,
      default() {
        return ''
      }
    },
    // 是否分隔选项
    indep: {
      type: Boolean,
      default() {
        return false
      }
    },
    shownumber: {
      type: Number,
      default() {
        return 2
      }
    }
  },
  data() {
    return {
      selectedValues: [],
      showArrow: true,
      activeItem: [],
      outputValue: [],
      optionDicts: [],
      inputArrow: 'el-icon-arrow-down',
      popoverWidth: '',
      // 展开之后的数组， 将每一个children 展开
      flatOptions: [],
      first: true
    }
  },
  watch: {
    value: function(val) {
      this.selectedValues = val || []
    },
    options: function() {
      this.initData()
      this.setOptionDicts(this.options)
      this.toFlatOption(this.options)
    }
  },
  components: {
    muContent
  },
  created() {
    this.initData()
    this.setOptionDicts(this.options)
    this.toFlatOption(this.options)
  },
  methods: {
    emitChange() {
      if (this.selectedValues.length > 0) {
        this.$emit('input', this.selectedValues)
      }
    },
    whenPopoverHide() {
      this.inputArrow = 'el-icon-arrow-down'
      this.emitChange()
    },
    whenPopoverShow() {
      this.inputArrow = 'el-icon-arrow-up'
      this.emitChange()
    },
    initData() {
      this.setLevel()
      this.activeItem = this.options
      // const { width, height } = this
      // console.log(width)
      // console.log(height)
      const checkedValues = []
      let childrenValues = []
      const getChecked = item => {
        const {
          checked,
          value,
          children,
          // level,
          siblingValues
        } = item
        // console.log(level)
        if (siblingValues) {
          const tempValues = [...siblingValues]
          item.siblingValues = tempValues
        }
        childrenValues.push(value)
        if (children && children.length > 0) {
          children.forEach(child => {
            getChecked(child)
          })
        } else {
          if (checked) checkedValues.push(item[this.outputType])
        }
      }
      this.options.forEach(child => {
        getChecked(child)
        // 设置当前item 的 childrenValues, 包含当前item 下的所有值的 value
        child.childrenValues = [...childrenValues]
        childrenValues = []
      })
      this.selectedValues = checkedValues
      if (this.first) {
        this.first = false
      } else {
        this.whenOutPut(this.selectedValues)
      }
    },
    getTypeOptions(values, outputType) {
      const outputValues = [...values]
      // const finalOutputArr = []
      // console.log(finalOutputArr)
      return this.flatOptions.reduce((pev, cur) => {
        const { value: curVal } = cur
        if (outputType === 'item') {
          if (outputValues.includes(curVal)) pev.push(cur)
        } else {
          if (outputValues.includes(curVal) && cur[outputType]) {
            pev.push(cur[outputType])
          }
        }
        return pev
      }, [])
    },
    toFlatOption(option) {
      const getItems = (arr, cur) => {
        const keys = Object.keys(cur)
        const newObj = {}
        keys.forEach(key => key !== 'children' && (newObj[key] = cur[key]))
        arr.push(newObj)
        const curChild = cur.children
        if (curChild && curChild.length > 0) {
          return curChild.reduce((array, now) => getItems(array, now), arr)
        } else {
          return arr
        }
      }
      this.flatOptions = option.reduce(
        (arr, cur) => getItems(arr, cur) && arr,
        []
      )
    },
    // 设置配置的字典
    setOptionDicts(options) {
      if (!Array.isArray(options)) {
        const { label, value } = options
        this.optionDicts.push({ value, label })
        const children = options.children
        if (children) {
          this.setOptionDicts(children)
        }
      } else {
        options.forEach(opt => {
          this.setOptionDicts(opt)
        })
      }
    },
    whenOutPut(value) {
      // 根据选中的值数组 value 输出特定 outputType 类型
      if (this.outputType !== 'value') {
        this.outputValue = this.getTypeOptions(value, this.outputType)
      } else {
        this.outputValue = value
      }
      this.$emit('input', this.selectedValues)
      this.$emit('on-selected', this.outputValue)
    },
    // 设定层级
    setLevel() {
      const siblingValues = []
      let tempLevel = 0
      if (this.options.length) {
        const addLevel = option => {
          const optChild = option.children
          if (option.level === tempLevel) {
            siblingValues.push(option.value)
          }
          if (optChild) {
            optChild.forEach(opt => {
              opt.level = option.level + 1
              addLevel(opt)
            })
          }
        }
        this.options.forEach(option => {
          if (!option.level) {
            option.level = 0
            tempLevel = option.level
          }
          addLevel(option)
          option.siblingValues = siblingValues
        })
      }
    },
    showSecondLevel(item) {
      this.activeItem = item
    },
    getTagShow(value) {
      const index = this.flatOptions.findIndex(temp => temp.value === value)
      if (index === -1) {
        return
      }
      return this.flatOptions[index].label
    },
    handleClose(value) {
      if (this.selectedValues.includes(value)) {
        const index = this.selectedValues.indexOf(value)
        this.selectedValues.splice(index, 1)
      }
    }
  }
}
</script>
<style rel='stylesheet/scss' lang='scss'>
.eldiv {
  top: 0px;
  position: absolute;
}
.eltag {
  margin-left: 10px;
}
.elbadge {
  margin-left: 10px;
}
.vk-menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style-type: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  outline: none;
  padding: 8px 20px;
  font-size: 14px;
  width: 100%;
  &:hover {
    background-color: rgba(125, 139, 169, 0.1);
  }
}
</style>
