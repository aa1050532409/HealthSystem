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
        <TablePage
          :tableData="showTableTimeFormat"
          :headers="headers"
          :btns="btns"
        ></TablePage>
      </div>
    </div>
  </div>
</template>

<script>
import { getGroupConsultationList } from "@api/groupconsultation/groupconsultation.js";
export default {
  sockets: {
    newGroupConsultation() {
      this.fetchData();
    },
  },
  data() {
    return {
      searchRule: [
        { label: "患者姓名", value: "API_Name", type: "input" },
        { label: "会诊号", value: "API_consulationId", type: "input" },
        { label: "就诊号", value: "pid", type: "input" },
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
        { label: "就诊号", value: "pid", width: "100px", sortable: true },
        { label: "会诊状态", value: "API_state", sortable: true },
        { label: "时间", value: "timeFormat", width: "220px" },
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
      this.$router.push({
        path: "/groupconsultation/consulationdetails",
        query: {
          cid: row.API_consulationId,
          pid: row.pid,
        },
      });
    },
    fetchData() {
      getGroupConsultationList().then((res) => {
        this.tableData = res;
        this.tableData.sort((a, b) => {
          return b.API_consulationId - a.API_consulationId;
        });
        this.$store.commit("endLoading");
      });
    },
  },
  computed: {
    showTableTimeFormat() {
      this.showTable = this.showTable.map((item) => {
        item.timeFormat = `${this.$timeFormat(item.API_startTime).format(
          "MM-DD HH:mm"
        )} 至 ${this.$timeFormat(item.API_endTime).format("MM-DD HH:mm")}`;

        return item;
      });
      return this.showTable;
    },
  },
  created() {
    this.$store.commit("startLoading");
    this.fetchData();
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
