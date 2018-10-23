<template>
  <div>
    <el-alert type="error" title="软电话离线，请尝试以下操作。" style="margin-bottom:15px" v-show="$store.state.call.regstatus===-1">
      <br> 1. 打开
      <el-tag type="danger">
        <a href="https://39.106.196.77:17443/" target="_blank">安全链接1</a>
      </el-tag>
      <el-tag type="danger">
        <a href="https://kf.xierxinxi.cn/" target="_blank">安全链接2</a>
      </el-tag>并选择通过安全验证
      <br> 2. 刷新页面
    </el-alert>
    <el-form :model="form" inline="">
      <el-form-item label="被叫号码">
        <el-input v-model="value" placeholder="请输入号码"></el-input>
      </el-form-item>
      <el-form-item label="主叫号码">
        <el-input v-model="caller" placeholder="请输入号码"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align:right">

      <el-tag type="warning" size="medium">{{status}}</el-tag>
      <el-button type="primary" plain :disabled="$store.state.call.regstatus===-1" @click="callout">
        <svg-icon icon-class="phone" /> 呼叫</el-button>
      <el-button type="warning" plain @click="hangUp">挂机</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'sipcall',
  data() {
    return {
      form: {},
      value: '',
      caller: '03715555555'
    }
  },
  computed: {
    status: {
      get: function() {
        console.log(this.$store.state.call.callstatus)
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
          default:
            return status
        }
      },
      set: function(value) {
        this.status = this.$store.state.call.callstatus
      }
    }
  },
  methods: {
    callout() {
      if (!this.value) {
        this.$message('请输入号码')
        return
      }
      this.$store.dispatch('callPhone', this.value)
    },
    setPhone(v) {
      this.value = v
    },
    hangUp() {
      this.$store.dispatch('callHangUp')
    }
  },

  watch: {
    status(val) {
      console.log(this.$store.state.call.callstatus)
    }
  }
}
</script>
