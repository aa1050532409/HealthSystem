<template>
  <div>
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
  </div>
</template>

<script>
import { getMyVideoConsultationList } from "@api/videoConsultation/videoConsultation.js";
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
      this.$router.push({
        path: "/videoconsultation/consulationdetails",
        query: { pid: row.API_pid + "", cid: row.API_consulationId + "" },
      });
    },
    fetchData() {
      getMyVideoConsultationList().then((res) => {
        this.$store.commit("endLoading");
        this.tableData = res;
        this.tableData.map((item) => {
          let sTime = new Date(item.API_startTime).getTime();
          if (item.API_state == "未开始" && Date.now() > sTime) item.API_state = "进行中";
        });
      });
    },
  },
  mounted() {
    this.$store.commit("startLoading");
    this.fetchData();
  },
};
</script>
