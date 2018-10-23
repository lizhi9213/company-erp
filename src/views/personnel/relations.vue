<template>
  <div class="app-container">
    <BuildPage/>
    <!-- <TopOperating :blockdata="slotList">
      <div slot="title1">
        <PanelMain :name="'在职'" :endname="'人'" :number="1476" istitle :current="checked === 0" @click.native="selectPane(0)"></PanelMain>
        <PanelMain :name="'全职'" :number="325" :current="checked === 1" @click.native="selectPane(1)"></PanelMain>
        <PanelMain :name="'学习'" :number="123" :current="checked === 2" @click.native="selectPane(2)"></PanelMain>
        <PanelMain :name="'劳务派遣'" :number="123" :current="checked === 3" @click.native="selectPane(3)"></PanelMain>
        <PanelMain :name="'全职派遣'" :number="666" :current="checked === 4" @click.native="selectPane(4)"></PanelMain>
      </div>
      <div slot="title2">
        <PanelMain :name="'试用期'" :number="333" :current="checked === 5" @click.native="selectPane(5)"></PanelMain>
        <PanelMain :name="'待离职'" :number="528" :current="checked === 6" @click.native="selectPane(6)"></PanelMain>
        <PanelMain :name="'正式'" :number="123" :current="checked === 7" @click.native="selectPane(7)"></PanelMain>
      </div>
      <div slot="title3">
        <PanelMain :name="'待入职'" :number="159" :current="checked === 8" @click.native="selectPane(8)"></PanelMain>
        <PanelMain :name="'已入职'" :number="654" :current="checked === 9" @click.native="selectPane(9)"></PanelMain>
      </div>
      <div slot="commonly">
        <p>这里是主要筛选条件插槽...</p>
      </div>
      <div slot="button">
        <el-button type="primary">新增</el-button>
        <el-button type="primary" plain>导入</el-button>
        <el-button type="primary" plain>导出</el-button>
      </div>
      <div slot="filterlist">
        <p style="height: 80px;">这里是筛选详情插槽....</p>
      </div>
    </TopOperating> -->
  </div>
</template>

<script>
// import { testAPI } from '@/api/manage' // 获取封装好的请求接口，调用方式：test(参数).then(res => { console.log(res.data)})
import TopOperating from '@/views/components/TopOperating'
import PanelMain from '@/views/components/TopOperating/PanelMain.vue'
import BuildPage from '@/views/components/building'
export default {
  name: 'relationsPersonnel',
  components: {
    TopOperating,
    PanelMain,
    BuildPage
  },
  watch: {},
  data() {
    // 数据data在这里
    return {
      slotList: [
        { span: 12, name: 'title1' },
        { span: 8, name: 'title2' },
        { span: 4, name: 'title3' }
      ],
      checked: 0
    }
  },
  methods: {
    init() {
      // 处理函数
    },
    selectPane(a) {
      this.checked = a
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
