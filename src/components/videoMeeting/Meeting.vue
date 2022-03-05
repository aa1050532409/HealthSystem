<template>
  <div class="video-meeting-component">
    <div v-show="false">
      <div class="box control fl">
        <!-- <div><span>会议号</span> <input type="text" v-model="info.id" /></div>
        <div><span>密码</span> <input type="text" v-model="info.pwd" /></div>
        <div><span>用户名</span> <input type="text" v-model="info.name" /></div> -->
        <div>
          <button @click="join">加入会议</button>
        </div>
      </div>
      <div class="box control fl">
        <div class="select">
          <label for="audioSource">麦克风: </label
          ><select v-model="media.mic">
            <option v-for="item in options.mic" :key="item.id" :value="item.value">
              {{ item.text }}
            </option>
          </select>
        </div>
        <div class="select">
          <label for="videoSource">摄像头: </label
          ><select v-model="media.cam">
            <option v-for="item in options.cam" :key="item.id" :value="item.value">
              {{ item.text }}
            </option>
          </select>
        </div>
        <div class="select">
          <label for="audioOutput">扬声器: </label
          ><select v-model="media.vio">
            <option v-for="item in options.vio" :key="item.id" :value="item.value">
              {{ item.text }}
            </option>
          </select>
        </div>
        <div>
          <button @click="changeMic">{{ state.mic ? "麦克风开" : "麦克风关" }}</button>
          <button @click="changeCam">{{ state.cam ? "摄像头开" : "摄像头关" }}</button>
          <button @click="changeVio">{{ state.vio ? "扬声器开" : "扬声器关" }}</button>
          <!-- <button @click="out">打开麦克风</button> -->
        </div>
      </div>
      <!-- <div style="clear: both; height: 0"></div> -->
    </div>

    <div>
      <!-- <div class="box video fl">
        <h3>本地的音频流</h3>
        <video width="100%" controls ref="v1" src=""></video>
      </div> -->
      <div v-show="false" class="video fl">
        <h3>远端的音频流</h3>
        <video width="100%" controls ref="v2" src=""></video>
      </div>
      <!-- <div class="box video fl">
        <h3>本地的视频流</h3>
        <video width="100%" controls ref="v3" src=""></video>
      </div> -->
      <div class="box video fl">
        <!-- <h3>远端的视频流</h3> -->
        <div class="controlBtn">
          <div @click="changeMic" class="mic">
            <img v-show="!state.mic" src="./img/micClose.png" alt="" />
            <img v-show="state.mic" src="./img/micOpen.png" alt="" />
          </div>
          <div @click="changeCam" class="cam">
            <img v-show="!state.cam" src="./img/camClose.png" alt="" />
            <img v-show="state.cam" src="./img/camOpen.png" alt="" />
          </div>
          <div @click="changeVio" class="vio">
            <img v-show="!state.vio" src="./img/vioClose.png" alt="" />
            <img v-show="state.vio" src="./img/vioOpen.png" alt="" />
          </div>
          <div @click="display" class="vio">
            <img src="./img/display.png" alt="" />
          </div>
        </div>
        <video
          poster="./img/loading.jpg"
          muted="muted"
          object-fit="fill"
          height="100%"
          width="100%"
          ref="v4"
          src=""
        ></video>
      </div>
    </div>
    <!-- <div>
      <div class="box video fl">
        <h3>测试视频</h3>
        <video width="100%" controls ref="v5" src=""></video>
      </div>
    </div> -->
  </div>
</template>

<script>
import { displayChange } from "@api/videoConsultation/videoConsultation.js";
import common from "./common.js";
export default {
  props: {
    id: {
      type: String,
      default: () => {
        return "96900243177";
      },
    },
    pwd: {
      type: String,
      default: () => {
        return "";
      },
    },
    name: {
      type: String,
      default: () => {
        return "123";
      },
    },
  },
  name: "HelloWorld",
  data() {
    return {
      state: {
        mic: false,
        cam: true,
        vio: true,
      },
      media: {
        mic: "",
        cam: "",
        vio: "",
      },
      options: {
        mic: [],
        cam: [],
        vio: [],
      },
      receiveDemoState: false, // 演示状态，是否有其他人在发送演示
      inMeeting: false, // 是否在会议中
      previewStream: null, // 预览的视频流, 离开当前页面的时候需要关闭
    };
  },
  computed: {},
  methods: {
    display() {
      displayChange(this.id);
    },
    changeMic() {
      // this.state.mic = !this.state.mic;
      common.controlMic(!this.state.mic);
    },
    changeCam() {
      // this.state.cam = !this.state.cam;
      common.controlCamera(!this.state.cam);
    },
    changeVio() {
      // this.state.vio = !this.state.vio;
      common.controlSpeaker(!this.state.vio);
    },
    join() {
      var server = null;
      server = "wss://meet.hitry.net/webrtcgw"; // 更换服务地址只需更换ip即可，上线时可以使用上面注释的server
      common.joinMeeting(
        {
          server: server,
          id: this.id,
          password: this.pwd,
          name: this.name,
          audioId: this.media.vio || "",
          videoId: this.media.cam || "",
          bandwidth: 1024,
          micClose: false,
          cameraClose: false,
          mode: "video",
        },
        this.callbacks
      );
    },
    callbacks(message) {
      console.log(message);
      switch (message.method) {
        // 进入会议成功，需要注意的是localStream, remoteStream, localVideoStream 是在进入会议成功之前就会获取到的, remoteVideoStream是在进入会议之后获得，音频模式下将不会收到localVideoStream，remoteVideoStream。而remoteStream在会议之后获取
        case "intoMeeting":
          this.inMeeting = true;
          this.display();
          break;
        // 打开麦克风，如果是被主持人关闭的麦克风，则自己打开麦克风可能会返回失败
        case "openMIC":
          this.state.mic = true;

          // if (message.error) {
          //   console.error("你已被主持人关闭麦克风");
          // } else {
          //   document.getElementById("mic").innerText = "关闭麦克风";
          // }
          break;
        // 关闭麦克风
        case "closeMIC":
          this.state.mic = false;

          // document.getElementById("mic").innerText = "打开麦克风";
          break;
        // 打开摄像头，如果是被主持人关闭的摄像头，则自己打开摄像头可能会返回失败
        case "openCamera":
          this.state.cam = true;

          // if (message.error) {
          //   console.error("你已被主持人关闭摄像头");
          // } else {
          //   document.getElementById("camera").innerText = "关闭摄像头";
          // }
          break;
        // 关闭麦克风
        case "closeCamera":
          this.state.cam = false;

          // document.getElementById("camera").innerText = "打开摄像头";
          break;
        // 打开扬声器, 扬声器的控制是通过控制video的mute属性,需要自己控制，如果是被主持人关闭的扬声器，则自己打开扬声器可能会返回失败
        case "openSpeaker":
          // if (message.error) {
          //   console.error("你已被主持人关闭扬声器");
          // } else {
          //   document.getElementById("remoteaudio").muted = false;
          //   document.getElementById("speaker").innerText = "关闭扬声器";
          // }ds
          this.state.vio = true;
          break;
        // 关闭扬声器
        case "closeSpeaker":
          this.state.vio = false;
          // document.getElementById("remoteaudio").muted = true;
          // document.getElementById("speaker").innerText = "打开扬声器";
          break;
        // 得到本地的音频流，message.stream就是一股流
        case "localStream":
          // this.$refs["v1"].srcObject = message.stream;
          break;
        // 得到到远端的音频流，远端流属于融合流
        case "remoteStream":
          this.$refs["v2"].srcObject = message.stream;
          // window.audioPlayer = this.$refs["v2"];
          this.attachSinkId(this.$refs["v2"], this.media.vio); // 使用设置的扬声器
          this.$refs["v2"].play();
          break;
        // 得到本地的视频流
        case "localVideoStream":
          // this.$refs["v3"].srcObject = message.stream;
          break;
        // 得到远端的视频流，远端流属于融合流
        case "remoteVideoStream":
          this.$refs["v4"].srcObject = message.stream;
          this.$refs["v4"].play();
          break;
        // 得到本地演示流，如果自己是发送方，该流可以根据需求是否显示，如果自己是接收方，该流不用显示出来
        case "localDemoStream":
          break;
        // 得到远端演示流，如果自己是发送方，该流不用显示出来，如果自己是接受方，就显示演示流
        case "remoteDemoStream":
          // document.getElementById("remotemovideo").srcObject = message.stream;
          break;
        // 会议挂断，主动挂断和被挂断都会收到该消息, 注意清空状态
        case "hangup":
          this.receiveDemoState = false;
          this.inMeeting = false;
          // alert("你已经离开会议");
          // document.getElementById("mic").innerText = "关闭麦克风";
          // document.getElementById("camera").innerText = "关闭摄像头";
          // document.getElementById("speaker").innerText = "关闭扬声器";
          // document.getElementById("presentation").innerText = "发送演示";
          if (message.result.code === 486) {
            console.log("可能是会议号错误，也可能是被平台拒绝");
          } else if (message.result.code === 488) {
            console.log("会议密码错误");
          } else if (message.result.code === 200) {
            console.log("会议已挂断");
            if (message.result.reason === "Session Terminated") {
              console.log("被挂断, 被主席或服务端挂断");
            } else if (message.result.reason === "to BYE") {
              console.log("主动挂断");
            }
          } else if (message.result.code === 503) {
            console.log("服务不可用");
          } else {
            console.log("入会失败");
          }
          break;
        // 有人发送演示
        case "startPresentation":
          this.receiveDemoState = true;
          break;
        // 取消发送演示
        case "cancelPresentation":
          // document.getElementById("presentation").innerText = "发送演示";
          break;
        // 停止演示
        case "hangupDemo":
          this.receiveDemoState = false;
          // document.getElementById("presentation").innerText = "发送演示";
          break;
        case "error":
          if (message.error === "connect websocket failed") {
            console.log("连接服务器失败");
          } else if (message.error === "lost connection") {
            console.log("断开连接");
          }
        default:
          break;
      }
    },
    attachSinkId(element, sinkId) {
      if (typeof element.sinkId !== "undefined") {
        element
          .setSinkId(sinkId)
          .then(() => {
            console.log(`Success, audio output device attached: ${sinkId}`);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.warn("Browser does not support output device selection.");
      }
    },
    start() {
      if (this.inMeeting) {
        // 当前在会议中
        navigator.mediaDevices
          .enumerateDevices()
          .then(this.gotDevices)
          .catch((e) => {
            console.log(e);
          });
      } else {
        // 不在会议中
        const audioSource = this.media.vio;
        const videoSource = this.media.cam;
        console.log(audioSource, videoSource);
        let constraints = null;
        // 根据设备列表, 判断是否有摄像头，麦克风，有对应的设备才请求打开, 没有的则不请求打开
        if (this.options.mic[0]) {
          if (this.options.cam[0]) {
            constraints = {
              audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
              video: { deviceId: videoSource ? { exact: videoSource } : undefined },
            };
          } else {
            constraints = {
              audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
              video: false,
            };
          }
        } else {
          if (this.options.cam[0]) {
            constraints = {
              audio: false,
              video: { deviceId: videoSource ? { exact: videoSource } : undefined },
            };
          } else {
            constraints = {
              audio: true,
              video: true,
            };
          }
        }
        console.log(constraints);
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(this.gotStream)
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 渲染摄像头麦克风扬声器列表
    gotDevices(deviceInfos) {
      for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = {};
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === "audioinput") {
          option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
          this.options.mic.push(option);
        } else if (deviceInfo.kind === "audiooutput") {
          option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
          this.options.vio.push(option);
        } else if (deviceInfo.kind === "videoinput") {
          option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
          this.options.cam.push(option);
        } else {
          console.log("Some other kind of source/device: ", deviceInfo);
        }
      }
      this.media.mic = this.options.mic[0].value || "";
      this.media.vio = this.options.vio[0].value || "";
      this.media.cam = this.options.cam[0].value || "";
    },
    // 显示摄像头画面和麦克风音量的获取
    gotStream(stream) {
      console.log(stream);
      this.previewStream = stream;
      // this.$refs["v5"].srcObject = stream;
      // 设备列表再赋值一次，因为首次进入的时候可能设备列表的值不完整
      navigator.mediaDevices
        .enumerateDevices()
        .then(this.gotDevices)
        .catch((e) => {
          console.log(e);
        });
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
      };
    },
    hangup() {
      common.hangup();
    },
  },
  mounted() {
    navigator.mediaDevices
      .enumerateDevices()
      .then(this.gotDevices)
      .catch((err) => {
        console.log(err);
      });
    this.join();
  },
  beforeDestroy() {
    this.hangup();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.box {
  width: 300px;
  height: 300px;
}
.control {
  margin-bottom: 20px;
}
.fl {
  float: left;
}
.video {
  width: 100%;
  height: 100%;
  position: relative;
}
.video > video {
  object-fit: fill;
  width: 100%;
  height: 100%;
}
.control {
  position: absolute;
}
.video > .controlBtn {
  width: 400px;
  position: absolute;
  bottom: 50px;
  left: calc(50% - 200px);
  color: white;
  z-index: 1000;
  display: flex;
  justify-content: center;
}
.controlBtn > div {
  width: 100px;
  height: 50px;
  border-radius: 100px;
  background-color: #fff;
  margin: 30px;
  text-align: center;
  cursor: pointer;
}
.controlBtn > div > img {
  display: inline-block;
  margin-top: calc(25px - 15px);
  height: 30px;
}
</style>
<style lang="scss" scoped>
.video-meeting-component {
  width: 100%;
  height: 100%;
}
</style>
