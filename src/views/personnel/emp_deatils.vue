<template>
  <div class="app-container">
    <div class="emp_deatils">
      <div class="emp_deatils-head">
        <div class="emp_deatils-pic">
          <img :src="userInfo.avatar" style="width:100%;" />
          <div class="caption" @click.stop="uploadHeadImg">更改头像</div>
        </div>
        <input type="file" accept="image/*" @change="handleFile" class="hiddenInput" style="display:none;" />
        <div class="emp_deatils-news">
          <p class="person-name">{{userInfo.username}}</p>
          <p class="person-address">{{userInfo.department}}</p>
          <p class="person-more">
            <span class="note" v-if="value != ''" v-for="value in userInfo.notes" :key="value">{{value}}</span>
          </p>
        </div>
      </div>
      <el-tabs class="emp_deatils-nav" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="在职信息" name="first">
          <div class="items-block">
            <div class="block-head">
              <div class="head-fl">在职信息</div>
              <div class="head-fr" v-show="blockType[0].hidden" @click="changetype(0)">
                <div class="head-fr_change">
                  <i class="el-icon-edit-outline items-icon"></i>
                  <span>编辑</span>
                </div>
              </div>
            </div>
            <div class="block-nav">
              <div class="nav-text" v-show="!blockType[0].obg">
                <div class="flex-block">
                  <div class="formGroup">
                    <span class="controlLabel">
                      工号
                    </span>
                    <span class="controlInput">{{onjobForm.UserNo}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      账号
                    </span>
                    <span class="controlInput">{{onjobForm.AccountNo}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      归属部门
                    </span>
                    <span class="controlInput">{{onjobForm.departmentName}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      归属职务
                    </span>
                    <span class="controlInput">{{onjobForm.dutiesName}}</span>
                  </div>
                </div>
              </div>
              <div class="nav-form" v-show="blockType[0].obg">
                <el-form :model="onjobEditForm" :rules="rulesonjobEditForm" ref="onjobEditForm" style="margin-top:20px;" label-width="160px" class="demo-Form">
                  <el-row>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
                      <el-form-item label="工号" prop="UserNo">
                        <el-input placeholder="请输入…" v-model="onjobEditForm.UserNo"></el-input>
                        <!-- <div class="tip-2uVhT">最新工号为：Y201835 (黄晓明)，
                          <span style="color:#0bb27a;cursor:pointer;">重新生成</span>
                        </div> -->
                      </el-form-item>
                      <el-form-item label="归属部门" prop="departId">
                        <!-- <el-cascader :options="departOptions" placeholder="请选择归属部门" change-on-select :clearable='true' expand-trigger="hover" @change="departChange">
                        </el-cascader> -->
                        <multiCascader width="240px" height="220px" v-model='onjobEditForm.departId' placeholder="请选择归属部门" :options="departOptions" :indep='true' outputType="item"></multiCascader>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
                      <el-form-item label="账号" prop="AccountNo">
                        <el-input placeholder="请输入手机号" v-model="onjobEditForm.AccountNo"></el-input>
                      </el-form-item>
                      <el-form-item label="归属职务" prop="dutiesId">
                        <!-- <el-cascader :options="dutiesOption" placeholder="请选择归属职务" change-on-select :clearable='true' expand-trigger="hover" @change="jobChange">
                        </el-cascader> -->
                        <multiCascader :options="dutiesOption" width="240px" height="220px" v-model='onjobEditForm.dutiesId' placeholder="请选择归属职务" :indep='true' outputType="item"></multiCascader>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="btn-flex">
                    <el-button @click="resetForm('onjobEditForm',0)">取消</el-button>
                    <el-button type="primary" @click="saveonJobForm('onjobEditForm',0)">确定</el-button>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
          <div class="items-block">
            <div class="block-head">
              <div class="head-fl">员工状态</div>
              <div class="head-fr" v-show="blockType[1].hidden" @click="changetype(1)">
                <div class="head-fr_change">
                  <i class="el-icon-edit-outline items-icon"></i>
                  <span>编辑</span>
                </div>
              </div>
            </div>
            <div class="block-nav">
              <div class="nav-text" v-show="!blockType[1].obg">
                <div class="flex-block">
                  <div class="formGroup">
                    <span class="controlLabel">
                      员工状态
                    </span>
                    <span class="controlInput">{{statusForm.workNatureName}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      入职日期
                    </span>
                    <span class="controlInput">{{statusForm.date1}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      转正日期
                    </span>
                    <span class="controlInput">{{statusForm.date2}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      离职日期
                    </span>
                    <span class="controlInput">{{statusForm.date3}}</span>
                  </div>
                </div>
              </div>
              <div class="nav-form" v-show="blockType[1].obg">
                <el-form :model="statusEditForm" :rules="rulesstatusEditForm" ref="statusEditForm" style="margin-top:20px;" label-width="160px" class="demo-Form">
                  <el-row>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
                      <el-form-item label="员工状态" prop="worknature">
                        <el-select v-model="statusEditForm.worknature" placeholder="请选择员工状态">
                          <el-option v-for="item in statusoptions" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="转正日期" prop="date2">
                        <el-date-picker type="date" value-format="yyyy-MM-dd" :editable="false" placeholder="选择日期" v-model="statusEditForm.date2"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
                      <el-form-item label="入职日期" prop="date1">
                        <el-date-picker type="date" value-format="yyyy-MM-dd" :editable="false" placeholder="选择日期" v-model="statusEditForm.date1"></el-date-picker>
                      </el-form-item>
                      <el-form-item label="离职日期" prop="date3">
                        <el-date-picker type="date" value-format="yyyy-MM-dd" :editable="false" placeholder="选择日期" v-model="statusEditForm.date3"></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="btn-flex">
                    <el-button @click="resetForm('statusEditForm',1)">取消</el-button>
                    <el-button type="primary" @click="saveonStatusForm('statusEditForm',1)">确定</el-button>
                  </div>

                </el-form>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="个人信息" name="second">
          <div class="items-block">
            <div class="block-head">
              <div class="head-fl">个人信息</div>
              <div class="head-fr" v-show="blockType[2].hidden" @click="changetype(2)">
                <div class="head-fr_change">
                  <i class="el-icon-edit-outline items-icon"></i>
                  <span>编辑</span>
                </div>
              </div>
            </div>
            <div class="block-nav">
              <div class="nav-text" v-show="!blockType[2].obg">
                <div class="flex-block">
                  <div class="formGroup">
                    <span class="controlLabel">
                      姓名
                    </span>
                    <span class="controlInput">{{personForm.user}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      性别
                    </span>
                    <span class="controlInput">{{personForm.sexName}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      民族
                    </span>
                    <span class="controlInput">{{personForm.nationName}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      手机号
                    </span>
                    <span class="controlInput">{{personForm.UserPhone}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      政治面貌
                    </span>
                    <span class="controlInput">{{personForm.politicsName}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      生日
                    </span>
                    <span class="controlInput">{{personForm.birthday}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      个人邮箱
                    </span>
                    <span class="controlInput">{{personForm.email}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      证件类型
                    </span>
                    <span class="controlInput">{{personForm.idtypeName}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      证件号
                    </span>
                    <span class="controlInput">{{personForm.idnumber}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      银行卡号
                    </span>
                    <span class="controlInput">{{personForm.banknumber}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      卡户行
                    </span>
                    <span class="controlInput">{{personForm.bank}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      开户行
                    </span>
                    <span class="controlInput">{{personForm.openbank}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      毕业院校
                    </span>
                    <span class="controlInput">{{personForm.school}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      专业
                    </span>
                    <span class="controlInput">{{personForm.major}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      学历
                    </span>
                    <span class="controlInput">{{personForm.educationName}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      毕业日期
                    </span>
                    <span class="controlInput">{{personForm.graduatedate}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      户籍
                    </span>
                    <span class="controlInput">{{showLivePro(personForm.ProvName, personForm.CityName)}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      居住地
                    </span>
                    <span class="controlInput">{{showLivePro(personForm.LiveProvName, personForm.LiveCityName, personForm.LiveAreaName)}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      详细地址
                    </span>
                    <span class="controlInput">{{personForm.address}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      招聘方式
                    </span>
                    <span class="controlInput">{{personForm.recruitName}}</span>
                  </div>
                </div>
              </div>
              <div class="nav-form" v-show="blockType[2].obg">
                <el-form :model="personEditForm" :rules="rulespersonEditForm" ref="personEditForm" style="margin-top:20px;" label-width="160px" class="demo-Form">
                  <el-row>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
                      <el-form-item label="姓名" prop="user">
                        <el-input placeholder="请输入…" v-model="personEditForm.user"></el-input>
                      </el-form-item>
                      <el-form-item label="民族" prop="nation">
                        <el-select v-model="personEditForm.nation" placeholder="请选择民族">
                          <el-option v-for="item in nationOption" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="政治面貌" prop="politics">
                        <el-select v-model="personEditForm.politics" placeholder="请选择民族">
                          <el-option v-for="item in politicsOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="邮箱" prop="email">
                        <el-input placeholder="请输入…" v-model="personEditForm.email"></el-input>
                      </el-form-item>
                      <el-form-item label="证件号" prop="idnumber">
                        <el-input placeholder="请输入…" v-model="personEditForm.idnumber"></el-input>
                      </el-form-item>
                      <el-form-item label="卡户行" prop="bank">
                        <el-input placeholder="请输入…" v-model="personEditForm.bank"></el-input>
                      </el-form-item>
                      <el-form-item label="毕业院校" prop="school">
                        <el-input placeholder="请输入…" v-model="personEditForm.school"></el-input>
                      </el-form-item>
                      <el-form-item label="学历" prop="education">
                        <el-select v-model="personEditForm.education" placeholder="请选择证件类型">
                          <el-option v-for="item in educationOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="户籍" prop="censusregisterId">
                        <el-cascader :options="regDomicileOption" v-model="personEditForm.censusregisterId" placeholder="请选择户籍地" :clearable='true' expand-trigger="hover" @change="ProvChange"></el-cascader>
                      </el-form-item>
                      <el-form-item label="详细地址" prop="address">
                        <el-input placeholder="请输入…" v-model="personEditForm.address"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
                      <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="personEditForm.sex">
                          <el-radio :label="1">男</el-radio>
                          <el-radio :label="2">女</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="手机号" prop="UserPhone">
                        <el-input placeholder="请输入…" v-model="personEditForm.UserPhone"></el-input>
                      </el-form-item>
                      <el-form-item label="生日" prop="birthday">
                        <el-date-picker type="date" value-format="yyyy-MM-dd" :editable="false" placeholder="选择日期" v-model="personEditForm.birthday"></el-date-picker>
                      </el-form-item>
                      <el-form-item label="证件类型" prop="idtype">
                        <el-select v-model="personEditForm.idtype" placeholder="请选择证件类型">
                          <el-option v-for="item in idtypeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="银行卡号" prop="banknumber">
                        <el-input placeholder="请输入…" v-model="personEditForm.banknumber"></el-input>
                      </el-form-item>
                      <el-form-item label="开户行" prop="openbank">
                        <el-input placeholder="请输入…" v-model="personEditForm.openbank"></el-input>
                      </el-form-item>
                      <el-form-item label="专业" prop="major">
                        <el-input placeholder="请输入…" v-model="personEditForm.major"></el-input>
                      </el-form-item>
                      <el-form-item label="毕业日期" prop="graduatedate">
                        <el-date-picker type="date" value-format="yyyy-MM-dd" :editable="false" placeholder="选择日期" v-model="personEditForm.graduatedate"></el-date-picker>
                      </el-form-item>
                      <el-form-item label="居住地址" prop="domicileId">
                        <el-cascader :options="domicileOption" v-model="personEditForm.domicileId" placeholder="请选择居住地" :clearable='true' expand-trigger="hover" @change="LiveProvChange"></el-cascader>
                      </el-form-item>
                      <el-form-item label="招聘渠道" prop="recruit">
                        <el-select v-model="personEditForm.recruit">
                          <el-option v-for="item in recruitOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="btn-flex">
                    <el-button @click="resetForm('personEditForm',2)">取消</el-button>
                    <el-button type="primary" @click="saveonPersonForm('personEditForm',2)">确定</el-button>
                  </div>

                </el-form>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="合同信息" name="third">
          <div class="items-block">
            <div class="block-head">
              <div class="head-fl">合同信息</div>
              <div class="head-fr">
                <div class="head-fr_change" v-show="addcontractbtn" @click="addcontract">
                  <i class="el-icon-circle-plus-outline items-icon"></i>
                  <span>添加</span>
                </div>
              </div>
            </div>
            <div class="block-nav" v-for="(item,index) in contractinfo" :key="index">
              <div class="nav-text" v-if="!item.isShow">
                <el-button class="contract_change" type="primary" @click="changecontract(index)">编辑</el-button>
                <div class="flex-block">
                  <div class="formGroup">
                    <span class="controlLabel">
                      合同编号
                    </span>
                    <span class="controlInput">{{item.contractForm.ContCode}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      合同类型
                    </span>
                    <span class="controlInput">{{item.contractForm.ContTypeName}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      生效日期
                    </span>
                    <span class="controlInput">{{item.contractForm.BeginDate}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      失效日期
                    </span>
                    <span class="controlInput">{{item.contractForm.EndDate}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      时长年限
                    </span>
                    <span class="controlInput">{{item.contractForm.YearNum}}</span>
                  </div>
                  <div class="formGroup">
                    <span class="controlLabel">
                      合同附件
                    </span>
                    <span class="controlInput">
                      <span style="cursor: pointer;" @click="addattachment(index)">点击上传附件</span>
                    </span>
                  </div>
                  <div v-show="item.isHideen" style="width:100%;border:1px solid #eee;padding:20px;">
                    <el-upload class="upload-demo" action="/apiweb/api/upload/contractfile" drag ref="upload" :data="upData" :on-success="upSuccess" :on-change="fileChange" :file-list="fileList" multiple>
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">将文件拖到此处，或
                        <em>点击上传</em>
                      </div>
                    </el-upload>
                  </div>
                </div>
              </div>
              <div class="nav-form" v-if="item.isShow">
                <el-form :model="item.contractEditForm" :rules="rulescontractForm" :ref="'contractForm' +index" style="margin-top:20px;" label-width="160px" class="demo-Form">
                  <el-row>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
                      <el-form-item label="合同编号" prop="ContCode">
                        <el-input v-model="item.contractEditForm.ContCode"></el-input>
                      </el-form-item>
                      <el-form-item label="生效日期" prop="BeginDate">
                        <el-date-picker type="date" value-format="yyyy-MM-dd" :editable="false" placeholder="选择日期" v-model="item.contractEditForm.BeginDate"></el-date-picker>
                      </el-form-item>
                      <el-form-item label="时长年限" prop="YearNum">
                        <el-input v-model="item.contractEditForm.YearNum"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
                      <el-form-item label="合同类型" prop="ContType">
                        <el-select v-model="item.contractEditForm.ContType" placeholder="请选择合同类型">
                          <el-option v-for="item in contracttypeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="失效日期" prop="EndDate">
                        <el-date-picker type="date" value-format="yyyy-MM-dd" :editable="false" placeholder="选择日期" v-model="item.contractEditForm.EndDate"></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="btn-flex">
                    <el-button @click="resetcontractForm(index)">取消</el-button>
                    <el-button type="primary" @click="savecontractForm('contractForm' +index,index)">确定</el-button>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// import { testAPI } from '@/api/manage' // 获取封装好的请求接口，调用方式：test(参数).then(res => { console.log(res.data)})
import {
  getDataDict, // 参数字典下拉框
  getProvCombox1 // 获取省市区下拉框
} from '@/api/comm/select'
import {
  initMetaForm, // 获取员工top信息
  initonJobForm, // 初始化在职信息
  initonStatusForm, // 初始化员工状态
  initonPersonForm, // 初始化员工信息
  initcontractForm, // 初始化合同信息
  saveonJobForm, // 保存在职信息
  saveonStatusForm, // 保存员工状态
  saveonPersonForm, // 保存员工信息
  addcontractForm, // 添加合同信息
  savecontractForm, // 保存合同信息
  phoneCheck, // 验证手机号是否重复
  numberCheck, // 验证工号是否重复
  usernumberCheck // 验证账号是否重复
} from '@/api/personnel/emp_deatils'
import building from '@/views/components/building.vue'
import {
  getDepartTree, // 部门下拉框
  getDutiesTree // 职务下拉框
} from '@/api/comm/treeselect'

import multiCascader from '@/components/multi-cascader'
export default {
  name: 'emp_deatilsPersonnel',
  components: {
    building,
    multiCascader
  },
  watch: {},
  data() {
    // 数据data在这里
    var validatePhone = (rule, value, callback) => {
      const myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else if (!myreg.test(value)) {
        return callback(new Error('手机格式不正确'))
      } else if (value !== '') {
        phoneCheck(this.personEditForm.UserPhone, this.userId).then(res => {
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
    const validatenumber = (rule, value, callback) => {
      if (value !== '') {
        numberCheck(this.onjobEditForm.UserNo, this.userId).then(res => {
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
    const validateusernumber = (rule, value, callback) => {
      if (value !== '') {
        usernumberCheck(this.onjobEditForm.AccountNo, this.userId).then(res => {
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
    return {
      upData: {},
      fileNum: 0,
      fileList: [],
      submitFile: 0,
      departOptions: [], // 归属部门下拉框
      dutiesOption: [], // 职务下拉框
      addcontractbtn: true,
      contractinfo: [],
      userId: '', // 用户id
      userInfo: {
        avatar:
          'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=62d46c39067b020818c437b303b099b6/d4628535e5dde7119c3d076aabefce1b9c1661ba.jpg',
        username: '郭庆久',
        department: '运营部',
        notes: {
          sex: '男',
          constellation: '狮子座'
        }
      },
      activeName: 'first', // table切换首选项
      formLabelWidth: '80px', // 表单信息label宽度
      blockType: [
        { obg: false, hidden: 'false' },
        { obg: false, hidden: 'false' },
        { obg: false, hidden: 'false' },
        { obg: false, hidden: 'false' }
      ], // 表格文档切换数据
      statusoptions: [
        {
          label: '实习',
          value: 1
        },
        {
          label: '转正',
          value: 2
        },
        {
          label: '离职',
          value: 3
        }
      ],
      onjobEditForm: {},
      statusEditForm: {},
      personEditForm: {},
      onjobForm: {
        // 在职信息表单数据
        UserNo: '',
        AccountNo: '',
        departmentName: '',
        dutiesName: ''
      },
      statusForm: {
        // 员工状态表单数据
        worknature: '',
        date1: '',
        date2: '',
        date3: ''
      },
      nationOption: [], // 民族下拉框
      politicsOption: [], // 政治面貌
      idtypeOption: [], // 证件类型
      educationOption: [], // 学历下拉框
      regDomicileOption: [], // 户籍类型下拉框
      domicileOption: [], // 居住地下拉框
      recruitOption: [], // 招聘渠道下拉框
      contracttypeOption: [], // 合同类型下拉框
      personForm: {
        // 个人信息表单数据
        user: '',
        sex: '',
        sexName: '', // 性别显示名称
        nation: '',
        nationName: '', // 民族显示名称
        UserPhone: '',
        politics: '',
        politicsName: '', // 政治面貌显示名称
        birthday: '',
        email: '',
        idtype: '',
        idtypeName: '', // 证件类型显示名称
        idnumber: '',
        banknumber: '',
        bank: '',
        openbank: '',
        school: '',
        major: '',
        education: '',
        educationName: '', // 学历显示名称
        graduatedate: '',
        censusregisterId: [],
        domicileId: [],
        censusregister: '',
        domicile: '',
        address: '',
        recruit: '',
        recruitName: '', // 招聘渠道
        ProvName: '',
        CityName: '',
        LiveProvName: '',
        LiveCityName: '',
        LiveAreaName: ''
      },
      rulescontractForm: {
        ContCode: [
          { required: true, message: '合同编号不能为空', trigger: 'blur' }
        ]
      },
      rulesonjobEditForm: {
        UserNo: [
          { required: true, message: '工号不能为空', trigger: 'blur' },
          { validator: validatenumber, trigger: 'blur' }
        ],
        AccountNo: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { validator: validateusernumber, trigger: 'blur' }
        ],
        departId: [{ required: true, message: '归属部门不能为空' }],
        dutiesId: [{ required: true, message: '归属职务不能为空' }]
      },
      rulesstatusEditForm: {
        date1: [
          {
            required: true,
            message: '请选择入职日期',
            trigger: 'change'
          }
        ]
      },
      rulespersonEditForm: {
        user: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { min: 2, message: '不少于2位', trigger: 'blur' }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        UserPhone: [{ validator: validatePhone, trigger: 'blur' }],
        recruit: [
          { required: true, message: '招聘渠道不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init() {
      this.userId = this.$route.params.id || ''
      this.ContId = this.$route.params.ContId || ''
      // 处理函数
      this.setDepartCombo() // 设置部门下拉框
      this.setdutiesCombo() // 设置职务下拉框
      this.initMetaForm()
      this.initonJobForm()
      this.initonStatusForm()
      this.initonPersonForm()
      this.initcontractForm()
      this.setDictComBox('4a39fa16-8667-11e8-86f8-44a84203f5fd', data => {
        // 民族下拉框
        this.nationOption = data
      })
      this.setDictComBox('c3b9af7f-14ce-42aa-80e3-396c627dd35e', data => {
        // 政治面貌下拉框
        this.politicsOption = data
      })
      this.setDictComBox('f7309ef4-d8a0-4225-ac0c-758357e7d26f', data => {
        // 证件类型下拉框
        this.idtypeOption = data
      })
      this.setDictComBox('491b4781-20a1-47f2-a9d5-f949b7250204', data => {
        // 学历下拉框
        this.educationOption = data
      })
      this.setProvCombox('-1', 2, data => {
        // 户籍类型下拉框
        this.regDomicileOption = data
      })
      this.setProvCombox('-1', 3, data => {
        // 居住地类型下拉框
        this.domicileOption = data
      })
      this.setDictComBox('81e7b9b2-b9a5-4211-8470-a64d76cfec78', data => {
        // 招聘渠道下拉框
        this.recruitOption = data
      })
      this.setDictComBox('2faf7a40-9169-11e8-86f8-44a84203f5fd', data => {
        // 合同信息下拉框
        this.contracttypeOption = data
      })
    },
    initMetaForm() {
      // 初始化员工top信息
      const that = this
      initMetaForm(that.userId).then(res => {
        that.userInfo = res.data
        that.userInfo.avatar =
          res.data.avatar ||
          'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=62d46c39067b020818c437b303b099b6/d4628535e5dde7119c3d076aabefce1b9c1661ba.jpg'
      })
    },
    initonJobForm() {
      // 初始化在职信息
      const that = this
      initonJobForm(that.userId).then(res => {
        that.onjobForm = res.data
      })
    },
    initonStatusForm() {
      // 初始化员工状态
      const that = this
      initonStatusForm(that.userId).then(res => {
        res.data.worknature = ''
        that.statusForm = res.data
      })
    },
    initonPersonForm() {
      // 初始化员工信息
      const that = this
      initonPersonForm(that.userId).then(res => {
        that.personForm = res.data
      })
    },
    initcontractForm() {
      // 初始化合同信息
      const that = this
      initcontractForm(that.userId).then(res => {
        const _data = res.data
        const _textdata = []
        for (let i = 0; i < _data.length; i++) {
          const contractinfo = {} // 最外层大对象
          const lits = {} // 过度用的
          lits.Id = _data[i].Id
          lits.ContCode = _data[i].ContCode
          lits.BeginDate = _data[i].BeginDate
          lits.YearNum = _data[i].YearNum
          lits.ContType = _data[i].ContType
          lits.ContTypeName = _data[i].ContTypeName
          lits.EndDate = _data[i].EndDate

          contractinfo.contractForm = lits
          contractinfo.contractEditForm = lits

          contractinfo.isShow = _data[i].isShow
          contractinfo.isHideen = _data[i].isHideen
          contractinfo.flag = _data[i].flag
          console.log(contractinfo)
          _textdata.push(contractinfo)
        }
        this.contractinfo = _textdata
        // console.log(res.data)
        // console.log(that.contractinfo)
        // console.log(that.contractinfo[0])
        // console.log(that.contractinfo[0].contractForm)
        // console.log(that.contractinfo.contractForm)
        // that.contractinfo.contractForm = res.data
      })
    },
    saveonJobForm(formName, i) {
      // 保存在职信息
      const that = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          that.onjobEditForm.userId = that.userId
          saveonJobForm(that.onjobEditForm).then(res => {
            if (res.data.code) {
              // 操作成功
              this.$message.success(res.data.msg)
              that.initonJobForm()
              that.submitForm(formName, i)
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
    saveonStatusForm(formName, i) {
      // 保存员工状态
      const that = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          that.statusEditForm.userId = that.userId
          saveonStatusForm(that.statusEditForm).then(res => {
            if (res.data.code) {
              // 操作成功
              this.$message.success(res.data.msg)
              that.initonStatusForm()
              that.submitForm(formName, i)
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
    saveonPersonForm(formName, i) {
      // 保存员工信息
      const that = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          that.personEditForm.userId = that.userId
          saveonPersonForm(that.personEditForm).then(res => {
            if (res.data.code) {
              // 操作成功
              this.$message.success(res.data.msg)
              that.initMetaForm()
              that.initonPersonForm()
              that.submitForm(formName, i)
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
    savecontractForm(formName, index) {
      // 保存合同信息
      const that = this
      console.log(that.userId)
      this.$refs[formName][0].validate(valid => {
        if (valid) {
          that.contractinfo[index].contractEditForm.userId = that.userId
          const i = that.contractinfo[index].flag
          if (i === 2) {
            addcontractForm(that.contractinfo[index].contractEditForm).then(
              res => {
                if (res.data.code) {
                  // 操作成功
                  this.$message.success(res.data.msg)
                  that.initcontractForm()
                  that.contractinfo[index].flag = 1
                  that.addcontractbtn = true
                  that.changecontract(index)
                } else {
                  that.$message({
                    type: 'error',
                    message: res.data.msg
                  })
                }
              }
            )
          } else {
            that.contractinfo[index].contractEditForm.userId = that.userId
            savecontractForm(that.contractinfo[index].contractEditForm).then(
              res => {
                if (res.data.code) {
                  // 操作成功
                  this.$message.success(res.data.msg)
                  that.initcontractForm()
                  that.addcontractbtn = true
                  that.changecontract(index)
                } else {
                  that.$message({
                    type: 'error',
                    message: res.data.msg
                  })
                }
              }
            )
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setProvCombox(pId, num, setFun) {
      // 省市区下拉框数据获取
      getProvCombox1(num).then(res => {
        setFun(res.data)
      })
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
    ProvChange(val) {
      console.log(val)
      this.personEditForm.Prov = ''
      this.personEditForm.City = ''
      if (val.length > 0) {
        this.personEditForm.Prov = val[0]
      }
      if (val.length > 1) {
        this.personEditForm.City = val[1]
      }
    },
    LiveProvChange(val) {
      console.log(val)
      this.personEditForm.LiveProv = ''
      this.personEditForm.LiveCity = ''
      this.personEditForm.LiveArea = ''
      if (val.length > 0) {
        this.personEditForm.LiveProv = val[0]
      }
      if (val.length > 1) {
        this.personEditForm.LiveCity = val[1]
      }
      if (val.length > 2) {
        this.personEditForm.LiveArea = val[2]
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
    agiuahg(index) {
      this.contractinfo[index].isShow = !this.contractinfo[index].isShow
    },
    addcontract() {
      // const that = this
      var obj = {
        contractEditForm: {
          ContCode: '',
          BeginDate: '',
          YearNum: '',
          ContType: '',
          EndDate: ''
        },
        isShow: true,
        isHideen: false,
        flag: 2
      }
      this.contractinfo.splice(0, 0, obj)
      this.addcontractbtn = !this.addcontractbtn
    },
    changecontract(index) {
      // 编辑合同信息
      this.contractinfo[index].isShow = !this.contractinfo[index].isShow
      this.contractinfo[index].contractForm = JSON.parse(
        JSON.stringify(this.contractinfo[index].contractEditForm)
      )
    },
    addattachment(index) {
      // 上传附件显示隐藏
      this.contractinfo[index].isHideen = !this.contractinfo[index].isHideen
    },
    fileChange(file, filelist) {
      this.submitFile += filelist.length
    },
    upSuccess(response, file, fileList) {
      this.fileNum++
      if (this.fileNum >= fileList.length) {
        this.fileNum = 0
        this.$refs.upload.clearFiles()
      }
    },
    resetcontractForm(index) {
      var a = this.contractinfo[index].flag

      if (a === 2) {
        // 合同信息取消操作按钮

        this.contractinfo.splice(0, 1)
        this.addcontractbtn = !this.addcontractbtn
      } else {
        this.contractinfo[index].isShow = !this.contractinfo[index].isShow
      }
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
    uploadHeadImg: function() {
      // 打开图片上传
      this.$el.querySelector('.hiddenInput').click()
    },
    handleFile: function(e) {
      // 将头像显示
      const $target = e.target || e.srcElement
      const file = $target.files[0]
      var reader = new FileReader()
      reader.onload = data => {
        const res = data.target || data.srcElement
        this.userInfo.avatar = res.result
      }
      reader.readAsDataURL(file)
    },
    handleClick(tab, event) {
      // tablel切换操作
      console.log(tab, event)
    },
    changetype(i) {
      if (i === 0) {
        this.onjobEditForm = JSON.parse(JSON.stringify(this.onjobForm))
      } else if (i === 1) {
        this.changeStatusOption(this.statusForm.workNatureName)
        this.statusEditForm = JSON.parse(JSON.stringify(this.statusForm))
      } else if (i === 2) {
        // this.initonPersonForm()
        this.personEditForm = JSON.parse(JSON.stringify(this.personForm))
        // this.personEditForm.censusregisterId = [150000, 150500, 150522]
      }
      // 编辑操作按钮
      this.blockType[i].obg = !this.blockType[i].obg
      this.blockType[i].hidden = !this.blockType[i].hidden
    },
    changeStatusOption(type) {
      const that = this
      that.statusoptions = []
      if (type === '待入职') {
        that.statusoptions.push({
          label: '实习',
          value: '1'
        })
      }
      if (type === '实习') {
        that.statusoptions.push({
          label: '转正',
          value: '2'
        })
      }
      that.statusoptions.push({
        label: '离职',
        value: '3'
      })
    },
    resetForm(formName, i) {
      // this.$refs[formName].resetFields()
      // if (i === 0) {
      //   this.initonJobForm()
      // } else if (i === 1) {
      //   this.initonStatusForm()
      // } else if (i === 2) {
      //   this.initonPersonForm()
      // }
      this.blockType[i].obg = !this.blockType[i].obg
      this.blockType[i].hidden = !this.blockType[i].hidden
    },
    submitForm(formName, i) {
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      //     alert('submit!')

      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
      this.blockType[i].obg = !this.blockType[i].obg
      this.blockType[i].hidden = !this.blockType[i].hidden
    },
    showLivePro(prov, city, area) {
      var rel = ''
      if (prov) {
        rel += prov
        if (city) {
          rel += '-' + city
          if (area) {
            rel += '-' + area
          }
          return rel
        } else {
          return rel
        }
      } else {
        return ''
      }
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
.el-select,
.el-date-editor.el-input,
.el-date-editor.el-input__inner,
.el-cascader--small {
  width: 100%;
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
  .emp_deatils {
    .emp_deatils-head {
      transition: width 2s;
      -moz-transition: width 2s; /* Firefox 4 */
      -webkit-transition: width 2s; /* Safari and Chrome */
      -o-transition: width 2s; /* Opera */
      padding: 40px;
      width: 100%;
      border: 1px solid #eee;
      height: 200px;
      border-radius: 5px;
      box-shadow: 10px 10px 20px #eee;
      display: flex;
      margin-bottom: 20px;
      .emp_deatils-pic {
        width: 120px;
        height: 120px;
        border-radius: 80px;
        overflow: hidden;
        background: red;
        position: relative;
        .caption {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 0;
          line-height: 30px;
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          color: #fff;
          text-align: center;
          cursor: pointer;
        }
      }
      .emp_deatils-pic:hover .caption {
        height: 30px;
      }
      .emp_deatils-news {
        flex: 1;
        padding-left: 20px;
        .person-name {
          font-size: 30px;
          margin-top: 10px;
        }
        .person-address {
          font-size: 14px;
          margin-bottom: 10px;
        }
        .person-more {
          .note {
            position: relative;
            height: 20px;
            line-height: 20px;
            display: inline-block;
            color: #fff;
            background: #0bb27a;
            padding: 0 10px;
            margin-right: 20px;
          }
          .note::after {
            content: '';
            position: absolute;
            height: 14px;
            width: 14px;
            right: -7px;
            top: 3px;
            transform: rotate(45deg);
            display: inline-block;
            background: #0bb27a;
          }
        }
      }
    }
    .emp_deatils-head:hover {
      box-shadow: 0 0 20px #eee;
    }
    .emp_deatils-nav {
      .items-block {
        margin-top: 20px;
        .block-head {
          position: relative;
          font-size: 16px;
          line-height: 30px;
          height: 30px;
          margin: 30px auto;
          .head-fl {
            float: left;
            position: relative;
            z-index: 1;
            white-space: nowrap;
            padding-right: 20px;
            color: #1c2438;
            font-size: 14px;
            background-color: #fff;
          }
          .head-fl::before {
            content: '';
            margin-right: 8px;
            padding-left: 3px;
            width: 1px;
            top: 2px;
            height: 16px;
            background: #0bb27a;
            font-size: 12px;
          }
          .head-fr {
            float: right;
            background: #fff;
            .head-fr_change {
              position: relative;
              font-size: 14px;
              background-color: #fff;
              z-index: 2;
              color: #0bb27a;
              cursor: pointer;
              .items-icon {
                padding-left: 20px;
                padding-right: 5px;
                font-size: 18px;
                vertical-align: middle;
              }
            }
          }
          .head-fr::after {
            display: block;
            clear: both;
            content: '';
          }
        }
        .block-head:before {
          position: absolute;
          display: block;
          content: '';
          width: 100%;
          top: 50%;
          border-top: 1px solid #ebebeb;
        }
        .block-nav {
          .glyphicon-minus {
            display: none;
          }
          .glyphicon-plus {
            color: none;
          }

          .nav-text {
            padding: 20px;
            position: relative;
            .contract_change {
              position: absolute;
              top: 0;
              right: 0;
            }
            .flex-block {
              display: flex;
              flex-wrap: wrap;
              .formGroup {
                width: 50%;
                .controlLabel {
                  width: 30%;
                  display: inline-block;
                  text-align: right;
                  vertical-align: middle;
                  position: relative;
                  color: #80848f;
                  font-size: 12px;
                  font-size: 14px;
                  line-height: 32px;
                  padding: 0 24px 0 0;
                  box-sizing: border-box;
                }
                .controlInput {
                  display: inline-block;
                  width: 68%;
                  line-height: 32px;
                  font-size: 14px;
                  color: #495060;
                  font-size: 14px;
                  vertical-align: top;
                }
              }
            }
          }
          .nav-form {
            padding: 20px;
            border: 1px dashed #ccc;
            border-radius: 5px;
            .demo-Form {
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
          }
        }
      }
    }
    .el-icon-circle-plus-outline {
      font-size: 28px;
      line-height: 32px;
      vertical-align: top;
      color: #999;
      display: inline-block;
      margin-left: 6px;
    }
  }
}
</style>
