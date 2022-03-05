<template>
  <!-- 导入治疗建议文字 
  导出的数据
     [
          "清淡饮食",
          "炎症消耗期加强高质量蛋白质摄入",
          "避免高油高糖饮食",
          "清淡饮食",
          "多吃水果蔬菜",
        ],
  
  
  -->
  <el-dialog title="治疗建议" :visible.sync="diagFlag" width="650px">
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
        ["规律服药", "定期随访", "作息规律"],
        [
          "清淡饮食",
          "炎症消耗期加强高质量蛋白质摄入",
          "避免高油高糖饮食",
          "清淡饮食",
          "多吃水果蔬菜",
        ],
        ["避免熬夜、抽烟、酗酒", "避免高油高糖饮食"],
        ["勤翻身", "常按摩骨突部位", "避免剧烈运动"],
        ["一般治疗", "清淡饮食", "多吃水果蔬菜"],
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