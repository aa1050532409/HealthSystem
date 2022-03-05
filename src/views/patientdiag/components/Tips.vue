<template>
  <!-- 
提示
  -->
  <div class="tips clearFloat">
    <div class="text">当前患者申请{{ consultationType }}，请尽快处理</div>
    <div v-if="this.state == '未处理'" class="controlBtn">
      <el-link @click="$emit('ok')" style="margin-left: 20px" type="success"
        >发起会诊</el-link
      >
      <el-link @click="refuse" style="margin-left: 20px" type="warning">拒绝会诊</el-link>
    </div>
    <div v-else class="controlBtn">
      <el-tag
        style="margin-left: 30px"
        :type="state == '已拒绝' ? 'danger' : 'success'"
        >{{ state }}</el-tag
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    state: String,
  },
  computed: {
    consultationType() {
      if (this.type == "putong") {
        return "普通会诊";
      } else {
        return "视频会诊";
      }
    },
  },
  methods: {
    refuse() {
      this.$confirm("此操作将拒绝患者的会诊申请, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("err");
          //   this.$message({
          //     type: "success",
          //     message: "已拒绝!",
          //   });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.tips {
  margin: 0 20px;
  padding: 20px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  .text {
    font-size: 18px !important;
    display: inline;
  }
  .controlBtn {
    display: inline;
    font-size: 18px !important;
  }
}
</style>
