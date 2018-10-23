
<template>
  <div>
    <TopOperating>
      <div slot="commonly">
        <el-autocomplete v-model="searchForm.number" :fetch-suggestions="querySearchAsync" placeholder="请输入批次" @keyup.enter.native="handleSelect" @select="handleSelect" value-key="PlanNo"></el-autocomplete>
        <el-button type="primary" icon="el-icon-search" @click="getData">检索</el-button>
      </div>
      <div slot="button">
        <el-dropdown @command="buttonCommand">
          <el-button plain type="primary">批量操作
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{key:'register'}">报到成功</el-dropdown-item>
            <el-dropdown-item :command="{key:'mark'}">标记状态</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div slot="filterlist">
        <el-form :model="searchForm" inline>
          <el-form-item label="状态" prop="status">
            <el-cascader :options="this.status" v-model="searchForm.status" style="width:100%"></el-cascader>
          </el-form-item>
          <el-form-item label="部门" prop="DepartId">
            <el-cascader :options="departOptions" v-model="searchForm.DepartId" placeholder="以部门筛选" change-on-select clearable></el-cascader>
          </el-form-item>
          <el-form-item label="渠道" prop="SourceId">
            <el-select v-model="searchForm.SourceId" placeholder="请选择" clearable @change="getData">
              <el-option v-for="item in sourceOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="招聘职务" prop="PostId">
            <el-cascader :options="jobOptions" v-model="searchForm.PostId" placeholder="请选择职务" change-on-select clearable></el-cascader>
          </el-form-item>
        </el-form>
      </div>
    </TopOperating>
    <iviewTable stripe :columns="columns" :data="tableData" :loading="tableLoading" :height="tableHeight" @on-selection-change="onSelect"></iviewTable>
    <el-pagination style="margin-top:15px;" :page-sizes="[30, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableCount" :current-page.sync="pageIndex" @size-change="sizeChange" @current-change="pageChange">
    </el-pagination>
    <el-dialog :visible.sync="viewModal" title="标记结果" width="600px">
      <el-alert type="warning" title="注意" description="员工报到成功后即进入员工花名册，员工类型一旦保存无法修改，请确认选择正确" :closable="false"></el-alert>
      <el-form :model="viewForm" ref="viewForm" label-width="110px">
        <el-form-item label="标记为" prop="status" required>
          <el-cascader :options="this.status" v-model="viewForm.status" style="width:100%"></el-cascader>
        </el-form-item>
        <el-form-item label="员工类型" prop="type" required>
          <el-radio-group v-model="viewForm.type" :disabled="viewForm.status[0] !== '7833ba94-8f0a-11e8-86f8-44a84203f5fd'">
            <el-radio :label="1">一线</el-radio>
            <el-radio :label="0">二线</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="培训开始时间" prop="NextTime" :rules="{required:viewForm.status[0] === '7833ba94-8f0a-11e8-86f8-44a84203f5fd',message:'请选择时间'}">
          <el-date-picker v-model="viewForm.NextTime" type="datetime" placeholder="请选择时间" style="width:100%" :picker-options="pickerOptions" :disabled="viewForm.status[0] !== '7833ba94-8f0a-11e8-86f8-44a84203f5fd'" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="预约回访时间" prop="VisitTime" :rules="{required:viewForm.status[0] === '9cd9354d-8f0a-11e8-86f8-44a84203f5fd',message:'请选择时间'}">
          <el-date-picker v-model="viewForm.VisitTime" type="datetime" placeholder="请选择预约时间" style="width:100%" :picker-options="pickerOptions" :disabled="viewForm.status[0] !== '9cd9354d-8f0a-11e8-86f8-44a84203f5fd'" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="viewModal=false">取消</el-button>
        <el-button type="primary" :loading="saveing" @click="register">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="linkModal" title="联系记录" width="600px">
      <el-form :model="linkForm" ref="linkForm" label-width="110px" :rules="{'DailTime':[{required:true,message:'请选择联系时间'}],'LinkStatus':[{required:true,message:'请选择联系状态'}]}">
        <el-form-item label="联系时间" prop="DailTime">
          <el-date-picker type="datetime" style="width:100%" v-model="linkForm.DailTime" placeholder="请选择联系时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="联系状态" prop="LinkStatus">
          <el-select v-model="linkForm.LinkStatus" placeholder="请选择" style="width:100%">
            <el-option v-for="item in statusOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="沟通结果" prop="Remark">
          <el-input v-model="linkForm.Remark" placeholder="请输入沟通结果" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="预约时间" prop="VisitTime">
          <el-date-picker type="datetime" style="width:100%" v-model="linkForm.VisitTime" placeholder="请选择预约时间" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="linkModal=false">取消</el-button>
        <el-button type="primary" :loading="saveing" @click="savelink">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import Vue from 'vue'
import TopOperating from '@/views/components/TopOperating'
import PanelMain from '@/views/components/TopOperating/PanelMain'
// import _ from 'lodash'
import {
  getDepartTree,
  getDutiesTree,
  getDataDictTree
} from '@/api/comm/treeselect'
import { getDataDict } from '@/api/comm/select'
import { getNumberList } from '@/api/recruiting/plan'
import { getRegisterList, saveRegister } from '@/api/recruiting/register.js'
import { saveDealLink, addDial } from '@/api/recruiting/link'
import { parseTime } from '@/utils'
import { agentAdd } from '@/api/comm/call'
export default {
  name: 'ResumeRegister',
  components: {
    TopOperating,
    PanelMain
  },
  data() {
    const _this = this
    return {
      columns: [
        // {
        //   title: '编号',
        //   key: 'PlanNo',
        //   fixed: 'left',
        //   minWidth: 140
        // },
        {
          type: 'selection',
          width: 52,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '',
          width: 32,
          fixed: 'left',
          render: function(h, obj) {
            return obj.row.today
              ? h('svg-icon', {
                props: { 'icon-class': 'g_link' },
                style: { fontSize: '14px', marginRight: '8px' }
              })
              : null
          }
        },
        {
          title: '招聘计划',
          key: 'PlanName',
          fixed: 'left',
          minWidth: 180
        },
        {
          title: '姓名',
          key: 'UserName',
          fixed: 'left',
          minWidth: 80
          // render: function(h, params) {
          //   return h(
          //     'el-button',
          //     {
          //       props: { type: 'text' },
          //       on: {
          //         click: function() {
          //           _this.resumeEdit(params.row.Id)
          //         }
          //       }
          //     },
          //     params.row.UserName
          //   )
          // }
        },
        {
          title: '性别',
          key: 'UserSex',
          minWidth: 60
        },
        {
          title: '状态',
          key: 'ResumeStatus',
          minWidth: 140
        },
        {
          title: '预约时间',
          key: 'ThisTime',
          minWidth: 120
        },
        {
          title: '预期岗位',
          key: 'PostName',
          minWidth: 100
        },
        {
          title: '联系方式',
          key: 'UserPhone',
          minWidth: 140
        },
        {
          title: '最近联系人',
          key: 'LastName',
          minWidth: 120
        },
        {
          title: '最近联系状态',
          key: 'LastStatus',
          minWidth: 120
        },
        {
          title: '最近联系时间',
          key: 'LastTime',
          minWidth: 120
        },
        {
          title: '操作',
          width: 80,
          align: 'center',
          fixed: 'right',
          render: function(h, obj) {
            return h('div', [
              _this.rowIndex !== obj.index ||
              _this.$store.state.call.callstatus === ''
                ? h(
                  'el-button',
                  {
                    props: { type: 'text' },
                    on: {
                      click: () => {
                        // _this.callDialog = true
                        // _this.$nextTick(function() {
                        //   _this.phone = obj.row.UserPhone
                        //   _this.$refs.call.setPhone(obj.row.UserPhone)
                        //   console.log(obj.row.UserPhone)
                        // })
                        if (_this.$store.state.call.regstatus === -1) {
                          _this.$notify.error({
                            title: '分机未注册',
                            dangerouslyUseHTMLString: true,
                            duration: 0,
                            message: h('div', [
                              '1. 打开',
                              h('el-tag', { props: { type: 'danger' }}, [
                                h(
                                  'a',
                                  {
                                    props: {
                                      href: 'https://39.106.196.77:17443/',
                                      target: '_blank'
                                    }
                                  },
                                  '安全链接1'
                                )
                              ]),
                              h('el-tag', { props: { type: 'danger' }}, [
                                h(
                                  'a',
                                  {
                                    props: {
                                      href: 'https://kf.xierxinxi.cn/',
                                      target: '_blank'
                                    }
                                  },
                                  '安全链接2'
                                )
                              ]),
                              '并选择通过安全验证',
                              h('br'),
                              '2. 刷新页面'
                            ])
                          })
                          return
                        }
                        _this.$message('请稍候...')
                        _this.$store
                          .dispatch('callPhone', obj.row.UserPhone)
                          .then(result => {
                            if (result) {
                              _this.rowIndex = obj.index
                            } else {
                              _this.$message.warning('正在通话中')
                            }
                            console.log(result)
                          })
                          .catch(err => {
                            console.log(err)
                          })
                      }
                    }
                  },
                  [
                    h('svg-icon', {
                      props: { 'icon-class': 'phone' },
                      style: { fontSize: '14px', marginRight: '8px' }
                    })
                  ]
                )
                : h(
                  'el-button',
                  {
                    props: { type: 'text' },
                    on: {
                      click: () => {
                        _this.$message('请稍候...')
                        _this.$store.dispatch('callHangUp')
                      }
                    }
                  },
                  [
                    h('svg-icon', {
                      props: { 'icon-class': 'hangup' },
                      style: {
                        fontSize: '14px',
                        marginRight: '8px',
                        color: 'red'
                      }
                    })
                  ]
                ),
              h(
                'el-dropdown',
                {
                  props: {},
                  on: {
                    command: _this.handleCommand
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
                          command: {
                            key: 'register',
                            ResumeId: [obj.row.ResumeId],
                            DealId: obj.row.DealId
                          }
                        }
                      },
                      '报到成功'
                    ),
                    h(
                      'el-dropdown-item',
                      {
                        props: {
                          command: {
                            key: 'mark',
                            ResumeId: [obj.row.ResumeId],
                            DealId: obj.row.DealId
                          }
                        }
                      },
                      '标记状态'
                    ),
                    h(
                      'el-dropdown-item',
                      {
                        props: {
                          command: {
                            key: 'link',
                            ResumeId: obj.row.ResumeId,
                            DealId: obj.row.DealId
                          }
                        }
                      },
                      '添加联系记录'
                    )
                  ])
                ]
              )
            ])
          }
        }
      ],
      tableData: [],
      tableHeight: 0,
      pageSize: 30,
      pageIndex: 1,
      tableCount: 0,
      tableLoading: false,
      sourceOptions: [],
      searchForm: {
        DepartId: [],
        PostId: [],
        status: []
      },
      jobOptions: [],
      departOptions: [],
      statusOptions: [],
      plans: [],
      dicts: [
        { id: '81e7b9b2-b9a5-4211-8470-a64d76cfec78', obj: 'sourceOptions' },
        { id: '0de34b2c-8e58-11e8-86f8-44a84203f5fd', obj: 'statusOptions' }
      ],
      selected: [],
      viewModal: false,
      saveing: false,
      viewForm: {
        status: ['11915700-8bd5-11e8-86f8-44a84203f5fd'],
        type: 1,
        VisitTime: parseTime(
          new Date(new Date().setDate(new Date().getDate() + 1)),
          '{yyyy}-{mm}-{dd} {hh}:{ii}:{ss}'
        ),
        NextTime: parseTime(
          new Date(new Date().setDate(new Date().getDate() + 1)),
          '{yyyy}-{mm}-{dd} {hh}:{ii}:{ss}'
        )
      },
      status: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        },
        shortcuts: [
          {
            text: '9点',
            onClick(picker) {
              picker.$emit(
                'pick',
                new Date(
                  picker.year +
                    '-' +
                    (picker.month + 1) +
                    '-' +
                    picker.monthDate +
                    ' 09:00:00'
                )
              )
            }
          },
          {
            text: '10点',
            onClick(picker) {
              picker.$emit(
                'pick',
                new Date(
                  picker.year +
                    '-' +
                    (picker.month + 1) +
                    '-' +
                    picker.monthDate +
                    ' 10:00:00'
                )
              )
            }
          },
          {
            text: '11点',
            onClick(picker) {
              picker.$emit(
                'pick',
                new Date(
                  picker.year +
                    '-' +
                    (picker.month + 1) +
                    '-' +
                    picker.monthDate +
                    ' 11:00:00'
                )
              )
            }
          },
          {
            text: '14点',
            onClick(picker) {
              picker.$emit(
                'pick',
                new Date(
                  picker.year +
                    '-' +
                    (picker.month + 1) +
                    '-' +
                    picker.monthDate +
                    ' 14:00:00'
                )
              )
            }
          },
          {
            text: '15点',
            onClick(picker) {
              picker.$emit(
                'pick',
                new Date(
                  picker.year +
                    '-' +
                    (picker.month + 1) +
                    '-' +
                    picker.monthDate +
                    ' 15:00:00'
                )
              )
            }
          },
          {
            text: '16点',
            onClick(picker) {
              picker.$emit(
                'pick',
                new Date(
                  picker.year +
                    '-' +
                    (picker.month + 1) +
                    '-' +
                    picker.monthDate +
                    ' 16:00:00'
                )
              )
            }
          }
        ]
      },
      linkForm: {},
      linkModal: false,
      rowIndex: null
    }
  },
  methods: {
    sizeChange(value) {
      this.pageSize = value
      this.getData()
    },
    pageChange() {
      this.getData()
    },
    getData() {
      this.tableLoading = true
      const params = {}
      if (this.searchForm['DepartId'].length) {
        params['depart'] = this.searchForm['DepartId'][
          this.searchForm['DepartId'].length - 1
        ]
      } else {
        params['depart'] = null
      }
      if (this.searchForm['PostId'].length) {
        params['post'] = this.searchForm['PostId'][
          this.searchForm['PostId'].length - 1
        ]
      } else {
        params['post'] = null
      }
      params['limit'] = this.pageSize
      params['index'] = this.pageIndex
      params['number'] = this.searchForm['number']
      params['ResumeType'] = 4
      let l = this.searchForm['DepartId'].length
      params['depart'] = l ? this.searchForm['DepartId'][l - 1] : null
      l = this.searchForm['PostId'].length
      params['post'] = l ? this.searchForm['PostId'][l - 1] : null
      params['source'] = this.searchForm['SourceId']
      l = this.searchForm['status'].length
      if (l) {
        params['MainStatus'] = this.searchForm['status'][0]
        if (l > 1) {
          params['SubStatus'] = this.searchForm['status'][1]
        }
      }
      getRegisterList(params)
        .then(res => {
          this.tableData = res.data.table
          this.tableCount = res.data.count
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    buttonCommand(obj) {
      switch (obj.key) {
        case 'register':
          this.openViewModel(this.selected)
          break
        case 'mark':
          this.openViewModel(this.selected, 1)
          break
        default:
          this.$message({
            message: '未执行任何操作',
            type: 'warning'
          })
      }
    },
    handleCommand(val) {
      switch (val.key) {
        case 'register':
          this.openViewModel([val.ResumeId])
          break
        case 'mark':
          this.openViewModel([val.ResumeId], 1)
          break
        case 'link':
          this.openLinkModal(val.ResumeId, val.DealId)
          break
        default:
          this.$message({ type: 'warning', message: '未执行任何操作' })
      }
    },
    onSelect(val) {
      this.selected = val.map(item => item.ResumeId)
    },
    handleSelect() {
      this.getData()
    },
    querySearchAsync(query, cb) {
      if (query) {
        getNumberList(query)
          .then(res => {
            cb(res.data)
          })
          .catch(() => {
            cb([])
          })
      } else {
        cb([])
      }
    },
    openLinkModal(ResumeId, DealId) {
      const now = new Date()
      this.linkModal = true
      this.linkForm['ResumeId'] = ResumeId
      this.linkForm['DealId'] = DealId
      this.linkForm['DailTime'] = parseTime(
        now,
        '{yyyy}-{mm}-{dd} {hh}:{ii}:{ss}'
      )
      this.linkForm['VisitTime'] = parseTime(
        new Date(now.setDate(now.getDate() + 1)),
        '{yyyy}-{mm}-{dd} {hh}:{ii}:{ss}'
      )
    },
    openViewModel(id, type) {
      if (!id.length) {
        this.$message('请选择要操作的项')
        return
      }
      this.viewModal = true
      if (!type) {
        this.viewForm.status = ['7833ba94-8f0a-11e8-86f8-44a84203f5fd']
      } else if (type === 1) {
        this.viewForm.status = ['9cd9354d-8f0a-11e8-86f8-44a84203f5fd']
      }
      this.viewForm['ResumeId'] = id
    },
    register() {
      this.saveing = true
      this.$refs.viewForm
        .validate()
        .then(() => {
          const data = this.viewForm
          data['MainStatus'] = data['status'][0]
          if (data['status'].length > 1) {
            data['SubStatus'] = data['status'][1]
          }
          saveRegister(data)
            .then(res => {
              if (
                data['status'][0] === '7833ba94-8f0a-11e8-86f8-44a84203f5fd' &&
                data['type'] === 1
              ) {
                agentAdd(
                  res.data.userid,
                  res.data.phone,
                  this.$store.state.user.callcom
                )
                  .then(() => {})
                  .catch(() => {
                    this.$message.error('报到成功，但电话分机创建失败')
                  })
              }
              this.saveing = false
              this.viewModal = false
              this.getData()
            })
            .catch(() => {
              this.saveing = false
            })
        })
        .catch(() => {
          this.saveing = false
        })
    },
    savelink() {
      this.$refs.linkForm
        .validate()
        .then(() => {
          saveDealLink(this.linkForm).then(res => {
            this.linkModal = false
            this.$refs.linkForm.resetFields()
            this.getData()
          })
        })
        .catch()
    }
  },
  created() {
    getDepartTree()
      .then(res => {
        this.departOptions = res.data
      })
      .catch(() => {
        this.departOptions = []
      })
    getDutiesTree()
      .then(res => {
        this.jobOptions = res.data
      })
      .catch(() => {
        this.jobOptions = []
      })
    this.dicts.map(item => {
      getDataDict(item.id).then(res => {
        this[item.obj] = res.data
      })
    })
    this.getData()
    getDataDictTree('6d45936f-8f0a-11e8-86f8-44a84203f5fd').then(res => {
      this.status = res.data
    })
  },
  mounted() {
    this.tableHeight = window.innerHeight - 284
    window.onresize = () => {
      this.tableHeight = window.innerHeight - 284
    }
  },
  watch: {
    '$store.state.call.callcode': function(newval, oldval) {
      if (newval && this.rowIndex !== null) {
        const row = this.tableData[this.rowIndex]
        addDial({ CallId: newval, DealId: row.DealId, ResumeId: row.ResumeId })
      } else {
        this.rowIndex = null
      }
    }
  }
}
</script>
<style  lang="scss">
.ivu-modal-content {
  height: 100%;
  .ivu-modal-body {
    height: calc(100% - 108px);
    overflow-y: auto;
  }
}
.el-upload--text {
  width: 100%;
  .el-upload-dragger {
    width: 100%;
  }
}
</style>

