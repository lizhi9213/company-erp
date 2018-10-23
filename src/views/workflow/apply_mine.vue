<template>
  <div class="app-container">
    <BuildPage></BuildPage>
  </div>
</template>

<script>
import BuildPage from '@/views/components/building'
export default {
  name: 'apply_newWorkflow',
  components: { BuildPage },
  watch: {},
  data() {
    // 数据data在这里
    return {}
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
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 自定义样式，由于有scoped属性，所以只对当前tamplate中的 html生效，优化打包效率*/
.app-container {
}
</style>
