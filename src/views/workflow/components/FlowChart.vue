<template>
    <div class="flowchart-box">
        <div class="flow-node" v-for="(item, index) in data" :key="index" :class="{ 'step-node': item.type !== 'branch' && item.type !== 'end', 'branch-node': item.type === 'branch' , 'end-node': item.type === 'end' }">
            <!-- 主节点 -->
            <div class="deal-node-box" v-if="(item.type !== 'branch' && item.type !== 'end') && !item.isInsert" @click="clickNode(data, item)">
                <div class="head-row" :class="{'header-bg1': item.type === 'start' || item.type === 'step', 'header-bg2': item.type === 'approval', 'header-bg3': item.type === 'copy'}">
                    <span class="text">{{item.name}}</span>
                    <i class="iconfont icon-bianji header-icon" v-if="item.type === 'start'|| item.type === 'step'"></i>
                    <i class="iconfont icon-shenpi header-icon" v-if="item.type === 'approval'"></i>
                    <i class="iconfont icon-zhifeiji header-icon" v-if="item.type === 'copy'"></i>
                    <el-popover popper-class="node-del" placement="right" v-model="item.showDel" width="260" trigger="click">
                        <div class="del-box">
                            <P>是否确认删除该节点？</P>
                            <el-button @click="item.showDel = false">取消</el-button>
                            <el-button type="danger" @click="delNode(index)">确认删除</el-button>
                        </div>
                        <span slot="reference" v-if="item.type !== 'start'" class="del-btn" @click="showDelMenu(index)">
                            <i class="el-icon-close"></i>
                        </span>
                    </el-popover>
                </div>
                <div class="foot-row">
                    <div class="foot-principal">
                        <span>未设置负责人</span>
                    </div>
                    <div class="foot-note">
                        <svg-icon icon-class="to_view" />8</div>
                </div>
            </div>
            <div class="line-in-middle" v-if="item.type !== 'branch' && item.type !== 'end'">
                <div v-if="!item.isInsert" class="handle-box">
                    <el-popover popper-class="node-type" placement="right" width="160" trigger="click">
                        <ul class="select-node">
                            <li @click="addClickNode(data, index + 1, 1)">
                                <i class="iconfont icon-shenpi"></i>审批节点</li>
                            <li @click="addClickNode(data, index + 1, 2)">
                                <i class="iconfont icon-bianji"></i>填写节点</li>
                            <li @click="addClickNode(data, index + 1, 3)">
                                <i class="iconfont icon-zhifeiji"></i>抄送节点</li>
                            <li @click="addClickNode(data, index + 1, 4)">
                                <i class="iconfont icon-zuzhijiagou"></i>添加子分支</li>
                        </ul>
                        <button slot="reference" class="add-bar">
                            <i class="el-icon-plus"></i>
                        </button>
                    </el-popover>
                </div>
                <div v-if="item.isInsert" class="start-insert-node" @click="stopProp">
                    <div class="insert">
                        <div class="insert-node-wrapper">
                            <div class="wrapper-header-bg" :class="{'bg01': item.type === 'approval', 'bg02': item.type === 'step', 'bg03': item.type === 'copy'}"></div>
                            <div class="header">
                                <p>节点名称</p>
                                <el-input v-model="item.name" placeholder="请输入节点名称"></el-input>
                            </div>
                            <div class="content">
                                <p class="title">负责人</P>
                                <div class="user-box">
                                    <div class="add-bth">
                                        <svg-icon icon-class="g_add" />
                                    </div>
                                </div>
                            </div>
                            <div class="footer">
                                <el-button type="primary" size="mini" @click="complete(data, index)">创建</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 主节点分支节点 -->
            <div class="branch" v-if="item.type === 'branch'">
                <div class="branch-box">
                    <div class="add-branch" @click="addBranch(index)" title="新增子分支">
                        <i class="el-icon-plus"></i>
                    </div>
                    <div class="sub-branch" v-for="(info, list) in item.children" :key="list">
                        <div v-if="list === 0" class="top-left-cover-line"></div>
                        <div v-if="list === item.children.length - 1" class="top-right-cover-line"></div>
                        <div class="sub-branch-filter">
                            <div class="filter-node-box">
                                <div class="auto-judge">
                                    <div class="head-row">
                                        <p class="head-title">所有数据可进入该分支</p>
                                        <el-popover popper-class="node-del" placement="right" v-model="info.showDel" width="260" trigger="click">
                                            <div class="del-box">
                                                <P>是否确认删除该分支？</P>
                                                <el-button @click="info.showDel = false">取消</el-button>
                                                <el-button type="danger" @click="delNode(index, list)">确认删除</el-button>
                                            </div>
                                            <span slot="reference" class="del-btn" @click="showDelMenu(index, list)">
                                                <i class="el-icon-close"></i>
                                            </span>
                                        </el-popover>
                                    </div>
                                    <div class="footer-row">
                                        <span>筛选数据</span>
                                    </div>
                                </div>
                                <div class="add-under-branch">
                                    <el-popover popper-class="node-type" placement="right" width="160" trigger="click">
                                        <ul class="select-node">
                                            <li @click="addClickNode(info.children, 0, 1)">
                                                <i class="iconfont icon-shenpi"></i>审批节点</li>
                                            <li @click="addClickNode(info.children, 0, 2)">
                                                <i class="iconfont icon-bianji"></i>填写节点</li>
                                            <li @click="addClickNode(info.children, 0, 3)">
                                                <i class="iconfont icon-zhifeiji"></i>抄送节点</li>
                                            <li @click="addClickNode(info.children, 0, 4)">
                                                <i class="iconfont icon-zuzhijiagou"></i>添加子分支</li>
                                        </ul>
                                        <button slot="reference" class="add-bar">
                                            <i class="el-icon-plus"></i>
                                        </button>
                                    </el-popover>
                                </div>
                                <flow-chart v-if="info.children.length !== 0" @clickNode="outClickNode" @addClickNode="outAddClickNode" @complete="creatNode" :data="info.children"></flow-chart>
                            </div>
                        </div>
                        <div v-if="list === 0" class="bottom-left-cover-line"></div>
                        <div v-if="list === item.children.length - 1" class="bottom-right-cover-line"></div>
                    </div>
                </div>
                <!-- 整个分支节点下创建主节点 -->
                <div class="line-in-middle">
                    <div v-if="!item.isInsert" class="handle-box">
                        <el-popover popper-class="node-type" placement="right" width="160" trigger="click">
                            <ul class="select-node">
                                <li @click="addClickNode(data, index + 1, 1)">
                                    <i class="iconfont icon-shenpi"></i>审批节点</li>
                                <li @click="addClickNode(data, index + 1, 2)">
                                    <i class="iconfont icon-bianji"></i>填写节点</li>
                                <li @click="addClickNode(data, index + 1, 3)">
                                    <i class="iconfont icon-zhifeiji"></i>抄送节点</li>
                                <li @click="addClickNode(data, index + 1, 4)">
                                    <i class="iconfont icon-zuzhijiagou"></i>添加子分支</li>
                            </ul>
                            <button slot="reference" class="add-bar">
                                <i class="el-icon-plus"></i>
                            </button>
                        </el-popover>
                    </div>
                    <div v-if="item.isInsert" class="start-insert-node" @click="stopProp">
                        <div class="insert">
                            <div class="insert-node-wrapper">
                                <div class="wrapper-header-bg" :class="{'bg01': item.type === 'approval', 'bg02': item.type === 'step', 'bg03': item.type === 'copy'}"></div>
                                <div class="header">
                                    <p>节点名称</p>
                                    <el-input v-model="addNodeName" placeholder="请输入节点名称"></el-input>
                                </div>
                                <div class="content">
                                    <p class="title">负责人</P>
                                    <div class="user-box">
                                        <div class="add-bth">
                                            <i class="el-icon-plus"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="footer">
                                    <el-button type="primary" size="mini" @click="complete(data, index)">创建</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="item.type === 'end'" class="end-node-box">{{item.name}}</div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'FlowChart',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  watch: {},
  mounted() {},
  activated() {},
  deactivated() {
    // keep-alive 组件停用时调用。
    // 该钩子在服务器端渲染期间不被调用。
    // 在页面结束时触发该方法，可清除掉滚动方法等缓存。
  },
  methods: {
    addClickNode(node, index, type) {
      this.hideCreatNode()
      // 将当前上传给调用的父组件或当前下的递归组件上传的数据再传给父级组件
      const data = { node, index, type }
      this.$emit('addClickNode', data)
    },
    outAddClickNode(data) {
      // 递归组件新增节点将数据上传给上一级
      this.$emit('addClickNode', data)
    },
    clickNode(parent, node) {
      const data = { parent, node }
      this.$emit('clickNode', data)
    },
    outClickNode(data) {
      this.$emit('clickNode', data)
    },
    addNode(index, type) {
      // 如果选择的类型是分支节点则立即创建，不用预创建
    },
    complete(node, index) {
      // 将当前上传给调用的父组件或当前下的递归组件上传的数据再传给父级组件
      const data = { node, index }
      this.$emit('complete', data)
    },
    creatNode(data) {
      // 递归组件创建节点完成将数据上传给上一级
      this.$emit('complete', data)
    },
    showDelMenu(a, b) {
      console.log(a)
      console.log(b)
      // 展开删除操作
      if (b) {
        // 展开一条分支删除
        // console.log('展开一条分支删除')
        this.data[a].children[b].showDel = true
        return
      }
      // 展开主节点删除
      this.data[a].showDel = true
    },
    delNode(d, e, f) {
      // 删除节点
      // 展开删除操作
      if (e !== undefined && f !== undefined) {
        // 分支下的节点删除
        this.data[d].children[e].children.splice(f, 1)
        return
      } else if (e !== undefined && this.data[d].children.length > 2) {
        // 分支大于2删除
        this.data[d].children.splice(e, 1)
        this.$message.success('删除成功！')
        return
      } else if (e !== undefined && this.data[d].children.length === 2) {
        // 分支等于2删除
        this.data[d].children.splice(e, 1)
        // console.log(this.data[d].children)
        const barachArr = this.data[d].children[0].children
        this.data.splice(d, 1)
        if (barachArr.length > 0) {
          for (var i = barachArr.length - 1; i > -1; i--) {
            this.data.splice(d, 0, barachArr[i])
          }
        }
        this.$message.success('删除成功！')
        return
      }
      // 主节点删除（包括整个分支节点）
      this.data.splice(d, 1)
      this.$message.success('删除成功！')
    },
    addBranch(i) {
      // 新增分支
      const braObj = {
        isInsert: false,
        showDel: false,
        children: []
      }
      this.data[i].children.push(braObj)
    },
    stopProp(e) {
      // 阻止预创建面板的click事件冒泡向上
      var evt = e || window.event // 浏览器兼容性
      evt.stopPropagation()
    },
    hideCreatNode() {
      // 点击其他任意元素预创建面板的隐藏并调用创建逻辑
      const _this = this
      // 阻止当前元素继续向上冒泡
      window.document.onclick = function(e) {
        // console.log('冒泡到document')
        var evt = e || window.event // 浏览器兼容性
        var elem = evt.target || evt.srcElement
        // console.log(elem)
        while (elem) {
          // 循环判断至跟节点，防止点击的是div子元素
          if (elem.class && elem.class === 'start-insert-node') {
            return
          }
          elem = elem.parentNode
        }
        const data = { node: _this.data, index: -1 }
        _this.$emit('complete', data)
      }
    }
  },
  destroyed() {}
}
</script>

<style rel="stylesheet/scss" lang="scss">
/*重置ui组件样式*/
body {
  .el-popover {
    &.node-type {
      padding: 0px;
      .select-node {
        list-style: none;
        padding: 10px 0;
        transform: scale(1);
        overflow: hidden;
        transition: all 0.3s;
        transform-origin: 0 0;
        > li {
          padding: 7px 10px 7px 15px;
          cursor: pointer;
          transition: all ease 0.2s;
          .iconfont {
            color: #b0b0b9;
            margin-right: 7px;
            font-size: 16px;
          }
          &:hover {
            background: #ebebf0;
          }
        }
      }
    }
    &.node-del {
      padding: 30px 15px 15px;
      text-align: center;
      .del-box {
        > p {
          font-size: 17px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
/*自定义样式*/
.flowchart-box {
  position: relative;
  width: 100%;
  padding: 54.5px 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  min-width: min-content;
  transform-origin: 0 0 0;
  .flow-node {
    .deal-node-box {
      position: relative;
      width: 270px;
      height: 130px;
      display: inline-flex;
      flex-direction: column;
      flex-shrink: 0;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      background-color: #fff;
      cursor: pointer;
      .head-row {
        width: 100%;
        height: 50px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        color: #fff;
        padding: 0 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        &.header-bg1 {
          background: linear-gradient(90deg, #324963 3%, #828fa5 93%);
        }
        &.header-bg2 {
          background: linear-gradient(90deg, #0bb27a 0, #79e9c3 99%);
        }
        &.header-bg3 {
          background: linear-gradient(120deg, #afafb8 1%, #dfdfe8 100%);
        }
        .text {
          width: 100%;
        }
        .header-icon {
          font-size: 22px;
          color: #fff;
          opacity: 0.3;
        }
        .del-btn {
          position: absolute;
          width: 18px;
          height: 18px;
          right: -7px;
          top: -7px;
          cursor: pointer;
          opacity: 0;
          border-radius: 50%;
          background-color: #ff5d3b;
          color: #fff;
          text-align: center;
        }
      }
      .foot-row {
        color: #b0b0b9;
        padding: 0 15px;
        .foot-principal {
          height: 40px;
          padding: 10px 0;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .foot-note {
          height: 40px;
          color: #6b737b;
          border-top: 1px solid #f5f5f7;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          .svg-icon {
            font-size: 12px;
            color: #cacad3;
            margin-right: 3px;
          }
        }
      }
      &:hover {
        .head-row {
          .del-btn {
            opacity: 1;
          }
        }
      }
    }
    .line-in-middle {
      width: 240px;
      min-height: 90px;
      display: inline-flex;
      flex-shrink: 0;
      flex-grow: 1;
      position: relative;
      .handle-box {
        width: 100%;
        padding: 30px 0;
        display: flex;
        justify-content: center;
        flex-shrink: 0;
        flex-grow: 1;
        .add-bar {
          width: 30px;
          height: 30px;
          background-color: #fff;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          cursor: pointer;
          z-index: 1;
          position: relative;
          outline: 0;
          border: none;
          color: rgb(11, 178, 122);
          > i {
            font-size: 16px;
            font-weight: 800;
          }
          &:hover {
            background: rgb(11, 178, 122);
            color: #fff;
          }
        }
      }
      .start-insert-node {
        width: 100%;
        padding: 30px 0;
        display: flex;
        justify-content: center;
        flex-shrink: 0;
        flex-grow: 1;
        .insert {
          .insert-node-wrapper {
            position: relative;
            width: 260px;
            margin: 20px 0;
            background: #fff;
            border-radius: 3px;
            box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1);
            z-index: 1000;
            .wrapper-header-bg {
              width: 100%;
              height: 10px;
              &.bg01 {
                background: linear-gradient(90deg, #0bb27a 0, #79e9c3 99%);
              }
              &.bg02 {
                background: linear-gradient(90deg, #324963 3%, #828fa5 93%);
              }
              &.bg03 {
                background: linear-gradient(120deg, #afafb8 1%, #dfdfe8 100%);
              }
            }
            .header {
              width: 100%;
              height: 84px;
              padding: 10px;
              color: #2b3441;
              > p {
                margin-bottom: 10px;
                font-size: 13px;
              }
            }
            .content {
              position: relative;
              width: 100%;
              padding: 10px 10px 0;
              border-top: 1px solid #eaeaee;
              border-bottom: 1px solid #eaeaee;
              .title {
                color: #2b3441;
                font-size: 13px;
                line-height: 20px;
              }
              .user-box {
                justify-content: flex-start;
                flex-wrap: wrap;
                position: relative;
                width: 100%;
                padding: 10px 0 0;
                .add-bth {
                  width: 25px;
                  height: 25px;
                  margin-bottom: 10px;
                  border-radius: 50%;
                  background-color: #fff;
                  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
                  cursor: pointer;
                  text-align: center;
                  line-height: 24px;
                  .svg-icon {
                    color: #0bb27a;
                  }
                  &:hover {
                    background-color: rgba(11, 178, 122, 0.6);
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                    .svg-icon {
                      color: #fff;
                    }
                  }
                }
              }
            }
            .footer {
              width: 100%;
              min-height: 56px;
              padding: 0 10px;
              color: #6b737b;
              display: inline-flex;
              align-items: center;
              justify-content: flex-end;
            }
          }
        }
      }
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 2px;
        height: 100%;
        background-color: #dfdfe8;
      }
    }
    &.step-node {
      /*普通节点*/
      display: inline-flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      flex-grow: 1;
      min-height: 180px;
      width: 100%;
      padding: 0 50px;
    }
    &.branch-node {
      width: 100%;
      display: inline-flex;
      flex-shrink: 0;
      .branch {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        flex-wrap: wrap;
        align-items: center;
        width: 100%;
        min-height: 270px;
        .branch-box {
          overflow: visible;
          min-height: 180px;
          height: auto;
          border-bottom: 2px solid #dfdfe8;
          border-top: 2px solid #dfdfe8;
          position: relative;
          display: flex;
          background-color: #f5f5f7;
          .add-branch {
            width: 20px;
            height: 20px;
            border-radius: 13px;
            background-color: #0bb27a;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
            position: absolute;
            left: calc(50% - 10px);
            top: -12px;
            cursor: pointer;
            z-index: 1;
            text-align: center;
            line-height: 20px;
            i {
              color: #fff;
            }
          }
          .sub-branch {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            .top-left-cover-line {
              top: -2px;
              left: -1px;
              position: absolute;
              height: 3px;
              width: 50%;
              background-color: #f5f5f7;
            }
            .top-right-cover-line {
              top: -2px;
              right: -1px;
              position: absolute;
              height: 3px;
              width: 50%;
              background-color: #f5f5f7;
            }
            .bottom-left-cover-line {
              bottom: -2px;
              left: -1px;
              position: absolute;
              height: 3px;
              width: 50%;
              background-color: #f5f5f7;
            }
            .bottom-right-cover-line {
              bottom: -2px;
              right: -1px;
              position: absolute;
              height: 3px;
              width: 50%;
              background-color: #f5f5f7;
            }
            .sub-branch-filter {
              min-height: 220px;
              display: inline-flex;
              flex-direction: column;
              flex-grow: 1;
              .filter-node-box {
                position: relative;
                flex-direction: column;
                flex-grow: 1;
                min-height: 100%;
                padding: 30px 50px 0;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                &::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  margin: auto;
                  width: 2px;
                  height: 100%;
                  background-color: #dfdfe8;
                }
                .auto-judge {
                  position: relative;
                  display: inline-flex;
                  flex-wrap: wrap;
                  width: 260px;
                  min-height: 100px;
                  background: #fff;
                  box-shadow: 0 1px 4px 0 rgba(25, 30, 40, 0.1);
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 13px;
                  .head-row {
                    position: relative;
                    width: 100%;
                    padding: 10px;
                    border-bottom: 1px solid #ebebf0;
                    .head-title {
                      padding: 10px;
                    }
                    .del-btn {
                      position: absolute;
                      width: 18px;
                      height: 18px;
                      right: -7px;
                      top: -7px;
                      cursor: pointer;
                      opacity: 0;
                      border-radius: 50%;
                      background-color: #ff5d3b;
                      color: #fff;
                      text-align: center;
                    }
                  }
                  .footer-row {
                    width: 100%;
                    height: 35px;
                    padding: 0 18px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: space-between;
                    > span {
                      color: #0bb27a;
                    }
                  }
                  &:hover {
                    .head-row {
                      .del-btn {
                        opacity: 1;
                      }
                    }
                  }
                }
                .add-under-branch {
                  width: 100%;
                  padding: 30px 0;
                  display: flex;
                  justify-content: center;
                  flex-shrink: 0;
                  flex-grow: 1;
                  .add-bar {
                    width: 30px;
                    height: 30px;
                    background-color: #fff;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    cursor: pointer;
                    z-index: 1;
                    position: relative;
                    outline: 0;
                    border: none;
                    color: rgb(11, 178, 122);
                    > i {
                      font-size: 16px;
                      font-weight: 800;
                    }
                    &:hover {
                      background: rgb(11, 178, 122);
                      color: #fff;
                    }
                  }
                }
                .flowchart-box {
                  flex: 1;
                }
              }
            }
          }
        }
      }
    }
    &.end-node {
      .end-node-box {
        width: 50px;
        height: 50px;
        background: linear-gradient(-120deg, #dfdfe8 1%, #afafb8 100%);
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        border-radius: 100%;
        color: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
