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
import { getPatientsList } from "@api/operationmanage/operationmanage.js";
export default {
  sockets: {
    confirm_tohospital() {
      getPatientsList().then((res) => {
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
        {
          label: "今日护理状态",
          value: "API_state",
          type: "selection",
        },
        // {
        //   label: "是否需要评估",
        //   value: "API_pingguState",
        //   type: "selection",
        // },
      ],
      headers: [
        { label: "住院号", value: "API_toHospitalID", sortable: true },
        { label: "姓名", value: "API_name" },
        { label: "诊断专家", value: "API_expert" },
        { label: "入院时间", value: "API_date", sortable: true },
        { label: "今日护理状态", value: "API_state" },
        // { label: "是否需要评估", value: "API_pingguState" },
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
      tableRowClassName: function (data) {
        let row = data.row;
        if (row.API_state == "未处理") {
          return "highlight";
        } else {
          return "";
        }
      },
    };
  },
  methods: {
    patientDetails(row, index) {
      // this.$store.commit("operationManage/currentPidChange", row.API_pid);
      // this.$router.push("/operationmanage/patientdetails");
      this.$router.push({
        path: "/operationmanage/patientdetails",
        query: { pid: row.API_pid },
      });
    },

    searchRuleChange() {
      this.searchRule.value = "";
      this.formInline = {
        API_name: "",
        API_number: "",
        API_expert: "",
        API_state: "",
        API_pingguState: "",
      };
    },
  },
  computed: {},
  created() {
    this.$store.commit("startLoading");
    getPatientsList().then((res) => {
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
.el-table .highlight {
  background: oldlace;
}
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
