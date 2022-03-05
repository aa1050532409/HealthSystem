<template>
  <div style="padding-top: 20px" v-show="showFlag" class="newLog">
    <div v-if="startType == 0" class="closeBtn clearfix">
      <div @click="showFlag = false" style="float: right; cursor: pointer">X</div>
    </div>
    <div v-if="startType == 0" class="hearder">
      <span> 会诊申请 </span>
    </div>

    <el-form
      :model="huizhenStart"
      :rules="rules"
      ref="consultationForm"
      :show-message="false"
      label-width="0px"
    >
      <span class="label">会诊目的：</span>
      <el-link
        type="primary"
        @click="importFlag = true"
        style="float: right"
        class="import"
      >
        导入会诊目的</el-link
      >

      <div class="inputBox">
        <el-form-item prop="reason">
          <el-input
            v-model="huizhenStart.reason"
            type="textarea"
            :rows="1"
            placeholder="请输入内容"
          >
          </el-input>
        </el-form-item>
      </div>
      <div style="margin: 15px 0 5px 0">
        <el-row>
          <el-col :span="7">
            <div>
              <span class="label">会诊类别：</span>
              <div style="display: inline-block; width: 200px">
                <el-form-item prop="type">
                  <el-select
                    v-if="startType == 0"
                    v-model="huizhenStart.type"
                    size="small"
                  >
                    <el-option label="普通会诊" value="普通会诊"> </el-option>
                    <el-option label="视频会诊" value="视频会诊"> </el-option>
                  </el-select>
                  <span v-else-if="startType == 1 || startType == 2">{{
                    huizhenStart.type
                  }}</span>
                </el-form-item>
              </div>
            </div>
          </el-col>
          <template v-if="huizhenStart.type == '视频会诊'">
            <el-col :span="17">
              <div>
                <span class="label">会诊时间：</span>
                <div style="display: inline-block">
                  <el-form-item style="display: inline-block" prop="startTime">
                    <el-date-picker
                      @blur="startTimeCheck"
                      v-model="huizhenStart.startTime"
                      type="datetime"
                      size="small"
                      placeholder="请选择"
                      format="yyyy-MM-dd HH:mm"
                      value-format="timestamp"
                      :picker-options="pickerOptions2"
                    >
                    </el-date-picker>
                  </el-form-item>
                </div>
                <span style="margin-left: 50px" class="label">持续时长：</span>
                <div style="display: inline-block">
                  <el-form-item style="display: inline-block" prop="lastTime">
                    <el-select
                      v-if="startType == 0"
                      v-model="huizhenStart.lastTime"
                      size="small"
                    >
                      <el-option label="半小时" value="1"> </el-option>
                      <el-option label="一小时" value="2"> </el-option>
                      <el-option label="两小时" value="4"> </el-option>
                      <el-option label="三小时" value="6"> </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <span
                  :class="timeRangeAvailableFlag ? 'availableTip' : 'unavailableTip'"
                  >{{
                    timeRangeAvailableFlag ? "当前时间段空闲" : "当前时间段已被占用"
                  }}</span
                >
              </div>
            </el-col>
          </template>
          <template v-else>
            <el-col :span="15">
              <div>
                <span class="label">会诊截止时间：</span>
                <div style="display: inline-block; width: 500px">
                  <el-form-item style="display: inline-block" prop="startTime">
                    <el-date-picker
                      v-model="huizhenStart.endTime"
                      type="datetime"
                      size="small"
                      placeholder="请选择"
                      format="yyyy-MM-dd HH:mm"
                      value-format="timestamp"
                      :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                  </el-form-item>
                </div>
              </div>
            </el-col>
          </template>
        </el-row>
      </div>
      <div>
        <span class="label">会诊人员：</span>
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
        <After @chose="chosePerson($event)" :state="'未完成'"></After>
      </div>
    </el-form>
    <div class="clearfix">
      <el-button
        @click="confirmHuizhen"
        size="small"
        type="primary"
        style="float: right; width: 80px"
        >确定</el-button
      >
    </div>
    <ConsultationPurposeImport
      @import="huizhenStart.reason = $event"
      v-model="importFlag"
    ></ConsultationPurposeImport>
  </div>
</template>

<script>
import SpecialInput from "@components/common/SpecialInput.vue";
import After from "./components/After.vue";
import {
  startGroupConsultation,
  startGroupConsultation_patient,
} from "@api/groupconsultation/groupconsultation.js";
import {
  starVideoConsultation,
  starVideoConsultation_patient,
  getAvailableTime,
} from "@api/videoConsultation/videoConsultation.js";
export default {
  name: "NewTreatmentLog",
  props: {
    defaultType: {
      type: String,
      default: () => {
        return "0";
      },
    },
    pid: {
      type: String,
      default: () => {
        return "";
      },
    },
    startType: {
      // 开启会诊的类别，0 医生主动发起会诊 1 患者主动发起的普通会诊 2 患者主动发起的视频会诊
      type: Number,
      default: () => {
        return 0;
      },
    },
    huizhenId: {
      default: () => {
        return "0";
      },
    },
  },
  data() {
    return {
      timeRangeAvailableFlag: "",
      dateTime: "",
      importFlag: true,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() < Date.now() + 1000 * 60 * 5;
        },
      },
      importDialogFlag: false,
      historyLogs: [],
      dialogVisible: false,
      showFlag: false,
      personChoseVisible: true,
      huizhenStart: {
        reason: "",
        type: "普通会诊",
        startTime: Date.now() + 1000 * 60 * 5,
        endTime: "",
        lastTime: "1",
        person: {},
      },
      chosedPerson: {
        groups: [],
        orgs: [],
      },
      rules: {
        reason: [{ required: true, trigger: "blur" }],
        type: [{ required: true, trigger: "blur" }],
        endTime: [{ required: true, trigger: "blur" }],
      },
    };
  },
  components: {
    SpecialInput,
    After,
  },

  watch: {
    "huizhenStart.lastTime": {
      handler(v) {
        this.huizhenStart.endTime =
          this.huizhenStart.startTime + parseInt(this.huizhenStart.lastTime) * 1800000;
        this.timeRangeCheck();
      },
      immediate: true,
    },
    "huizhenStart.startTime": {
      handler(v) {
        this.huizhenStart.endTime =
          this.huizhenStart.startTime + parseInt(this.huizhenStart.lastTime) * 1800000;
        this.timeRangeCheck();
      },
      immediate: true,
    },
  },
  methods: {
    startTimeCheck() {
      if (this.huizhenStart.startTime - Date.now() < 1000 * 60 * 5) {
        this.$message.info("视频会诊开始时间必须在五分钟后");
        this.huizhenStart.startTime = Date.now() + 1000 * 60 * 6;
      }
    },
    confirmHuizhen() {
      this.$refs["consultationForm"].validate((valid) => {
        if (
          valid &&
          this.chosedPerson.groups.length + this.chosedPerson.orgs.length != 0
        ) {
          let msg = "您确定要发起会诊吗？?";
          if (!this.timeRangeAvailableFlag && this.huizhenStart.type == "视频会诊") {
            msg = "当前时间段有冲突，您确定要发起会诊吗?";
          }
          this.$confirm(msg, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              if (this.huizhenStart.type == "普通会诊" && this.startType == 0) {
                this.confirmNormalHuizhen();
              } else if (this.huizhenStart.type == "视频会诊" && this.startType == 0) {
                this.confirmVideoHuizhen();
              } else if (this.huizhenStart.type == "普通会诊" && this.startType == 1) {
                this.confirmNormalHuizhen_patient();
              } else if (this.huizhenStart.type == "视频会诊" && this.startType == 2) {
                this.confirmVideoHuizhen_patient();
              } else {
              }
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
    // 确认发起普通会诊
    confirmNormalHuizhen() {
      let pid = this.pid;
      startGroupConsultation(pid, this.huizhenStart).then((res) => {
        if (res) {
          this.showFlag = false;
          this.$message({
            type: "success",
            message: "发起成功!",
          });
          this.$emit("success");
        } else {
          this.$message({
            type: "error",
            message: "发起失败",
          });
        }
      });
    },
    // 确认发起视频会诊
    confirmVideoHuizhen() {
      let pid = this.pid;
      starVideoConsultation(pid, this.huizhenStart).then((res) => {
        if (res) {
          this.showFlag = false;
          this.$message({
            type: "success",
            message: "发起成功!",
          });
        } else {
          this.$message({
            type: "error",
            message: "发起失败",
          });
        }
      });
    },

    // 确认发起普通会诊(患者自己申请)
    confirmNormalHuizhen_patient() {
      let pid = this.pid;
      this.huizhenStart.gid = this.huizhenId;
      startGroupConsultation_patient(pid, this.huizhenStart).then((res) => {
        if (res) {
          this.showFlag = false;
          this.$message({
            type: "success",
            message: "发起成功!",
          });
          this.$emit("successStart");
        } else {
          this.$message({
            type: "error",
            message: "发起失败",
          });
        }
      });
    },

    // 确认发起视频会诊(患者自己申请)
    confirmVideoHuizhen_patient() {
      let pid = this.pid;
      this.huizhenStart.gid = this.huizhenId;

      this.$emit("successStart");

      starVideoConsultation_patient(pid, this.huizhenStart).then((res) => {
        if (res) {
          this.showFlag = false;
          this.$message({
            type: "success",
            message: "发起成功!",
          });
          this.$emit("successStart");
        } else {
          this.$message({
            type: "error",
            message: "发起失败",
          });
        }
      });
    },

    prescription(data) {
      this.chuyuanLog.prescription = data;
    },
    chosePerson(data) {
      this.chosedPerson = data;
      this.huizhenStart.person = data;
    },
    timeRangeCheck() {
      getAvailableTime({
        startTime: this.huizhenStart.startTime,
        endTime: this.huizhenStart.endTime,
      }).then((res) => {
        this.timeRangeAvailableFlag = res;
      });
    },
  },
  mounted() {
    switch (this.startType) {
      case 0:
        this.huizhenStart.type = "普通会诊";
        break;
      case 1:
        this.huizhenStart.type = "普通会诊";
        this.showFlag = true;
        break;
      case 2:
        this.huizhenStart.type = "视频会诊";
        this.showFlag = true;
        break;
      default:
        break;
    }
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
  .availableTip {
    font-size: $font_large;
    color: $successColor;
  }
  .unavailableTip {
    font-size: $font_large;
    color: $dangerColor;
  }
}
</style>
