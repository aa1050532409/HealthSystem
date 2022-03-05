<template>
  <div class="discussArea">
    <div style="margin-top: 20px">
      <div class="label">视频会议ID:</div>
      <span>57797559527</span>
    </div>
    <div style="margin-top: 20px">
      <div class="label">视频会诊密码:</div>
      <span>无</span>
    </div>
    <div style="margin-top: 20px">
      <div class="label">操作:</div>
      <el-button style="width: 100px" size="small" @click="joinMeeting" type="primary"
        >点击加入会议</el-button
      >
      <el-button
        style="width: 100px"
        size="small"
        @click="endDialogVisible = true"
        type="danger"
        >结束会诊</el-button
      >
    </div>

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
          <el-link @click="historyResultImport = true" type="success"
            >+导入历史方案</el-link
          >
        </div>
        <div>
          <MyInput v-model="discussResult.conclusion" type="treat"></MyInput>
        </div>

        <div>
          <PrescriptionEdit v-model="discussResult.prescription"></PrescriptionEdit>
        </div>

        <!-- <div
          v-if="$store.state.videoConsultation.consultationSource == 'huanzhe'"
        >
          <span class="subTitle">后续治疗：</span>
          <After @after="afterInfo($event)" state="未完成"></After>
        </div> -->
      </div>
      <div class="clearfix">
        <el-button
          size="small"
          @click="endDialogVisible = false"
          type="success"
          class="btn"
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
  </div>
</template>

<script>
import {
  getDiscussDetails,
  postDiscussOpinion,
  stopGroupConsultation,
  getConsultationConclusion,
  getConsultationResult,
  getConsultationOpinion,
} from "@api/groupconsultation/groupconsultation.js";
import PrescriptionEdit from "@components/common/PrescriptionEdit.vue";
import Prescription from "@components/common/Prescription.vue";
import After from "./components/After.vue";
import SpecialInputBox from "@components/common/SpecialInputBox.vue";
import { getResultOptions, getTreatmentOptions } from "@api/patientdiag/patientdiag.js";
export default {
  props: {
    readonly: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  computed: {
    readAble: function () {
      return (
        this.readonly ||
        this.$store.state.videoConsultation.consultationState == "会诊已结束"
      );
    },
  },
  components: {
    PrescriptionEdit,
    Prescription,
    After,
    SpecialInputBox,
  },
  sockets: {
    newGroupConsultation_content() {
      let consultationId = this.$store.state.videoConsultation.consultationId;
      getDiscussDetails(consultationId).then((res) => {
        this.discussContent = res.discussion;
      });
    },
  },
  data() {
    return {
      key1: "1",
      key2: "10",
      historyOpinionImport: false,
      historyResultImport: false,
      historyOpinion: [],
      historyResult: [],
      isHolder: true,
      endDialogVisible: false,
      discussionOpinion: "",
      discussContent: [
        {
          user: {
            id: "101001",
            img:
              "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            name: "张三",
          },
          content: "该患者病情较为稳定，建议保守治疗",
        },
        {
          user: {
            id: "102001",
            img:
              "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            name: "李四",
          },
          content: "改患者病情波动剧烈，建议住院",
        },
      ],
      discussResult: {
        conclusion: [],
        treatOpinion: [],
        prescription: [],
        after: [],
      },
      resultOptions: [],
      treatOptions: [],
    };
  },
  methods: {
    joinMeeting() {
      window.open(
        "https://118.31.2.16:7087/?NTc3OTc1NTk1Mjc~#/",
        "",
        "width=900,height=700"
      );
    },
  },
  mounted() {
    let consultationId = this.$store.state.videoConsultation.consultationId;
    getDiscussDetails(consultationId).then((res) => {
      this.discussContent = res.discussion;
      this.isHolder = res.isHolder;
    });
    getConsultationConclusion(consultationId).then((res) => {
      // this.discussResult = res;
    });
    getConsultationResult().then((res) => {
      console.log(res);
      this.historyResult = res;
    });
    getConsultationOpinion().then((res) => {
      this.historyOpinion = res;
    });
    getResultOptions().then((res) => {
      this.resultOptions = res;
    });
    getTreatmentOptions().then((res) => {
      this.treatOptions = res;
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
