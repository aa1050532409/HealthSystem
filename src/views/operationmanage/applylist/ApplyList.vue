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
import { getApplyList } from "@api/operationmanage/operationmanage.js";
export default {
  sockets: {
    after_treatment_request() {
      this.fetchData();
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
          label: "住院号",
          value: "API_toHospitalID",
          type: "input",
        },
        {
          label: "主诊专家",
          value: "API_expert",
          type: "input",
        },
      ],
      headers: [
        { label: "住院号", value: "API_toHospitalID", sortable: true },
        { label: "姓名", value: "API_name" },
        { label: "诊断专家", value: "API_expert" },
        { label: "申请时间", value: "API_date", sortable: true },
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
      this.$store.commit("operationManage/currentPidChange", row.API_pid);
      this.$router.push({
        path: "/operationmanage/applydetails",
        query: { pid: row.API_pid },
      });
    },
    fetchData() {
      getApplyList().then((res) => {
        this.tableData = res;
        this.$store.commit("endLoading");
      });
    },
  },

  mounted() {
    this.$store.commit("startLoading");
    this.fetchData();
  },
};
</script>
