<template>
  <!-- 评估日志 -->
  <div>
    <div class="search">
      <span class="formLabel">时间：</span>
      <el-date-picker
        v-model="pages.timeRange"
        type="daterange"
        size="small"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <div style="float: right">
        <el-button
          v-if="!readonly"
          @click="pages.newLogFlag = true"
          size="small"
          style="margin-left: 30px"
          type="success"
          >添加治疗记录</el-button
        >
      </div>
    </div>

    <div>
      <div v-if="pages.newLogFlag" class="newTreatLog">
        <div class="header">
          <span class="title">新治疗记录</span>
          <span @click="pages.newLogFlag = false" class="close">X</span>
        </div>
        <NewTreatmentLog
          @import="importPreData($event)"
          :newLog="newTreatLog"
          @save="saveNewLog($event)"
          @inputBox="inputBoxShow($event)"
          @prescription="prescription($event)"
        ></NewTreatmentLog>
      </div>
    </div>
    <div class="treatmentLog">
      <div v-show="TreatLogs.length == 0" class="tips">暂无治疗记录</div>
      <div
        v-for="item in showTable.slice(
          (pages.currentPage - 1) * pages.pageSize,
          (pages.currentPage - 1) * pages.pageSize + pages.pageSize
        )"
        :key="item.id"
        class="card"
      >
        <div class="date">
          <p>{{ new Date(item.API_date).toLocaleDateString() }}</p>
        </div>
        <div class="treatmentLog">
          <p>
            患者状况：{{
              (item.API_patientState && item.API_patientState.join(",")) ||
              "暂无"
            }}
          </p>
          <p>
            治疗意见：{{
              (item.API_description && item.API_description.join(",")) || "暂无"
            }}
          </p>
          <div v-if="item.API_prescription.length > 0">
            <el-link @click="lookPrescription(item)" type="primary">{{
              item.prescriptionFlag ? "收起处方" : "查看处方"
            }}</el-link>
          </div>
          <div v-if="item.prescriptionFlag">
            <Prescription :prescription="item.API_prescription"></Prescription>
          </div>
        </div>
      </div>
    </div>
    <div class="page clearfix">
      <div class="block" style="float: right; margin: 20px 0px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pages.currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pages.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="showTable.length"
        ></el-pagination>
      </div>
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
import NewTreatmentLog from "./components/NewTreatmentLog.vue";
import SpecialInput from "@components/common/SpecialInput.vue";
import Prescription from "@components/common/Prescription.vue";
import { postTreatLogs } from "@api/patientInfo/patientinfo.js";
import {
  getTreatmentOptions,
  getStateOptions,
  getTreatLogs,
} from "@api/patienttreatment/patienttreatment.js";
export default {
  name: "TreatLogs",
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          type: "newLog",
        };
      },
    },
    pid: {
      type: String,
      default: () => {
        return "";
      },
    },
    readonly: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  computed: {
    showTable() {
      let arr = [];
      this.TreatLogs.forEach((element) => {
        if (this.pages.timeRange) {
          let time1 = new Date(this.pages.timeRange[0]).getTime();
          let time2 = new Date(this.pages.timeRange[1]).getTime();

          let time = new Date(element.API_date).getTime();
          if (time > time1 && time < time2) {
            arr.push(element);
          }
        } else {
          arr.push(element);
        }
      });

      arr.sort((a, b) => {
        let timeA = new Date(a.API_date).getTime();
        let timeB = new Date(b.API_date).getTime();

        return timeB - timeA;
      });
      return arr;
    },
  },
  data() {
    return {
      TreatLogs: [],
      dialogVisible: false,
      pages: {
        inputBoxVisible: {
          illState: false,
          diagResult: false,
          treatment: false,
        },
        timeRange: "",
        currentPage: 1,
        pageSize: 5,
        newLogFlag: false,
        questionnaire: {
          temptarget: "",
          target: "",
          questionnaireOptions: [
            { label: "吞咽功能评定", value: "TUNYAN" },
            { label: "跌倒风险评定", value: "DIEDAO" },
          ],
        },
      },
      newTreatLog: {
        API_patientState: [],
        API_treatment: [],
        API_prescription: [],
      },
    };
  },
  components: {
    NewTreatmentLog,
    SpecialInput,
    Prescription,
  },
  methods: {
    importPreData(data) {
      this.newTreatLog = {
        API_patientState: data.API_patientState,
        API_treatment: data.API_description,
        API_prescription: data.API_prescription,
      };
    },
    lookPrescription(item) {
      if (item.prescriptionFlag) {
        item.prescriptionFlag = false;
      } else {
        item.prescriptionFlag = true;
      }
      this.TreatLogs.splice(0, 0);
    },
    saveNewLog(data) {
      // console.log(data);
      let pid = this.pid;
      this.newTreatLog.API_description = this.newTreatLog.API_treatment;
      this.newTreatLog.time = data.time;
      postTreatLogs(pid, this.newTreatLog).then((res) => {
        if (res) {
          this.pages.newLogFlag = false;
          getTreatLogs(pid).then((res) => {
            this.TreatLogs = res;
          });
        } else {
          this.$message.error("请完善治疗记录");
        }
      });
    },
    handleSizeChange(val) {
      this.pages.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pages.currentPage = val;
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
  mounted() {
    let pid = this.pid;
    this.$emit("startLoading");
    if (!this.readonly) {
      getTreatmentOptions().then((res) => {
        this.pages.treatmentOptions = res;
      });
      getStateOptions().then((res) => {
        this.pages.stateOptions = res;
      });
    }

    getTreatLogs(pid).then((res) => {
      this.TreatLogs = res;
      this.$emit("endLoading");
    });
  },
};
</script>

<style lang="scss" scoped>
.newTreatLog {
  .header {
    width: 100%;
    text-align: center;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #1c7e7c;
    }
    .close {
      float: right;
      cursor: pointer;
    }
  }
  .footer {
    height: 50px;
  }
  width: 95%;
  margin: auto;
  padding: 10px;
  box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.3);
}
.treatmentLog {
  .card {
    width: 95%;
    margin: auto;
    display: flex;
    margin-top: 20px;
    background-color: #eff3f4;
    border-radius: 5px;
    padding: 15px;
    .date {
      font-size: 18px;
      color: #1c7e7c;
    }
    .treatmentLog {
      margin-left: 30px;
      font-size: 18px;
    }
  }
}
.search {
  margin: 20px 0;
  .formLabel {
    font-size: 16px;
    color: #1c7e7c;
  }
  .clearfix:after {
    content: ""; /*设置内容为空*/
    height: 0; /*高度为0*/
    line-height: 0; /*行高为0*/
    display: block; /*将文本转为块级元素*/
    visibility: hidden; /*将元素隐藏*/
    clear: both; /*清除浮动*/
  }
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
</style>