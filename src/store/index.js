import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import workflow from './modules/workflow'
import call from './modules/call'
import getters from './getters'
import refresh from './modules/refresh'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    workflow,
    call,
    refresh
  },
  getters
})

export default store
