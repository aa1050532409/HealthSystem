<template>
  <div>
    <div class="addBox">
      <el-form
        :model="form"
        :hide-required-asterisk="true"
        :show-message="false"
        label-width="80px"
        size="small"
      >
        <el-form-item
          :rules="{
            required: true,
            message: '不能为空',
            trigger: 'blur',
          }"
          prop="content"
        >
          <template slot="label">
            <span class="subLabel"> 标准表述 </span>
          </template>
          <el-input style="width: 300px" v-model="form.content"></el-input>
          <el-link class="iconStyle" :underline="false" type="primary">
            <i
              @mousedown="startRecorder"
              @mouseup="stopRecorder(form)"
              class="el-icon-microphone"
            ></i
          ></el-link>

          <el-link
            class="iconStyle"
            :type="form.voice ? 'success' : ''"
            :underline="false"
          >
            <i @click="playVoice(form.voice)" class="el-icon-video-play"></i
          ></el-link>
        </el-form-item>

        <el-form-item>
          <template slot="label">
            <span class="subLabel"> 地方俚语 </span>
          </template>
          <el-select style="width: 300px" v-model="liyuType">
            <el-option label="四川话" value="四川话"> </el-option>
            <el-option label="成都话" value="成都话"> </el-option>
            <el-option label="川北话" value="川北话"> </el-option>
          </el-select>

          <el-link type="success" style="margin-left: 10px" @click="addLiyu"
            >添加</el-link
          >
        </el-form-item>

        <el-form-item
          v-for="(item, index) in form.liyu"
          :label="item.label"
          :key="item.key"
          :prop="'liyu.' + index + '.value'"
          :rules="{
            required: true,
            message: '不能为空',
            trigger: 'blur',
          }"
        >
          <el-input style="width: 300px" v-model="item.value"></el-input>
          <el-link class="iconStyle" :underline="false" type="primary">
            <i
              @mousedown="startRecorder"
              @mouseup="stopRecorder(item)"
              class="el-icon-microphone"
            ></i
          ></el-link>
          <el-link
            class="iconStyle"
            :underline="false"
            :type="item.voice ? 'success' : ''"
          >
            <i @click="playVoice(item.voice)" class="el-icon-video-play"></i
          ></el-link>
          <el-link
            style="margin-left: 10px"
            type="danger"
            @click.prevent="removeItem(item)"
            >删除</el-link
          >
        </el-form-item>
        <el-form-item prop="content">
          <template slot="label">
            <span class="subLabel"> 图片描述 </span>
          </template>
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.img" :src="form.img" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Recorder from "js-audio-recorder";
let recorder = new Recorder();
export default {
  props: {
    value: Object,
  },
  data() {
    return {
      uploadToken: {
        Authorization: localStorage.getItem("token"),
      },
      recordingFlag: false,
      audio: {
        recorder: "",
        audioSrc: "",
        pressFlag: false,
      },
      addDialogVisible: true,
      liyuType: "四川话",
      form: {
        content: "",
        liyu: [],
        img: "",
        voice: "",
      },
    };
  },
  computed: {
    valueChange() {
      return JSON.stringify(this.form);
    },
  },
  watch: {
    valueChange: function () {
      this.$emit("input", this.form);
    },
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.form.img = res.readloadurl;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    removeItem(item) {
      var index = this.form.liyu.indexOf(item);
      if (index !== -1) {
        this.form.liyu.splice(index, 1);
      }
    },
    addLiyu() {
      let flag = true;
      this.form.liyu.forEach((item) => {
        if (item.label == this.liyuType) {
          flag = false;
        }
      });
      if (flag) {
        this.form.liyu.push({
          label: this.liyuType,
          value: "",
          key: Date.now(),
        });
      } else {
        this.$message.error("已有相同项目，请勿重复添加");
      }
    },
    startRecorder(target) {
      this.recordingFlag = true;
      this.audio.recorder = new Recorder();
      this.audio.recorder.start();
      this.audio.pressFlag = true;
    },
    stopRecorder(item) {
      this.recordingFlag = false;
      this.audio.recorder.stop();
      let audioBolb = this.audio.recorder.getWAVBlob();
      let wavFile = new File([this.audio.recorder.getWAVBlob()], "voice.wav", {
        type: "audio/wav",
      });
      this.uploadFile(wavFile, item);
      this.audio.pressFlag = false;
    },
    uploadFile(file, item) {
      let param = new FormData();
      param.append("file", file);
      this.$axios.post("/api/upload", param).then((res) => {
        item.voice = res.data.readloadurl;
        this.form.liyu.splice(0, 0);
      });
    },
    playVoice(url) {
      if (url) {
        this.$emit("play", url);
      }
    },
  },
  created() {
    if (this.value) {
      this.form = JSON.parse(JSON.stringify(this.value));
    }
  },
  beforeDestroy() {
    console.log("object");
    this.form = {
      content: "",
      liyu: [],
      img: "",
      voice: "",
    };
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style lang="scss">
.iconStyle {
  font-size: 20px;
  margin-left: 10px;
}
</style>
