<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu mode="vertical" :show-timeout="200" :default-active="$route.path" :collapse="isCollapse" background-color="#f7f8fa" text-color="rgba(0, 0, 0, 0.58)" active-text-color="#0bb27a">
      <div class="logo-box">
        <div class="logo"></div>
      </div>
      <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar']),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu {
  .logo-box {
    padding-top: 12px;
    // height: 82px;
    width: 100%;
    box-sizing: border-box;
    .logo {
      display: block;
      width: 66%;
      height: 62px;
      margin: 0 auto;
      background-image: url(../../../../images/logo.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  &.el-menu--collapse {
    .logo-box {
      padding-top: 12px;
      .logo {
        display: block;
        width: 50%;
        height: 18px;
        margin: 0 auto;
        background-image: url(../../../../images/logo_mini.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
