<template>
  <!-- 导入治疗方案结论，包括处方和文字
  
  导出的数据
  
  {
    API_description: ["一般治疗", "清淡饮食", "多吃水果蔬菜"],
      API_prescription: [
        {
          API_drugsName: "盐酸曲马多缓释胶囊",
          API_drugsNumber: "1",
          API_drugsNumberUnits: "粒",
          API_drugsSpecification: "0.1g",
          API_drugsUsage: "1",
          API_manufacturer: "贵州益康制药有限公司",
          API_useFrequency: "一天一次",
          API_useTime: "三天",
        },
      ]
    },
  
   -->
  <div>
    <el-dialog title="治疗方案" :visible.sync="diagFlag" width="800px">
      <el-table
        max-height="500px"
        ref="historyTreatment"
        :data="treatPlan"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <PrescriptionEdit
              :prescription="scope.row.API_prescription"
              :readonly="true"
            ></PrescriptionEdit>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column label="治疗方案">
          <template slot-scope="scope">
            <span>{{ scope.row.API_description.join("，") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处方" width="50">
          <template slot-scope="scope">
            <el-button type="text" @click="toogleExpand(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="address" width="100" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="importResult(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
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
      diagFlag2: true,
      treatPlan: [
        {
          API_description: ["一般治疗", "清淡饮食", "多吃水果蔬菜"],
          API_prescription: [
            {
              API_drugsName: "盐酸曲马多缓释胶囊",
              API_drugsNumber: "1",
              API_drugsNumberUnits: "粒",
              API_drugsSpecification: "0.1g",
              API_drugsUsage: "1",
              API_manufacturer: "贵州益康制药有限公司",
              API_useFrequency: "一天一次",
              API_useTime: "三天",
            },
          ],
        },
        {
          API_description: ["规律服药", "作息规律", "心理辅导治疗"],
          API_prescription: [
            {
              API_drugsName: "二溴甘露醇",
              API_drugsNumber: "2",
              API_drugsNumberUnits: "粒",
              API_drugsSpecification: "0.1g",
              API_drugsUsage: "1",
              API_manufacturer: "哈药六厂",
              API_useFrequency: "一天一次",
              API_useTime: "五天",
            },
          ],
        },
        {
          API_description: [
            "清淡饮食，验证消耗期加强高质量蛋白质摄入，避免高油高糖饮食",
            "清淡饮食",
            "多吃水果蔬菜",
          ],
          API_prescription: [
            {
              API_drugsName: "甘露醇烟酸酯片",
              API_drugsNumber: "1",
              API_drugsNumberUnits: "粒",
              API_drugsSpecification: "0.1g",
              API_drugsUsage: "1",
              API_manufacturer: "沈阳奥吉娜药业有限公司",
              API_useFrequency: "一天三次",
              API_useTime: "三天",
            },
            {
              API_drugsName: "呋塞米片",
              API_drugsNumber: "1",
              API_drugsNumberUnits: "粒",
              API_drugsSpecification: "0.1g",
              API_drugsUsage: "1",
              API_manufacturer: "沈阳奥吉娜药业有限公司",
              API_useFrequency: "一天三次",
              API_useTime: "三天",
            },
          ],
        },
        {
          API_description: [
            "避免熬夜、抽烟、酗酒，避免高油高糖饮食",
            "定期检查血常规，肝功能",
          ],
          API_prescription: [
            {
              API_drugsName: "甘露醇烟酸酯片",
              API_drugsNumber: "1",
              API_drugsNumberUnits: "粒",
              API_drugsSpecification: "0.1g",
              API_drugsUsage: "1",
              API_manufacturer: "沈阳奥吉娜药业有限公司",
              API_useFrequency: "一天三次",
              API_useTime: "三天",
            },
            {
              API_drugsName: "甘油果糖氯化钠注射",
              API_drugsNumber: "1",
              API_drugsNumberUnits: "粒",
              API_drugsSpecification: "0.1g",
              API_drugsUsage: "1",
              API_manufacturer: "沈阳奥吉娜药业有限公司",
              API_useFrequency: "一天三次",
              API_useTime: "三天",
            },
          ],
        },
        {
          API_description: ["勤翻身，常按摩骨突部位", "避免剧烈运动"],
          API_prescription: [
            {
              API_drugsName: "甘露醇烟酸酯片",
              API_drugsNumber: "1",
              API_drugsNumberUnits: "粒",
              API_drugsSpecification: "0.1g",
              API_drugsUsage: "1",
              API_manufacturer: "沈阳奥吉娜药业有限公司",
              API_useFrequency: "一天三次",
              API_useTime: "三天",
            },
            {
              API_drugsName: "呋塞米片",
              API_drugsNumber: "1",
              API_drugsNumberUnits: "粒",
              API_drugsSpecification: "0.1g",
              API_drugsUsage: "1",
              API_manufacturer: "沈阳奥吉娜药业有限公司",
              API_useFrequency: "一天三次",
              API_useTime: "三天",
            },
          ],
        },
      ],
    };
  },
  methods: {
    importResult(data) {
      this.$emit("import", data);
      this.diagFlag = false;
    },
    toogleExpand(row) {
      let $table = this.$refs.historyTreatment;
      $table.toggleRowExpansion(row);
    },
  },
  mounted() {
    this.diagFlag = this.flag;
  },
};
</script>

<style lang="scss" scoped>
</style>