<template>
  <div>
    <div class="global-container mt20">
      <SearchTool :tableData="tableData" :rules="formInline" v-model="showTable">
      </SearchTool>
    </div>
    <div class="global-container mt20">
      <TablePage :tableData="showTable" :headers="headers" :btns="btns"></TablePage>
    </div>
  </div>
</template>

<script>
import { getTodayPatients, getGroupPatients } from "@api/patientdiag/patientdiag.js";

export default {
  sockets: {
    seekMedical() {
      getTodayPatients().then((res) => {
        console.log(res);
        this.tableData = res;
      });
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
          label: "主诊专家",
          value: "expertName",
          type: "selection",
        },
      ],
      headers: [
        { label: "病历号", value: "API_pid", sortable: true },
        { label: "姓名", value: "API_name" },
        { label: "主诊专家", value: "expertName" },
        { label: "症状", value: "API_symptom" },
        { label: "就诊时间", value: "API_date", sortable: true },
      ],
      btns: [
        {
          label: "查看",
          func: this.patientDetails,
        },
      ],
      tableData: [],
    };
  },

  methods: {
    patientDetails(row, index) {
      this.$router.push({
        path: "/patientdiag/discussion/details",
        query: { pid: row.API_pid },
      });
    },
    acceptApply(patient) {
      this.$socket.client.emit("seekmedicalreply", {
        doctorID: localStorage.getItem("UserID"),
        pid: patient.API_pid,
      });
      getTodayPatients().then((res) => {
        this.tableData = res;
      });
    },
  },
  created() {
    this.$store.commit("startLoading");
    getGroupPatients().then((res) => {
      this.tableData = res;
      console.log(res);
      this.$store.commit("endLoading");
    });
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
