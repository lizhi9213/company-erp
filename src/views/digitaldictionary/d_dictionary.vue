<template>
  <div class="app-container">
    <el-row :gutter="18" class="role-manage">
      <el-col :xs="5" :sm="5" :md="4" :lg="4" :xl="4">
        <el-card class="box-card role-box">
          <div slot="header" class="clearfix">
            <p class="card-title-xe">
              <span class="title-color-xe">字典</span>分类
            </p>
          </div>
          <div class="role_body">
            <el-menu default-active="0" class="role-menu" @select="handleSelect">
              <el-menu-item v-for="(item, index) in roleData" :index="index+''" :key="index">
                <span slot="title">{{item.DataName}}</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="19" :sm="19" :md="20" :lg="20" :xl="20">
        <el-card class="box-card">
          <div class="grid-content bg-purple">
            <h3>字典数据分类</h3>
            <div class="operating-group">
              <div class="search-input">
                搜索关键字&nbsp;&nbsp;&nbsp;
                <div class="input-box">
                  <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                  </el-input>
                </div>
              </div>
              <div class="button-group">
                <el-button type="primary" @click="handelDictionary(1)">新增字典</el-button>
              </div>
            </div>
          </div>
          <!-- table表格 -->
          <tree-table :data="treeData2" :evalFunc="func" class="treeTable tree-box" ref="treeTable">
            <el-table-column prop="number" label="排序">
            </el-table-column>
            <el-table-column prop="name" label="字典名称">
            </el-table-column>
            <el-table-column prop="handel">
              <template slot-scope="scope">
                <el-button type="text" @click="handelDictionary(1,scope, scope.row.id)">新增字典</el-button>
                <el-button type="text" @click="handelDictionary(2,scope.$index,scope.row.id)">编辑字典</el-button>
                <el-button type="text" @click="removeData(scope)">删除字典</el-button>
              </template>
            </el-table-column>
          </tree-table>
        </el-card>
      </el-col>
    </el-row>
    <!-- 新增弹出框 -->
    <Modal v-model="fieldModal" class="iview-right-model" :width="580" :transfer="false" :transition-names="['move-right','fade']">
      <h3 slot="header">{{modalTitle}}</h3>
      <el-form :model="dataForm" label-width="100px" class="demo-ruleForm" :rules="ruleForm" ref="dicForm">
        <el-form-item label="排序" prop="sort">
          <el-input v-model="dataForm.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典名称" prop="DataName">
          <el-input v-model="dataForm.DataName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="fieldModal = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getDictionary,
  getDictionaryshow,
  delDictionary,
  checkDictionary,
  editorShow,
  addDictionary,
  editorDictionary
} from '@/api/sysbasis/dictionary.js'
import treeToArray from './customEval'
import treeTable from '@/components/TreeTable'
export default {
  name: 'test',
  components: { treeTable },
  data() {
    // 验证字典名称
    const validateName = (rule, value, callback) => {
      console.log(rule)
      if (value !== '') {
        checkDictionary({
          id: this.dataForm.Id || '',
          DataName: value,
          DataId: this.dataForm.parents || this.activeId
        }).then(res => {
          console.log(res.data)
          if (res.data.code) {
            return callback(new Error('数据字典重复！'))
          } else {
            return callback()
          }
        })
      } else {
        return callback()
      }
    }
    return {
      roleData: [],
      activeId: '',
      activeName: '',
      filterText: '',
      treeData2: [],
      func: treeToArray,
      // bodyHeight: '800', // min-heigth最小高度
      dataForm: {
        sort: 0,
        DataName: '',
        parents: ''
      },
      modaltype: '',
      modalTitle: '',
      fieldModal: false,
      ruleForm: {
        DataName: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDict()
  },
  watch: {
    filterText(val) {
      this.getGrid()
    }
  },
  methods: {
    // 获取左边列表
    getDict() {
      getDictionary().then(res => {
        if (res.data) {
          console.log(res.data)
          this.roleData = res.data
          this.activeId = this.roleData[0].DataId
          this.activeName = this.roleData[0].DataName
          this.getGrid()
        }
      })
    },
    handleSelect(index) {
      this.activeId = this.roleData[index].DataId
      this.activeName = this.roleData[index].DataName
      this.getGrid()
    },
    getGrid() {
      const that = this
      getDictionaryshow(this.activeId, this.filterText).then(res => {
        if (res.data) {
          that.treeData2 = []
          that.$nextTick(() => {
            that.treeData2 = res.data
          })
        }
      })
    },
    handelDictionary(type, scope, id) {
      const that = this
      that.$refs['dicForm'].resetFields()
      that.modaltype = type
      if (type === 1) {
        that.modalTitle = '新增数据字典'
        if (scope) {
          const DataId = scope.row.DataId
          that.dataForm.parents = DataId
        } else {
          that.dataForm.activeId = this.activeId
        }
      } else if (type === 2) {
        that.modalTitle = '编辑数据字典'
        editorShow(id)
          .then(res => {
            that.dataForm = res.data
          })
          .catch(err => {
            console.log(err)
          })
      }
      that.fieldModal = true
    },
    submitForm() {
      const that = this
      this.$refs['dicForm'].validate(valid => {
        // console.log(that.dataForm)
        if (valid) {
          // 先判断是更新还是新增数据
          if (that.modaltype === 1) {
            that.dataForm.activeId = this.activeId
            // 提交服务器保存
            addDictionary(that.dataForm).then(res => {
              if (res.data.code) {
                that.getGrid()
                that.fieldModal = false
                that.$message.success(res.data.msg)
              } else {
                that.$message.error(res.data.msg)
              }
            })
          } else if (this.modaltype === 2) {
            // 编辑更新数据
            that.dataForm.activeId = this.activeId
            editorDictionary(that.dataForm).then(res => {
              if (res.data.code) {
                that.getGrid()
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
    removeData(scope) {
      const that = this
      const DataId = scope.row.DataId
      const Id = scope.row.id
      that
        .$confirm('此操作将删除字典数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          delDictionary(Id, DataId).then(res => {
            if (res.data.code) {
              // 操作成功
              that.$message({
                type: 'success',
                message: res.data.msg
              })
              that.getGrid()
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
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.role-box {
  max-height: 810px;
  overflow: auto;
  .role_body {
    .el-menu {
      border: none;
      .el-menu-item {
        &.is-active {
          border-right: solid 2px #3cc195;
        }
      }
    }
  }
}
.bg-purple {
  box-sizing: border-box;
  .operating-group {
    display: flex;
    padding-top: 17px;
    .search-input {
      width: 240px;
      margin-bottom: 15px;
      display: flex;
      line-height: 40px;
      .input-box {
        flex: 1;
      }
    }
    .button-group {
      margin-right: 20px;
      flex: 1;
      text-align: right;
    }
  }
}
.tree-box {
  height: 675px;
  overflow: auto;
}
.el-table::before {
  z-index: -1;
}
.el-table tr {
  .el-button {
    display: none;
  }
}
.el-table tr:hover {
  .el-button {
    display: inline-block;
  }
}
</style>
