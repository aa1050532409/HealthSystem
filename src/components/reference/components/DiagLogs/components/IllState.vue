<template>
  <div class="illState">
    <div class="description">
      <div>
        <p
          v-if="
            illState.API_audio.length > 0 ||
              illState.API_video.length > 0 ||
              illState.API_description.length > 0
          "
        >
          {{
            illState.API_description.length > 0
              ? illState.API_description.join("，")
              : "暂无"
          }}
        </p>
      </div>
      <div class="questionnaire">
        <div v-for="(item, index) in illState.API_questionnaire" :key="item.id">
          <p>{{ index + 1 }}：{{ item.Questionnaire }}</p>
          <p>答：{{ item.QuestionnaireSymptom }}</p>
        </div>
      </div>
      <div>
        <!-- <el-link
          v-if="
            illState.API_audio.length > 0 &&
              illState.API_video.length > 0 &&
              state == '未完成'
          "
          type="success"
          @click="clickModify"
          style="float:right"
          >修改</el-link
        > -->
      </div>
    </div>
    <div
      class="media"
      v-if="illState.API_audio.length > 0 || illState.API_video.length > 0"
    >
      <div>
        <el-link
          v-if="illState.API_audio.length > 0"
          type="primary"
          @click="mediaSwich('audio')"
          >音频</el-link
        >
        <template>
          <span
            v-if="
              illState.API_audio.length > 0 && illState.API_video.length > 0
            "
            class="switch"
            >/</span
          >
          <el-link
            v-if="illState.API_video.length > 0"
            type="primary"
            @click="mediaSwich('video')"
            >视频</el-link
          >
        </template>
      </div>
      <div v-if="illState.API_audio.length > 0" v-show="flag == 'audio'">
        <div v-for="(item, index) in illState.API_audio" :key="item.id">
          <div>
            <p>{{ index + 1 }}{{ "：" + item.API_Question }}</p>
            <audio
              v-for="audio in item.API_audio"
              :key="audio.id"
              :src="audio"
              controls="controls"
              preload="auto"
              style="height:20px"
            ></audio>
          </div>
          <div></div>
        </div>
      </div>
      <div v-if="illState.API_video.length > 0" v-show="flag == 'video'">
        <div v-for="(item, index) in illState.API_video" :key="item.id">
          <p>{{ index + 1 }}{{ "：" + item.API_Question }}</p>
          <div
            style="margin-left:20px"
            v-for="(video, videoIndex) in item.API_video"
            :key="video.id"
          >
            <el-link @click="playVideo(video)"
              >{{ "回答视频" }}({{ Math.floor(item.API_time) }}s)</el-link
            >
            <LocalVideo
              v-show="1 == 2"
              :key="videoIndex"
              width="100%"
              :src="video"
            ></LocalVideo>
          </div>
          <!-- <el-link @click="playVideo(item)">{{item.API_name}}({{Math.floor(item.API_time)}}s)</el-link> -->

          <!-- <el-link @click="playVideo(item)">{{item.API_name}}({{Math.floor(item.API_time)}}s)</el-link> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 患者诊断中填写诊断结论、病情、治疗方案描述时候的复选组件
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
              API_voice: ""
            }
          ],
          API_video: [
            {
              API_date: "",
              API_name: "",
              API_text: "",
              API_time: "",
              API_type: "",
              API_video: ""
            }
          ], //视频的地址，以数组的形式发过来
          API_questionnaire: []
        };
      }
    },
    state: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      flag: "audio"
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
    }
  }
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