<template>
  <div class="app-container">
    <TopOperating class="top-filter" hidefilter :blockdata="slotList" :mainclo="14" :btnclo="10">
      <div v-for="(item, index) in slotData" :key="index" :slot="item.SlotName">
        <PanelMain v-for="(info, list) in item.children" :key="list" :name="info.Bname" :endname="info.Ename" :number="info.Sum" :istitle="info.isAll === 1" :current="checked === info.id" @click.native="selectPane(info.id)">
        </PanelMain>
      </div>
      <div slot="commonly">
        <div class="tree-select-box">
          <el-cascader :options="casOptions" placeholder="请选择部门" change-on-select :clearable='true' @change="departChange">
          </el-cascader>
        </div>
      </div>
      <div slot="button">
        <el-button type="primary" @click="tosearch">高级搜索</el-button>
        <el-button type="primary" plain @click="toCandidate(2)">添加员工</el-button>
        <el-button type="primary" plain disabled>导入花名册</el-button>
        <el-dropdown @command="operationbtn">
          <el-button type="primary" plain>
            批量操作
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">批量修改</el-dropdown-item>
            <el-dropdown-item command="b">批量删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </TopOperating>
    <div class="btn-group">
      <div>
        <span class="btn-item" @click="chooseHead">选择表头</span>
        <el-dropdown trigger="click" placement="bottom" @command="handleCommand">
          <span class="btn-item">
            {{dropText}}
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">工号降序</el-dropdown-item>
            <el-dropdown-item command="2">工号升序</el-dropdown-item>
            <el-dropdown-item command="3">按最早入职排序</el-dropdown-item>
            <el-dropdown-item command="4">按最近入职排序</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown trigger="click" placement="bottom">
          <span class="btn-item">
            导出
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导出</el-dropdown-item>
            <el-dropdown-item disabled>自定义导出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- table表格 -->
    <iviewTable stripe ref="selection" @on-selection-change="handleRowChange" :columns="columns" :loading="tloading" :data="TableData" :height="tableHeight" style="margin-bottom: 20px;"></iviewTable>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSArr" :page-size="pageSize" background layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
    </el-pagination>
    <!-- 弹出窗体 -->
    <Modal v-model="headModal" class="iview-right-model" :width="600" :styles="{'margin-right':'0','height':'calc(100% - 50px)','top':'0'}" :transfer="false" :transition-names="['move-right','fade']">
      <h3 slot="header">{{modalTitle}}</h3>
      <div class="tablehead">已选择
        <span class="ft12">（可通过
          <span class="ft-color">拖拽</span>移动表头顺序）</span>
      </div>
      <!-- 上半部分拖拽 -->
      <draggable v-model="draggData" :options="{group:'tableHead', ghostClass:'shadow-none'}" @start="drag=true" @end="drag=false" class="dragg-box" @update="handleDraggEnd">
        <div class="dragg-tag" v-for="(info, list) in draggData" :key="info.id" v-if="info.key !== 'name'">{{ info.text }}
          <span class="close" @click="delFromDragg(list, info.id)">
            <i class="el-icon-close"></i>
          </span>
        </div>
        <p v-if="draggData.length === 0" style="text-align: center;">无数据</p>
      </draggable>
      <div class="tablehead">未选择
        <span class="ft12">（
          <span class="ft-color">点击添加</span> ）</span>
      </div>
      <!-- 未选择部分 -->
      <div class="btn-add">
        <span class="btn-items" v-for="(item, index) in btnitems" :key="item.id">
          <span>{{ item.text }}</span>
          <span class="btn-zz" @click="addToDragg(index,item.id)">+</span>
        </span>
      </div>
      <p v-if="addDraggData.length === 0" style="text-align: center;">无数据</p>
      <el-button class="btn-addmore" @click="showAll = !showAll" v-if="addDraggData.length !== 0" :disabled="addDraggData.length < 15">
        {{word}}
        <i v-if="showAll" class="el-icon-d-arrow-left" style="transform: rotate(90deg);"></i>
        <i v-if="!showAll" class="el-icon-d-arrow-right" style="transform: rotate(90deg);"></i>
      </el-button>
      <div slot="footer">
        <el-button @click="headModal = false">取消</el-button>
        <el-button type="primary" @click="saveTheadSort">保存并生效</el-button>
      </div>
    </Modal>
    <!-- 快速编辑弹出窗体 -->
    <Modal v-model="editModal" class="iview-right-model" :width="560" :styles="{'margin-right':'0','height':'calc(100% - 50px)','top':'0'}" :transfer="false" :transition-names="['move-right','fade']">
      <h3 slot="header">编辑员工信息</h3>
      <el-form :model="editForm" :rules="ruleEditForm" ref="editFormDom" label-width="100px" class="edit-empForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="editForm.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="入职日期" prop="date">
          <el-date-picker type="date" placeholder="请选择入职日期" v-model="editForm.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="银行卡号" prop="card">
          <el-input v-model="editForm.bankno" placeholder="请输入银行卡号"></el-input>
        </el-form-item>
        <el-form-item label="卡户行" prop="bank">
          <el-input v-model="editForm.cardbank" placeholder="请输入卡户行"></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="deposit">
          <el-input v-model="editForm.bankaddr" placeholder="请输入开户行"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editModal = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="editSbumit">{{editLoading ? '正在保存...' : '保存'}}</el-button>
      </div>
    </Modal>
    <Modal v-model="changeModal" :width="560">
      <h3 slot="header">批量修改</h3>
      <el-form :model="changeForm" :rules="ruleChangeForm" ref="changeForm" label-width="100px">
        <el-form-item label="员工状态" prop="userstatus">
          <el-select v-model="changeForm.userstatus" placeholder="请选择员工状态">
            <el-option v-for="item in statusoptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更日期" prop="date">
          <el-date-picker type="date" placeholder="请选择变更日期" v-model="changeForm.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="账号状态" prop="accountstatus">
          <el-radio-group v-model="changeForm.accountstatus">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="changeModal = false">取消</el-button>
        <el-button type="primary" @click="changeSbumit">保存</el-button>
      </div>
    </Modal>
    <Modal v-model="delModal" class="delmodal" :width="560">
      <h3 class="delhead" slot="header">
        <i class="el-icon-warning"></i>
        批量删除</h3>
      <p class="deltext" style="padding:20px 0;font-size: 20px;">您是否确定删除？</p>
      <div slot="footer">
        <el-button @click="changeModal = false">取消</el-button>
        <el-button type="primary" @click="delSbumit">确定</el-button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getDepartTree as getOrgList } from '@/api/comm/treeselect'
import {
  getFilterCard,
  getTables,
  getAllThead,
  getUserSimpleInfo,
  updateUserSimpleData,
  delUserRoster,
  updateUserStatus,
  phoneCheck,
  resetPasswordUser
} from '@/api/personnel/roster'
import TopOperating from '@/views/components/TopOperating'
import PanelMain from '@/views/components/TopOperating/PanelMain.vue'

import { parseTime } from '@/utils/index'

// 拖拽组件
import draggable from 'vuedraggable'

// 定义table表格操作列配置
export default {
  name: 'rosterPersonnel',
  components: {
    TopOperating,
    PanelMain,
    draggable
  },
  watch: {
    nowSelectId: function() {
      this.getTableData()
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      const myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!myreg.test(value)) {
        return callback(new Error('手机格式不正确'))
      } else if (value !== '') {
        phoneCheck(this.editForm.phone, this.editFormId).then(res => {
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
    return {
      labelPosition: 'left', // 筛选label左对齐
      slotList: [], // 动态slot的配置
      slotData: [], // 渲染动态solt的数据
      checked: -1, // 当前选择的区块的标记
      // casOptions: [], // 下拉树形选择数据
      casOptions: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致'
                },
                {
                  value: 'fankui',
                  label: '反馈'
                },
                {
                  value: 'xiaolv',
                  label: '效率'
                },
                {
                  value: 'kekong',
                  label: '可控'
                }
              ]
            }
          ]
        }
      ],
      selValue: null, // 树形select下拉选择modal
      nowSelectId: null, // 当前选择的组织或部门id用于筛选
      currentPage: 1, // 当前页码
      pageSize: 50, // 当前一页多少条数
      pageSArr: [20, 50, 100, 200, 300, 400], // 一页多少条的选项数据data
      pageTotal: 0, // 当前数据总条数
      tableHeight: 500, // 表格适配当前屏幕高度
      tloading: false, // 表格的loading
      dropText: '工号降序',
      sortId: '1',
      showAll: false,
      isActive: true,
      hasError: false,
      headModal: false, // 选择头部弹出窗
      modalTitle: '选择表头',
      formInline: {
        // 筛选按钮的数据
        user: '',
        region: '',
        date1: '',
        date2: ''
      },
      asoptions: [
        {
          id: 'a',
          label: '销售部',
          children: [
            {
              id: 'aa',
              label: '销售部1'
            },
            {
              id: 'ab',
              label: '销售部2'
            }
          ]
        },
        {
          id: 'b',
          label: '业务部'
        },
        {
          id: 'c',
          label: '技术部'
        }
      ],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        }
      ], // table表格表头数据
      statusoptions: [
        {
          label: '实习',
          value: '1'
        },
        {
          label: '转正',
          value: '2'
        },
        {
          label: '离职',
          value: '3'
        }
      ],
      TableData: [], // table表格数据
      draggData: [], // 顶部拖拽数据
      addDraggData: [], // 待选拖拽
      editModal: false, // 快速编辑弹窗控制
      editLoading: false, // 保存按钮loading控制
      editFormId: '', // 编辑员工Id
      editForm: {}, // 编辑员工信息表单
      ruleEditForm: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
      }, // 验证员工信息表单规则
      changeModal: false, // 批量编辑modal
      changeForm: {
        userstatus: '1',
        accountstatus: '1',
        date: '2017-01-12'
      }, // 批量编辑信息表单
      ruleChangeForm: {
        userstatus: [
          { required: true, message: '请选择员工状态', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择变更日期', trigger: 'change' }
        ],
        accountstatus: [
          { required: true, message: '请选择账号状态', trigger: 'change' }
        ]
      }, // 验证批量编辑信息表单规则
      delModal: false, // 批量编辑modal
      selTableRow: [] // table选中行
    }
  },
  methods: {
    init() {
      // 初始化获取顶部筛选卡片数据
      getFilterCard().then(res => {
        // console.log(res.data)
        // 初始化选择
        this.checked = res.data[0].children[0]['id']
        this.slotData = res.data
        // 处理动态slot配置
        const slotSet = res.data.map(v => {
          return { span: v.SlotSpan, name: v.SlotName }
        })
        this.slotList = slotSet
        // console.log(slotSet)
        // 初始化选择表头
        this.selectThInit()
      })
      // 初始化组织架构下拉筛选数据
      getOrgList().then(res => {
        // console.log(res.data)
        this.casOptions = res.data
      })
    },
    filterCardInit() {
      // 初始化获取顶部筛选卡片数据
      getFilterCard().then(res => {
        // console.log(res.data)
        // 初始化选择
        this.checked = res.data[0].children[0]['id']
        this.slotData = res.data
        // 处理动态slot配置
        const slotSet = res.data.map(v => {
          return { span: v.SlotSpan, name: v.SlotName }
        })
        this.slotList = slotSet
      })
    },
    selectThInit() {
      getAllThead().then(res => {
        // console.log(res.data)
        const draggArr = res.data.filter(v => {
          return v.ischose === 1
        })

        const addArr = res.data.filter(v => {
          return v.ischose === 0
        })
        // 将筛选出来的表头处理成指定数据并交给table组件
        this.TheadInit(draggArr)
        this.draggData = draggArr
        this.addDraggData = addArr
        // console.log(draggArr)
        // console.log(addArr)
      })
    },
    TheadInit(data) {
      const _this = this
      this.tloading = true
      // 处理表头结构
      const tableThead = data.map(m => {
        const obj = {
          title: m.text,
          key: m.key,
          minWidth: 100
        }
        if (m.width) {
          obj.width = m.width
        }
        // 姓名
        if (m.key === 'UserName') {
          obj.fixed = 'left'
          obj.align = 'center'
          obj.ellipsis = true
          obj.render = function(h, obj) {
            return h(
              'router-link',
              {
                style: {
                  color: '#0bb27a'
                },
                props: {
                  to: { path: 'emp_deatils/' + obj.row.id }
                }
              },
              obj.row.UserName
            )
          }
        }
        return obj
      })

      tableThead.unshift({
        type: 'selection',
        width: 60,
        align: 'center',
        fixed: 'left'
      })

      tableThead.push({
        title: '#',
        key: '#temp'
      })

      // 操作
      tableThead.push({
        title: '操作',
        width: 65,
        align: 'center',
        fixed: 'right',
        render: function(h, obj) {
          return h(
            'el-dropdown',
            {
              props: {},
              on: {
                command: _this.tableCommand
              }
            },
            [
              h('span', {}, [
                h('svg-icon', {
                  props: {
                    'icon-class': 'set_table'
                  }
                })
              ]),
              h('el-dropdown-menu', { slot: 'dropdown' }, [
                h(
                  'el-dropdown-item',
                  {
                    props: {
                      command: { key: 'edit', id: obj.row.id }
                    }
                  },
                  '快速编辑'
                ),
                h(
                  'el-dropdown-item',
                  {
                    props: {
                      disabled: true,
                      command: { key: 'status', id: obj.row.id }
                    }
                  },
                  '状态调整'
                ),
                h(
                  'el-dropdown-item',
                  {
                    props: {
                      command: { key: 'password', id: obj.row.id }
                    }
                  },
                  '重置密码'
                )
              ])
            ]
          )
        }
      })
      // 表头赋值，调取获取表体数据
      this.columns = tableThead
      this.getTableData()
    },
    getTableData() {
      if (this.checked === -1) {
        return
      }
      this.selTableRow = []
      this.tloading = true
      const pageSize = this.pageSize // 每页多少条数据
      const current = this.currentPage // 当前页码
      const classifica = this.checked // 顶部统计筛选当前选择的id
      const depid = this.nowSelectId // 当前选择的部门
      const sorting = this.sortId // 当前排序规则
      getTables({ pageSize, current, classifica, depid, sorting }).then(res => {
        this.TableData = res.data.data
        this.currentPage = res.data.current // 当前页码
        this.pageSize = res.data.pagesize // 一页多少条数据
        this.pageTotal = res.data.total // 当前数据总条数
        // 关闭loading
        this.tloading = false
      })
    },
    selectPane(a) {
      // 点选各个筛选卡片的事件，a为id
      this.checked = a
      this.getTableData()
    },
    handleRowChange(selection) {
      this.selTableRow = selection
    },
    operationbtn(type) {
      console.log(type)
      const that = this
      if (that.selTableRow.length === 0) {
        that.$message.warning('请先选择要修改的员工！')
        return
      }
      const status = that.selTableRow[0]['UserStatus']
      let isChange = true
      const ids = that.selTableRow.map(v => {
        if (isChange) {
          if (status !== v.UserStatus) {
            isChange = false
          }
        }
        return v.id
      })
      if (type === 'a') {
        if (!isChange) {
          that.$message.warning('请选择状态相同的员工！')
          return
        }
        if (status === '离职') {
          that.$message.warning('离职员工不可修改状态！')
          return
        }
        that.statusoptions = []
        if (status === '待入职') {
          that.statusoptions.push({
            label: '实习',
            value: '1'
          })
        }
        if (status === '实习') {
          that.statusoptions.push({
            label: '转正',
            value: '2'
          })
        }
        that.statusoptions.push({
          label: '离职',
          value: '3'
        })
        // 批量编辑
        that.changeForm.ids = ids
        that.changeForm.userstatus = null
        that.changeForm.accountstatus = '1'
        that.changeForm.date = parseTime(new Date(), '{y}-{m}-{d}') // '2017-07-07'
        that.changeModal = true
      } else if (type === 'b') {
        // 批量删除
        that
          .$confirm('此操作将删除这些员工,删除后不可恢复, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            delUserRoster({ ids }).then(res => {
              if (res.data.code) {
                that.$message.success(res.data.msg)
                that.getTableData()
                that.filterCardInit()
              } else {
                that.$message.error(res.data.msg)
              }
            })
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    handleCommand(command) {
      // 筛选排序下拉菜单回调
      switch (command) {
        case '1':
          this.dropText = '工号降序'
          this.sortId = '1'
          break
        case '2':
          this.dropText = '工号升序'
          this.sortId = '2'
          break
        case '3':
          this.dropText = '按最早入职排序'
          this.sortId = '3'
          break
        case '4':
          this.dropText = '按最近入职排序'
          this.sortId = '4'
          break
        default:
          this.dropText = '按最近入职排序'
          this.sortId = '5'
          break
      }
      this.getTableData()
    },
    tableCommand(data) {
      // table表格中的下拉菜单回调
      console.log(data)
      switch (data.key) {
        case 'edit':
          this.setEditForm(data.id)
          break
        case 'password':
          this.resetPassword(data.id)
          break
        default:
          break
      }
    },
    resetPassword(id) {
      this.$confirm('此操作将重置员工密码,重置后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          resetPasswordUser({ id }).then(res => {
            if (res.data.code) {
              this.$message.success(res.data.msg)
              this.getTableData()
            } else {
              this.$message.error(res.data.msg)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    setEditForm(id) {
      const that = this
      that.editForm = {}
      that.editFormId = ''
      that.editFormId = id
      getUserSimpleInfo({ id }).then(res => {
        // console.log(res.data)
        that.editForm = res.data
      })
      // 快速编辑设置表单
      this.editModal = true
    },
    editSbumit() {
      // 快速编辑保存
      const that = this
      this.$refs['editFormDom'].validate(valid => {
        if (valid) {
          console.log(that.editForm)
          const editData = JSON.parse(JSON.stringify(that.editForm))
          editData.id = that.editFormId
          // 编辑
          updateUserSimpleData(editData).then(res => {
            // console.log(res.data)
            if (res.data.code) {
              this.editModal = false
              // 请求刷新角色列表数据
              this.getTableData() // table刷新
              that.$message.success(res.data.msg)
              // 关闭delog
              this.editLoading = false // loading控制
            } else {
              that.$message.error(res.data.msg)
              // 关闭delog
              this.editLoading = false // loading控制
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeSbumit() {
      const that = this
      this.$refs['changeForm'].validate(valid => {
        if (valid) {
          // 批量编辑保存
          updateUserStatus(that.changeForm).then(res => {
            // console.log(res.data)
            if (res.data.code) {
              that.changeModal = false
              // 请求刷新角色列表数据
              that.getTableData() // table刷新
              that.$message.success(res.data.msg)
              // 关闭delog
              this.changeModal = false // loading控制
            } else {
              that.$message.error(res.data.msg)
              // 关闭delog
              that.changeModal = false // loading控制
            }
          })
        }
      })
    },
    delSbumit() {
      // 批量删除确定
      this.delModal = false
      this.getTableData() // table刷新
    },
    handleSizeChange(val) {
      // 分页选择当前一页多少条数据回调
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      // 分页当前页码回调
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getTableData()
    },
    handleDraggEnd(e) {
      // 选择表头，拖拽完毕回调
      console.log(e)
      console.log(this.draggData)
    },
    delFromDragg(index, id) {
      // 当前元素从已选择列表中移除，重新回到未选择中
      const draggThead = this.draggData[index]
      console.log(draggThead)
      this.$nextTick(() => {
        this.draggData.splice(index, 1)
        this.addDraggData.push(draggThead)
      })
    },
    addToDragg(index, id) {
      // 将未选择的添加到已选择列表中，并从未选择中移除
      // this.draggData = draggArr
      // this.addDraggData = addArr
      if (this.draggData.length > 30) {
        this.$message.warning('显示字段不能超过30个！')
        return
      }
      const opeaThead = this.addDraggData[index]
      console.log(opeaThead)
      this.$nextTick(() => {
        this.addDraggData.splice(index, 1)
        this.draggData.push(opeaThead)
      })
    },
    tosearch() {
      this.$router.push({ path: 'advanced_search' })
    },
    toCandidate(a) {
      // 新增候选人
      if (a === 1) {
        this.$router.push({ path: 'candidate' })
      } else if (a === 2) {
        // 新增员工
        this.$router.push({ path: 'employee' })
      }
    },
    chooseHead() {
      // 打开选择表头弹出窗体
      const that = this
      that.headModal = true
    },
    saveTheadSort() {
      // 保存排序后的表头调整项
      // 处理表头
      this.headModal = false
      this.$message.success('调整成功！')
      this.TheadInit(this.draggData)
    },
    departChange(val) {
      // 部门下拉框改变事件
      this.nowSelectId = val.length === 0 ? null : val[val.length - 1] // 当前选择的部门
    }
  },
  computed: {
    btnitems: function() {
      if (this.showAll === false) {
        var btnitems = []
        if (this.addDraggData.length > 15) {
          for (var i = 0; i < 15; i++) {
            btnitems.push(this.addDraggData[i])
          }
        } else {
          btnitems = this.addDraggData
        }
        return btnitems
      } else {
        return this.addDraggData
      }
    },
    word: function() {
      if (this.showAll === false) {
        return '点击展开'
      } else {
        return '点击收起'
      }
    }
  },
  mounted() {
    // 动态设置table表格高度
    this.tableHeight = window.innerHeight - 420
    // 一般在此调用初始化函数
    this.init()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 重置样式，用于重写element-ui样式，自定义自己的样式 */
.group-dropdown {
  border: transparent;
}
.group-dropdown:focus,
.group-dropdown:hover {
  border-color: transparent;
  background-color: transparent;
}
.vue-treeselect__control {
  height: 32.2px;
  .vue-treeselect__placeholder,
  .vue-treeselect__single-value {
    line-height: 32.2px;
  }
}
.btn-addmore {
  width: 100%;
  height: 34px;
  line-height: 16px;
  display: block;
  clear: both;
  color: #80848f;
  font-size: 13px;
  text-align: center;
  border: 1px dashed #e1e6eb;
  cursor: pointer;
  > i {
    font-size: 14px;
  }
  &:active {
    background-color: #fff;
  }
  &:focus {
    background-color: #fff;
  }
  &:hover {
    border: 1px dashed #3cc195;
    color: #3cc195;
    background-color: #fff;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 自定义样式，由于有scoped属性，所以只对当前tamplate中的 html生效，优化打包效率*/
.app-container {
  /* 顶部样式 */
  .top-filter {
    .tree-select-box {
      width: 30%;
    }
  }
  .operating-group {
    display: flex;
    .search-input {
      width: 240px;
      display: flex;
      .input-box {
        flex: 1;
      }
    }
    .button-group {
      flex: 1;
      text-align: right;
    }
  }
  .btn-group {
    display: flex;
    padding: 12px 0;
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    font-size: 14px;
    margin-top: 16px;
    .btn-item {
      padding: 0 10px;
      border-left: 1px solid #e1e6eb;
    }
    .btn-item:hover {
      color: #3cc195;
      cursor: pointer;
    }
  }
  .tablehead {
    font-size: 18px;
    text-align: bottom;
    height: 40px;
    margin-top: 20px;
    border-bottom: 1px solid #ccc;
    .ft12 {
      font-size: 12px;
      .ft-color {
        color: #f90;
      }
    }
  }
  /* 拖拽样式 */
  .dragg-box {
    overflow: hidden;
    padding-top: 20px;
    .dragg-tag {
      height: 34px;
      line-height: 34px;
      cursor: move;
      position: relative;
      float: left;
      margin: 0 16px 16px 0;
      padding: 0 40px 0 15px;
      font-weight: 400;
      color: #fff;
      font-size: 12px;
      border-radius: 4px;
      white-space: nowrap;
      background-color: #0bb27a;
      transform: translate(0, 0);
      .close {
        position: absolute;
        right: 10px;
        > i {
          font-size: 12px;
          transform: scale(1.1) rotate(0);
          cursor: pointer;
        }
      }
      &::after {
        position: absolute;
        display: block;
        content: '';
        top: 1px;
        bottom: 0;
        right: 30px;
        width: 1px;
        background: rgba(255, 255, 255, 0.3);
      }
      &:hover {
        box-shadow: 0 6px 16px rgba(28, 36, 56, 0.3);
        transform: translate(0, -2px);
        transition: transform 0.2s;
      }
      &.shadow-none {
        &:hover {
          box-shadow: none;
          transform: none;
          transition: none;
        }
      }
    }
  }
  .btn-add {
    padding: 20px 0;
    .btn-items {
      position: relative;
      padding: 0px 15px;
      display: inline-block;
      line-height: 30px;
      border-radius: 5px;
      border: 1px solid #ccc;
      margin-right: 16px;
      margin-bottom: 18px;
      cursor: pointer;
      .btn-zz {
        display: none;
      }
    }
    .btn-items:hover .btn-zz {
      display: block;
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      color: #fff;
      background: rgba(0, 0, 0, 0.3);
      text-align: center;
      font-size: 24px;
    }
  }
  /*批量删除弹框*/
  .delmodal {
    .deltext {
      font-size: 20px;
      padding: 20px 0;
    }
  }
}
@media screen and (max-width: 1360px) {
  .app-container {
    .top-filter {
      .tree-select-box {
        width: 42%;
      }
    }
  }
}
</style>
