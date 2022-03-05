<template>
  <div class="global-container mt20">
    <div>
      <div class="mt20">
        <SearchTool
          title="会诊查询"
          :tableData="tableData"
          :rules="searchRule"
          v-model="showTable"
        >
        </SearchTool>
      </div>
      <div class="mt20">
        <TablePage :tableData="showTable" :headers="headers" :btns="btns"></TablePage>
      </div>
    </div>
  </div>
</template>

<script>
import { getHisVideoConsultationList } from "@api/videoConsultation/videoConsultation.js";
export default {
  sockets: {},
  data() {
    return {
      searchRule: [
        { label: "患者姓名", value: "API_Name", type: "input" },
        { label: "会诊号", value: "API_consulationId", type: "input" },
        { label: "会诊状态", value: "API_state", type: "selection" },
        { label: "会诊性质", value: "API_type", type: "selection" },
      ],

      tableData: [],
      showTable: [],

      headers: [
        { label: "会诊号", value: "API_consulationId", width: "100px", sortable: true },
        { label: "姓名", value: "API_Name", sortable: true },
        { label: "会诊性质", value: "API_type", sortable: true },
        { label: "主持人", value: "API_holder", sortable: true },
        { label: "会诊状态", value: "API_state", sortable: true },
        { label: "开始时间", value: "API_startTime", width: "180px", sortable: true },
        { label: "结束时间", value: "API_endTime", width: "180px", sortable: true },
      ],
      btns: [
        {
          label: "查看",
          func: this.patientDetails,
        },
      ],
    };
  },
  methods: {
    patientDetails(row, index) {
      this.$store.commit("videoConsultation/currentPidChange", row.API_pid);
      this.$store.commit(
        "videoConsultation/currentConsultationIdChange",
        row.API_consulationId
      );
      this.$store.commit(
        "videoConsultation/currentConsultationStateChange",
        row.API_state
      );
      this.$store.commit(
        "videoConsultation/currentConsultationSourceChange",
        row.API_source
      );
      this.$store.commit(
        "videoConsultation/currentConsultationIsholderChange",
        row.API_type
      );
      // this.$store.commit(
      //   "videoConsultation/currentConsultationSourceChange",
      //   "jiuzhen"
      // );
      this.$router.push("/videoconsultation/historyconsultationdetails");
    },
  },
  computed: {},
  mounted() {
    this.$store.commit("startLoading");
    getHisVideoConsultationList().then((res) => {
      this.tableData = res;
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
  font-size: 16px;
  // font-weight: bold;
  color: #1c7e7c;
  margin-left: 5px;
}
.btn {
  background-color: #1c7e7c;
  margin-left: 30px;
}
</style>
<style>
.el-table .highlight {
  background: oldlace;
}
</style>
<style lang="scss">
.searchRule {
  .el-input__inner {
    border: 0px;
    color: #1c7e7c;
    font-size: 16px;
  }
  :hover {
    background-color: #eff3f4;
  }
}
</style>
