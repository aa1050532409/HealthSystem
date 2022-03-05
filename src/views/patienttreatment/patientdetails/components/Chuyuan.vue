<template>
  <div v-show="showFlag" class="newLog">
    <div class="closeBtn clearfix">
      <div @click="showFlag = false" style="float: right; cursor: pointer">X</div>
    </div>
    <div class="hearder">
      <span> 出院证明书 </span>
    </div>
    <div class="clearfix">
      <el-link type="primary" @click="importHistory" class="import">
        导入历史记录</el-link
      >
    </div>
    <span class="label">出院诊断：</span>
    <div class="inputBox">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="chuyuanLog.diagResult"
      >
      </el-input>
    </div>

    <span class="label">扼要病情及诊疗经过：</span>
    <div class="inputBox">
      <el-input
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
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="chuyuanLog.notes"
      >
      </el-input>
    </div>

    <div>
      <prescription-edit
        :prescription="chuyuanLog.prescription"
        @input="prescription($event)"
      ></prescription-edit>
    </div>
    <div v-show="false">
      <span class="label">随访时间：</span>
      <div style="display: inline">
        <el-select size="small" v-model="chuyuanLog.suifangTime" placeholder="请选择">
          <el-option
            v-for="item in timeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="clearfix">
      <el-button
        @click="chuyuan"
        size="small"
        type="primary"
        style="float: right; width: 80px"
        >确定</el-button
      >
    </div>

    <el-dialog title="历史治疗方案" :visible.sync="importDialogFlag" width="800px">
      <el-table
        ref="historyTreatment"
        max-height="500px"
        :data="historyLogs.slice(0, 5)"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <Prescription :prescription="scope.row.API_prescription"></Prescription>
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
            <el-button type="text" @click="toogleExpand(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" width="100" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="confirmImporrt(scope.row)"
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
  getHistoryTreatLog,
  endPatientTreat,
  getHistoryChuyuanLog,
} from "@api/patienttreatment/patienttreatment.js";

export default {
  name: "NewTreatmentLog",

  data() {
    return {
      timeOptions: [
        {
          label: "立即",
          value: new Date().getTime(),
        },
        {
          label: "一周后",
          value: new Date().getTime() + 86400000 * 7,
        },
        {
          label: "半月后",
          value: new Date().getTime() + 86400000 * 15,
        },
        {
          label: "一月后",
          value: new Date().getTime() + 86400000 * 30,
        },
        {
          label: "两月后",
          value: new Date().getTime() + 86400000 * 60,
        },
      ],
      importDialogFlag: false,
      historyLogs: [],
      dialogVisible: false,
      showFlag: false,
      chuyuanLog: {
        diagResult: "",
        treatLogs: "",
        notes: "",
        suifangTime: new Date().getTime(),
        prescription: [],
      },
    };
  },
  computed: {
    pid() {
      return this.$route.query.pid;
    },
  },
  components: {
    SpecialInput,
    PrescriptionEdit,
    Prescription,
  },
  methods: {
    chuyuan() {
      if (
        this.chuyuanLog.diagResult != "" &&
        this.chuyuanLog.treatLogs != "" &&
        this.chuyuanLog.notes != ""
      ) {
        this.chuyuanLog.suifangTime = new Date().getTime();
        this.$confirm("是否确定结束患者住院治疗?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            endPatientTreat(this.pid, this.chuyuanLog).then((res) => {
              if (res) {
                this.$message.success("患者成功出院");
                this.$router.push("/treatment/patientlist");
              } else {
                this.$message.error("患者出院失败");
              }
            });
          })
          .catch(() => {});
      } else {
        this.$message.error("请完善出院证明书");
      }
    },
    toogleExpand(row) {
      let $table = this.$refs.historyTreatment;
      $table.toggleRowExpansion(row);
    },
    confirmImporrt(data) {
      this.importDialogFlag = false;
      this.chuyuanLog = {
        diagResult: data.diagResult,
        treatLogs: data.treatLogs,
        notes: data.notes,
        prescription: data.API_prescription,
      };
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
  margin: 20px 0;
  padding: 0 20px 20px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
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
