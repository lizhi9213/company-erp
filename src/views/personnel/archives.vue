<template>
  <div class="app-container">
    <BuildPage/>
    <!-- <el-row class="archives">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-tabs v-model="activeName">
          <el-tab-pane label="员工档案概况" name="first">
            <div class="choose-department">
              <treeselect :max-height="200" v-model="selValue" placeholder="请选择" :multiple="false" :options="asoptions" />
            </div>
            <el-progress type="circle" :percentage="25" show-text="在职员工存档率" width="200"></el-progress>
          </el-tab-pane>
          <el-tab-pane label="教育经历管理" name="second">
            <TopOperating>

              <div slot="button">
                <el-dropdown trigger="click">
                  <el-button type="primary">新增
                    <i class="el-icon-caret-bottom"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>单个新增</el-dropdown-item>
                    <el-dropdown-item>批量导入</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown trigger="click">
                  <el-button type="primary" plain>更多功能
                    <i class="el-icon-caret-bottom"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>导入</el-dropdown-item>
                    <el-dropdown-item>批量删除</el-dropdown-item>
                    <el-dropdown-item>批量修改</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div slot="filterlist">
                <p>
                  <el-form :inline="true" :model="formInline" label-width="70px" :label-position="labelPosition" class="demo-form-inline">
                    <el-row>
                      <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                        <el-form-item label="员工姓名">
                          <el-input v-model="formInline.user" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="工作性质">
                          <el-select v-model="formInline.region" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="合同公司">
                          <el-select v-model="formInline.region" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="毕业时间">
                          <el-input v-model="formInline.user" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="毕业专业">
                          <el-input v-model="formInline.user" placeholder="请输入"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                        <el-form-item label="部门">
                          <el-select v-model="formInline.region" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="岗位">
                          <el-select v-model="formInline.region" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="工作地点">
                          <el-select v-model="formInline.region" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="学历">
                          <el-select v-model="formInline.region" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="学位">
                          <el-select v-model="formInline.region" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                        <el-form-item label="岗位类别">
                          <el-select v-model="formInline.region" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                          </el-select>
                        </el-form-item>

                        <el-form-item label="所在城市">
                          <el-select v-model="formInline.region" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="毕业院校">
                          <el-input v-model="formInline.user" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="学习形式">
                          <el-select v-model="formInline.region" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                        <el-form-item label="入职日期">
                          <el-date-picker v-model="formInline.date1" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-form-item>
                      <el-button type="primary">查询</el-button>
                      <el-button>重置</el-button>
                    </el-form-item>
                  </el-form>
                </p>
              </div>
            </TopOperating>
            <iviewTable stripe :columns="columns" :data="TableData" style="margin-top:20px;"></iviewTable>
          </el-tab-pane>
          <el-tab-pane label="职称管理" name="third">
          </el-tab-pane>
          <el-tab-pane label="证书/证件管理" name="fourth">
          </el-tab-pane>
          <el-tab-pane label="工作经历管理" name="fifth">
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
// import { testAPI } from '@/api/manage' // 获取封装好的请求接口，调用方式：test(参数).then(res => { console.log(res.data)})
import TopOperating from '@/views/components/TopOperating'
import BuildPage from '@/views/components/building'
export default {
  name: 'archivesPersonnel',
  components: {
    TopOperating, BuildPage
  },
  watch: {},
  data() {
    // 数据data在这里
    return {
      labelPosition: 'left', // 筛选label左对齐
      activeName: 'first',
      selValue: null, // 树形数据的value
      formInline: {
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
          title: '姓名',
          key: 'name',
          fixed: 'left',
          minWidth: 100,
          className: 'demo-table-info-column'
        },
        {
          title: '性别',
          key: 'sex',
          minWidth: 100
        },
        {
          title: '年龄',
          key: 'age',
          minWidth: 100
        },
        {
          title: '城市',
          key: 'city',
          minWidth: 100
        },
        {
          title: '地址',
          key: 'address',
          minWidth: 100
        },
        {
          title: '民族',
          key: 'nation',
          minWidth: 100
        },
        {
          title: '电话',
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
          className: 'demo-table-info-column',
          render: (h, params) => {
            return h('div', [
              h(
                'a',
                {
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                },
                '编辑'
              )
            ])
          }
        }
      ],
      TableData: [
        {
          name: '张三',
          sex: '男',
          age: 18,
          city: '郑州',
          address: '金水区',
          nation: '汉',
          phone: '15646415482',
          jobnumber: '123415648',
          Operation: '编辑'
        },
        {
          name: '张三',
          sex: '男',
          age: 18,
          city: '郑州',
          address: '金水区',
          nation: '汉',
          phone: '15646415482',
          jobnumber: '123415648',
          Operation: '编辑'
        },
        {
          name: '张三',
          sex: '男',
          age: 18,
          city: '郑州',
          address: '金水区',
          nation: '汉',
          phone: '15646415482',
          jobnumber: '123415648',
          Operation: '编辑'
        },
        {
          name: '张三',
          sex: '男',
          age: 18,
          city: '郑州',
          address: '金水区',
          nation: '汉',
          phone: '15646415482',
          jobnumber: '123415648',
          Operation: '编辑'
        }
      ]
    }
  },
  methods: {
    init() {
      // 处理函数
    }
  },
  mounted() {
    // 一般在此调用初始化函数
    this.init()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 重置样式，用于重写element-ui样式，自定义自己的样式 */
.ivu-table td.demo-table-info-column {
  color: #0bb27a;
}
.el-date-editor .el-range-separator {
  width: 8%;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 自定义样式，由于有scoped属性，所以只对当前tamplate中的 html生效，优化打包效率*/
.app-container {
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
  .archives {
    .choose-department {
      width: 240px;
      display: flex;
      .input-box {
        flex: 1;
      }
    }
  }
}
</style>
