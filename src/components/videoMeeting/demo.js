var receiveDemoState = false; // 演示状态，是否有其他人在发送演示
var inMeeting = false; // 是否在会议中
var previewStream = null; // 预览的视频流, 离开当前页面的时候需要关闭
const videoElement = document.getElementById('testvideo');
const audioInputSelect = document.getElementById('audioSource');
const videoSelect = document.getElementById('videoSource');
const audioOutputSelect = document.getElementById('audioOutput');
const selectors = [audioInputSelect, audioOutputSelect, videoSelect];

// 获取设备列表，进入会议前须进行此操作，需要知道是否有麦克风摄像头
navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleErrorDevices);

// 渲染摄像头麦克风扬声器列表
function gotDevices(deviceInfos) {
  console.log(deviceInfos);
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
      audioInputSelect.appendChild(option);
    } else if (deviceInfo.kind === 'audiooutput') {
      option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
      audioOutputSelect.appendChild(option);
    } else if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source/device: ', deviceInfo);
    }
  }
  selectors.forEach((select, selectorIndex) => {
    if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
      select.value = values[selectorIndex];
    }
  });
}

// 打开摄像头麦克风
function start() {
  if (inMeeting) {
    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleErrorDevices);
  } else {
    const audioSource = audioInputSelect.value;
    const videoSource = videoSelect.value;
    console.log((audioInputSelect.options)[0], (videoSelect.options)[0], audioSource, videoSource);
    let constraints = null;
    // 根据设备列表, 判断是否有摄像头，麦克风，有对应的设备才请求打开, 没有的则不请求打开
    if ((audioInputSelect.options)[0]) {
      if ((videoSelect.options)[0]) {
        constraints = {
          audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
          video: { deviceId: videoSource ? { exact: videoSource } : undefined }
        };
      } else {
        constraints = {
          audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
          video: false
        };
      }
    } else {
      if ((videoSelect.options)[0]) {
        constraints = {
          audio: false,
          video: { deviceId: videoSource ? { exact: videoSource } : undefined }
        };
      } else {
        constraints = {
          audio: true,
          video: true
        };
      }
    }
    console.log(constraints);
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
  }
}

// 显示摄像头画面和麦克风音量的获取
function gotStream(stream) {
  console.log(stream);
  previewStream = stream;
  videoElement.srcObject = stream;
  // 设备列表再赋值一次，因为首次进入的时候可能设备列表的值不完整
  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleErrorDevices);
  // 检测麦克风大小，注意切换页面时需要关闭
  let AudioContexts = window.AudioContext || window.webkitAudioContext;
  this.audioContext = new AudioContexts();
  this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
  this.scriptProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);
  this.mediaStreamSource.connect(this.scriptProcessor);
  this.scriptProcessor.connect(this.audioContext.destination);
  this.scriptProcessor.onaudioprocess = function (e) {
    let buffer = e.inputBuffer.getChannelData(0);
    let maxVal = Math.max.apply(Math, buffer);
    this.percent = Math.round(maxVal * 100) > 100 ? 100 : Math.round(maxVal * 100);
    console.log(this.percent);
  };
}
// 获取设备列表失败
function handleErrorDevices(error) {
  console.log(' navigator.mediaDevices.enumerateDevices: ', error);
}
// 打开摄像头和麦克风失败
function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}
// 关闭预览时的摄像头麦克风，stream是打开摄像头时返回的流
function stopStream(stream) {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  stream = undefined;
  // 停止麦克风声音的获取
  if (this.mediaStreamSource) {
    this.mediaStreamSource.disconnect();
  }
  if (this.scriptProcessor) {
    this.scriptProcessor.disconnect();
  }
}
audioInputSelect.onchange = changeAudioInput;
videoSelect.onchange = changeVideoInput;
audioOutputSelect.onchange = changeAudioDestination;

function changeAudioInput() {
  stopStream(previewStream);
  start();
}
function changeVideoInput() {
  stopStream(previewStream);
  start();
}
function changeAudioDestination() {
  const audioDestination = audioOutputSelect.value;
  attachSinkId(videoElement, audioDestination);
}
/**
 *
 * 选择使用哪个扬声器播放
 * @param {*} element 绑定的audio或video标签的节点
 * @param {*} sinkId 扬声器列表中的deviceId
 */
function attachSinkId(element, sinkId) {
  if (typeof element.sinkId !== 'undefined') {
    element.setSinkId(sinkId)
      .then(() => {
        console.log(`Success, audio output device attached: ${sinkId}`);
      })
      .catch(error => {
        console.error(error);
      });
  } else {
    console.warn('Browser does not support output device selection.');
  }
}

function callbacks(message) {
  console.log(message);
  switch (message.method) {
    // 进入会议成功，需要注意的是localStream, remoteStream, localVideoStream 是在进入会议成功之前就会获取到的, remoteVideoStream是在进入会议之后获得，音频模式下将不会收到localVideoStream，remoteVideoStream。而remoteStream在会议之后获取
    case 'intoMeeting':
      inMeeting = true;
      document.getElementById('meeting').style.display = "block";
      document.getElementById('list').style.display = "block";
      break;
    // 打开麦克风，如果是被主持人关闭的麦克风，则自己打开麦克风可能会返回失败
    case 'openMIC':
      if (message.error) {
        console.error('你已被主持人关闭麦克风')
      } else {
        document.getElementById('mic').innerText = '关闭麦克风';
      }
      break;
    // 关闭麦克风
    case 'closeMIC':
      document.getElementById('mic').innerText = '打开麦克风';
      break;
    // 打开摄像头，如果是被主持人关闭的摄像头，则自己打开摄像头可能会返回失败
    case 'openCamera':
      if (message.error) {
        console.error('你已被主持人关闭摄像头')
      } else {
        document.getElementById('camera').innerText = '关闭摄像头';
      }
      break;
    // 关闭麦克风
    case 'closeCamera':
      document.getElementById('camera').innerText = '打开摄像头';
      break;
    // 打开扬声器, 扬声器的控制是通过控制video的mute属性,需要自己控制，如果是被主持人关闭的扬声器，则自己打开扬声器可能会返回失败
    case 'openSpeaker':
      if (message.error) {
        console.error('你已被主持人关闭扬声器')
      } else {
        document.getElementById('remoteaudio').muted = false;
        document.getElementById('speaker').innerText = '关闭扬声器';
      }
      break;
    // 关闭扬声器
    case 'closeSpeaker':
      document.getElementById('remoteaudio').muted = true;
      document.getElementById('speaker').innerText = '打开扬声器';
      break;
    // 得到本地的音频流，message.stream就是一股流
    case 'localStream':
      document.getElementById('localaudio').srcObject = message.stream;
      break;
    // 得到到远端的音频流，远端流属于融合流
    case 'remoteStream':
      document.getElementById('remoteaudio').srcObject = message.stream;
      attachSinkId(document.getElementById('remoteaudio'), audioOutputSelect.value); // 使用设置的扬声器
      break;
    // 得到本地的视频流
    case 'localVideoStream':
      document.getElementById('myvideo').srcObject = message.stream;
      break;
    // 得到远端的视频流，远端流属于融合流
    case 'remoteVideoStream':
      console.log("123123123", message.stream);
      document.getElementById('remotevideo').srcObject = message.stream;
      // let myWindow = window.open('', '', 'width=500,height=500');
      // myWindow.document.write(`<video id='childevideo  autoplay playsinline  width='640' height='480' style='object-fit: fill' controls></video>`);
      // console.log(myWindow.document.getElementById('childevideo'))
      break;
    // 得到本地演示流，如果自己是发送方，该流可以根据需求是否显示，如果自己是接收方，该流不用显示出来
    case 'localDemoStream':
      document.getElementById('demovideo').srcObject = message.stream;
      break;
    // 得到远端演示流，如果自己是发送方，该流不用显示出来，如果自己是接受方，就显示演示流
    case 'remoteDemoStream':
      document.getElementById('remotemovideo').srcObject = message.stream;
      break;
    // 会议挂断，主动挂断和被挂断都会收到该消息, 注意清空状态
    case 'hangup':
      var receiveDemoState = false;
      inMeeting = false;
      document.getElementById('mic').innerText = '关闭麦克风';
      document.getElementById('camera').innerText = '关闭摄像头';
      document.getElementById('speaker').innerText = '关闭扬声器';
      document.getElementById('presentation').innerText = '发送演示';
      if (message.result.code === 486) {
        console.log('可能是会议号错误，也可能是被平台拒绝');
      } else if (message.result.code === 488) {
        console.log('会议密码错误')
      } else if (message.result.code === 200) {
        console.log('会议已挂断');
        if (message.result.reason === 'Session Terminated') {
          console.log('被挂断, 被主席或服务端挂断');
        } else if (message.result.reason === 'to BYE') {
          console.log('主动挂断')
        }
      } else if (message.result.code === 503) {
        console.log('服务不可用');
      } else {
        console.log('入会失败');
      };
      document.getElementById('dial').style.display = "block";
      document.getElementById('list').style.display = 'none';
      document.getElementById('meeting').style.display = "none";
      break;
    // 有人发送演示
    case 'startPresentation':
      receiveDemoState = true;
      break;
    // 取消发送演示
    case 'cancelPresentation':
      document.getElementById('presentation').innerText = '发送演示';
      break;
    // 停止演示  
    case 'hangupDemo':
      var receiveDemoState = false;
      document.getElementById('presentation').innerText = '发送演示';
      break;
    case 'error':
      if (message.error === 'connect websocket failed') {
        console.log('连接服务器失败');
      } else if (message.error === 'lost connection') {
        console.log('断开连接');
      }
    default:
      break;
  }
}
function join() {
  // 会议id，昵称不能为空，需要加上验证规则才行
  document.getElementById('dial').style.display = "none";
  document.getElementById('list').style.display = "none";
  var server = null;
  // if (window.location.protocol === 'http:') {
  //   server = 'http://' + window.location.hostname + ':8180/webrtc';
  // } else {
  //   server = 'https://' + window.location.hostname + ':8181/webrtc';
  // }
  server = 'wss://meet.hitry.net/webrtcgw'; // 更换服务地址只需更换ip即可，上线时可以使用上面注释的server
  // server = 'wss://118.31.2.16:8181/ws'; // 更换服务地址只需更换ip即可，上线时可以使用上面注释的server
  // 注意，如果之前的界面打开了摄像头，则进入会议前要关闭摄像头
  common.joinMeeting({
    server: server, id: document.getElementById('confid').value, password: document.getElementById('password').value, name: document.getElementById('name').value, audioId: document.getElementById('audioSource').value,
    videoId: document.getElementById('videoSource').value, bandwidth: document.getElementById('bandwidth').value, micClose: document.getElementById('micClose').checked,
    cameraClose: document.getElementById('cameraClose').checked, mode: document.getElementById('mode').value
  }, callbacks);
}



/*
// 打开摄像头
var constraints = {}; // 约束条件
constraints = {
  audio: {deviceId: audioSource ? {exact: audioSource} : undefined}, // 指定打开哪一个麦克风，直接audio: true就是打开默认的麦克风，audio: false就是不打开麦克风
  video: {deviceId: videoSource ? {exact: videoSource} : undefined} // 指定打开哪一个摄像头，直接video: true就是打开默认的摄像头，video: false就是不打开摄像头
};
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {console.log('stream绑定到video标签上就可以显示出画面')}).catch((err) => {console.log(err, '摄像头打开失败')});
// 获取列表
navigator.mediaDevices.enumerateDevices().then((device) => {console.log('device就是摄像头麦克风扬声器的列表')}).catch((err) => {console.log('获取列表失败')});
// device示例
[{deviceId: "default", groupId: "160d3577a5b2909f2b1c36748c9995855384d500fce0eb8c1d7ae4b2d263a98b", kind: "audioinput", label: "默认 - 麦克风 (USB 2.0 Camera) (0c45:6366)"},
 {deviceId: "f90eaf5f90aea31fe2b80ad544c6973d2af87b92fd8167373ffff6dbc2fc6d0e", groupId: "160d3577a5b2909f2b1c36748c9995855384d500fce0eb8c1d7ae4b2d263a98b", kind: "videoinput", label: "USB 2.0 Camera (0c45:62c0)"},
 {deviceId: "default", groupId: "4aff4e0c7ecb6ed1adf6d7600277e8232eb0988e4e6d92f99384b29d79bf30df", kind: "audiooutput", label: "默认 - 扬声器 (2- High Definition Audio 设备)"}]
deviceId表示指定哪一个设备，kind中的audioinput表示麦克风，videoinput表示摄像头，audiooutput表示扬声器，label怎是设备名称
*/