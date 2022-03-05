<template>
  <div>
    <div class="pageContent">
      <el-collapse v-model="pages.collapse_activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <h3 class="title">基本信息</h3>
          </template>
          <PersonalInfo :prsonalInfo="patientInfo.API_basicInfo"></PersonalInfo>
        </el-collapse-item>

        <el-collapse-item ref="info" :key="infoKey" name="4">
          <template slot="title">
            <h3 class="title">会诊信息</h3>
          </template>
          <div class="container">
            <div>
              <ConsultationStart
                v-if="consultationState == '患者已发起'"
                :pid="$store.state.videoConsultation.currentPid"
                :startType="2"
                :huizhenID="consultationId"
                ref="huizhen"
                @successStart="successStart"
              ></ConsultationStart>
            </div>

            <div v-if="consultationState != '患者已发起'">
              <ConsultationInfo></ConsultationInfo>
            </div>
          </div>
        </el-collapse-item>

        <el-collapse-item v-if="detailShowFlag" ref="PidDetails" name="3">
          <template slot="title">
            <h3 class="title">患者病情</h3>
          </template>

          <div :key="$store.state.videoConsultation.currentPid" class="container">
            <Reference :pid="this.pid" :items="items"></Reference>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import Prescription from "@components/common/Prescription.vue";
import chatBox from "@components/chatBox/chatBox.vue";

import PersonalInfo from "./components/PersonalInfo.vue";
import Reference from "@components/reference/Reference.vue";
import DiscussArea from "./components/DiscussArea.vue";
import ConsultationInfo from "./components/ConsultationInfo.vue";
import ConsultationStart from "@components/consultation/ConsultationStart.vue";

import { getPatientsDetails } from "@api/operationmanage/operationmanage.js";

export default {
  components: {
    Reference,
    PersonalInfo,
    DiscussArea,
    ConsultationInfo,
    ConsultationStart,
  },
  computed: {
    consultationId: function () {
      return this.$store.state.videoConsultation.consultationId;
    },
    pid: function () {
      return this.$store.state.videoConsultation.currentPid;
    },
    consultationState() {
      return this.$store.state.videoConsultation.consultationState;
    },
  },
  sockets: {
    endGroupConsultation(data) {
      if (data.gid == this.consultationId) {
        this.infoKey = this.infoKey == 0 ? 1 : 0;
        this.opinionKey = this.opinionKey == 10 ? 20 : 10;
        this.$confirm("当前患者的会诊已经结束，是否返回会诊列表页面?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$router.push("/groupconsultation/todayconsultation");
          })
          .catch(() => {});
      }
    },
  },
  data() {
    return {
      infoKey: 0,
      opinionKey: 10,
      detailShowFlag: true,
      items: ["就诊记录", "护理记录", "评估记录", "入院记录", "治疗记录"],
      pages: {
        detailPid: "",
        pageSize: 5,
        currentPage: 1,
        collapse_activeNames: ["1", "2", "3", "4"],
      },
      patientInfo: {
        API_basicInfo: {},
      },
    };
  },
  methods: {
    successStart() {
      this.$store.commit("videoConsultation/currentConsultationStateChange", "未确认");
    },
    backPage() {
      localStorage.setItem("pid", this.pid);
      this.$store.commit("patientTreatment/currentPidChange", this.pid);
      this.$store.commit("patientDiag/patientDiag_PidChange", this.pid);
      if (this.$store.state.videoConsultation.consultationSource == "zhuyuan") {
        this.$router.push("/treatment/patientdetails");
      } else {
        this.$router.push("/patientdiag/details");
      }
    },
    handleSizeChange(val) {
      this.pages.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pages.currentPage = val;
    },
    getDetails(item) {
      if (this.pages.collapse_activeNames.indexOf("3") == -1)
        this.pages.collapse_activeNames.push("3");
      if (item.isInHospital == "是") {
        this.items = [
          "就诊记录",
          "护理记录",
          "评估记录",
          "入院记录",
          "治疗记录",
          "出院记录",
          "随访记录",
        ];
      } else {
        this.items = ["就诊记录"];
      }
      this.detailShowFlag = true;
      this.$store.commit("patientInfo/currentPidChange", item.pid);
    },
  },
  mounted() {
    getPatientsDetails(this.pid).then((res) => {
      this.patientInfo.API_basicInfo = res;
    });
    switch (this.$store.state.videoConsultation.consultationSource) {
      case "jiuzhen":
        this.items = ["就诊记录"];
        break;
      case "zhuyuan":
        this.items = ["就诊记录", "护理记录", "评估记录", "入院记录", "治疗记录"];
        break;
      case "huanzhe":
        this.items = ["就诊记录"];
        break;
    }
  },
};
</script>

<style scoped lang="scss">
.pageContent {
  width: 95%;
  height: 100%;
  margin: 20px auto;
  .title {
    font-size: 20px;
    color: #1c7e7c;
  }
  .btn {
    float: right;
    margin-top: 50px;
    margin-bottom: 50px;
    margin-right: 50px;
    width: 120px;
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
.drag {
  width: 300px;
  position: absolute;
  top: 30%;
  left: calc(50% - 150px);
  span {
    z-index: 100;
    position: absolute;
    top: 0px;
    right: 10px;
    color: white;
    cursor: pointer;
  }
}
.container {
  width: 95%;
  margin: auto;
  .search {
    .formLabel {
      font-size: 20px;
      color: #1c7e7c;
    }
    .addbtn {
      margin-left: 20px;
      width: 90px;
    }
  }
  .page {
    width: 95%;
    .block {
      float: right;
    }
  }
  .pinggu {
    margin-right: 20px;
    font-size: 18px;
    .pinggubiao {
      transition: 1s;
    }
  }
}
.addprescription {
  margin-top: 20px;
  font-size: 18px;
}

.inputBox {
  position: fixed;
  left: 240px;
  bottom: 0px;
  width: calc(95% - 240px);
  z-index: 3000;
  transition: 0.5s;
}
.page {
  float: right;
  margin: 10px 5% 10px 0px;
}
.tips {
  margin-top: 20px;
  font-size: 18px;
}
.reference {
  max-height: 500px;
  overflow: auto;
}
</style>
