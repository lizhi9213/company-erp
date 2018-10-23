import {
  SkaySipStatus
} from '@/utils/skaysip.js'
import {
  getCaller,
  setCaller
} from '@/api/sipcall'
const call = {
  state: {
    skay: null, // call 对象 用于执行呼叫，注册等操作
    // skay.oSipCall(phone) 呼叫
    // skay.oSipHangUp() 挂机
    reguser: '', // 当前注册用户
    regstatus: '', // 注册状态
    callstatus: '', // 呼叫状态
    callcode: '', // 当前通话唯一code
    caller: '未获取' // 当前主叫
  },
  mutations: {
    SET_SKAY: (state, skay) => {
      state.skay = skay
    },
    SET_REGUSER: (state, reguser) => {
      state.reguser = reguser
    },
    SET_REGSTATUS: (state, regstatus) => {
      state.regstatus = regstatus
    },
    SET_CALLSTATUS: (state, callstatus) => {
      state.callstatus = callstatus
    },
    SET_CALLCODE: (state, callcode) => {
      state.callcode = callcode
    },
    SET_CALLER: (state, caller) => {
      state.caller = caller
    }
  },

  actions: {
    callPhone({
      commit
    }, phone) {
      return new Promise(resolve => {
        resolve(call.state.skay.oSipCall(phone))
      })
    },
    callHangUp() {
      call.state.skay.oSipHangUp()
    },
    createWSS({
      commit
    }) {
      // const userId = this.$store.state.user.id
      var skay = new SkaySipStatus()
      commit('SET_SKAY', skay)

      const wssuri = '/apiwss'
      const id = this.state.user.userid
      const comId = '13'
      if (wssuri) {
        skay.sipInit(wssuri, function(msg) {
          if (skay.isInit()) {
            // skay初始化成功
            console.log('skay初始化成功!')
            skay.oSipGetConf({
              id,
              comId
            },
            function(data) {
              // 获取配置文件信息
              if (data.code === '200') {
                skay.oSipRegister(
                  data.data,
                  function(regstatus) {
                    const reguser = skay.reguser()
                    // let regstatus = ''
                    // if (skay.isReg() == 1) {
                    //   that.regstatus = "已注册";
                    // } else {
                    //   that.regstatus = msg;//"离线";
                    //   console.log(msg);
                    // }
                    // if (msg === -1) {
                    //   regstatus = '离线'
                    // } else if (msg === 0) {
                    //   regstatus = '已注册'
                    // } else if (msg === 1) {
                    //   regstatus = '示忙'
                    // } else if (msg === 2) {
                    //   regstatus = '示闲'
                    // } else {
                    //   regstatus = msg
                    // }
                    commit('SET_REGUSER', reguser)
                    commit('SET_REGSTATUS', regstatus)
                  },
                  function(data) {
                    const callstatus = data.msg
                    commit('SET_CALLSTATUS', callstatus)
                    if (data.callcode) {
                      commit('SET_CALLCODE', data.callcode)
                    } else {
                      commit('SET_CALLCODE', '')
                    }
                  }
                )
                // 读取配置文件成功
              } else {
                // 读取失败
                alert(data.msg)
              }
            }
            )
          } else {
            // skay初始化失败
            alert('skay初始化失败!')
          }
        })
      } else {
        alert('未配置WSS注册地址,暂无法使用语音功能!')
      }
    },
    getCaller({
      commit
    }, params) {
      getCaller(params).then((result) => {
        commit('SET_CALLER', result.data.data.caller)
      }).catch(() => {
        commit('SET_CALLER', '获取失败')
      })
    },
    setCaller({
      commit,
      state
    }, data) {
      data.id = this.state.user.userid
      data.comId = this.state.user.callcom
      setCaller(data).then((result) => {
        commit('SET_CALLER', data.caller)
      }).catch(() => {

      })
    }
  }
}

export default call
