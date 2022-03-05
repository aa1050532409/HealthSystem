<template>
  <!-- 导入历史诊断结论 
  导出数据类型
   [
      "一氧化碳中毒性脑病",
      "三期梅毒性脑膜炎",
      "X-连锁隐性遗传脊髓小脑性共济失调",
  ]
  
  -->
  <el-dialog title="诊断结论" :visible.sync="diagFlag" width="650px">
    <el-table :data="patientState" style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column label="诊断结论">
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
        [
          "一氧化碳中毒性脑病",
          "三期梅毒性脑膜炎",
          "X-连锁隐性遗传脊髓小脑性共济失调",
        ],
        ["脊髓空洞症", "脊柱硬膜外血肿", "脊髓血管畸形"],
        ["脑脓肿", "脑内寄生虫", "脉络丛肿瘤", "三期梅毒性脑膜炎"],
        [
          "一氧化碳中毒性脑病",
          "三期梅毒性脑膜炎",
          "X-连锁隐性遗传脊髓小脑性共济失调",
          "胶质瘤",
        ],
        ["血管母细胞瘤", "三期梅毒性脑膜炎", "脊髓血管畸形"],
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