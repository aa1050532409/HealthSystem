<template>
  <div>
    <div class="global-container mt20">
      <div>
        <div class="mt20">
          <SearchTool
            title="会诊查询"
            :tableData="tableData"
            :rules="formInline"
            v-model="showTable"
          >
          </SearchTool>
        </div>
        <div class="mt20">
          <TablePage :tableData="showTable" :headers="headers" :btns="btns"></TablePage>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getVideoConsultationApplyList } from "@api/videoConsultation/videoConsultation.js";
export default {
  sockets: {
    newGroupConsultation() {
      getVideoConsultationApplyList().then((res) => {
        this.tableData = res;
      });
    },
  },
  data() {
    return {
      searchRule: {
        rule: "API_consulationId",
        value: "",
      },
      formInline: [
        { label: "患者姓名", value: "API_Name", type: "input" },
        { label: "会诊号", value: "API_consulationId", type: "input" },
        { label: "会诊状态", value: "API_state", type: "selection" },
        { label: "会诊性质", value: "API_type", type: "selection" },
      ],
      headers: [
        { label: "会诊号", value: "API_consulationId", width: "100px", sortable: true },
        { label: "姓名", value: "API_Name", sortable: true },
        { label: "会诊性质", value: "API_type", sortable: true },
        { label: "主持人", value: "API_holder", sortable: true },
        { label: "会诊状态", value: "API_state", sortable: true },
        { label: "申请", value: "API_applyTime", width: "220px", sortable: true },
      ],
      btns: [
        {
          label: "查看",
          func: this.patientDetails,
        },
      ],
      tableData: [],
      showTable: [],
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
      this.$router.push("/videoconsultation/applydetails");
    },
  },

  mounted() {
    this.$store.commit("startLoading");
    getVideoConsultationApplyList().then((res) => {
      this.$store.commit("endLoading");
      this.tableData = res;
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
