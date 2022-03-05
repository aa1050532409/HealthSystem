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

        <el-collapse-item name="2">
          <template slot="title">
            <h3 class="title">入院治疗安排</h3>
          </template>
          <div class="container">
            <NewTreatmentLog
              @import="importPreData($event)"
              :newLog="newTreatLog"
              @inputBox="inputBoxShow($event)"
              @prescription="prescription($event)"
            ></NewTreatmentLog>
          </div>
        </el-collapse-item>
        <Reference :pid="this.pid" :items="['就诊记录']" :readonly="true"></Reference>

        <el-button @click="save" size="medium" type="primary" class="btn">确认</el-button>
      </el-collapse>
      <div :class="this.$store.state.pageState ? 'inputBox' : 'inputBox2'">
        <!-- 患者状态描述输入 -->
        <special-input
          :data="pages.stateOptions"
          :flag="pages.inputBoxVisible.illState"
          :preValue="newTreatLog.API_patientState"
          @blur="inputBoxBlur('illState')"
          @select="inputBoxSelect($event, 'illState')"
          @delete="inputBoxDelete($event, 'illState')"
        ></special-input>

        <!-- 治疗方案输入框 -->
        <special-input
          :data="pages.treatmentOptions"
          :flag="pages.inputBoxVisible.treatment"
          :preValue="newTreatLog.API_treatment"
          @blur="inputBoxBlur('treatment')"
          @select="inputBoxSelect($event, 'treatment')"
          @delete="inputBoxDelete($event, 'treatment')"
        ></special-input>
      </div>
      <!-- 聊天 -->
      <chatBox :pid="this.pid"></chatBox>
    </div>
  </div>
</template>

<script>
import Prescription from "@components/common/Prescription.vue";
import chatBox from "@components/chatBox/chatBox.vue";
import SpecialInput from "@components/common/SpecialInput.vue";

import PersonalInfo from "./components/PersonalInfo.vue";
import NewTreatmentLog from "./components/NewTreatmentLog.vue";
import Reference from "@components/reference/Reference.vue";

import questionnaire from "@components/questionnaires/mixin.js";

import {
  getPatientsDetails,
  getApplyDetails,
  confirmApply,
} from "@api/patienttreatment/patienttreatment.js";

import { getTreatmentOptions, getStateOptions } from "@api/patientdiag/patientdiag.js";
export default {
  mixins: [questionnaire],
  components: {
    PrescriptionTable: Prescription,
    PersonalInfo: PersonalInfo,
    chatBox,
    NewTreatmentLog,
    SpecialInput,
    Reference,
  },
  props: {
    readonly: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {
      pid: "",
      pages: {
        inputBoxVisible: {
          illState: false,
          diagResult: false,
          treatment: false,
        },

        stateOptions: [],
        treatmentOptions: [],
        diagHistory: [],
        treatHistory: [],

        pageSize: 5,
        currentPage: 1,
        collapse_activeNames: ["1", "2"],
        search: {
          API_name: "",
          API_state: "",
          API_dateRange: "",
        },
        questionnaire: {
          chooseDialogVisible: false,
          questionnaireDialogVisible: false,
          target: "",
          questionnaireOptions: ["吞咽功能评定", "跌倒风险评定", "护理记录"],
          data: {},
          readOnlyDialoguVisible: false,
          readOnlyDialoguTarget: {},
          lastData: {}, //用于导入的数据
          importFlag: false,
        },
      },
      patientInfo: {
        API_basicInfo: {},
      },
      newTreatLog: {
        API_patientState: [],
        API_treatment: [],
        API_prescription: [],
      },
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pages.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pages.currentPage = val;
    },
    confirmQuestionnaire() {
      this.pages.questionnaire.chooseDialogVisible = false;
      this.pages.questionnaire.questionnaireDialogVisible = true;
      this.pages.questionnaire.data = {};
    },

    lookQuestionnaire(questionnaire) {
      this.pages.questionnaire.readOnlyDialoguTarget = questionnaire;
      this.pages.questionnaire.readOnlyDialoguVisible = true;
    },
    postQuestionnaire() {
      let pid = this.pid;
      newQuestionnaire(
        pid,
        this.pages.questionnaire.target,
        this.pages.questionnaire.data
      ).then((res) => {
        this.pages.questionnaire.questionnaireDialogVisible = false;
        getPatientsDetails(pid).then((res) => {
          this.patientInfo.API_basicInfo = res.API_basicInfo;
        });
      });
    },
    importPreData(data) {
      this.newTreatLog = {
        API_patientState: data.API_patientState,
        API_treatment: data.API_description,
        API_prescription: data.API_prescription,
      };
    },

    save() {
      let pid = this.pid;
      confirmApply(pid, this.newTreatLog).then((res) => {
        if (res) {
          this.$message.success("患者确认入院");
          this.$router.push("/treatment/applylist");
        } else {
          this.$message.error("请完善患者状况或治疗建议");
        }
      });
    },

    inputBoxShow(type) {
      switch (type) {
        case "state":
          this.inputBoxBlur("treatment");
          this.pages.inputBoxVisible.illState = true;
          break;
        case "treatment":
          this.inputBoxBlur("state");
          this.pages.inputBoxVisible.treatment = true;
          break;
      }
    },
    inputBoxBlur(type) {
      switch (type) {
        case "illState":
          this.pages.inputBoxVisible.illState = false;
          break;
        case "treatment":
          this.pages.inputBoxVisible.treatment = false;
          break;
      }
    },
    inputBoxDelete(index, type) {
      switch (type) {
        case "illState":
          this.newTreatLog.API_patientState.splice(index, 1);
          break;
        case "treatment":
          this.newTreatLog.API_treatment.splice(index, 1);
          break;
      }
    },
    inputBoxSelect(data, type) {
      switch (type) {
        case "illState":
          this.newTreatLog.API_patientState.push(data);
          break;
        case "treatment":
          this.newTreatLog.API_treatment.push(data);
          break;
      }
    },
    prescription(data) {
      this.newTreatLog.API_prescription = data;
    },
  },
  created() {
    this.pid = this.$route.query.pid + "";
    this.$store.commit("startLoading");
    let pid = this.pid;
    getApplyDetails(pid).then((res) => {
      this.patientInfo.API_basicInfo = res.API_basicInfo;
      this.$store.commit("endLoading");
    });
    getTreatmentOptions().then((res) => {
      this.pages.treatmentOptions = res;
    });
    getStateOptions().then((res) => {
      this.pages.stateOptions = res;
    });
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
  right: 2.5%;
  bottom: 0px;
  width: calc(93% - 240px);
  z-index: 3000;
  transition: 0.5s;
}
.inputBox2 {
  position: fixed;
  right: 2.5%;
  bottom: 0px;
  width: calc(95%);
  transition: 0.5s;
}
.tips {
  margin-top: 20px;
  font-size: 18px;
}
</style>

<style lang="scss">
.pageContent {
  .el-collapse-item__wrap {
    border-bottom: 0px;
  }
}
</style>
