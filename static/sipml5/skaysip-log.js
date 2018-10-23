var oSipStatus = {
    sipInit: sipInit
}

// window.onload = function () {
//     sipInit();
// }

function sipInit(rback, cback) {
    oSipStatus.regstatus = 'Disconnected'
    window.console && window.console.info && window.console.info("location=" + window.location);

    audioRemote = document.getElementById("audio_remote");
    oSipStatus.reguser = ''; //当前用户
    oSipStatus.regusername = ''; //当前用户名
    oSipStatus.regstatus = ''; //注册状态
    oSipStatus.callstatus = ''; //呼叫状态
    oSipStatus.inPhone = ''; //呼入号码
    oSipStatus.outPhone = ''; //呼出号码
    oSipStatus.code = ''; //唯一主键

    oSipStatus.text = function (url, callback) {
        getHttp(url, callback)
    }

    oSipStatus.btnRegister = {
        value: 'register',
        disabled: false,
    }; //注册
    oSipStatus.btnUnRegister = {
        value: 'unregister',
        disabled: true
    }; //取消注册
    oSipStatus.btnCall = {
        value: 'call',
        disabled: true
    }; //呼叫
    oSipStatus.btnHangUp = {
        value: 'HangUp',
        disabled: true
    }; //挂机
    oSipStatus.btnAnswer = {
        value: 'Answer',
        disabled: true
    }; //应答
    oSipStatus.btnHoldResume = {
        value: 'Hold',
        disabled: false
    };
    oSipStatus.btnMute = {
        value: 'Mute',
        disabled: false
    };
    oSipStatus.btnTransfer = {
        value: 'Transfer',
        disabled: false
    };
    oSipStatus.regstatusback = rback;
    oSipStatus.callstatusback = cback;
    //初始化sipml
    var preInit = function () {
        SIPml.init(postInit);
    }

    //加载完成后执行
    oReadyStateTimer = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(oReadyStateTimer);
            //oSipStatus.regstatus = 'Connection'
            preInit();
        }
    }, 500)
}

var oConfigCall; //呼叫config
var oSipStack;
var oSipSessionRegister;
var oNotifICall;
var oSipSessionCall;

window.nativeRTCPeerConnection = (window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);

function postInit(rback, cback) {
    // check for WebRTC support
    if (!SIPml.isWebRtcSupported()) {
        // is it chrome?
        if (SIPml.getNavigatorFriendlyName() == 'chrome') {
            alert("您使用的是旧的Chrome版本，或者WebRTC没有启用。");
            return;
        } else {
            //alert("未安装WebRTC扩展，请在安装后重新启动浏览器。");
        }
    }
    // checks for WebSocket support
    if (!SIPml.isWebSocketSupported()) {
        alert("您的浏览器不支持WebSockets，请下载最新版本的Google浏览器。");
        window.open('https://www.google.com/intl/en/chrome/browser/');
        return;
    }

    if (!SIPml.isWebRtcSupported()) {
        alert("您的浏览器不支持WebRTC，请下载最新版本的Google浏览器。");
        window.open('https://www.google.com/intl/en/chrome/browser/');
    }

    oSipStatus.btnRegister.disabled = false;
    document.body.style.cursor = 'default';

    oConfigCall = {
        audio_remote: audioRemote,
        events_listener: {
            events: '*',
            listener: onSipEventSession
        },
        sip_caps: [{
                name: '+g.oma.sip-im'
            },
            {
                name: 'language',
                value: '\"en,fr\"'
            }
        ]
    };

    // var config = {
    //     realm: '192.168.30.188',  //realm 域名z
    //     impi: 'zz1008',   //用户名
    //     impu: 'sip:zz1008@192.168.30.188',   //私有身份：sip:用户名@realm
    //     password: '1000',   //密码
    //     display_name: '1008',   //显示名
    //     websocket_proxy_url: 'wss://192.168.30.188:7443',    //websocket地址：ws://192.168.30.246:5066
    //     sip_headers: {
    //         UserAgent: 'navigator.userAgent',   //用户标识
    //         Organization: 'YiHao'   //组织
    //     }
    // }

    oSipStatus.oSipRegister = function (conf) {
        if (!oSipStatus.btnRegister.disabled) {
            if (!conf) {
                return;
            }
            try {
                oSipStatus.btnRegister.disabled = true;
                if (!conf.realm || !conf.impi || !conf.impu) {
                    //oSipStatus.regstatus = 'config配置不完善';
                    changeRegStatus('config配置不完善');
                    oSipStatus.btnRegister.disabled = false;
                    return;
                }
                var o_impu = tsip_uri.prototype.Parse(conf.impu);
                if (!o_impu || !o_impu.s_user_name || !o_impu.s_host) {
                    //oSipStatus.regstatus = "config.impu 配置无效";
                    changeRegStatus('config.impu 配置无效');
                    oSipStatus.btnRegister.disabled = false;
                    return;
                }

                // enable notifications if not already done
                if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0) {
                    window.webkitNotifications.requestPermission();
                }
                SIPml.setDebugLevel('error')
                // create SIP stack
                oSipStack = new SIPml.Stack({
                    realm: conf.realm,
                    impi: conf.impi,
                    impu: conf.impu,
                    password: conf.password,
                    display_name: conf.display_name,
                    websocket_proxy_url: conf.websocket_proxy_url,
                    events_listener: {
                        events: '*',
                        listener: onSipEventStack
                    },
                    ice_servers: []
                })
                if (oSipStack.start() != 0) {
                    // oSipStatus.regstatus = '启动SIP堆栈失败';
                    changeRegStatus('启动SIP堆栈失败');

                } else {
                    oSipStatus.reguser = conf.display_name
                    oSipStatus.regusername = conf.impi
                    return;
                }
            } catch (e) {
                //console.log(e)
                // oSipStatus.regstatus = e.message;
                changeRegStatus(e.message);
            }
            oSipStatus.btnRegister.disabled = false;
        } else {
            alert('disabled')
        }
    }

    // sends SIP REGISTER (expires=0) to logout
    oSipStatus.oSipUnRegister = function () {
        if (oSipStack) {
            oSipStatus.reguser = ''
            oSipStatus.regusername = ''
            oSipStack.stop(); // shutdown all sessions
        } else {
            alert('disabled')
        }
    }
    // 呼叫
    oSipStatus.oSipCall = function (phone) {
        phone = phone || phoneNum.value;
        if (!oSipStatus.btnCall.disabled) {
            oSipStatus.outPhone = phone;
            oSipStatus.inPhone = '';
            sipCall('call-audio', phone);
        } else {
            alert('disabled')
        }
    }
    oSipStatus.oSipAnswer = function () {
        if (!oSipStatus.btnAnswer.disabled) {
            //console.log(oSipSessionCall);
            sipCall("call-audio");
            //oSipSessionCall.accept();
        } else {
            alert('disabled')
        }
    }
    // terminates the call (SIP BYE or CANCEL)
    oSipStatus.oSipHangUp = function () {
        if (!oSipStatus.btnHangUp.disabled) {
            if (oSipSessionCall) {
                //oSipStatus.callstatus = '终止呼叫…';
                changeCallStatus('终止呼叫…')

                oSipSessionCall.hangup({
                    events_listener: {
                        events: '*',
                        listener: onSipEventSession
                    }
                });
            }
        } else {
            alert('disabled')
        }
    }

    // login登陆
    oSipStatus.getuser = function (data, callback) {
        getHttp('/apiwss/system/getuser?', callback, data)
    }
    // login登陆
    oSipStatus.signLogin = function (callback, data) {
        getHttp('/apiwss/system/signLogin?user=' + oSipStatus.regusername, callback, data)
    }
    // 用户签出--示忙
    oSipStatus.signOut = function (callback, data) {
        getHttp('/apiwss/system/signOut?user=' + oSipStatus.regusername, callback, data)
    }
    // 用户签入--示闲
    oSipStatus.signIn = function (callback, data) {
        getHttp('/apiwss/system/signIn?user=' + oSipStatus.regusername, callback, data)
    }
    // 用户状态
    oSipStatus.status = function (callback, data) {
        getHttp('/apiwss/system/status?user=' + oSipStatus.regusername, callback, data)
    }
    //oSipStatus.oSipRegister(config)
}

// Callback function for SIP Stacks
function onSipEventStack(e) {
    //tsk_utils_log_info('==stack event = ' + e.type);
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
                            //{ name: '+sip.ice' }, // rfc5768: FIXME doesn't work with Polycom TelePresence
                            {
                                name: '+audio',
                                value: null
                            },
                            {
                                name: 'language',
                                value: '\"en,fr\"'
                            }
                        ]
                    });
                    oSipSessionRegister.register();
                } catch (e) {
                    //oSipStatus.regstatus = "1:" + e;
                    changeRegStatus("1:" + e);
                    oSipStatus.btnRegister.disabled = false;
                }
                break;
            }
        case 'stopping':
        case 'stopped':
        case 'failed_to_start':
        case 'failed_to_stop':
            {
                var bFailure = (e.type == 'failed_to_start') || (e.type == 'failed_to_stop');
                oSipStack = null;
                oSipSessionRegister = null;
                oSipSessionCall = null;

                uiOnConnectionEvent(false, false);

                stopRingbackTone();
                stopRingTone();


                //oSipStatus.callstatus = '';
                changeCallStatus('')
                //oSipStatus.regstatus = bFailure ? "Disconnected: " + e.description : "Disconnected";
                changeRegStatus(bFailure ? "Disconnected: " + e.description : "Disconnected");
                break;
            }

        case 'i_new_call':
            {
                if (oSipSessionCall) {
                    // do not accept the incoming call if we're already 'in call'
                    e.newSession.hangup(); // comment this line for multi-line support
                } else {

                    oSipSessionCall = e.newSession;
                    // start listening for events
                    oSipSessionCall.setConfiguration(oConfigCall);

                    oSipStatus.btnHangUp.value = '拒接';
                    oSipStatus.btnCall.disabled = true;
                    oSipStatus.btnHangUp.disabled = false;
                    oSipStatus.btnAnswer.disabled = false;

                    startRingTone();

                    var sRemoteNumber = (oSipSessionCall.getRemoteFriendlyName() || 'unknown');
                    oSipStatus.inPhone = sRemoteNumber;
                    oSipStatus.outPhone = '';
                    //oSipStatus.callstatus = 'Incoming call from [' + sRemoteNumber + ']';
                    changeCallStatus('Incoming call from [' + sRemoteNumber + ']')
                    showNotifICall(sRemoteNumber);

                    oSipSessionCall.accept({
                        mediaConstraints: {
                            audio: true,
                            video: false
                        }
                    });

                    // setTimeout(function () {
                    //     oSipStatus.oSipAnswer();
                    // }, 2000)
                }
                break;
            }

        case 'm_permission_requested':
            {
                break;
            }
        case 'm_permission_accepted':
        case 'm_permission_refused':
            {
                break;
            }

        case 'starting':
        default:
            break;
    }

}

// Callback function for SIP sessions (INVITE, REGISTER, MESSAGE...)
function onSipEventSession(e) {
    //tsk_utils_log_info('==session event = ' + e.type);
    //console.log(e.description)

    switch (e.type) {
        case 'connecting':
        case 'connected':
            {
                var bConnected = (e.type == 'connected');
                if (e.session == oSipSessionRegister) {
                    uiOnConnectionEvent(bConnected, !bConnected);
                    // oSipStatus.regstatus = e.description;
                    changeRegStatus(e.description);
                } else if (e.session == oSipSessionCall) {
                    oSipStatus.btnHangUp.value = 'HangUp';
                    oSipStatus.btnCall.disabled = true;
                    oSipStatus.btnHangUp.disabled = false;
                    oSipStatus.btnTransfer.disabled = false;
                    if (window.btnBFCP) window.btnBFCP.disabled = false;

                    if (bConnected) {
                        stopRingbackTone();
                        stopRingTone();

                        if (oNotifICall) {
                            oNotifICall.cancel();
                            oNotifICall = null;
                        }
                    }

                    //oSipStatus.callstatus = e.description;
                    changeCallStatus(e.description)
                }
                break;
            } // 'connecting' | 'connected'
        case 'terminating':
        case 'terminated':
            {
                if (e.session == oSipSessionRegister) {
                    uiOnConnectionEvent(false, false);

                    oSipSessionCall = null;
                    oSipSessionRegister = null;

                    //oSipStatus.regstatus = e.description;
                    changeRegStatus(e.description);
                } else if (e.session == oSipSessionCall) {
                    uiCallTerminated(e.description);
                }
                oSipStatus.inPhone = '';
                oSipStatus.outPhone = '';
                break;
            } // 'terminating' | 'terminated'
        case 'i_ao_request':
            {
                if (e.session == oSipSessionCall) {
                    var iSipResponseCode = e.getSipResponseCode();
                    if (iSipResponseCode == 180 || iSipResponseCode == 183) {
                        startRingbackTone();
                        //oSipStatus.callstatus = '呼叫中...';
                        changeCallStatus('呼叫中')
                    }
                }
                break;
            }
        case 'm_early_media':
            {
                if (e.session == oSipSessionCall) {
                    stopRingbackTone();
                    stopRingTone();
                    //oSipStatus.callstatus = '振铃中';
                    changeCallStatus('振铃中')
                }
                break;
            }
        case 'm_local_hold_ok':
            {
                if (e.session == oSipSessionCall) {
                    if (oSipSessionCall.bTransfering) {
                        oSipSessionCall.bTransfering = false;
                        // this.AVSession.TransferCall(this.transferUri);
                    }
                    oSipStatus.btnHoldResume.value = 'Resume';
                    oSipStatus.btnHoldResume.disabled = false;
                    //oSipStatus.callstatus = '呼叫暂停';
                    changeCallStatus('呼叫暂停')
                    oSipSessionCall.bHeld = true;
                }
                break;
            }
        case 'm_local_hold_nok':
            {
                if (e.session == oSipSessionCall) {
                    oSipSessionCall.bTransfering = false;
                    oSipStatus.btnHoldResume.value = 'Hold';
                    oSipStatus.btnHoldResume.disabled = false;
                    //oSipStatus.callstatus = 'Failed to place remote party on hold';
                    changeCallStatus('Failed to place remote party on hold')
                }
                break;
            }

        case 'm_local_resume_ok':
            {
                if (e.session == oSipSessionCall) {
                    oSipSessionCall.bTransfering = false;
                    oSipStatus.btnHoldResume.value = 'Hold';
                    oSipStatus.btnHoldResume.disabled = false;
                    //oSipStatus.callstatus = '取消暂停';
                    changeCallStatus('取消暂停')
                    oSipSessionCall.bHeld = false;
                }
                break;
            }
        case 'm_local_resume_nok':
            {
                if (e.session == oSipSessionCall) {
                    oSipSessionCall.bTransfering = false;
                    oSipStatus.btnHoldResume.disabled = false;
                    //oSipStatus.callstatus = 'Failed to unhold call';
                    changeCallStatus('Failed to unhold call')
                }
                break;
            }
        case 'm_remote_hold':
            {
                if (e.session == oSipSessionCall) {
                    //oSipStatus.callstatus = 'Placed on hold by remote party';
                    changeCallStatus('Placed on hold by remote party')
                }
                break;
            }
        case 'm_remote_resume':
            {
                if (e.session == oSipSessionCall) {
                    //oSipStatus.callstatus = 'Taken off hold by remote party';
                    changeCallStatus('Taken off hold by remote party')
                }
                break;
            }
        case 'm_bfcp_info':
            {
                if (e.session == oSipSessionCall) {
                    //oSipStatus.callstatus = 'BFCP Info: ' + e.description;
                    changeCallStatus('BFCP Info: ' + e.description)
                }
                break;
            }

        case 'o_ect_trying':
            {
                if (e.session == oSipSessionCall) {
                    //oSipStatus.callstatus = '正在进行呼叫转移…';
                    changeCallStatus('正在进行呼叫转移…')
                }
                break;
            }
        case 'o_ect_accepted':
            {
                if (e.session == oSipSessionCall) {
                    //oSipStatus.callstatus = '接受呼叫转移';
                    changeCallStatus('接受呼叫转移')
                }
                break;
            }
        case 'o_ect_completed':
        case 'i_ect_completed':
            {
                if (e.session == oSipSessionCall) {
                    //oSipStatus.callstatus = '呼叫转移完成';
                    changeCallStatus('呼叫转移完成')
                    oSipStatus.btnTransfer.disabled = false;
                    if (oSipSessionTransferCall) {
                        oSipSessionCall = oSipSessionTransferCall;
                    }
                    oSipSessionTransferCall = null;
                }
                break;
            }
        case 'o_ect_failed':
        case 'i_ect_failed':
            {
                if (e.session == oSipSessionCall) {
                    //oSipStatus.callstatus = '呼叫转移失败';
                    changeCallStatus('呼叫转移失败')
                    oSipStatus.btnTransfer.disabled = false;
                }
                break;
            }
        case 'o_ect_notify':
        case 'i_ect_notify':
            {
                if (e.session == oSipSessionCall) {
                    //oSipStatus.callstatus = 'Call Transfer:' + e.getSipResponseCode() + " " + e.description;
                    changeCallStatus('Call Transfer:' + e.getSipResponseCode() + " " + e.description)
                    if (e.getSipResponseCode() >= 300) {
                        if (oSipSessionCall.bHeld) {
                            oSipSessionCall.resume();
                        }
                        oSipStatus.btnTransfer.disabled = false;
                    }
                }
                break;
            }
        case 'i_ect_requested':
            {
                if (e.session == oSipSessionCall) {
                    var s_message = "Do you accept call transfer to [" + e.getTransferDestinationFriendlyName() + "]?"; //FIXME
                    if (confirm(s_message)) {
                        //oSipStatus.callstatus = '正在进行呼叫转移…';
                        changeCallStatus('正在进行呼叫转移…')
                        oSipSessionCall.acceptTransfer();
                        break;
                    }
                    oSipSessionCall.rejectTransfer();
                }
                break;
            }
    }
}


// makes a call (SIP INVITE)
function sipCall(s_type, phone) {
    if (oSipStack && !oSipSessionCall && !tsk_string_is_null_or_empty(phone)) {
        if (s_type == 'call-screenshare') {
            if (!SIPml.isScreenShareSupported()) {
                alert('Screen sharing not supported. Are you using chrome 26+?');
                return;
            }
            if (!location.protocol.match('https')) {
                if (confirm("Screen sharing requires https://. Do you want to be redirected?")) {
                    sipUnRegister();
                    window.location = 'https://ns313841.ovh.net/call.htm';
                }
                return;
            }
        }
        oSipStatus.btnCall.disabled = true;
        oSipStatus.btnHangUp.disabled = false;

        // create call session
        oSipSessionCall = oSipStack.newSession(s_type, oConfigCall);
        // make call
        if (oSipSessionCall.call(phone) != 0) {
            oSipSessionCall = null;
            //oSipStatus.callstatus = '呼叫失败';
            changeCallStatus('呼叫失败')
            oSipStatus.btnCall.disabled = false;
            oSipStatus.btnHangUp.disabled = true;
            return;
        }
    } else if (oSipSessionCall) {
        //oSipStatus.callstatus = '连接...';
        changeCallStatus('连接...')
        oSipSessionCall.accept(oConfigCall);
    }
}

function startRingTone() {
    try {
        ringtone.play();
    } catch (e) {}
}

function stopRingTone() {
    try {
        ringtone.pause();
    } catch (e) {}
}

function startRingbackTone() {
    try {
        ringbacktone.play();
    } catch (e) {}
}

function stopRingbackTone() {
    try {
        ringbacktone.pause();
    } catch (e) {}
}

function showNotifICall(s_number) {
    // permission already asked when we registered
    if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 0) {
        if (oNotifICall) {
            oNotifICall.cancel();
        }
        oNotifICall = window.webkitNotifications.createNotification('images/sipml-34x39.png', 'Incaming call', 'Incoming call from ' + s_number);
        oNotifICall.onclose = function () {
            oNotifICall = null;
        };
        oNotifICall.show();
    }
}

function uiOnConnectionEvent(b_connected, b_connecting) { // should be enum: connecting, connected, terminating, terminated
    oSipStatus.btnRegister.disabled = b_connected || b_connecting;
    oSipStatus.btnUnRegister.disabled = !b_connected && !b_connecting;
    oSipStatus.btnCall.disabled = !(b_connected && tsk_utils_have_webrtc() && tsk_utils_have_stream());
    oSipStatus.btnHangUp.disabled = !oSipSessionCall;
}


function uiCallTerminated(s_description) {
    oSipStatus.btnHangUp.value = 'HangUp';
    oSipStatus.btnHoldResume.value = 'hold';
    oSipStatus.btnMute.value = "Mute";
    oSipStatus.btnCall.disabled = false;
    oSipStatus.btnHangUp.disabled = true;
    if (window.btnBFCP) window.btnBFCP.disabled = true;

    oSipSessionCall = null;

    stopRingbackTone();
    stopRingTone();

    //oSipStatus.callstatus = s_description;
    changeCallStatus(s_description)

    if (oNotifICall) {
        oNotifICall.cancel();
        oNotifICall = null;
    }

    setTimeout(function () {
        if (!oSipSessionCall) changeCallStatus('');
    }, 2500);
}


function changeRegStatus(msg) {
    oSipStatus.regstatus = msg;
    if (msg != 'connecting' && msg != 'connected' && msg != 'Connected') {
        msg = '0'
    } else {
        msg = '1'
    }
    if (typeof (oSipStatus.regstatusback) == 'function') {
        oSipStatus.regstatusback(msg)
    }
}

function changeCallStatus(msg) {
    oSipStatus.callstatus = msg;
    if (msg == 'Call in progress...') {
        msg = '呼叫中';
    } else if (msg == 'In Call' || msg == 'In call') {
        msg = '通话中';
    } else if (msg.indexOf('Incoming call from' != -1)) {
        msg = '振铃中'
    }
    if (typeof (oSipStatus.callstatusback) == 'function') {
        oSipStatus.callstatusback(msg)
    }
}


function getHttpObj() {
    var httpobj = null;
    try {
        httpobj = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            httpobj = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e1) {
            httpobj = new XMLHttpRequest();
        }
    }
    return httpobj;
}

function getHttp(url, callback, data) {
    var urlEncode = function (param, key, encode) {
        if (param == null) return '';
        var paramStr = '';
        var t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += urlEncode(param[i], k, encode);
            }
        }
        return paramStr;
    };
    url = url + urlEncode(data);
    //var request = new XMLHttpRequest();
    var request = getHttpObj();
    request.open("GET", url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); //这行代码很关键，用来把字符串类型的参数序列化成Form Data  
    request.responseType = 'json';
    request.onreadystatechange = function () {
        if (request.readyState !== 4) return;
        if (request.status === 200) {
            if (callback) {
                callback(request.response);
            }
        }
    }
    request.send();
}