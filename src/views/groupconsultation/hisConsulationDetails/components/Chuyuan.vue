<template>
  <div v-show="showFlag" class="newLog">
    <div class="hearder">
      <span>
        出院证明书
      </span>
    </div>
    <span class="label">出院诊断：</span>
    <div class="inputBox">
      <el-input
        :readonly="true"
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="chuyuanLog.diagResult"
      >
      </el-input>
    </div>

    <span class="label">治疗记录：</span>
    <div class="inputBox">
      <el-input
        :readonly="true"
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="chuyuanLog.treatLogs"
      >
      </el-input>
    </div>
    <span class="label">出院医嘱及注意事项：</span>
    <div class="inputBox">
      <el-input
        :readonly="true"
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="chuyuanLog.notes"
      >
      </el-input>
    </div>
    <div>
      <Prescription :prescription="chuyuanLog.prescription"></Prescription>
    </div>
    <div class="clearfix"></div>

    <!-- <el-dialog
      title="历史治疗方案"
      :visible.sync="importDialogFlag"
      width="800px"
    >
      <el-table
        ref="historyTreatment"
        :data="historyLogs.slice(0, 5)"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <Prescription
              :prescription="scope.row.API_prescription"
            ></Prescription>
          </template>
        </el-table-column>
        <el-table-column label="患者状况">
          <template slot-scope="scope">
            <span>{{ scope.row.API_patientState.join("，") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="治疗建议">
          <template slot-scope="scope">
            <span>{{ scope.row.API_description.join("，") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处方">
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
              @click="confirmImporrt(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog> -->
  </div>
</template>

<script>
import SpecialInput from "@components/common/SpecialInput.vue";
import PrescriptionEdit from "@components/common/PrescriptionEdit.vue";
import Prescription from "@components/common/Prescription.vue";
import { getChuyuanLog } from "@api/patienttreatment/patienttreatment.js";

export default {
  name: "NewTreatmentLog",

  data() {
    return {
      importDialogFlag: false,
      historyLogs: [],
      dialogVisible: false,
      showFlag: true,
      chuyuanLog: {
        diagResult: "",
        treatLogs: "",
        notes: "",
        prescription: []
      }
    };
  },
  components: {
    SpecialInput,
    PrescriptionEdit,
    Prescription
  },
  methods: {
    toogleExpand(row) {
      let $table = this.$refs.historyTreatment;
      $table.toggleRowExpansion(row);
    },
    confirmImporrt(data) {
      this.importDialogFlag = false;
      this.$emit("import", data);
    },
    importHistory() {
      getHistoryTreatLog().then(res => {
        this.importDialogFlag = true;
        this.historyLogs = res;
      });
    },
    inputBoxShow(type) {
      this.$emit("inputBox", type);
    },
    prescription(data) {
      this.chuyuanLog.prescription = data;
    }
  },
  mounted() {
    getChuyuanLog(this.$store.state.groupConsultation.currentPid).then(res => {
      this.chuyuanLog = res;
    });
  }
};
</script>

<style lang="scss" scoped>
.clearfix:after {
  content: ""; /*设置内容为空*/
  height: 0; /*高度为0*/
  line-height: 0; /*行高为0*/
  display: block; /*将文本转为块级元素*/
  visibility: hidden; /*将元素隐藏*/
  clear: both; /*清除浮动*/
}
.newLog {
  margin: 20px 0;
  padding: 0 2.5% 20px;
  // box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  .hearder {
    text-align: center;
    span {
      font-size: 20px;
      font-weight: bold;
      color: #1c7e7c;
    }
  }

  .import {
    float: right;
  }

  .label {
    font-size: 16px;
    color: #1c7e7c;
  }
  .inputBox {
    width: 100%;
    margin: 5px 0;
  }
  .box {
    width: 100%;
    min-height: 60px;
    margin-top: 5px;
    margin-bottom: 5px;
    border: 1px solid #e4e7ed;
    p {
      margin-top: 5px;
      font-size: 16px;
      text-indent: 20px;
    }
  }
}
</style>