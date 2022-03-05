<template>
  <div>
    <div class="mainContent">
      <el-collapse v-model="pages.collapse_activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <h3 class="title">基本信息</h3>
          </template>
          <PersonalInfo :prsonalInfo="patientInfo.API_basicInfo"></PersonalInfo>
        </el-collapse-item>

        <el-collapse-item name="2">
          <template slot="title">
            <h3 class="title">护理记录</h3>
          </template>
          <div class="container">
            <div>
              <NursingLogs
                ref="NursingLlogs"
                :NursingLogs="nursingLogs"
                @commit="commitNursingLog($event)"
              ></NursingLogs>
            </div>
          </div>
        </el-collapse-item>

        <el-collapse-item name="3">
          <template slot="title">
            <h3 class="title">患者评估</h3>
          </template>
          <div class="container">
            <div>
              <PingguLogs></PingguLogs>
            </div>
          </div>
        </el-collapse-item>
        <Reference
          :pid="pid"
          :items="['就诊记录', '入院记录', '治疗记录']"
          :readonly="true"
        ></Reference>
      </el-collapse>

      <!-- 聊天 -->
      <div class="chat-box"></div>
      <chatBox :pid="pid"></chatBox>
      <!-- 查看问卷对话框 -->
    </div>
  </div>
</template>

<script>
import Prescription from "@components/common/Prescription.vue";
import chatBox from "@components/chatBox/chatBox.vue";
import Reference from "@components/reference/Reference.vue";

import PersonalInfo from "./components/PersonalInfo.vue";
import NursingLogs from "./components/NursingLogs.vue";
import PingguLogs from "./components/PingguLogs.vue";

import questionnaire from "@components/questionnaires/mixin.js";

import {
  getPatientsDetails,
  newQuestionnaire,
  getNursingLogs,
  postNursingLogs,
} from "@api/operationmanage/operationmanage.js";
export default {
  mixins: [questionnaire],
  components: {
    PrescriptionTable: Prescription,
    PersonalInfo: PersonalInfo,
    chatBox,
    NursingLogs,
    PingguLogs,
    Reference,
  },
  data() {
    return {
      pid: "",
      pages: {
        pageSize: 5,
        currentPage: 1,
        collapse_activeNames: ["1", "2", "3"],
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
        tabs: {
          editableTabsValue: "1",
          editableTabs: [],
          tabIndex: 1,
        },
        newNursingFlag: true,
      },
      patientInfo: {
        API_basicInfo: {},
      },
      nursingLogs: [],
      pinggu: [],
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
        this.fetchData();
      });
    },
    importPreData() {
      let flag = false;
      for (let i = 0, len = this.showTable.length; i < len; i++) {
        this.showTable[i].API_questionnaire.forEach((item) => {
          if (item.name == this.pages.questionnaire.target) {
            console.log(item);
            this.pages.questionnaire.lastData = item.data;
            this.pages.questionnaire.importFlag = true;
            flag = true;
          }
        });
        if (flag) break;
      }
      if (!flag) {
        this.$message("无可导入数据");
      }
    },
    successImport() {
      this.pages.questionnaire.importFlag = false;
    },
    jinxingpinggu(item, index) {
      let obj = JSON.parse(JSON.stringify(item));
      if (item.isOpen) {
        obj.isOpen = false;
      } else {
        obj.isOpen = true;
      }
      this.pinggu.splice(index, 1, obj);
      this.pinggu.splice(index, 1, obj);
    },
    removeTab(target) {
      this.pages.tabs.editableTabs.forEach((item, index) => {
        if (item.name == target.name) {
          this.pages.tabs.editableTabs.splice(index, 1);
        }
      });
    },
    commitNursingLog(data) {
      let pid = this.pid;
      postNursingLogs(pid, data).then((res) => {
        if (res) {
          this.fetchData();
          this.$refs["NursingLlogs"].pages.newLogFlag = false;
        }
      });
    },
    async fetchData() {
      let pid = this.pid;
      let res = await getPatientsDetails(pid);
      this.patientInfo.API_basicInfo = res;
      res = await getNursingLogs(pid);
      this.nursingLogs = res;
      this.$store.commit("endLoading");
    },
  },
  created() {
    this.pid = this.$route.query.pid + "";
  },
  mounted() {
    this.$store.commit("startLoading");
    this.fetchData();
  },
};
</script>

<style scoped lang="scss">
.mainContent {
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

.tips {
  margin-top: 20px;
  font-size: 18px;
}
.chat-box {
  z-index: 100;
}
</style>
