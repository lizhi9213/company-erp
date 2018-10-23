<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <error-log class="errLog-container right-menu-item"></error-log>

      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <!-- <el-tooltip effect="dark" content="换肤" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip> -->

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target='_blank' href="http://www.xierxinxi.cn/">
            <el-dropdown-item>
              公司官网
            </el-dropdown-item>
          </a>
          <el-dropdown-item divided>
            <el-tooltip effect="dark" :content="'当前主叫：'+$store.state.call.caller" placement="left">
              <span @click="setcaller" style="display:block;">设置主叫</span>
            </el-tooltip>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker
  },
  data: () => {
    return {
      callnotify: null
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar']),
    status: {
      get: function() {
        const status = this.$store.state.call.callstatus
        switch (status) {
          case 'Temporarily Unavailable':
            return '暂不可用，请尝试更换主叫或被叫'
          case '':
            return '空闲'
          case 'Call terminated':
            return '已挂机'
          case 'Call terminating...':
            return '终止呼叫...'
          case 'Not Found':
            return '请检查主叫/被叫号码'
          default:
            return status
        }
      },
      set: function(value) {
        this.status = this.$store.state.call.callstatus
      }
    }
  },
  created() {},
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    setcaller() {
      this.$prompt('请输入主叫号码', '提交', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.$store.state.call.caller
      })
        .then(({ value }) => {
          this.$store.dispatch('setCaller', { caller: value })
        })
        .catch(() => {})
    }
  },
  watch: {
    status(newval, oldval) {
      const _this = this
      const h = _this.$createElement
      if (
        !_this.callnotify &&
        newval !== '空闲' &&
        newval !== 'Call terminating...'
      ) {
        _this.callnotify = _this.$notify({
          title: '通话状态',
          message: h('div', [
            h('el-tag', {}, _this.status),
            h('p', '通话中请勿进行其他操作')
          ]),
          duration: 0,
          showClose: false
        })
      }
      if (_this.callnotify) {
        _this.callnotify.$children[0].$el.innerText = _this.status
      }
      if (_this.callnotify && newval === '空闲') {
        setTimeout(() => {
          _this.callnotify.close()
          _this.callnotify = null
        }, 3500)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
