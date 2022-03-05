<template>
  <div v-show="showFlag" class="newLog">
    <div class="closeBtn clearfix">
      <div @click="showFlag = false" style="float:right;cursor: pointer;">
        X
      </div>
    </div>
    <div class="hearder">
      <span>
        会诊申请
      </span>
    </div>
    <div class="clearfix">
      <!-- <el-link type="primary" @click="importHistory" class="import">
        导入会诊方案</el-link
      > -->
    </div>
    <el-form
      :model="huizhenStart"
      :rules="rules"
      ref="consultationForm"
      :show-message="false"
      label-width="0px"
    >
      <span class="label">会诊目的：</span>
      <div class="inputBox">
        <el-form-item prop="reason">
          <el-input
            v-model="huizhenStart.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          >
          </el-input>
        </el-form-item>
      </div>
      <div style="margin:15px 0 5px 0">
        <el-row>
          <el-col :span="10">
            <div>
              <span class="label">会诊类别：</span>
              <div style="display:inline-block;width:200px">
                <el-form-item prop="type">
                  <el-select v-model="huizhenStart.type" size="small">
                    <el-option label="普通会诊" value="普通会诊"> </el-option>
                    <el-option label="视频会诊" value="视频会诊"> </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-col>
          <el-col :span="10">
            <div>
              <span class="label">会诊截止时间：</span>
              <div style="display:inline-block;width:200px">
                <el-form-item prop="endTime">
                  <el-date-picker
                    v-model="huizhenStart.endTime"
                    value-format="timestamp"
                    size="small"
                    type="datetime"
                    :picker-options="pickerOptions"
                    placeholder="选择日期时间"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <span class="label">会诊人员：</span>
        <!-- <el-link
          style="margin:10px"
          @click="personChoseVisible = !personChoseVisible"
          >{{ personChoseVisible ? "收起" : "选择" }}</el-link
        > -->
        <div>
          <div
            v-if="
              chosedPerson.groups.length == 0 && chosedPerson.orgs.length == 0
            "
            style="margin-left:70px"
          >
            <span>未选择</span>
          </div>

          <div style="margin-left:70px">
            <div v-for="group in chosedPerson.groups" :key="group.id">
              <span>{{ group.groupName + "：" }}</span>
              <span
                style="margin-right:10px"
                v-for="exp in group.experts"
                :key="exp.id"
                >{{ exp.expName }}</span
              >
            </div>
            <div v-for="org in chosedPerson.orgs" :key="org.id">
              <span>{{ org.orgName + "：" }}</span>
              <span
                style="margin-right:10px"
                v-for="doc in org.doctors"
                :key="doc.id"
                >{{ doc.docName }}</span
              >
            </div>
          </div>

          <div style="margin-left:70px"></div>
        </div>
      </div>
      <div v-show="personChoseVisible" style="margin-left:70px;margin-top:20px">
        <After @chose="chosePerson($event)"></After>
      </div>
    </el-form>
    <div class="clearfix">
      <el-button
        @click="confirmHuizhen"
        size="small"
        type="primary"
        style="float:right;width:80px"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
import SpecialInput from "@components/common/SpecialInput.vue";
import PrescriptionEdit from "@components/common/PrescriptionEdit.vue";
import After from "./components/After.vue";
import Prescription from "@components/common/Prescription.vue";

import { startGroupConsultation } from "@api/groupconsultation/groupconsultation.js";
export default {
  name: "NewTreatmentLog",

  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      importDialogFlag: false,
      historyLogs: [],
      dialogVisible: false,
      showFlag: false,
      personChoseVisible: true,
      huizhenStart: {
        reason: "",
        type: "",
        startTime: new Date().getTime(),
        endTime: "",
        person: {}
      },
      chosedPerson: {
        groups: [],
        orgs: []
      },
      rules: {
        reason: [{ required: true, trigger: "blur" }],
        type: [{ required: true, trigger: "blur" }],
        endTime: [{ required: true, trigger: "blur" }]
      }
    };
  },
  components: {
    SpecialInput,
    PrescriptionEdit,
    Prescription,
    After
  },
  methods: {
    toogleExpand(row) {
      let $table = this.$refs.historyTreatment;
      $table.toggleRowExpansion(row);
    },
    confirmHuizhen() {
      this.$refs["consultationForm"].validate(valid => {
        if (
          valid &&
          this.chosedPerson.groups.length + this.chosedPerson.orgs.length != 0
        ) {
          this.$confirm("您确定要发起会诊吗？?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let pid = this.$store.state.patientTreatment.currentPid;
              startGroupConsultation(pid, this.huizhenStart).then(res => {
                if (res) {
                  this.showFlag = false;
                  this.$message({
                    type: "success",
                    message: "发起成功!"
                  });
                } else {
                  this.$message({
                    type: "error",
                    message: "发起失败"
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });
        } else {
          this.$message.error("请完善会诊申请");
          return false;
        }
      });
    },
    importHistory() {
      // getHistoryChuyuanLog().then(res => {
      //   this.importDialogFlag = true;
      //   this.historyLogs = res;
      // });
    },
    inputBoxShow(type) {
      this.$emit("inputBox", type);
    },
    prescription(data) {
      this.chuyuanLog.prescription = data;
    },
    chosePerson(data) {
      this.chosedPerson = data;
      this.huizhenStart.person = data;
    }
  },
  mounted() {}
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
    font-weight: bolder;
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