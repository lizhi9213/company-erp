/* eslint-disable */
window.nativeRTCPeerConnection = (window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection)
var SkaySipStatus = (function () {
  function SkaySipStatus() {}
  var _isInit = false, // 状态
    oSipStack,
    oSipSessionRegister,
    oNotifICall,
    oSipSessionCall,
    initcallback, // 初始化回调
    regcallback, // 注册回调
    callcallback, // 呼叫回调
    regstatus, // 注册状态
    callstatus, // 呼叫状态
    _reguser = '', // 显示用户名
    _regusername = '', // 注册用户名
    _outPhone = '', // 呼出号码
    _inPhone = '',
    _bindUser = '',
    _comId = '',
    oConfigCall = null
  var _httpuri = 'http://192.168.30.246:8200'
  var _isReg = 0
  var _userstatus = 0
  // 定义一个getter函数来对来对私有变量的值作只读访问——相当于受保护的
  // 判断skaysip是否初始化完成
  SkaySipStatus.prototype.isInit = function () {
    return _isInit
  }
  // 判断用户是否注册
  SkaySipStatus.prototype.isReg = function () {
    return _isReg
  }
  // 当前注册用户信息
  SkaySipStatus.prototype.reguser = function () {
    return _reguser
  }
  // 当前呼出号码
  SkaySipStatus.prototype.outPhone = function () {
    return _outPhone
  }
  // 当前呼入号码
  SkaySipStatus.prototype.inPhone = function () {
    return _inPhone
  }
  // 初始化skaysip
  SkaySipStatus.prototype.sipInit = function (uri, callback) {
    // 初始化SIPml
    var preInit = function () {
      SIPml.init(postInit)
    }
    // 加载完成后执行
    var oReadyStateTimer = setInterval(function () {
      if (document.readyState === 'complete') {
        clearInterval(oReadyStateTimer)
        preInit()
      }
    }, 500)
    initcallback = callback
    _httpuri = uri
  }
  // 获取用户config
  SkaySipStatus.prototype.oSipGetConf = function (data, callback) {
    _bindUser = data.id
    _comId = data.comId
    getHttp(_httpuri + '/system/getuser', callback, data)
  }
  // 用户状态初始化
  SkaySipStatus.prototype.oSipInit = function () {
    getHttp(_httpuri + '/system/signLogin', userstatusback, {
      id: _bindUser,
      comId: _comId
    }, 'POST')
  }
  // 用户签出--示忙
  SkaySipStatus.prototype.oSipSignOut = function () {
    getHttp(_httpuri + '/system/signOut', userstatusback, {
      id: _bindUser,
      comId: _comId
    }, 'POST')
  }
  // 用户签入--示闲
  SkaySipStatus.prototype.oSipSignIn = function () {
    getHttp(_httpuri + '/system/signIn', userstatusback, {
      id: _bindUser,
      comId: _comId
    }, 'POST')
  }
  // 用户状态
  SkaySipStatus.prototype.oSipStatus = function (callback) {
    getHttp(_httpuri + '/system/status', statusfunback, {
      id: _bindUser,
      comId: _comId
    })
  }
  // 通过用户config进行sip注册
  SkaySipStatus.prototype.oSipRegister = function (conf, reg, call) {
    if (_isInit) {
      if (!!conf) {
        try {
          let realm = conf.realm
          let impi = conf.username
          let impu = 'sip:' + impi + '@' + realm
          let password = conf.password
          let display = conf.display
          let websocket_proxy_url = conf.wss

          _reguser = display
          if (!!reg) {
            regcallback = reg
          }
          if (!!call) {
            callcallback = call
          }

          if (!realm || !impi || !impu) {
            return
          }
          var o_impu = tsip_uri.prototype.Parse(impu)
          if (!o_impu || !o_impu.s_user_name || !o_impu.s_host) {
            return
          }
          // enable notifications if not already done
          if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0) {
            window.webkitNotifications.requestPermission()
          }
          SIPml.setDebugLevel('error')
          // create SIP stack
          oSipStack = new SIPml.Stack({
            realm: realm,
            impi: impi,
            impu: impu,
            password: password,
            display_name: display,
            websocket_proxy_url: websocket_proxy_url,
            events_listener: {
              events: '*',
              listener: onSipEventStack
            },
            ice_servers: [{
              url: 'stun:66.228.45.110:3478'
            }]
          })
          if (oSipStack.start() != 0) {
            // oSipStatus.regstatus = '启动SIP堆栈失败'
            changeRegStatus('启动SIP堆栈失败')

          } else {
            _regusername = impi
            return
          }
        } catch (e) {
          changeRegStatus(e.message)
        }
      }
    }
  }
  // 取消sip注册
  SkaySipStatus.prototype.oSipUnRegister = function () {
    if (oSipStack) {
      _reguser = ''
      _regusername = ''
      oSipStack.stop() // shutdown all sessions
    }
  }
  // 呼叫
  SkaySipStatus.prototype.oSipCall = function (phone) {
    if (phone) {
      if (!!_reguser && _reguser != '' && _outPhone === '' && _inPhone === '') {
        _outPhone = phone
        _inPhone = ''
        sipCall('call-audio', phone)
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  // 挂机
  SkaySipStatus.prototype.oSipHangUp = function () {
    if (oSipSessionCall) {
      // oSipStatus.callstatus = '终止呼叫…'
      changeCallStatus('终止呼叫…')

      oSipSessionCall.hangup({
        events_listener: {
          events: '*',
          listener: onSipEventSession
        }
      })
    }
  }
  // 应答
  SkaySipStatus.prototype.oSipAnswer = function () {
    sipCall('call-audio')
  }

  function postInit() {
    // check for WebRTC support
    if (!SIPml.isWebRtcSupported()) {
      // is it chrome?
      if (SIPml.getNavigatorFriendlyName() === 'chrome') {
        alert('您使用的是旧的Chrome版本，或者WebRTC没有启用。')
        if (initcallback && typeof (initcallback) === 'function') {
          initcallback()
        }
        return
      } else {
        // alert('未安装WebRTC扩展，请在安装后重新启动浏览器。')
      }
    }
    // checks for WebSocket support
    if (!SIPml.isWebSocketSupported()) {
      alert('您的浏览器不支持WebSockets，请下载最新版本的Google浏览器。')
      window.open('https://www.google.com/intl/en/chrome/browser/')
      if (initcallback && typeof (initcallback) === 'function') {
        initcallback()
      }
      return
    }
    if (!SIPml.isWebRtcSupported()) {
      alert('您的浏览器不支持WebRTC，请下载最新版本的Google浏览器。')
      window.open('https://www.google.com/intl/en/chrome/browser/')
    }
    // audioRemote = document.getElementById('audio_remote')
    oConfigCall = {
      // audio_remote: audioRemote,
      events_listener: {
        events: '*',
        listener: onSipEventSession
      },
      sip_caps: [{
          name: '+g.oma.sip-im'
        },
        {
          name: 'language',
          value: '\'en,fr\''
        }
      ]
    }
    _isInit = true
    if (initcallback && typeof (initcallback) === 'function') {
      initcallback()
    }
  }
  // makes a call (SIP INVITE)
  function sipCall(s_type, phone) {
    if (oSipStack && !oSipSessionCall && !tsk_string_is_null_or_empty(phone)) {
      if (s_type === 'call-screenshare') {
        if (!SIPml.isScreenShareSupported()) {
          alert('Screen sharing not supported. Are you using chrome 26+?')
          return
        }
        if (!location.protocol.match('https')) {
          if (confirm('Screen sharing requires https://. Do you want to be redirected?')) {
            sipUnRegister()
            window.location = 'https://ns313841.ovh.net/call.htm'
          }
          return
        }
      }
      // create call session
      oSipSessionCall = oSipStack.newSession(s_type, oConfigCall)
      // make call
      if (oSipSessionCall.call(phone) != 0) {
        oSipSessionCall = null
        //oSipStatus.callstatus = '呼叫失败'
        changeCallStatus('呼叫失败')
        return
      }
    } else if (oSipSessionCall) {
      // oSipStatus.callstatus = '连接...'
      changeCallStatus('连接...')
      oSipSessionCall.accept(oConfigCall)
    }
  }
  // Callback function for SIP Stacks
  function onSipEventStack(e) {
    // tsk_utils_log_info('===stack event = ' + e.type)
    switch (e.type) {
      case 'started':
        {
          // catch exception for IE (DOM not ready)
          try {
            // LogIn (REGISTER) as soon as the stack finish starting
            oSipSessionRegister = this.newSession('register', {
              expires: 200,
              events_listener: {
                events: '*',
                listener: onSipEventSession
              },
              sip_caps: [{
                  name: '+g.oma.sip-im',
                  value: null
                },
                // { name: '+sip.ice' }, // rfc5768: FIXME doesn't work with Polycom TelePresence
                {
                  name: '+audio',
                  value: null
                },
                {
                  name: 'language',
                  value: '\'en,fr\''
                }
              ]
            })
            oSipSessionRegister.register()
          } catch (e) {
            // oSipStatus.regstatus = '1:' + e
            changeRegStatus('1:' + e)
          }
          break
        }
      case 'stopping':
      case 'stopped':
      case 'failed_to_start':
      case 'failed_to_stop':
        {
          var bFailure = (e.type === 'failed_to_start') || (e.type === 'failed_to_stop')
          oSipStack = null
          oSipSessionRegister = null
          oSipSessionCall = null
          // uiOnConnectionEvent(false, false)
          stopRingbackTone()
          stopRingTone()
          // oSipStatus.callstatus = ''
          changeCallStatus('')
          // oSipStatus.regstatus = bFailure ? 'Disconnected: ' + e.description : 'Disconnected'
          changeRegStatus(bFailure ? 'Disconnected: ' + e.description : 'Disconnected')
          break
        }
      case 'i_new_call':
        {
          if (oSipSessionCall) {
            // do not accept the incoming call if we're already 'in call'
            e.newSession.hangup() // comment this line for multi-line support
          } else {

            oSipSessionCall = e.newSession
            // start listening for events
            oSipSessionCall.setConfiguration(oConfigCall)
            startRingTone()
            var sRemoteNumber = (oSipSessionCall.getRemoteFriendlyName() || 'unknown')
            _inPhone = sRemoteNumber
            _outPhone = ''
            // oSipStatus.callstatus = 'Incoming call from [' + sRemoteNumber + ']'
            changeCallStatus('Incoming call from [' + sRemoteNumber + ']')
            showNotifICall(sRemoteNumber)
            oSipSessionCall.accept({
              mediaConstraints: {
                audio: true,
                video: false
              }
            })
          }
          break
        }
      case 'm_permission_requested':
        {
          break
        }
      case 'm_permission_accepted':
      case 'm_permission_refused':
        {
          break
        }

      case 'starting':
      default:
        break
    }

  }
  // Callback function for SIP sessions (INVITE, REGISTER, MESSAGE...)
  function onSipEventSession(e) {
    // tsk_utils_log_info('===session event = ' + e.type)
    // console.log(e.description)
    switch (e.type) {
      case 'connecting':
      case 'connected':
        {
          var bConnected = (e.type === 'connected')
          if (e.session === oSipSessionRegister) {
            // uiOnConnectionEvent(bConnected, !bConnected)
            // oSipStatus.regstatus = e.description
            changeRegStatus(e.description)
          } else if (e.session === oSipSessionCall) {
            if (window.btnBFCP) window.btnBFCP.disabled = false

            if (bConnected) {
              stopRingbackTone()
              stopRingTone()

              if (oNotifICall) {
                oNotifICall.cancel()
                oNotifICall = null
              }
            }

            // oSipStatus.callstatus = e.description
            changeCallStatus(e.description)
          }
          break
        } // 'connecting' | 'connected'
      case 'terminating':
      case 'terminated':
        {
          if (e.session === oSipSessionRegister) {
            // uiOnConnectionEvent(false, false)

            oSipSessionCall = null
            oSipSessionRegister = null

            // oSipStatus.regstatus = e.description
            changeRegStatus(e.description)
          } else if (e.session === oSipSessionCall) {
            uiCallTerminated(e.description)
          }
          _inPhone = ''
          _outPhone = ''
          break
        } // 'terminating' | 'terminated'
      case 'i_ao_request':
        {
          if (e.session === oSipSessionCall) {
            var iSipResponseCode = e.getSipResponseCode()
            if (iSipResponseCode === 180 || iSipResponseCode === 183) {
              startRingbackTone()
              // oSipStatus.callstatus = '呼叫中...'
              changeCallStatus('振铃中')
            }
          }
          break
        }
      case 'm_early_media':
        {
          if (e.session === oSipSessionCall) {
            stopRingbackTone()
            stopRingTone()
            // oSipStatus.callstatus = '振铃中'
            changeCallStatus('振铃中')
          }
          break
        }
      case 'm_local_hold_ok':
        {
          if (e.session === oSipSessionCall) {
            if (oSipSessionCall.bTransfering) {
              oSipSessionCall.bTransfering = false
              // this.AVSession.TransferCall(this.transferUri)
            }
            changeCallStatus('呼叫暂停')
            oSipSessionCall.bHeld = true
          }
          break
        }
      case 'm_local_hold_nok':
        {
          if (e.session === oSipSessionCall) {
            oSipSessionCall.bTransfering = false
            changeCallStatus('Failed to place remote party on hold')
          }
          break
        }

      case 'm_local_resume_ok':
        {
          if (e.session === oSipSessionCall) {
            oSipSessionCall.bTransfering = false
            changeCallStatus('取消暂停')
            oSipSessionCall.bHeld = false
          }
          break
        }
      case 'm_local_resume_nok':
        {
          if (e.session === oSipSessionCall) {
            oSipSessionCall.bTransfering = false
            changeCallStatus('Failed to unhold call')
          }
          break
        }
      case 'm_remote_hold':
        {
          if (e.session === oSipSessionCall) {
            changeCallStatus('Placed on hold by remote party')
          }
          break
        }
      case 'm_remote_resume':
        {
          if (e.session === oSipSessionCall) {
            changeCallStatus('Taken off hold by remote party')
          }
          break
        }
      case 'm_bfcp_info':
        {
          if (e.session === oSipSessionCall) {
            changeCallStatus('BFCP Info: ' + e.description)
          }
          break
        }

      case 'o_ect_trying':
        {
          if (e.session === oSipSessionCall) {
            changeCallStatus('正在进行呼叫转移…')
          }
          break
        }
      case 'o_ect_accepted':
        {
          if (e.session === oSipSessionCall) {
            changeCallStatus('接受呼叫转移')
          }
          break
        }
      case 'o_ect_completed':
      case 'i_ect_completed':
        {
          if (e.session === oSipSessionCall) {
            changeCallStatus('呼叫转移完成')
            if (oSipSessionTransferCall) {
              oSipSessionCall = oSipSessionTransferCall
            }
            oSipSessionTransferCall = null
          }
          break
        }
      case 'o_ect_failed':
      case 'i_ect_failed':
        {
          if (e.session === oSipSessionCall) {
            changeCallStatus('呼叫转移失败')
          }
          break
        }
      case 'o_ect_notify':
      case 'i_ect_notify':
        {
          if (e.session === oSipSessionCall) {
            changeCallStatus('Call Transfer:' + e.getSipResponseCode() + ' ' + e.description)
            if (e.getSipResponseCode() >= 300) {
              if (oSipSessionCall.bHeld) {
                oSipSessionCall.resume()
              }
            }
          }
          break
        }
      case 'i_ect_requested':
        {
          if (e.session === oSipSessionCall) {
            var s_message = 'Do you accept call transfer to [' + e.getTransferDestinationFriendlyName() + ']?' //FIXME
            if (confirm(s_message)) {
              changeCallStatus('正在进行呼叫转移…')
              oSipSessionCall.acceptTransfer()
              break
            }
            oSipSessionCall.rejectTransfer()
          }
          break
        }
    }
  }

  function startRingTone() {
    try {
      ringtone.play()
    } catch (e) {}
  }

  function stopRingTone() {
    try {
      ringtone.pause()
    } catch (e) {}
  }

  function startRingbackTone() {
    try {
      ringbacktone.play()
    } catch (e) {}
  }

  function stopRingbackTone() {
    try {
      ringbacktone.pause()
    } catch (e) {}
  }

  function showNotifICall(s_number) {
    // permission already asked when we registered
    if (window.webkitNotifications && window.webkitNotifications.checkPermission() === 0) {
      if (oNotifICall) {
        oNotifICall.cancel()
      }
      oNotifICall = window.webkitNotifications.createNotification('images/sipml-34x39.png', 'Incaming call', 'Incoming call from ' + s_number)
      oNotifICall.onclose = function () {
        oNotifICall = null
      }
      oNotifICall.show()
    }
  }

  function uiCallTerminated(s_description) {
    if (window.btnBFCP) window.btnBFCP.disabled = true
    oSipSessionCall = null
    stopRingbackTone()
    stopRingTone()
    // oSipStatus.callstatus = s_description
    changeCallStatus(s_description)
    if (oNotifICall) {
      oNotifICall.cancel()
      oNotifICall = null
    }
    setTimeout(function () {
      if (!oSipSessionCall) changeCallStatus('')
    }, 2500)
  }

  function userstatusback(resp) {
    console.log(resp)
    if (resp.code === '200') {
      // 返回成功
      _userstatus = resp.data
      regfunback()
    }
  }

  function changeRegStatus(msg) {
    regstatus = msg
    if (msg != 'connecting' && msg != 'connected' && msg != 'Connected') {
      // msg = '0'
      _isReg = 0
      _userstatus = 0
    } else {
      // msg = '1'
      _isReg = 1
    }
    regfunback()
  }

  function regfunback() {
    let code = -1 // 离线
    if (_isReg === 1) {
      code = _userstatus
    }
    if (regcallback && typeof (regcallback) === 'function') {
      regcallback(code)
    }
  }

  function changeCallStatus(msg) {
    callstatus = msg
    if (msg === 'Call in progress...') {
      msg = '呼叫中'
    } else if (msg === 'In Call' || msg === 'In call') {
      msg = '通话中'
    } else if (msg.indexOf('Incoming call from') != -1) {
      msg = '振铃中'
    }
    let data = {}
    data.msg = msg
    data.callmsg = callstatus
    let httpviewcode = setInterval(function () {
      getHttp(_httpuri + '/system/status', callfunback, {
        id: _bindUser,
        comId: _comId
      })
    }, 1000)

    function callfunback(resp) {
      if (!resp) {
        if (!!httpviewcode) {
          clearInterval(httpviewcode)
          _isReg = 0
          _userstatus = 0
          regfunback()
        }
        return
      }
      if (resp.code === '200') {
        if (_outPhone != '' || _inPhone != '') {
          if (_outPhone != '') {
            data.callcode = resp.data.callcode
            data.phone = _outPhone
            data.type = 1
            if (_userstatus != resp.data.userstatus) {
              _userstatus = resp.data.userstatus
              regfunback()
            }
          } else if (_inPhone != '') {
            data.callcode = resp.data.callcode
            data.phone = _inPhone
            data.type = 2
            if (_userstatus != resp.data.userstatus) {
              _userstatus = resp.data.userstatus
              regfunback()
            }
          }
          if (resp.data.callcode != '') {
            if (!!httpviewcode) {
              clearInterval(httpviewcode)
            }
          }
        } else {
          if (!!httpviewcode) {
            clearInterval(httpviewcode)
          }
        }
      }
      if (callcallback && typeof (callcallback) === 'function') {
        callcallback(data)
      }
    }
  }

  function getHttpObj() {
    var httpobj = null
    try {
      httpobj = new ActiveXObject('Msxml2.XMLHTTP')
    } catch (e) {
      try {
        httpobj = new ActiveXObject('Microsoft.XMLHTTP')
      } catch (e1) {
        httpobj = new XMLHttpRequest()
      }
    }
    return httpobj
  }

  function evil(fn) {
    var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
    return new Fn('return ' + fn)()
  }

  function getHttp(url, callback, data, method) {
    method = method || 'GET'
    var urlEncode = function (param, key, encode) {
      key = key || null
      encode = encode || null
      if (param === null) return ''
      var paramStr = ''
      var t = typeof (param)
      if (t === 'string' || t === 'number' || t === 'boolean') {
        paramStr += '&' + key + '=' + ((encode === null || encode) ? encodeURIComponent(param) : param)
      } else {
        for (var i in param) {
          var k = key === null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
          paramStr += urlEncode(param[i], k, encode)
        }
      }
      return paramStr
    }
    const param = urlEncode(data)
    url = url + (param === '' ? '' : ('?' + param))
    // var request = new XMLHttpRequest()
    var request = getHttpObj()
    request.withCredentials = true
    request.open(method, url, false)
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded') // 这行代码很关键，用来把字符串类型的参数序列化成Form Data
    // request.responseType = 'json'
    request.onreadystatechange = function () {
      if (request.readyState !== 4) return
      if (request.status === 200) {
        if (callback) {
          var respjson = evil('(' + request.response + ')')
          callback(respjson)
        }
      } else {
        callback()
      }
    }
    request.send()
  }
  return SkaySipStatus
}())
export {
  SkaySipStatus
}
