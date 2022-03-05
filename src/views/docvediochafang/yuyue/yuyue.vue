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
import {getReserveList} from '@api/docchafang/docchafang'

export default {
  name: "yuyue",
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
        { label: "查房开始时间", value: "reserveTime" }
      ],
      btns: [
        {
          label: "查看",
          func: this.yuyueDetails
        }
      ],
      tableData: []
    };
  },
  mounted() {
    this.$store.commit("startLoading");
    getReserveList().then(res => {
      this.tableData = res;
      console.log(res);
      this.$store.commit("endLoading");
    });
  },
  methods: {
    yuyueDetails(row, index) {
      this.$router.push({
        path: "/yuyue/yuyueDetail",
        query: { pid: row.API_pid },
      });
    },
  }
};
</script>

<style scoped>

</style>