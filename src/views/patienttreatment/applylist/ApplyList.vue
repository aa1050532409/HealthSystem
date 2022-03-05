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
import { getApplyList } from "@api/patienttreatment/patienttreatment.js";
export default {
  sockets: {
    doctor_confirm_tohospital() {
      getApplyList().then((res) => {
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
      // searchRule: {
      //   rule: "API_name",
      //   value: "",
      // },
      // formInline: {
      //   API_name: "",
      //   API_number: "",
      //   API_expert: "",
      // },
      // tableData: [],
      // currentPage: 1,
      // pageSize: 10,
    };
  },
  methods: {
    patientDetails(row, index) {
      this.$router.push({
        path: "/treatment/applydetails",
        query: { pid: row.API_pid },
      });
    },
  },
  computed: {},
  mounted() {
    this.$store.commit("startLoading");
    getApplyList().then((res) => {
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
