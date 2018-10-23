<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-tabs v-model="activeName" class="flow-tabs" :before-leave="beforeLeaveTabs">
                <el-tab-pane name="first" class="form-design">
                    <span slot="label">
                        <i class="serial">1</i> 表单设计</span>
                    <!-- 字段选择九宫格 -->
                    <el-col :span="6">
                        <FeildGrid @edit-flow="saveEdit"></FeildGrid>
                    </el-col>
                    <!-- 中部样式预览效果 -->
                    <el-col :span="showEdit ? 12 : 14">
                        <FormDesign :IsEdit="showEdit"></FormDesign>
                    </el-col>
                    <!-- 每一项字段编辑表单 -->
                    <el-col v-if="showEdit" :span="6">
                        <FeildForm></FeildForm>
                    </el-col>
                </el-tab-pane>
                <el-tab-pane name="second" class="flow-chart-pane" :lazy="false">
                    <span slot="label">
                        <i class="serial">2</i> 添加流程</span>
                    <a id="imgdown" href="" style="display: none;">下载</a>
                    <div class="flowchart-container" :style="{ 'height': flowHeight + 'px' }">
                        <div class="zoom-container">
                            <div class="export-img" @click="importToImg" title="导出流程图">
                                <svg-icon class="zoom-icon" icon-class="export_img" />
                            </div>
                            <div class="export-img" @click="zoomFlowChart(0)">
                                <svg-icon class="zoom-icon" icon-class="subtract" />
                            </div>
                            <span>{{ (scaleVal* 100).toFixed(0) }}%</span>
                            <div class="export-img" @click="zoomFlowChart(1)">
                                <svg-icon class="zoom-icon" icon-class="g_add" />
                            </div>
                        </div>
                        <div id="flowchart" style="background-color: #f5f5f7;">
                            <flow-chart :data="flowChart" @clickNode="flowNodeClick" @addClickNode="flowChartAdd" @complete="doneCreate" :style="{'transform': 'scale('+ scaleVal +')'}"></flow-chart>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane name="third" class="global-settings">
                    <span slot="label">
                        <i class="serial">3</i> 全局设置</span>
                    <el-col :span="4">
                        <el-card class="card-menu">
                            <ul class="setting-menu">
                                <li v-for="(item, index) in settingList" :key="index" :class="{'active': item.checked}" @click="settingSelect(index)">
                                    <svg-icon :icon-class="item.icon" />{{item.label}}
                                </li>
                            </ul>
                        </el-card>
                    </el-col>
                    <el-col :span="20">
                        <div class="setting-title">
                            <span v-if="activeType === 0">提交限制</span>
                            <span v-if="activeType === 1">提醒设置</span>
                            <span v-if="activeType === 2">自定义打印模板</span>
                        </div>
                        <div v-if="activeType === 0" class="setting-body">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    申请提交量限制
                                </div>
                                <div class="setting-item">
                                    <div class="item-checked">
                                        <el-checkbox v-model="limitGross">限制提交总量</el-checkbox>
                                    </div>
                                    <div v-if="limitGross" class="item-body">
                                        <el-progress type="circle" :percentage="0" style="float: left;"></el-progress>
                                        <div class="setting-input">
                                            <el-input v-model="gross" type="number"></el-input>
                                            <p style="color: #b0b0b9; margin-top: 20px;">已有0份，当前服务最高可设置1000份。</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="setting-item">
                                    <div class="item-checked">
                                        <el-checkbox v-model="limitCeiling">限制每月提交上限</el-checkbox>
                                    </div>
                                    <div v-if="limitCeiling" class="item-body">
                                        <el-progress type="circle" :percentage="0" style="float: left;"></el-progress>
                                        <div class="setting-input">
                                            <el-input v-model="ceiling" type="number"></el-input>
                                            <p style="color: #b0b0b9; margin-top: 20px;">已有0份，当前服务最高可设置1000份。</p>
                                        </div>
                                    </div>
                                </div>
                            </el-card>
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>申请人填写表单后显示</span>
                                </div>
                                <div class="setting-item">
                                    <div class="item-checked">
                                        <el-checkbox value=""> 限制提交总量</el-checkbox>
                                    </div>
                                    <div class="item-body" style="display: flex;">
                                        <el-select placeholder="请选择" v-model="showType">
                                            <el-option label="默认文案" :value="1"></el-option>
                                            <el-option label="显示制定内容" :value="2"></el-option>
                                            <el-option label="跳转指定链接" :value="3"></el-option>
                                        </el-select>
                                        <el-input v-if="showType > 1" placeholder="请输入内容" style="margin-left: 16px;"></el-input>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                        <div v-if="activeType === 1" class="setting-body">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    推送方式
                                </div>
                                <div class="setting-item">
                                    <div class="item-checked">
                                        <el-checkbox v-model="realTime">实时推送</el-checkbox>
                                    </div>
                                </div>
                                <div class="setting-item">
                                    <div class="item-checked">
                                        <el-checkbox v-model="regular">定期推送</el-checkbox>
                                    </div>
                                    <div v-if="regular" class="item-body limit-time">
                                        <span v-for="(item, index) in timeTags" :key="index + 5" :class="{'selected': item.checked}" @click="handleTags(index)">{{item.time}}</span>
                                    </div>
                                </div>
                            </el-card>
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>推送内容</span>
                                </div>
                                <div class="setting-item">
                                    <div class="item-checked">
                                        <el-checkbox v-model="copyTo">抄送的数据</el-checkbox>
                                    </div>
                                </div>
                                <div class="setting-item">
                                    <div class="item-checked">
                                        <el-checkbox v-model="pending">待处理的数据</el-checkbox>
                                    </div>
                                </div>
                                <div class="setting-item">
                                    <div class="item-checked">
                                        <el-checkbox v-model="appliResult">申请结果</el-checkbox>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                        <div v-if="activeType === 2" class="setting-body">
                            <a style="color:#409EFF; text-decoration: underline;" href="https://hc.qingflow.com/help-center/customed-sheet-for-print/">自定义打印模板</a>
                        </div>
                    </el-col>
                </el-tab-pane>
                <el-tab-pane name="fourth">
                    <span slot="label">
                        <i class="serial">4</i> 应用发布</span>
                    <el-col :span="12" :offset="6">
                        <el-card class="release-box-card">
                            <div class="release-submit">
                                <img src="/src/images/release.png" />
                                <div class="release-handle">
                                    <div class="title">应用已开启，数据飞速流转中...</div>
                                    <div class="last-publish">最近发布： 2018年8月6日 15:23</div>
                                    <div style="margin-top: 22px;">
                                        <button class="xier-btn-primary" @click="releaseHandle(2)">重新发布 有新内容</button>
                                    </div>
                                    <div style="margin-top: 10px;">
                                        <button class="xier-btn-defaut" @click="releaseHandle(3)">放弃所有更改&nbsp;
                                            <el-tooltip class="item" effect="dark" content="放弃所有更改后，应用将会滚到上次发布状态，此操作无法撤回" placement="bottom">
                                                <svg-icon icon-class="question" />
                                            </el-tooltip>
                                        </button>
                                    </div>
                                    <div class="sub-title">当应用内容有修改或增减时需要重新发布</div>
                                </div>
                            </div>
                            <div class="release-item">
                                <div class="item-desc">
                                    <p class="title">应用列表</p>
                                    <p class="sub-title">在应用列表中，您可以管理您的所有应用</p>
                                </div>
                                <el-button plain>返回应用列表</el-button>
                            </div>
                            <div class="release-item">
                                <div class="item-desc">
                                    <p class="title">应用数据报表</p>
                                    <p class="sub-title">在应用数据报表中，您可以管理您的应用数据</p>
                                </div>
                                <el-button plain>前往数据报表</el-button>
                            </div>
                            <div class="release-item">
                                <div class="item-desc">
                                    <p class="title">应用状态</p>
                                    <p class="sub-title">应用关闭时，无法申请和处理，只允许查看已有数据</p>
                                </div>
                                <div class="item-switch">{{usingStu ? '已开启' : '已关闭'}}
                                    <button :class="{'open': usingStu, 'close': !usingStu}" @click="statusHandle(1)">打开</button>
                                </div>
                            </div>
                            <div class="release-item">
                                <div class="item-desc">
                                    <p class="title">申请通道状态</p>
                                    <p class="sub-title">申请通道关闭后，应用无法申请，不影响其他操作</p>
                                </div>
                                <div class="item-switch">{{applyStu ? '已开启' : '已关闭'}}
                                    <button :class="{'open': applyStu, 'close': !applyStu}" @click="statusHandle(2)">关闭</button>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-tab-pane>
            </el-tabs>
            <el-button v-if="idEditForm" @click="saveFormData" class="save-btn">
                <svg-icon icon-class="tmp_save" />保存</el-button>
        </el-row>
        <Modal v-model="tipsSave" width="350" class="tips-save-modal" :closable="false">
            <div class="save-box" v-if="modalType === 1">
                <svg-icon icon-class="tmp_save" />
                <p>表单内容有更改，<br/>是否需要保存？</p>
                <el-button type="primary" @click="saveEidtForm">保存并离开</el-button>
                <el-button plain @click="notSaveLeave">不保存</el-button>
                <span class="cancel" @click="tipsSave = false">取消</span>
            </div>
            <div class="save-box" v-if="modalType === 2">
                <svg-icon icon-class="paper_plane" />
                <p class="modal-title-release">应用重新发布后，将覆盖现有版本</p>
                <div class="release-btn">
                    <button class="xier-btn-primary" @click="releaseSubmint">确定发布</button>
                    <button class="btn-defaut" @click="tipsSave = false">先不了</button>
                </div>
            </div>
            <div class="save-box" v-if="modalType === 3">
                <svg-icon icon-class="tmp_save" />
                <p class="modal-title-release">清空更改内容后，将无法撤回</p>
                <div class="release-btn">
                    <button class="xier-btn-primary" @click="emptySubmit">我要清空</button>
                    <button class="btn-defaut" @click="tipsSave = false">先不了</button>
                </div>
            </div>
        </Modal>
        <!-- 编辑流程图 -->
        <Modal v-model="flowModal" class="flow-right-model" footer-hide closable :width="726" :styles="{'margin-right':'0px','height':'100%','top':'0px'}" :transfer="false" :transition-names="['move-right','fade']">
            <div class="flow-node-edit">
                <div class="node-header bg01">
                    <div class="node-name">
                        <span v-if="!isEditNode">{{clickedNode.name ? clickedNode.name : '未命名节点'}}</span>
                        <i v-if="!isEditNode" @click="isEditNode = true" class="el-icon-edit-outline"></i>
                        <el-input v-if="isEditNode" @blur="isEditNode = false" v-model="clickedNode.name" placeholder="请输入内容"></el-input>
                    </div>
                    <div class="node-action" v-if="clickedNode.typeId">
                        <span class="desc">节点类型</span>
                        <el-popover popper-class="node-type" v-model="nodeType" placement="bottom-start" width="300" trigger="click">
                            <ul class="switch-node-type">
                                <li class="title">节点类型切换</li>
                                <li class="item bg01" @click="switchNodeType(1)">
                                    <i class="iconfont icon-shenpi"></i>
                                    <p>审批节点</p>
                                    <p>审批节点可对数据进行通过／不通过操作</p>
                                </li>
                                <li class="item bg02" @click="switchNodeType(2)">
                                    <i class="iconfont icon-bianji"></i>
                                    <p>填写节点</p>
                                    <p>填写节点可对数据进行录入／修改等操作</p>
                                </li>
                                <li class="item bg03" @click="switchNodeType(3)">
                                    <i class="iconfont icon-zhifeiji"></i>
                                    <p>抄送节点</p>
                                    <p>可将数据抄送给指定用户</p>
                                </li>
                            </ul>
                            <button slot="reference" class="select-node">{{clickedNode.typeId === 1 ? '审批节点' : (clickedNode.typeId === 2 ? '填写节点' : '抄送节点')}}
                                <i class="el-icon-arrow-down"></i>
                            </button>
                        </el-popover>
                        <el-popover popper-class="node-del" v-model="delPopover" placement="right" width="260" trigger="click">
                            <div class="del-box">
                                <P>是否确认删除该节点？</P>
                                <el-button @click="delPopover = false">取消</el-button>
                                <el-button type="danger" @click="delClickNode">确认删除</el-button>
                            </div>
                            <i slot="reference" class="el-icon-delete del-btn"></i>
                        </el-popover>
                    </div>
                </div>
                <div class="node-principal">
                    <div class="select-user">
                        <p v-if="clickedNode.typeId !== 3" class="title">负责人</p>
                        <p v-if="clickedNode.typeId === 3" class="title">抄送至</p>
                        <div class="user-container">
                            <div class="user-wraper">
                                <el-popover popper-class="select-user-popper" placement="bottom-start" width="350" trigger="click">
                                    <div class="user-select-box">
                                        <el-tabs value="first">
                                            <el-tab-pane label="通讯录" name="first">
                                                <div class="search-container">
                                                    <el-input value="" placeholder="请输入关键字检索"></el-input>
                                                </div>
                                                <div class="tree-container">
                                                    <el-tree :data="userList" :props="defaultProps"></el-tree>
                                                </div>
                                            </el-tab-pane>
                                            <el-tab-pane label="动态人员" name="second"><p style="padding: 0 10px;">动态成员，轻流的收费模块功能。</p></el-tab-pane>
                                        </el-tabs>
                                        <div class="select-footer">
                                            <el-button type="primary" style="width: 175px;" icon="el-icon-plus">邀请成员</el-button>
                                        </div>
                                    </div>
                                    <div slot="reference" class="select-user-btn">
                                        <i class="el-icon-plus"></i>
                                    </div>
                                </el-popover>
                            </div>
                        </div>
                    </div>
                </div>
                <el-tabs class="flow-chart-tabs" v-model="flowTabName">
                    <el-tab-pane label="字段权限" class="field-power" name="first">
                        <div class="question-setting-header">
                            <span class="desc-text">将鼠标移动到字段上进行配置</span>
                            <div class="config-btn-group">
                                <span class="btn-label">全局配置</span>
                                <el-button-group>
                                    <el-button v-if="clickedNode.typeId !== 3" @click="globalSetting(1)">可编辑</el-button>
                                    <el-button @click="globalSetting(3)">仅可见</el-button>
                                    <el-button @click="globalSetting(2)">隐藏</el-button>
                                </el-button-group>
                            </div>
                        </div>
                        <ul class="field-list-setting">
                            <li v-for="(item, index) in baseSet" :key="index">
                                <svg-icon :icon-class="item.icon" />{{item.text}}
                                <div class="select-action">
                                    <el-button-group>
                                        <el-button @click="handelBaseBtn(index, 1)" style="border: none;" :type="!item.isHide ? 'primary' : ''">可见</el-button>
                                        <el-button @click="handelBaseBtn(index, 2)" style="border: none;" :type="item.isHide ? 'primary' : ''">隐藏</el-button>
                                    </el-button-group>
                                </div>
                            </li>
                        </ul>
                        <div class="flow-form-setting">
                            <el-row class="form-item-wraper" v-for="(item, index) in viewList" :key="index">
                                <el-col class="form-list-item" v-for="(info, list) in item" :key="list" :span="info.scale">
                                    <div class="item-preview" v-if="info.type === 1">
                                        <i v-if="info.content === ''">描述文字内容</i>
                                        <div v-html="info.content"></div>
                                        <div class="auth-edit-actions">
                                            <el-button-group v-if="actStu.length !== 0">
                                                <el-button @click="statusToogle(index, list, 1)" :type="actStu[index][list].status === 1 ? 'primary' : ''" style="border: none;">可编辑</el-button>
                                                <el-button @click="statusToogle(index, list, 2)" :type="actStu[index][list].status === 2 ? 'primary' : ''" style="border: none;">仅隐藏</el-button>
                                                <el-button @click="statusToogle(index, list, 3)" :type="actStu[index][list].status === 3 ? 'primary' : ''" style="border: none;">可见</el-button>
                                            </el-button-group>
                                        </div>
                                    </div>
                                    <div class="item-preview" v-if="info.type !== 1">
                                        <p class="item-label">{{info.label}}
                                            <span v-if="info.required" class="require">*</span>
                                        </p>
                                        <p v-if="info.tips !== ''" class="item-tips">{{info.tips}}</p>
                                        <div class="item-value">
                                            <el-input v-if="info.type === 2 || info.type === 8" placeholder="请输入内容" v-model="info.default"></el-input>
                                            <el-input v-if="info.type === 3" type="textarea" :rows="3" placeholder="请输入内容" v-model="info.default"></el-input>
                                            <el-date-picker v-if="info.type === 4" v-model="info.date" :format="info.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :value-format="info.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :type="info.precise ? 'datetime' :'date'" placeholder="选择日期" style="width: 100%;"></el-date-picker>
                                            <el-input v-if="info.type === 5 || info.type === 6 || info.type === 7" placeholder="请输入内容" v-model="info.default">
                                                <svg-icon slot="prefix" :icon-class="feildData.icon" class="title-icon" />
                                            </el-input>
                                            <el-radio-group v-if="info.type === 9" :class="{'is-vertical' : info.arrange === 2}" v-model="info.radio">
                                                <el-radio v-for="(item, index) in info.childs" :key="index + 3.05" :label="index">{{item.label}}</el-radio>
                                            </el-radio-group>
                                            <el-select v-if="info.type === 10" v-model="info.select" filterable placeholder="选择或输入关键字搜索" style="width: 100%;">
                                                <el-option v-for="(item, index) in info.childs" :key="index" :label="item.label" :value="index">
                                                </el-option>
                                            </el-select>
                                            <el-checkbox-group v-if="info.type === 11" :class="{'is-vertical' : info.arrange === 2}" v-model="info.checkbox">
                                                <el-checkbox v-for="(item, index) in info.childs" :key="index + 3.26" :label="index">{{item.label}}</el-checkbox>
                                            </el-checkbox-group>
                                            <el-date-picker v-if="info.type === 13" v-model="info.daterange" style="width: 100%;" :format="info.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :value-format="info.precise ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :type="info.precise ? 'datetimerange' :'daterange'" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                            </el-date-picker>
                                            <el-upload v-if="info.type === 12" class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
                                                <i class="el-icon-upload"></i>
                                                <div class="el-upload__text">将文件拖到此处，或
                                                    <em>点击上传</em>
                                                </div>
                                                <div class="el-upload__tip" slot="tip">
                                                    <span v-if="listText !== '' && info.limitType">只能上传{{listText}}类型文件，</span>文件大小不超过{{info.maxSize}}MB</div>
                                            </el-upload>
                                            <el-row v-if="info.type === 14" :gutter="8" class="select-img-list">
                                                <el-checkbox-group v-model="info.selectimg">
                                                    <el-col :span="6" v-for="(item, index) in info.childs" :key="index + 3.05">
                                                        <div class="picture-box">
                                                            <img :src="item.imgurl" />
                                                            <el-checkbox :label="index">{{item.label}}</el-checkbox>
                                                        </div>
                                                    </el-col>
                                                </el-checkbox-group>
                                            </el-row>
                                            <rich-editor v-if="info.type === 15" v-model="content01"></rich-editor>
                                            <el-select v-if="info.type === 17 || info.type === 18" v-model="info.default" multiple placeholder="选择或输入关键字搜索" style="width: 100%;">
                                                <el-option v-for="item in info.scope" :key="item.id" :label="item.label" :value="item.id">
                                                </el-option>
                                            </el-select>
                                            <iviewTable v-if="info.type === 16" border :columns="info.tablecolumns" :data="info.tabledata"></iviewTable>
                                        </div>
                                        <div class="auth-edit-actions">
                                            <el-button-group v-if="actStu.length !== 0">
                                                <el-button @click="statusToogle(index, list, 1)" :type="actStu[index][list].status === 1 ? 'primary' : ''" style="border: none;">可编辑</el-button>
                                                <el-button @click="statusToogle(index, list, 2)" :type="actStu[index][list].status === 2 ? 'primary' : ''" style="border: none;">仅隐藏</el-button>
                                                <el-button @click="statusToogle(index, list, 3)" :type="actStu[index][list].status === 3 ? 'primary' : ''" style="border: none;">可见</el-button>
                                            </el-button-group>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane v-if="clickedNode.typeId !== 3" label="高级设置" class="senior-config" name="second">
                        <div v-if="clickedNode.typeId && clickedNode.typeId !== 3 &&  clickedNode.typeId !== 4">
                            <div class="flow-setting">
                                <div class="flow-setting-title">
                                    <svg-icon icon-class="the_message" />
                                    <span class="title-label">处理反馈</span>
                                    <el-switch v-model="flowSenior.feedback">
                                    </el-switch>
                                </div>
                                <p class="setting-tips">节点负责人处理待办时可以填写处理反馈，处理反馈将显示在流程日志中</p>
                            </div>
                            <div class="flow-setting">
                                <div class="flow-setting-title">
                                    <svg-icon icon-class="exchange" />
                                    <span class="title-label">待办转交</span>
                                    <el-switch v-model="flowSenior.backlog">
                                    </el-switch>
                                </div>
                                <p class="setting-tips">节点负责人可见待办事项转交给其他成员处理</p>
                            </div>
                            <div class="flow-setting">
                                <div class="flow-setting-title">
                                    <svg-icon icon-class="rollback" />
                                    <span class="title-label">流程回退</span>
                                    <el-switch v-model="flowSenior.fallback">
                                    </el-switch>
                                </div>
                                <p class="setting-tips">节点负责人可将流程回退到之前的节点，仅审批节点可用</p>
                            </div>
                            <div class="flow-setting">
                                <div class="flow-setting-title">
                                    <svg-icon icon-class="timeout" />
                                    <span class="title-label">流程超时</span>
                                    <el-switch v-model="flowSenior.timeout">
                                    </el-switch>
                                </div>
                            </div>
                        </div>
                        <div v-if="clickedNode.type === 'start'">
                            <div class="flow-setting">
                                <div class="flow-setting-title">
                                    <svg-icon icon-class="password" />
                                    <span class="title-label">填写密码</span>
                                    <el-switch v-model="flowSenior.needPw">
                                    </el-switch>
                                    <el-input style="width: 130px; margin-left: 12px;" v-if="flowSenior.needPw" v-model="flowSenior.password"></el-input>
                                </div>
                                <p class="setting-tips">凭密码才可填写表单</p>
                            </div>
                            <div class="flow-setting">
                                <div class="flow-setting-title">
                                    <svg-icon icon-class="withdraw" />
                                    <span class="title-label">允许撤回</span>
                                    <el-switch v-model="flowSenior.withdraw">
                                    </el-switch>
                                </div>
                                <p class="setting-tips">允许申请人对未进入流程（第一个流程节点为待处理状态）的申请进行撤回。</p>
                            </div>
                            <div class="flow-setting">
                                <div class="flow-setting-title">
                                    <svg-icon icon-class="the_log" />
                                    <span class="title-label">流程日志</span>
                                    <el-switch v-model="flowSenior.flowlog">
                                    </el-switch>
                                </div>
                                <p class="setting-tips">允许申请人查看流程日志</p>
                            </div>
                            <div class="flow-setting">
                                <div class="flow-setting-title">
                                    <svg-icon icon-class="frequency" />
                                    <span class="title-label">填写次数</span>
                                    <el-switch v-model="flowSenior.frequency">
                                    </el-switch>
                                    <el-input style="width: 130px; margin-left: 12px;" v-if="flowSenior.frequency" v-model="flowSenior.freqnum"></el-input>
                                </div>
                                <p class="setting-tips">对申请人可以提交的申请总数进行限制</p>
                            </div>
                        </div>
                        <!-- <div class="flow-setting">
                            <div class="flow-setting-title">
                                <svg-icon icon-class="print_out" />
                                <span class="title-label">打印模板</span>
                            </div>
                        </div> -->
                        <div class="flow-setting">
                            <div class="flow-setting-title">
                                <svg-icon icon-class="verify" />
                                <span class="title-label">提交校验</span>
                                <div style="width: 200px;">
                                    <el-select v-model="flowSenior.verify" placeholder="请选择">
                                        <el-option label="所有数据可提交" :value="1"></el-option>
                                        <el-option label="满足条件的数据才可提交" :value="2"></el-option>
                                    </el-select>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </Modal>
    </div>
</template>

<script>
import FeildGrid from './components/FeildGrid.vue'
import FormDesign from './components/FormDesign.vue'
import FeildForm from './components/FeildForm.vue'
import FlowChart from './components/FlowChart.vue'
import richEditor from '@/views/components/RichEditor'
import { seaveEditTmp } from '@/api/workflow/flow_creat'
export default {
  name: 'apply_mineWorkflow',
  components: { FeildGrid, FormDesign, FeildForm, FlowChart, richEditor },
  computed: {
    currently() {
      return this.$store.state.workflow.currently
    },
    viewList() {
      return this.$store.state.workflow.viewList
    },
    feildData() {
      return this.$store.state.workflow.feildData
    },
    idEditForm() {
      return this.$store.state.workflow.idEditForm
    },
    listText() {
      if (this.feildData.name !== 'fileupload') {
        return ''
      } else {
        const a = this.currently[0]
        const b = this.currently[1]
        let fieldForm = {}
        console.log(this.viewList[a])
        if (this.viewList[a][b]) {
          fieldForm = this.viewList[a][b]
          // 继续处理数据，用来显示到页面中部限制类型
          // console.log(fieldForm.fileType)
          const textArr = fieldForm.fileType.map(m => {
            return m.label
          })
          return textArr.join(' / ')
        } else {
          return ''
        }
      }
    }
  },
  watch: {
    currently(val) {
      if (val.length === 0) {
        this.showEdit = false
      } else {
        this.showEdit = true
      }
    },
    viewList: {
      handler: function(val, oldVal) {
        // console.log(val)
        // 生成表单字段状态
        const statusArr = []
        for (const item of val) {
          const group = item.map(v => {
            const obj = {
              type: v.type,
              name: v.name,
              text: v.text,
              status: 1
            }
            return obj
          })
          statusArr.push(group)
        }
        // 给每个node节点绑定表单字段状态
        this.bandNodeStatus(statusArr)
      },
      deep: true
    },
    flowChart: {
      handler: function(val, oldVal) {
        // console.log(val)
        // 生成表单字段状态
        const statusArr1 = []
        for (const item of this.viewList) {
          const group = item.map(v => {
            const obj = {
              type: v.type,
              name: v.name,
              text: v.text,
              status: 1
            }
            return obj
          })
          statusArr1.push(group)
        }
        // 给每个node节点绑定表单字段状态
        this.bandNodeStatus(statusArr1)
      },
      deep: true
    },
    flowModal(val) {
      if (!val) {
        this.nodeStatus[this.clickedNode.id] = this.actStu
        this.seniorList[this.clickedNode.id] = this.flowSenior
        this.actStu = []
        this.flowSenior = {}
      }
    }
  },
  data() {
    // 数据data在这里
    return {
      activeName: 'first', // tabs当前切换
      showEdit: false,
      content01: '', // 预览项展示富文本
      modalType: 1, // 弹出层类别：1/表单设计弹出层 2/ 应用发布弹出层
      tipsSave: false, // 提示保存弹出层
      targetTabs: '', // 用户要跳转的目标tabs
      settingList: [
        {
          label: '提交设置',
          checked: true,
          icon: 'guide'
        },
        {
          label: '提醒设置',
          checked: false,
          icon: 'remind'
        },
        {
          label: '自定义打印模板',
          checked: false,
          icon: 'print'
        }
      ], // 右侧设置选项数据
      activeType: 0, // 当前选择的类别
      limitGross: false, // 控制提交总量显示/隐藏
      gross: '', // 当前用户输入的总量
      limitCeiling: false, // 控制每月提交上限显示/隐藏
      ceiling: '', // 当前用户输入的每月提交上限
      showType: 1, // 显示的类型
      realTime: false, // 实时推送
      regular: false, // 定期推送
      copyTo: false, // 抄送的数据
      pending: false, // 待处理的数据
      appliResult: false, // 待处理的数据
      timeTags: [
        { time: '上午 09 : 00', checked: false },
        { time: '下午 01 : 00', checked: false },
        { time: '下午 09 ：00', checked: false }
      ],
      usingStu: false, // 应用状态开关控制
      applyStu: false, // 申请通道状态开关控制
      flowChart: [
        {
          type: 'start',
          name: '申请人',
          id: this.newGuid()
        },
        {
          type: 'end',
          name: '结束',
          id: this.newGuid()
        }
      ], // 流程图数据
      flowHeight: 500, // 流程图高度
      scaleVal: 1, // 流程图缩放
      flowModal: false, // 流程图modal
      flowTabName: 'first', // flowchart编辑tab
      flowSenior: {
        feedback: true,
        backlog: true,
        fallback: true,
        timeout: true,
        verify: 1, // 提交校验
        SerialNum: false,
        Proposer: false,
        ApplyTime: false,
        UpdateTime: false
      },
      seniorList: {},
      baseSet: [
        {
          icon: 'serial_number',
          text: '编号',
          key: 'SerialNum',
          isHide: false
        },
        {
          icon: 'avatar',
          text: '申请人',
          key: 'Proposer',
          isHide: false
        },
        {
          icon: 'apply_time',
          text: '申请时间',
          key: 'ApplyTime',
          isHide: false
        },
        {
          icon: 'update_time',
          text: '更新时间',
          key: 'UpdateTime',
          isHide: false
        }
      ],
      clickedNode: {}, // 流程图点击，节点数据地址暂存
      parentNodes: [], // 流程图点击，节点父级数据地址暂存
      nodeType: false, // modal中节点类型切换popover
      delPopover: false, // modal中节点删除切换popover
      isEditNode: false, // modal中是否显示input框编辑名字
      nodeStatus: {}, // 每个节点的表单字段状态集合，id: [...]形式
      actStu: [], // 当前选择的节点的表单字段
      userList: [
        {
          label: '全部成员',
          children: [
            {
              label: '成员1'
            },
            {
              label: '成员2'
            },
            {
              label: '成员3'
            },
            {
              label: '成员4'
            }
          ]
        },
        {
          label: '未分配成员',
          children: [
            {
              label: '成员1'
            },
            {
              label: '成员2'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    flowChartAdd(data) {
      //   console.log(data)
      const flowObj = this.setNodeData(data.type)
      data.node.splice(data.index, 0, flowObj)
    },
    flowNodeClick(data) {
      console.log(data)
      this.flowModal = true
      this.clickedNode = data.node
      this.parentNodes = data.parent
      this.flowTabName = 'first'
      // 处理表单状态
      this.actStu = this.nodeStatus[data.node.id]
      // 处理其他状态
      this.flowSenior = this.seniorList[data.node.id]
      for (const item of this.baseSet) {
        item.isHide = this.flowSenior[item.key]
      }
      console.log(this.actStu)
    },
    setNodeData(t) {
      // 分支节点数据模型创建
      const obj = {
        isInsert: true,
        id: this.newGuid(),
        typeId: t
      }
      if (t === 4) {
        obj.isInsert = false
      } else {
        obj.name = '未命名节点'
        obj.showDel = false
      }
      if (t === 1) {
        // 审批节点
        obj.type = 'approval'
      } else if (t === 2) {
        // 普通节点
        obj.type = 'step'
      } else if (t === 3) {
        // 抄送节点
        obj.type = 'copy'
      } else if (t === 4) {
        // 分支节点
        obj.type = 'branch'
        obj.children = [
          {
            isInsert: false,
            showDel: false,
            children: []
          },
          {
            isInsert: false,
            showDel: false,
            children: []
          }
        ]
      }
      return obj
    },
    doneCreate(data) {
      //   console.log(data)
      if (data.index === -1) {
        clearInsert(data.node)
        return
      }
      // 递归函数，用于清空节点分支所有的插入状态
      function clearInsert(result) {
        for (const item of result) {
          item.isInsert = false
          if (item.children) {
            clearInsert(item.children)
          }
        }
      }
      data.node[data.index].isInsert = false
    },
    bandNodeStatus(status) {
      const _this = this
      // 暂存数据
      //   const temporary = {}
      // 为流程图每个节点绑定状态
      const data = clone(status)
      recursiveNode(this.flowChart, data)
      function recursiveNode(result, obj) {
        for (const item of result) {
          // 如果是结束节点，跳过当前循环
          if (item.type === 'end') {
            continue
          }
          if (item.typeId === 4 && item.children) {
            recursiveNode(item.children)
          } else {
            // 表单状态
            _this.nodeStatus[item.id] = obj
            // 其他状态
            const normalNode = {
              feedback: true,
              backlog: true,
              fallback: true,
              timeout: true,
              verify: 1, // 提交校验
              SerialNum: false,
              Proposer: false,
              ApplyTime: false,
              UpdateTime: false
            }
            const startNode = {
              needPw: false, // 填写密码
              password: '',
              withdraw: false, // 撤回
              flowlog: false, // 流程日志
              frequency: false, // 填写次数
              freqnum: 0, // 次数
              verify: 1, // 提交校验
              SerialNum: false,
              Proposer: false,
              ApplyTime: false,
              UpdateTime: false
            }
            if (item.type === 'start') {
              _this.seniorList[item.id] = startNode
            } else if (item.typeId !== 3) {
              _this.seniorList[item.id] = normalNode
            } else if (item.typeId === 3) {
              _this.seniorList[item.id] = {
                SerialNum: false,
                Proposer: false,
                ApplyTime: false,
                UpdateTime: false
              }
            }
          }
        }
      }
      console.log(this.nodeStatus)
      //   console.log(this.flowChart)
      function clone(v) {
        const o = []
        for (const item of v) {
          const arr = []
          for (const val of item) {
            const obj = JSON.parse(JSON.stringify(val))
            arr.push(obj)
          }
          o.push(arr)
        }
        return o
      }
    },
    switchNodeType(t) {
      // 流程图节点类型切换
      this.clickedNode.typeId = t
      if (t === 1) {
        // 审批节点
        this.clickedNode.type = 'approval'
      } else if (t === 2) {
        // 普通节点
        this.clickedNode.type = 'step'
      } else if (t === 3) {
        // 抄送节点
        this.clickedNode.type = 'copy'
      }
      this.nodeType = false
    },
    globalSetting(i) {
      // 节点配置全局设置
      for (const key in this.nodeStatus) {
        if (this.nodeStatus.hasOwnProperty(key)) {
          const element = this.nodeStatus[key]
          setGlobal(element)
        }
      }
      function setGlobal(data) {
        for (const item of data) {
          for (const val of item) {
            val.status = i
          }
        }
      }
    },
    delClickNode() {
      const _this = this
      // 删除当前点击的节点
      for (const [index, item] of this.parentNodes.entries()) {
        // console.log(index)
        // console.log(item)
        if (item.id === _this.clickedNode.id) {
          _this.delPopover = false
          _this.flowModal = false
          _this.parentNodes.splice(index, 1)
          _this.clickedNode = {}
          _this.parentNodes = []
          _this.this.actStu = []
          _this.$message.success('删除成功！')
        }
      }
    },
    getFlowChart() {
      console.log(JSON.stringify(this.flowChart))
    },
    handelBaseBtn(i, status) {
      if (status === 1) {
        this.baseSet[i].isHide = false
      } else if (status === 2) {
        this.baseSet[i].isHide = true
      }
      this.flowSenior[this.baseSet[i].key] = this.baseSet[i].isHide
    },
    statusToogle(a, b, c) {
      // 流程图节点编辑中，表单item状态修改
      this.actStu[a][b].status = c
    },
    beforeLeaveTabs(activeName, oldActiveName) {
      // console.log('离开之前触发')
      // console.log(activeName)
      // console.log(oldActiveName)
      this.targetTabs = activeName
      if (
        oldActiveName === 'first' &&
        activeName !== 'first' &&
        this.idEditForm
      ) {
        // 判断离开编辑表单是否修改过
        this.tipsSave = true
        this.modalType = 1
        this.$store.commit('formOnChange', false)
        return false
      }
    },
    saveEidtForm() {
      // 保存并跳转到用户当前想去的tabs
      this.tipsSave = false
      this.saveFormData()
      this.activeName = this.targetTabs
      // console.log(this.viewList)
      console.log(JSON.stringify(this.viewList))
    },
    notSaveLeave() {
      // 不保存但是跳转到用户当前想去的tabs,不清空用户修改的
      this.tipsSave = false
      this.activeName = this.targetTabs
    },
    saveFormData() {
      // 右上角保存按钮
      console.log(this.viewList)
      this.$store.commit('formOnChange', false)
    },
    saveEdit(data) {
      // 保存模板名称图标设置
      console.log(data)
      seaveEditTmp(data).then(res => {
        console.log(res.data)
        if (res.data.code) {
          this.$message.success(res.data.msg)
        } else {
          this.$message.success(res.data.msg)
        }
      })
    },
    settingSelect(index) {
      // 全局设置类别选择
      this.settingList.forEach(item => {
        item.checked = false
      })
      this.settingList[index].checked = true
      this.activeType = index
    },
    handleTags(index) {
      // 时间标签点击处理
      this.timeTags[index].checked = !this.timeTags[index].checked
    },
    releaseHandle(type) {
      // type: 2最后确认发布 3放弃所有更改
      this.tipsSave = true
      this.modalType = type
    },
    releaseSubmint() {
      // 保存所有并提交
    },
    emptySubmit() {
      // 放弃所有更改清空数据按钮提交
    },
    statusHandle(type) {
      // 状态switch开关 1：应用状态  2：申请通道状态
      if (type === 1) {
        // 应用状态
        this.usingStu = !this.usingStu
      } else if (type === 2) {
        // 申请通道状态
        this.applyStu = !this.applyStu
      }
    },
    zoomFlowChart(t) {
      // 流程图缩放操作t： 0 缩小一级，1放大一级
      if (t === 0) {
        // 流程图缩小一级
        this.scaleVal = this.scaleVal - 0.1
      } else if (t === 1) {
        // 流程图放大一级
        this.scaleVal = this.scaleVal + 0.1
      }
    },
    importToImg() {
      this.$message({
        message: '正在制作并导出流程图片，请稍等...',
        duration: 5000,
        type: 'success'
      })
      // 直接选择要截图的dom，就能截图，但是因为canvas的原因，生成的图片模糊
      //   window
      //     .html2canvas(document.querySelector('#flowchart'))
      //     .then(function(canvas) {
      //       document.body.appendChild(canvas)
      //     })
      // 创建一个新的canvas
      var canvas2 = document.createElement('canvas')
      var _canvas = document.querySelector('#flowchart')
      var w = parseInt(window.getComputedStyle(_canvas).width)
      var h = parseInt(window.getComputedStyle(_canvas).height)
      // 将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
      canvas2.width = w * 2
      canvas2.height = h * 2
      canvas2.style.width = w + 'px'
      canvas2.style.height = h + 'px'
      // 可以按照自己的需求，对context的参数修改,translate指的是偏移量
      //  var context = canvas.getContext("2d");
      //  context.translate(0,0);
      var context = canvas2.getContext('2d')
      context.scale(2, 2)
      window
        .html2canvas(document.querySelector('#flowchart'), { canvas: canvas2 })
        .then(function(canvas) {
          //   document.body.appendChild(canvas)
          // canvas转换成url，然后利用a标签的download属性，直接下载，绕过上传服务器再下载
          var filename = 'xier_flowchart' + new Date().getTime()
          document.querySelector('#imgdown').setAttribute('download', filename)
          document
            .querySelector('#imgdown')
            .setAttribute('href', canvas.toDataURL())
          document.querySelector('#imgdown').click()
        })
    },
    newGuid() {
      var guid = ''
      for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16)
        guid += n
        if (i === 8 || i === 12 || i === 16 || i === 20) guid += '-'
      }
      return guid
    }
  },
  created() {
    //  数据初始化一次
    if (this.currently.length === 0) {
      this.showEdit = false
    } else {
      this.showEdit = true
    }
    // 初始化状态数据
    const statusArr1 = []
    for (const item of this.viewList) {
      const group = item.map(v => {
        const obj = {
          type: v.type,
          name: v.name,
          text: v.text,
          status: 1
        }
        return obj
      })
      statusArr1.push(group)
    }
    // 给每个node节点绑定表单字段状态
    this.bandNodeStatus(statusArr1)
  },
  mounted() {
    this.flowHeight = window.innerHeight - 190
  },
  destroyed() {
    this.$store.commit('clearFlow', '')
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 重置样式，用于重写element-ui样式，自定义自己的样式 */
.app-container {
  /* tabs 切换头部样式重写*/
  .flow-tabs {
    .el-tabs__header {
      background-color: rgba(11, 178, 122, 0.4);
      .el-tabs__nav-wrap {
        .el-tabs__nav-scroll {
          .el-tabs__nav {
            left: 50%;
            transform: translateX(-50%) !important;
            .el-tabs__item {
              .serial {
                font-style: normal;
                width: 20px;
                height: 20px;
                margin-right: 15px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background-color: #c3ccc3;
                color: #fff;
              }
              &:hover {
                .serial {
                  background-color: #fff;
                  color: #0bb27a;
                }
              }
              &.is-active {
                .serial {
                  background-color: #0bb27a;
                  color: #fff;
                }
                &:hover {
                  .serial {
                    background-color: #fff;
                    color: #0bb27a;
                  }
                }
              }
            }
          }
        }
        &::after {
          height: 0;
        }
      }
    }
    .el-tabs__content {
      padding-top: 4px;
    }
    .global-settings {
      .el-card {
        margin-bottom: 15px;
        .el-card__header {
          font-size: 15px;
        }
        &.card-menu {
          .el-card__body {
            padding: 0;
          }
        }
      }
    }
    .release-box-card {
      .el-card__body {
        padding: 0;
      }
    }
  }
  .save-btn {
    position: absolute;
    top: 0;
    right: 4px;
    color: #fff;
    height: 40px;
    border: none;
    border-left: 1px solid #fff;
    background-color: transparent;
    .svg-icon {
      margin-right: 4px;
    }
    &:hover {
      color: #fff;
      background-color: transparent;
    }
  }
}
body {
  .tips-save-modal {
    .ivu-modal-wrap {
      .ivu-modal {
        .ivu-modal-content {
          .ivu-modal-body {
            .save-box {
              text-align: center;
              padding-top: 26px;
              .svg-icon {
                font-size: 40px;
                color: #0bb27a;
              }
              > p {
                margin: 46px 0;
                font-size: 15px;
                line-height: 25px;
              }
              > .el-button {
                margin: 0px;
                width: 100%;
                margin-bottom: 15px;
              }
              .cancel {
                display: inline-block;
                color: #b0b0b9;
                // margin-bottom: 15px;
                cursor: pointer;
              }
              .modal-title-release {
                text-align: center;
                margin: 10px 0px 50px 0px;
              }
              .release-btn {
                padding-bottom: 10px;
                > button {
                  height: 40px;
                  padding: 0 15px;
                  border-radius: 3px;
                  border: none;
                  cursor: pointer;
                  white-space: nowrap;
                  box-sizing: border-box;
                  outline: none;
                  border: none;
                }
                .xier-btn-primary {
                  width: 140px;
                  color: #fff;
                  background-size: 200% auto;
                  background-image: linear-gradient(
                    to right,
                    #0fd693 0,
                    #5bf0be 51%,
                    #0fd693 100%
                  );
                  transition: all ease 0.2s;
                  &:hover {
                    background-position: right center;
                    color: #fff;
                  }
                }
                .btn-defaut {
                  color: #b0b0b9;
                  background: #fff;
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
  .flow-node-edit {
    padding-top: 55px;
    position: relative;
    .node-header {
      width: 726px;
      position: fixed;
      top: 0;
      z-index: 8;
      height: 55px;
      padding-left: 15px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &.bg01 {
        background: linear-gradient(90deg, #0bb27a 0, #79e9c3 99%);
      }
      &.bg02 {
        background: linear-gradient(90deg, #324963 3%, #828fa5 93%);
      }
      &.bg03 {
        background: linear-gradient(120deg, #afafb8 1%, #dfdfe8 100%);
      }
      .node-name {
        width: 500px;
        padding: 0 15px 0 0;
        font-size: 15px;
        line-height: 22px;
        cursor: pointer;
        i {
          font-size: 17px;
          margin-left: 4px;
        }
      }
      .node-action {
        flex-shrink: 0;
        position: relative;
        width: 215px;
        height: 100%;
        padding: 0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .desc {
          opacity: 0.6;
        }
        .select-node {
          border: none;
          background-color: transparent;
          color: #fff;
          height: 30px;
          padding: 0 13px;
          border-right: 1px solid #fff;
          cursor: pointer;
          > i {
            margin-left: 4px;
          }
        }
        .del-btn {
          margin-left: 4px;
          cursor: pointer;
          &:focus {
            outline: none;
          }
        }
      }
    }
    .node-principal {
      padding: 15px 15px 5px;
      background-color: #fff;
      .select-user {
        position: relative;
        padding: 0 0 15px;
        margin: 0 5px;
        .title {
          font-size: 13px;
          color: #2b3441;
        }
        .user-container {
          justify-content: flex-start;
          flex-wrap: nowrap;
          position: relative;
          width: 100%;
          padding: 10px 0 0;
          .user-wraper {
            display: inline-flex;
            flex-wrap: wrap;
            padding-top: 10px;
            .select-user-btn {
              background-color: #fff;
              width: 25px;
              height: 25px;
              margin-bottom: 10px;
              border-radius: 50%;
              text-align: center;
              line-height: 24px;
              color: #0bb27a;
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
              cursor: pointer;
              > i {
                font-weight: 800;
              }
            }
          }
        }
      }
    }
    .flow-chart-tabs {
      .el-tabs__header {
        border-top: 1px solid #f5f5f7;
        margin: 0;
        .el-tabs__nav-wrap {
          padding: 0 20px;
        }
      }
      .el-tabs__content {
        .el-tab-pane {
          padding: 0 20px;
          &.field-power {
            .question-setting-header {
              width: 100%;
              height: 50px;
              font-size: 13px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .desc-text {
                margin-left: 10px;
                font-size: 12px;
                color: #b0b0b9;
              }
              .config-btn-group {
                .btn-label {
                  font-size: 12px;
                  color: #b0b0b9;
                }
                .el-button-group {
                  margin-left: 6px;
                  .el-button {
                    border: none;
                    &:nth-of-type(1) {
                      border-left: 1px solid #dcdfe6;
                    }
                    &:hover {
                      background-color: #0bb27a;
                      color: #fff;
                    }
                  }
                }
              }
            }
            .field-list-setting {
              list-style: none;
              width: 100%;
              height: 60px;
              margin-bottom: 10px;
              background: #fff;
              border-radius: 3px;
              -webkit-box-shadow: rgba(0, 0, 0, 0.1) 0 1px 2px;
              box-shadow: rgba(0, 0, 0, 0.1) 0 1px 2px;
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              -webkit-box-pack: justify;
              -ms-flex-pack: justify;
              justify-content: space-between;
              li {
                flex: 1;
                border-right: 1px solid #f5f5f7;
                flex-grow: 2;
                position: relative;
                height: 100%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                .svg-icon {
                  margin-right: 6px;
                  color: #cacad3;
                  font-size: 14px;
                }
                .select-action {
                  background: #fff;
                  position: absolute;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  left: 0;
                  z-index: 4;
                  cursor: pointer;
                  opacity: 0;
                  transition: all 0.3s;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  .el-button-group {
                    .el-buttom {
                      &:hover {
                        color: #606266;
                        border: none;
                      }
                    }
                  }
                }
                &:hover {
                  .select-action {
                    opacity: 1;
                  }
                }
              }
            }
            .flow-form-setting {
              border-radius: 3px;
              background-color: #fff;
              box-shadow: rgba(0, 0, 0, 0.1) 0 1px 2px 0;
              .form-item-wraper {
                border-bottom: 1px solid #ebebf0;
                align-items: stretch;
                .form-list-item {
                  .item-preview {
                    display: flex;
                    flex-direction: column;
                    padding: 15px 20px 20px;
                    position: relative;
                    width: 100%;
                    .item-label {
                      font-size: 14px;
                      padding-bottom: 5px;
                    }
                    .item-tips {
                      color: #b4b4bc;
                      margin-bottom: 10px;
                      font-size: 12px;
                      line-height: 1.5;
                    }
                    .item-value {
                      .el-input {
                        .el-input__prefix {
                          line-height: 32px;
                          left: 8px;
                          .title-icon {
                            font-size: 13px;
                          }
                        }
                      }
                      .el-radio-group.is-vertical {
                        .el-radio {
                          display: block;
                          margin-left: 0;
                          margin-top: 10px;
                        }
                      }
                      .el-checkbox-group.is-vertical {
                        .el-checkbox {
                          display: block;
                          margin-left: 0;
                          margin-top: 10px;
                        }
                      }
                      .select-img-list {
                        .picture-box {
                          .el-checkbox {
                            width: 100%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                          }
                        }
                      }
                      .edit-table {
                      }
                      .ivu-table-wrapper {
                        .ivu-table-body {
                          .ivu-table-cell {
                            .el-checkbox-group {
                              .el-checkbox {
                                &:nth-of-type(1) {
                                  margin-left: 30px;
                                }
                              }
                            }
                          }
                        }
                      }
                      .select-img-list {
                        padding-top: 6px;
                        .picture-box {
                          width: 150px;
                          margin: 0 auto;
                          margin-top: 14px;
                          text-indent: 6px;
                          min-height: 200px;
                          background: #fafafb;
                          border-radius: 3px;
                          padding: 5px;
                          transition: 0.3s all;
                          border: 1px solid #f5f5f7;
                          > img {
                            display: block;
                            width: 100%;
                            height: 154px;
                            border-radius: 2px;
                            margin-bottom: 8px;
                          }
                        }
                      }
                    }
                    .auth-edit-actions {
                      position: absolute;
                      top: 0;
                      right: 0;
                      bottom: 0;
                      left: 0;
                      z-index: 4;
                      cursor: pointer;
                      background: rgba(121, 233, 195, 0.3);
                      opacity: 0;
                      transition: all 0.3s;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    }
                    &:hover {
                      .auth-edit-actions {
                        opacity: 1;
                      }
                    }
                  }
                  &.el-col-12 {
                    .item-preview {
                      .item-value {
                        .upload-demo {
                          .el-upload--text {
                            width: 100%;
                            .el-upload-dragger {
                              width: 100%;
                            }
                          }
                        }
                      }
                    }
                  }
                  &.el-col-8 {
                    .item-preview {
                      .item-value {
                        .upload-demo {
                          .el-upload--text {
                            width: 100%;
                            .el-upload-dragger {
                              width: 100%;
                            }
                          }
                        }
                      }
                    }
                  }
                  &.el-col-6 {
                    .item-preview {
                      .item-value {
                        .upload-demo {
                          .el-upload--text {
                            width: 100%;
                            .el-upload-dragger {
                              width: 100%;
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
          &.senior-config {
            .flow-setting {
              position: relative;
              padding: 20px 0;
              .flow-setting-title {
                display: flex;
                align-items: center;
                font-size: 14px;
                .svg-icon {
                  font-size: 17px;
                  margin-right: 6px;
                }
                .title-label {
                  margin-right: 15px;
                  font-weight: 500;
                }
              }
              .setting-tips {
                margin: 10px 0 0 20px;
                color: rgba(43, 52, 65, 0.6);
              }
              &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 20px;
                width: 635px;
                height: 1px;
                background-color: rgba(43, 52, 65, 0.1);
              }
            }
          }
        }
      }
    }
  }
  .el-popover {
    &.node-del {
      padding: 30px 15px 15px;
      text-align: center;
      .del-box {
        > p {
          &:nth-of-type(1) {
            font-size: 17px;
            margin-bottom: 10px;
          }
          &:nth-of-type(2) {
            font-size: 10px;
            margin-bottom: 10px;
            color: #b0b0b9;
          }
        }
      }
    }
    &.node-type {
      .switch-node-type {
        padding: 10px;
        list-style: none;
        .title {
          margin-bottom: 11px;
          font-size: 13px;
          color: #2b3441;
        }
        .item {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          width: 100%;
          height: 80px;
          padding: 18px 20px;
          border-radius: 5px;
          color: #fff;
          cursor: pointer;
          &:nth-last-of-type(-n + 3) {
            margin-bottom: 10px;
          }
          &.bg01 {
            background: linear-gradient(90deg, #0bb27a 0, #79e9c3 99%);
          }
          &.bg02 {
            background: linear-gradient(90deg, #324963 3%, #828fa5 93%);
          }
          &.bg03 {
            background: linear-gradient(120deg, #afafb8 1%, #dfdfe8 100%);
          }
          > i {
            position: absolute;
            right: 10px;
            top: 10px;
            opacity: 0.5;
          }
          > p {
            &:nth-of-type(1) {
              font-size: 15px;
            }
            &:nth-of-type(2) {
              font-size: 12px;
              opacity: 0.7;
            }
          }
        }
      }
    }
    &.select-user-popper {
      padding: 0;
      .user-select-box {
        height: 500px;
        position: relative;
        padding-bottom: 51px;
        .el-tabs {
          .el-tabs__header {
            .el-tabs__nav-wrap {
              .el-tabs__nav-scroll {
                padding-left: 12px;
              }
            }
          }
          .el-tabs__content {
            .el-tab-pane {
              height: 396px;
              position: relative;
              overflow: hidden;
              overflow-y: auto;
              .search-container {
                position: absolute;
                width: 100%;
                padding: 8px 10px;
                border-top-left-radius: 3px;
                border-top-right-radius: 3px;
                background: #fff;
                box-shadow: 0 2px 2px 0 rgba(35, 32, 42, 0.1);
              }
              .tree-container {
                margin-top: 54px;
                padding: 0 10px;
              }
            }
          }
        }
        .select-footer {
          position: absolute;
          width: 100%;
          height: 50px;
          bottom: 0;
          left: 0;
          border-top: 1px solid #ebebf0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 自定义样式，由于有scoped属性，所以只对当前tamplate中的 html生效，优化打包效率*/
.app-container {
  .flow-tabs {
    .global-settings {
      .setting-menu {
        list-style: none;
        padding: 8px 0px;
        > li {
          height: 50px;
          line-height: 50px;
          padding: 0 18px;
          cursor: pointer;
          font-size: 14px;
          color: #adb1b6;
          .svg-icon {
            margin-right: 10px;
          }
          &.active {
            color: #2b3441;
          }
          &:hover {
            color: #2b3441;
            background: #fafafb;
          }
        }
      }
      .setting-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 15px;
        margin-bottom: 15px;
        font-size: 16px;
        border-bottom: 1px solid rgba(43, 52, 65, 0.2);
      }
      .setting-body {
        .setting-item {
          margin-bottom: 15px;
          .item-checked {
            height: 40px;
            line-height: 40px;
            margin-bottom: 16px;
          }
          .item-body {
            overflow: hidden;
            .setting-input {
              float: left;
              margin-left: 40px;
              margin-top: 24px;
            }
            &.limit-time {
              > span {
                display: inline-block;
                margin-right: 16px;
                cursor: pointer;
                padding: 3px 8px;
                border-radius: 3px;
                &:hover {
                  color: #0bb27a;
                }
                &.selected {
                  background-color: rgba(11, 178, 122, 0.7);
                  color: #fff;
                  &:hover {
                    background-color: rgba(11, 178, 122, 0.7);
                    color: #fff;
                  }
                }
              }
            }
          }
        }
      }
    }
    .flow-chart-pane {
      .flowchart-container {
        background-color: #f5f5f7;
        width: 100%;
        overflow: hidden;
        overflow-y: auto;
        overflow-x: auto;
        position: relative;
        .zoom-container {
          position: fixed;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 40px;
          width: 190px;
          right: 35px;
          margin-top: 30px;
          z-index: 10;
          > div {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 6px;
            background: #fff;
            color: #c1c1cd;
            cursor: pointer;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
            user-select: none;
            .zoom-icon {
              font-size: 15px;
            }
          }
          > span {
            color: #6c747c;
            font-size: 13px;
          }
        }
      }
    }
    .release-box-card {
      margin-bottom: 10px;
      .release-submit {
        flex-wrap: wrap;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 80px 0 80px 50px;
        > img {
          vertical-align: middle;
          border-style: none;
          display: inline-flex;
          width: 280px;
        }
        .release-handle {
          flex-wrap: wrap;
          width: calc(100% - 280px);
          display: flex;
          align-items: center;
          justify-content: center;
          > div {
            width: 100%;
            text-align: center;
            > button {
              width: 230px;
              height: 44px;
              margin: 0 auto;
              outline: none;
              font-size: 14px;
              padding: 0 15px;
              border-radius: 3px;
              cursor: pointer;
            }
          }
          .title {
            font-size: 18px;
            font-weight: 500;
            color: #6b737b;
          }
          .last-publish {
            margin-top: 5px;
            font-size: 12px;
            color: #b0b0b9;
          }
          .sub-title {
            margin-top: 8px;
            font-size: 11px;
            color: #b0b0b9;
            text-align: center;
          }
          .xier-btn-primary {
            border: none;
            color: #fff;
            background-size: 200% auto;
            background-image: linear-gradient(
              to right,
              #0fd693 0,
              #5bf0be 51%,
              #0fd693 100%
            );
            transition: all ease 0.2s;
            &:hover {
              background-position: right center;
              color: #fff;
            }
          }
          .xier-btn-defaut {
            color: #6b737b;
            background: #fff;
            border: 1px solid #cacad3;
          }
        }
      }
      .release-item {
        width: 100%;
        padding: 15px 20px;
        border-top: 1px solid #ebebf0;
        background-color: #fff;
        color: #2b3441;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item-desc {
          .title {
            font-size: 15px;
            font-weight: 500;
          }
          .sub-title {
            margin-top: 5px;
            font-size: 12px;
            color: #b0b0b9;
          }
        }
        .item-switch {
          > button {
            outline: none;
            height: 34px;
            padding: 0 15px;
            border-radius: 3px;
            border: none;
            cursor: pointer;
            white-space: nowrap;
            box-sizing: border-box;
            color: #fff;
            margin-left: 8px;
            width: 55px;
            transition: all ease 0.2s;
            &.close {
              background: #e46a3d;
              background-image: linear-gradient(
                90deg,
                rgba(246, 172, 192, 0.5),
                rgba(225, 65, 65, 0.5)
              );
            }
            &.open {
              background: #2aae8a;
              background-image: linear-gradient(
                90deg,
                rgba(199, 255, 199, 0.5),
                rgba(21, 221, 176, 0.5)
              );
            }
          }
        }
      }
    }
  }
}
</style>
