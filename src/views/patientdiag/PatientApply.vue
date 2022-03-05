<template>
  <div>
    <div class="global-container mt20">
      <SearchTool :tableData="tableData" :rules="formInline" v-model="showTable">
      </SearchTool>
    </div>
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
import { getTodayPatients } from "@api/patientdiag/patientdiag.js";
export default {
  sockets: {
    seekMedical() {
      this.fetch();
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
    btnControl(btn, row) {
      if (btn.label == "接受" && row.API_state !== "申请中") {
        return false;
      }
      return true;
    },
    patientDetails(row, index) {
      this.$router.push({
        path: "/diagApply/details",
        query: { pid: row.API_pid },
      });
    },
    acceptApply(patient) {
      this.$socket.client.emit("seekmedicalreply", {
        doctorID: this.$store.state.user.userInfo.userId,
        pid: patient.API_pid,
      });
      this.fetch();
    },

    fetch() {
      getTodayPatients().then((res) => {
        this.tableData = res;
        this.$store.commit("endLoading");
      });
    },
  },
  created() {
    this.$store.commit("startLoading");
    this.fetch();
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
