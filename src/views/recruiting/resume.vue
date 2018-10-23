<template>
  <div class="app-container">
    <el-container>
      <el-header height="60px">
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" class="menu-top">
          <el-menu-item index="1">简历库</el-menu-item>
          <el-menu-item index="2">邀约</el-menu-item>
          <el-menu-item index="3">面试</el-menu-item>
          <el-menu-item index="4">通知</el-menu-item>
          <el-menu-item index="5">报到</el-menu-item>
          <el-menu-item index="6">在培</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <transition-group :enter-active-class="animate">
          <ResumeHub v-show="activeIndex==='1'" key="hub"></ResumeHub>
          <ResumeInvitation v-show="activeIndex==='2'" key="invitation"></ResumeInvitation>
          <ResumeInterview v-show="activeIndex==='3'" key="interview"></ResumeInterview>
          <ResumeNotice v-show="activeIndex==='4'" key="notice"></ResumeNotice>
          <ResumeRegister v-show="activeIndex==='5'" key="register"></ResumeRegister>
          <ResumeTrain v-show="activeIndex==='6'" key="train"></ResumeTrain>
        </transition-group>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import ResumeHub from './resumesub'
import ResumeInvitation from './resumesub/invitation'
import ResumeInterview from './resumesub/interview'
import ResumeRegister from './resumesub/register'
import ResumeNotice from './resumesub/notice'
import ResumeTrain from './resumesub/train'
export default {
  name: 'resumeRecruiting',
  components: {
    ResumeHub,
    ResumeInvitation,
    ResumeInterview,
    ResumeRegister,
    ResumeNotice,
    ResumeTrain
  },
  watch: {},
  data() {
    // 数据data在这里
    return {
      activeIndex: '1',
      animate: 'animated fadeInLeft'
    }
  },
  methods: {
    handleSelect(index, indexPath) {
      if (Number(this.activeIndex) > Number(index)) {
        this.animate = 'animated slideInLeft'
      } else {
        this.animate = 'animated slideInRight'
      }
      this.activeIndex = index
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 自定义样式，由于有scoped属性，所以只对当前tamplate中的 html生效，优化打包效率*/
.app-container {
  padding: {
    top: 5px;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
.menu-top {
  .el-menu-item {
    font-size: 15px;
  }
}
</style>
