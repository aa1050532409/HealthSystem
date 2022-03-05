<template>
  <div class="diagResult">
    <div class="head clearFloat">
      <div class="more">
        <el-link @click="treatImportFlag = true" class="link" type="success"
          >+导入治疗方案</el-link
        >
        <el-link @click="prescriptionImportFlag = true" class="link" type="success"
          >+导入处方</el-link
        >
      </div>
    </div>

    <div>
      <MyInput
        :readonly="state == '未完成' ? false : true"
        v-model="treatment.API_description"
        type="treat"
      ></MyInput>
    </div>

    <div class="prescription">
      <div v-show="treatment.API_prescription.length > 0">
        <span class="label">处方</span>
        <el-link
          v-if="this.state == '未完成'"
          type="danger"
          style="float: right"
          @click="delPrescription"
          >删除</el-link
        >
      </div>
      <prescription-edit
        :readonly="this.state == '未完成' ? false : true"
        :prescription="treatment.API_prescription"
        v-model="treatment.API_prescription"
        type="type1"
      ></prescription-edit>
    </div>

    <!-- 导入历史治疗方案 -->
    <TreatPlanImport
      @import="importTreatment($event)"
      v-model="treatImportFlag"
    ></TreatPlanImport>

    <!-- 导入处方 -->
    <PrescriptionImport
      @import="importPrescription($event)"
      v-model="prescriptionImportFlag"
    ></PrescriptionImport>
  </div>
</template>

<script>
export default {
  props: {
    state: String,
    treatment: Object,
  },
  data() {
    return {
      treatImportFlag: false,
      prescriptionImportFlag: false,
    };
  },
  methods: {
    importTreatment(row) {
      this.$emit("update:treatment", row);
    },
    importPrescription(row) {
      this.$emit("update:treatment", {
        API_description: this.treatment.API_description,
        API_prescription: row,
      });
    },
    delPrescription() {
      this.$emit("update:treatment", {
        API_description: this.treatment.API_description,
        API_prescription: [],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.diagResult {
  width: 95%;
  margin: auto;
  .head {
    .checkBox {
      float: left;
    }
    .more {
      float: right;
      .link {
        margin-left: 30px;
      }
    }
  }
  .box {
    width: 100%;
    min-height: 100px;
    margin-top: 5px;
    border: 1px solid #e4e7ed;
    p {
      margin-top: 5px;
      font-size: 18px;
      text-indent: 20px;
    }
  }

  .prescription {
    margin-top: 20px;
    .label {
      font-size: 18px;
      color: #1c7e7c;
    }
  }
}
</style>
