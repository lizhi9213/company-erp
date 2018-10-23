<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    // const that = this
    // setTimeout(() => {
    //   that.$store.dispatch('callPhone', '15039081466')
    //   setTimeout(() => {
    //     that.$store.dispatch('callHangUp')
    //   }, 10000)
    // }, 10000)
  }
}
</script>
