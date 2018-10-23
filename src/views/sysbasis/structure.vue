<template>
  <div class="app-container">
    <el-row :gutter="18" class="structure">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-tabs v-model="activeName">
          <el-tab-pane label="组织管理" class="org-manage" name="first">
            <el-alert title="点击组织的名称可查看当前组织所属的人员列表" type="success">
            </el-alert>
            <div class="operating-group">
              <div class="search-input">
                搜索组织&nbsp;&nbsp;&nbsp;
                <div class="input-box">
                  <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                  </el-input>
                </div>
              </div>
              <div class="button-group">
                <el-button type="primary" @click="addOrg(1)">新增组织</el-button>
                <el-button type="primary" plain>更多功能</el-button>
              </div>
            </div>
            <div class="tree-header">
              <div class="org-tree-left">组织名称</div>
              <div class="org-tree-right" :style="{width: treeRWidth + 'px'}">
                <span class="head-number">在职人数</span>
                <span class="head-office">是否办事处</span>
                <span class="head-desc">组织描述</span>
                <span class="head-founder">创建人</span>
                <span class="head-date">创建时间</span>
                <span class="head-opera"></span>
              </div>
            </div>
            <el-tree :data="treeData" node-key="id" default-expand-all :props="defaultProps" :filter-node-method="filterNode" @node-click="handleNodeClick" ref="tree2">
              <div class="custom-tree-node" slot-scope="{ node, data }">
                <div class="tree-label" @click.stop="lookParsonnel(node, data)">{{ node.label }}</div>
                <div class="tree-opera" :style="{width: treeRWidth + 'px'}">
                  <div class="org-number">{{ node.data.Employees }}人</div>
                  <div class="org-office">{{ node.data.IsOffice === 0 ? '否' : '是' }}</div>
                  <div class="org-desc">
                    <span class="desc" :title="node.data.Description">{{node.data.Description}}</span>
                  </div>
                  <div class="org-founder">{{node.data.Founder}}</div>
                  <div class="org-date">{{node.data.CrteatDate}}</div>
                  <div class="org-opera">
                    <span class="add" @click.stop="() => {addOrg(3,node,data)}">新增组织</span>
                    <span class="edit" @click.stop="() => {addOrg(2,node,data)}">编辑组织</span>
                    <span class="del" @click.stop="() => remove(node, data)">删除当前组织</span>
                  </div>
                </div>
              </div>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="组织架构图" name="second" lazy>
            <div class="orgChart" id="org_chart" style="border: 1px solid #ccc;" :style="{minHeight: bodyHeight + 'px'}">
              <div style="margin: 16px 0;padding-left: 30px;">
                延伸方向：
                <el-switch v-model="horizontal"></el-switch>&nbsp;&nbsp;&nbsp; 折叠效果：
                <el-switch v-model="collapsable"></el-switch>&nbsp;&nbsp;&nbsp; 主题切换：
                <el-select v-model="labelClassName" placeholder="请选择主题">
                  <el-option v-for="item in styOptions" :value="item.value" :key="item.value" :label="item.text"></el-option>
                </el-select>
              </div>
              <org-tree :data="data" :horizontal="horizontal" :collapsable="collapsable" :label-class-name="labelClassName" :render-content="renderContent" @on-expand="onExpand" @on-node-click="onNodeClick" @on-node-delete="onNodeDelete">
              </org-tree>
            </div>
          </el-tab-pane>
          <el-tab-pane label="人员管理" class="personnel" name="third">
            <el-alert style="margin-bottom: 16px;" :closable="false" :title="selectId === '' ? '你当前没有选择一个组织，无法查看组织下属人员！' : '当前选择的组织为：' + studyName" :type="selectId === '' ? 'error' : 'success'">
            </el-alert>
            <!-- 头部筛选 -->
            <TopOperating hidefilter>
              <div slot="commonly">
                <div class="search-box">
                  <span class="label">搜索人员</span>
                  <el-input v-model="pTablekey" placeholder="请输入姓名或工号" @keyup.native="personnelInit"></el-input>
                </div>
              </div>
              <div slot="button">
                <el-button type="primary" style="margin-right: 14px;" @click="getPersonList">添加人员</el-button>
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
            <iviewTable stripe :columns="columns" :loading="tloading" :data="TableData" :height="tableHeight" @on-select="tableSelect" @on-select-all="tableSelectAll" style="margin-top: 20px;"></iviewTable>
            <!-- 分页 -->
            <el-pagination style="margin-top: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSArr" :page-size="pageSize" background layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!-- 部门新增/编辑弹出modal -->
    <Modal v-model="fieldModal" class="iview-right-model" :width="700" :styles="{'margin-right':'10px','height':'calc(100% - 50px)','top':'50px'}" :transfer="false" :transition-names="['move-right','fade']">
      <h3 slot="header">{{modalTitle}}</h3>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请填写部门名称"></el-input>
        </el-form-item>
        <el-form-item v-if="showRadio" label="办事处" prop="isoffice">
          <el-radio-group v-model="ruleForm.isoffice">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="上级部门" prop="parent">
          <el-cascader :options="casOptions" v-model="ruleForm.departModel" placeholder="请选择上级部门" expand-trigger="hover" change-on-select :clearable='true' @change="departChange">
          </el-cascader>
        </el-form-item> -->
        <el-form-item label="排序" prop="sort">
          <el-input v-model="ruleForm.sort" placeholder="默认为0"></el-input>
        </el-form-item>
        <el-form-item label="职责介绍" prop="desc">
          <el-input type="textarea" placeholder="请填写部门职责介绍" :autosize="{ minRows: 4, maxRows: 12}" v-model="ruleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <p style="margin: 0; margin-top: 16px;" class="warn-content">1. 人员归属组织架构，一人可归属多个部门。
      </p>
      <div slot="footer">
        <el-button @click="fieldModal = false">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </div>
    </Modal>
    <!-- 人员管理弹出窗体 -->
    <Modal v-model="isAddPer" title="请选择员工" width="520">
      <div class="add-person-box">
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
      <div slot="footer">
        <el-button v-if="!parsLoading" @click="isAddPer = false">取消</el-button>
        <el-button v-if="!parsLoading" type="primary" @click="savePasennl">保存</el-button>
        <el-button v-if="parsLoading" type="primary" @click="savePasennl" :loading="true">正在保存...</el-button>
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
// import { getDepartTree as getDepartCombo } from '@/api/comm/treeselect'
import {
  getTree,
  getOrgChart,
  searchNode,
  organiDel,
  orgCheck,
  saveStruc,
  organiUpdate,
  getPersonnel,
  personelList,
  savePersonnel,
  delPersonnel,
  getEmpDetail
} from '@/api/sysbasis/structure'
import OrgTree from '../../components/OrgTree'
import TopOperating from '@/views/components/TopOperating'
export default {
  name: 'structureSysbasis',
  components: {
    OrgTree,
    TopOperating
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    },
    selectId(val) {
      this.personnelInit()
    }
  },
  data() {
    const _this = this
    const validateName = (rule, value, callback) => {
      if (value !== '') {
        orgCheck(this.ruleForm.parent, this.selectId, value).then(res => {
          console.log(res.data)
          if (res.data.code) {
            return callback(new Error('部门名称重复！'))
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
      modalTitle: '新增组织', // 弹出窗标题
      filterText: '', // 树形筛选input
      treeData: [], // 树形数据
      selectId: '', // 当前用户选择的部门id
      studyName: '', // 当前选择的部门名称
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // casOptions: [], // 树形选择数据
      selValue: null, // 树形数据的value
      ruleForm: {
        isoffice: '0',
        name: '',
        parent: null,
        sort: '0',
        desc: ''
      },
      rules: {
        isoffice: [
          { required: true, message: '请选择是否为办事处', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          {
            min: 2,
            max: 12,
            message: '长度在 2 到 12 个字符',
            trigger: 'blur'
          },
          { validator: validateName, trigger: 'blur' }
        ],
        parent: [
          { required: true, message: '请选择上级部门', trigger: 'change' }
        ]
      },
      data: {},
      horizontal: false,
      collapsable: false,
      labelClassName: 'bg-blue',
      styOptions: [
        {
          text: '浅绿',
          value: 'bg-blue'
        },
        {
          text: '白色',
          value: 'bg-white'
        },
        {
          text: '橙色',
          value: 'bg-orange'
        },
        {
          text: '金色',
          value: 'bg-gold'
        },
        {
          text: '灰色',
          value: 'bg-gray'
        },
        {
          text: '浅粉色',
          value: 'bg-lightpink'
        },
        {
          text: '巧克力色',
          value: 'bg-chocolate'
        },
        {
          text: '番茄色',
          value: 'bg-tomato'
        }
      ], // 组织架构图主题风格
      columns: [
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
      tloading: false, // table表格加载中样式
      TableData: [], // 人员table表格数据
      tableHeight: 500, // table表格高度
      addPlist: [], // 所有人员列表
      selParList: [], // 选择后人员列表
      searchPlist: [], // 查询结果列表
      isAddPer: false, // 人员管理新增人员弹出控制
      keyPerson: '', // 查询人员关键词
      showSList: false, // 是否显示查询列表
      tipsMsg: '加载中...',
      parsLoading: false, // 保存中状态切换
      selTables: [], // table表格选择的人员
      currentPage: 1, // 当前页码
      pageSize: 50, // 当前一页多少条数
      pageSArr: [20, 50, 100, 200, 300, 400], // 一页多少条的选项数据data
      pageTotal: 0, // 当前数据总条数
      pTablekey: '', // table表格查询关键字
      empbaseMsg: false, // 控制人员基本信息显示
      empData: {}, // 人员基本信息
      showRadio: true // 办事处不显示选择radio
    }
  },
  methods: {
    init() {
      const that = this
      // 获取树形结构数据
      getTree().then(res => {
        // console.log(res.data)
        that.treeData = res.data
        // console.log(that.casOptions)
      })
      getOrgChart().then(res => {
        // console.log(res.data)
        that.data = res.data
      })
    },
    // formInit() {
    //   const that = this
    //   // 获取上级组织数据
    //   getDepartCombo().then(res => {
    //     // console.log(res.data)
    //     // const casData = JSON.parse(JSON.stringify(res.data)) // 深拷贝，防止数据污染
    //     that.casOptions = res.data
    //   })
    // },
    personnelInit() {
      if (this.selectId === '') {
        return
      }
      this.tloading = true
      const current = this.currentPage
      const size = this.pageSize
      // 当前组织所属人员初始化
      getPersonnel(this.selectId, this.pTablekey, current, size)
        .then(res => {
          console.log(res.data)
          this.TableData = res.data.data
          this.pageTotal = res.data.total
          this.tloading = false
        })
        .catch(err => {
          console.log(err)
          this.tloading = false
        })
    },
    getPersonList() {
      if (this.selectId === '') {
        this.$message.warning('请先选择一个组织后再新增人员！')
        return
      }
      // 先清空所有存储列表
      this.addPlist = []
      this.selParList = []
      this.searchPlist = []
      this.modalTitle = '请选择员工'
      personelList(this.selectId, this.keyPerson).then(res => {
        console.log(res.data)
        const perArr = res.data.map(v => {
          v.is_chose = false
          return v
        })
        this.addPlist = perArr
        this.isAddPer = true
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
        personelList(this.selectId, this.keyPerson).then(res => {
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
      savePersonnel(this.selectId, idArr.join(',')).then(res => {
        console.log(res.data)
        if (res.data.code) {
          that.personnelInit()
          that.init()
          that.parsLoading = false
          that.isAddPer = false
          that.$message.success(res.data.msg)
        } else {
          that.parsLoading = false
          that.isAddPer = false
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
          '此操作将从' + that.studyName + '下移除这些员工, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            delPersonnel(this.selectId, idArr.join(',')).then(res => {
              if (res.data.code) {
                that.personnelInit()
                that.init()
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
        '此操作将从' + that.studyName + '下移除当前员工, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          delPersonnel(this.selectId, id).then(res => {
            if (res.data.code) {
              that.personnelInit()
              that.init()
              that.$message.success(res.data.msg)
            } else {
              that.$message.error(res.data.msg)
            }
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
    },
    setEmpMsg(id) {
      getEmpDetail(this.selectId, id).then(res => {
        console.log(res.data)
        this.empbaseMsg = true
        res.data.Depart = res.data.Depart.join('|')
        this.empData = res.data
      })
    },
    tableSelect(selection, row) {
      // console.log(selection)
      this.selTables = selection
    },
    tableSelectAll(selection) {
      // console.log(selection)
      this.selTables = selection
    },
    handleSizeChange(val) {
      // 分页选择当前一页多少条数据回调
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.personnelInit()
    },
    handleCurrentChange(val) {
      // 分页当前页码回调
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.personnelInit()
    },
    filterNode(value, data) {
      // 树形结构筛选处理
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      // 树形节点点击回调
      // console.log(data)
      this.selectId = data.id
      this.studyName = data.label
      // 获取当前点击的部门所属人员
      this.personnelInit()
    },
    lookParsonnel(node, data) {
      // 查看该组织下的人员列表
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      // 设置当前选择的部门id和名称
      this.selectId = children[index]['id']
      this.studyName = children[index]['label']
      // 获取当前选择的部门所属人员
      this.personnelInit()
      // 切换到人员管理
      this.activeName = 'third'
    },
    remove(node, data) {
      const that = this
      // 删除组织
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      if (children[index].children && children[index].children.length !== 0) {
        this.$message.warning(
          '当前选择的组织有子集，请将当前子集删除完成后才能删除当前组织。'
        )
        return
      }
      this.$confirm(
        '此操作将删除当前组织以及组织下所属组织, 是否继续?',
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
          console.log(id)
          console.log(name)
          organiDel({ id, name }).then(res => {
            // console.log(res)
            if (res.data.code) {
              // 操作成功
              // 删除前台页面中的结构树的node
              children.splice(index, 1)
              // 更新列表
              that.init()
              // that.formInit()
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
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
    },
    addOrg(...arr) {
      // console.log(arr)
      const that = this
      // 先重置表单
      this.resetForm('ruleForm')
      if (arr[0] === 1) {
        // that.ruleForm.departModel = []
        that.modalTitle = '新增组织'
        that.fieldModal = true
        return
      }
      const node = arr[1]
      const data = arr[2]
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      if (arr[0] === 2) {
        that.modalTitle = '编辑组织'
        // 设置表单数据
        that.setForm(children[index]['id'], children[index]['label'])
        that.fieldModal = true
      } else if (arr[0] === 3) {
        that.modalTitle = '新增组织'
        that.fieldModal = true
        // 将当前组织id带入为当前新增的上级
        that.selValue = children[index]['id']
        that.ruleForm.parent = children[index]['code']
        // that.ruleForm.departModel = that.getParentsModel(
        //   that.casOptions,
        //   children[index]['code']
        // )
        if (children[index]['IsOffice'] === 1) {
          this.showRadio = false
        } else {
          this.showRadio = true
        }
        // console.log(that.selValue)
        // console.log(that.ruleForm.parent)
      }
    },
    getParentsModel(data, id) {
      const res = []
      for (var i = 0; i < data.length; i++) {
        if (data[i].value === id) {
          res.push(data[i].value)
          return res
        }
        if (data[i].children) {
          const rr = this.getParentsModel(data[i].children, id)
          if (rr) {
            res.push(data[i].value)
            return res.concat(rr)
          }
        }
      }
    },
    setForm(id, name) {
      const that = this
      this.selectId = id
      this.studyName = name
      // 设置表单数据
      searchNode({ id, name }).then(res => {
        console.log(res.data)
        const formData = res.data
        that.ruleForm = formData
        // that.selValue = formData.parent
        that.ruleForm.parent = formData.parent
        // that.ruleForm.departModel = that.getParentsModel(
        //   that.casOptions,
        //   formData.parent
        // )
        console.log(that.selValue)
        console.log(that.ruleForm.parent)
      })
      // 获取当前选择的组织所属的人员
      this.personnelInit()
    },
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(that.ruleForm)
          // 保存的时候要先判断是否是办事处1，如果不是将 that.ruleForm.office置空
          if (that.ruleForm.isoffice === '0') {
            that.ruleForm.office = ''
          }
          // 先判断是更新还是新增数据
          if (this.selectId === '') {
            // 提交服务器保存
            saveStruc(that.ruleForm).then(res => {
              if (res.data.code) {
                that.init()
                // that.formInit()
                that.fieldModal = false
                that.$message.success(res.data.msg)
              } else {
                that.$message.error(res.data.msg)
              }
            })
          } else {
            // 编辑更新数据
            const updateData = JSON.parse(JSON.stringify(that.ruleForm))
            updateData['id'] = that.selectId
            organiUpdate(updateData).then(res => {
              // console.log(res)
              if (res.data.code) {
                that.init()
                // that.formInit()
                that.fieldModal = false
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
      // 将treeSelect中的数据清空
      // this.selValue = null
      this.$refs[formName].resetFields()
    },
    renderContent(h, data) {
      return data.label
    },
    onExpand(data) {
      if ('expand' in data) {
        data.expand = !data.expand
        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      } else {
        this.$set(data, 'expand', true)
      }
    },
    collapse(list) {
      list.forEach(child => {
        if (child.expand) {
          child.expand = false
        }
        child.children && this.collapse(child.children)
      })
    },
    onNodeClick(e, data) {
      // 组织架构图label编辑
      alert(data.label)
    },
    onNodeDelete(e, data) {
      // 组织架构图label删除
      alert(data.label)
    }
    // departChange(val) {
    //   // 部门下拉框改变事件
    //   this.ruleForm.parent = val.length === 0 ? null : val[val.length - 1] // 当前选择的部门
    // }
  },
  mounted() {
    this.bodyHeight = window.innerHeight - 180
    this.tableHeight = window.innerHeight - 350
    this.treeRWidth = window.innerWidth - (window.innerWidth * 0.21 + 220)
    this.init() // 初始化
    // this.formInit() // 表单初始化
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 重置element-ui 样式*/
.structure {
  .org-manage {
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
  .orgChart {
    .bg-blue {
      background-color: #0bb27a;
      color: #fff;
    }
    .bg-white {
      background-color: white;
    }
    .bg-orange {
      background-color: orange;
    }
    .bg-gold {
      background-color: gold;
    }
    .bg-gray {
      background-color: gray;
      color: #fff;
    }
    .bg-lightpink {
      background-color: lightpink;
    }
    .bg-chocolate {
      background-color: chocolate;
      color: #fff;
    }
    .bg-tomato {
      background-color: tomato;
    }
  }
}
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
.structure {
  /* 组织管理 */
  .org-manage {
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
  /* 人员管理 */
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
  .structure {
    .personnel {
      .search-box {
        width: 42%;
      }
    }
  }
}
</style>
