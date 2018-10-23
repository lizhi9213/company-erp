<template>
  <div class="top-operating">
    <el-row v-if="blockdata.length !== 0" :gutter="rowgutter" class="panel-box">
      <el-col v-for=" (item, index) in blockdata" :key="index" :class="{'is-active':activeData[index]}" :span="item.span" @click.native="toogleActive(index)">
        <slot :name="item.name"></slot>
      </el-col>
    </el-row>
    <div class="operating-box" :class="{hidebtn: hidefilter, 'panel-box-no': blockdata.length === 0}">
      <el-button class="toogle-btn" @click="toogleFilter">
        <svg-icon icon-class="screening" />&nbsp;&nbsp;{{filbtn}}
      </el-button>
      <el-row :gutter="filgutter">
        <el-col :span="mainclo" style="min-height: 32px;">
          <slot name="commonly"></slot>
        </el-col>
        <el-col :span="btnclo" style="text-align: right; min-height: 32px;">
          <slot name="button"></slot>
        </el-col>
      </el-row>
    </div>
    <transition name="el-zoom-in-top">
      <div class="filter-box" v-show="filrerModal">
        <slot name="filterlist"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'TopOperating',
  props: {
    blockdata: {
      type: Array,
      default: () => {
        return []
      }
    },
    rowgutter: {
      type: Number,
      default: () => {
        return 18
      }
    },
    filgutter: {
      type: Number,
      default: () => {
        return 18
      }
    },
    mainclo: {
      type: Number,
      default: () => {
        // console.log(window.innerWidth)
        let mspan = 18
        if (window.innerWidth <= 1360) {
          mspan = 14
        }
        return mspan
      }
    },
    btnclo: {
      type: Number,
      default: () => {
        let bspan = 6
        if (window.innerWidth <= 1360) {
          bspan = 10
        }
        return bspan
      }
    },
    hidefilter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeData: [],
      filbtn: '筛选',
      filrerModal: false
    }
  },
  watch: {
    blockdata(val) {
      console.log(val)
      val.forEach((v, i) => {
        if (i === 0) {
          this.activeData.push(true)
        } else {
          this.activeData.push(false)
        }
      })
    }
  },
  methods: {
    toogleActive(i) {
      //   console.log(i)
      this.activeData = []
      this.$nextTick(() => {
        this.blockdata.forEach((v, i) => {
          this.activeData.push(false)
        })
        this.activeData[i] = true
      })
    },
    toogleFilter() {
      this.filrerModal = !this.filrerModal
      if (this.filrerModal) {
        this.filbtn = '收起'
      } else {
        this.filbtn = '筛选/排序'
      }
    }
  },
  created() {
    this.blockdata.forEach((v, i) => {
      if (i === 0) {
        this.activeData.push(true)
      } else {
        this.activeData.push(false)
      }
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.top-operating {
  .panel-box {
    margin: {
      bottom: 16px;
    }
    .el-col {
      > div {
        display: flex;
        text-align: center;
        cursor: pointer;
        position: relative;
        left: 0;
        top: 0;
        height: 102px;
        border: 1px solid #e1e6eb;
        border-radius: 4px;
        background: #fff;
        &::after {
          position: absolute;
          content: '';
          right: -4px;
          bottom: -4px;
          border-left: 8px solid #e1e6eb;
          border-right: 8px solid transparent;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          transform: rotate(45deg);
        }
        .panel_main {
          flex-grow: 1;
          flex-shrink: 1;
          flex-basis: auto;
          padding-top: 25px;
          .sub_main {
            border-right: 1px solid #e1e6eb;
            .sub_title {
              font-size: 13px;
            }
            .sub_value {
              padding-top: 10px;
            }
          }
          &.current {
            color: #0bb27a;
          }
        }
        .panel_main:hover,
        .panel_title:hover {
          background: #f8f8f9;
        }
        .panel_title {
          padding: 15px 0;
          flex-grow: 2;
          .title {
            font-size: 16px;
            text-align: center;
            height: 70px;
            line-height: 70px;
            border-right: 1px solid #e1e6eb;
            > span:nth-of-type(2) {
              font-size: 36px;
              font-weight: bold;
              padding: 0 10px;
            }
          }
          &.current {
            color: #0bb27a;
          }
        }
      }
      &.is-active {
        > div {
          border-color: #0bb27a;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
          &::after {
            border-left-color: #0bb27a;
          }
        }
      }
    }
  }

  .operating-box {
    margin: {
      bottom: 16px;
    }
    padding-left: 120px;
    position: relative;
    .toogle-btn {
      position: absolute;
      top: 0;
      left: 0;
    }
    &.hidebtn {
      padding-left: 0px;
      .toogle-btn {
        display: none;
      }
    }
    &.panel-box-no {
      margin-top: 0px;
    }
  }
  .filter-box {
    padding: 18px 18px 0;
    border: 1px solid #0bb27a;
    margin: {
      top: 16px;
      bottom: 16px;
    }
    position: relative;
    border-radius: 5px;
    &::before {
      content: '';
      position: absolute;
      top: -10px;
      left: 19px;
      width: 0;
      height: 0;
      border-right: 10px solid transparent;
      border-left: 10px solid transparent;
      border-bottom: 10px solid #0bb27a;
    }
    &::after {
      content: '';
      position: absolute;
      top: -9px;
      left: 20px;
      width: 0;
      height: 0;
      border-right: 9px solid transparent;
      border-left: 9px solid transparent;
      border-bottom: 9px solid #fff;
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
