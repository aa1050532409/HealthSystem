<template>
  <div>
    <div class="mainContent">
      <el-collapse v-model="pages.collapse_activeNames">
        <el-collapse-item name="3">
          <template slot="title">
            <h3 class="title">入院患者评估</h3>
          </template>
          <div class="container">
            <div v-for="(item, index) in pinggu" :key="item.id" class="pinggu">
              <div>
                <span style="margin-right: 40px"
                  >{{ item.name }}{{ "(" + item.state + ")" }}</span
                >
                <el-link
                  @click="jinxingpinggu(item, index)"
                  :type="item.state == '已完成' ? 'primary' : 'success'"
                  >{{ item.state == "已完成" ? "查看" : "进行评估" }}</el-link
                >
              </div>
              <div v-show="item.isOpen" class="pinggubiao">
                <div style="margin: 20px 0">
                  <template>
                    <components
                      :newAdd="true"
                      class="quesComponent"
                      @commit="pingguCommit(index, $event)"
                      @cancel="pingguCancel(item)"
                      :preData="item.data"
                      :readonly="item.state == '已完成' ? true : false"
                      :is="item.type"
                    ></components>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="4">
          <template slot="title">
            <h3 class="title">入院治疗安排</h3>
          </template>
          <div class="container">
            <NewTreatmentLog
              ref="ruyuantreatlog"
              :readonly="logreadonly"
              @import="importPreData($event)"
              :newLog="newTreatLog"
              @save="saveNewLog"
              @inputBox="inputBoxShow($event)"
              @prescription="prescription($event)"
            ></NewTreatmentLog>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
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
  </div>
</template>

<script>
import Prescription from "@components/common/Prescription.vue";
import chatBox from "@components/chatBox/chatBox.vue";

import NewTreatmentLog from "./components/NewTreatmentLog.vue";
import questionnaire from "@components/questionnaires/mixin.js";
import SpecialInput from "@components/common/SpecialInput.vue";

import {
  getRuyuanLogs,
  getApplyDetails,
} from "@api/operationmanage/operationmanage.js";
import {
  getTreatmentOptions,
  getStateOptions,
} from "@api/patienttreatment/patienttreatment.js";

import {
  postRuyuanPinggu,
  postTreatLogs,
  confirmApply,
} from "@api/patientInfo/patientinfo.js";

export default {
  mixins: [questionnaire],
  components: {
    PrescriptionTable: Prescription,
    chatBox,
    NewTreatmentLog,
    SpecialInput,
  },
  computed: {
    logreadonly() {
      if (this.readonly == true) return true;
      else {
        if (this.flag) {
          return true;
        }
      }
      return false;
    },
  },
  props: {
    readonly: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    pid: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      flag: false,
      pages: {
        pageSize: 5,
        currentPage: 1,
        collapse_activeNames: ["1", "4"],
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
        inputBoxVisible: {
          illState: false,
          diagResult: false,
          treatment: false,
        },
      },
      patientInfo: {
        API_basicInfo: {},
      },
      pinggu: [],
      newTreatLog: {
        API_patientState: [],
        API_treatment: [],
        API_prescription: [],
      },
    };
  },
  methods: {
    pingguCancel(item) {
      item.isOpen = false;

      this.pinggu.splice(0, 0);
    },
    pingguCommit(index, data) {
      let pid = this.pid;
      postRuyuanPinggu(pid, data).then((res) => {
        if (res) {
          this.pinggu.forEach((item, index) => {
            if (item.name == data.name) {
              data.state = "已完成";
              switch (data.name) {
                case "跌倒风险评定":
                  data.type = "DIEDAO";
                  break;
                case "吞咽功能评定":
                  data.type = "TUNYAN";
                  break;
              }
              this.pinggu.splice(index, 1, data);
            }
          });
        }
      });
      this.$message.success("提交成功");
    },
    jinxingpinggu(item, index) {
      let obj = JSON.parse(JSON.stringify(item));
      if (item.isOpen) {
        obj.isOpen = false;
      } else {
        obj.isOpen = true;
      }
      this.pinggu.splice(index, 1, obj);
    },
    importPreData(data) {
      this.newTreatLog = {
        API_patientState: data.API_patientState,
        API_treatment: data.API_description,
        API_prescription: data.API_prescription,
      };
    },

    inputBoxShow(type) {
      if (!this.readonly) {
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

    saveNewLog() {
      let pid = this.pid;
      this.newTreatLog.API_description = this.newTreatLog.API_treatment;
      confirmApply(pid, this.newTreatLog).then((res) => {
        if (res) {
          this.pages.newLogFlag = false;
          this.flag = true;
        } else {
          this.$message.error("请完善治疗记录");
        }
      });
    },
  },
  mounted() {
    this.$emit("startLoading");
    setTimeout(() => {
      let pid = this.pid;
      getRuyuanLogs(pid).then((res) => {
        let arr = [
          {
            type: "TUNYAN",
            name: "吞咽功能评定",
            state: "未完成",
            data: {},
          },
          {
            type: "DIEDAO",
            name: "跌倒风险评定",
            state: "未完成",
            data: {},
          },
          {
            type: "HULI",
            name: "护理记录首页",
            state: "未完成",
            data: {},
          },
          {
            type: "HUXI",
            name: "Barthle指数评定",
            state: "未完成",
            data: {},
          },
        ];

        res.pinggu.forEach((item) => {
          arr.forEach((item2) => {
            if (item.name == item2.name) {
              item2.state = "已完成";
              item2.data = item.data;
            }
          });
        });
        this.pinggu = arr;
        this.newTreatLog = {
          API_patientState: res.treat.API_patientState,
          API_treatment: res.treat.API_description,
          API_prescription: res.treat.API_prescription,
        };
        this.$emit("endLoading");

        if (
          this.newTreatLog.API_patientState &&
          this.newTreatLog.API_patientState.length > 0
        )
          this.flag = true;
      });
    }, 0);
    if (!this.readonly) {
      getTreatmentOptions().then((res) => {
        this.pages.treatmentOptions = res;
      });
      getStateOptions().then((res) => {
        this.pages.stateOptions = res;
      });
    }
  },
};
</script>

<style scoped lang="scss">
.mainContent {
  width: 100%;
  .title {
    font-size: 17px;
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
