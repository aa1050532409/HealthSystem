<template>
  <div>
    <div class="global-container mt20">
      <SearchTool :tableData="tableData" :rules="formInline" v-model="showTable">
      </SearchTool>
    </div>

    <!--  
    <div class="mt20">
      <el-button @click="dealAll">deal</el-button>
    </div>-->
    <div class="global-container mt20">
      <TablePage
        :tableData="showTable"
        :headers="headers"
        :btns="btns"
        :btnControl="btnControl"
      ></TablePage>
    </div>
  </div>
</template>

<script>
import { savePatientDiagInfo, getTodayDaizhen } from "@api/patientdiag/patientdiag.js";
export default {
  sockets: {
    seekMedical() {
      this.dataFetch();
    },
  },
  data() {
    return {
      showTable: [],
      formInline: [
        {
          label: "姓名",
          value: "API_name",
          type: "input",
        },
        {
          label: "就诊状态",
          value: "API_state",
          type: "selection",
        },
        {
          label: "病历号",
          value: "API_pid",
          type: "input",
        },
      ],
      headers: [
        { label: "就诊序号", value: "todayIndex", sortable: true },
        { label: "病历号", value: "API_pid", sortable: true },
        { label: "姓名", value: "API_name", sortable: true },
        { label: "症状", value: "API_symptom" },
        { label: "就诊时间", value: "API_date", sortable: true },
        { label: "就诊状态", value: "API_state", sortable: true },
      ],
      btns: [
        {
          label: "查看",
          func: this.patientDetails,
        },
        {
          label: "接受",
          type: "success",
          func: this.acceptApply,
        },
      ],
      tableData: [],
    };
  },

  methods: {
    dealAll() {
      this.tableData.forEach((item) => {
        if (item.API_state == "未完成") {
          this.confirmSave(item.API_pid);
        }
      });
    },
    confirmSave(pid) {
      savePatientDiagInfo(
        pid,
        "已完成",
        {
          API_description: ["xxxxxxx"],
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
              API_video: "",
            },
          ], //视频的地址，以数组的形式发过来
        },
        {
          //诊断结论
          API_diagResult: ["xxxxxx"],
          //治疗方案
          API_treatment: {
            API_description: ["xxxxxxxx"],
            API_prescriptionFlag: true,
            API_prescription: [], //处方
          },
          // 推荐医疗机构/医师/护士
          API_after: [],
        }
      );
    },

    btnControl(btn, row) {
      if (btn.label == "接受" && row.API_state !== "申请中") {
        return false;
      }
      return true;
    },
    patientDetails(row, index) {
      this.$router.push({
        path: "/patientdiag/details",
        query: { pid: row.API_pid },
      });
    },
    acceptApply(patient) {
      this.$socket.client.emit("seekmedicalreply", {
        doctorID: localStorage.getItem("UserID"),
        pid: patient.API_pid,
      });
      this.dataFetch();
    },
    sortFunc(a, b) {
      let dict = {
        未完成: 0,
        进行中: 1,
        已完成: 2,
      };
      if (a.API_state != b.API_state) {
        return dict[a.API_state] - dict[b.API_state];
      } else {
        return new Date(a.API_date) - new Date(b.API_date);
      }
    },
    dataFetch() {
      getTodayDaizhen().then((res) => {
        this.tableData = res;
        this.tableData = this.tableData.filter((item) => item.API_state !== "申请中");
        this.tableData = this.tableData.sort(this.sortFunc);
        this.tableData = this.tableData.map((item, index) => {
          item.todayIndex = item.API_number;
          return item;
        });
        this.$store.commit("endLoading");
      });
    },
  },
  created() {
    this.$store.commit("startLoading");
    this.dataFetch();
  },
};
</script>

<style scoped lang="scss">
.eltable {
  width: 90%;
  margin: 10px 5%;
}

.filter {
  margin: 20px 0px 0px 5%;
}
.page {
  float: right;
  margin: 10px 5% 10px 0px;
}
.formLabel {
  font-size: 18px;
  font-weight: bold;
  color: #1c7e7c;
  margin-left: 5px;
}
.btn {
  background-color: #1c7e7c;
  margin-left: 30px;
}
</style>
