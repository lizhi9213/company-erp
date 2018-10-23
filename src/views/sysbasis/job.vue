<template>
  <div class="app-container">
    <el-row :gutter="18" class="job-box">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-tabs v-model="activeName">
          <el-tab-pane label="职务管理" class="job-manage" name="first">
            <el-alert title="你可以通过点击职务名称来查看该职务下所属的人员信息列表。" type="success">
            </el-alert>
            <div class="operating-group">
              <div class="search-input">
                搜索职务&nbsp;&nbsp;&nbsp;
                <div class="input-box">
                  <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                  </el-input>
                </div>
              </div>
              <div class="button-group">
                <el-button type="primary" @click="addOrg(1)">新增职务</el-button>
                <!-- <el-button type="primary" plain>更多功能</el-button> -->
              </div>
            </div>
            <div class="tree-header">
              <div class="org-tree-left">职务名称</div>
              <div class="org-tree-right" :style="{width: treeRWidth + 'px'}">
                <span class="head-number">岗位级别</span>
                <span class="head-office">是否办事处</span>
                <span class="head-desc">职责介绍</span>
                <span class="head-founder">创建人</span>
                <span class="head-date">创建时间</span>
                <span class="head-opera"></span>
              </div>
            </div>
            <el-tree :data="treeData" node-key="id" default-expand-all :props="defaultProps" @node-click="handleNodeClick" :filter-node-method="filterNode" ref="tree2">
              <div class="custom-tree-node" slot-scope="{ node, data }">
                <div class="tree-label">
                  <span @click.stop="toPerson(node, data)">{{ node.label }}</span>
                </div>
                <div class="tree-opera" :style="{width: treeRWidth + 'px'}">
                  <div class="org-number">{{ node.data.PostLevel }}</div>
                  <div class="org-office">{{ node.data.IsOffice === 0 ? '否' : '是' }}</div>
                  <div class="org-desc">
                    <span class="desc" :title="node.data.Responsibility">{{node.data.Responsibility}}</span>
                  </div>
                  <div class="org-founder">{{node.data.Founder}}</div>
                  <div class="org-date">{{node.data.CrteatDate}}</div>
                  <div class="org-opera">
                    <span class="add" @click.stop="() => {addOrg(3,node,data)}">新增职务</span>
                    <span class="edit" @click.stop="() => {addOrg(2,node,data)}">编辑职务</span>
                    <span class="del" @click.stop="() => remove(node, data)">删除当前职务</span>
                  </div>
                </div>
              </div>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="人员管理" class="personnel" name="second" lazy>
            <el-alert style="margin-bottom: 16px;" :closable="false" :title="nowOfficeId === '' ? '你当前没有选择一个职务，无法查看职务下属的人员列表！' : '当前选择的职务为：' + nowOffice" :type="nowOfficeId === '' ? 'error' : 'success'">
            </el-alert>
            <!-- 头部筛选 -->
            <TopOperating hidefilter>
              <div slot="commonly">
                <div class="search-box">
                  <span class="label">搜索人员</span>
                  <el-input v-model="keyEmp" placeholder="请输入姓名或工号" @keyup.native="personnelInit"></el-input>
                </div>
              </div>
              <div slot="button">
                <el-button type="primary" style="margin-right: 14px;" @click="addPerson(1)">添加人员</el-button>
                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    <el-button type="primary" plain>更多功能</el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command='del'>批量移除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </TopOperating>
            <!-- 人员table表格 -->
            <iviewTable stripe :columns="empColumns" :loading="tloading" :data="empTableData" :height="tableHeight" @on-select="tableSelect" @on-select-all="tableSelectAll" style="margin-top: 20px;"></iviewTable>
            <!-- 分页 -->
            <el-pagination style="margin-top: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSArr" :page-size="pageSize" background layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="岗位级别" class="job-level" name="third" lazy>
            <div class="operating-group">
              <div class="screening-box">
                关键字查询&nbsp;&nbsp;&nbsp;
                <div class="input-box">
                  <el-input placeholder="输入关键字" v-model="levelKey" @keyup.enter.native="initLevel">
                  </el-input>
                </div>
              </div>
              <div class="btn-group">
                <el-button type="primary" @click="addPerson(2)">新增岗位级别</el-button>
              </div>
            </div>
            <div style="height: 20px;"></div>
            <iviewTable stripe :columns="columns" :data="TableData"></iviewTable>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!-- 新增职务弹出窗 -->
    <Modal v-model="fieldModal" class="iview-right-model" :width="700" :styles="{'margin-right':'10px','height':'calc(100% - 50px)','top':'50px'}" :transfer="false" :transition-names="['move-right','fade']">
      <h3 slot="header">{{modalTitle}}</h3>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="职务名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请填写部门名称"></el-input>
        </el-form-item>
        <el-form-item label="办事处" prop="isoffice">
          <el-radio-group v-model="ruleForm.isoffice">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="上级职务" prop="parent">
          <el-cascader :options="casOptions" expand-trigger="hover" v-model="ruleForm.jobModel" placeholder="请选择上级职务" change-on-select :clearable='true' @change="jobChange">
          </el-cascader>
        </el-form-item> -->
        <el-form-item label="岗位级别" prop="level">
          <el-select v-model="ruleForm.level" style="width: 100%;" placeholder="请选择岗位级别">
            <el-option v-for="item in levelList" :key="item.LevelId" :label="item.LevelName" :value="item.LevelId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="ruleForm.sort" placeholder="默认为0"></el-input>
        </el-form-item>
        <el-form-item label="职责介绍" prop="desc">
          <el-input type="textarea" placeholder="请填写部门职责介绍" :autosize="{ minRows: 4, maxRows: 12}" v-model="ruleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <p style="margin: 0; margin-top: 16px;" class="warn-content">1. 一人可有多个职务；职务和权限有关；每个人的权限可编辑不一样。
      </p>
      <div slot="footer">
        <el-button @click="fieldModal = false">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </div>
    </Modal>
    <!-- 新增人员/ 岗位级别弹出框 -->
    <Modal v-model="personModal" :title="levelTitle" :width="560">
      <div v-if="!isLevel" class="add-person-box">
        <el-row style="height: 100%;">
          <el-col :span="12" style="height: 100%;">
            <div class="parsen-list">
              <div class="search-input">
                <el-input class="search-input" v-model="keyPerson" placeholder="请输入内容" @keyup.native="searchParnell"></el-input>
              </div>
              <ul class="parsen-cell">
                <li v-if="!showSList" class="parsen-item" v-for="(item, index) in addPlist" :key="index" @click="addSelPerson(index)">
                  <span aria-checked="mixed" class="el-checkbox__input" :class="{'is-checked': item.is_chose}">
                    <span class="el-checkbox__inner"></span>
                  </span>
                  <span class="avatar"><img :src="item.img_url ? item.img_url : '/src/images/default-avatar.png'" :alt="item.name"></span>
                  <span class="personnel-msg">{{item.name}} / {{item.phone}}</span>
                </li>
                <li v-if="showSList" class="parsen-item" v-for="(item, index) in searchPlist" :key="index" @click="addSelPerson(index)">
                  <span aria-checked="mixed" class="el-checkbox__input" :class="{'is-checked': item.is_chose}">
                    <span class="el-checkbox__inner"></span>
                  </span>
                  <span class="avatar"><img :src="item.img_url ? item.img_url : '/src/images/default-avatar.png'" :alt="item.name"></span>
                  <span class="personnel-msg">{{item.name}} / {{item.phone}}</span>
                </li>
                <li v-if="showSList && searchPlist.length === 0" style="text-align:center;">
                  <i v-if="tipsMsg === '加载中...'" class="el-icon-loading"></i>&nbsp;&nbsp;{{tipsMsg}}
                </li>
              </ul>
            </div>
          </el-col>
          <el-col :span="12" style="height: 100%;">
            <div class="done-slist">
              <h4 class="done-title">已选择</h4>
              <ul class="parsen-cell">
                <li v-for="(info, list) in selParList" :key="list" class="parsen-item">
                  <span class="avatar"><img :src="info.img_url ? info.img_url : '/src/images/default-avatar.png'" :alt="info.name"></span>
                  <span class="personnel-msg">{{info.name}} / {{info.phone}}</span>
                  <i class="el-icon-close" @click.stop="delSelect(list)"></i>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 岗位级别表单 -->
      <el-form v-if="isLevel" :model="levelForm" :rules="ruleLevel" ref="levelsForm" label-width="100px" class="level-ruleForm">
        <el-form-item label="级别名称" prop="LevName">
          <el-input v-model="levelForm.LevName" placeholder="请填写岗位级别名称"></el-input>
        </el-form-item>
        <el-form-item label="级别编号" prop="LevSerial">
          <el-input v-model="levelForm.LevSerial" placeholder="请填写岗位级别名称"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部保存操作 -->
      <div slot="footer">
        <el-button @click="personModal = false">取消</el-button>
        <el-button type="primary" @click="saveAddPerson" :loading="parsLoading">{{parsLoading ? '正在保存....' : '保存'}}</el-button>
      </div>
    </Modal>
    <!-- 人员详细信息展示modal -->
    <Modal v-model="empbaseMsg" width="580" class-name="show-msg-modal">
      <h3 slot="header">人员基本信息</h3>
      <el-row :gutter="18" class="structure">
        <el-col :span="4">
          <span class="avatar"><img :src="empData.photoImg ? empData.photoImg : '/src/images/default-avatar.png'" :alt="empData.UserName"></span>
        </el-col>
        <el-col :span="20" class="msg-title">
          <h4>{{empData.UserName}}</h4>
          <p>{{empData.Depart}} / {{empData.PostName}}</p>
        </el-col>
        <el-col :span="20" :offset="4" class="msg-content">
          <ul class="content-ul">
            <li class="content-li">
              <span class="label">手机号</span>
              <span class="item">{{empData.UserPhone}}</span>
            </li>
            <li class="content-li">
              <span class="label">性别</span>
              <span class="item">{{empData.UserSex}}</span>
            </li>
            <li class="content-li">
              <span class="label">入职日期</span>
              <span class="item">{{empData.EntryDate}}</span>
            </li>
            <li class="content-li">
              <span class="label">证件类型</span>
              <span class="item">{{empData.CertType}}</span>
            </li>
            <li class="content-li">
              <span class="label">证件号</span>
              <span class="item">{{empData.CertNo}}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
      <div slot="footer" style="border-top: none;"></div>
    </Modal>
  </div>
</template>

<script>
// import { getJobTree } from '@/api/comm/treeselect'
import {
  getJobTree,
  getJobDetail,
  jobDel,
  checkJobName,
  checkLevName,
  checkLevSerial,
  saveJobAdd,
  jobUpdate,
  getParList,
  delParList,
  getpersonSlist,
  saveAddPer,
  getEmpDetail,
  getLeveList,
  getLeves,
  getLeveDetail,
  saveLevel,
  updateLevel,
  delLevel
} from '@/api/sysbasis/job'
import TopOperating from '@/views/components/TopOperating'
export default {
  name: 'jobSysbasis',
  components: {
    TopOperating
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  data() {
    const _this = this
    // 验证职务名称
    const validateName = (rule, value, callback) => {
      if (value !== '') {
        checkJobName({
          id: this.selectId,
          name: value,
          pid: this.ruleForm.parent || -1
        }).then(res => {
          console.log(res.data)
          if (res.data.code) {
            return callback(new Error('职务名称重复！'))
          } else {
            return callback()
          }
        })
      } else {
        return callback()
      }
    }
    // 验证岗位级别名称
    const validateLevName = (rule, value, callback) => {
      if (value !== '') {
        checkLevName({ id: this.editLevelId, name: value }).then(res => {
          console.log(res.data)
          if (res.data.code) {
            return callback(new Error('岗位级别名称重复！'))
          } else {
            return callback()
          }
        })
      } else {
        return callback()
      }
    }
    // 验证岗位级别编号
    const validateLevSerial = (rule, value, callback) => {
      if (value !== '') {
        checkLevSerial({ id: this.editLevelId, name: value }).then(res => {
          console.log(res.data)
          if (res.data.code) {
            return callback(new Error('岗位级别编号重复！'))
          } else {
            return callback()
          }
        })
      } else {
        return callback()
      }
    }
    return {
      activeName: 'first', // tabs切换
      treeRWidth: '600', // 树形对齐宽度
      bodyHeight: '500', // min-heigth最小高度
      fieldModal: false, // 弹出窗控制
      modalTitle: '新增职务', // 弹出窗标题
      filterText: '', // 树形筛选input
      treeData: [], // 树形数据
      selectId: '', // 当前用户选择的职务id
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      empColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name',
          minWidth: 100,
          render: function(h, obj) {
            console.log(obj)
            return h(
              'span',
              {
                style: {
                  color: '#0bb27a',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    console.log(_this.tableHeight)
                    _this.setEmpMsg(obj.row.id)
                  }
                }
              },
              obj.row.name
            )
          }
        },
        {
          title: '性别',
          key: 'sex',
          minWidth: 50
        },
        {
          title: '职务',
          key: 'duty',
          minWidth: 100
        },
        {
          title: '手机号',
          key: 'phone',
          minWidth: 100
        },
        {
          title: '工号',
          key: 'jobnumber',
          minWidth: 100
        },
        {
          title: '操作',
          key: 'Operation',
          align: 'center',
          minWidth: 100,
          render: (h, obj) => {
            return h(
              'span',
              {
                style: {
                  color: '#0bb27a',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    _this.delOnePerson(obj.row.id)
                  }
                }
              },
              '移除当前员工'
            )
          }
        }
      ], // 人员管理表头配置
      empTableData: [], // 人员管理表体数据
      selTables: [], // 人员管理table表格勾选中的人员，应用于批量删除
      tableHeight: 500, // 人员管理table表格高度
      tloading: false, // 人员管理table加载loading
      keyEmp: '', // 人员管理关键字
      currentPage: 1, // 人员管理分页当前页码
      pageSize: 50, // 人员管理分页当前一页多少条数
      pageSArr: [20, 50, 100, 200, 300, 400], // 一页多少条的选项数据data
      pageTotal: 0, // 人员管理当前数据总条数
      addPlist: [], // 新增人员所有人员列表
      selParList: [], // 新增人员选择后人员列表
      searchPlist: [], // 新增人员查询结果列表
      keyPerson: '', // 新增人员关键字查询
      showSList: false, // 是否显示查询列表
      parsLoading: false, // 保存新增loading开关
      tipsMsg: '加载中...', // 新增人员查询提示文字
      empbaseMsg: false, // 控制人员基本信息显示
      empData: {}, // 人员基本信息
      personModal: false, // 新增人员/新增岗位级别弹窗控制
      nowOffice: '', // 当前选择的职务
      nowOfficeId: '', // 当前选择的职务id
      // casOptions: [], // 上级treeList数据
      selValue: null, // 上级id
      isLevel: true, // 是否显示岗位级别表单
      levelList: [], // 岗位级别list
      levelTitle: '请选择人员', // 添加人员 / 新增岗位级别标题
      levelKey: '', // 岗位级别关键字查询
      columns: [
        {
          title: '级别名称',
          key: 'LevelName'
        },
        {
          title: '编号',
          key: 'LevelSerial'
        },
        {
          title: '操作人',
          key: 'CreateName'
        },
        {
          title: '操作时间',
          key: 'UpdateTime'
        },
        {
          title: '操作',
          key: 'Operation',
          align: 'center',
          render: (h, params) => {
            // console.log(params)
            const nowId = params.row.LevelId
            return h(
              'el-popover',
              {
                props: {
                  placement: 'bottom-start',
                  trigger: 'hover',
                  'popper-class': 'opera_box'
                }
              },
              [
                h(
                  'ul',
                  {
                    class: {
                      opera_ul: true
                    }
                  },
                  [
                    h(
                      'li',
                      {
                        on: {
                          click: () => {
                            this.addPerson(3, nowId)
                          }
                        }
                      },
                      '编辑岗位级别'
                    ),
                    h(
                      'li',
                      {
                        on: {
                          click: () => {
                            this.delLevel(nowId)
                          }
                        }
                      },
                      '删除岗位级别'
                    )
                  ]
                ),
                h('i', {
                  slot: 'reference',
                  class: {
                    'el-icon-edit-outline': true
                  }
                })
              ]
            )
          }
        }
      ], // 岗位级别表头
      TableData: [], // 岗位级别表格数据
      ruleForm: {
        isoffice: '0',
        name: '',
        level: '',
        parent: null,
        sort: '0',
        desc: ''
      }, // 新增/编辑职务表单数据
      levelsForm: {},
      rules: {
        isoffice: [
          { required: true, message: '请选择是否为办事处', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入职务名称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ]
      }, // 职务表单数据校验
      editLevelId: '', // 需要编辑的岗位级别id
      levelForm: {
        LevName: '', // 岗位级别名称
        LevSerial: '' // 岗位级别编号
      }, // 岗位级别表单
      ruleLevel: {
        LevName: [
          { required: true, message: '请输入岗位级别', trigger: 'blur' },
          { validator: validateLevName, trigger: 'blur' }
        ],
        LevSerial: [
          { required: true, message: '请填写岗位级别编号', trigger: 'blur' },
          { validator: validateLevSerial, trigger: 'blur' }
        ]
      } // 岗位级别表单校验
    }
  },
  methods: {
    init() {
      const that = this
      // 获取树形结构数据
      getJobTree().then(res => {
        // console.log(res.data)
        that.treeData = res.data
      })
      // getJobTreeComBox().then(res => {
      //   // console.log(res.data)
      //   that.casOptions = res.data
      // })
    },
    filterNode(value, data) {
      // 树形结构筛选处理
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    initLeveList() {
      // 获取岗位级别下拉
      getLeveList().then(res => {
        // console.log(res.data)
        this.levelList = res.data
      })
    },
    initLevel() {
      const that = this
      // 初始化岗位级别table
      getLeves(this.levelKey).then(res => {
        console.log(res)
        that.TableData = res.data
      })
    },
    remove(node, data) {
      const that = this
      // 删除职务
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      this.$confirm(
        '此操作将删除当前职务以及职务下所属职务, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const id = children[index]['id']
          const name = children[index]['label']
          jobDel({ id, name }).then(res => {
            console.log(res)
            if (res.data.code) {
              // 操作成功
              // 删除前台页面中的结构树的node
              // children.splice(index, 1)
              // 更新职务列表
              that.init()
              that.$message({
                type: 'success',
                message: res.data.msg
              })
            } else {
              that.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    onTreeSelect(node, instanceId) {
      console.log(node)
      this.ruleForm.parent = node.id
      console.log(this.ruleForm.parent)
    },
    addOrg(...arr) {
      console.log(arr)
      const that = this
      // 先重置表单
      this.resetForm('ruleForm')
      if (arr[0] === 1) {
        that.modalTitle = '新增职务'
        that.selValue = null
        // that.ruleForm.departModel = []
        that.fieldModal = true
        return
      }
      const node = arr[1]
      const data = arr[2]
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      if (arr[0] === 2) {
        that.modalTitle = '编辑职务'
        // 设置表单数据
        that.setForm(children[index]['id'], children[index]['label'])
        that.fieldModal = true
      } else if (arr[0] === 3) {
        that.modalTitle = '新增职务'
        that.fieldModal = true
        // 将当前选择的职务id带入
        that.ruleForm.parent = children[index]['code']
        that.selValue = children[index]['id']

        // that.ruleForm.jobModel = that.getParentsModel(
        //   that.casOptions,
        //   children[index]['code']
        // )
      }
    },
    // getParentsModel(data, id) {
    //   const res = []
    //   for (var i = 0; i < data.length; i++) {
    //     if (data[i].value === id) {
    //       res.push(data[i].value)
    //       return res
    //     }
    //     if (data[i].children) {
    //       const rr = this.getParentsModel(data[i].children, id)
    //       if (rr) {
    //         res.push(data[i].value)
    //         return res.concat(rr)
    //       }
    //     }
    //   }
    // },
    setForm(id, name) {
      const that = this
      this.selectId = id
      // 设置表单数据
      getJobDetail({ id, name }).then(res => {
        console.log(res.data)
        const formData = res.data
        that.ruleForm = formData
        that.selValue = formData.parent
        that.ruleForm.parent = formData.parent
        // that.ruleForm.jobModel = that.getParentsModel(
        //   that.casOptions,
        //   formData.parent
        // )
      })
    },
    setLeveFrom(id) {
      // 设置岗位级别到表单中
      const that = this
      getLeveDetail(id).then(res => {
        console.log(res.data)
        // 暂存id
        that.editLevelId = id
        const setData = {}
        setData.LevName = res.data.LevelName
        setData.LevSerial = res.data.LevelSerial
        // 设置参数
        that.levelForm = setData
        console.log(that.levelForm)
        // 打开弹出窗体
        that.personModal = true
      })
    },
    delLevel(id) {
      const that = this
      if (this.personModal) {
        return
      }
      // 删除单条岗位级别
      this.$confirm('此操作将删除岗位级别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delLevel(id).then(res => {
            console.log(res)
            if (res.data.code) {
              // 操作成功
              // 更新职务列表
              that.initLevel()
              that.initLeveList()
              that.$message({
                type: 'success',
                message: res.data.msg
              })
            } else {
              that.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(that.ruleForm)
          // 保存的时候要先判断是否是办事处1，如果不是将 that.ruleForm.office置空
          if (that.ruleForm.isoffice === '0') {
            that.ruleForm.office = ''
          }
          // 先判断是更新还是新增数据
          if (this.selectId === '') {
            // 提交服务器保存
            // console.log(that.ruleFormz)
            saveJobAdd(that.ruleForm).then(res => {
              if (res.data.code) {
                that.fieldModal = false
                that.init()
                that.$message.success(res.data.msg)
              } else {
                that.$message.error(res.data.msg)
              }
            })
          } else {
            // 编辑更新数据
            const updateData = JSON.parse(JSON.stringify(that.ruleForm))
            updateData['id'] = that.selectId
            jobUpdate(updateData).then(res => {
              // console.log(res)
              if (res.data.code) {
                that.fieldModal = false
                that.init()
                that.$message.success(res.data.msg)
              } else {
                that.$message.error(res.data.msg)
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      // 先将存储的选择id清除
      this.selectId = ''
      this.$refs[formName].resetFields()
    },
    toPerson(node, data) {
      // 点击职务名称切换tabs
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      // 如果存储的id为空或者跟当前id部匹配就调用获取人员函数
      if (
        this.nowOfficeId === '' ||
        this.nowOfficeId !== children[index]['id']
      ) {
        // 获取人员列表
        this.nowOffice = children[index]['label']
        this.nowOfficeId = children[index]['id']
        this.personnelInit()
        this.activeName = 'second'
      } else {
        // 切换tabs
        this.nowOffice = children[index]['label']
        this.nowOfficeId = children[index]['id']
        this.activeName = 'second'
      }
    },
    handleNodeClick(data) {
      // 点击树形回调
      console.log(data)
      // 将当前选择的职务id暂存
      this.nowOfficeId = data.id
      this.nowOffice = data.label
      this.personnelInit()
    },
    tableSelect(selection, row) {
      // 人员列表table表格勾选处理
      // console.log(selection)
      this.selTables = selection
    },
    tableSelectAll(selection) {
      // console.log(selection)
      this.selTables = selection
    },
    handleSizeChange(val) {
      // 人员管理分页选择当前一页多少条数据回调
      this.pageSize = val
      this.personnelInit()
    },
    handleCurrentChange(val) {
      // 人员管理分页当前页码回调
      this.currentPage = val
      this.personnelInit()
    },
    personnelInit() {
      //  当前职务下所属人员初始化
      if (this.nowOfficeId === '') {
        return
      } // 当前如果没选择职务，则不继续执行下面代码
      this.tloading = true
      const current = this.currentPage
      const size = this.pageSize
      getParList(this.nowOfficeId, this.keyEmp, current, size)
        .then(res => {
          console.log(res.data)
          this.empTableData = res.data.data
          this.pageTotal = res.data.total
          this.tloading = false
        })
        .catch(err => {
          console.log(err)
          this.tloading = false
        })
    },
    getPersonList() {
      // 添加人员到当前职务初始化
      if (this.nowOfficeId === '') {
        this.$message.warning('请先选择一个职务后再新增人员！')
        return
      }
      // 先清空所有存储列表
      this.addPlist = []
      this.selParList = []
      this.searchPlist = []
      this.modalTitle = '请选择员工'
      getpersonSlist(this.nowOfficeId, this.keyPerson).then(res => {
        console.log(res.data)
        const perArr = res.data.map(v => {
          v.is_chose = false
          return v
        })
        this.addPlist = perArr
        // 打开弹出窗口
        this.personModal = true
      })
    },
    searchParnell() {
      const that = this
      // 获取查询关键字后的数据
      if (this.keyPerson === '') {
        this.showSList = false
      } else if (this.keyPerson !== '') {
        this.showSList = true
        this.tipsMsg = '加载中...'
        this.searchPlist = []
        getpersonSlist(this.nowOfficeId, this.keyPerson).then(res => {
          console.log(res.data)
          const sperArr = res.data.map(v => {
            if (that.selParList.find(n => n.id === v.id)) {
              v.is_chose = true
            } else {
              v.is_chose = false
            }
            return v
          })
          that.searchPlist = sperArr
          if (that.searchPlist.length === 0) {
            that.tipsMsg = '暂无数据'
          }
        })
      }
    },
    addSelPerson(i) {
      // 新增弹出选择人员处理
      // console.log(i)
      const that = this
      let selectObj = {}
      if (this.showSList) {
        // 显示搜索结果列表
        this.searchPlist[i]['is_chose'] = !this.searchPlist[i]['is_chose']
        selectObj = this.searchPlist[i]
      } else {
        // 显示全部列表
        this.addPlist[i]['is_chose'] = !this.addPlist[i]['is_chose']
        selectObj = this.addPlist[i]
      }
      const status = selectObj['is_chose']
      const isExist = this.selParList.find(v => v.id === selectObj.id)
      // 如果状态为true而选择列表selParList中没有这个obj
      if (status && !isExist) {
        this.selParList.push(selectObj)
      }
      // 如果状态为false而选择列表selParList中有这个obj
      if (!status && isExist) {
        that.selParList.forEach((item, index) => {
          if (selectObj.id === item.id) {
            that.selParList.splice(index, 1)
          }
        })
      }
      // console.log(this.searchPlist)
      // console.log(this.selParList)
    },
    delSelect(i) {
      const delObj = this.selParList[i]
      // 如果同时在选择左侧列表中有，将左侧列表的状态改变即可
      this.addPlist.forEach(item => {
        if (item.id === delObj.id) {
          item['is_chose'] = false
        }
      })

      this.searchPlist.forEach(info => {
        if (info.id === delObj.id) {
          info['is_chose'] = false
        }
      })
      // 删除选择的条数
      this.selParList.splice(i, 1)
    },
    savePasennl() {
      const that = this
      const idArr = this.selParList.map(v => {
        return v.id
      })
      if (idArr.length === 0) {
        this.$message.warning('请选择至少一位人员！')
        return
      }
      this.parsLoading = true
      saveAddPer(this.nowOfficeId, idArr.join(',')).then(res => {
        console.log(res.data)
        if (res.data.code) {
          that.personnelInit()
          // 关闭loading 和弹出窗体
          that.parsLoading = false
          that.personModal = false
          that.$message.success(res.data.msg)
        } else {
          that.parsLoading = false
          that.personModal = false
          that.$message.error(res.data.msg)
        }
      })
    },
    handleCommand(command) {
      const that = this
      // 更多功能分类处理
      // console.log(command)
      if (command === 'del') {
        if (this.selTables.length === 0) {
          this.$message.warning('请先选择至少一个人员才能移除！')
          return
        }
        const idArr = this.selTables.map(v => {
          return v.id
        })
        this.$confirm(
          '此操作将从' + that.nowOffice + '下移除这些员工, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            delParList(this.nowOfficeId, idArr.join(',')).then(res => {
              if (res.data.code) {
                that.personnelInit()
                that.$message.success(res.data.msg)
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
    delOnePerson(id) {
      const that = this
      this.$confirm(
        '此操作将从' + that.nowOffice + '下移除当前员工, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          delParList(this.nowOfficeId, id).then(res => {
            if (res.data.code) {
              that.personnelInit()
              that.$message.success(res.data.msg)
            } else {
              that.$message.error(res.data.msg)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    setEmpMsg(id) {
      getEmpDetail(this.nowOfficeId, id).then(res => {
        console.log(res.data)
        this.empbaseMsg = true
        res.data.Depart = res.data.Depart.join('|')
        this.empData = res.data
      })
    },
    addPerson(a, id) {
      // 点击页面上新增获取人员列表并打开弹窗
      if (a === 2) {
        this.$refs['levelsForm'].resetFields()
        this.levelTitle = '新增岗位级别'
        this.personModal = true
        this.isLevel = true
        this.editLevelId = ''
        return
      } else if (a === 3) {
        // console.log(id)
        this.$refs['levelsForm'].resetFields()
        this.levelTitle = '编辑岗位级别'
        this.isLevel = true
        // 调取设置表单，并将id传入
        this.editLevelId = ''
        this.setLeveFrom(id)
        return
      } else if (a === 1) {
        this.levelTitle = '请选择人员'
        this.isLevel = false
        this.getPersonList()
      }
    },
    saveAddPerson() {
      const that = this
      if (this.isLevel) {
        // 保存岗位级别
        this.$refs['levelsForm'].validate(valid => {
          if (valid) {
            // 验证成功
            const LevName = that.levelForm.LevName
            const LevSerial = that.levelForm.LevSerial
            if (that.editLevelId === '') {
              saveLevel({ name: LevName, num: LevSerial }).then(res => {
                console.log(res.data)
                if (res.data.code) {
                  // 更新岗位级别table数据
                  that.initLevel()
                  // 更新岗位级别下拉列表数据
                  that.initLeveList()
                  that.$message.success(res.data.msg)
                  that.personModal = false
                } else {
                  that.$message.error(res.data.msg)
                  that.personModal = false
                }
              })
            } else {
              const editLevelId = that.editLevelId
              updateLevel({
                id: editLevelId,
                name: LevName,
                num: LevSerial
              }).then(res => {
                console.log(res.data)
                if (res.data.code) {
                  // 更新岗位级别table数据
                  that.initLevel()
                  // 更新岗位级别下拉列表数据
                  that.initLeveList()
                  that.$message.success(res.data.msg)
                  that.personModal = false
                } else {
                  that.$message.error(res.data.msg)
                  that.personModal = false
                }
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        // 调用保存函数
        this.savePasennl()
      }
    }
    // jobChange(val) {
    //   // 部门下拉框改变事件
    //   this.ruleForm.parent = val.length === 0 ? null : val[val.length - 1] // 当前选择的部门
    // }
  },
  mounted() {
    this.bodyHeight = window.innerHeight - 180
    this.tableHeight = window.innerHeight - 350
    this.treeRWidth = window.innerWidth - (window.innerWidth * 0.21 + 220)
    this.init() // 初始化
    this.initLevel() // 初始化岗位级别
    this.initLeveList() // 岗位级别管理下拉框
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 重置element-ui 样式*/
.job-box {
  .job-manage {
    .el-tree {
      .el-tree-node {
        &:focus {
          > .el-tree-node__content {
            background-color: #f0f5ff;
          }
        }
        .is-current {
          > .el-tree-node__content {
            > .custom-tree-node {
              > .tree-label {
                color: #3cc195;
              }
              > .tree-opera {
                color: #3cc195;
              }
            }
          }
        }
      }
      .el-tree-node__content {
        height: 44px;
        border-bottom: 1px solid #e4e7ed;
        &:hover {
          background-color: #f0f5ff;
        }
        .el-tree-node:focus {
          background-color: #f0f5ff;
        }
      }
    }
  }
}
.add-person-box {
  .person {
    .reset-badge {
      .el-badge__content.is-dot {
        width: 12px;
        height: 12px;
        background-color: #0bb27a;
      }
    }
  }
}
/* 单个人员信息展示 */
.show-msg-modal {
  .avatar {
    background: 0 0;
    box-sizing: border-box;
    display: inline-block;
    text-align: center;
    color: #fff;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    width: 58px;
    height: 58px;
    line-height: 58px;
    border-radius: 29px;
    > img {
      width: 100%;
      height: 100%;
    }
  }
  .msg-title {
    > h4 {
      font-size: 20px;
      line-height: 36px;
    }
    > p {
      font-size: 14px;
    }
  }
  .msg-content {
    padding-top: 24px;
    .content-ul {
      width: 60%;
      .content-li {
        list-style: none;
        display: flex;
        margin-bottom: 20px;
        font-size: 14px;
        .label {
          width: 90px;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #80848f;
          margin-right: 10px;
        }
        .item {
          flex: 1;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.job-box {
  /* 职务管理 */
  .job-manage {
    .operating-group {
      display: flex;
      padding-top: 17px;
      .search-input {
        width: 240px;
        display: flex;
        line-height: 40px;
        .input-box {
          flex: 1;
        }
      }
      .button-group {
        flex: 1;
        text-align: right;
      }
    }
    .tree-header {
      margin-top: 16px;
      border-bottom: 1px solid #f0f4f8;
      background: #f5f8fa;
      display: flex;
      .org-tree-left {
        height: 40px;
        line-height: 40px;
        text-indent: 18px;
        flex: 1;
      }
      .org-tree-right {
        height: 40px;
        line-height: 40px;
        display: flex;
        > span {
          display: inline-block;
        }
        .head-number,
        .head-office,
        .head-founder,
        .head-founder,
        .head-desc,
        .head-date {
          flex: 1;
        }
        .head-opera {
          flex: 2;
        }
        .head-founder,
        .head-date {
          text-align: center;
        }
      }
    }
    .custom-tree-node {
      width: 100%;
      display: flex;
      .tree-label {
        flex: 1;
        &:hover {
          color: rgb(89, 201, 147);
        }
      }
      .tree-opera {
        display: flex;
        > div {
          display: inline-block;
          box-sizing: border-box;
        }
        .org-number,
        .org-office,
        .org-founder,
        .org-founder,
        .org-desc,
        .org-date {
          flex: 1;
        }
        .org-opera {
          flex: 2;
        }
        .org-desc {
          overflow: hidden;
          .desc {
            display: inline-block;
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-right: 16px;
          }
        }
        .org-founder,
        .org-date {
          text-align: center;
        }
        .org-opera {
          text-align: center;
          > span {
            display: none;
            color: rgb(89, 201, 147);
          }
          .add,
          .edit {
            margin-right: 16px;
          }
          .del {
            margin-right: 18px;
          }
        }
      }
      &:hover {
        .tree-opera {
          .org-opera {
            > span {
              display: inline-block;
            }
          }
        }
      }
    }
  }
  /* 岗位级别 */
  .job-level {
    .operating-group {
      display: flex;
      padding-top: 17px;
      .screening-box {
        width: 240px;
        display: flex;
        line-height: 40px;
        .input-box {
          flex: 1;
        }
      }
      .btn-group {
        flex: 1;
        text-align: right;
      }
    }
  }
  /* 人员管理 修改*/
  .personnel {
    .search-box {
      width: 30%;
      padding-left: 80px;
      position: relative;
      .label {
        position: absolute;
        top: 0px;
        left: 6px;
        line-height: 32px;
      }
    }
  }
}

/* 选择员工 */
.add-person-box {
  height: 380px;
  .parsen-list {
    height: 100%;
    display: flex;
    flex-direction: column;
    .search-input {
      margin-bottom: 10px;
    }
    .parsen-cell {
      flex: 1;
      overflow: hidden;
      overflow-y: auto;
      .parsen-item {
        cursor: pointer;
        list-style: none;
        margin-bottom: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .avatar {
          background: 0 0;
          box-sizing: border-box;
          display: inline-block;
          text-align: center;
          color: #fff;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          vertical-align: middle;
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 15px;
          margin-left: 10px;
          margin-right: 6px;
          > img {
            width: 100%;
            height: 100%;
          }
        }
        &:hover {
          .personnel-msg {
            color: rgb(11, 178, 122);
          }
        }
      }
    }
  }
  .done-slist {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 14px;
    .done-title {
      line-height: 32px;
      font-size: 13px;
      margin-bottom: 10px;
    }
    .parsen-cell {
      flex: 1;
      overflow: hidden;
      overflow-y: auto;
      .parsen-item {
        cursor: pointer;
        list-style: none;
        margin-bottom: 10px;
        padding: 10px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-color: #f8f8f9;
        margin-right: 8px;
        border-radius: 4px;
        .avatar {
          background: 0 0;
          box-sizing: border-box;
          display: inline-block;
          text-align: center;
          color: #fff;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          vertical-align: middle;
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 15px;
          margin-left: 10px;
          margin-right: 6px;
          > img {
            width: 100%;
            height: 100%;
          }
        }
        > i {
          float: right;
          padding: 3px;
          border-radius: 50%;
          margin-top: 4px;
          margin-right: 6px;
          &:hover {
            background-color: rgba(11, 178, 122, 0.6);
            color: #fff;
          }
        }
      }
    }
  }
}

/* 媒体查询，当屏幕过小的时候自动增大查询框长度*/
@media screen and (max-width: 1360px) {
  .job-box {
    .personnel {
      .search-box {
        width: 42%;
      }
    }
  }
}
</style>
