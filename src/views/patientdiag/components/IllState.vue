<template>
  <div class="illState">
    <div class="description">
      <div>
        <MyInput
          type="state"
          :readonly="state == '未完成' ? false : true"
          v-model="illState.API_description"
        ></MyInput>
      </div>
    </div>
    <div v-if="refFlag" class="media">
      <el-tabs :value="activeItem">
        <el-tab-pane
          v-if="illState.API_questionnaire && illState.API_questionnaire.length > 0"
          label="问卷"
          name="first"
        >
          <div v-for="(item, index) in illState.API_questionnaire" :key="item.id">
            <p>{{ index + 1 }}：{{ item.Questionnaire }}</p>
            <p>答：{{ item.QuestionnaireSymptom }}</p>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="illState.API_video && illState.API_video.length > 0"
          label="视频"
          name="second"
        >
          <div v-for="(item, index) in illState.API_video" :key="item.id">
            <p>{{ index + 1 }}{{ "：" + item.API_Question }}</p>
            <div
              style="margin-left: 20px"
              v-for="(video, videoIndex) in item.API_video"
              :key="video.id"
            >
              <el-link @click="playVideo(video)"
                >{{ "回答视频" }}({{ Math.floor(item.API_time) }}s)</el-link
              >
              <div style="width: 100%; height: 100%">
                <LocalVideo
                  v-show="1 == 2"
                  :key="videoIndex"
                  width="100%"
                  :src="video"
                ></LocalVideo>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="illState.API_audio && illState.API_audio.length > 0"
          label="音频"
          name="third"
        >
          <div v-for="(item, index) in illState.API_audio" :key="item.id">
            <div>
              <p>{{ index + 1 }}{{ "：" + item.API_Question }}</p>
              <audio
                v-for="audio in item.API_audio"
                :key="audio.id"
                :src="audio"
                controls="controls"
                preload="auto"
                style="height: 20px"
              ></audio>
            </div>
            <div></div></div
        ></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// 病情描述组件
export default {
  props: {
    illState: {
      type: Object,
      default: () => {
        return {
          API_description: [],
          API_audio: [
            {
              API_date: "",
              API_name: "",
              API_text: "",
              API_time: "",
              API_type: "",
              API_voice: "",
            },
          ],
          API_video: [
            {
              API_date: "",
              API_name: "",
              API_text: "",
              API_time: "",
              API_type: "",
              API_video: [],
            },
          ], //视频的地址，以数组的形式发过来
          API_questionnaire: [],
        };
      },
    },
    state: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  computed: {
    activeItem() {
      if (this.illState.API_questionnaire && this.illState.API_questionnaire.length > 0)
        return "first";
      if (this.illState.API_audio && this.illState.API_audio.length > 0) return "third";
      if (this.illState.API_video && this.illState.API_video.length > 0) return "second";
    },
    editableFlag() {
      let flag = false;
      if (this.state == "未完成") {
        flag = true;
      }
      return flag;
    },
    refFlag() {
      if (
        this.illState.API_audio.length > 0 ||
        this.illState.API_video.length > 0 ||
        this.illState.API_questionnaire.length > 0
      )
        return true;
      else return false;
    },
  },
  data() {
    return {
      flag:
        this.illState.API_audio && this.illState.API_audio.length > 0 ? "audio" : "video",
    };
  },
  methods: {
    mediaSwich(type) {
      this.flag = type;
    },
    clickModify() {
      this.$emit("modify");
    },
    playVideo(src) {
      this.$emit("vedio", src);
    },
  },
};
</script>

<style lang="scss" scoped>
.illState {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .description {
    width: 100%;
    height: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
      text-indent: 40px;
    }
  }
  .media {
    flex-shrink: 0;
    align-self: stretch;
    width: 450px;
    border-left: 2px solid #d9d9d9;
    padding-left: 20px;
    .switch {
      margin: 0 5px;
    }
    audio {
      margin-top: 10px;
    }
  }
}
</style>
