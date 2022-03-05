import Webrtcgw from "./webrtc.js"
var common = {
  ready() {
    this.webrtcgw = null;
    this.sipcall = null;
    this.sipvideocall = null;
    this.sipdemocall = null;
    this.webrtcgwdemo = null;
    this.localStream = null;
    this.localVideoStream = null;
    this.localDemoStream = null;
    this.remoteDemoStream = null;
    this.receiveDemoState = false; // 是否有人发送演示
    this.canReceiveDemo = false, // 能够直接接受演示流，因为必须等待主流的视频流通道建立完成之后才能开始接收演示流
      this.waitReceiveDemo = false // 需要等待一下才能接受演示流
    var rand = '';
    for (var i = 0; i < 4; i++) {
      rand += Math.floor(Math.random() * 10);
    }
    this.registerUserName = rand;
  },
  /**
   *  加入会议
   * @param {{server: String, id: String, password: String, name: String, audioId: String, videoId: String, bandwidth: (String|Number), micClose: Boolean, cameraClose: Boolean, mode: String}} params 会议参数
      {String} server 服务器地址，必需
      {String} id 会议id，必需
      {String} password 会议密码，可选，默认为空字符串
      {String} name 昵称，必需
      {String} audioId 设备列表中麦克风的deviceId，必需，如果没有麦克风可以传null，如果是被拒绝也可以传null, 有麦克风但是没有得到deviceId的时候传空字符串
      {String} videoId 设备列表中麦克风的deviceId，必需，如果没有摄像头可以传null，如果是被拒绝也可以传null，有摄像头但是没有得到deviceId的时候传空字符串
      {String或Number} bandwidth 发送视频的码率，可选，默认1024, 建议传512, 1024, 2048这三个值
      {Boolean} micClose 入会时关闭麦克风，可选，默认为false
      {Boolean} cameraClose 入会时关闭摄像头，可选，默认为false
      {String} mode 会议类型，可选，默认为视频模式，video表示视频模式（包含音频），audio表示只有音频，在使用音频模式的时候，会议中把摄像头相关按钮隐藏掉
   * @param {Function} callback 回调函数，服务端所有的消息都是通过该函数返回，只用关心状态，修改样式即可
   */

  joinMeeting(params, callback) {
    this.ready();
    this.callback = callback;
    this.server = params.server ? params.server : 'wss://' + window.location.hostname + '/ws';
    this.id = params.id ? params.id : '';
    this.password = params.password ? params.password : '';
    this.name = params.name ? params.name : '';
    this.audioId = params.audioId ? params.audioId : '';
    this.videoId = params.videoId ? params.videoId : '';
    this.bandwidth = params.bandwidth ? params.bandwidth : 1024;
    this.micClose = params.micClose;
    this.cameraClose = params.cameraClose;
    this.mode = params.mode ? params.mode : 'video';
    console.log(params);
    let that = this;
    var opaqueId = 'siptest-' + Webrtcgw.randomString(12);
    Webrtcgw.init({
      debug: 'false', bandwidth: this.bandwidth, callback: function () {
        that.webrtcgw = new Webrtcgw(
          {
            server: that.server,
            success: function () {
              var sipcall;
              that.webrtcgw.attach(
                {
                  plugin: 'webrtcgw.plugin.sip',
                  opaqueId: opaqueId,
                  success: function (pluginHandle) {
                    sipcall = pluginHandle;
                    that.sipcall = sipcall;
                    console.log('Plugin attached! (' + 'id=' + sipcall.getId() + ')');
                    var register = {
                      display_name: that.name,
                      proxy: 'sip:stdsipgw.default.svc.cluster.local',
                      request: 'register',
                      type: 'guest',
                      username: 'sip:' + that.registerUserName + '@stdsipgw.default.svc.cluster.local',
                      authuser: '1001'
                    };
                    sipcall.send({ 'message': register });
                    that.demoWebrtc(callback);
                  },
                  error: function (error) {
                    console.error('  -- Error attaching plugin...', error);
                  },
                  // consentDialog: function(on) {
                  //   console.log('consentDialog', on);
                  // },
                  // iceState: function(state) {
                  //   console.log('ICE state changed to ' + state);
                  // },
                  // mediaState: function(medium, on) {
                  //   console.log((on ? 'started' : 'stopped') + ' receiving our ' + medium);
                  // },
                  // webrtcState: function(on) {
                  //   console.log('our WebRTC PeerConnection is ' + (on ? 'up' : 'down') + ' now');
                  // },
                  slowLink: function (uplink, lost, media) {
                    console.warn('problems ' + media + ' ' + (uplink ? 'receiving' : 'sending') +
                      ' packets on this PeerConnection (' + lost + ' lost packets)');
                  },
                  onmessage: function (msg, jsep) {
                    console.log(msg);
                    var result = msg['result'];
                    if (result !== null && result !== undefined && result['event'] !== undefined && result['event'] !== null) {
                      var event = result['event'];
                      if (event === 'registration_failed') {
                        console.warn('Registration failed: ' + result['code'] + ' ' + result['reason']);
                        return;
                      }
                      if (event === 'registered') {
                        console.log('Successfully registered as ' + result['username'] + '!');
                        that.call();
                      } else if (event === 'info' && result.sender && result.type === 'application/json' && result.content && result.content.indexOf('openMIC') > -1) {
                        that.updateMic(JSON.parse(result.content));
                      } else if (event === 'info' && result.sender && result.type === 'application/json' && result.content && result.content.indexOf('closeMIC') > -1) {
                        that.updateMic(JSON.parse(result.content));
                      } else if (event === 'info' && result.sender && result.type === 'application/json' && result.content && result.content.indexOf('openCamera') > -1) {
                        that.updateCamera(JSON.parse(result.content));
                      } else if (event === 'info' && result.sender && result.type === 'application/json' && result.content && result.content.indexOf('closeCamera') > -1) {
                        that.updateCamera(JSON.parse(result.content));
                      } else if (event === 'info' && result.sender && result.type === 'application/json' && result.content && result.content.indexOf('openSpeaker') > -1) {
                        that.updateSpeaker(JSON.parse(result.content));
                      } else if (event === 'info' && result.sender && result.type === 'application/json' && result.content && result.content.indexOf('closeSpeaker') > -1) {
                        that.updateSpeaker(JSON.parse(result.content));
                      } else if (event === 'info' && result.sender && result.type === 'application/json' && result.content && result.content.indexOf('startPresentation') > -1) {
                        that.receiveDemoState = true;
                        if (that.canReceiveDemo) {
                          that.receiveDemo();
                        } else {
                          console.log('wait receive demo');
                          that.waitReceiveDemo = true;
                        }
                        callback({ method: 'startPresentation' })
                      } else if (event === 'info' && result.sender && result.type === 'application/json' && result.content && result.content.indexOf('RequestMIC') > -1) {
                        let content = JSON.parse(result.content);
                        let errno = content.result.errno;
                        console.log(errno);
                        callback({ method: content.method, result: content.result.errno })
                      } else if (event === 'calling') {
                        console.log('Waiting for the peer to answer...');
                      } else if (event === 'progress') {
                        if (jsep !== null && jsep !== undefined) {
                          sipcall.handleRemoteJsep({ jsep: jsep, error: that.doHangup });
                        }
                      } else if (event === 'accepted') {
                        // console.log(result['username'] + ' accepted the call!');
                        if (jsep !== null && jsep !== undefined) {
                          sipcall.handleRemoteJsep({ jsep: jsep, error: that.doHangup });
                        }
                        if (that.micClose) {
                          that.sipcall.send({
                            'message':
                              { request: 'info', type: 'application/json', content: `{ "method": "closeMIC" }` }
                          });
                        }
                        if (that.mode === 'audio') {
                          callback({ method: 'intoMeeting' })
                        } else {
                          that.videoAttach(callback);
                        }
                        // that.audioTimer = setInterval(async() => {
                        //   let audioInfo = await that.sipcall.getBitrate();
                        //   console.log(audioInfo, audioInfo.audioSend);
                        // }, 4000)
                      } else if (event === 'hangup') {
                        console.log('Call hung up (' + result['code'] + ' ' + result['reason'] + ')!');
                        if (that.audioTimer !== null) {
                          clearInterval(that.audioTimer);
                        }
                        that.audioTimer = null;
                        if (that.videoTimer !== null) {
                          clearInterval(that.videoTimer);
                        }
                        that.videoTimer = null;
                        if (that.presentationTimer !== null) {
                          clearInterval(that.presentationTimer);
                        }
                        that.presentationTimer = null;
                        sipcall.hangup();
                        that.webrtcgw.destroy();
                        callback({ method: 'hangup', result: result })
                      }
                    } else if (msg.error_code && msg.error_code === 447) {
                      console.log('请先注册');
                    }
                  },
                  onlocalstream: function (stream) {
                    that.localStream = stream;
                    callback({ method: 'localStream', stream: stream })
                  },
                  onremotestream: function (stream) {
                    callback({ method: 'remoteStream', stream: stream })
                  },
                  oncleanup: function () {
                    // console.log('oncleanup');
                  }
                });
            },
            error: function (error) {
              console.log(error);
              if (error === 'Error connecting to the Webrtcgw WebSockets server: Is the server down?') {
                error = 'connect websocket failed';
              } else if (error === 'Lost connection to the server (is it down?)') {
                error = 'lost connection';
              }
              callback({ method: 'error', error: error });
            },
            destroyed: function () {
            }
          });
      }
    });
  },
  videoAttach(callback) {
    var that = this;
    var opaqueId = 'siptest-' + Webrtcgw.randomString(12);
    var sipcall = null;
    this.webrtcgw.attach(
      {
        plugin: 'webrtcgw.plugin.sip',
        opaqueId: opaqueId,
        success: function (pluginHandle) {
          sipcall = pluginHandle;
          that.sipvideocall = sipcall;
          console.log('Plugin attached! (' + 'id=' + sipcall.getId() + ')');
          var register = {
            display_name: that.name,
            proxy: 'sip:stdsipgw.default.svc.cluster.local',
            request: 'register',
            type: 'guest',
            username: 'sip:' + that.registerUserName + '@stdsipgw.default.svc.cluster.local',
            authuser: '1001'
          };
          sipcall.send({ 'message': register });
        },
        error: function (error) {
          console.error('  -- Error attaching plugin...', error);
        },
        slowLink: function (uplink, lost, media) {
          console.warn('problems ' + media + ' ' + (uplink ? 'receiving' : 'sending') +
            ' packets on this PeerConnection (' + lost + ' lost packets)');
        },
        onmessage: function (msg, jsep) {
          console.log(msg);
          var result = msg['result'];
          if (result !== null && result !== undefined && result['event'] !== undefined && result['event'] !== null) {
            var event = result['event'];
            if (event === 'registration_failed') {
              console.warn('Registration failed: ' + result['code'] + ' ' + result['reason']);
              return;
            }
            if (event === 'registered') {
              console.log('Successfully registered as ' + result['username'] + '!');
              that.callVideo();
            } else if (event === 'calling') {
              console.log('Waiting for the peer to answer...');
            } else if (event === 'progress') {
              // console.log(jsep);
              if (jsep !== null && jsep !== undefined) {
                sipcall.handleRemoteJsep({ jsep: jsep, error: that.doHangup });
              }
            } else if (event === 'accepted') {
              console.log(result['username'] + ' accepted the call!');
              that.canReceiveDemo = true;
              if (that.waitReceiveDemo) {
                that.receiveDemo();
              }
              if (jsep !== null && jsep !== undefined) {
                sipcall.handleRemoteJsep({ jsep: jsep, error: that.doHangup });
              }
              callback({ method: 'intoMeeting' })
              // that.videoTimer = setInterval(async() => {
              //   let videoInfo = await that.sipvideocall.getBitrate();
              //   console.log(videoInfo, videoInfo.videoSend);
              // }, 4000)
              // that.presentationTimer = setInterval(async() => {
              //   let presentationInfo = await that.sipdemocall.getBitrate();
              //   console.log(presentationInfo, presentationInfo.videoSend);
              // }, 4000);
            } else if (event === 'hangup') {
              console.log('Call hung up (' + result['code'] + ' ' + result['reason'] + ')!');
              sipcall.hangup();
            }
          } else if (msg.error_code && msg.error_code === 447) {
            that.$message.error('请先注册');
          }
        },
        onlocalstream: function (stream) {
          that.localVideoStream = stream;
          if (that.cameraClose) {
            that.sipcall.send({
              'message':
                { request: 'info', type: 'application/json', content: `{ "method": "closeCamera" }` }
            });
          }
          callback({ method: 'localVideoStream', stream: stream })
        },
        onremotestream: function (stream) {
          callback({ method: 'remoteVideoStream', stream: stream });
        },
        oncleanup: function () {
          // console.log('oncleanup');
        }
      });
  },
  demoWebrtc(callback) {
    var that = this;
    var sipdemocall = null;
    that.webrtcgw.attach(
      {
        plugin: 'webrtcgw.plugin.sip',
        opaqueId: 'siptest-' + Webrtcgw.randomString(12),
        success: function (pluginHandle) {
          sipdemocall = pluginHandle;
          that.sipdemocall = sipdemocall;
          console.log('Plugin attached! (' + 'id=' + sipdemocall.getId() + ')');
          let register = {
            display_name: that.name,
            proxy: 'sip:stdsipgw.default.svc.cluster.local',
            request: 'register',
            type: 'guest',
            username: 'sip:' + that.registerUserName + '@stdsipgw.default.svc.cluster.local',
            authuser: '1001'
          };
          sipdemocall.send({ 'message': register });
        },
        error: function (error) {
          console.error('  -- Error attaching plugin...', error);
        },
        // iceState: function(state) {
        //   console.log('demo ICE state changed to ' + state);
        // },
        // mediaState: function(medium, on) {
        //   console.log((on ? 'started' : 'stopped') + ' receiving our ' + medium);
        // },
        // webrtcState: function(on) {
        //   console.log('our WebRTC PeerConnection is ' + (on ? 'up' : 'down') + ' now');
        // },
        onmessage: function (msg, jsep) {
          console.log(msg);
          // callback(msg);
          var result = msg['result'];
          if (result !== null && result !== undefined && result['event'] !== undefined && result['event'] !== null) {
            var event = result['event'];
            if (event === 'registration_failed') {
              console.warn('Registration failed: ' + result['code'] + ' ' + result['reason']);
              return;
            }
            if (event === 'registered') {
              console.log('Successfully registered as ' + result['username'] + '!');
            } else if (event === 'calling') {
              console.log('Waiting for the peer to answer...');
            } else if (event === 'progress') {
              // console.log(jsep);
              if (jsep !== null && jsep !== undefined) {
                sipdemocall.handleRemoteJsep({ jsep: jsep, error: that.doHangup });
              }
            } else if (event === 'accepted') {
              console.log(result['username'] + ' accepted the call!');
              if (jsep !== null && jsep !== undefined) {
                sipdemocall.handleRemoteJsep({ jsep: jsep, error: that.doHangup });
              }
            } else if (event === 'hangup') {
              console.log('demo hung up (' + result['code'] + ' ' + result['reason'] + ')!');
              sipdemocall.hangup();
              callback({ method: 'hangupDemo', result: result })
            }
          }
        },
        onlocalstream: function (stream) {
          callback({ method: 'localDemoStream', stream: stream });
          stream.getVideoTracks()[0].addEventListener('ended', e => {
            console.log('停止演示', e);
            that.hangupDemo();
          });
        },
        onremotestream: function (stream) {
          callback({ method: 'remoteDemoStream', stream: stream });
        },
        oncleanup: function () {
          // console.log(' ::: Got a cleanup notification :::');
        }
      });
  },
  call() {
    let that = this;
    let constraints = null;
    if (that.audioId === '') {
      constraints = {
        audio: true,
        video: false
      };
    } else if (!that.audioId) {
      constraints = {
        audioRecv: true,
        audioSend: false,
        video: false
      };
    } else {
      constraints = {
        audio: {
          deviceId: {
            exact: that.audioId
          }
        },
        video: false
      };
    }
    console.log(constraints);
    var callUri = 'sip:' + that.id + '@stdsipgw.default.svc.cluster.local';
    that.sipcall.createOffer(
      {
        media: constraints,
        success: function (jsep) {
          // console.log(jsep.sdp);
          let body = { request: 'call', uri: callUri, headers: { Password: that.password } };
          that.sipcall.send({ 'message': body, 'jsep': jsep });
        },
        error: function (error) {
          alert("麦克风获取失败")
          console.error('WebRTC error...', error);
          if (error && (error.name === 'NotReadableError' || error.name === 'NotAllowedError' || error === 'No capture device found')) {
            constraints = {
              audioSend: false,
              audioRecv: true,
              video: false
            };
            that.sipcall.createOffer(
              {
                media: constraints,
                success: function (jsep) {
                  let body = { request: 'call', uri: callUri, headers: { Password: that.password } };
                  that.sipcall.send({ 'message': body, 'jsep': jsep });
                },
                error: function (err) {
                  console.log(err);
                }
              }
            );
          }
        }
      }
    );
  },
  callVideo() {
    let that = this;
    let callUri = 'sip:' + that.id + '@stdsipgw.default.svc.cluster.local';
    let constraints = null;
    if (that.videoId === '') {
      constraints = {
        audio: false,
        video: true
      };
    } else if (!that.videoId) {
      constraints = {
        audio: false,
        videoSend: false,
        videoRecv: true
      }
    } else {
      constraints = {
        audio: false,
        video: {
          deviceId: {
            exact: that.videoId
          }
        }
      }
    }
    console.log(constraints);
    that.sipvideocall.createOffer(
      {
        media: constraints,
        success: function (jsep) {
          if (jsep.sdp.indexOf('H264') > -1) {
            let body = { request: 'call', uri: callUri, headers: { Password: that.password }, mainvideo_channel: true };
            that.sipvideocall.send({ 'message': body, 'jsep': jsep });
          } else {
            console.log('当前浏览器不支持H264, 建议返回首页');
          }
        },
        error: function (error) {
          alert("摄像头获取失败")
          console.error('WebRTC error...', error);
          if (error && error.name && (error.name === 'OverconstrainedError' || error.message === 'Invalid constraint')) {
            constraints = {
              audio: false,
              video: {
                deviceId: {
                  exact: that.videoId
                }
              }
            };
            that.sipvideocall.createOffer(
              {
                media: constraints,
                success: function (jsep) {
                  let body = { request: 'call', uri: callUri, headers: { Password: that.password }, mainvideo_channel: true };
                  that.sipvideocall.send({ 'message': body, 'jsep': jsep });
                },
                error: function (error) {
                  console.log(error.message)
                }
              }
            );
          } else if (error && (error.name === 'NotReadableError' || error.name === 'NotAllowedError' || error === 'No capture device found')) {
            if (error.name === 'NotReadableError') {
              console.error('启动摄像头失败，只可以收流不能发流');
            }
            constraints = {
              audio: false,
              videoSend: false,
              videoRecv: true
            };
            that.sipvideocall.createOffer(
              {
                media: constraints,
                success: function (jsep) {
                  // console.log(jsep.sdp);
                  let body = { request: 'call', uri: callUri, headers: { Password: that.password }, mainvideo_channel: true };
                  that.sipvideocall.send({ 'message': body, 'jsep': jsep });
                },
                error: function (error) {
                  console.log(error);
                }
              }
            );
          } else {
            console.log('返回首页');
          }
        }
      }
    );
  },
  /**
   *
   * 设置麦克风，发送协议告诉服务端
   * @param {Boolean} state boolean类型，true表示打开麦克风，false表示关闭麦克风
   * @returns
   */
  controlMic(state) {
    if (state) {
      this.sipcall.send({
        'message':
          { request: 'info', type: 'application/json', content: `{ "method": "openMIC" }` }
      });
    } else {
      this.sipcall.send({
        'message':
          { request: 'info', type: 'application/json', content: `{ "method": "closeMIC" }` }
      });
    }
  },
  // 服务端返回麦克风设置是否成功
  updateMic(params) {
    if (params.method === 'openMIC') {
      if (params.params.code === 0) {
        this.callback({ method: 'openMIC' });
        if (this.localStream) {
          let audioTracks = this.localStream.getAudioTracks();
          if (audioTracks.length === 0) {
            console.log('No local audio available');
            return;
          }
          for (let i = 0; i < audioTracks.length; ++i) {
            audioTracks[i].enabled = true;
          }
        }
      } else if (params.params.code === 4) {
        this.callback({ method: 'openMIC', error: 4 })
      }
    } else {
      if (params.params.code === 0) {
        this.callback({ method: 'closeMIC' })
        if (this.localStream) {
          let audioTracks = this.localStream.getAudioTracks();
          if (audioTracks.length === 0) {
            console.log('No local audio available');
            return;
          }
          for (let i = 0; i < audioTracks.length; i++) {
            audioTracks[i].enabled = false;
          }
        }
      }
    }
  },
  /**
   *
   * 设置摄像头，发送协议告诉服务端
   * @param {Boolean} state boolean类型，true表示打开摄像头，false表示关闭摄像头
   * @returns
   */
  controlCamera(state) {
    if (state) {
      this.sipcall.send({
        'message':
          { request: 'info', type: 'application/json', content: `{ "method": "openCamera" }` }
      });
    } else {
      this.sipcall.send({
        'message':
          { request: 'info', type: 'application/json', content: `{ "method": "closeCamera" }` }
      });
    }
  },
  // 服务端返回摄像头设置是否成功
  updateCamera(params) {
    if (params.method === 'openCamera') {
      if (params.params.code === 0) {
        this.callback({ method: 'openCamera' })
        if (this.localVideoStream) {
          let videoTracks = this.localVideoStream.getVideoTracks();
          if (videoTracks.length === 0) {
            console.log('No local video available');
            return;
          }
          for (let i = 0; i < videoTracks.length; i++) {
            videoTracks[i].enabled = true;
          }
        }
      } else if (params.params.code === 4) {
        this.callback({ method: 'openCamera', error: 4 })
      }
    } else {
      if (params.params.code === 0) {
        this.callback({ method: 'closeCamera' })
        if (this.localVideoStream) {
          let videoTracks = this.localVideoStream.getVideoTracks();
          if (videoTracks.length === 0) {
            console.log('No local video available');
            return;
          }
          for (let i = 0; i < videoTracks.length; ++i) {
            videoTracks[i].enabled = false;
          }
        }
      }
    }
  },
  /**
   *
   * 设置扬声器，发送协议告诉服务端
   * @param {Boolean} state boolean类型，true表示打开扬声器，false表示关闭扬声器
   * @returns
  */
  controlSpeaker(state) {
    if (state) {
      this.sipcall.send({
        'message':
          { request: 'info', type: 'application/json', content: `{ "method": "openSpeaker" }` }
      });
    } else {
      this.sipcall.send({
        'message':
          { request: 'info', type: 'application/json', content: `{ "method": "closeSpeaker" }` }
      });
    }
  },
  // 服务端返回扬声器设置是否成功
  updateSpeaker(params) {
    if (params.method === 'openSpeaker') {
      if (params.params.code === 0) {
        this.callback({ method: 'openSpeaker' })
      } else if (params.params.code === 4) {
        this.callback({ method: 'openSpeaker', error: 4 })
      }
    } else {
      if (params.params.code === 0) {
        this.callback({ method: 'closeSpeaker' })
      }
    }
  },
  // 发送演示
  callDemo() {
    if (!navigator.mediaDevices.getDisplayMedia) {
      console.log('当前浏览器不支持演示，请安装最新版本的谷歌浏览器');
      return false;
    }
    let that = this;
    that.sipdemocall.createOffer(
      {
        media: {
          audio: false,
          video: 'screen'
        },
        success: function (jsep) {
          var body = { request: 'call', uri: 'sip:' + that.id + '@stdsipgw.default.svc.cluster.local', presentation_channel: true };
          that.sipdemocall.send({ 'message': body, 'jsep': jsep });
          that.sipcall.send({
            'message':
              { request: 'info', type: 'application/json', content: `{ "method": "startPresentation", "params": {}}` }
          });
        },
        error: function (error) {
          console.log('WebRTC error...', error);
          that.callback({ method: 'cancelPresentation' })
        }
      });
  },
  // 接受演示
  receiveDemo() {
    let that = this;
    that.sipdemocall.createOffer(
      {
        media: {
          audioRecv: false,
          audioSend: false,
          videoSend: false,
          videoRecv: true
        },
        success: function (jsep) {
          var body = { request: 'call', uri: 'sip:' + that.id + '@stdsipgw.default.svc.cluster.local', presentation_channel: true };
          that.sipdemocall.send({ 'message': body, 'jsep': jsep });
        },
        error: function (error) {
          console.error('WebRTC error...', error);
        }
      });
  },
  /**
   * 会议中改变麦克风和摄像头
   * @param {String} newAudioId 需要切换的麦克风的deviceId
   * @param {String} newVideoId 需要切换的摄像头的deviceId
   */
  changeDevice(newAudioId, newVideoId) {
    let that = this;
    let replaceAudio = false;
    let replaceVideo = false;
    if (newAudioId !== this.audioId) {
      replaceAudio = true;
      this.audioId = newAudioId;
    }
    if (newVideoId !== this.videoId) {
      replaceVideo = true;
      this.videoId = newVideoId;
    }
    console.log(replaceAudio, replaceVideo);
    if (replaceAudio && that.sipcall) {
      that.sipcall.createOffer({
        media: {
          video: false,
          audio: {
            deviceId: {
              exact: newAudioId
            }
          },
          replaceAudio: replaceAudio
        },
        success: function (jsep) {
          console.log(jsep);
          // that.sipcall.send({ 'message': { 'audio': true, 'video': true }, 'jsep': jsep });
        },
        error: function (error) {
          console.error('WebRTC audio error...', error);
        }
      });
    }
    if (replaceVideo && that.sipvideocall) {
      that.sipvideocall.createOffer({
        media: {
          audio: false,
          video: {
            deviceId: {
              exact: newVideoId
            }
          },
          replaceVideo: replaceVideo
        },
        success: function (jsep) {
          console.log(jsep);
          // that.sipvideocall.send({ 'message': { 'audio': true, 'video': true }, 'jsep': jsep });
        },
        error: function (error) {
          console.error('WebRTC video error...', error);
        }
      });
    }
  },
  hangupDemo() {
    console.log('hangupDemo');
    let hangup = { 'request': 'hangup' };
    this.sipdemocall.send({ 'message': hangup });
    this.sipdemocall.hangup();
  },
  hangup() {
    // 有演示流先挂断演示，然后挂断视频，最后挂断音频
    console.log('hangup');
    if (this.receiveDemoState) {
      this.hangupDemo();
    }
    let hangup = { 'request': 'hangup' };
    if (this.sipvideocall) {
      this.sipvideocall.send({ 'message': hangup });
      this.sipvideocall.hangup();
    }
    this.sipcall.send({ 'message': hangup });
    this.sipcall.hangup();
  }
}
export default common