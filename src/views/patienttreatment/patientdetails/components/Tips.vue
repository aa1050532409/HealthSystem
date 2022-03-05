<template>
  <!-- 
个人信息
  -->
  <div class="tips clearFloat">
    <div class="mainLabel">提示</div>
    <div class="text">当前患者申请结束住院，请尽快处理。</div>
    <div>理由：{{ reason }}</div>
    <div class="controlBtn">
      <el-link @click="$emit('end')" style="margin-left: 20px" type="success"
        >结束住院</el-link
      >
      <el-link @click="refuse" style="margin-left: 20px" type="warning">拒绝出院</el-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reason: String,
  },
  computed: {},
  methods: {
    refuse() {
      this.$confirm("此操作将拒绝患者的出院申请, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("refuse");
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
