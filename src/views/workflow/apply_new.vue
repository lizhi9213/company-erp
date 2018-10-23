<template>
    <div class="app-container">
        <div class="header-top clearfix">
            <el-button-group style="float: right; margin-left: 14px;">
                <el-button type="primary">我创建的</el-button>
                <el-button>全部流程</el-button>
            </el-button-group>
            <div style="widht: 240px; float: right;">
                <el-input placeholder="请输入内容" v-model="keyWord" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </div>
        </div>
        <el-row :gutter="20" class="flow-tmp" :style="{height: ListHeight + 'px'}">
            <el-col :span="4">
                <el-menu default-active="0" @select="handleSelect" style="padding-top: 14px;">
                    <el-menu-item v-for="(item, index) in classifyData" :key="item.id" :index="index + ''">
                        <i class="el-icon-menu"></i>
                        <span slot="title">{{item.name}}</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="20">
                <ul class="template-ul">
                    <li class="template-li" v-for="(info, list) in tempData" :key="list" @click="byApplyingFor(info.id)">
                        <span class="icon" :style="{backgroundColor: info.IconColor}">
                            <CteatIcon :icon="info.IconText"></CteatIcon>
                        </span>
                        <p>{{info.TmpName}}</p>
                    </li>
                </ul>
            </el-col>
        </el-row>
        <Modal v-model="newFlowModal" class="apply-right-model" footer-hide :width="1100" :styles="{'margin-right':'10px','height': '100%', 'top': '0px'}" :transfer="false" :transition-names="['move-right','fade']">
            <h3 slot="header">测试应用</h3>
            <div class="apply-form">
                <div class="form-header">
                    <div class="form-header-title">
                        <p class="header-top"></p>
                        <h3 class="header-h3">{{applyName}}</h3>
                    </div>
                    <div class="form-header-main">
                        <div class="main-row">
                            <pre v-if="applyDesc !== ''" class="edit-content">{{applyDesc}}</pre>
                        </div>
                        <div v-if="attachList.length !== 0" class="main-row" style="padding-top: 0px;">
                            <ul class="attachment-list">
                                <li class="list-item" v-for="(item, index) in attachList" :key="index">
                                    <a class="download-btn" :href="item.FileSrc" download="" title="下载该附件">
                                        <i class="el-icon-document"></i>{{item.FileName}}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="form-body">
                    <el-row v-for="(item, index) in flowFormData" :key="index">
                        <el-col class="form-list-item" v-for="(info, list) in item" :key="list" :span="info.scale">
                            <div v-if="info.type === 1" class="preview-item">
                                <i v-if="info.content === ''">描述文字内容</i>
                                <div v-if="info.content !== ''" v-html="info.content"></div>
                            </div>
                            <div v-if="info.type !== 1" class="preview-item">
                                <p class="item-label">{{info.label}}
                                    <span v-if="info.required" class="require">*</span>
                                </p>
                                <p v-if="info.tips !== ''" class="item-tips">{{info.tips}}</p>
                                <div class="item-value">
                                    <el-input v-if="info.type === 2 || info.type === 8" placeholder="请输入内容" v-model="info.default"></el-input>
                                    <el-input v-if="info.type === 3" type="textarea" :rows="4" placeholder="请输入内容" v-model="info.default"></el-input>
                                    <el-date-picker v-if="info.type === 4" v-model="info.date" :format="info.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :value-format="info.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :type="info.precise ? 'datetime' :'date'" placeholder="选择日期" style="width: 100%;"></el-date-picker>
                                    <el-input v-if="info.type === 5 || info.type === 6 || info.type === 7" placeholder="请输入内容" v-model="info.default">
                                        <svg-icon v-if="info.type === 5" slot="prefix" icon-class="g_email" class="title-icon" />
                                        <svg-icon v-if="info.type === 6" slot="prefix" icon-class="g_phone" class="title-icon" />
                                        <svg-icon v-if="info.type === 7" slot="prefix" icon-class="g_number" class="title-icon" />
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
                                            <span v-if="info.listText !== '' && info.limitType">只能上传{{info.listText}}类型文件，</span>文件大小不超过{{info.maxSize}}MB</div>
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
                                    <rich-editor v-if="info.type === 15" v-model="info.value"></rich-editor>
                                    <el-select v-if="info.type === 17 || info.type === 18" v-model="info.default" multiple placeholder="选择或输入关键字搜索" style="width: 100%;">
                                        <el-option v-for="item in info.scope" :key="item.id" :label="item.label" :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <iviewTable v-if="info.type === 16" border :columns="info.tablecolumns" :data="info.tabledata"></iviewTable>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="submit-btns">
                    <el-button>暂存</el-button>
                    <el-button type="primary">提交</el-button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import {
  getClassList,
  getApplyList,
  getApplyForm
} from '@/api/workflow/apply_new'
import richEditor from '@/views/components/RichEditor'
export default {
  name: 'apply_new',
  components: {
    richEditor: richEditor,
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
      classifyData: [], // 左侧分类数据
      tempData: [], // 模板列表
      selectId: '', // 当前选择的分类id
      keyWord: '', // 搜索关键字
      ListHeight: '', // 分类列表盒子高度
      newFlowModal: false, // 新建申请
      flowFormData: [], // 申请表单数据
      applyName: '', // 当前选择的申请的名称
      applyDesc: '', // 当前选择的申请的描述
      attachList: [] // 当前选择的申请的附件列表
    }
  },
  methods: {
    initClassfly() {
      // 获取左侧申请分类
      getClassList().then(res => {
        console.log(res.data)
        this.classifyData = res.data
        if (this.selectId === '') {
          this.selectId = this.classifyData[0].id
          this.initTemplateList()
        }
      })
    },
    initTemplateList() {
      // 获取当前分类下的申请列表
      const _this = this
      // console.log(nowId)
      getApplyList(this.selectId).then(res => {
        console.log(res.data)
        this.$nextTick(() => {
          _this.tempData = res.data
        })
      })
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      this.selectId = this.classifyData[key].id
      this.initTemplateList()
    },
    byApplyingFor(id) {
      // 点击当前申请
      console.log(id)
      this.getApplyFormDatas(id)
      this.newFlowModal = true
    },
    getApplyFormDatas(id) {
      getApplyForm(id).then(res => {
        console.log(res.data)
        this.flowFormData = res.data.FormData
        this.applyName = res.data.applyName
        this.applyDesc = res.data.applyDesc
        this.attachList = res.data.attachList
      })
    }
  },
  mounted() {
    // 一般在此调用初始化函数
    this.initClassfly()
    this.ListHeight = window.innerHeight - 170
    const isSupportDownload = 'download' in document.createElement('a') // 当前浏览器是否支持a标签下载功能
    if (isSupportDownload) {
      console.log('支持下载功能')
    } else {
      console.log('不支持下载功能')
      if (this.attachList.length !== 0) {
        this.$message.warning('当前浏览器不支持下载功能，请下载最新版本浏览器')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 重置样式，用于重写element-ui样式，自定义自己的样式 */
.apply-form {
  /* 中间 表单头部样式*/
  .form-body {
    .el-row {
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
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 自定义样式，由于有scoped属性，所以只对当前tamplate中的 html生效，优化打包效率*/
.app-container {
  .header-top {
    margin-bottom: 14px;
  }
  .flow-tmp {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
    overflow-y: auto;
    /* 右侧模板列表 */
    .template-ul {
      margin-top: 20px;
      .template-li {
        list-style: none;
        text-align: center;
        display: inline-block;
        border: solid 1px #e6e6e6;
        padding: 12px 20px;
        border-radius: 8px;
        padding-top: 10px;
        cursor: pointer;
        margin-right: 16px;
        margin-bottom: 20px;
        .icon {
          display: inline-block;
          padding: 10px;
          margin: 0 6px;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        .icon_add {
          display: inline-block;
          margin: 0 auto;
          padding: 10px;
          padding-bottom: 17px;
          background-color: transparent;
          border-radius: 4px;
          margin-bottom: 0;
          .svg_add {
            font-size: 30px;
          }
        }
      }
    }
  }
}
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
.apply-form {
  width: 100%;
  padding: 0 calc(50% - 440px);
  margin: 0 auto;
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
          width: 100%;
          overflow: hidden;
          white-space: normal;
        }
        .attachment-list {
          list-style: none;
          .list-item {
            padding: 0px 10px;
            margin-bottom: 10px;
            a {
              color: #409eff;
              i {
                margin-right: 6px;
              }
            }
          }
        }
      }
    }
  }
  .form-body {
    margin-top: 16px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .form-list-item {
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
  .submit-btns {
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
