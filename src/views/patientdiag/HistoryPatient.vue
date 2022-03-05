<template>
  <div>
    <div>
      <div class="global-container mt20">
        <SearchTool :tableData="tableData" :rules="formInline" v-model="showTable">
        </SearchTool>
      </div>
      <div class="global-container mt20">
        <TablePage :tableData="showTable" :headers="headers" :btns="btns"></TablePage>
      </div>
    </div>
  </div>
</template>

<script>
import { getHistoryPatients } from "../../api/patientdiag/patientdiag.js";
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
        path: "/patientdiag/historydetails",
        query: { pid: row.API_pid },
      });
    },
  },
  computed: {},
  mounted() {
    this.$store.commit("startLoading");
    getHistoryPatients().then((res) => {
      this.tableData = res;
      this.tableData.sort((a, b) => {
        if (new Date(a.API_date) > new Date(b.API_date)) return -1;
        else return 1;
      });
      this.$store.commit("endLoading");
    });
  },
};
</script>

<style scoped lang="scss"></style>
