<template>
  <div class="global-container mt20">
    <div class="mt20">
      <SearchTool
        :tableData="tableData"
        :rules="formInline"
        v-model="showTable"
        title="患者查询"
      >
      </SearchTool>
    </div>
    <div class="mt20">
      <TablePage :tableData="showTable" :headers="headers" :btns="btns"></TablePage>
    </div>
  </div>
</template>

<script>
import { getHistoryList } from "@api/chafang/chafang.js";
export default {
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
          label: "住院号",
          value: "API_toHospitalID",
          type: "input",
        }
      ],
      headers: [
        { label: "住院号", value: "API_toHospitalID" },
        { label: "姓名", value: "API_name" },
        { label: "诊断专家", value: "API_expert" },
        { label: "申请时间", value: "API_date" },
      ],
      btns: [
        {
          label: "查看",
          func: this.patientDetails,
        },
      ],
      searchRule: {
        rule: "API_name",
        value: "",
      },

      tableData: [],
    };
  },
  methods: {
    patientDetails(row, index) {
      //this.$store.commit("operationManage/currentPidChange", row.API_pid);
      this.$router.push({
        path: "/historyRounds/chafangDetail",
        query: { pid: row.API_pid },
      });
    },
  },

  mounted() {
    this.$store.commit("startLoading");
    getHistoryList().then((res) => {
      // console.log(res);
      this.tableData = res;
      this.$store.commit("endLoading");
    });
  },
};
</script>
