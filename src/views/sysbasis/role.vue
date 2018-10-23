<template>
  <div class="app-container">
    <el-row :gutter="18" class="role-manage">
      <el-col :xs="7" :sm="7" :md="6" :lg="6" :xl="6">
        <el-card class="box-card" :style="{minHeight: bodyHeight + 'px'}">
          <div slot="header" class="clearfix">
            <p class="card-title-xe">
              <span class="title-color-xe">角色</span>列表
              <el-button type="primary" style="float: right;" size="mini" plain @click="addRole(-1)">新增</el-button>
            </p>
          </div>
          <div class="role_body">
            <el-menu default-active="0" class="role-menu" @select="handleSelect">
              <el-menu-item v-for="(item, index) in roleData" :index="index+''" :key="index">
                <svg-icon icon-class="role" />
                <span slot="title">{{item.name}}</span>
                <i v-if="adminId !== item.id" class="el-icon-delete operating-icon" @click.stop="delRole(item.id)"></i>
                <i v-if="adminId !== item.id" class="el-icon-edit operating-icon" @click.stop="addRole(item.id)"></i>
              </el-menu-item>
            </el-menu>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="17" :sm="17" :md="18" :lg="18" :xl="18">
        <el-card class="box-card" :style="{minHeight: bodyHeight + 'px'}">
          <el-tabs>
            <el-tab-pane label="权限设置">
              <el-button type="primary" icon="el-icon-upload" @click="updatePower" style="margin-left: 20px; margin-bottom: 16px;">保存更新</el-button>
              <el-collapse class="power-list" value="0" @change="handleChange">
                <el-collapse-item class="p-item" v-for="(item,index) in powerList" :key="index+2" :title="item.label" :name="index+''">
                  <div class="child-collapse">
                    <el-collapse value="0" accordion>
                      <el-collapse-item class="c-item" v-for="(info,list) in item.children" :key="list+6" :title="info.label" :name="list+''">
                        <div class="operating">
                          <el-checkbox v-if="adminId === roleId" v-for="(admin, ins) in info.children" :key="ins+1" :value="admin.IsCheck === 0 ? false: true" disabled>{{admin.label}}</el-checkbox>
                          <el-checkbox v-if="adminId !== roleId" v-for="(check, mark) in info.children" :key="mark" :value="check.IsCheck === 0 ? false: true" @change="v => powerChecked([index,list,mark],v)">{{check.label}}</el-checkbox>
                        </div>
                      </el-collapse-item>
                    </el-collapse>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="人员管理" class="personnel">
              <TopOperating hidefilter>
                <div slot="commonly">
                  <div class="search-box">
                    <span class="label">搜索人员</span>
                    <el-input v-model="keyEmp" placeholder="请输入姓名或工号" @keyup.native="personnelInit"></el-input>
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
              <iviewTable stripe :columns="empColumns" :loading="tloading" :data="empTableData" :height="tableHeight" @on-select="tableSelect" @on-select-all="tableSelectAll" style="margin-top: 20px;"></iviewTable>
              <!-- 分页 -->
              <el-pagination style="margin-top: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSArr" :page-size="pageSize" background layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
              </el-pagination>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <!-- 排序弹窗 -->
    <Modal v-model="dialogRole" :title="roleTitle" :width="560">
      <el-form :model="roleForm" :rules="rulesRole" ref="opeaRole" label-width="100px">
        <el-form-item label="角色名称" prop="RoleName">
          <el-input v-model="roleForm.RoleName"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="RoleSort">
          <el-input v-model="roleForm.RoleSort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogRole = false">取消</el-button>
        <el-button type="primary" @click="updateRole">保存</el-button>
      </div>
    </Modal>
    <!-- 新增人员弹出框 -->
    <Modal v-model="personModal" title="请选择人员" :width="560">
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
      <!-- 底部保存操作 -->
      <div slot="footer">
        <el-button @click="personModal = false">取消</el-button>
        <el-button type="primary" @click="savePasennl" :loading="parsLoading">{{parsLoading ? '正在保存....' : '保存'}}</el-button>
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
    </Modal>
  </div>
</template>

<script>
import {
  getRole,
  addTRole,
  searchRole,
  updateTRole,
  delTRole,
  getRolePower,
  updateRpower,
  getRolePList,
  delRolePList,
  getRoleOPlist,
  checkRoleName,
  saveRoleAddP,
  getEmpDetail
} from '@/api/sysbasis/role'
import TopOperating from '@/views/components/TopOperating'
export default {
  name: 'roleSysbasis',
  components: {
    TopOperating
  },
  data() {
    const _this = this
    // 验证职务名称
    const validateName = (rule, value, callback) => {
      if (value !== '') {
        checkRoleName({
          id: this.editId,
          name: value
        }).then(res => {
          console.log(res.data)
          if (res.data.code) {
            return callback(new Error('角色名称重复！'))
          } else {
            return callback()
          }
        })
      } else {
        return callback()
      }
    }
    return {
      bodyHeight: '500', // min-heigth最小高度
      adminId: '', // 超级管理员id
      roleData: [], // 角色数据
      dialogRole: false, // dialog弹出层控制新增角色/ 编辑角色
      roleTitle: '新增角色', // 标题
      editId: '', // 编辑角色的id
      roleForm: {
        RoleName: '',
        RoleSort: ''
      }, // 新增/编辑角色表单
      rulesRole: {
        RoleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        RoleSort: [
          {
            required: true,
            message: '请输填写排序',
            trigger: 'blur'
          }
        ]
      }, // 角色表单验证规则
      dialogVisible: false, // dialog弹出层控制新增角色下人员
      roleId: '', // 当前选中的角色id
      roleName: '', // 当前选择的角色名字
      powerList: [], //  角色权限数据
      checkList: [], // 当前选中列表存储
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
      personModal: false // 新增人员/新增岗位级别弹窗控制
    }
  },
  methods: {
    init() {
      const that = this
      // 获取角色数据
      getRole().then(res => {
        // console.log(res.data)
        // 左侧角色列表
        that.roleData = res.data
        const id = res.data[0].id
        const name = res.data[0].name
        if (that.adminId === '') {
          // 只执行一次
          that.roleId = id
          that.roleName = name
          that.adminId = id // 超级管理员id
        }
        that.setForm(id, name)
      })
    },
    handleSelect(key, keyPath) {
      // 菜单激活回调
      //   console.log(key, keyPath)
      //   console.log(this.roleData[key])
      this.setForm(this.roleData[key].id, this.roleData[key].name)
    },
    addRole(a) {
      const that = this
      // 先置空编辑角色id
      this.$refs['opeaRole'].resetFields()
      this.editId = ''
      if (a === -1) {
        that.roleTitle = '新增角色'
      } else {
        this.roleTitle = '编辑角色'
        this.editId = a
        this.setRole()
      }
      this.dialogRole = true
    },
    setRole() {
      // 设置填充角色信息
      const that = this
      const id = this.editId
      searchRole(id).then(res => {
        // console.log(res.data)
        that.roleForm = {
          RoleName: res.data.RoleName,
          RoleSort: res.data.RoleSort
        }
      })
    },
    updateRole() {
      const that = this
      this.$refs['opeaRole'].validate(valid => {
        if (valid) {
          console.log(that.roleForm)
          if (this.editId === '') {
            // 新增
            addTRole(that.roleForm).then(res => {
              // console.log(res.data)
              if (res.data.code) {
                // 请求刷新角色列表数据
                that.init()
                that.$message.success(res.data.msg)
                // 关闭delog
                this.dialogRole = false
              } else {
                that.$message.error(res.data.msg)
                // 关闭delog
                this.dialogRole = false
              }
            })
          } else {
            const roleData = JSON.parse(JSON.stringify(that.roleForm))
            roleData.id = that.editId
            // 编辑
            updateTRole(roleData).then(res => {
              // console.log(res.data)
              if (res.data.code) {
                // 请求刷新角色列表数据
                that.init()
                that.$message.success(res.data.msg)
                // 关闭delog
                this.dialogRole = false
              } else {
                that.$message.error(res.data.msg)
                // 关闭delog
                this.dialogRole = false
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delRole(id) {
      // 删除角色
      const that = this
      this.$confirm('此操作将删除你所选中的角色, 是否继续?', '希尔ERP提示您', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // console.log(id)
          delTRole(id).then(res => {
            // 提示消息
            if (res.data.code) {
              // 重新请求获取角色列表
              that.init()
              that.$message.success(res.data.msg)
            } else {
              that.$message.error(res.data.msg)
            }
          })
        })
        .catch(err => {
          console.log(err)
          // that.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
    },
    handleChange(val) {
      // 折叠面板回调
      //   console.log(val)
    },
    setForm(id, name) {
      const that = this
      // 设置当前选择角色id
      this.roleId = id
      this.roleName = name
      // 根据id 获取角色权限列表
      getRolePower({ id, name }).then(res => {
        // console.log(res.data)
        that.powerList = []
        that.$nextTick(() => {
          that.powerList = res.data
        })
      })
      // 根据角色id获取当前角色所属人员
      this.personnelInit()
    },
    powerChecked(...arr) {
      // 权限checkbox勾选处理
      //   console.log(arr)
      const cIndex = arr[0] // 用来定位当前点击的checkbox
      const checkV = arr[1] ? 1 : 0 // 当前点击checkbox执行的结果
      // checkbox状态切换
      this.powerList[cIndex[0]].children[cIndex[1]].children[
        cIndex[2]
      ].IsCheck = checkV
    },
    updatePower() {
      // 更新处理权限
      const arrList = []
      const powerArr = []

      // 将所有权限配置项提取出来
      this.powerList.forEach(item => {
        item.children.forEach(info => {
          arrList.push(info)
        })
      })

      // 遍历所有权限配置项，将勾选中的全部处理好并暂存起来
      arrList.forEach(power => {
        const Pid = power.id
        const Plabel = power.label
        power.children.forEach(check => {
          if (check.IsCheck === 1) {
            const checkItem = {
              Pid: Pid,
              Plabel: Plabel,
              Cid: check.id,
              Clabel: check.label
            }
            powerArr.push(checkItem)
          }
        })
      })
      // console.log(powerArr)
      // 更新操作提交到后台
      const role = this.roleId
      updateRpower(powerArr, role).then(res => {
        console.log(res.data)
        if (res.data.code) {
          this.$message.success(res.data.msg)
        } else {
          this.$message.error(res.data.msg)
        }
      })
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
      if (this.roleId === '') {
        return
      } // 当前如果没选择职务，则不继续执行下面代码
      this.tloading = true
      const current = this.currentPage
      const size = this.pageSize
      getRolePList(this.roleId, this.keyEmp, current, size)
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
      if (this.roleId === '') {
        this.$message.warning('请先选择一个角色后再新增人员！')
        return
      }
      // 先清空所有存储列表
      this.addPlist = []
      this.selParList = []
      this.searchPlist = []
      this.modalTitle = '请选择员工'
      getRoleOPlist(this.roleId, this.keyPerson).then(res => {
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
        getRoleOPlist(this.roleId, this.keyPerson).then(res => {
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
      saveRoleAddP(this.roleId, idArr.join(',')).then(res => {
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
          '此操作将从' + that.roleName + '下移除这些员工, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            delRolePList(this.roleId, idArr.join(',')).then(res => {
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
        '此操作将从' + that.roleName + '下移除当前员工, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          delRolePList(this.roleId, id).then(res => {
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
      getEmpDetail(this.roleId, id).then(res => {
        console.log(res.data)
        this.empbaseMsg = true
        res.data.Depart = res.data.Depart.join('|')
        this.empData = res.data
      })
    }
  },
  mounted() {
    this.bodyHeight = window.innerHeight - 136
    this.tableHeight = window.innerHeight - 350
    this.init() // 初始化
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
/* reset menu*/
.role_body {
  .el-menu {
    border: none;
    .el-menu-item {
      /*border-bottom: solid 1px #e6e6e6;*/
      &.is-active {
        border-right: solid 2px #3cc195;
      }
      .operating-icon {
        display: none;
        float: right;
        margin-right: 0;
        width: 36px;
        padding: 6px 6px;
        margin-top: 16px;
      }
      .el-icon-edit.operating-icon {
        margin-right: 12px;
      }
      &:hover {
        .operating-icon {
          display: block;
        }
      }
    }
  }
}
/* reset badge */
.role-manage {
  /*权限设置/collapse reset*/
  .power-list {
    margin: 10px 20px;
    border: none;
    .p-item.el-collapse-item {
      border: 1px solid #ebeef5;
      margin-bottom: 24px;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      > div[role='tab'] {
        text-indent: 20px;
        > div[role='button'] {
          background-color: rgba(60, 193, 149, 0.6);
        }
        > div[role='button'].is-active {
          color: #fff;
        }
      }
      .child-collapse {
        padding: 0 30px;
        .c-item.el-collapse-item {
          > div[role='tab'] {
            text-indent: 10px;
            > div[role='button'].is-active {
              color: rgba(60, 193, 149, 0.9);
            }
          }
          .operating {
            padding-left: 6px;
          }
        }
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
.role-manage {
  /*权限设置*/
  .power-list {
  }
  /*人员管理*/
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
