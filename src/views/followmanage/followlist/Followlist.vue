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
      <TablePage
        :tableData="showTable"
        :headers="headers"
        :btns="btns"
        :tableRowClassName="tableRowClassName"
      ></TablePage>
    </div>
  </div>
</template>

<script>
import { getPatientList } from "@api/followmanage/followmanage.js";
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
        { label: "诊断结论", value: "API_digaResult" },
        { label: "出院时间", value: "API_enddate", sortable: true },
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
      // this.$store.commit("followManage/currentPidChange", row.API_pid);
      this.$router.push({
        path: "/followmanage/followdetails",
        query: {
          pid: row.API_pid,
        },
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.API_state == "未处理" || row.API_pingguState == "是") {
        return "highlight";
      } else {
        return "";
      }
    },
    searchRuleChange() {
      this.searchRule.value = "";
      this.formInline = {
        API_name: "",
        API_number: "",
        API_expert: "",
        API_state: "",
      };
    },
  },

  mounted() {
    this.$store.commit("startLoading");
    getPatientList().then((res) => {
      this.$store.commit("endLoading");
      this.tableData = res;
    });
  },
};
</script>
