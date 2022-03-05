<template>
  <!-- 导入历史诊断结论 
  导出数据类型
    "请大家一起来进行转诊病情的讨论"
  -->
  <el-dialog title="讨论内容" :visible.sync="diagFlag" width="650px">
    <el-table :data="patientState" style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column label="讨论内容">
        <template slot-scope="scope">
          <span>{{ scope.row }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" width="100" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="importResult(scope.row)"
            >选择</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
  },
  watch: {
    diagFlag: function (value) {
      if (!value) {
        this.$emit("input", false);
      }
    },
    value: function (value) {
      if (value) {
        this.diagFlag = true;
      }
    },
  },
  data() {
    return {
      diagFlag: false,
      patientState: [
        "一起讨论患者的下一步治疗",
        "请大家给出自己对于患者的诊断想法",
        "请大家一起来进行转诊病情的讨论",
        "该患者病情复杂，需要大家一起讨论",
        "该患者病情具有典型性，值得大家一起看看",
      ],
    };
  },
  methods: {
    importResult(data) {
      this.$emit("import", data);
      this.diagFlag = false;
    },
  },
  mounted() {
    this.diagFlag = this.flag;
  },
};
</script>

<style lang="scss" scoped>
</style>