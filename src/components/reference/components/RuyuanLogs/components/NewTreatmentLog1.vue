<template>
  <div class="newLog">
    <span class="label">患者状况：</span>
    <div class="box" @click="inputBoxShow('state')">
      <p>
        {{
          (newLog.API_patientState && newLog.API_patientState.join("，")) ||
            "暂无"
        }}
      </p>
    </div>
    <span class="label">治疗建议：</span>
    <div class="box" @click="inputBoxShow('treatment')">
      <p>
        {{
          (newLog.API_patientState && newLog.API_description.join("，")) ||
            "暂无"
        }}
      </p>
    </div>
    <div>
      <!-- <Prescription :prescription="newLog.API_prescription"></Prescription> -->
      <PrescriptionEdit
        :prescription="newLog.API_prescription"
        :readonly="true"
      ></PrescriptionEdit>
    </div>
  </div>
</template>

<script>
import SpecialInput from "@components/common/SpecialInput.vue";
import PrescriptionEdit from "@components/common/PrescriptionEdit.vue";
import Prescription from "@components/common/Prescription.vue";
export default {
  name: "NewTreatmentLog",
  props: {
    newLog: {
      type: Object,
      default: () => {
        return {
          API_patientState: [],
          API_description: [],
          API_prescription: [
            {
              API_drugsName: "含曲林片",
              API_drugsNumberUnits: "盒",
              API_drugsNumber: "2",
              API_drugsUsage: "一次两粒",
              API_useFrequency: "一天一次",
              API_drugsSpecification: "0.1g",
              API_useTime: "饭后",
              API_isEditable: false,
              API_days: "7"
            }
          ]
        };
      }
    },
    options: {
      type: Object,
      default: () => {
        return {
          type: "newLog"
        };
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      newTreatmentLog: {
        API_treatment: [],
        API_prescription: [],
        API_prescriptionFlag: true
      }
    };
  },
  components: {
    SpecialInput,
    PrescriptionEdit,
    Prescription
  },
  methods: {
    inputBoxShow(type) {
      this.$emit("inputBox", type);
    },
    prescription(data) {
      this.newTreatmentLog.API_prescription = data;
      this.$emit("prescription", this.newTreatmentLog.API_prescription);
    }
  }
};
</script>

<style lang="scss" scoped>
.newLog {
  .label {
    font-size: 16px;
    color: #1c7e7c;
  }
  .box {
    width: 100%;
    min-height: 60px;
    margin-top: 5px;
    border: 1px solid #e4e7ed;
    p {
      margin-top: 5px;
      font-size: 16px;
      text-indent: 20px;
    }
  }
}
</style>