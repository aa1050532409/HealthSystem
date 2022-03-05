<template>
  <div class="global-container mt20">
    <div class="mt20">
      <SearchTool
        :tableData="tableData"
        :rules="formInline"
        v-model="showTable"
        title="患者查询"
      >
        <el-button type="warning" size="small">识别患者身份</el-button>
      </SearchTool>
    </div>
    <div class="mt20">
      <TablePage :tableData="showTable" :headers="headers" :btns="btns"></TablePage>
    </div>
  </div>
</template>

<script>
import { getTodayList } from "@api/chafang/chafang.js";
export default {
  data() {
    return {
      showTable: [],
      formInline: [
        {
          label: "姓名",
          value: "API_name",
          type: "input"
        },
        {
          label: "住院号",
          value: "API_toHospitalID",
          type: "input"
        }
      ],
      headers: [
        { label: "住院号", value: "API_toHospitalID" },
        { label: "姓名", value: "API_name" },
        { label: "诊断专家", value: "API_expert" },
        { label: "入院时间", value: "API_date" }
      ],
      btns: [
        {
          label: "查看",
          func: this.patientDetails
        }
      ],
      // searchRule: {
      //   rule: "API_name",
      //   value: "",
      // },
      tableData: [],
    };
  },
  methods: {
    patientDetails(row, index) {
      this.$router.push({
        path: "/todayRounds/chafangDetail",
        query: { pid: row.API_pid },
      });
    },
  },

  mounted() {
    this.$store.commit("startLoading");
    getTodayList().then((res) => {
      this.tableData = res;
      this.$store.commit("endLoading");
    });
  }
};
</script>
