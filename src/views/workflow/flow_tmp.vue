<template>
  <div class="app-container">
    <el-row :gutter="20" class="flow-tmp">
      <el-col :span="24">
        <div class="tmp-step">
          <div class="step-item">
            <svg-icon icon-class="step_right" class="right-icon" />
            <span class="step-icon">
              <svg-icon icon-class="component" class="icon" />
            </span>
            <h4 class="step-title">选择分类</h4>
          </div>
          <div class="step-item">
            <svg-icon icon-class="step_right" class="right-icon" />
            <span class="step-icon">
              <svg-icon icon-class="flow_tmp" class="icon" />
            </span>
            <h4 class="step-title">新建模板</h4>
          </div>
          <div class="step-item">
            <svg-icon icon-class="step_right" class="right-icon" />
            <span class="step-icon">
              <svg-icon icon-class="tmp_save" class="icon" />
            </span>
            <h4 class="step-title">保存模板</h4>
          </div>
          <div class="step-item">
            <span class="step-icon">
              <svg-icon icon-class="tmp_release" class="icon" />
            </span>
            <h4 class="step-title">发布模板</h4>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button type="text" icon="el-icon-plus" @click="typeDialog=true" style="width:100%; font-size:14px">创建分类</el-button>
        <el-menu default-active="0" @select="handleSelect">
          <el-menu-item v-for="(item, index) in classifyData" :key="item.id" :index="index + ''">
            <i class="el-icon-menu"></i>
            <span slot="title">{{item.Type_Name}}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <ul class="template-ul">
          <li class="template-li" v-for="(info, list) in tempData" :key="list" @click="editTemp(info.Id)">
            <span class="icon" :style="{backgroundColor: info.BackgroundColor}">
              <CteatIcon :icon="info.Icon"></CteatIcon>
            </span>
            <p>{{info.TempName}}</p>
          </li>
          <li class="template-li" @click="creatTmp">
            <span class="icon_add">
              <svg-icon icon-class="add_tmp" class="svg_add" />
            </span>
            <p>新建模板</p>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="newModal" title="创建一个新模板" width="860px" custom-class="show-creat-modal">
      <div class="made-template">
        <div class="preview-box">
          <h4 class="creat-title">预览模板外观</h4>
          <div class="effect">
            <span class="icon" :style="{backgroundColor: flowForm.BackgroundColor}">
              <CteatIcon :icon="iconText"></CteatIcon>
            </span>
            <p>{{flowForm.TempName}}</p>
          </div>
        </div>
        <el-form :model="flowForm" :rules="ruleflowForm" ref="flows" label-width="100px" class="made-temform">
          <el-form-item label="模板名称" prop="TempName">
            <div style="width: 350px;">
              <el-input v-model="flowForm.TempName" placeholder="请输入模板名称"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="封面底色" prop="BackgroundColor">
            <el-color-picker v-model="flowForm.BackgroundColor" show-alpha :predefine="predefineColors">
            </el-color-picker>
          </el-form-item>
          <el-form-item label="请选择模板图标" label-width="160" prop="Icon">
          </el-form-item>
          <div class="icon-list">
            <SelectIcons @selected-icon="selectIcon" :hasactive="!newModal"></SelectIcons>
          </div>
          <el-button type="primary" class="start-btn" @click="startMade" :loading="tmpLoading">{{tmpLoading ? '创建中...' : '开始创建'}}</el-button>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog title="创建 / 修改分类" :visible.sync="typeDialog">
      <el-form :model="typeForm" ref="typeForm">
        <el-form-item label="名称" prop="Type_Name" :rules="[{required:true,message:'请输入名称'},{max:10,min:1,message:'最长10个字符'}]">
          <el-input v-model="typeForm.Type_Name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="Type_Description" :rules="[{max:10,min:1,message:'最长200个字符'}]">
          <el-input v-model="typeForm.Type_Description" placeholder="请输入说明"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="typeDialog=false">取消</el-button>
        <el-button type="primary" :loading="saveing" @click="saveType">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTempTypeList, addTempType } from '@/api/app/templatetype'
import { getTempListByType, addTemp } from '@/api/app/templatemain'
import SelectIcons from '@/views/components/SelectIcons'
export default {
  name: 'flow_tmpWorkflow',
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
      saveing: false,
      typeDialog: false,
      newModal: false, // 新增模板弹出窗口
      classifyData: [], // 左侧分类数据
      tempData: [], // 模板列表
      flowForm: {
        TempName: '',
        BackgroundColor: '',
        Icon: ''
      }, // 新增模板表单
      typeForm: {},
      ruleflowForm: {
        TempName: [
          { required: true, message: '请填写模板名称', trigger: 'blur' },
          {
            min: 2,
            max: 12,
            message: '长度在 2 到 12 个字符',
            trigger: 'blur'
          }
        ],
        BackgroundColor: [
          { required: true, message: '请选择背景颜色', trigger: 'change' }
        ],
        Icon: [{ required: true, message: '请选择图标', trigger: 'change' }]
      }, // 新增模板表单验证
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
      ], // 颜色选择器预定义
      selectId: '' // 当前选择的分类id
    }
  },
  methods: {
    saveType() {
      this.saveing = true
      this.$refs.typeForm
        .validate()
        .then(() => {
          addTempType(this.typeForm)
            .then(res => {
              this.getClass()
              this.typeDialog = false
              this.saveing = false
            })
            .catch(() => {
              this.saveing = false
            })
        })
        .catch(() => {
          this.saveing = false
        })
    },
    creatTmp() {
      if (this.$refs['flows']) {
        this.$refs['flows'].resetFields()
      }
      this.iconText = ''
      this.newModal = true
    },
    getClass() {
      getTempTypeList(this.selectId).then(res => {
        this.classifyData = res.data
        if (this.selectId === '') {
          this.selectId = this.classifyData[0].Type_Id
          this.flowForm.TypeId = this.selectId
          this.initTemplateList()
        }
      })
    },
    selectIcon(icon) {
      this.iconText = icon
      this.flowForm.Icon = icon
    },
    handleSelect(key, keyPath) {
      this.selectId = this.classifyData[key].Type_Id
      this.flowForm.TypeId = this.selectId
      this.initTemplateList()
    },
    initTemplateList() {
      // console.log(nowId)
      getTempListByType(this.selectId).then(res => {
        this.$nextTick(() => {
          this.tempData = res.data
        })
      })
    },
    startMade() {
      this.tmpLoading = true
      this.$refs['flows'].validate(valid => {
        if (valid) {
          addTemp(this.flowForm)
            .then(res => {
              this.initTemplateList()
              this.$router.push({ path: '/hide/flow_creat/' + res.data.Id })
              this.newModal = false
              this.tmpLoading = false
            })
            .catch(() => {
              this.tmpLoading = false
            })
        } else {
          this.tmpLoading = false
        }
      })
    },
    editTemp(id) {
      this.$router.push({ path: '/hide/flow_creat/' + id })
    }
  },
  mounted() {
    // 一般在此调用初始化函数
    this.getClass()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 重置样式，用于重写element-ui样式，自定义自己的样式 */
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 自定义样式，由于有scoped属性，所以只对当前tamplate中的 html生效，优化打包效率*/
.app-container {
  .flow-tmp {
    /* 模板步骤 */
    .tmp-step {
      display: flex;
      height: 152px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      padding-top: 16px;
      margin-bottom: 16px;
      .step-item {
        flex: 1;
        position: relative;
        .right-icon {
          position: absolute;
          font-size: 26px;
          color: #ccc;
          right: 0;
          top: 50%;
          transform: translate(50%, -100%);
        }
        .step-icon {
          position: absolute;
          width: 72px;
          height: 72px;
          background-color: rgba(11, 178, 122, 0.4);
          border-radius: 50%;
          margin-bottom: 10px;
          top: 0px;
          left: 50%;
          transform: translateX(-50%);
          overflow: hidden;
          box-sizing: border-box;
          padding: 18px;
          > .icon {
            font-size: 40px;
            color: #fff;
          }
        }
        > .step-title {
          text-align: center;
          font-size: 16px;
          margin-top: 86px;
        }
      }
    }
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
    padding: 0px 16px 0px 20px;
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
