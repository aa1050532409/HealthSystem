<template>
  <div class="discussArea">
    <div style="margin-top: 20px">
      <div class="label">视频会议ID:</div>
      <span>{{ huiyiInfo.huiyiId || "无" }}</span>
    </div>
    <div style="margin-top: 20px">
      <div class="label">视频会诊密码:</div>
      <span>{{ huiyiInfo.huiyiMima || "无" }}</span>
    </div>
    <!-- <template v-if="state == '进行中'"> -->
    <template v-if="true">
      <div style="margin-top: 20px">
        <div class="label">操作:</div>
        <el-button
          style="width: 100px"
          size="small"
          @click="joinMeeting('in')"
          :type="videoShowFlag ? 'danger' : 'success'"
          >{{ videoShowFlag ? "离开会议" : "参与会议" }}</el-button
        >
        <el-button
          style="width: 100px"
          size="small"
          @click="joinMeeting('out')"
          type="primary"
          >独立窗口参会</el-button
        >

        <el-button
          style="width: 100px"
          size="small"
          v-if="$store.state.videoConsultation.isHolder"
          @click="endDialogVisible = true"
          type="danger"
          >结束会诊</el-button
        >
      </div>
    </template>

    <div v-if="endDialogVisible" class="endDialog">
      <div class="header">
        <span>结束会诊</span>
      </div>
      <div style="float: right">
        <el-link @click="historyResultImport = true" type="success"
          >+导入历史方案</el-link
        >
      </div>
      <div>
        <span class="subTitle">会诊结论：</span>

        <div>
          <MyInput v-model="discussResult.conclusion" type="diag"></MyInput>
        </div>
        <span class="subTitle">治疗建议：</span>
        <div style="float: right">
          <el-link @click="treatImport = true" type="success">+导入历史方案</el-link>
        </div>
        <div>
          <MyInput v-model="discussResult.treatOpinion" type="treat"></MyInput>
        </div>

        <div>
          <PrescriptionEdit
            :prescription="discussResult.prescription"
            v-model="discussResult.prescription"
          ></PrescriptionEdit>
        </div>

        <div v-if="$store.state.videoConsultation.consultationSource == 'huanzhe'">
          <span class="subTitle">后续治疗：</span>
          <After @after="afterInfo($event)" state="未完成"></After>
        </div>
      </div>
      <div class="clearfix">
        <el-button size="small" @click="endMeetiong" type="success" class="btn"
          >确定
        </el-button>
        <el-button
          size="small"
          @click="endDialogVisible = false"
          type="danger"
          class="btn"
          style="margin-right: 20px"
          >取消
        </el-button>
      </div>
    </div>
    <div v-if="videoShowFlag" class="videoPort">
      <videoMeeting
        name="name"
        :id="huiyiInfo.huiyiId"
        :pwd="huiyiInfo.huiyiMima"
      ></videoMeeting>

      <!-- <iframe
        id="myvideoiframe"
        allow="microphone;camera;midi;encrypted-media;"
        width="100%"
        height="100%"
        :src="huiyiInfo.huiyiSrc"
        frameborder="0"
      ></iframe> -->
    </div>
    <DiagResultImport
      @import="discussResult.conclusion = $event"
      v-model="historyResultImport"
    ></DiagResultImport>
    <TreatPlanImport
      @import="treatPlanImport($event)"
      v-model="treatImport"
    ></TreatPlanImport>
  </div>
</template>

<script>
import {
  canyuHuizhenInfo,
  stopVideoConsultation,
} from "@api/videoConsultation/videoConsultation.js";

import PrescriptionEdit from "@components/common/PrescriptionEdit.vue";
import Prescription from "@components/common/Prescription.vue";
import After from "./components/After.vue";
import SpecialInputBox from "@components/common/SpecialInputBox.vue";
import videoMeeting from "@components/videoMeeting/Meeting.vue";

export default {
  props: {
    readonly: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    pid: String,
    cid: String,
  },
  watch: {},
  computed: {
    readAble: function () {
      return (
        this.readonly ||
        this.$store.state.videoConsultation.consultationState == "会诊已结束"
      );
    },
    state: function () {
      return this.$store.state.videoConsultation.consultationState;
    },
    isStart() {
      let now = Date.now();
      return now > new Date(this.$store.state.videoConsultation.startTime).getTime();
    },
    isEnd() {
      let now = Date.now();
      return now > new Date(this.$store.state.videoConsultation.endTime).getTime();
    },
  },
  components: {
    PrescriptionEdit,
    Prescription,
    After,
    SpecialInputBox,
    videoMeeting,
  },

  data() {
    return {
      historyResultImport: false,
      treatImport: false,
      videoShowFlag: false,
      isHolder: true,
      endDialogVisible: false,
      videoWindow: "",
      discussResult: {
        conclusion: [],
        treatOpinion: [],
        prescription: [],
        after: [],
      },
      huiyiInfo: {
        huiyiId: "xxxxxx",
        huiyiMima: "xxxxxx",
        huiyiSrc: "",
      },
    };
  },
  methods: {
    joinMeeting(type) {
      if (type == "in") {
        // 页面内参会
        if (this.videoWindow) {
          this.videoWindow.close();
        }
        if (this.videoShowFlag) {
          this.videoShowFlag = !this.videoShowFlag;
        } else {
          if (!this.isStart) {
            this.$message.info("会诊尚未开始，请等待！");
          } else if (this.isEnd) {
            this.$message.error("会诊已结束，不可加入会议");
          } else {
            this.videoShowFlag = !this.videoShowFlag;
          }
        }
      } else {
        // 独立窗口参会
        if (this.videoShowFlag) {
          this.videoShowFlag = !this.videoShowFlag;
          if (!this.isStart) {
            this.$message.info("会诊尚未开始，请等待！");
          } else if (this.isEnd) {
            this.$message.error("会诊已结束，不可加入会议");
          } else {
            let id = this.huiyiInfo.huiyiId;
            if (this.videoWindow) {
              this.videoWindow.close();
            }
            this.videoWindow = window.open(
              `#/video?id=${id}`,
              "_blank",
              "width=800,height=600"
            );
            this.videoShowFlag = false;
          }
        } else {
          if (!this.isStart) {
            this.$message.info("会诊尚未开始，请等待！");
          } else if (this.isEnd) {
            this.$message.error("会诊已结束，不可加入会议");
          } else {
            let id = this.huiyiInfo.huiyiId;
            if (this.videoWindow) {
              this.videoWindow.close();
            }
            this.videoWindow = window.open(
              `#/video?id=${id}`,
              "_blank",
              "width=800,height=600"
            );
            this.videoShowFlag = false;
          }
        }
      }
    },
    endMeetiong() {
      if (
        this.discussResult.treatOpinion.length == 0 ||
        this.discussResult.conclusion.length == 0
      ) {
        this.$message.error("请完善会诊结论及治疗建议");
      } else {
        stopVideoConsultation(this.cid, this.discussResult).then((res) => {
          if (res) {
            this.$message.success("您已成功结束了会诊");
            this.$router.push("/groupvedioconsultation/myconsultation");
          } else {
            this.$message.error("结束会诊失败");
          }
        });
      }
    },
    treatPlanImport(data) {
      this.discussResult.treatOpinion = data.API_description;
      this.discussResult.prescription = data.API_prescription;
    },
  },
  mounted() {
    let consultationId = this.cid;
    canyuHuizhenInfo(this.cid).then((res) => {
      // console.log(this.$store.state);
      this.huiyiInfo = res;
    });
  },
  directives: {
    /*这个是vue的自定义指令,官方文档有详细说明*/
    // 发送消息后滚动到底部,这里无法使用原作者的方法，也未找到合理的方法解决，暂用setTimeout的方法模拟
    "scroll-bottom"(el) {
      setTimeout(function () {
        el.scrollTop += 9999;
      }, 20);
    },
  },
};
</script>

<style lang="scss" scoped>
.discussArea {
  .label {
    display: inline-block;
    width: 150px;
    font-size: 16px;
    color: #1c7e7c;
    text-align: justify;
  }
  .endDialog {
    margin-top: 20px;
    width: 100%;
    padding: 10px;
    box-shadow: 2px 2px 2px 2px gray;
    .header {
      width: 100%;
      text-align: center;
      font-size: 18px;
      font-weight: bolder;
      color: #1e7c7e;
    }
    .subTitle {
      font-size: 16px;
      font-weight: bold;
      color: #1e7c7e;
    }
    .btn {
      margin: 10px 0;
      float: right;
      width: 100px;
    }
  }
  .videoPort {
    margin-top: 20px;
    width: 70vw;
  }
}
.clearfix:after {
  content: ""; /*设置内容为空*/
  height: 0; /*高度为0*/
  line-height: 0; /*行高为0*/
  display: block; /*将文本转为块级元素*/
  visibility: hidden; /*将元素隐藏*/
  clear: both; /*清除浮动*/
}
.box {
  width: 100%;
  min-height: 100px;
  margin-top: 5px;
  padding: 10px;
  border: 1px solid #e4e7ed;
  p {
    margin-top: 5px;
    font-size: 18px;
    text-indent: 20px;
  }
}
</style>
