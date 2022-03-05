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
      <TablePage :tableData="showTableR" :headers="headers" :btns="btns"></TablePage>
    </div>
  </div>
</template>

<script>
import { getHistoryPatientList } from "@api/patienttreatment/patienttreatment.js";
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
        { label: "入院时间", value: "API_date", sortable: true },
        { label: "出院时间", value: "API_enddate", sortable: true },
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
      // this.$store.commit("patientTreatment/currentPidChange", row.API_pid);
      // this.$router.push("/treatment/historypatientdetails");
      this.$router.push({
        path: "/treatment/historypatientdetails",
        query: {
          pid: row.API_pid,
        },
      });
    },
  },
  computed: {
    showTableR: function () {
      let result = [];
      result = this.showTable.map((item) => {
        item.API_date = this.$timeFormat(item.API_date).format("yyyy-MM-DD");
        item.API_enddate = this.$timeFormat(item.API_enddate).format("yyyy-MM-DD");
        return item;
      });
      return result;
    },
  },
  mounted() {
    this.$store.commit("startLoading");
    getHistoryPatientList().then((res) => {
      this.$store.commit("endLoading");
      this.tableData = res;
    });
  },
};
</script>
