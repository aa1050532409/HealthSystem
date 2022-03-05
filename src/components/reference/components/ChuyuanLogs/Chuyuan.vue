<template>
  <div v-show="showFlag" class="newLog">
    <div class="hearder">
      <span> 出院证明书 </span>
    </div>

    <div v-if="!chuyuanreadonly" style="margin: 20px 0px">
      <span style="float: left; font-size: 16px; color: #1c7e7c"
        >出院时间:</span
      >
      <el-date-picker
        v-model="chuyuanLog.time"
        size="small"
        value-format="timestamp"
        style="float:left;margin-left:20px;vertical-align-center"
      ></el-date-picker>
      <div style="clear:both;height=0"></div>
    </div>
    <span class="label">出院诊断：</span>
    <div class="inputBox">
      <el-input
        :readonly="chuyuanreadonly"
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
        :readonly="chuyuanreadonly"
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
        :readonly="chuyuanreadonly"
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="chuyuanLog.notes"
      >
      </el-input>
    </div>
    <div>
      <PrescriptionEdit
        :prescription="chuyuanLog.prescription"
        :readonly="chuyuanreadonly"
      ></PrescriptionEdit>
    </div>
    <div v-if="!chuyuanreadonly" class="clearfix">
      <div style="float: right">
        <el-link
          @click="importHistory"
          style="margin-right: 20px"
          type="success"
          >导入历史出院记录</el-link
        >
        <el-button
          @click="save"
          style="width: 100px"
          size="small"
          type="primary"
        >
          保存
        </el-button>
      </div>
    </div>
    <el-dialog
      title="历史治疗方案"
      :visible.sync="importDialogFlag"
      width="800px"
    >
      <el-table
        ref="historyTreatment"
        max-height="500px"
        :data="historyLogs.slice(0, 5)"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <PrescriptionEdit
              :readonly="true"
              :prescription="scope.row.API_prescription"
            ></PrescriptionEdit>
          </template>
        </el-table-column>
        <el-table-column label="出院诊断">
          <template slot-scope="scope">
            <span>{{ scope.row.diagResult }}</span>
          </template>
        </el-table-column>
        <el-table-column label="治疗记录">
          <template slot-scope="scope">
            <span>{{ scope.row.treatLogs }}</span>
          </template>
        </el-table-column>
        <el-table-column label="治疗记录">
          <template slot-scope="scope">
            <span>{{ scope.row.notes }}</span>
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
    </el-dialog>
  </div>
</template>

<script>
import SpecialInput from "@components/common/SpecialInput.vue";
import PrescriptionEdit from "@components/common/PrescriptionEdit.vue";
import Prescription from "@components/common/Prescription.vue";
import {
  getChuyuanLog,
  getHistoryChuyuanLog,
} from "@api/patienttreatment/patienttreatment.js";
import { endPatientTreat } from "@api/patientInfo/patientinfo.js";
export default {
  name: "NewTreatmentLog",
  props: {
    readonly: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    pid: {
      type: String,
      default: () => {
        return "456";
      },
    },
  },
  computed: {
    chuyuanreadonly() {
      if (this.readonly == true) return true;
      else {
        if (this.flag) {
          return true;
        }
      }
      return false;
    },
  },
  data() {
    return {
      flag: false,
      importDialogFlag: false,
      historyLogs: [],
      showFlag: true,
      chuyuanLog: {
        time: "",
        diagResult: "",
        treatLogs: "",
        notes: "",
        prescription: [],
      },
    };
  },
  components: {
    SpecialInput,
    PrescriptionEdit,
    Prescription,
  },
  methods: {
    toogleExpand(row) {
      let $table = this.$refs.historyTreatment;
      $table.toggleRowExpansion(row);
    },
    confirmImporrt(data) {
      this.chuyuanLog = {
        diagResult: data.diagResult || "",
        treatLogs: data.treatLogs || "",
        notes: data.notes || "",
        prescription: data.API_prescription || [],
      };
      this.importDialogFlag = false;
    },
    importHistory() {
      getHistoryChuyuanLog().then((res) => {
        this.importDialogFlag = true;
        this.historyLogs = res;
      });
    },
    inputBoxShow(type) {
      this.$emit("inputBox", type);
    },
    prescription(data) {
      this.chuyuanLog.prescription = data;
    },
    save() {
      endPatientTreat(this.pid, this.chuyuanLog).then((res) => {
        if (res) {
          this.$message.success("提交成功");
          this.flag = true;
        } else {
          this.$message.error("提交失败");
        }
      });
    },
  },
  mounted() {
    this.$emit("startLoading");
    getChuyuanLog(this.pid)
      .then((res) => {
        this.$emit("endLoading");
        this.chuyuanLog = res;
        if (this.chuyuanLog.diagResult && this.chuyuanLog.diagResult.length > 0)
          this.flag = true;
      })
      .catch((err) => {
        console.log(err);
      });
  },
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