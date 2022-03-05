<template>
  <div v-show="showFlag" class="newLog">
    <div class="closeBtn clearFloat">
      <div @click="showFlag = false" style="float: right; cursor: pointer">X</div>
    </div>
    <div class="hearder">
      <span> 转诊申请 </span>
    </div>
    <div class="clearFloat"></div>
    <el-form
      :model="huizhenStart"
      :rules="rules"
      ref="consultationForm"
      :show-message="false"
      label-width="0px"
    >
      <span class="label">转诊原因：</span>
      <div class="inputBox">
        <el-form-item prop="reason">
          <el-input
            v-model="huizhenStart.reason"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          >
          </el-input>
        </el-form-item>
      </div>
      <div>
        <span class="label">选择专家：</span>
        <div>
          <div
            v-if="chosedPerson.groups.length == 0 && chosedPerson.orgs.length == 0"
            style="margin-left: 70px"
          >
            <span>未选择</span>
          </div>

          <div style="margin-left: 70px">
            <div v-for="group in chosedPerson.groups" :key="group.id">
              <span>{{ group.groupName + "：" }}</span>
              <span
                style="margin-right: 10px"
                v-for="exp in group.experts"
                :key="exp.id"
                >{{ exp.expName }}</span
              >
            </div>
            <div v-for="org in chosedPerson.orgs" :key="org.id">
              <span>{{ org.orgName + "：" }}</span>
              <span style="margin-right: 10px" v-for="doc in org.doctors" :key="doc.id">{{
                doc.docName
              }}</span>
            </div>
          </div>

          <div style="margin-left: 70px"></div>
        </div>
      </div>
      <div v-show="personChoseVisible" style="margin-left: 70px; margin-top: 20px">
        <ZhuanZhenPerson
          :chooseExpert="true"
          @chose="chosePerson($event)"
        ></ZhuanZhenPerson>
      </div>
    </el-form>
    <div class="clearFloat">
      <el-button
        @click="confirmHuizhen"
        size="small"
        type="primary"
        style="float: right; width: 80px"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
import ZhuanZhenPerson from "./components/ZhuanZhenPerson.vue";

import { startZhuanzhen } from "@api/patientdiag/patientdiag.js";
export default {
  name: "NewTreatmentLog",
  props: {
    pid: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      importDialogFlag: false,
      historyLogs: [],
      showFlag: false,
      personChoseVisible: true,
      huizhenStart: {
        reason: "",
        person: {},
      },
      chosedPerson: {
        groups: [],
        orgs: [],
      },
      rules: {
        reason: [{ required: true, trigger: "blur" }],
      },
    };
  },
  components: {
    ZhuanZhenPerson,
  },
  methods: {
    toogleExpand(row) {
      let $table = this.$refs.historyTreatment;
      $table.toggleRowExpansion(row);
    },
    confirmHuizhen() {
      this.$refs["consultationForm"].validate((valid) => {
        if (
          valid &&
          this.chosedPerson.groups.length + this.chosedPerson.orgs.length != 0
        ) {
          this.$confirm("您确定要发起转诊吗？?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              // let pid = this.$store.state.patientTreatment.currentPid;
              let pid = this.pid;
              startZhuanzhen(pid, this.huizhenStart).then((res) => {
                if (res) {
                  this.showFlag = false;
                  this.$message({
                    type: "success",
                    message: "发起成功!",
                  });
                  this.$emit("successZhuanzhen");
                } else {
                  this.$message({
                    type: "error",
                    message: "发起失败",
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消",
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

    chosePerson(data) {
      this.chosedPerson = data;
      this.huizhenStart.person = data;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
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
