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
import { getHisGroupConsultationList } from "@api/groupconsultation/groupconsultation.js";
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

      formInline: {
        API_consulationId: "",
        API_state: "",
        API_name: "",
        API_type: "",
      },
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
      this.$store.commit(
        "groupConsultation/currentConsultationStateChange",
        row.API_state
      );
      this.$store.commit(
        "groupConsultation/currentConsultationSourceChange",
        row.API_source
      );
      this.$store.commit(
        "groupConsultation/currentConsultationIsholderChange",
        row.API_type
      );
      // this.$store.commit(
      //   "groupConsultation/currentConsultationSourceChange",
      //   "jiuzhen"
      // );
      // this.$router.push("/groupconsultation/hisconsulationdetails");
      this.$router.push({
        path: "/groupconsultation/hisconsulationdetails",
        query: {
          cid: row.API_consulationId,
          pid: row.pid,
        },
      });
    },
    // showTableTimeFormat() {
    //   this.showTable = this.showTable.map((item) => {
    //     // item.timeFormat = `${this.$timeFormat(item.API_startTime).format(
    //     //   "MM-DD HH:mm"
    //     // )} 至 ${this.$timeFormat(item.API_endTime).format("MM-DD HH:mm")}`;
    //     return item;
    //   });
    //   return this.showTable;
    // },
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
  mounted() {
    this.$store.commit("startLoading");
    getHisGroupConsultationList().then((res) => {
      this.$store.commit("endLoading");
      this.tableData = res;
    });
  },
};
</script>

<style scoped lang="scss"></style>
