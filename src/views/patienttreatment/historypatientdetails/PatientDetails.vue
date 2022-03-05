<template>
  <div>
    <div class="pageContent">
      <el-collapse v-model="pages.collapse_activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <h3 class="title">基本信息</h3>
          </template>
          <PersonalInfo
            @endTreat="endTreat"
            :prsonalInfo="patientInfo.API_basicInfo"
          ></PersonalInfo>
        </el-collapse-item>
      </el-collapse>

      <!-- 参考 -->
      <Reference
        :pid="pid"
        :items="['就诊记录', '入院记录', '治疗记录', '护理记录', '评估记录', '出院记录']"
        :readonly="true"
      ></Reference>
      <!-- 聊天 -->
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

import questionnaire from "@components/questionnaires/mixin.js";

import { newQuestionnaire } from "@api/operationmanage/operationmanage.js";
import { getPatientsDetails } from "@api/patienttreatment/patienttreatment.js";
export default {
  mixins: [questionnaire],
  components: {
    Prescription,
    PersonalInfo,
    chatBox,
    Reference,
  },
  data() {
    return {
      pid: "",
      pages: {
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
      pinggu: [
        {
          name: "吞咽功能评估",
          state: "已完成",
          data: {},
        },
        {
          name: "患者护理首页",
          state: "已完成",
          data: {},
        },
        {
          name: "跌倒风险评估",
          state: "已完成",
          data: {},
        },
      ],
    };
  },
  methods: {
    endTreat() {
      this.$refs["chuyuan"].showFlag = true;
    },
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
    successImport() {
      this.pages.questionnaire.importFlag = false;
    },
    save() {
      this.$router.push("/treatment/applylist");
    },
  },
  created() {
    this.pid = this.$route.query.pid + "";
  },
  mounted() {
    let pid = this.pid;
    getPatientsDetails(pid).then((res) => {
      this.patientInfo.API_basicInfo = res;
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
.reference {
  max-height: 500px;
  overflow: auto;
}
</style>
