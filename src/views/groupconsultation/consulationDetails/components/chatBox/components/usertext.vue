<template>
  <div id="uesrtext">
    <div :class="{ menu: true, recording: recordingFlag }">
      <span class="file">
        <el-upload
          class="upload-demo"
          action="/api/upload"
          accept="image/jpeg,image/gif,image/png"
          :before-upload="beforeImgUpload"
          :on-success="imgSuccess"
          :headers="uploadToken"
          :auto-upload="true"
          :show-file-list="false"
        >
          <i class="iconfont icon-picture"></i>
        </el-upload>
      </span>
      <span class="file">
        <el-upload
          class="upload-demo"
          action="/api/upload"
          accept="video/mp4"
          :before-upload="beforeVedioUpload"
          :on-success="videoSuccess"
          :headers="uploadToken"
          :auto-upload="true"
          :show-file-list="false"
        >
          <i class="iconfont icon-shipin"></i>
        </el-upload>
      </span>
      <span @mousedown="startRecorder" @mouseup="stopRecorder" class="file">
        <i
          :class="
            this.audio.pressFlag
              ? 'iconfont icon-huatong pressed'
              : 'iconfont icon-huatong'
          "
        ></i>
      </span>
    </div>
    <textarea
      placeholder="按 Ctrl + Enter 发送"
      v-model="content"
      v-on:keyup="addMessage"
    ></textarea>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Recorder from "js-audio-recorder";
let recorder = new Recorder();
export default {
  name: "uesrtext",
  props: {
    pid: String,
  },
  data() {
    return {
      recordingFlag: false,
      audio: {
        recorder: "",
        audioSrc: "",
        pressFlag: false,
      },
      content: "",
      uploadToken: {
        Authorization: localStorage.getItem("token"),
      },
    };
  },
  computed: {
    ...mapState({
      sessions: (state) => state.patientCommunication.sessions,
      currentSessionId: (state) => state.patientCommunication.currentSessionId,
    }),
  },
  methods: {
    uploadFile() {
      let param = new FormData();
      param.append("file", this.wavFile);
      this.$axios.post("/api/upload", param).then((res) => {
        this.sendMsg("audio", res.data.readloadurl);
      });
    },
    startRecorder() {
      this.recordingFlag = true;
      this.audio.recorder = new Recorder();
      this.audio.recorder.start();
      this.audio.pressFlag = true;
    },
    stopRecorder() {
      this.recordingFlag = false;
      this.audio.recorder.stop();
      let audioBolb = this.audio.recorder.getWAVBlob();
      this.wavFile = new File([this.audio.recorder.getWAVBlob()], "voice.wav", {
        type: "audio/wav",
      });
      this.uploadFile();
      let reader = new FileReader();
      reader.readAsDataURL(audioBolb);
      this.audio.pressFlag = false;
    },
    beforeImgUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg";
      if (!isJPG) {
        this.$message.error("只能发送png或jpg图片");
      }
      return isJPG;
    },
    beforeVedioUpload(file) {
      const isJPG = file.type === "video/mp4";
      if (!isJPG) {
        this.$message.error("只能发送MP4视频");
      }
      return isJPG;
    },
    imgSuccess(res, files, fileList) {
      this.sendMsg("img", res.downloadurl);
    },
    videoSuccess(res, files, fileList) {
      this.sendMsg("video", res.readloadurl);
    },
    addMessage(e) {
      if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
        this.sendMsg("text", this.content);
      }
    },
    sendMsg(type, message) {
      let pid = this.pid;
      let msg = {
        fromid: this.$store.state.user.userInfo.userId,
        message: message,
        type: type,
        msgtime: new Date(),
        toid: this.currentSessionId,
        pid: pid,
        consultationType: "普通会诊",
        GroupConsultationID: this.$route.query.cid,
      };
      console.log(msg);
      this.$store.commit("patientCommunication/addMessage", msg);
      this.$socket.client.emit("instantMsg", msg);
      this.content = "";
    },
  },
};
</script>

<style lang="scss" scoped>
#uesrtext {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 30%;
  border-top: solid 1px #ddd;
  .menu {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    i {
      cursor: pointer;
    }
    .file {
      height: 30px;
      line-height: 30px;
      width: 30px;
      position: relative;
      display: inline-block;
      overflow: hidden;
      text-decoration: none;
      cursor: pointer;
      margin-right: 5px;
      text-align: center;
      input {
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 0;
        opacity: 0;
      }
    }
  }
  > textarea {
    padding: 10px;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
  }
  .recording::after {
    content: "语音输入中...";
    display: block;
    width: 100px;
    height: 30px;
    padding: 5px;
    border-radius: 5px;
    background-color: gray;
    position: absolute;
    top: -150px;
    left: 120px;
  }
}
.pressed {
  color: red;
}
</style>
