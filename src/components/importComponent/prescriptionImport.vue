<template>
  <!-- 导入处方
  
  导出的数据
    [
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
  
   -->

  <el-dialog title="处方" :visible.sync="diagFlag" width="650px">
    <el-table :data="prescriptions" style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column label="处方">
        <template slot-scope="scope">
          <span>{{ scope.row | dataFormat }}</span>
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
  filters: {
    dataFormat(prescription) {
      let arr = [];
      prescription.forEach((element) => {
        arr.push(element.API_drugsName);
      });
      return arr.join("、");
    },
  },
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
      patientState: [
        ["头晕", "恶心", "失语", "容易迷路"],
        ["心跳加速", "全身乏力", "情绪激动", "容易迷路"],
        ["心悸", "颅内压升高", "血压升高", "步态障碍"],
        ["呼吸变慢", "瞳孔改变", "尿潴留和失禁", "步态障碍"],
        ["心跳加速", "失语"],
      ],
      prescriptions: [
        [
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
        ],
        [
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
        [
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
        [
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
        [
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