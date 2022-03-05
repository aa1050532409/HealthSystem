


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