<template>
  <div class="app-container">
    <div class="employee">
      <el-form :model="addForm" :rules="rulesaddform" ref="addForm" style="margin-top:20px;" label-width="160px" class="demo-addForm">
        <el-row>
          <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
            <el-form-item label="姓名" prop="name">
              <el-input placeholder="请输入姓名" v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="AccountNo">
              <el-input placeholder="请输入账号" v-model="addForm.AccountNo"></el-input>
            </el-form-item>
            <el-form-item label="工号" prop="UserNo">
              <el-input placeholder="请输入…" v-model="addForm.UserNo"></el-input>
              <div class="tip-2uVhT" style="display:none">最新工号为：Y201835 (黄晓明)，
                <span @click="jobnumberModal = true" style="color:#0bb27a;cursor:pointer;">重新生成</span>
              </div>
            </el-form-item>
            <el-form-item label="手机号" prop="UserPhone">
              <el-input placeholder="请输入手机号" v-model="addForm.UserPhone"></el-input>
              <div class="tip-2uVhT">将用来发送入职通知短信</div>
            </el-form-item>
            <el-form-item label="生日" prop="BirthDate">
              <el-date-picker v-model="addForm.BirthDate" :editable="false" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" suffix-icon="el-icon-date"></el-date-picker>
            </el-form-item>
            <el-form-item label="证件类型" prop="CertType">
              <el-select v-model="addForm.CertType" placeholder="请选择">
                <el-option v-for="item in idtypeOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入职日期" prop="EntryDate">
              <el-date-picker v-model="addForm.EntryDate" :editable="false" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" suffix-icon="el-icon-date"></el-date-picker>
            </el-form-item>
            <el-form-item label="转正日期" prop="WorkDate">
              <el-date-picker v-model="addForm.WorkDate" :editable="false" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" suffix-icon="el-icon-date"></el-date-picker>
            </el-form-item>
            <el-form-item label="卡户行" prop="CardBank">
              <el-input placeholder="请输入银行卡类型" v-model="addForm.CardBank"></el-input>
            </el-form-item>
            <el-form-item class="icon-cascader" label="归属部门" prop="department">
              <!-- <el-cascader :options="departOptions" placeholder="请选择归属部门" change-on-select :clearable='true' expand-trigger="hover" @change="departChange">
              </el-cascader> -->
              <multiCascader width="240px" height="220px" v-model='addForm.department' placeholder="请选择归属部门" :options="departOptions" :indep='true' outputType="item"></multiCascader>
            </el-form-item>
            <el-form-item label="毕业院校" prop="School">
              <el-input placeholder="请输入毕业院校" v-model="addForm.School"></el-input>
            </el-form-item>
            <el-form-item label="学历" prop="Education">
              <el-select v-model="addForm.Education" placeholder="请选择学历">
                <el-option v-for="item in educationOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="户籍">
              <el-cascader :options="regDomicileOption" @active-item-change="handleRegDomChange" placeholder="请选择户籍地" :clearable='true' expand-trigger="hover" @change="ProvChange"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="addForm.sex">
                <el-radio label="1">男</el-radio>
                <el-radio label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="民族" prop="Nation">
              <el-select v-model="addForm.Nation" placeholder="请选择">
                <el-option v-for="item in nationOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="政治面貌" prop="OutLook">
              <el-select v-model="addForm.OutLook" placeholder="请选择">
                <el-option v-for="item in politicsOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="个人邮箱" prop="email">
              <el-input placeholder="请输入…" v-model="addForm.email"></el-input>
              <div class="tip-2uVhT">将用来发送入职通知邮件</div>
            </el-form-item>
            <el-form-item label="证件号" prop="CertNo">
              <el-input placeholder="请输入…" v-model="addForm.CertNo"></el-input>
            </el-form-item>
            <el-form-item label="招聘渠道" prop="UserSource">
              <el-select v-model="addForm.UserSource" placeholder="请选择">
                <el-option v-for="item in recruitOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="银行卡号" prop="BankCard">
              <el-input placeholder="请输入…" v-model="addForm.BankCard"></el-input>
            </el-form-item>
            <el-form-item label="开户行" prop="BankDeposit">
              <el-input placeholder="请输入…" v-model="addForm.BankDeposit"></el-input>
            </el-form-item>
            <el-form-item class="icon-cascader" label="归属职务" prop="duties">
              <!-- <el-cascader :options="dutiesOption" placeholder="请选择归属职务" change-on-select :clearable='true' expand-trigger="hover" @change="jobChange">
              </el-cascader> -->
              <multiCascader :options="dutiesOption" width="240px" height="220px" v-model='addForm.duties' placeholder="请选择归属职务" :indep='true' outputType="item"></multiCascader>
            </el-form-item>
            <el-form-item label="专业" prop="Major">
              <el-input placeholder="请输入…" v-model="addForm.Major"></el-input>
            </el-form-item>
            <el-form-item label="毕业时间" prop="GradDate">
              <el-date-picker v-model="addForm.GradDate" :editable="false" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" suffix-icon="el-icon-date"></el-date-picker>
            </el-form-item>
            <el-form-item label="居住地">
              <el-cascader :options="domicileOption" @active-item-change="handleDomChange" placeholder="请选择居住地" :clearable='true' expand-trigger="hover" @change="LiveProvChange"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
            <el-form-item label="详细地址" prop="LiveAddr">
              <el-input placeholder="请输入…" v-model="addForm.LiveAddr"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="和新员工打个招呼" prop="Memo">
          <el-input type="textarea" :rows="6" v-model="addForm.Memo"></el-input>
        </el-form-item>
        <div class="btn-flex">
          <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </div>
      </el-form>
      <Modal v-model="jobnumberModal" :width="560">
        <h3 slot="header">生成工号</h3>
        <div style="padding:20px;">
          <p style="text-align: center;font-size: 16px;">最新未用工号</p>
          <p style="text-align: center;font-size: 20px;color: #f90;">{{newUserNumber}}</p>
        </div>
        <el-form label-width="100px">
          <el-form-item label="工号规则" :label-width="formLabelWidth">
            <el-input v-model="prefixNumber" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="jobnumberModal = false">取消</el-button>
          <el-button type="primary" @click="numberSbumit">保存</el-button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {
  agentAdd // 添加分机
} from '@/api/comm/call'
import {
  getDataDict, // 参数字典下拉框
  getProvCombox // 获取省市区下拉框
} from '@/api/comm/select'
import {
  getDepartTree, // 部门下拉框
  getDutiesTree // 职务下拉框
} from '@/api/comm/treeselect'
import {
  phoneCheck,
  numberCheck,
  usernumberCheck,
  saveUserForm // 用户详情表单数据保存
} from '@/api/personnel/employee'
// import { testAPI } from '@/api/manage' // 获取封装好的请求接口，调用方式：test(参数).then(res => { console.log(res.data)})
import building from '@/views/components/building.vue'

import multiCascader from '@/components/multi-cascader'

export default {
  name: 'employeePersonnel',
  components: {
    building,
    multiCascader
  },
  watch: {
    prefixNumber: function(val) {
      this.newUserNumber = val
    }
  },
  data() {
    // 数据data在这里
    const validatePhone = (rule, value, callback) => {
      const myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!myreg.test(value)) {
        return callback(new Error('手机格式不正确'))
      } else if (value !== '') {
        phoneCheck(this.addForm.UserPhone, this.userId).then(res => {
          console.log(res.data)
          if (res.data.code) {
            return callback(new Error('手机号重复！'))
          } else {
            return callback()
          }
        })
      } else {
        return callback()
      }
    }
    const validateusernumber = (rule, value, callback) => {
      if (value !== '') {
        usernumberCheck(this.addForm.AccountNo, this.userId).then(res => {
          console.log(res.data)
          if (res.data.code) {
            return callback(new Error('账号重复！'))
          } else {
            return callback()
          }
        })
      } else {
        return callback()
      }
    }
    const validatenumber = (rule, value, callback) => {
      if (value !== '') {
        numberCheck(this.addForm.UserNo, this.userId).then(res => {
          console.log(res.data)
          if (res.data.code) {
            return callback(new Error('工号重复！'))
          } else {
            return callback()
          }
        })
      } else {
        return callback()
      }
    }
    return {
      idtypeOption: [], // 证件类型下拉框
      departOptions: [], // 归属部门下拉框
      educationOption: [], // 学历类型下拉框
      regDomicileOption: [], // 户籍类型下拉框
      nationOption: [], // 民族下拉框
      politicsOption: [], // 政治面貌
      dutiesOption: [], // 职务下拉框
      domicileOption: [], // 居住地下拉框
      recruitOption: [], // 招聘渠道下拉框
      jobnumberModal: false, // 添加工号modal
      prefixNumber: '', // 工号前缀
      newUserNumber: '', // 最新可用工号
      dialogFormVisible: false,
      dialogFormPost: false,
      formLabelWidth: '80px',
      addForm: {
        // 员工信息表单
        name: '',
        AccountNo: '',
        sex: '1',
        UserNo: '',
        Nation: '',
        UserPhone: '',
        OutLook: '',
        BirthDate: '',
        email: '',
        CertType: '',
        CertNo: '',
        EntryDate: '',
        BankCard: '',
        CardBank: '',
        BankDeposit: '',
        department: null,
        duties: null,
        School: '',
        Major: '',
        Education: '',
        censusregister: '',
        GradDate: '',
        LiveAddr: '',
        domicile: '',
        WorkDate: '',
        UserSource: '',
        Memo: '',
        Prov: '',
        City: '',
        LiveProv: '',
        LiveCity: '',
        LiveArea: ''
      },
      rulesaddform: {
        // 员工信息表单规则
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { min: 2, message: '不少于2位', trigger: 'blur' }
        ],
        AccountNo: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { validator: validateusernumber, trigger: 'blur' }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        UserNo: [
          { required: true, message: '工号不能为空', trigger: 'blur' },
          { validator: validatenumber, trigger: 'blur' }
        ],
        UserPhone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        EntryDate: [
          {
            required: true,
            message: '请选择入职日期',
            trigger: 'change'
          }
        ],
        department: [{ required: true, message: '归属部门不能为空' }],
        duties: [{ required: true, message: '归属职务不能为空' }],
        UserSource: [
          { required: true, message: '招聘渠道不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init() {
      // 处理函数
      const that = this

      this.setDepartCombo() // 设置部门下拉框
      this.setdutiesCombo() // 设置职务下拉框
      this.setDictComBox('f7309ef4-d8a0-4225-ac0c-758357e7d26f', data => {
        // 证件类型下拉框
        that.idtypeOption = data
      })
      this.setDictComBox('491b4781-20a1-47f2-a9d5-f949b7250204', data => {
        // 学历下拉框
        that.educationOption = data
      })
      this.setDictComBox('4a39fa16-8667-11e8-86f8-44a84203f5fd', data => {
        // 民族下拉框
        that.nationOption = data
      })
      this.setDictComBox('c3b9af7f-14ce-42aa-80e3-396c627dd35e', data => {
        // 政治面貌下拉框
        that.politicsOption = data
      })
      this.setDictComBox('81e7b9b2-b9a5-4211-8470-a64d76cfec78', data => {
        // 招聘渠道下拉框
        that.recruitOption = data
      })

      this.setProvCombox('-1', 0, data => {
        // 户籍类型下拉框
        that.regDomicileOption = data
      })
      this.setProvCombox('-1', 0, data => {
        // 居住地类型下拉框
        that.domicileOption = data
      })
    },
    setProvCombox(pId, isEnd, setFun) {
      // 省市区下拉框数据获取
      getProvCombox(pId, isEnd).then(res => {
        setFun(res.data)
      })
    },
    setDepartCombo() {
      // 归属部门下拉框数据获取
      const that = this
      getDepartTree().then(res => {
        that.departOptions = res.data
      })
    },
    setdutiesCombo() {
      // 归属职务下拉框数据获取
      const that = this
      getDutiesTree().then(res => {
        that.dutiesOption = res.data
      })
    },
    setDictComBox(pId, setFun) {
      // 参数字典下拉框数据获取
      getDataDict(pId).then(res => {
        // that.casOptions = res.data
        setFun(res.data)
      })
    },
    numberSbumit() {
      // 最新工号保存
    },
    submitForm(formName) {
      // 新增员工保存
      const that = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.$refs[formName].resetFields()
          saveUserForm(that.addForm).then(res => {
            if (res.data.code) {
              const bindUser = res.data.id
              const display = that.addForm.UserPhone
              const comId = this.$store.state.user.callcom // 公司Id

              // 操作成功
              agentAdd({ bindUser, display, comId }).then(res => {
                console.log(res)
              })
              const abc = this.$store.state.refresh.addrefresh
              if (abc) {
                console.log(this.$store.state.refresh.addrefresh)
                this.abc = 2
              }
              this.$message.success(res.data.msg)
              this.$router.push({
                path: '/personnel/emp_deatils/' + res.data.id
              })
            } else {
              that.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRegDomChange(val) {
      const that = this
      // setTimeout(_ => {
      const item = that.regDomicileOption
      that.setComBoxItem(item, val, 0, 1)
      // }, 300)
    },
    handleDomChange(val) {
      const that = this
      // setTimeout(_ => {
      const item = that.domicileOption
      that.setComBoxItem(item, val, 0, 2)
      // }, 300)
    },
    setComBoxItem(item, val, num, top) {
      const that = this
      if (val.length <= num) {
        return
      }
      const id = val[num]
      const index = item.findIndex(vv => vv.value === id)
      if (index === -1) {
        return
      }
      num = num + 1
      if (!item[index].children.length) {
        const isEnd = top === num ? 1 : 0
        that.setProvCombox(id, isEnd, data => {
          // 户籍类型下拉框
          const tempItem = item[index]
          tempItem.children = data
          that.setComBoxItem(item[index].children, val, num, top)
        })
      } else {
        that.setComBoxItem(item[index].children, val, num, top)
      }
    },
    // departChange(val) {
    //   // 部门下拉框改变事件
    //   this.addForm.department = val.length === 0 ? null : val[val.length - 1] // 当前选择的部门
    // },
    // jobChange(val) {
    //   // 部门下拉框改变事件
    //   this.addForm.duties = val.length === 0 ? null : val[val.length - 1] // 当前选择的部门
    // },
    ProvChange(val) {
      console.log(val)
      this.addForm.Prov = ''
      this.addForm.City = ''
      if (val.length > 0) {
        this.addForm.Prov = val[0]
      }
      if (val.length > 1) {
        this.addForm.City = val[1]
      }
    },
    LiveProvChange(val) {
      console.log(val)
      this.addForm.LiveProv = ''
      this.addForm.LiveCity = ''
      this.addForm.LiveArea = ''
      if (val.length > 0) {
        this.addForm.LiveProv = val[0]
      }
      if (val.length > 1) {
        this.addForm.LiveCity = val[1]
      }
      if (val.length > 2) {
        this.addForm.LiveArea = val[2]
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted() {
    // 一般在此调用初始化函数
    this.addForm.EntryDate = new Date()
    this.addForm.EntryDate = moment(this.addForm.EntryDate).format('YYYY-MM-DD')
    this.init()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 重置样式，用于重写element-ui样式，自定义自己的样式 */
.el-dialog {
  border-radius: 5px;
}
.el-form-item--small.el-form-item {
  margin-bottom: 30px;
  .el-form-item__error {
    background: #fff;
    z-index: 9;
    width: 100%;
    padding-top: 6px;
  }
  .tip-2uVhT {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 18px;
    top: 100%;
    left: 0;
    padding-top: 6px;
    line-height: 1;
    color: #a0a0a0;
    font-size: 12px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 自定义样式，由于有scoped属性，所以只对当前tamplate中的 html生效，优化打包效率*/

.app-container {
  .employee {
    .demo-addForm {
      margin-top: 20px;
      .el-select--small {
        width: 100%;
      }
      .el-date-editor--date {
        width: 100%;
      }
      .el-cascader.el-cascader--small {
        width: 100%;
      }
      .tags-cascader {
        display: flex;
        position: absolute;
        top: 5px;
        left: 12px;
        span {
          flex: 1;
          margin-right: 4px;
        }
      }
      .btn-flex {
        display: -webkit-box;
        display: -moz-box;
        display: -webkit-flex;
        display: -moz-flex;
        display: -ms-flexbox;
        display: flex;
        justify-content: center;
      }
    }
    .icon-add {
      font-size: 28px;
      line-height: 32px;
      vertical-align: top;
      color: #999;
      display: inline-block;
      margin-left: 6px;
    }
  }
  .ivu-modal {
    .ivu-modal-content {
      .ivu-modal-confirm-body {
        .generate_block {
          padding: 20px;
          .generate_title {
          }
          .generate_number {
          }
        }
      }
    }
  }
}
</style>
