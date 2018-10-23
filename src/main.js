import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// 按需导入
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import 'iview/dist/styles/iview.css'
import {
  Modal,
  Table,
  Button
} from 'iview' // global Modal Table
// 导入element-ui
import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import '../static/fonts/iconfont.css' // 字体图标

import App from './App'
import router from './router'
import store from './store'

import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
import './mock' // simulation data

import * as filters from './filters' // global filters

Vue.component('i-button', Button)
Vue.component('Modal', Modal)
Vue.component('iviewTable', Table)
Vue.component('Treeselect', Treeselect)
Vue.prototype.$IVIEW = {}
Vue.use(Element, {
  size: 'small' // set element-ui default size
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
