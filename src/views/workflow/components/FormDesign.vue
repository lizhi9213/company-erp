<template>
    <div class="form-box" :class="{'is-edit': IsEdit}">
        <div class="form-header">
            <div class="form-header-title">
                <p class="header-top"></p>
                <h3 class="header-h3">测试应用</h3>
            </div>
            <div class="form-header-main">
                <div class="main-row">
                    <p class="main-row-item" v-if="!richEdit && content === ''" @click="richEdit = true">
                        <svg-icon icon-class="g_msg" class="row-icon" />添加应用描述</p>
                    <div class="edit-content" v-if="!richEdit && content !== ''" ref="editcontent" @click="richEdit = true" v-html="content"></div>
                    <rich-editor class="flow-detail" v-show="richEdit" v-model="content">
                    </rich-editor>
                    <el-button v-show="richEdit" class="done-btn" @click="richEdit = false" type="primary">完成</el-button>
                </div>
                <div class="main-row" style="padding-top: 0px;">
                    <el-upload class="upload-box" action="/nodejs/flow/fileUpload" :on-change="unploadChange" :on-success="handleSuccess" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :file-list="fileList">
                        <el-button v-if="fileList.length === 0" size="small" type="primary" class="add-btn">
                            <svg-icon icon-class="g_upload" class="row-icon" />添加附件
                        </el-button>
                        <el-button v-if="fileList.length !== 0" size="small" type="primary" class="upload-btn">
                            <svg-icon icon-class="g_add" class="row-icon" />上传附件
                        </el-button>
                    </el-upload>
                </div>
            </div>
        </div>
        <div class="form-body">
            <div class="form-empty-box" v-if="viewList.length === 0">
                <img src="/src/images/empty-creation.png" alt="通过左侧表单模块创建表单">
                <p>点击左侧表单模块创建表单</p>
            </div>
            <draggable v-model="viewList" :options="{group:'formBody'}" @start="drag=true" @end="drag=false" class="dragg-box" @update="handleDraggEnd">
                <el-row class="dragg-tag" v-for="(item, index) in designData" :key="index">
                    <el-col class="form-list-item" v-for="(info, list) in item" :key="list" :span="info.scale" :class="{'current': info.active}">
                        <!-- 描述文字 -->
                        <div v-if="info.type === 1" class="preview-item" @click="handleItemSel(index, list)">
                            <i v-if="info.content === ''">描述文字内容</i>
                            <div v-if="info.content !== ''" v-html="info.content"></div>
                        </div>
                        <!-- 单行文字/多行文字/日期/邮箱/手机/数字/链接/单项选择 -->
                        <div v-if="info.type !== 1" class="preview-item" @click="handleItemSel(index, list)">
                            <p class="item-label">{{info.label}}
                                <span v-if="info.required" class="require">*</span>
                            </p>
                            <p v-if="info.tips !== ''" class="item-tips">{{info.tips}}</p>
                            <div class="item-value">
                                <div class="mask"></div>
                                <el-input v-if="info.type === 2 || info.type === 8" placeholder="请输入内容" v-model="info.default"></el-input>
                                <el-input v-if="info.type === 3" type="textarea" :rows="4" placeholder="请输入内容" v-model="info.default"></el-input>
                                <el-date-picker v-if="info.type === 4" v-model="info.date" :format="info.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :value-format="info.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :type="info.precise ? 'datetime' :'date'" placeholder="选择日期" style="width: 100%;"></el-date-picker>
                                <el-input v-if="info.type === 5 || info.type === 6 || info.type === 7" placeholder="请输入内容" v-model="info.default">
                                    <svg-icon slot="prefix" :icon-class="feildData.icon" class="title-icon" />
                                </el-input>
                                <el-radio-group v-if="info.type === 9" :class="{'is-vertical' : info.arrange === 2}" v-model="info.radio">
                                    <el-radio v-for="(item, index) in info.childs" :key="index + 3.05" :label="index">{{item.label}}</el-radio>
                                </el-radio-group>
                                <el-select v-if="info.type === 10" v-model="info.select" filterable placeholder="选择或输入关键字搜索" style="width: 100%;">
                                    <el-option v-for="(item, index) in info.childs" :key="index" :label="item.label" :value="index">
                                    </el-option>
                                </el-select>
                                <el-checkbox-group v-if="info.type === 11" :class="{'is-vertical' : info.arrange === 2}" v-model="info.checkbox">
                                    <el-checkbox v-for="(item, index) in info.childs" :key="index + 3.26" :label="index">{{item.label}}</el-checkbox>
                                </el-checkbox-group>
                                <el-date-picker v-if="info.type === 13" v-model="info.daterange" style="width: 100%;" :format="info.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :value-format="info.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :type="info.precise ? 'datetimerange' :'daterange'" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                </el-date-picker>
                                <el-upload v-if="info.type === 12" class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖到此处，或
                                        <em>点击上传</em>
                                    </div>
                                    <div class="el-upload__tip" slot="tip">
                                        <span v-if="listText !== '' && info.limitType">只能上传{{listText}}类型文件，</span>文件大小不超过{{info.maxSize}}MB</div>
                                </el-upload>
                                <el-row v-if="info.type === 14" :gutter="8" class="select-img-list">
                                    <el-checkbox-group v-model="info.selectimg">
                                        <el-col :span="6" v-for="(item, index) in info.childs" :key="index + 3.05">
                                            <div class="picture-box">
                                                <img :src="item.imgurl" />
                                                <el-checkbox :label="index">{{item.label}}</el-checkbox>
                                            </div>
                                        </el-col>
                                    </el-checkbox-group>
                                </el-row>
                                <rich-editor v-if="info.type === 15" v-model="content01"></rich-editor>
                                <el-select v-if="info.type === 17 || info.type === 18" v-model="info.default" multiple placeholder="选择或输入关键字搜索" style="width: 100%;">
                                    <el-option v-for="item in info.scope" :key="item.id" :label="item.label" :value="item.id">
                                    </el-option>
                                </el-select>
                                <iviewTable v-if="info.type === 16" border :columns="info.tablecolumns" :data="info.tabledata"></iviewTable>
                            </div>
                        </div>
                        <div class="opera-box">
                            <span class="delete opera-item" @click="delCrew(index, list)">
                                <i class="el-icon-delete"></i>
                            </span>
                            <span class="copy opera-item" @click="copyGroup(index, list)">
                                <i class="el-icon-edit"></i>
                            </span>
                            <span v-if="according(index, list, 'up')" class="merge-top opera-item" @click="elevator(index, list, 'up')">
                                <i class="el-icon-back"></i>
                            </span>
                            <span v-if="according(index, list, 'down')" class="merge-bottom opera-item" @click="elevator(index, list, 'down')">
                                <i class="el-icon-back"></i>
                            </span>
                            <span v-if="according(index, list, 'left')" class="l-swop opera-item" @click="interchange(index, list, 'toleft')">
                                <i class="el-icon-sort"></i>
                            </span>
                            <span v-if="according(index, list, 'right')" class="r-swop opera-item" @click="interchange(index, list, 'toright')">
                                <i class="el-icon-sort"></i>
                            </span>
                        </div>
                    </el-col>
                </el-row>
            </draggable>
        </div>
    </div>
</template>

<script>
import { delUpFiel } from '@/api/workflow/flow_tmp'
// 富文本编辑器
import richEditor from '@/views/components/RichEditor'
// 拖拽组件
import draggable from 'vuedraggable'
export default {
  name: 'FormDesign',
  props: {
    IsEdit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    draggable,
    richEditor
  },
  watch: {
    viewList: {
      handler: function(val, oldVal) {
        // console.log(val)
        this.designData = []
        this.$nextTick(() => {
          this.designData = val
        })
      },
      deep: true
    },
    content(val) {
      // console.log(val)
      this.$store.commit('formOnChange', true)
    }
  },
  data() {
    // 数据data在这里
    return {
      richEdit: false, // 应用描述富文本显示切换
      content: '', // 应用描述富文本modal
      richBar: [
        'bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript',
        'hr bullist numlist link image charmap preview insertdatetime table emoticons forecolor backcolor fullscreen'
      ], // 富文本配置项
      fileList: [], // 上传到文件列表（添加附件）
      content01: '', // 预览项展示富文本
      designData: [] // 预览页面数据驱动
    }
  },
  computed: {
    viewList() {
      return this.$store.state.workflow.viewList
    },
    feildData() {
      return this.$store.state.workflow.feildData
    },
    currently() {
      return this.$store.state.workflow.currently
    },
    listText() {
      if (this.feildData.name !== 'fileupload') {
        return ''
      } else {
        const a = this.currently[0]
        const b = this.currently[1]
        let fieldForm = {}
        fieldForm = this.viewList[a][b]
        // console.log(this.viewList[a])
        if (this.viewList[a][b]) {
          // 继续处理数据，用来显示到页面中部限制类型
          // console.log(fieldForm.fileType)
          const textArr = fieldForm.fileType.map(m => {
            return m.label
          })
          fieldForm.listText = textArr
          return textArr.join(' / ')
        } else {
          fieldForm.listText = ''
          return ''
        }
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      // 文件列表移除文件时的钩子
      // console.log(file)
      this.fileList = fileList
    },
    beforeRemove(file, fileList) {
      // 删除文件之前的钩子
      let hasRemove = false
      new Promise((resolve, reject) => {
        this.$confirm(`确定移除 ${file.name}？`).then(() => {
          delUpFiel(file.id).then(res => {
            console.log(res.data)
            if (res.data.code) {
              this.$message.success(res.data.msg)
              resolve()
            } else {
              this.$message.error(res.data.msg)
            }
          })
        })
      }).then(() => {
        hasRemove = true
      })
      return hasRemove
    },
    handleSuccess(response, file, fileList) {
      console.log(response)
      console.log(file)
      const fileObj = {
        name: file.name,
        url: file.url
      }
      if (response.code) {
        this.$nextTick(() => {
          fileObj.id = response.id
          this.fileList.push(fileObj)
        })
      }
    },
    unploadChange() {
      // 上传状态发生改变
      this.$store.commit('formOnChange', true)
    },
    handleDraggEnd(e) {
      // 拖拽回调
      console.log(e)
    },
    editorChange(val) {
      console.log(val)
      // 流程模板描述
      this.content = val
    },
    handleItemSel(a, b) {
      const coor = [a, b]
      // 选中组员处理
      this.$store.commit('setCurrent', coor)
    },
    according(a, b, c) {
      // 处理上下左右按钮显示处理
      const group = this.viewList[a]
      // 特殊处理
      if (c === 'up' || c === 'down' || c === 'left' || c === 'right') {
        // 当前为文件上传/表格,不显示上下左右
        if (
          this.feildData.id === 16 ||
          this.feildData.id === 12 ||
          this.feildData.id === 14 ||
          this.feildData.id === 15
        ) {
          return false
        }
      }

      // 当上一级为不可分配比例行时
      if (c === 'up' && a > 0) {
        if (
          this.viewList[a - 1][0].type === 16 ||
          this.viewList[a - 1][0].type === 12 ||
          this.viewList[a - 1][0].type === 15
        ) {
          return false
        }
      }
      // 当下一级为不可分配比例行时
      if (c === 'down' && a < this.viewList.length - 1) {
        if (
          this.viewList[a + 1][0].type === 16 ||
          this.viewList[a + 1][0].type === 12 ||
          this.viewList[a + 1][0].type === 15
        ) {
          return false
        }
      }

      // 上
      if (c === 'up') {
        if (a > 0) {
          const prior = this.viewList[a - 1] // 前一组
          return prior.length < 4
        } else {
          return false
        }
      }

      // 下
      if (c === 'down') {
        return group.length > 1
      }

      // 左
      if (c === 'left') {
        return b > 0 && group.length > 1
      }

      // 右
      if (c === 'right') {
        return b < group.length - 1 && group.length > 1
      }
    },
    delCrew(a, b) {
      const coor = [a, b]
      // 删除组员
      this.$store.commit('delFeildGroup', coor)
      // 表单编辑状态改变
      this.$store.commit('formOnChange', true)
      // console.log(this.$store.state.workflow.viewList)
    },
    copyGroup(a, b) {
      const coor = [a, b]
      // 复制当前组员并将它在当前组下创建一个新组，然后放入当前组员副本
      this.$store.commit('copyFeildCrew', coor)
      // 表单编辑状态改变
      this.$store.commit('formOnChange', true)
    },
    elevator(a, b, c) {
      const coor = [a, b, c]
      // 组员上下跨组处理
      this.$store.commit('disposeElevator', coor)
      // 表单编辑状态改变
      this.$store.commit('formOnChange', true)
    },
    interchange(a, b, c) {
      const coor = [a, b, c]
      // 组员左右交换处理
      this.$store.commit('interchange', coor)
      // 表单编辑状态改变
      this.$store.commit('formOnChange', true)
    }
  },
  created() {
    this.designData = this.viewList
  },
  mounted() {}
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 重置样式，用于重写element-ui样式，自定义自己的样式 */
.form-box {
  /* 中间 表单头部样式*/
  .form-header-main {
    .main-row {
      position: relative;
      .flow-detail {
        .ql-container {
          padding-bottom: 40px;
        }
      }
      .done-btn {
        position: absolute;
        bottom: 18px;
        right: 20px;
      }
      .upload-box {
        .el-upload {
          display: block;
          text-align: left;
          .add-btn {
            width: 100%;
            background-color: #fff;
            border: none;
            line-height: 32px;
            color: #6b737b;
            padding: 0 10px;
            text-align: left;
            .row-icon {
              margin-right: 5px;
              color: #cacad3;
              font-size: 16px;
            }
            &:hover {
              background-color: #ebebf0;
            }
          }
          .upload-btn {
            width: 100%;
            text-align: left;
            padding: 6px 10px;
            .row-icon {
              margin-right: 5px;
              color: #fff;
              font-size: 13px;
            }
          }
        }
      }
    }
  }
  .form-body {
    .dragg-box {
      margin-bottom: 12px;
      .dragg-tag.el-row {
        cursor: move;
        display: flex;
        border-bottom: 1px solid #ebebf0;
        .form-list-item {
          border-right: 1px solid #ebebf0;
          position: relative;
          .preview-item {
            height: 100%;
            .item-value {
              .el-input {
                .el-input__prefix {
                  line-height: 32px;
                  left: 8px;
                  .title-icon {
                    font-size: 13px;
                  }
                }
              }
              .el-radio-group.is-vertical {
                .el-radio {
                  display: block;
                  margin-left: 0;
                  margin-top: 10px;
                }
              }
              .el-checkbox-group.is-vertical {
                .el-checkbox {
                  display: block;
                  margin-left: 0;
                  margin-top: 10px;
                }
              }
              .select-img-list {
                .picture-box {
                  .el-checkbox {
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                }
              }
              .edit-table {
              }
              .ivu-table-wrapper {
                .ivu-table-body {
                  .ivu-table-cell {
                    .el-checkbox-group {
                      .el-checkbox {
                        &:nth-of-type(1) {
                          margin-left: 30px;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          &:hover {
            background: #fafafb;
            .opera-box {
              .opera-item.delete {
                display: flex;
              }
            }
          }
          /* 当前选中 */
          &.current {
            background-color: rgba(11, 178, 122, 0.2);
            &:hover {
              background-color: rgba(11, 178, 122, 0.2);
            }
            .opera-box {
              .delete {
                display: flex;
              }
              .copy {
                display: flex;
              }
              .merge-top {
                display: flex;
              }
              .merge-bottom {
                display: flex;
              }
              .l-swop {
                display: flex;
              }
              .r-swop {
                display: flex;
              }
            }
          }
          &.el-col-12 {
            .preview-item {
              .item-value {
                .upload-demo {
                  .el-upload--text {
                    width: 100%;
                    .el-upload-dragger {
                      width: 100%;
                    }
                  }
                }
              }
            }
          }
          &.el-col-8 {
            .preview-item {
              .item-value {
                .upload-demo {
                  .el-upload--text {
                    width: 100%;
                    .el-upload-dragger {
                      width: 100%;
                    }
                  }
                }
              }
            }
          }
          &.el-col-6 {
            .preview-item {
              .item-value {
                .upload-demo {
                  .el-upload--text {
                    width: 100%;
                    .el-upload-dragger {
                      width: 100%;
                    }
                  }
                }
              }
            }
          }
        }
        .form-list-item:nth-last-of-type(1) {
          border-right: none;
        }
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 自定义样式，由于有scoped属性，所以只对当前tamplate中的 html生效，优化打包效率*/
/* 表单样式 */
.form-box {
  margin-left: 10%;
  transition: all 0.3s;
  &.is-edit {
    margin-left: 0;
  }
  .form-header {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .form-header-title {
      border-bottom: 1px solid #ebebf0;
      .header-top {
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        height: 20px;
        background: linear-gradient(
          270deg,
          rgba(11, 178, 122, 0.2),
          rgba(11, 178, 122, 0.8)
        );
      }
      .header-h3 {
        line-height: 60px;
        padding: 0 10px;
        font-size: 16px;
      }
    }
    .form-header-main {
      .main-row {
        position: relative;
        min-height: 52px;
        padding: 10px;
        .main-row-item {
          display: flex;
          align-items: center;
          height: 32px;
          padding: 0 10px;
          color: #6b737b;
          border-radius: 2px;
          cursor: pointer;
          .row-icon {
            margin-right: 5px;
            color: #cacad3;
            font-size: 16px;
          }
          &:hover {
            background-color: #ebebf0;
          }
        }
        .edit-content {
          padding: 0 10px;
          color: #6b737b;
          border-radius: 2px;
          line-height: 32px;
          &:hover {
            background-color: #ebebf0;
          }
        }
      }
    }
  }
  .form-body {
    margin-top: 16px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .form-empty-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      > img {
        width: 121px;
        vertical-align: middle;
        border-style: none;
      }
    }
    .form-list-item {
      .opera-box {
        .opera-item {
          display: none;
          position: absolute;
          width: 20px;
          height: 20px;
          margin: auto;
          border-radius: 50%;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.02);
          z-index: 2;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &.delete {
            background: #f66e1f;
            right: -10px;
            top: -10px;
            color: #fff;
          }
          &.copy {
            left: -10px;
            bottom: -10px;
            background: #fff;
            color: rgb(11, 178, 122);
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
          }
          &.merge-top {
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            color: rgb(11, 178, 122);
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
            > i {
              transform: rotate(90deg);
            }
          }
          &.merge-bottom {
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            color: rgb(11, 178, 122);
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
            > i {
              transform: rotate(270deg);
            }
          }
          &.l-swop {
            left: -10px;
            top: 50%;
            transform: translateY(-50%);
            background: #fff;
            color: rgb(11, 178, 122);
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
            > i {
              transform: rotate(90deg);
            }
          }
          &.r-swop {
            right: -10px;
            top: 50%;
            transform: translateY(-50%);
            background: #fff;
            color: rgb(11, 178, 122);
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
            > i {
              transform: rotate(90deg);
            }
          }
        }
      }
      .preview-item {
        display: flex;
        flex-direction: column;
        padding: 15px 20px 20px;
        .item-label {
          font-size: 14px;
          padding-bottom: 5px;
          .require {
            color: #f26245;
            margin-left: 5px;
          }
        }
        .item-tips {
          color: #b4b4bc;
          margin-bottom: 10px;
          font-size: 12px;
          line-height: 1.5;
        }
        .item-value {
          position: relative;
          .mask {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 999;
          }
          .select-img-list {
            padding-top: 6px;
            .picture-box {
              width: 150px;
              margin: 0 auto;
              margin-top: 14px;
              text-indent: 6px;
              min-height: 200px;
              background: #fafafb;
              border-radius: 3px;
              padding: 5px;
              transition: 0.3s all;
              border: 1px solid #f5f5f7;
              > img {
                display: block;
                width: 100%;
                height: 154px;
                border-radius: 2px;
                margin-bottom: 8px;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1360px) {
  .form-box {
    .form-body {
      .form-list-item {
        .preview-item {
          .item-value {
            .select-img-list {
              .picture-box {
                width: 96%;
                min-height: 160px;
                > img {
                  height: 116px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
