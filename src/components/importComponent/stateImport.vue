<template>
  <!-- 导入患者状态
    导出的数据

     [
     "心跳加速",
      "全身乏力", 
      "情绪激动", 
      "容易迷路"
      ]
   -->
  <el-dialog title="患者状态" :visible.sync="diagFlag" width="650px">
    <el-table :data="patientState" style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column label="患者状态">
        <template slot-scope="scope">
          <span>{{ scope.row.join("，") }}</span>
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
        ["头晕", "恶心", "失语", "容易迷路"],
        ["心跳加速", "全身乏力", "情绪激动", "容易迷路"],
        ["心悸", "颅内压升高", "血压升高", "步态障碍"],
        ["呼吸变慢", "瞳孔改变", "尿潴留和失禁", "步态障碍"],
        ["心跳加速", "失语"],
      ],
    };
  },
  methods: {
    importResult(data) {
      this.$emit("import", data);
      this.diagFlag = false;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
</style>