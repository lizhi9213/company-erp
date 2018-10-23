<template>
  <div class="feild-form-container">
    <div class="edit-form">
      <div v-if="!tableFeild && feildData.icon" class="edit-form-titel">
        <svg-icon :icon-class="feildData.icon" class="title-icon" />
        <span class="titel-text">{{feildData.text}}</span>
        <el-popover placement="bottom" width="200" trigger="click" :content="showData.tips">
          <svg-icon icon-class="question" class="tips-icon" slot="reference" />
        </el-popover>
      </div>
      <div v-if="tableFeild" class="edit-form-titel">
        <i class="el-icon-arrow-left" @click="tableFeild = false"></i>&nbsp;表格 · {{tFormTitle}}
      </div>
      <el-form v-if="!tableFeild" ref="editform1" :rules="ruleform1" class="field-form" :model="fieldForm" label-position="top" label-width="80px">
        <el-form-item v-show="showData.tinymce">
          <label slot="label">内容&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="可采用富文本编辑，填写者看到的内容将与您编辑的内容一致">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </label>
          <rich-editor class="flow-detail" v-model="fieldForm.content"></rich-editor>
        </el-form-item>
        <el-form-item v-if="feildData.id === 7" style="margin-bottom: 7px; color: #c1c1cd;">
          <p>
            1.最多支持15位数字。如需要用作“身份证号码”填写，请选用“单行文字”。
          </p>
          <p>2.无法填写“0”开头的数字</p>
        </el-form-item>
        <el-form-item v-if="showData.label">
          <label slot="label">标题&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="标题用于告诉填写者应该在该字段中输入什么样的内容。通常是一个词语或词组，也可以是一个问题。">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </label>
          <el-input v-model="fieldForm.label"></el-input>
        </el-form-item>
        <el-form-item v-if="showData.prompt">
          <label slot="label">提示&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="提示属性用于指定对该模块进行一些附加说明，一般用来指导填写者输入。">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </label>
          <el-input v-model="fieldForm.tips"></el-input>
        </el-form-item>
        <el-form-item v-if="showData.single" prop="default">
          <label slot="label">默认内容&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="设置默认内容后，默认值会显示在该模块的输入框中，填写者若不做修改，默认值将会作为填写者的数据提交。">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </label>
          <div v-if="feildData.id !== 3">
            <el-select v-model="showBtn" @change="selectToggle" style="width: 100%; margin-bottom: 10px;">
              <el-option label="自定义" :value="1">
              </el-option>
              <el-option label="关联已有数据" :value="2">
              </el-option>
            </el-select>
            <el-input v-if="showBtn === 1 && feildData.id === 2" v-model="fieldForm.default" placeholder="请输入默认内容"></el-input>
            <el-input v-if="showBtn === 1 && feildData.id === 5" v-model="fieldForm.default" placeholder="请输入默认内容"></el-input>
            <el-input v-if="showBtn === 1 && feildData.id === 7" v-model="fieldForm.default" placeholder="请输入默认内容"></el-input>
            <el-date-picker v-if="showBtn === 1 && feildData.id === 4" v-model="fieldForm.date" :format="fieldForm.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :value-format="fieldForm.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :type="fieldForm.precise ? 'datetime' :'date'" placeholder="选择日期" style="width: 100%;"></el-date-picker>
            <el-date-picker v-if="showBtn === 1 && feildData.id === 13" v-model="fieldForm.daterange" :format="fieldForm.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :value-format="fieldForm.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :type="fieldForm.precise ? 'datetimerange' :'daterange'" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
            <div v-if="showBtn === 2" class="relevance-btn" @click="openModel(1)">设置关联已有数据</div>
          </div>
          <el-input v-if="feildData.id === 3" type="textarea" :rows="4" placeholder="请输入内容" v-model="fieldForm.default"></el-input>
        </el-form-item>
        <el-form-item v-if="showData.multi" style="border-top: 1px solid #f5f5f7; padding-top: 10px;">
          <label slot="label">选项内容&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="为选择组件提供具体内容（可以添加“其他”选项，用作选项不符时的自定义填写），可以自定义编辑、增删、批量编辑选项。">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </label>
          <el-radio-group v-if="feildData.id === 9" class="edit-radio" v-model="fieldForm.radio">
            <el-input v-for="(item, index) in fieldForm.childs" :key="index + 2" :disabled="item.rnoly" placeholder="编辑选项名" v-model="item.label">
              <el-tooltip slot="prefix" class="item" effect="dark" content="设为默认值" placement="bottom">
                <el-radio :label="index"></el-radio>
              </el-tooltip>
              <i slot="suffix" title="删除" class="el-input__icon el-icon-delete" @click="delRadio(index)"></i>
            </el-input>
          </el-radio-group>
          <el-radio-group v-if="feildData.id === 10" class="edit-radio" v-model="fieldForm.select">
            <el-input v-for="(item, index) in fieldForm.childs" :key="index + 2" :disabled="item.rnoly" placeholder="编辑选项名" v-model="item.label">
              <el-tooltip slot="prefix" class="item" effect="dark" content="设为默认值" placement="bottom">
                <el-radio :label="index"></el-radio>
              </el-tooltip>
              <i slot="suffix" title="删除" class="el-input__icon el-icon-delete" @click="delRadio(index)"></i>
            </el-input>
          </el-radio-group>
          <el-checkbox-group v-if="feildData.id === 11" class="edit-checkbox" v-model="fieldForm.checkbox">
            <el-input v-for="(item, index) in fieldForm.childs" :key="index + 2" :disabled="item.rnoly" placeholder="编辑选项名" v-model="item.label">
              <el-tooltip slot="prefix" class="item" effect="dark" content="设为默认值" placement="bottom">
                <el-checkbox :label="index"></el-checkbox>
              </el-tooltip>
              <i slot="suffix" title="删除" class="el-input__icon el-icon-delete" @click="delRadio(index)"></i>
            </el-input>
          </el-checkbox-group>
          <div class="opera-group">
            <p class="add-btn" @click="addRadio(1)">
              <i class="el-icon-plus"></i>&nbsp;&nbsp;添加新选项</p>
            <p class="btn-group">
              <span v-if="feildData.id !== 14" @click="addRadio(2)" :style="{cursor: fieldForm.oFlag ? 'not-allowed' : 'pointer'}">添加其他</span>
              <span @click="openModel(2)">批量编辑</span>
              <span @click="openModel(3)">逻辑表单</span>
            </p>
          </div>
        </el-form-item>
        <el-form-item v-if="feildData.id === 14" style="border-top: 1px solid #f5f5f7; padding-top: 10px;">
          <label slot="label">选项内容&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="为选择组件提供具体内容（用作选项名称不符时的自定义填写），需要点击复选框右侧图片上传当前用作项图片">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
            <span style="font-size: 12px; color: #b4b4bc; margin: 0; float: right">需先上传图片</span>
          </label>
          <el-checkbox-group v-if="feildData.id === 14" class="picture-checkbox" v-model="fieldForm.selectimg">
            <el-input v-for="(item, index) in fieldForm.childs" :key="index + 2" :disabled="item.rnoly" placeholder="编辑选项名" v-model="item.label">
              <p slot="prefix">
                <el-tooltip class="item" effect="dark" content="设为默认值" placement="bottom">
                  <el-checkbox :label="index"></el-checkbox>
                </el-tooltip>
                <span class="option-pic" :style="{backgroundImage : 'url('+ item.imgurl +')'}" @click="uploadPicture(index)"></span>
              </p>
              <i slot="suffix" title="删除" class="el-input__icon el-icon-delete" @click="delPicOpt(index)"></i>
            </el-input>
          </el-checkbox-group>
          <!-- 隐藏上传组件，每次点击图片调用这个组件 -->
          <el-upload action="http://localhost:8002/flow/fileUpload" :on-success="handleSuccess" v-show="false">
            <button ref="updatepic">上传图片</button>
          </el-upload>
          <div class="opera-group">
            <p class="add-btn" @click="addPicOpt">
              <i class="el-icon-plus"></i>&nbsp;&nbsp;添加图片选项</p>
          </div>
        </el-form-item>
        <el-form-item v-if="showData.arrange" style="border-top: 1px solid #f5f5f7; padding-top: 10px;">
          <label slot="label">排布方式&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="排布方式用于横向或纵向排布选项">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </label>
          <el-radio-group v-model="fieldForm.arrange">
            <el-radio-button :label="1">横向排布</el-radio-button>
            <el-radio-button :label="2">竖向排布</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="feildData.id === 17" class="restricted">
          <p style="margin-bottom: 8px;">可选范围</p>
          <div class="personnel-list">
            <el-tooltip effect="dark" v-for="(item, index) in fieldForm.scope" :key="index + 22" :content="item.label" placement="bottom">
              <div class="list-item is-show-del" :class="item.id === '0' ? 'current' : 'user-nomal '">
                <i class="el-icon-error" @click="handleCheckedDel1(item.id)"></i>
                <svg-icon v-if="item.id === '0'" icon-class="avatar" />
                <svg-icon v-if="item.id !== '0'" icon-class="user_line" />
              </div>
            </el-tooltip>
            <el-popover placement="left-start" popper-class="personnel-poppver" width="300" trigger="click">
              <div class="personnel-select">
                <div class="head-title">
                  <el-input v-model="filterTree" placeholder="输入用户名进行搜索"></el-input>
                </div>
                <div class="body-content">
                  <el-tree :data="treeData" show-checkbox :props="defaultProps" node-key="id" :default-checked-keys="treeIdList" @node-click="handleNodeClick1" @check-change="handleCheckChange1" :filter-node-method="filterNode1" ref="treeper1">
                    <div class="personnel-tree-node" slot-scope="{ node, data }">
                      <span :class="{ 'avatar-current': data.id === '0', 'avatar-nomal': data.id !== '0' }" v-if="node.level !== 1 || data.id === '0'">
                        <svg-icon icon-class="avatar" />
                      </span>
                      <span>{{ node.label }}</span>
                    </div>
                  </el-tree>
                </div>
                <div class="footer">
                  <el-button plain @click="inviteMembers">
                    <svg-icon icon-class="g_add" />&nbsp;邀请新成员</el-button>
                </div>
              </div>
              <div slot="reference" class="list-item add-btn">
                <svg-icon icon-class="g_add" />
              </div>
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item v-if="feildData.id === 17">
          <label slot="label">默认内容&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="设置默认内容后，默认值会显示在该模块的输入框中，填写者若不做修改，默认值将会作为填写者的数据提交。">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </label>
          <el-select v-model="showBtn" @change="selectToggle" style="width: 100%; margin-bottom: 10px;">
            <el-option label="自定义" :value="1">
            </el-option>
            <el-option label="关联已有数据" :value="2">
            </el-option>
          </el-select>
          <div v-if="showBtn === 2" class="relevance-btn" @click="openModel(1)">设置关联已有数据</div>
          <div v-if="showBtn === 1" class="personnel-list">
            <el-tooltip effect="dark" v-for="(item, index) in checkedScope" :key="index + 22" :content="item.label" placement="bottom">
              <div class="list-item is-show-del" :class="item.id === '0' ? 'current' : 'user-nomal '">
                <i class="el-icon-error" @click="handleCheckedDel2(item.id)"></i>
                <svg-icon v-if="item.id === '0'" icon-class="avatar" />
                <svg-icon v-if="item.id !== '0'" icon-class="user_line" />
              </div>
            </el-tooltip>
            <el-popover placement="left-start" popper-class="personnel-poppver" width="300" trigger="click">
              <div class="personnel-select">
                <div class="head-title">
                  <el-input v-model="filterDefaut" placeholder="输入用户名进行搜索"></el-input>
                </div>
                <div class="body-content">
                  <el-tree :data="fieldForm.scope" show-checkbox :props="defaultProps" node-key="id" :default-checked-keys="scopeIdList" @node-click="handleNodeClick2" @check-change="handleCheckChange2" :filter-node-method="filterNode2" ref="treeper2">
                    <div class="personnel-tree-node" slot-scope="{ node, data }">
                      <span :class="{ 'avatar-current': data.id === '0', 'avatar-nomal': data.id !== '0' }">
                        <svg-icon icon-class="avatar" />
                      </span>
                      <span>{{ node.label }}</span>
                    </div>
                  </el-tree>
                </div>
                <div class="footer">
                  <el-button plain @click="inviteMembers">
                    <svg-icon icon-class="g_add" />&nbsp;邀请新成员</el-button>
                </div>
              </div>
              <div slot="reference" class="list-item add-btn">
                <svg-icon icon-class="g_add" />
              </div>
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item v-if="feildData.id === 18" style="border-top: 1px solid #f5f5f7; padding-top: 10px;">
          <label slot="label">关联设置&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="通过关联指定应用内的字段来调用已有数据的字段内容">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </label>
          <el-select v-model="fieldForm.linkage1" placeholder="选择关联应用" style="width: 100%; margin-bottom: 10px;">
            <el-option label="请假申请" :value="1">
            </el-option>
            <el-option label="开票申请" :value="2">
            </el-option>
            <el-option label="费用报销申请" :value="3">
            </el-option>
            <el-option label="借款申请" :value="4">
            </el-option>
            <el-option label="资产调拨" :value="5">
            </el-option>
          </el-select>
          <el-select v-model="fieldForm.linkage2" placeholder="选择关联字段" style="width: 100%;">
            <el-option label="订单编号" :value="1">
            </el-option>
            <el-option label="客户联系人" :value="2">
            </el-option>
            <el-option label="交货时间" :value="3">
            </el-option>
            <el-option label="订单金额" :value="4">
            </el-option>
            <el-option label="交货地址" :value="5">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="feildData.id === 18" class="restricted">
          <el-checkbox v-model="fieldForm.screening" @change="isShowScreening">筛选数据</el-checkbox>&nbsp;&nbsp;
          <el-popover placement="bottom" width="200" trigger="click" content="将只会关联符合筛选条件的数据">
            <svg-icon icon-class="question" class="tips-icon" slot="reference" />
          </el-popover>
          <div class="feild-length" v-if="fieldForm.screening" @click="openModel(6)">
            <p class="screening-btn">设置筛选条件</p>
          </div>
        </el-form-item>
        <el-form-item v-if="feildData.id === 18" class="restricted">
          <el-checkbox v-model="fieldForm.aggregation">聚合方式</el-checkbox>&nbsp;&nbsp;
          <el-popover placement="bottom" width="200" trigger="click" content="将已关联的数据进行聚合汇总">
            <svg-icon icon-class="question" class="tips-icon" slot="reference" />
          </el-popover>
          <el-select v-if="fieldForm.aggregation" v-model="fieldForm.aggregaway" placeholder="选择聚合方式" style="width: 100%;">
            <el-option label="求和" :value="1">
            </el-option>
            <el-option label="平均值" :value="2">
            </el-option>
            <el-option label="最大值" :value="3">
            </el-option>
            <el-option label="最小值" :value="4">
            </el-option>
            <el-option label="计数" :value="5">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="feildData.id !== 16 && feildData.id !== 15 && feildData.id !== 14" class="item-scale">
          <label slot="label">字段占比%&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="配置表单布局，可以单行多字段排布">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </label>
          <el-radio-group class="scale-group" v-model="fieldForm.scale">
            <el-radio-button :label="6">25</el-radio-button>
            <el-radio-button :label="8">33</el-radio-button>
            <el-radio-button :label="12">50</el-radio-button>
            <el-radio-button :label="24">100</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="feildData.id !== 1 && feildData.id !== 16" class="restricted">
          <el-checkbox v-model="fieldForm.required">这个是必填项</el-checkbox>&nbsp;&nbsp;
          <el-popover placement="bottom" width="200" trigger="click" content="选择必填后，填写者不填写将无法提交表单">
            <svg-icon icon-class="question" class="tips-icon" slot="reference" />
          </el-popover>
        </el-form-item>
        <el-form-item v-if="showData.repeat" class="restricted">
          <div v-if="feildData.id !== 4 && feildData.id !== 13">
            <el-checkbox v-model="fieldForm.norepeat">不允许重复值</el-checkbox>&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="选择后，填写者提交重复数据时会提示重复，无法提交。">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </div>
          <div v-if="feildData.id === 4 || feildData.id === 13">
            <el-checkbox v-model="fieldForm.norepeat">不允许时间重叠</el-checkbox>&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="选择后，填写者提交重复的时间或时间段时提示重复，无法提交。多用于“场地预定”等特殊应用场景。">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item v-if="feildData.id === 4 || feildData.id === 13" class="restricted">
          <el-checkbox v-model="fieldForm.precise" @change="switchingTime">精确到时／分／秒</el-checkbox>&nbsp;&nbsp;
          <el-popover placement="bottom" width="200" trigger="click" content="日期模块是否精确到时／分／秒">
            <svg-icon icon-class="question" class="tips-icon" slot="reference" />
          </el-popover>
        </el-form-item>
        <el-form-item v-if="feildData.id === 7" class="restricted">
          <el-checkbox v-model="fieldForm.decimals">允许小数</el-checkbox>&nbsp;&nbsp;
          <el-popover placement="bottom" width="200" trigger="click" content="选择后，填写者填写时可以输入带有小数点的数字，否则只能输入整数。">
            <svg-icon icon-class="question" class="tips-icon" slot="reference" />
          </el-popover>
        </el-form-item>
        <el-form-item v-if="showData.limit" class="restricted">
          <span v-if="feildData.id === 2 || feildData.id === 3">
            <el-checkbox v-model="fieldForm.astrict">限制字数</el-checkbox>&nbsp;&nbsp;
          </span>
          <span v-if="feildData.id === 11 || feildData.id === 14">
            <el-checkbox v-model="fieldForm.astrict">限制选项</el-checkbox>&nbsp;&nbsp;
          </span>
          <el-popover placement="bottom" width="200" trigger="click" :content="feildData.id === 11 ? '限制选项：控制填写人选择时最少选几项，最多选几项。' : '限制字数：控制填写人选择时最少填写多长，最多填写多长。'">
            <svg-icon icon-class="question" class="tips-icon" slot="reference" />
          </el-popover>&nbsp;&nbsp;&nbsp;
          <div v-if="fieldForm.astrict" class="feild-length">
            <el-col :span="11">
              <el-input type="number" v-model="fieldForm.minimum"></el-input>
            </el-col>
            <el-col class="line" :span="2" style="line-height: 32px;">~</el-col>
            <el-col :span="11">
              <el-input type="number" v-model="fieldForm.maximum"></el-input>
            </el-col>
          </div>
        </el-form-item>
        <el-form-item v-if="showData.share" class="restricted">
          <el-checkbox v-model="fieldForm.share" @change="isShowShare">配置选项份额</el-checkbox>&nbsp;&nbsp;
          <el-popover placement="bottom" width="200" trigger="click" content="设定每个选项的可选次数，并且可以自定义选项超出可选次数后的显示文案">
            <svg-icon icon-class="question" class="tips-icon" slot="reference" />
          </el-popover>&nbsp;&nbsp;&nbsp;
          <span class="share-bth" v-show="fieldForm.share" @click="openModel(4)">管理选项份额</span>
        </el-form-item>
        <el-form-item v-if="feildData.id === 12" class="restricted">
          <el-checkbox v-model="fieldForm.limitType" @change="v => { editType(v, 'limit')}">限制文件类型</el-checkbox>&nbsp;&nbsp;
          <el-popover placement="bottom" width="200" trigger="click" content="选择后，可以设定文件类型范围，填写者上传除规定类型外的文件时会提示文件类型错误，无法上传">
            <svg-icon icon-class="question" class="tips-icon" slot="reference" />
          </el-popover>
          <ul v-if="fieldForm.limitType" class="file-type-list">
            <li class="list-item" v-for="(item, index) in fileTypeList" :key="index + 24">
              <p class="type-title">
                <el-checkbox v-model="item.checked" @change="v => { editType(v, item.type)}">{{item.label}}</el-checkbox>
                <span v-show="item.checked && item.type === 'custom'" @click="openModel(5)" class="edit-btn">编辑</span>
              </p>
              <p class="type-content" v-if="item.checked && item.type !== 'custom'">{{item.label}}包括以下类型：{{item.list}}。如限制不满足需求，建议选择［自定义］设置文件上传类型</p>
              <p class="type-content" v-if="item.checked && item.type === 'custom'">{{item.label}}类型如下：{{item.list}}。</p>
            </li>
          </ul>
        </el-form-item>
        <el-form-item v-if="feildData.id === 12" class="limit-type">
          <el-checkbox v-model="fieldForm.limitSize">限制文件大小</el-checkbox>&nbsp;&nbsp;
          <el-popover placement="bottom" width="200" trigger="click" content="选择后，可以设定文件大小范围，填写者上传超过规定大小的文件时会提示文件大小超过限制，无法上传">
            <svg-icon icon-class="question" class="tips-icon" slot="reference" />
          </el-popover>
          <div class="limit-max-size" v-if="fieldForm.limitSize">最大&nbsp;
            <el-input v-model="fieldForm.maxSize" type="number"></el-input>&nbsp;&nbsp;MB</div>
        </el-form-item>
        <el-form-item v-if="feildData.id === 16" class="restricted">
          <label slot="label">表格字段
            <span style="color: #b0b0b9; font-size: 12px; float: right;">点击字段进行编辑</span>
          </label>
          <ul class="table-edit-list">
            <li class="list-item" v-for="(item, index) in fieldForm.formdatas" :key="index + 10">
              <div class="item-content">
                <svg-icon :icon-class="item.icon" />
                <span>{{item.label}}</span>
              </div>
              <div class="item-opera">
                <i class="el-icon-edit" title="编辑字段" @click="editTableFeild(index, item.name)"></i>
                <i class="el-icon-delete" title="删除" @click="delTableFeild(index)"></i>
              </div>
            </li>
            <li class="add-feild">
              <el-popover placement="bottom" width="400" trigger="click">
                <div class="type-list">
                  <div @click="selectFeildType('dtext', '单行文字')">单行文字</div>
                  <div @click="selectFeildType('date', '日期')">日期</div>
                  <div @click="selectFeildType('number', '数字')">数字</div>
                  <div @click="selectFeildType('uniterming', '单项选择')">单项选择</div>
                  <div @click="selectFeildType('multiple', '多项选择')">多项选择</div>
                </div>
                <div slot="reference" class="add-btn">添加字段</div>
              </el-popover>
            </li>
          </ul>
        </el-form-item>
      </el-form>
      <!-- 表格字段编辑表单 -->
      <el-form v-if="tableFeild" ref="editform2" :rules="ruleform1" class="field-form" :model="tableField" label-position="top" label-width="80px">
        <el-form-item v-if="tableField.type === 'number'" style="margin-bottom: 7px; color: #c1c1cd;">
          <p>
            1.最多支持15位数字。如需要用作“身份证号码”填写，请选用“单行文字”。
          </p>
          <p>2.无法填写“0”开头的数字</p>
        </el-form-item>
        <el-form-item>
          <label slot="label">标题&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="标题用于告诉填写者应该在该字段中输入什么样的内容。通常是一个词语或词组，也可以是一个问题。">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </label>
          <el-input v-model="tableField.label"></el-input>
        </el-form-item>
        <el-form-item v-if="tableField.type !== 'uniterming' && tableField.type !== 'multiple'" prop="default">
          <label slot="label">默认内容&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="设置默认内容后，默认值会显示在该模块的输入框中，填写者若不做修改，默认值将会作为填写者的数据提交。">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </label>
          <el-select v-model="showBtn" @change="selectToggle" style="width: 100%; margin-bottom: 10px;">
            <el-option label="自定义" :value="1">
            </el-option>
            <el-option label="关联已有数据" :value="2">
            </el-option>
          </el-select>
          <el-input v-if="showBtn === 1 && tableField.type === 'dtext'" v-model="tableField.default" placeholder="请输入默认内容"></el-input>
          <el-input v-if="showBtn === 1 && tableField.type === 'number'" v-model="tableField.default" placeholder="请输入默认内容"></el-input>
          <el-date-picker v-if="showBtn === 1 && tableField.type === 'date'" v-model="tableField.default" :format="tableField.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :value-format="tableField.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :type="tableField.precise ? 'datetime' :'date'" placeholder="选择日期" style="width: 100%;"></el-date-picker>
          <div v-if="showBtn === 2" class="relevance-btn" @click="openModel(1)">设置关联已有数据</div>
        </el-form-item>
        <el-form-item v-if="tableField.type === 'uniterming' || tableField.type === 'multiple'" style="border-top: 1px solid #f5f5f7; padding-top: 10px;">
          <label slot="label">选项内容&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="为选择组件提供具体内容（可以添加“其他”选项，用作选项不符时的自定义填写），可以自定义编辑、增删、批量编辑选项。">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </label>
          <el-radio-group v-if="tableField.type === 'uniterming'" class="edit-radio" v-model="tableField.default">
            <el-input v-for="(item, index) in tableField.option" :key="index + 2" :disabled="item.rnoly" placeholder="编辑选项名" v-model="item.label">
              <el-tooltip slot="prefix" class="item" effect="dark" content="设为默认值" placement="bottom">
                <el-radio :label="index"></el-radio>
              </el-tooltip>
              <i slot="suffix" title="删除" class="el-input__icon el-icon-delete" @click="delTableRadio(index)"></i>
            </el-input>
          </el-radio-group>
          <el-checkbox-group v-if="tableField.type === 'multiple'" class="edit-checkbox" v-model="tableField.default">
            <el-input v-for="(item, index) in tableField.option" :key="index + 2" :disabled="item.rnoly" :placeholder="'编辑选项名' + index" v-model="item.label">
              <el-tooltip slot="prefix" class="item" effect="dark" content="设为默认值" placement="bottom">
                <el-checkbox :label="index"></el-checkbox>
              </el-tooltip>
              <i slot="suffix" title="删除" class="el-input__icon el-icon-delete" @click="delTableRadio(index)"></i>
            </el-input>
          </el-checkbox-group>
          <div class="opera-group">
            <p class="add-btn" @click="addTableOpt(1)">
              <i class="el-icon-plus"></i>&nbsp;&nbsp;添加新选项</p>
            <p class="btn-group">
              <span @click="addTableOpt(2)" :style="{cursor: tableField.oFlag ? 'not-allowed' : 'pointer'}">添加其他</span>
              <span @click="openModel(2)">批量编辑</span>
            </p>
          </div>
        </el-form-item>
        <el-form-item class="restricted">
          <el-checkbox v-model="tableField.required">这个是必填项</el-checkbox>&nbsp;&nbsp;
          <el-popover placement="bottom" width="200" trigger="click" content="选择必填后，填写者不填写将无法提交表单">
            <svg-icon icon-class="question" class="tips-icon" slot="reference" />
          </el-popover>
        </el-form-item>
        <el-form-item v-if="tableField.type !== 'uniterming' && tableField.type !== 'multiple'" class="restricted">
          <div v-if="tableField.type !== 'date'">
            <el-checkbox v-model="tableField.norepeat">不允许重复值</el-checkbox>&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="选择后，填写者提交重复数据时会提示重复，无法提交。">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </div>
          <div v-if="tableField.type === 'date'">
            <el-checkbox v-model="tableField.norepeat">不允许时间重叠</el-checkbox>&nbsp;&nbsp;
            <el-popover placement="bottom" width="200" trigger="click" content="选择后，填写者提交重复的时间或时间段时提示重复，无法提交。多用于“场地预定”等特殊应用场景。">
              <svg-icon icon-class="question" class="tips-icon" slot="reference" />
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item v-if="tableField.type === 'number'" class="restricted">
          <el-checkbox v-model="tableField.decimals">允许小数</el-checkbox>&nbsp;&nbsp;
          <el-popover placement="bottom" width="200" trigger="click" content="选择后，填写者填写时可以输入带有小数点的数字，否则只能输入整数。">
            <svg-icon icon-class="question" class="tips-icon" slot="reference" />
          </el-popover>
        </el-form-item>
        <el-form-item v-if="tableField.type === 'date'" class="restricted">
          <el-checkbox v-model="tableField.precise" @change="switchingTime">精确到时／分／秒</el-checkbox>&nbsp;&nbsp;
          <el-popover placement="bottom" width="200" trigger="click" content="日期模块是否精确到时／分／秒">
            <svg-icon icon-class="question" class="tips-icon" slot="reference" />
          </el-popover>
        </el-form-item>
        <el-form-item v-if="tableField.type === 'dtext'" class="restricted">
          <el-checkbox v-model="tableField.astrict">限制字数</el-checkbox>&nbsp;&nbsp;
          <el-popover placement="bottom" width="200" trigger="click" content="限制字数：控制填写人选择时最少填写多长，最多填写多长。">
            <svg-icon icon-class="question" class="tips-icon" slot="reference" />
          </el-popover>&nbsp;&nbsp;&nbsp;
          <div v-if="tableField.astrict" class="feild-length">
            <el-col :span="11">
              <el-input type="number" v-model="tableField.minimum"></el-input>
            </el-col>
            <el-col class="line" :span="2" style="line-height: 32px;">~</el-col>
            <el-col :span="11">
              <el-input type="number" v-model="tableField.maximum"></el-input>
            </el-col>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!-- 关联数据批量编辑等弹出层 -->
    <Modal v-model="paraModal" class="flow-modal" :class="{'table-modal': modalType === 4, 'padding-none': modalType === 6, 'invite-members' : modalType === 7}" :width="500">
      <h3 slot="header">{{modalTitle}}</h3>
      <p v-if="modalType === 1 || modalType === 2" class="subtitle">
        {{ modalType === 1 ? '通过关联已有数据可以直接调用其他应用已经录入的数据' : '每行内容对应一个选项' }}
      </p>
      <p v-if="modalType === 1 || modalType === 2" class="subtitle">
        {{ modalType === 1 ? '通过关联已有数据可以直接调用其他应用已经录入的数据' : '每行内容对应一个选项' }}
      </p>
      <p v-if="modalType === 5" class="subtitle">请输入自定义类型，每行内容对应一个自定义文件类型</p>
      <div v-if="modalType === 3" class="subtitle-thead">
        选择选项后，触发显示位于该单选字段之后的其他字段。
        <p class="thead">
          <span>选项内容</span>
          <span>显示字段</span>
        </p>
      </div>
      <div v-if="modalType === 4" class="table-head">
        <p>份额数值表示每个选项可以被选择的次数，默认不限</p>
        <div class="header-th">
          <span>选项内容</span>
          <span>已被选择</span>
          <span>剩余可选</span>
          <span>份额</span>
        </div>
      </div>
      <el-form v-if="modalType === 1" ref="releform" class="relevancy-form" :model="relevancy" label-position="top" label-width="80px" style="margin-top: 18px;">
        <el-form-item label="关联应用">
          <el-select v-model="relevancy.name" placeholder="选择应用" style="width: 100%; margin-bottom: 10px;">
            <el-option label="请假申请" :value="1">
            </el-option>
            <el-option label="开票申请" :value="2">
            </el-option>
            <el-option label="费用报销申请" :value="3">
            </el-option>
            <el-option label="借款申请" :value="4">
            </el-option>
            <el-option label="资产调拨" :value="5">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联设置">
          <el-col :span="8" style="margin-bottom: 10px;">
            <el-select v-model="relevancy.name" placeholder="当前应用字段" style="width: 100%;">
              <el-option label="描述文字" :value="1">
              </el-option>
              <el-option label="单行文字" :value="2">
              </el-option>
              <el-option label="邮箱" :value="3">
              </el-option>
              <el-option label="手机" :value="4">
              </el-option>
              <el-option label="附件上传" :value="5">
              </el-option>
            </el-select>
          </el-col>
          <el-col class="line" :span="4" style="text-indent: 10px; margin-bottom: 10px; padding: 0px;">的值等于</el-col>
          <el-col :span="8" style="margin-bottom: 10px;">
            <el-select v-model="relevancy.name" placeholder="关联应用字段" style="width: 100%;">
              <el-option label="描述文字" :value="1">
              </el-option>
              <el-option label="单行文字" :value="2">
              </el-option>
              <el-option label="邮箱" :value="3">
              </el-option>
              <el-option label="手机" :value="4">
              </el-option>
              <el-option label="附件上传" :value="5">
              </el-option>
            </el-select>
          </el-col>
          <el-col class="line" :span="4" style="text-indent: 10px; margin-bottom: 10px;">的值时</el-col>
          <el-col :span="8">
            <el-input :value="feildData.text" disabled></el-input>
          </el-col>
          <el-col class="line" :span="4" style="text-indent: 10px; padding: 0px;">联动显示</el-col>
          <el-col :span="8">
            <el-select v-model="relevancy.name" placeholder="关联应用字段" style="width: 100%;">
              <el-option label="描述文字" :value="1">
              </el-option>
              <el-option label="单行文字" :value="2">
              </el-option>
              <el-option label="邮箱" :value="3">
              </el-option>
              <el-option label="手机" :value="4">
              </el-option>
              <el-option label="附件上传" :value="5">
              </el-option>
            </el-select>
          </el-col>
          <el-col class="line" :span="4" style="text-indent: 10px;">的值</el-col>
        </el-form-item>
      </el-form>
      <el-input v-if="modalType === 2 || modalType === 5" type="textarea" :rows="6" placeholder="请输入内容" class="modal-textarea" v-model="bulkEdit">
      </el-input>
      <ul v-if="modalType === 3" class="redio-tbody">
        <li class="tbody-item" v-for="(item, index) in fieldForm.childs" :key="index">
          <span>{{item.label}}</span>
          <span>
            <el-select :value="1" placeholder="请选择">
              <el-option label="描述文字" :value="1"></el-option>
              <el-option label="单行文字" :value="2"></el-option>
              <el-option label="邮箱" :value="3"></el-option>
              <el-option label="手机" :value="4"></el-option>
              <el-option label="附件上传" :value="5"></el-option>
            </el-select>
          </span>
        </li>
      </ul>
      <ul v-if="modalType === 4" class="table-body">
        <li class="table-body-item" v-for="(item, index) in fieldForm.childs" :key="index">
          <span>{{item.label}}</span>
          <span>0</span>
          <span>{{item.frequency}}</span>
          <span>
            <el-input v-model="item.frequency" type="number"></el-input>
          </span>
        </li>
      </ul>
      <el-tabs v-if="modalType === 6" class="matching-filter" value="first">
        <el-tab-pane label="匹配筛选" name="first">
          <el-row :gutter="14" style="padding: 15px;">
            <el-col :span="7">
              <el-select :value="1" placeholder="请选择">
                <el-option label="描述文字" :value="1"></el-option>
                <el-option label="单行文字" :value="2"></el-option>
                <el-option label="邮箱" :value="3"></el-option>
                <el-option label="手机" :value="4"></el-option>
                <el-option label="附件上传" :value="5"></el-option>
              </el-select>
            </el-col>
            <el-col :span="4" style="line-height: 32px;">的值等于</el-col>
            <el-col :span="11">
              <el-select :value="1" placeholder="关联应用字段">
                <el-option label="描述文字" :value="1"></el-option>
                <el-option label="单行文字" :value="2"></el-option>
                <el-option label="邮箱" :value="3"></el-option>
                <el-option label="手机" :value="4"></el-option>
                <el-option label="附件上传" :value="5"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2" style="line-height: 32px;">
              <i class="el-icon-delete" style="font-size: 14px;"></i>
            </el-col>
          </el-row>
          <p class="add-line">
            <i class="el-icon-circle-plus-outline "></i>添加新行</p>
        </el-tab-pane>
        <el-tab-pane label="精确筛选" name="second">
          <div class="accurate">
            <el-row :gutter="12">
              <el-col :span="1" style="line-height: 32px;">且</el-col>
              <el-col :span="6">
                <el-select :value="1" placeholder="请选择">
                  <el-option label="编号" :value="1"></el-option>
                  <el-option label="当前流程状态" :value="2"></el-option>
                  <el-option label="分类" :value="3"></el-option>
                  <el-option label="申请人" :value="4"></el-option>
                  <el-option label="更新时间" :value="5"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-select :value="1" placeholder="请选择">
                  <el-option label="等于" :value="1"></el-option>
                  <el-option label="不等于" :value="2"></el-option>
                  <el-option label="包含" :value="3"></el-option>
                  <el-option label="不包含" :value="4"></el-option>
                </el-select>
              </el-col>
              <el-col :span="9">
                <el-input value="" placeholder="请输入内容"></el-input>
              </el-col>
              <el-col :span="2" style="line-height: 32px;">
                <i class="el-icon-delete" style="font-size: 14px;"></i>
              </el-col>
            </el-row>
            <p class="add-and">
              <span>
                <i class="el-icon-circle-plus-outline "></i>添加且条件</span>
            </p>
          </div>
          <p class="add-maybe">
            <span>添加“或”条件</span>
          </p>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-if="modalType === 7" class="matching-filter" value="first">
        <el-tab-pane label="搜索邀请" name="first">
          <div class="invitation-item">
            <div class="search-box">
              <el-input value="" placeholder="请输入关键字查找成员" prefix-icon="el-icon-search"></el-input>
            </div>
            <div class="invitation-title">待接受邀请成员&nbsp;
              <el-popover placement="bottom" width="200" trigger="click" content="需邮箱确认后才能成为工作区成员">
                <svg-icon icon-class="question" class="tips-icon" slot="reference" />
              </el-popover>
              <el-button plain style="float: right; margin-top: 11px;">全部再次邀请</el-button>
            </div>
            <ul class="invitation-list">
              <li class="list-item">
                <span class="user-nomal">
                  <svg-icon icon-class="user_line" />
                </span>
                冉现飞 / 15523895623
                <el-button plain size="mini" style="float: right; margin-top: 16px;">再次邀请</el-button>
              </li>
              <li class="list-item">
                <span class="user-nomal">
                  <svg-icon icon-class="user_line" />
                </span>
                刘亚 / 15523895623
                <el-button v-if="false" plain size="mini" style="float: right; margin-top: 16px;">再次邀请</el-button>
                <span class="invitation-sent" v-if="true">邀请已发送
                  <el-popover placement="bottom" width="200" trigger="click" content="24小时后可再次邀请">
                    <svg-icon icon-class="question" class="tips-icon" slot="reference" />
                  </el-popover>
                </span>
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane label="批量邀请" name="second">
          <div class="invitation-item">
            <div class="invitation-tips">
              <p>1. 按照格式“ 工作邮箱”或“ 工作邮箱,姓名”(请使用英文逗号)输入即可批量邀请工作区成员。通过换行分隔不同的成员；</p>
              <p>2. 其中“工作邮箱”将成为该成员的用户名，“姓名”将成为其在工作区内的昵称。</p>
            </div>
            <div class="batch-invite">
              <el-input type="textarea" :rows="8" resize="none" placeholder="请输入内容" value="">
              </el-input>
              <div class="batch-btn">
                <div class="btn-bgc">
                  <el-button type="primary" style="float: right; margin-top: 9px; margin-right: 10px;" plain>发送邀请</el-button>
                </div>
              </div>
            </div>
            <div class="invitation-title">待接受邀请成员&nbsp;
              <el-popover placement="bottom" width="200" trigger="click" content="需邮箱确认后才能成为工作区成员">
                <svg-icon icon-class="question" class="tips-icon" slot="reference" />
              </el-popover>
              <el-button plain style="float: right; margin-top: 11px;">全部再次邀请</el-button>
            </div>
            <ul class="invitation-list">
              <li class="list-item">
                <span class="user-nomal">
                  <svg-icon icon-class="user_line" />
                </span>
                冉现飞 / 15523895623
                <el-button plain size="mini" style="float: right; margin-top: 16px;">再次邀请</el-button>
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane label="链接邀请" name="third">
          <div class="invitation-item">
            <div class="link-code">
              <p>使用微信“扫一扫”后<br/>注册登录即可加入您的工作区</p>
              <img src="/src/images/xier_weixin_code.png">
            </div>
            <div class="link-copy">
              <p class="title">分享链接，通过链接登录注册即可加入工作区</p>
              <p class="link-box">
                <span class="link-input">http://www.xierxinxi.cn/</span>
                <el-button type="primary">复制链接</el-button>
              </p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <el-button @click="paraModal = false">取消</el-button>
        <el-button type="primary" @click="modalSubmit">确定</el-button>
      </div>
    </Modal>
  </div>
</template>

<script>
import richEditor from '@/views/components/RichEditor'
const validateNumber1 = (rule, value, callback) => {
  // 验证允许小数
  const patrn = /^\d+(\.\d+)?$/
  const patrn1 = /^-(\d+(\.\d+)?)$/
  if (value !== '') {
    if (!patrn.exec(value) && !patrn1.exec(value)) {
      callback(new Error('请输入正确的数字！'))
    } else {
      callback()
    }
  }
}
const validateNumber2 = (rule, value, callback) => {
  // 验证允许小数
  const patrn2 = /^\d+$/
  const patrn3 = /^((-\d+)|(0+))$/
  if (value !== '') {
    if (!patrn2.exec(value) && !patrn3.exec(value)) {
      callback(new Error('请输入正确的整数！'))
    } else {
      callback()
    }
  }
}
export default {
  name: 'FeildForm',
  components: {
    richEditor
  },
  watch: {
    feildData(val) {
      // console.log(val)
      this.showData = this.showList[val.name]
      if (val.id === 7) {
        if (this.fieldForm.decimals) {
          this.ruleform1 = {
            default: [{ validator: validateNumber1, trigger: 'blur' }]
          }
        } else {
          this.ruleform1 = {
            default: [{ validator: validateNumber2, trigger: 'blur' }]
          }
        }
      } else {
        this.ruleform1 = {}
      }
    },
    currently(val) {
      // console.log(val)
      this.tableFeild = false
      this.fieldForm = {}
      if (val.length !== 0) {
        const a = val[0]
        const b = val[1]
        this.fieldForm = this.viewList[a][b]
      }
      if (this.fieldForm.content !== undefined) {
        if (this.$refs.detail) {
          this.$refs.detail.setContent(this.fieldForm.content)
        }
      }
    },
    filterTree(val) {
      this.$refs.treeper1.filter(val)
    },
    filterDefaut(val) {
      this.$refs.treeper2.filter(val)
    },
    tableField: {
      handler: function(val, oldVal) {
        const _this = this
        this.$store.commit('updateTable', '')
        if (this.clearStatus) {
          this.$store.commit('formOnChange', false)
          this.$store.commit('setClearStatus', false)
        } else {
          this.$store.commit('formOnChange', true)
        }
        // console.log(val)
        // 验证规则
        if (val.type === 'number') {
          if (val.decimals) {
            _this.ruleform1 = {
              default: [{ validator: validateNumber1, trigger: 'blur' }]
            }
          } else {
            _this.ruleform1 = {
              default: [{ validator: validateNumber2, trigger: 'blur' }]
            }
          }
        } else {
          _this.ruleform1 = {}
        }
      },
      deep: true
    },
    fieldForm: {
      handler: function(val, oldVal) {
        if (this.clearStatus) {
          this.$store.commit('formOnChange', false)
          this.$store.commit('setClearStatus', false)
        } else {
          this.$store.commit('formOnChange', true)
        }
        // 验证规则
        if (this.feildData.id === 7) {
          if (this.fieldForm.decimals) {
            this.ruleform1 = {
              default: [{ validator: validateNumber1, trigger: 'blur' }]
            }
          } else {
            this.ruleform1 = {
              default: [{ validator: validateNumber2, trigger: 'blur' }]
            }
          }
        } else {
          this.ruleform1 = {}
        }
      },
      deep: true
    }
  },
  data() {
    // 数据data在这里
    return {
      ruleform1: {}, // 表单验证规则
      showData: {}, // 当前允许显示的数据
      showList: {
        podpis: {
          tips: '描述文字可以为表单添加段落说明信息，字体样式可以自定义设置。',
          tinymce: true
        },
        dtext: {
          tips: '单行文本输入框，需要填写者在输入框内根据标题填写相应的内容。',
          label: true,
          prompt: true,
          single: true,
          repeat: true,
          limit: true
        },
        mtext: {
          tips: '多行文本输入框，需要填写者在输入框内根据标题填写相应的内容。',
          label: true,
          prompt: true,
          single: true,
          repeat: true,
          limit: true
        },
        date: {
          tips: '时间选择组件，需要填写者选择具体日期时间。',
          label: true,
          prompt: true,
          single: true,
          repeat: true
        },
        email: {
          tips: '单行文本输入框，规定填写者输入内容为邮箱，带有字段校验',
          label: true,
          prompt: true,
          single: true,
          repeat: true
        },
        phone: {
          tips: '单行文本输入框，规定填写者输入内容为手机，带有字段校验',
          label: true,
          prompt: true,
          single: true,
          repeat: true
        },
        number: {
          tips: '单行文本输入框，规定填写者输入内容为数字，带有字段校验',
          label: true,
          prompt: true,
          single: true,
          repeat: true
        },
        link: {
          tips: '单行文本输入框，规定填写者输入内容为链接，带有字段校验',
          label: true,
          prompt: true,
          single: true, // 单项
          repeat: true
        },
        uniterming: {
          tips: '选择组件，可以自定义编辑和增删选项，填写者需要进行单项选择。',
          label: true,
          prompt: true,
          multi: true, // 多项
          arrange: true,
          share: true
        },
        dropdown: {
          tips:
            '选择组件，可以自定义编辑和增删选项，填写者通过下拉框进行单项选择。',
          label: true,
          prompt: true,
          multi: true,
          share: true
        },
        multiple: {
          tips:
            '选择组件，可以自定义编辑和增删选项，还可以设置填写者选择的数量规则（最多选几个、最少选几个）',
          label: true,
          prompt: true,
          multi: true,
          arrange: true,
          share: true,
          limit: true
        },
        fileupload: {
          tips:
            '上传文件组件，可以自定义上传说明，指导填写者上传文件、图片等，可添加多个附件。',
          label: true,
          prompt: true
        },
        timerange: {
          tips: '时间选择组件，需要填写者选择起止日期与时刻。',
          label: true,
          prompt: true,
          single: true,
          repeat: true
        },
        picture: {
          tips: '选择组件，可为选项添加图片，默认为多选形式。',
          label: true,
          prompt: true,
          limit: true,
          share: true
        },
        richtext: {
          tips:
            '升级版的文本输入框，拥有格式设置，比如字体和段落设置、页面设置等，使得文本输入更加个性化。',
          label: true,
          prompt: true
        },
        table: {
          tips:
            '创建自定义列字段，支持其他字段的嵌入，填写者可通过添加行添加多条数据。',
          label: true,
          prompt: true
        },
        members: {
          tips:
            '通过设定可选成员（通讯录成员）的最大范围，提供成员的选择。结合“动态负责人”，可用于“指派任务”等场景。',
          label: true,
          prompt: true
        },
        associated: {
          tips:
            '通过下拉选择的形式加载关联应用（其他应用）中某个字段的历史数据，方便历史数据的直接调用。',
          label: true,
          prompt: true
        }
      }, // 允许显示数据列表集合
      fieldForm: {}, // 当前编辑字段表单数据
      formBar: [
        'bold italic underline strikethrough alignleft aligncenter alignright'
      ], // 富文本配置
      showBtn: 1, // 默认值下拉切换
      modalTitle: '关联已有数据', // 弹出modal标题
      modalType: 1, // modal中显示的类型
      paraModal: false, // modal弹出层控制
      bulkEdit: '', // 批量编辑textare数据
      relevancy: {
        name: '' // 关联应用名称
      }, // 关联数据弹出form数据
      fileTypeList: [
        {
          checked: false,
          label: '文档',
          type: 'document',
          list:
            'txt、pdf、doc、docx、xls、xlsx、cvs、xml、ppt、pptx、wps、htm、html、rtf、hlp'
        },
        {
          checked: false,
          label: '图片',
          type: 'picture',
          list: 'jpg、jpeg、png、gif、bmp、psd、tif'
        },
        {
          checked: false,
          label: '音频',
          type: 'audio',
          list: 'mp3、flac、ape、wma、wav、aac、m4a、au、ram、mmf、aif'
        },
        {
          checked: false,
          label: '视频',
          type: 'video',
          list: 'mkv、mp4、avi、swf、wmv、rmvb、mov、mpg'
        },
        {
          checked: false,
          label: '压缩包',
          type: 'package',
          list: 'rar、zip、7z、gz、arj、z'
        },
        {
          checked: false,
          type: 'custom',
          label: '自定义',
          list: ''
        }
      ], // 上传文件类型
      listText: '', // 显示在预览的限制类型
      treeData: [
        {
          label: '当前用户',
          id: '0'
        },
        {
          label: '全部成员',
          id: '-1',
          children: [
            {
              label: '成员1',
              id: 'a1'
            },
            {
              label: '成员2',
              id: 'a2'
            },
            {
              label: '成员3',
              id: 'a3'
            },
            {
              label: '成员4',
              id: 'a4'
            }
          ]
        },
        {
          label: '未分配成员',
          id: '1',
          children: [
            {
              label: '成员1',
              id: 'b1'
            },
            {
              label: '成员2',
              id: 'b2'
            }
          ]
        }
      ], // 可选范围树形数据
      defaultProps: {
        children: 'children',
        label: 'label'
      }, // 可选范围/选择默认值树形字段定义
      filterTree: '', // 可选范围树形过滤关键字
      treeIdList: [], // 可选范围树形选择id集合
      filterDefaut: '', // 选择默认值树形过滤关键字
      scopeIdList: [], // 选择默认值树形选择id集合
      checkedScope: [], // 选择的默认数据
      tableFeild: false, // 是否现在table表格编辑字段表单
      tableField: {}, // 单条表格字段的表单编辑数据
      tFormTitle: '单行文字', // 单条表格字段的表单标题
      uploadIndex: -1 // 选择上传的图片选项序号
    }
  },
  computed: {
    viewList() {
      return this.$store.state.workflow.viewList
    },
    currently() {
      return this.$store.state.workflow.currently
    },
    feildData() {
      return this.$store.state.workflow.feildData
    },
    clearStatus() {
      return this.$store.state.workflow.clearStatus
    }
  },
  methods: {
    selectToggle(val) {
      // 如果是关联数据则打开modal
      if (val === 2) {
        // 设置关联已有数据
        this.modalTitle = '关联已有数据'
        this.modalType = 1
        this.paraModal = true
      }
    },
    isShowShare(val) {
      if (val) {
        // 打开配置弹出
        this.modalTitle = '配置选项份额'
        this.modalType = 4
        this.paraModal = true
      }
    },
    isShowScreening(val) {
      if (val) {
        // 打开配置弹出
        this.modalTitle = '筛选数据'
        this.modalType = 6
        this.paraModal = true
      }
    },
    switchingTime(val) {
      // 切换时间类型
      if (val && this.fieldForm.date && this.fieldForm.date !== '') {
        this.fieldForm.date = this.fieldForm.date + ' 08:00:00'
        // console.log(this.fieldForm.date)
      }
      // 时间范围类型切换
      if (
        val &&
        this.fieldForm.daterange &&
        this.fieldForm.daterange.length !== 0
      ) {
        this.fieldForm.daterange[0] = this.fieldForm.daterange[0] + ' 08:00:00'
        this.fieldForm.daterange[1] = this.fieldForm.daterange[1] + ' 08:00:00'
        // console.log(this.fieldForm.date)
      }
      // table表格时间类型切换
      if (this.tableField.type && this.tableField.type === 'date') {
        this.tableField.default = this.tableField.default + ' 08:00:00'
      }
    },
    addRadio(type) {
      // 新增单选/多选子项
      const nowRadio = {
        label: '未命名',
        rnoly: false,
        frequency: 0
      }
      if (this.fieldForm.oFlag && type === 2) {
        return
      }
      if (type === 1 && this.fieldForm.oFlag) {
        this.fieldForm.childs.splice(
          this.fieldForm.childs.length - 1,
          0,
          nowRadio
        )
      } else if (type === 1) {
        this.fieldForm.childs.push(nowRadio)
      } else if (type === 2) {
        nowRadio.label = '其他'
        nowRadio.rnoly = true
        nowRadio.frequency = 0 // 次数
        this.fieldForm.oFlag = true
        this.fieldForm.childs.push(nowRadio)
      }
    },
    delRadio(index) {
      // 删除单项/多选子项
      if (this.fieldForm.childs.length - 1 === index) {
        this.fieldForm.oFlag = false
      }
      this.fieldForm.childs.splice(index, 1)
    },
    addTableOpt(type) {
      // 新增单选/多选子项
      const nowRadio = {
        label: '未命名',
        rnoly: false
      }
      if (this.tableField.oFlag && type === 2) {
        return
      }
      if (type === 1 && this.fieldForm.oFlag) {
        this.tableField.option.splice(
          this.tableField.option.length - 1,
          0,
          nowRadio
        )
      } else if (type === 1) {
        this.tableField.option.push(nowRadio)
      } else if (type === 2) {
        nowRadio.label = '其他'
        nowRadio.rnoly = true
        this.tableField.oFlag = true
        this.tableField.option.push(nowRadio)
      }
    },
    delTableRadio(index) {
      if (this.tableField.option.length - 1 === index) {
        this.tableField.oFlag = false
      }
      this.fieldForm.option.splice(index, 1)
    },
    editType(s, t) {
      // 编辑自定义上传类型
      console.log(s)
      console.log(t)
      if (!s && t === 'limit') {
        // 不限制文件类型
        this.fileTypeList = this.fileTypeList.map(v => {
          const nowitem = v
          nowitem.checked = false
          return nowitem
        })
        this.fieldForm.fileType = []
      }
      if (s && t === 'custom') {
        // 当前选中了自定义上传类型
        // 先处理内容
        const content = this.fileTypeList[this.fileTypeList.length - 1].list
        if (content === '') {
          // 等于空
          this.bulkEdit = ''
        } else {
          const reg = new RegExp('、', 'g')
          this.bulkEdit = content.replace(reg, '\n')
        }
        this.modalTitle = '批量编辑'
        this.modalType = 5
        this.paraModal = true
      }
      var textArr = this.fileTypeList.filter(v => {
        return v.checked
      })
      // 每次勾选都将当前筛选出来已经选择的类型写入表单数据中
      this.fieldForm.fileType = JSON.parse(JSON.stringify(textArr))
      // 继续处理数据，用来显示到页面中部限制类型
      textArr = textArr.map(m => {
        return m.label
      })
      this.listText = textArr.join(' / ')
    },
    uploadPicture(i) {
      // this.$refs.updatepic.
      this.uploadIndex = i
      // console.log(this.$refs.updatepic)
      this.$refs.updatepic.click()
    },
    addPicOpt() {
      let imgindex =
        this.fieldForm.childs[this.fieldForm.childs.length - 1].imglist + 1
      if (imgindex > 3) {
        imgindex = 1
      }
      const imgOpt = {
        label: '未命名',
        imglist: imgindex,
        imgurl: '/src/images/image-choice-' + imgindex + '.png', // 图片路径
        frequency: 0 // 次数
      }
      this.fieldForm.childs.push(imgOpt)
    },
    delPicOpt(i) {
      // 删除当前图片上传选项
      this.fieldForm.childs.splice(i, 1)
      // 发请求给后台通知删除了这个图片
    },
    handleNodeClick1(data) {
      // console.log(data)
      const _this = this
      // let hasChecked = true
      // 1. 先判断data是否有children,有children是父级，要遍历他的每个子集是否都在选中id集合中，
      // 2. 如果都在就将当前父级的选中状态标记为不选中，如果子集中有一个没有在，就将父级状态标记为选中
      // 处理点击选中事件
      if (data.children) {
        // 当前点击的为父级
        let pcheck = true
        for (const val of data.children) {
          const status = this.treeIdList.find(v => val.id === v)
          if (!status) {
            pcheck = false
          }
        }
        if (pcheck) {
          _this.$refs.treeper1.setChecked(data.id, false, true)
        } else {
          _this.$refs.treeper1.setChecked(data.id, true, true)
        }
      } else {
        // 当前点击的为子集
        const cStatus = this.treeIdList.find(m => data.id === m)
        if (cStatus) {
          _this.$refs.treeper1.setChecked(data.id, false)
        } else {
          _this.$refs.treeper1.setChecked(data.id, true)
        }
      }
      const checkedArr = this.$refs.treeper1.getCheckedNodes(true)
      this.treeIdList = checkedArr.map(item => {
        return item.id
      })
      this.fieldForm.scope = []
      _this.$nextTick(() => {
        _this.fieldForm.scope = checkedArr
      })
      console.log(checkedArr)
    },
    handleCheckChange1(data, checked, indeterminate) {
      const _this = this
      // 勾选和回调
      // console.log(data, checked, indeterminate)
      const checkedArr = this.$refs.treeper1.getCheckedNodes(true)
      this.fieldForm.scope = []
      _this.$nextTick(() => {
        _this.fieldForm.scope = checkedArr
      })
    },
    handleCheckedDel1(id) {
      const _this = this
      for (const [index, val] of this.treeIdList.entries()) {
        if (val === id) {
          // 存在
          _this.treeIdList.splice(index, 1)
          break
        }
      }
      this.$refs.treeper1.setChecked(id, false)
      const checkedArr = this.$refs.treeper1.getCheckedNodes(true)
      this.fieldForm.scope = []
      this.$nextTick(() => {
        _this.fieldForm.scope = checkedArr
        console.log(this.fieldForm.scope)
      })
    },
    handleNodeClick2(data) {
      // 点击选项回调
      // console.log(data)
      const _this = this
      const status = this.scopeIdList.find(v => data.id === v)
      if (status) {
        _this.$refs.treeper2.setChecked(data.id, false)
      } else {
        _this.$refs.treeper2.setChecked(data.id, true)
      }
      const checkedArr = this.$refs.treeper2.getCheckedNodes(true)
      this.fieldForm.default = []
      this.checkedScope = []
      this.scopeIdList = checkedArr.map(item => {
        return item.id
      })
      _this.$nextTick(() => {
        _this.checkedScope = checkedArr
        _this.fieldForm.default = checkedArr.map(v => {
          return v.id
        })
      })
      // console.log(checkedArr)
    },
    handleCheckChange2(data, checked, indeterminate) {
      const _this = this
      // 勾选和回调
      // console.log(data, checked, indeterminate)
      const checkedArr = this.$refs.treeper2.getCheckedNodes(true)
      this.fieldForm.default = []
      this.checkedScope = []
      _this.$nextTick(() => {
        _this.checkedScope = checkedArr
        _this.fieldForm.default = checkedArr.map(v => {
          return v.id
        })
      })
    },
    handleCheckedDel2(id) {
      const _this = this
      for (const [index, val] of this.scopeIdList.entries()) {
        if (val === id) {
          // 存在
          _this.scopeIdList.splice(index, 1)
          break
        }
      }
      this.$refs.treeper2.setChecked(id, false)
      const checkedArr = this.$refs.treeper2.getCheckedNodes(true)
      this.fieldForm.default = []
      this.checkedScope = []
      this.$nextTick(() => {
        _this.checkedScope = checkedArr
        _this.fieldForm.default = checkedArr.map(v => {
          return v.id
        })
      })
    },
    inviteMembers() {
      // 邀请新成员
      this.modalTitle = '添加成员'
      this.modalType = 7
      this.paraModal = true
    },
    filterNode1(value, data) {
      // 筛选回调
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    filterNode2(value, data) {
      // 筛选回调
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    selectFeildType(a, b) {
      const nowfeild = {
        type: a,
        name: b
      }
      this.$store.commit('addTableFeild', nowfeild)
      this.tableField = this.fieldForm.formdatas[
        this.fieldForm.formdatas.length - 1
      ]
      this.tFormTitle = b
      this.tableFeild = true
    },
    editTableFeild(index, name) {
      // console.log(index)
      this.tableField = this.fieldForm.formdatas[index]
      this.tFormTitle = name
      this.tableFeild = true
    },
    delTableFeild(index) {
      // 删除表格字段
      this.fieldForm.formdatas.splice(index, 1)
      // 更新预览驱动
      this.$store.commit('updateTable', '')
    },
    handleSuccess(response, file, fileList) {
      // console.log(response)
      if (this.uploadIndex > -1) {
        this.fieldForm.childs[this.uploadIndex].imgurl = response.url
        this.fieldForm.childs[this.uploadIndex].id = response.id
      }
    },
    openModel(type) {
      if (type === 1) {
        this.modalTitle = '关联已有数据'
        this.modalType = 1
        this.paraModal = true
      } else if (type === 2) {
        let radioArr = this.fieldForm.childs.map(v => {
          return v.label
        })
        // 如果有其他选项，则需要去掉其他选项
        if (this.fieldForm.oFlag) {
          radioArr.splice(radioArr.length - 1, 1)
        }
        radioArr = radioArr.join('#xier')
        const reg = new RegExp('#xier', 'g')
        this.bulkEdit = radioArr.replace(reg, '\n')
        this.modalTitle = '批量编辑'
        this.modalType = 2
        this.paraModal = true
      } else if (type === 3) {
        this.modalTitle = '添加逻辑表单规则'
        this.modalType = 3
        this.paraModal = true
      } else if (type === 4) {
        this.modalTitle = '配置选项份额'
        this.modalType = 4
        this.paraModal = true
      } else if (type === 5) {
        const content = this.fileTypeList[this.fileTypeList.length - 1].list
        if (content === '') {
          // 等于空
          this.bulkEdit = ''
        } else {
          const reg = new RegExp('、', 'g')
          this.bulkEdit = content.replace(reg, '\n')
        }
        this.modalTitle = '批量编辑'
        this.modalType = 5
        this.paraModal = true
      } else if (type === 6) {
        this.modalTitle = '筛选数据'
        this.modalType = 6
        this.paraModal = true
      }
    },
    modalSubmit() {
      if (this.modalType === 2) {
        const childArr = this.fieldForm.childs
        let valArr = this.bulkEdit.replace(/\n/g, ',')
        valArr = valArr.split(',')
        const otherObj = childArr[childArr.length - 1]
        this.fieldForm.childs = valArr.map(v => {
          return {
            label: v,
            rnoly: false
          }
        })
        if (this.fieldForm.oFlag) {
          this.fieldForm.childs.push(otherObj)
        }
        this.paraModal = false
      } else if (this.modalType === 5) {
        // 批量编辑上传文件类型
        this.fileTypeList[
          this.fileTypeList.length - 1
        ].list = this.bulkEdit.replace(/\n/g, '、')
        var textArr = this.fileTypeList.filter(v => {
          return v.checked
        })
        textArr = textArr.map(m => {
          return m.label
        })
        this.listText = textArr.join(' / ')
        this.paraModal = false
      }
      // 表单编辑状态改变
      this.$store.commit('formOnChange', true)
    }
  },
  mounted() {},
  created() {
    // 首次创建初始化
    this.tableFeild = false
    this.fieldForm = {}
    const nowname = this.feildData.name
    this.showData = this.showList[nowname]
    if (this.currently.length !== 0) {
      const a = this.currently[0]
      const b = this.currently[1]
      this.fieldForm = this.viewList[a][b]
    }
    if (this.fieldForm.content !== undefined) {
      if (this.$refs.detail) {
        this.$refs.detail.setContent(this.fieldForm.content)
      }
    }
    // 验证规则初始化
    if (this.feildData.id === 7) {
      if (this.fieldForm.decimals) {
        this.ruleform1 = {
          default: [{ validator: validateNumber1, trigger: 'blur' }]
        }
      } else {
        this.ruleform1 = {
          default: [{ validator: validateNumber2, trigger: 'blur' }]
        }
      }
    } else {
      this.ruleform1 = {}
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 重置样式，用于重写element-ui样式，自定义自己的样式 */
.feild-form-container {
  .edit-form {
    .el-form.field-form {
      padding: 10px 0px;
      .el-form-item {
        padding: 0 10px;
        &.item-scale {
          padding: 15px 10px 0px 10px;
          border-top: 1px solid #f5f5f7;
        }
        &.restricted {
          padding: 15px 10px 0px 10px;
          margin-bottom: 15px;
          border-top: 1px solid #ebebf0;
          .el-form-item__content {
            width: 100%;
            .feild-length {
              .el-input {
                .el-input__inner {
                  padding: 0 4px;
                  text-align: center;
                }
              }
              .screening-btn {
                width: 100%;
                height: 34px;
                margin-bottom: 10px;
                padding: 0 10px;
                border-radius: 3px;
                background-color: #fafafb;
                cursor: pointer;
                text-align: center;
                color: rgba(11, 178, 122, 0.8);
              }
            }
          }
        }
        &.limit-type {
          padding: 15px 10px 0px 10px;
          margin-bottom: 15px;
          border-top: 1px solid #ebebf0;
          .el-form-item__content {
            width: 100%;
            display: flex;
            .limit-max-size {
              margin-left: 10px;
              flex: 1;
              .el-input {
                width: 70%;
              }
            }
          }
        }
        .edit-radio {
          .el-input {
            margin-bottom: 10px;
            .el-input__prefix {
              cursor: pointer;
              .el-radio {
                margin-top: 8px;
                .el-radio__label {
                  display: none;
                }
              }
            }
            .el-input__suffix {
              cursor: pointer;
            }
          }
        }
        .edit-checkbox {
          .el-input {
            margin-bottom: 10px;
            .el-input__prefix {
              cursor: pointer;
              .el-checkbox {
                .el-checkbox__label {
                  display: none;
                }
              }
            }
            .el-input__suffix {
              cursor: pointer;
            }
          }
        }
        .picture-checkbox {
          .el-input {
            margin-bottom: 10px;
            .el-input__inner {
              padding-left: 58px;
            }
            .el-input__prefix {
              cursor: pointer;
              .el-checkbox {
                .el-checkbox__input {
                  top: -3px;
                }
                .el-checkbox__label {
                  display: none;
                }
              }
              .option-pic {
                display: inline-block;
                position: relative;
                top: 4px;
                width: 24px;
                height: 24px;
                margin-left: 7px;
                background-size: cover;
              }
            }
            .el-input__suffix {
              cursor: pointer;
            }
          }
        }
        .el-radio-group.scale-group {
          width: 100%;
          display: flex;
          .el-radio-button {
            flex: 1;
            .el-radio-button__inner {
              width: 100%;
            }
          }
        }
        .el-form-item__label {
          width: 100%;
        }
        .el-form-item__content {
          .el-range-editor.el-input__inner {
            width: 100%;
          }
        }
      }
    }
  }
}
body {
  .flow-modal {
    .subtitle {
      width: 100%;
      height: 29px;
      position: absolute;
      left: 0;
      top: 43px;
      text-indent: 16px;
      line-height: 30px;
      background-color: #fafafb;
      color: #b0b0b9;
      border-bottom: 1px solid #ebebf0;
    }
    .subtitle-thead {
      padding-top: 8px;
      width: 100%;
      position: absolute;
      left: 0;
      top: 43px;
      text-indent: 16px;
      background-color: #fafafb;
      color: #b0b0b9;
      border-bottom: 1px solid #ebebf0;
      .thead {
        margin-top: 8px;
        display: flex;
        > span {
          flex: 1;
          height: 34px;
          text-align: left;
          font-size: 14px;
          color: #cacad3;
          line-height: 30px;
          font-weight: 400;
          padding: 0 0 0 15px;
        }
        > span:nth-of-type(1) {
          border-right: 1px solid #ebebf0;
        }
      }
    }
    .redio-tbody {
      margin-top: 56px;
      margin-bottom: 20px;
      .tbody-item {
        list-style: none;
        display: flex;
        line-height: 36px;
        border-bottom: 1px solid #ebebf0;
        > span {
          flex: 1;
          padding: 5px 0 8px 15px;
        }
      }
    }
    .modal-textarea {
      .el-textarea__inner {
        margin-top: 22px;
        border: none;
        padding: 6px;
      }
    }
    &.padding-none {
      .ivu-modal-wrap {
        .ivu-modal {
          .ivu-modal-content {
            .ivu-modal-body {
              padding: 0px;
              height: 360px;
              overflow: hidden;
              overflow-y: auto;
              .matching-filter {
                .el-tabs__header {
                  padding-left: 15px;
                  margin-bottom: 0;
                  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
                  .el-tabs__nav-wrap {
                    &::after {
                      height: 0;
                    }
                  }
                }
                .el-tabs__content {
                  .el-tab-pane {
                    .add-line {
                      height: 34px;
                      line-height: 34px;
                      font-size: 14px;
                      margin: 0 15px;
                      text-align: center;
                      border: 1px dashed #c1c1cd;
                      border-radius: 3px;
                      cursor: pointer;
                      > i {
                        font-size: 14px;
                        margin-right: 6px;
                      }
                      &:hover {
                        border-color: #0bb27a;
                      }
                    }
                    .accurate {
                      background: #fafafb;
                      padding: 15px;
                      .add-and {
                        margin-top: 8px;
                        > span {
                          display: inline-block;
                          height: 34px;
                          line-height: 34px;
                          font-size: 14px;
                          cursor: pointer;
                          > i {
                            font-size: 14px;
                            margin-right: 6px;
                          }
                        }
                      }
                    }
                    .add-maybe {
                      > span {
                        display: inline-block;
                        width: 130px;
                        height: 34px;
                        line-height: 34px;
                        font-size: 14px;
                        border: 1px dashed #c1c1cd;
                        margin: 15px;
                        text-align: center;
                        border-radius: 3px;
                        cursor: pointer;
                        > i {
                          font-size: 14px;
                          margin-right: 6px;
                        }
                        &:hover {
                          border-color: #0bb27a;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    &.table-modal {
      .ivu-modal-wrap {
        .ivu-modal {
          .ivu-modal-content {
            .ivu-modal-body {
              .table-head {
                background: #fafafb;
                > p {
                  padding: 0 16px;
                  height: 34px;
                  line-height: 30px;
                  color: #b4b4bc;
                  border-bottom: 1px solid #ebebf0;
                }
                .header-th {
                  display: flex;
                  > span {
                    color: #6b737b;
                    font-size: 12px;
                    font-weight: 400;
                    padding: 6px 15px;
                    vertical-align: bottom;
                    border-right: 1px solid #ebebf0;
                    border-bottom: 1px solid #ebebf0;
                  }
                  > span:nth-of-type(1) {
                    flex: 1.2;
                  }
                  > span:nth-last-of-type(-n + 3) {
                    flex: 1;
                  }
                  > span:nth-last-of-type(1) {
                    border-right: none;
                  }
                }
              }
              .table-body {
                list-style: none;
                .table-body-item {
                  display: flex;
                  border-bottom: 1px solid #ebebf0;
                  > span {
                    color: #6b737b;
                    font-size: 12px;
                    font-weight: 400;
                    padding: 15px 12px 9px 15px;
                    vertical-align: bottom;
                    border-right: 1px solid #ebebf0;
                  }
                  > span:nth-of-type(1) {
                    flex: 1.2;
                  }
                  > span:nth-last-of-type(-n + 3) {
                    flex: 1;
                  }
                  > span:nth-last-of-type(1) {
                    border-right: none;
                  }
                  &:nth-last-of-type(1) {
                    border-bottom: none;
                    > span {
                      padding-bottom: 30px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    &.invite-members {
      .ivu-modal-wrap {
        .ivu-modal {
          .ivu-modal-content {
            .ivu-modal-body {
              padding: 0px;
              .matching-filter {
                .el-tabs__header {
                  padding-left: 15px;
                  margin-bottom: 0;
                  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
                  .el-tabs__nav-wrap {
                    &::after {
                      height: 0;
                    }
                  }
                }
                .el-tabs__content {
                  .el-tab-pane {
                    .invitation-item {
                      height: 520px;
                      padding-bottom: 20px;
                      overflow: hidden;
                      overflow-y: auto;
                      .search-box {
                        padding: 0 16px;
                        padding-top: 15px;
                      }
                      .invitation-title {
                        overflow: hidden;
                        padding: 0 16px;
                        height: 54px;
                        line-height: 54px;
                        border-bottom: 1px solid #f5f5f7;
                        .svg-icon {
                          cursor: pointer;
                        }
                      }
                      .invitation-list {
                        list-style: none;
                        .list-item {
                          height: 60px;
                          line-height: 60px;
                          padding: 0 16px;
                          border-bottom: 1px solid #f5f5f7;
                          .user-nomal {
                            display: inline-block;
                            position: relative;
                            width: 30px;
                            height: 30px;
                            margin-left: 6px;
                            margin-bottom: 5px;
                            border-radius: 50%;
                            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
                            cursor: pointer;
                            text-align: center;
                            line-height: 28px;
                            background-color: #409eff;
                            margin-right: 12px;
                            .svg-icon {
                              font-size: 14px;
                              color: #fff;
                            }
                          }
                          .invitation-sent {
                            float: right;
                            margin-top: 11px;
                            color: #cacad3;
                            .svg-icon {
                              cursor: pointer;
                            }
                          }
                          &:nth-last-of-type(1) {
                            border-bottom: none;
                          }
                        }
                      }
                      .invitation-tips {
                        padding: 0 16px;
                        padding-top: 15px;
                        color: #b4b4bc;
                        font-size: 14px;
                      }
                      .batch-invite {
                        padding: 0 16px;
                        padding-top: 14px;
                        position: relative;
                        .el-textarea {
                          .el-textarea__inner {
                            padding-bottom: 50px;
                          }
                        }
                        .batch-btn {
                          height: 50px;
                          width: 100%;
                          position: absolute;
                          bottom: 1px;
                          left: 0px;
                          .btn-bgc {
                            background-color: #fff;
                            margin: 0 17px;
                            margin-right: 29px;
                            height: 100%;
                            overflow: hidden;
                            border-radius: 0 0 4px 4px;
                          }
                        }
                      }
                      .link-code {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        margin: 40px 45px 0;
                        border-bottom: 1px solid #e6e6ec;
                        > p {
                          font-size: 14px;
                          line-height: 24px;
                          text-align: center;
                          margin-bottom: 12px;
                        }
                        > img {
                          display: inline-block;
                          width: 200px;
                          margin-bottom: 30px;
                        }
                      }
                      .link-copy {
                        .title {
                          font-size: 14px;
                          line-height: 24px;
                          text-align: center;
                          margin-bottom: 12px;
                          margin-top: 14px;
                        }
                        .link-box {
                          text-align: center;
                          line-height: 32px;
                          .link-input {
                            display: inline-flex;
                            padding-left: 9px;
                            width: 260px;
                            height: 32px;
                            border: 1px solid #ebebf0;
                            box-shadow: 0 0 0 2px #f4f4f6;
                            border-radius: 3px;
                            color: #b0b0b9;
                            margin-right: 15px;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            .ivu-modal-footer {
              display: none;
            }
          }
        }
      }
    }
  }
  .personnel-poppver.el-popover {
    padding: 0px;
    z-index: 1000 !important;
    .personnel-select {
      height: 320px;
      overflow: hidden;
      position: relative;
      .head-title {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        padding: 8px 10px;
        box-shadow: border-box;
        background-color: #fff;
        z-index: 2;
      }
      .body-content {
        height: 100%;
        padding: 50px 8px;
        overflow: hidden;
        overflow-y: auto;
        .el-tree {
          .el-tree-node__content {
            height: 50px;
            .el-checkbox {
              position: absolute;
              right: 0px;
            }
            .personnel-tree-node {
              width: 100%;
              box-sizing: border-box;
              padding-right: 10px;
              .avatar-current {
                display: inline-block;
                width: 26px;
                height: 26px;
                border-radius: 50%;
                text-align: center;
                line-height: 26px;
                margin-right: 5px;
                vertical-align: middle;
                margin-right: 8px;
                background-image: linear-gradient(
                  -90deg,
                  #61bfad 0,
                  #077267 95%
                );
                > .svg-icon {
                  color: #fff;
                }
              }
              .avatar-nomal {
                display: inline-block;
                width: 26px;
                height: 26px;
                border-radius: 50%;
                text-align: center;
                line-height: 26px;
                margin-right: 5px;
                vertical-align: middle;
                margin-right: 8px;
                background-color: #409eff;
                > .svg-icon {
                  color: #fff;
                }
              }
            }
          }
        }
      }
      .footer {
        background-color: #fff;
        position: absolute;
        width: 100%;
        bottom: 0px;
        left: 0px;
        height: 50px;
        border-top: 1px solid #ebebf0;
        text-align: center;
        line-height: 50px;
        z-index: 2;
      }
    }
  }
  .el-popover {
    .type-list {
      > div {
        text-align: left;
        padding: 6px 8px;
        cursor: pointer;
        &:hover {
          background-color: rgba(11, 178, 122, 0.12);
        }
      }
    }
  }
}
@media screen and (max-width: 1360px) {
  .feild-form-container {
    .edit-form {
      .el-form.field-form {
        .el-form-item {
          .el-form-item__content {
            .el-range-editor.el-input__inner {
              width: 100%;
              .el-range-separator {
                width: 8%;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 自定义样式，由于有scoped属性，所以只对当前tamplate中的 html生效，优化打包效率*/
.feild-form-container {
  .edit-form {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding-bottom: 10px;
    margin-bottom: 10px;
    .tips-icon {
      color: #858585;
      cursor: pointer;
    }
    .edit-form-titel {
      padding: 10px;
      color: #2b3441;
      border-bottom: 1px solid #f5f5f7;
      font-size: 14px;
      .el-icon-arrow-left {
        font-weight: 700;
        cursor: pointer;
      }
      .titel-text {
        display: inline-block;
        margin: 0 8px 0 3px;
      }
      .title-icon {
        font-size: 14px;
        color: #666;
      }
    }
    .relevance-btn {
      width: 100%;
      height: 34px;
      margin-bottom: 10px;
      padding: 0 10px;
      border-radius: 3px;
      background-color: #fafafb;
      cursor: pointer;
      text-align: center;
      color: rgba(11, 178, 122, 0.8);
    }
    .restricted {
      .feild-length {
        margin-top: 6px;
        flex: 1;
        display: flex;
      }
      .share-bth {
        color: #0bb27a;
        float: right;
        cursor: pointer;
        margin-right: 4px;
      }
      .file-type-list {
        list-style: none;
        border: 1px solid #ebebf0;
        border-radius: 3px;
        .list-item {
          border-bottom: 1px solid #ebebf0;
          .type-title {
            padding-left: 14px;
            line-height: 36px;
            overflow: hidden;
            .edit-btn {
              float: right;
              margin-right: 10px;
              cursor: pointer;
              color: #0bb27a;
            }
          }
          .type-content {
            border-top: 1px solid #ebebf0;
            line-height: 24px;
            font-size: 13px;
            padding: 10px 14px;
            background: #fafafb;
            color: #bcbcc4;
          }
          &:nth-last-of-type(1) {
            border-bottom: none;
          }
        }
      }
      .table-edit-list {
        list-style: none;
        .list-item {
          height: 34px;
          padding-left: 10px;
          border: 1px solid #dedee5;
          border-radius: 3px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .item-opera {
            display: none;
            i {
              margin-right: 8px;
              cursor: pointer;
            }
          }
          &:hover {
            .item-opera {
              display: block;
            }
          }
        }
        .add-feild {
          .add-btn {
            height: 34px;
            width: 100%;
            background-color: #fafafd;
            border: 1px dashed #d5d5f4;
            border-radius: 3px;
            text-align: center;
            cursor: pointer;
          }
        }
      }
    }
    .personnel-list {
      .list-item {
        display: inline-block;
        position: relative;
        width: 30px;
        height: 30px;
        margin-left: 6px;
        margin-bottom: 5px;
        border-radius: 50%;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
        cursor: pointer;
        text-align: center;
        line-height: 28px;
        .svg-icon {
          font-size: 14px;
        }
        &.add-btn {
          .svg-icon {
            font-size: 12px;
            color: rgba(11, 178, 122, 0.8);
          }
        }
        &.current {
          background-image: linear-gradient(-90deg, #61bfad 0, #077267 95%);
          .svg-icon {
            color: #fff;
          }
        }
        &.user-nomal {
          background-color: #409eff;
          .svg-icon {
            color: #fff;
          }
        }
        &.is-show-del {
          .el-icon-error {
            position: absolute;
            top: -2px;
            right: -4px;
            color: #ff3232;
            display: none;
            z-index: 3;
          }
          &:hover {
            .el-icon-error {
              display: block;
            }
          }
        }
      }
    }
    .opera-group {
      .add-btn {
        width: 100%;
        height: 38px;
        border-radius: 3px;
        text-align: center;
        border: 1px dashed #d5d5f4;
        cursor: pointer;
      }
      .btn-group {
        display: flex;
        margin-top: 12px;
        span {
          flex: 1;
          align-items: center;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
