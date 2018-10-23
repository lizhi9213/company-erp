<template>
  <div class="app-container">
    <TopOperating>
      <div slot="commonly">
        <el-checkbox border label="myself" v-model="searchForm.myself" :true-label="1" :false-label="''" @change="getData">我负责的</el-checkbox>
        <el-button type="primary" icon="el-icon-search" @click="getData">检索</el-button>
      </div>
      <div slot="button">
        <el-button type="primary" class="fr" @click="getNewNumber();planModel=true">创建计划</el-button>
      </div>
      <div slot="filterlist">
        <el-form ref="search" :model="searchForm" inline @submit.native.prevent>
          <el-form-item label="批次" prop="number">
            <el-autocomplete v-model="searchForm.number" :fetch-suggestions="querySearchAsync" placeholder="请输入批次" @keyup.enter.native="handleSelect" @select="handleSelect" value-key="PlanNo"></el-autocomplete>
          </el-form-item>
          <el-form-item label="部门" prop="DepartId">
            <el-cascader :options="departOptions" v-model="searchForm.DepartId" placeholder="请选择部门" change-on-select clearable></el-cascader>
          </el-form-item>
          <el-form-item label="职务" prop="PostId">
            <el-cascader :options="jobOptions" v-model="searchForm.PostId" placeholder="请选择职务" change-on-select clearable></el-cascader>
          </el-form-item>
        </el-form>
      </div>
    </TopOperating>
    <iviewTable stripe :columns="columns" :data="tableData" :loading="tableLoading" :height="tableHeight"></iviewTable>
    <el-pagination style="margin-top:15px;" :page-sizes="[30, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableCount" :current-page.sync="pageIndex" @size-change="sizeChange" @current-change="pageChange">
    </el-pagination>
    <Modal :styles="{top:0,'margin-right':0,height:'100%'}" v-model="planModel" :width="600" :transition-names="['move-right','fade']" @on-visible-change="modalClose">
      <div slot="header">创建 / 修改计划</div>
      <el-form ref="plan" :model="planForm" :rules="planRules" label-width="90px">
        <el-form-item label="制定人">
          {{ planForm.createName || $store.state.user.name }}
        </el-form-item>
        <el-form-item label="计划编号">
          {{ planForm.PlanNo }}
        </el-form-item>
        <el-form-item label="计划名称" prop="PlanName">
          <el-input v-model="planForm.PlanName" placeholder="请输入计划名称"></el-input>
        </el-form-item>
        <el-form-item label="计划时间" prop="PlanDate">
          <el-date-picker v-model="planForm.PlanDate" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" style="width:100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="部门" prop="DepartId">
          <el-cascader :options="departOptions" v-model="planForm.DepartId" placeholder="请选择部门" change-on-select style="width:100%"></el-cascader>
        </el-form-item>
        <el-form-item label="计划人数" prop="PlanNum" placeholder="请输入计划人数">
          <el-input v-model="planForm.PlanNum" type="number"></el-input>
        </el-form-item>
        <el-form-item label="招聘职务" prop="PostId">
          <el-cascader :options="jobOptions" v-model="planForm.PostId" placeholder="请选择职务" change-on-select style="width:100%"></el-cascader>
        </el-form-item>
        <el-form-item label="渠道来源" prop="SourceId">
          <el-select v-model="planForm.SourceId" style="width:100%">
            <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任人" prop="UserId">
          <Treeselect v-model="planForm.UserId" @input="$refs.plan.validateField('UserId')" @close="$refs.plan.validateField('UserId')" :multiple="true" :options="userOptions" :disableBranchNodes="true" :default-expand-level="1" placeholder="请选择"></Treeselect>
        </el-form-item>
        <el-form-item label="备注" prop="Memo">
          <el-input type="textarea" v-model="planForm.Memo" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="">
          <el-upload
ref="upload"
action="/apiweb/api/upload/anyfile"
show-file-list
:headers="{'X-Token':$store.state.user.token}"
drag
multiple
:auto-upload="false"
:data="upData"
:on-success="upSuccess"
:on-error="upError"
:before-upload="setUploadData"
:file-list="fileList"
:on-preview="handlePreview"
:before-remove="handleRemove"
:on-change="fileChange">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="planModel=false">取消</el-button>
        <el-button type="primary" @click="savePlan" :loading="saveing">确定</el-button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getNumberList,
  getPlanList,
  getNewNumber,
  savePlan,
  getPlan,
  updatePlan,
  deletePlan
} from '@/api/recruiting/plan'
import {
  getDepartTree,
  getDutiesTree,
  getUserTreeByDepart
} from '@/api/comm/treeselect'
import { validatePInt } from '@/utils/validate'
import { download, getTreeArray } from '@/utils'
import { getFilesByAttachId, downloadFileById } from '@/api/files'
import { getDataDict } from '@/api/comm/select'
import TopOperating from '@/views/components/TopOperating'
export default {
  name: 'planRecruiting',
  components: { TopOperating },
  data() {
    const checkPlanNum = (rule, value, cb) => {
      if (validatePInt(value)) {
        cb()
      } else {
        cb(new Error('必须是正整数'))
      }
    }
    const _this = this
    return {
      tableLoading: false,
      searchForm: { number: '', myself: '', DepartId: [], PostId: [] },
      columns: [
        {
          title: '编号',
          key: 'PlanNo',
          fixed: 'left',
          minWidth: 140,
          render: (h, params) => {
            return h(
              'el-button',
              {
                props: { type: 'text' },
                on: {
                  click: function() {
                    _this.handleCommand({ key: 'edit', id: params.row.Id })
                  }
                }
              },
              params.row.PlanNo
            )
          }
        },
        {
          title: '计划名称',
          key: 'PlanName',
          minWidth: 180
        },
        {
          title: '执行时间',
          key: 'Date',
          minWidth: 180
        },
        {
          title: '计划人数',
          key: 'PlanNum',
          minWidth: 85
        },
        {
          title: '渠道来源',
          key: 'SourceName',
          minWidth: 95
        },
        {
          title: '部门',
          key: 'DepartName',
          minWidth: 100
        },
        {
          title: '招聘职务',
          key: 'PostName',
          minWidth: 100
        },
        {
          title: '负责人',
          key: 'UserName',
          minWidth: 140
        },
        {
          title: '进度',
          key: 'rate',
          minWidth: 140,
          render: function(h, obj) {
            return h(
              'el-tooltip',
              {
                props: {
                  content: obj.row.rate + '%',
                  placement: 'top'
                }
              },
              [
                h('el-progress', {
                  props: {
                    percentage: obj.row.rate,
                    'stroke-width': 8,
                    'show-text': false
                  }
                })
              ]
            )
          }
        },
        {
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
                    { props: { command: { key: 'edit', id: obj.row.Id }}},
                    '修改计划'
                  ),
                  h(
                    'el-dropdown-item',
                    { props: { disabled: true }},
                    '停止计划'
                  ),
                  h(
                    'el-dropdown-item',
                    {
                      props: {
                        command: { key: 'delete', id: obj.row.Id },
                        divided: true
                      }
                    },
                    '删除计划'
                  )
                ])
              ]
            )
          }
        }
      ],
      tableData: [],
      planModel: false,
      tableHeight: 0,
      planForm: {
        createName: '',
        PlanNo: '',
        UserId: [],
        PostId: null,
        DepartId: null,
        Memo: '',
        dFiles: []
      },
      departOptions: [],
      jobOptions: [],
      userOptions: [],
      sourceOptions: [],
      planRules: {
        PlanName: [
          { required: true, message: '请输入计划名称' },
          { min: 2, max: 20, message: '名称过长或过短' }
        ],
        PlanNum: [
          { required: true, message: '请输入计划人数' },
          { validator: checkPlanNum, trigger: 'blur' }
        ],
        PlanDate: [{ required: true, message: '请输入计划时间' }],
        DepartId: [{ required: true, message: '请选择部门' }],
        PostId: [{ required: true, message: '请选择' }],
        SourceId: [{ required: true, message: '请选择' }],
        UserId: [{ required: true, message: '请选择' }]
      },
      saveing: false,
      pageSize: 30,
      pageIndex: 1,
      tableCount: 0,
      upData: {},
      fileNum: 0,
      AttachId: null,
      fileList: [],
      submitFile: 0
    }
  },
  methods: {
    /**
     * 编号自动补全
     */
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
    /**
     * 选择补全触发获取列表
     */
    handleSelect() {
      this.getData()
    },
    /**
     * 获取列表
     */
    getData() {
      this.tableLoading = true
      const params = this.searchForm
      params['limit'] = this.pageSize
      params['index'] = this.pageIndex
      if (this.searchForm['DepartId'].length) {
        params['depart'] = this.searchForm['DepartId'][
          this.searchForm['DepartId'].length - 1
        ]
      } else {
        params['depart'] = ''
      }
      if (this.searchForm['PostId'].length) {
        params['post'] = this.searchForm['PostId'][
          this.searchForm['PostId'].length - 1
        ]
      } else {
        params['post'] = ''
      }
      console.log(params)
      getPlanList(params)
        .then(res => {
          this.tableData = res.data.table
          this.tableCount = res.data.count
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    /**
     * 获取一个新的编号
     */
    getNewNumber() {
      getNewNumber()
        .then(res => {
          this.planForm.PlanNo = res.data.PlanNo
        })
        .catch(() => {
          this.planForm.PlanNo = ''
        })
    },
    /**
     * 保存计划
     */
    savePlan(type) {
      this.saveing = true
      this.$refs.plan
        .validate()
        .then(() => {
          if (!this.planForm.createName) {
            savePlan(this.planForm)
              .then(res => {
                this.getData()
                this.AttachId = res.data.AttachId
                if (this.submitFile > 0) {
                  this.$refs.upload.submit()
                } else {
                  this.planModel = false
                  this.saveing = false
                  this.fileNum = 0
                  this.$refs.upload.clearFiles()
                }
              })
              .catch(() => {
                this.saveing = false
              })
          } else {
            updatePlan(this.planForm, this.planForm.Id)
              .then(res => {
                this.getData()
                this.planModel = false
                this.saveing = false
              })
              .catch(() => {
                this.saveing = false
              })
            this.$refs.upload.submit()
          }
        })
        .catch(() => {
          this.saveing = false
        })
    },
    sizeChange(value) {
      this.pageSize = value
      this.getData()
    },
    pageChange() {
      this.getData()
    },
    handleCommand(obj) {
      switch (obj.key) {
        case 'edit':
          this.editPlan(obj.id)
          return
        case 'delete':
          this.deletePlan(obj.id)
          return
        default:
          this.$message.warning('未执行任何操作')
          return
      }
    },
    editPlan(id) {
      this.planModel = true
      getPlan(id)
        .then(res => {
          res.data.PlanDate = [res.data.BeginDate, res.data.EndDate]
          res.data.UserId = res.data.UserId.split(',')
          res.data.DepartId = getTreeArray(
            this.departOptions,
            res.data.DepartId
          )
          res.data.PostId = getTreeArray(this.jobOptions, res.data.PostId)
          this.planForm = res.data
          this.AttachId = res.data.AttachId
          this.planForm.dFiles = []
          getFilesByAttachId(res.data.AttachId).then(res => {
            res.data.map(item => {
              this.fileList.push({
                name: item.FileName,
                url: '/apiweb/api/download' + item.FileAddr,
                id: item.Id
              })
            })
          })
        })
        .catch(err => {
          console.log(err)
          this.planModel = false
        })
    },
    deletePlan(id) {
      this.$confirm('删除后无法恢复，确认删除该计划？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deletePlan(id)
            .then(() => {
              this.getData()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    upSuccess(response, file, fileList) {
      this.fileNum++
      if (this.fileNum >= fileList.length) {
        this.planModel = false
        this.saveing = false
        this.fileNum = 0
        this.$refs.upload.clearFiles()
      }
    },
    upError(err, file, fileList) {
      this.fileNum++
      if (this.fileNum >= fileList.length) {
        this.planModel = false
        this.saveing = false
        this.fileNum = 0
        this.$refs.upload.clearFiles()
        this.$message({
          type: 'warning',
          message: '计划创建成功，但有附件上传失败'
        })
      }
      console.log(err)
    },
    setUploadData(file) {
      return new Promise(resolve => {
        this.upData = {
          AttachId: this.AttachId,
          folder: 'plan'
        }
        this.$nextTick(() => {
          resolve(file)
        })
      })
    },
    handleRemove(file, fileList) {
      if (file.id) {
        console.log(this.planForm)
        this.planForm.dFiles.push(file.id)
        // return removeFileById(file.id)
      } else {
        this.submitFile--
      }
    },
    handlePreview(file) {
      if (file.id) {
        this.$message({ type: 'info', message: '开始下载...' })
        // window.open('/apiweb/api/upload/download/' + file.id)
        downloadFileById(file.id).then(data => {
          download(data, file.name)
        })
      }
    },
    fileChange(file, list) {
      this.submitFile += list.length
    },
    modalClose(status) {
      if (!status) {
        this.$refs.plan.resetFields()
        this.fileList = []
        this.planForm = {
          createName: '',
          PlanNo: '',
          UserId: [],
          PostId: [],
          DepartId: [],
          Memo: '',
          dFiles: []
        }
        this.submitFile = 0
      }
    }
  },
  created() {
    this.getData()
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
    getUserTreeByDepart()
      .then(res => {
        this.userOptions = res.data
      })
      .catch(() => {
        this.userOptions = []
      })
    getDataDict('81e7b9b2-b9a5-4211-8470-a64d76cfec78').then(res => {
      this.sourceOptions = res.data
    })
  },
  mounted() {
    this.tableHeight = window.innerHeight - 220
    window.onresize = () => {
      this.tableHeight = window.innerHeight - 220
    }
    setTimeout(() => {
      this.$refs.plan.clearValidate()
    }, 1000)
  }
}
</script>

<style lang="scss">
.ivu-modal-content {
  height: 100%;
  .ivu-modal-body {
    height: calc(100% - 100px);
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

