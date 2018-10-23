
<template>
  <div>
    <TopOperating>
      <div slot="commonly">
        <el-cascader :options="departOptions" v-model="searchForm.DepartId" placeholder="以部门筛选" change-on-select clearable></el-cascader>
        <el-button type="primary" icon="el-icon-search" @click="getData">检索</el-button>
      </div>
      <div slot="button">
        <el-dropdown split-button type="primary" @click="quickStorage" @command="buttonCommand">
          <i class="el-icon-plus"> 快速入库</i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{key:'storage'}">入库</el-dropdown-item>
            <el-dropdown-item :command="{key:'import'}">导入</el-dropdown-item>
            <el-dropdown-item :command="{key:'export'}">导出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button plain type="danger" @click="deleteResumes">批量删除</el-button>
      </div>
      <div slot="filterlist">
        <el-form :model="searchForm" inline>
          <el-form-item label="渠道" prop="SourceId">
            <el-select v-model="searchForm.SourceId" placeholder="请选择" clearable @change="getData">
              <el-option v-for="item in sourceOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="招聘职务" prop="PostId">
            <el-cascader :options="jobOptions" v-model="searchForm.PostId" placeholder="请选择职务" change-on-select clearable expand-trigger="hover"></el-cascader>
          </el-form-item>
          <el-form-item label="计划批次" prop="number">
            <el-autocomplete v-model="searchForm.number" :fetch-suggestions="querySearchAsync" placeholder="请输入计划批次" @keyup.enter.native="handleSelect" @select="handleSelect" value-key="PlanNo"></el-autocomplete>
          </el-form-item>
          <el-form-item label="入库时间" prop="storageDate">
            <el-date-picker v-model="searchForm.storageDate" placeholder="请选择入库时间" value-format="yyyy-MM-dd" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="学历" prop="Education">
            <el-select v-model="searchForm.Education" placeholder="请选择" clearable @change="getData">
              <el-option v-for="item in educationOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别" prop="UserSex">
            <el-radio-group v-model="searchForm.UserSex">
              <el-radio label="1" border>男</el-radio>
              <el-radio label="2" border>女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关键字" prop="KeyWord">
            <el-input v-model="searchForm.KeyWord" placeholder="请输入关键字"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </TopOperating>
    <iviewTable stripe :columns="columns" :data="tableData" :loading="tableLoading" :height="tableHeight" @on-selection-change="onSelect"></iviewTable>
    <el-pagination style="margin-top:15px;" :page-sizes="[30, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableCount" :current-page="pageIndex" @size-change="sizeChange" @current-change="pageChange">
    </el-pagination>
    <Modal :styles="{top:0,'margin-right':0,height:'100%'}" v-model="formModal" :width="600" :transition-names="['move-right','fade']" @on-visible-change="modalClose">
      <p slot="header">{{ isDetail ? '入库' : '快速入库' }}</p>
      <el-form :model="storageForm" ref="storageForm" label-width="90px" :rules="storageRules">
        <el-form-item label="招聘计划" prop="PlanId">
          <el-select v-model="storageForm.PlanId" placeholder="请选择招聘计划" style="width:100%" filterable @change="getPlanPost" :disabled="!!storageForm.Id">
            <el-option v-for="item in plans" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标职务" prop="">
          <el-input v-model="storageForm.Post" placeholder="请选择招聘计划" disabled></el-input>
        </el-form-item>
        <el-form-item label="渠道来源" prop="SourceId">
          <el-select v-model="storageForm.SourceId" placeholder="请选择渠道来源" @change="changeSource" style="width:100%">
            <el-option v-for="item in sourceOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐人姓名" prop="RecomName" v-show="storageForm.SourceId === 'a0e3f997-3ede-4cb1-8620-c137ed0104cf'">
          <el-input v-model="storageForm.RecomName" placeholder="请输入推荐人姓名"></el-input>
        </el-form-item>
        <el-form-item label="推荐人手机" prop="RecomPhone" v-show="storageForm.SourceId === 'a0e3f997-3ede-4cb1-8620-c137ed0104cf'">
          <el-input v-model="storageForm.RecomPhone" placeholder="请输入推荐人手机"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="UserName">
          <el-input v-model="storageForm.UserName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="UserPhone">
          <el-input v-model="storageForm.UserPhone" placeholder="请输入手机"></el-input>
        </el-form-item>
        <div v-show="isDetail">
          <el-form-item label="邮箱" prop="UserEmail">
            <el-input v-model="storageForm.UserEmail" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="UserSex">
            <el-radio-group v-model="storageForm.UserSex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日" prop="BirthDate">
            <el-date-picker v-model="storageForm.BirthDate" placeholder="请选择生日" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="婚姻状况" prop="MaritalStatus">
            <el-select v-model="storageForm.MaritalStatus" placeholder="请选择婚姻状况" style="width:100%">
              <el-option v-for="item in maritalOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件类型" prop="CertType">
            <el-select v-model="storageForm.CertType" placeholder="请选择证件类型" style="width:100%">
              <el-option v-for="item in certOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码" prop="CertNo">
            <el-input v-model="storageForm.CertNo" placeholder="请输入证件号码"></el-input>
          </el-form-item>
          <el-form-item label="政治面貌" prop="OutLook">
            <el-select v-model="storageForm.OutLook" placeholder="请选择政治面貌" style="width:100%">
              <el-option v-for="item in outlookOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="民族" prop="Nation">
            <el-select v-model="storageForm.Nation" placeholder="请选择民族" style="width:100%">
              <el-option v-for="item in nationOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工作年限" prop="WorkYear">
            <el-input v-model="storageForm.WorkYear" placeholder="请输入工作年限"></el-input>
          </el-form-item>
          <el-form-item label="职业技能" prop="JobSkill">
            <el-input v-model="storageForm.JobSkill" placeholder="请输入职业技能"></el-input>
          </el-form-item>
          <el-form-item label="户籍地" prop="Host">
            <el-cascader :options="areaOptions" v-model="storageForm.Host" style="width:100%" @active-item-change="handleItemChange(2,$event)"></el-cascader>
          </el-form-item>
          <el-form-item label="现居住地" prop="Live">
            <el-cascader :options="areaOptions2" v-model="storageForm.Live" style="width:100%" @active-item-change="handleItemChange(3,$event)"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="LiveAddr">
            <el-input v-model="storageForm.LiveAddr" placeholder="请输入街道/小区门牌号"></el-input>
          </el-form-item>
          <el-form-item label="最高学历" prop="Education">
            <el-select v-model="storageForm.Education" placeholder="请选择最高学历" style="width:100%">
              <el-option v-for="item in educationOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="毕业院校" prop="School">
            <el-input v-model="storageForm.School" placeholder="请输入毕业院校"></el-input>
          </el-form-item>
          <el-form-item label="专业" prop="Major">
            <el-input v-model="storageForm.Major" placeholder="请输入专业"></el-input>
          </el-form-item>
          <el-form-item label="毕业时间" prop="GradDate">
            <el-date-picker v-model="storageForm.GradDate" placeholder="请选择毕业时间" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="专业技能" prop="JobMemo">
            <el-input v-model="storageForm.JobMemo" type="textarea" placeholder="请填写掌握的专业技能"></el-input>
          </el-form-item>
          <el-form-item label="工作经验" prop="WorkMemo">
            <el-input v-model="storageForm.WorkMemo" type="textarea" placeholder="请填写工作经验"></el-input>
          </el-form-item>
          <el-form-item label="项目经验" prop="ItemMemo">
            <el-input v-model="storageForm.ItemMemo" type="textarea" placeholder="请填写项目经验"></el-input>
          </el-form-item>
          <el-form-item label="简历说明" prop="ResumeMemo">
            <el-input v-model="storageForm.ResumeMemo" type="textarea" placeholder="请填写简历说明"></el-input>
          </el-form-item>
          <el-form-item label="附件" prop="">
            <el-upload
ref="upload"
action="/apiweb/api/upload/anyfile"
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
        </div>
      </el-form>
      <div slot="footer">
        <el-button @click="formModal=false">取消</el-button>
        <el-button type="primary" :loading="saveing" @click="storage">确定</el-button>
      </div>
    </Modal>
    <el-dialog title="导入" :visible.sync="importDialog" :close-on-click-modal="false" @close="excelClose">
      <el-form :model="storageForm" ref="importForm" label-width="90px" :rules="storageRules">
        <el-form-item label="招聘计划" prop="PlanId">
          <el-select v-model="storageForm.PlanId" placeholder="请选择招聘计划" style="width:100%" filterable @change="getPlanPost" :disabled="!!storageForm.Id">
            <el-option v-for="item in plans" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标职务" prop="">
          <el-input v-model="storageForm.Post" placeholder="请选择招聘计划" disabled></el-input>
        </el-form-item>
        <el-form-item label="渠道来源" prop="SourceId">
          <el-select v-model="storageForm.SourceId" placeholder="请选择渠道来源" @change="changeSource" style="width:100%">
            <el-option v-for="item in sourceOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐人姓名" prop="RecomName" v-show="storageForm.SourceId === 'a0e3f997-3ede-4cb1-8620-c137ed0104cf'">
          <el-input v-model="storageForm.RecomName" placeholder="请输入推荐人姓名"></el-input>
        </el-form-item>
        <el-form-item label="推荐人手机" prop="RecomPhone" v-show="storageForm.SourceId === 'a0e3f997-3ede-4cb1-8620-c137ed0104cf'">
          <el-input v-model="storageForm.RecomPhone" placeholder="请输入推荐人手机"></el-input>
        </el-form-item>
      </el-form>
      <UploadExcelComponent :on-success="excelSuccess" :before-upload="beforeExcel"></UploadExcelComponent>
      <el-alert type="info" title="请选择文件" v-show="importData.length === 0" style="margin:15px 10px 0px 10px; width:auto"></el-alert>
      <el-alert title="" :closable="false" v-show="importData.length !== 0" style="margin:15px 10px 0px 10px; width:auto">
        已读取{{importData.length}}条数据，如下（前10行）：
      </el-alert>
      <el-table :data="importTable">
        <el-table-column v-for="item in importHeader" :label="item" :prop="item" :key="item" show-overflow-tooltip></el-table-column>
      </el-table>
      <span slot="footer">
        <el-button type="primary" :disabled="!importData.length" @click="importRe" :loading="saveing">确定导入</el-button>
        <el-button type="" @click="importDialog = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
import TopOperating from '@/views/components/TopOperating'
import PanelMain from '@/views/components/TopOperating/PanelMain'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import _ from 'lodash'
import { getDepartTree, getDutiesTree } from '@/api/comm/treeselect'
import { downloadFileById, getFilesByAttachId } from '@/api/files'
import { download } from '@/utils'
import { getDataDict, getPlanList, getProvCombox } from '@/api/comm/select'
import { getPlanByUid, getNumberList } from '@/api/recruiting/plan'
import { validatePhone } from '@/utils/validate'
import {
  storage,
  getResumeList,
  getResume,
  updateResume,
  deleteResume,
  deleteResumes,
  importRe
} from '@/api/recruiting/storage'
export default {
  name: 'ResumeHub',
  components: {
    TopOperating,
    PanelMain,
    UploadExcelComponent
  },
  data() {
    const _this = this
    return {
      checked: 0,
      columns: [
        // {
        //   title: '编号',
        //   key: 'PlanNo',
        //   fixed: 'left',
        //   minWidth: 140
        // },
        {
          title: 'selected',
          type: 'selection',
          width: 52,
          fixed: 'left',
          align: 'center'
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
          minWidth: 80,
          render: function(h, params) {
            return h(
              'el-button',
              {
                props: { type: 'text' },
                on: {
                  click: function() {
                    _this.resumeEdit(params.row.Id)
                  }
                }
              },
              params.row.UserName
            )
          }
        },
        {
          title: '性别',
          key: 'UserSex',
          minWidth: 60
        },
        {
          title: '状态',
          key: 'ResumeType',
          minWidth: 85
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
          title: '邮箱',
          key: 'UserEmail',
          minWidth: 140
        },
        {
          title: '入库时间',
          key: 'CreateTime',
          minWidth: 140
        },
        {
          title: '创建人',
          key: 'CreateName',
          minWidth: 140
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
                    {
                      props: {
                        command: { key: 'edit', id: obj.row.Id }
                      }
                    },
                    '修改'
                  ),
                  h(
                    'el-dropdown-item',
                    {
                      props: {
                        command: { key: 'delete', id: obj.row.Id },
                        divided: true
                      }
                    },
                    '删除'
                  )
                ])
              ]
            )
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
        PostId: []
      },
      jobOptions: [],
      departOptions: [],
      formModal: false,
      storageForm: {
        UserSex: 1,
        PutType: 1,
        SourceId: '',
        MaritalStatus: '',
        CertType: '',
        OutLook: '',
        dFiles: []
      },
      isDetail: false,
      saveing: false,
      plans: [],
      maritalOptions: [],
      nationOptions: [],
      educationOptions: [],
      certOptions: [],
      outlookOptions: [],
      dicts: [
        { id: '81e7b9b2-b9a5-4211-8470-a64d76cfec78', obj: 'sourceOptions' },
        { id: '8a0a1391-8666-11e8-86f8-44a84203f5fd', obj: 'maritalOptions' },
        { id: '4a39fa16-8667-11e8-86f8-44a84203f5fd', obj: 'nationOptions' },
        { id: '491b4781-20a1-47f2-a9d5-f949b7250204', obj: 'educationOptions' },
        { id: 'f7309ef4-d8a0-4225-ac0c-758357e7d26f', obj: 'certOptions' },
        { id: 'c3b9af7f-14ce-42aa-80e3-396c627dd35e', obj: 'outlookOptions' }
      ],
      storageRules: {
        PlanId: [{ required: true, message: '请选择归属的招聘计划' }],
        SourceId: [{ required: true, message: '请选择渠道来源' }],
        UserName: [{ required: true, message: '请输入姓名' }],
        UserPhone: [
          { required: true, message: '请输入手机号' },
          {
            validator: (rule, value, callback) => {
              if (validatePhone(value)) {
                return callback()
              } else {
                return callback(new Error('手机号格式不正确'))
              }
            },
            trigger: 'blur'
          }
        ],
        UserEmail: [{ type: 'email', message: '请输入正确的邮箱地址' }]
      },
      upData: {},
      OtherAttach: null,
      fileList: [],
      submitFile: 0,
      areaOptions: [],
      areaOptions2: [],
      selected: [],
      importDialog: false,
      importData: [],
      importHeader: [],
      importTable: []
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
    sizeChange(value) {
      this.pageSize = value
      this.getData()
    },
    pageChange(value) {
      this.pageIndex = value
      this.getData()
    },
    getData() {
      this.tableLoading = true
      const params = this.searchForm
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
      getResumeList(params)
        .then(res => {
          this.tableData = res.data.table
          this.tableCount = res.data.count
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    quickStorage() {
      this.isDetail = false
      this.formModal = true
    },
    buttonCommand(obj) {
      switch (obj.key) {
        case 'storage':
          this.isDetail = true
          this.formModal = true
          this.storageForm.PutType = 2
          break
        case 'import':
          this.importDialog = true
          break
        case 'export':
          {
            this.tableLoading = true
            const params = this.searchForm
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
            params['limit'] = 10000
            params['index'] = 1
            getResumeList(params)
              .then(res => {
                import('@/vendor/Export2Excel').then(excel => {
                  const cols = _.differenceBy(
                    this.columns,
                    [{ title: 'selected' }, { title: '操作' }],
                    'title'
                  )
                  const tHeader = cols.map(item => {
                    return item.title
                  })
                  const filterVal = cols.map(item => {
                    return item.key
                  })
                  const list = res.data.table
                  const data = list.map(v =>
                    filterVal.map(j => {
                      return v[j]
                    })
                  )
                  excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: '简历库',
                    autoWidth: true
                  })
                  this.tableLoading = false
                })
              })
              .catch(() => {
                this.tableLoading = false
                this.$message({
                  message: '数据无效！',
                  type: 'error'
                })
              })
          }
          break
        default:
          this.$message({
            message: '未执行任何操作',
            type: 'warning'
          })
      }
    },
    getPlanPost(value) {
      getPlanByUid(value).then(res => {
        Vue.set(this.storageForm, 'Post', res.data.PostName)
      })
    },
    changeSource(value) {
      if (value !== 4) {
        Vue.set(this.storageForm, 'RecomName', null)
        Vue.set(this.storageForm, 'RecomPhone', null)
      }
    },
    storage(value) {
      this.saveing = true
      this.$refs.storageForm
        .validate()
        .then(() => {
          let data = _.cloneDeep(this.storageForm)
          if (!data.Id) {
            data['other'] = _.omit(data, [
              'PlanId',
              'SourceId',
              'OfficeId',
              'DepartId',
              'PostId',
              'PutType',
              'UserName',
              'UserPhone',
              'Post',
              'Live',
              'Host',
              'dFiles'
            ])
            if (
              this.storageForm['Host'] &&
              this.storageForm['Host'].length > 0
            ) {
              data['other']['Prov'] = this.storageForm['Host'][0]
              data['other']['City'] = this.storageForm['Host'][1]
            }
            if (
              this.storageForm['Live'] &&
              this.storageForm['Live'].length > 0
            ) {
              data['other']['LiveProv'] = this.storageForm['Live'][0]
              data['other']['LiveCity'] = this.storageForm['Live'][1]
              data['other']['LiveArea'] = this.storageForm['Live'][2]
            }
            storage(data)
              .then(res => {
                this.getData()
                this.OtherAttach = res.data.OtherAttach
                if (this.submitFile > 0) {
                  this.$refs.upload.submit()
                } else {
                  this.getData()
                  this.formModal = false
                  this.saveing = false
                  this.$refs.upload.clearFiles()
                }
              })
              .catch(() => {
                this.saveing = false
              })
          } else {
            const id = data.Id
            data = _.omit(data, [
              'Id',
              'ResumeId',
              'PlanId',
              'OfficeId',
              'DepartId',
              'PostId',
              'AttachId',
              'OtherAttach',
              'ResumeStatus',
              'Post',
              'Live',
              'Host'
            ])
            if (
              this.storageForm['Host'] &&
              this.storageForm['Host'].length > 0
            ) {
              data['Prov'] = this.storageForm['Host'][0]
              data['City'] = this.storageForm['Host'][1]
            }
            if (
              this.storageForm['Live'] &&
              this.storageForm['Live'].length > 0
            ) {
              data['LiveProv'] = this.storageForm['Live'][0]
              data['LiveCity'] = this.storageForm['Live'][1]
              data['LiveArea'] = this.storageForm['Live'][2]
            }
            updateResume(id, data)
              .then(res => {
                if (this.submitFile > 0) {
                  this.$refs.upload.submit()
                } else {
                  this.getData()
                  this.formModal = false
                  this.saveing = false
                  this.$refs.upload.clearFiles()
                }
              })
              .catch(() => {
                this.saveing = false
              })
          }
        })
        .catch(() => {
          this.saveing = false
        })
    },
    upSuccess(response, file, fileList) {
      const d = _.differenceBy(fileList, [{ status: 'ready' }], 'status')
      if (d.length === fileList.length) {
        this.getData()
        this.formModal = false
        this.saveing = false
        this.$refs.upload.clearFiles()
      }
    },
    upError(err, file, fileList) {
      const d = _.differenceBy(fileList, [{ status: 'ready' }], 'status')
      if (d.length === fileList.length) {
        this.getData()
        this.formModal = false
        this.saveing = false
        this.$refs.upload.clearFiles()
        this.$message({
          type: 'warning',
          message: '简历创建成功，但有附件上传失败'
        })
      }
      console.log(err)
    },
    setUploadData(file) {
      return new Promise(resolve => {
        this.upData = {
          AttachId: this.OtherAttach,
          folder: 'resume'
        }
        this.$nextTick(() => {
          resolve(file)
        })
      })
    },
    handleRemove(file, fileList) {
      if (file.id) {
        this.storageForm.dFiles.push(file.id)
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
      const d = _.differenceBy(list, [{ status: 'success' }], 'status')
      this.submitFile = d.length
    },
    modalClose(v) {
      if (!v) {
        this.$refs.storageForm.resetFields()
        this.submitFile = 0
        this.isDetail = false
        this.storageForm.PutType = 1
        this.storageForm = {
          UserSex: 1,
          PutType: 1,
          SourceId: '',
          MaritalStatus: '',
          CertType: '',
          OutLook: '',
          dFiles: []
        }
        this.fileList = []
      }
    },
    handleItemChange(level, val) {
      const pid = val[val.length - 1]
      const isend = level === val.length + 1 ? 1 : 0
      if (level === 2) {
        const i1 = _.findIndex(this.areaOptions, function(o) {
          return o.value === val[0]
        })
        if (!this.areaOptions[i1]['children'].length) {
          getProvCombox(pid, isend).then(res => {
            this.areaOptions[i1]['children'] = res.data
          })
        }
      } else {
        const i1 = _.findIndex(this.areaOptions2, function(o) {
          return o.value === val[0]
        })
        if (val.length === 1) {
          if (!this.areaOptions2[i1]['children'].length) {
            getProvCombox(pid, isend).then(res => {
              this.areaOptions2[i1]['children'] = res.data
            })
          }
        } else {
          const i2 = _.findIndex(this.areaOptions2[i1]['children'], function(
            o
          ) {
            return o.value === val[1]
          })
          if (!this.areaOptions2[i1]['children'][i2].length) {
            getProvCombox(pid, isend).then(res => {
              this.areaOptions2[i1]['children'][i2]['children'] = res.data
            })
          }
        }
      }
    },
    handleSelect() {
      this.getData()
    },
    resumeEdit(id) {
      this.isDetail = true
      this.formModal = true
      getResume(id).then(res => {
        this.getPlanPost(res.data.PlanId)
        this.OtherAttach = res.data.OtherAttach
        this.storageForm = res.data
        this.storageForm.dFiles = []
        if (this.storageForm['City'] && this.storageForm['Prov']) {
          this.storageForm['Host'] = [
            Number(this.storageForm['Prov']),
            Number(this.storageForm['City'])
          ]
        }
        if (
          this.storageForm['LiveProv'] &&
          this.storageForm['LiveCity'] &&
          this.storageForm['LiveArea']
        ) {
          this.storageForm['Live'] = [
            Number(this.storageForm['LiveProv']),
            Number(this.storageForm['LiveCity']),
            Number(this.storageForm['LiveArea'])
          ]
        }
        getFilesByAttachId(res.data.OtherAttach).then(res => {
          res.data.map(item => {
            this.fileList.push({
              name: item.FileName,
              url: '/apiweb/api/download' + item.FileAddr,
              id: item.Id
            })
          })
        })
        this.storageForm = res.data
      })
    },
    handleCommand(val) {
      switch (val.key) {
        case 'edit':
          this.resumeEdit(val.id)
          break
        case 'delete':
          this.$confirm('删除后无法恢复，确认删除该简历？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              deleteResume(val.id).then(() => {
                this.getData()
              })
            })
            .catch()
          break
        default:
          this.$message({ type: 'warning', message: '未执行任何操作' })
      }
    },
    onSelect(val) {
      this.selected = val.map(item => item.Id)
    },
    deleteResumes() {
      if (this.selected.length) {
        this.$confirm(
          '删除后不可恢复，确定删除选中的' + this.selected.length + '项？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            deleteResumes(this.selected).then(() => {
              this.getData()
            })
          })
          .catch()
      } else {
        this.$message('未选中数据')
      }
    },
    excelSuccess({ results, header }) {
      this.importData = results
      this.importHeader = header
      this.importTable = _.dropRight(
        results,
        results.length < 10 ? 0 : results.length - 10
      )
    },
    beforeExcel(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: '文件应小于1M，大文件请先拆分',
        type: 'warning'
      })
      return false
    },
    excelClose() {
      this.importTable = []
      this.importData = []
      this.importHeader = []
      this.storageForm = {
        UserSex: 1,
        PutType: 1,
        SourceId: '',
        MaritalStatus: '',
        CertType: '',
        OutLook: '',
        dFiles: []
      }
    },
    importRe() {
      this.saveing = true
      this.$refs.importForm
        .validate()
        .then(() => {
          this.storageForm.PutType = 3
          this.storageForm.data = this.importData
          importRe(this.storageForm)
            .then(res => {
              this.$message({
                message: '成功导入' + res.data.count + '条简历',
                type: 'success'
              })
              this.saveing = false
              this.importDialog = false
              this.getData()
            })
            .catch(() => {
              this.saveing = false
            })
        })
        .catch(() => {
          this.saveing = false
        })
    }
  },
  created() {
    getPlanList(1).then(res => {
      this.plans = res.data
    })
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
    getProvCombox(-1, 0).then(res => {
      this.areaOptions = _.cloneDeep(res.data)
      this.areaOptions2 = _.cloneDeep(res.data)
    })
  },
  mounted() {
    this.tableHeight = window.innerHeight - 284
    window.onresize = () => {
      this.tableHeight = window.innerHeight - 284
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

