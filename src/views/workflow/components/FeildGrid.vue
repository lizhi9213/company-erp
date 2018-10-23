<template>
    <div class="grid-container">
        <div class="grid-box">
            <p class="grid-title">基础字段</p>
            <ul class="grid-list">
                <li class="grid-item" v-for="(item, index) in baseField" :key="index + 10" @click="handleField(item)">
                    <svg-icon class="item-icon" :icon-class="item.icon" />
                    <p class="item-text">{{item.text}}</p>
                </li>
            </ul>
        </div>
        <div class="grid-box" style="margin-top: 16px;">
            <p class="grid-title">高级字段</p>
            <ul class="grid-list">
                <li class="grid-item" v-for="(item, index) in seniorField" :key="index + 8" @click="handleField(item)">
                    <svg-icon class="item-icon" :icon-class="item.icon" />
                    <p class="item-text">{{item.text}}</p>
                </li>
            </ul>
        </div>
        <div class="theme-box" @click="editModal = true">
            <p class="tips-title">
                <svg-icon class="tips-icon" icon-class="g_theme" />设置流程模板外观</p>
        </div>
        <!-- 编辑外观主题样式 -->
        <Modal v-model="editModal" title="设置流程模板外观" :width="860" class-name="show-creat-modal">
            <div class="made-template">
                <div class="preview-box">
                    <h4 class="creat-title">预览模板外观</h4>
                    <div class="effect">
                        <span class="icon" :style="{backgroundColor: flowForm.TmpColor}">
                            <CteatIcon :icon="iconText"></CteatIcon>
                        </span>
                        <p class="effect-name">{{flowForm.TmpName}}</p>
                    </div>
                    <div class="instructions">
                        <p>1. 模板名称尽量简单精炼，2-12字为宜</p>
                        <p>2. 图标颜色为白色，只有在选择背景色后才能看见</p>
                    </div>
                </div>
                <el-form :model="flowForm" :rules="ruleflowForm" ref="flows" label-width="100px" class="made-temform">
                    <el-form-item label="模板名称" prop="TmpName">
                        <div style="width: 350px;">
                            <el-input v-model="flowForm.TmpName" placeholder="请输入模板名称"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="封面底色" prop="TmpColor">
                        <el-color-picker v-model="flowForm.TmpColor" show-alpha :predefine="predefineColors">
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="请选择模板图标" label-width="160" prop="TmpIcon">
                    </el-form-item>
                    <div class="icon-list">
                        <SelectIcons @selected-icon="selectIcon" :hasactive="!editModal"></SelectIcons>
                    </div>
                    <el-button type="primary" class="start-btn" @click="startMade" :loading="tmpLoading">{{tmpLoading ? '保存中...' : '保存模板'}}</el-button>
                </el-form>
            </div>
        </Modal>
    </div>
</template>

<script>
import SelectIcons from '@/views/components/SelectIcons'
export default {
  name: 'FeildGrid',
  components: {
    SelectIcons: SelectIcons,
    CteatIcon: {
      props: {
        icon: {
          type: String,
          default: ''
        }
      },
      render(h) {
        return h('svg-icon', {
          style: {
            fontSize: '26px',
            color: '#fff'
          },
          props: {
            'icon-class': this.icon
          }
        })
      }
    }
  },
  data() {
    // 数据data在这里
    return {
      formDataList: {
        podpis: { content: '' },
        dtext: {
          default: '',
          required: false,
          norepeat: false,
          astrict: false,
          maximum: -1,
          minimum: -1
        },
        mtext: {
          default: '',
          required: false,
          norepeat: false,
          astrict: false,
          maximum: '',
          minimum: ''
        },
        date: {
          date: '',
          required: false,
          norepeat: false,
          precise: false
        },
        email: {
          default: '',
          required: false,
          norepeat: false
        },
        phone: {
          default: '',
          required: false,
          norepeat: false
        },
        number: {
          default: '',
          required: false,
          norepeat: false,
          decimals: true
        },
        link: {
          default: '',
          required: false,
          norepeat: false
        },
        uniterming: {
          radio: '',
          required: false, // 必填
          arrange: 1, // 1横排2竖排
          share: false, // 是否配置份额
          oFlag: false, // 当前是否有其他项，其他项有且只有一个
          childs: [
            {
              label: '未命名',
              rnoly: false, // 是否是其他项，有且只一个
              frequency: 0 // 次数
            },
            {
              label: '未命名',
              rnoly: false, // 是否是其他项，有且只一个
              frequency: 0 // 次数
            },
            {
              label: '未命名',
              rnoly: false, // 是否是其他项，有且只一个
              frequency: 0 // 次数
            }
          ]
        },
        dropdown: {
          select: '',
          required: false,
          share: false, // 是否配置份额
          oFlag: false, // 当前是否有其他项，其他项有且只有一个
          childs: [
            {
              label: '未命名',
              rnoly: false, // 是否是其他项，有且只一个
              frequency: 0 // 次数
            },
            {
              label: '未命名',
              rnoly: false, // 是否是其他项，有且只一个
              frequency: 0 // 次数
            },
            {
              label: '未命名',
              rnoly: false, // 是否是其他项，有且只一个
              frequency: 0 // 次数
            }
          ]
        },
        multiple: {
          checkbox: [],
          required: false,
          arrange: 1, // 1横排2竖排
          share: false, // 是否配置份额
          astrict: false, // 限制选项
          maximum: '', // 最大
          minimum: '', // 最小
          oFlag: false, // 当前是否有其他项，其他项有且只有一个
          childs: [
            {
              label: '未命名',
              rnoly: false, // 是否是其他项，有且只一个
              frequency: 0 // 次数
            },
            {
              label: '未命名',
              rnoly: false, // 是否是其他项，有且只一个
              frequency: 0 // 次数
            },
            {
              label: '未命名',
              rnoly: false, // 是否是其他项，有且只一个
              frequency: 0 // 次数
            }
          ]
        },
        fileupload: {
          required: false,
          limitType: false, // 是否限制接收上传文件类型
          fileType: [], // 文件类型存储
          listText: '', // 限制格式
          limitSize: true, // 是否限制文件大小
          maxSize: 20 // 接收上传文件大小/M为单位
        },
        timerange: {
          daterange: '', // 时间范围
          required: false, // 必填项
          norepeat: false, // 是否允许时间重叠
          precise: false //  是否精确到时分秒
        },
        picture: {
          selectimg: [],
          required: false, // 必填项
          astrict: false, // 限制选项
          maximum: '', // 最大
          minimum: '', // 最小
          share: false, // 是否配置份额
          oFlag: false, // 没有其他项
          childs: [
            {
              label: '未命名',
              imglist: 1,
              imgurl: '/src/images/image-choice-1.png', // 图片路径
              frequency: 0 // 次数
            },
            {
              label: '未命名',
              imglist: 2,
              imgurl: '/src/images/image-choice-2.png', // 图片路径
              frequency: 0 // 次数
            },
            {
              label: '未命名',
              imglist: 3,
              imgurl: '/src/images/image-choice-3.png', // 图片路径
              frequency: 0 // 次数
            }
          ]
        },
        richtext: {
          required: false, // 必填项
          value: '' // 富文本的值
        },
        table: {
          formdatas: [
            {
              label: '单行文字',
              name: '单行文字',
              icon: 'single_line',
              type: 'dtext',
              default: '',
              required: false, // 必填项
              norepeat: false, // 是否允许重复/时间重叠
              astrict: false, // 限制选项
              maximum: '', // 最大
              minimum: '' // 最小
            },
            {
              label: '单行文字',
              name: '单行文字',
              type: 'dtext',
              icon: 'single_line',
              default: '',
              required: false, // 必填项
              norepeat: false, // 是否允许重复/时间重叠
              astrict: false, // 限制选项
              maximum: '', // 最大
              minimum: '' // 最小
            },
            {
              label: '单行文字',
              name: '单行文字',
              type: 'dtext',
              icon: 'single_line',
              default: '',
              required: false, // 必填项
              norepeat: false, // 是否允许重复/时间重叠
              astrict: false, // 限制选项
              maximum: '', // 最大
              minimum: '' // 最小
            }
          ] // 各类单选/多选的下拉列表
        },
        members: {
          required: false, // 必填项
          default: [], // 默认内容
          scope: []
        },
        associated: {
          required: false, // 必填项
          linkage1: '', // 联动一级
          linkage2: '', // 联动二级
          screening: false, // 是否设置筛选数据
          aggregation: false, // 是否设置聚合方式
          aggregaway: '' // 聚合方式值
        }
      }, // 每一个字段的编辑表单数据
      editModal: false, // 修改主题弹出窗
      flowForm: {
        TmpName: '',
        TmpColor: '',
        TmpIcon: ''
      }, // 流程模板主题表单
      ruleflowForm: {
        TmpName: [
          { required: true, message: '请填写模板名称', trigger: 'blur' },
          {
            min: 2,
            max: 12,
            message: '长度在 2 到 12 个字符',
            trigger: 'blur'
          }
        ],
        TmpColor: [
          { required: true, message: '请选择背景颜色', trigger: 'change' }
        ],
        TmpIcon: [{ required: true, message: '请选择图标', trigger: 'change' }]
      }, // 流程模板表单验证
      tmpLoading: false, // 创建btn的loading控制
      iconText: '', // 选择的icon名字暂存
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ] // 颜色选择器预定义
    }
  },
  computed: {
    viewList() {
      return this.$store.state.workflow.viewList
    },
    currently() {
      return this.$store.state.workflow.currently
    },
    baseField() {
      return this.$store.state.workflow.baseField
    },
    seniorField() {
      return this.$store.state.workflow.seniorField
    }
  },
  methods: {
    handleField(data) {
      // 将当前的字段 data写入store中
      const feildData = JSON.parse(JSON.stringify(data))
      this.$store.commit('setPubFeildData', feildData)
      // console.log(this.$store.state.workflow.feildData)
      // 创建一个组数据写入store中的预览数据
      this.creatGroup(data)
    },
    creatGroup(data) {
      // 生成一组预览数据
      const fid = data['id']
      const flabel = data['text']
      const fname = data['name']
      // 清除所有选中状态
      this.viewList.forEach(item => {
        item.forEach(info => {
          info.active = false
        })
      })
      // 创建组数据，并写入store中
      var group = {}
      const formdata = this.formDataList[fname]
      formdata.label = flabel
      if (name === 'podpis') {
        // 描述文字特殊处理
        group = this.setGroup(formdata, fid, 2, fname, flabel)
      } else {
        // 其他字段处理
        group = this.setGroup(formdata, fid, 1, fname, flabel)
      }
      //   console.log(group)
      var newObj = JSON.parse(JSON.stringify(group))
      this.$store.commit('setViewListData', newObj)
      // console.log(this.viewList)
      //   console.log(this.currently)
      // 新增修改表单编辑状态
      this.$store.commit('formOnChange', true)
    },
    setGroup(list, id, type, name, text) {
      // 根据不同类型的字段创建组的数据
      const gData = [
        {
          type: id,
          name: name,
          active: true,
          text: text,
          scale: 24
        }
      ]
      if (type === 1) {
        gData[0]['tips'] = ''
      }
      for (const key in list) {
        if (list.hasOwnProperty(key)) {
          gData[0][key] = list[key]
        }
      }
      return gData
    },
    selectIcon(icon) {
      // 主题选择图标回调处理
      //   console.log(icon)
      this.iconText = icon
      this.flowForm.TmpIcon = icon
    },
    startMade() {
      this.tmpLoading = true
      this.$refs['flows'].validate(valid => {
        if (valid) {
          this.editModal = false
          this.tmpLoading = false
          // console.log(this.flowForm)
          this.$emit('edit-flow', this.flowForm)
        } else {
          //   console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted() {}
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 重置样式，用于重写element-ui样式，自定义自己的样式 */
.grid-container {
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 自定义样式，由于有scoped属性，所以只对当前tamplate中的 html生效，优化打包效率*/
.grid-container {
  /* 九宫格样式 */
  .grid-box {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .grid-title {
      padding: 10px 10px 10px 15px;
      margin-bottom: 0;
      font-weight: 500;
    }
    .grid-list {
      display: flex;
      flex-wrap: wrap;
      .grid-item {
        list-style: none;
        border-right: 1px solid #f5f5f7;
        flex-direction: column;
        width: calc(100% / 3);
        height: 68px;
        border-top: 1px solid #f5f5f7;
        cursor: pointer;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        .item-icon {
          font-size: 18px;
        }
        .item-text {
          margin-top: 8px;
        }
        &:hover {
          border: 1px solid #0bb27a;
          box-shadow: 0 0 2px 2px rgba(11, 178, 122, 0.2);
          .item-icon {
            color: #0bb27a;
          }
          .item-text {
            color: #0bb27a;
          }
        }
      }
    }
  }
  .theme-box {
    width: 100%;
    margin-top: 16px;
    background: #fff;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    overflow-y: auto;
    overflow-x: hidden;
    height: 70px;
    border-radius: 3px;
    cursor: pointer;
    background: url(/src/images/theme_bg.png) no-repeat top center;
    background-size: cover;
    position: relative;
    .tips-title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
      color: #fff;
      .tips-icon {
        font-size: 26px;
        margin-right: 10px;
        vertical-align: middle;
      }
    }
  }
}
/* 弹出层样式 */
.made-template {
  display: flex;
  .preview-box {
    width: 378px;
    position: relative;
    .creat-title {
      text-align: center;
      margin-top: 20px;
      font-size: 18px;
      color: #3cc195;
    }
    .effect {
      position: relative;
      display: inline-block;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      border: solid 1px #e6e6e6;
      padding: 12px 20px;
      border-radius: 8px;
      padding-top: 10px;
      cursor: pointer;
      margin: 0 auto;
      margin-top: 30px;
      .icon {
        display: inline-block;
        padding: 8px;
        margin: 0 6px;
        border-radius: 4px;
        margin-bottom: 10px;
      }
      .effect-name {
        max-width: 140;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .instructions {
      margin-top: 50px;
      > p {
        text-indent: 50px;
        margin-bottom: 10px;
        font-size: 13px;
      }
    }
  }
  .made-temform {
    flex: 1;
    padding: 16px 16px 30px 20px;
    .icon-list {
      margin-top: 16px;
      padding: 10px;
      border: 1px solid #ccc;
      height: 320px;
      overflow: hidden;
      overflow-y: auto;
    }
    .start-btn {
      margin-top: 20px;
      width: 100%;
    }
  }
}
</style>
