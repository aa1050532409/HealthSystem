<template>
  <div>
    <div class="mainContent">
      <el-collapse @change="handleChange" v-model="pages.collapse_activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <h3 class="title">基本信息</h3>
          </template>
          <personal-info
            :state="API_state"
            :huizhenState="huizhenState"
            :prsonalInfo="patientInfo.API_basicInfo"
            :pidState="pidState"
            @startConsultation="startConsultation"
            @startZhuanzhen="startZhuanzhen"
          ></personal-info>
        </el-collapse-item>
        <el-collapse-item v-if="tipsVisible && API_state == '未完成'" name="9">
          <template slot="title">
            <h3 class="title">提示</h3>
          </template>
          <div style="margin: 20px 0">
            <Tips
              :type="patientInfo.API_basicInfo.API_isGroupConsultation"
              :state="tipsState"
              @ok="startConsultation"
              @err="refusePatientConsultationApply"
            ></Tips>
          </div>
        </el-collapse-item>

        <div class="chuyuan">
          <ConsultationStart
            @success="pidStateFresh"
            :pid="pid"
            ref="huizhen"
          ></ConsultationStart>
        </div>
        <div class="chuyuan">
          <ZhuanzhenStart
            @successZhuanzhen="successZhuanzhen"
            :pid="pid"
            ref="zhuanzhen"
          ></ZhuanzhenStart>
        </div>
        <el-collapse-item name="2">
          <template slot="title">
            <h3 class="title">病情概况</h3>
          </template>

          <ill-state
            :illState="this.patientInfo.API_illState"
            :state="this.API_state"
            @vedio="videoPlay($event)"
          ></ill-state>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <h3 class="title">患者病史</h3>
          </template>
          <div class="history">
            <p>既往史：{{ this.patientInfo.API_history.API_patientHistory || "暂无" }}</p>
            <p>家族史：{{ this.patientInfo.API_history.API_familyHistory || "暂无" }}</p>
            <p>过敏史：{{ this.patientInfo.API_history.API_allergyHistory || "暂无" }}</p>
          </div>
        </el-collapse-item>
        <el-collapse-item name="4">
          <template slot="title">
            <h3 class="title">检查结果</h3>
          </template>
          <ExamingResult :examInfo="this.patientInfo.API_examResult"></ExamingResult>
        </el-collapse-item>

        <el-collapse-item name="8">
          <template slot="title">
            <h3 class="title">病情探讨</h3>
          </template>
          <DiscussArea></DiscussArea>
        </el-collapse-item>
        <el-collapse-item v-if="this.API_state != '申请中'" name="5">
          <template slot="title">
            <h3 class="title">诊断结论</h3>
          </template>
          <DiagResult
            :preData="API_diagInfo.API_diagResult"
            :readonly="API_state == '未完成' ? false : true"
            v-model="API_diagInfo.API_diagResult"
          ></DiagResult>
        </el-collapse-item>
        <el-collapse-item v-if="this.API_state != '申请中'" name="6">
          <template slot="title">
            <h3 class="title">治疗方案</h3>
          </template>
          <Treatment
            :state="API_state"
            :treatment.sync="API_diagInfo.API_treatment"
          ></Treatment>
        </el-collapse-item>

        <el-collapse-item v-if="this.API_state != '申请中'" name="7">
          <template slot="title">
            <h3 class="title">后续治疗</h3>
          </template>
          <after
            :preInfo="API_diagInfo.API_after"
            :medicalInfo="pages.medicalInfo"
            :state="this.API_state"
            @after="afterInfo($event)"
          ></after>
        </el-collapse-item>
        <el-button @click="save" size="small" type="primary" class="btn">{{
          this.API_state == "未完成" ? "保存" : "返回"
        }}</el-button>
        <div style="clear: both; height: 0"></div>
      </el-collapse>
    </div>
    <div v-show="pages.videoDialogVisible" v-drag class="drag">
      <span @click="videoDialogClose">X</span>
      <LocalVideo width="100%" :src="pages.videoDialogSrc"></LocalVideo>
    </div>

    <!-- 聊天组件 -->
    <chatBox :pid="pid"></chatBox>
  </div>
</template>

<script>
import { getConsultationLogs } from "@api/groupconsultation/groupconsultation.js";
import { getPidHuizhenState } from "@api/common/common.js";
import {
  getPatientDetails,
  savePatientDiagInfo,
  getMedicalInfo,
  getHistoryPrescription,
  refuseConsultationApply,
} from "@api/patientdiag/patientdiag.js";
import SpecialInput from "@components/common/SpecialInput.vue";
import SpecialInputBox from "@components/common/SpecialInputBox.vue";
import PrescriptionEdit from "@components/common/PrescriptionEdit.vue";
import HuizhenLogs from "./components/HuizhenLogs.vue";
import Tips from "./components/Tips.vue";
import chatBox from "@components/chatBox/chatBox.vue";
import mixin from "./components/index.js";
import ConsultationStart from "@components/consultation/ConsultationStart.vue";
import DiscussArea from "./discussion/components/DiscussArea.vue";

export default {
  mixins: [mixin],
  components: {
    SpecialInput: SpecialInput,
    PrescriptionEdit: PrescriptionEdit,
    chatBox,
    ConsultationStart,
    HuizhenLogs,
    SpecialInputBox,
    DiscussArea,
    Tips,
  },
  computed: {
    pidStateCheck() {
      let state = 0;
      // 1 表示处于转诊流程中
      // 2 表示处于会诊流程中
      if (this.pidState.referralState) {
        state = 1;
      } else {
        if ([0, 4, 10].indexOf(this.pidState.huizhenState) == -1) {
          state = 2;
        }
      }
      return state;
    },
    tipsVisible() {
      let flag = false;
      if (
        this.patientInfo.API_basicInfo.API_isGroupConsultation == "shipin" ||
        this.patientInfo.API_basicInfo.API_isGroupConsultation == "putong"
      )
        flag = true;
      return flag;
    },
    tipsState() {
      if (this.patientInfo.API_IsGroupConsultationState == "已拒绝") return "已拒绝";
      if (this.pidStateCheck == 2) return "进行中";
      if ([4, 10].indexOf(this.pidState.huizhenState) != -1) return "已完成";
      return "未处理";
    },
    dataChange() {
      let saveData = {
        patientInfo: this.patientInfo,
        API_diagInfo: this.API_diagInfo,
        API_state: this.API_state,
      };
      return JSON.stringify(saveData);
    },
  },
  watch: {
    dataChange: function () {
      this.tempSave();
    },
    "pages.HistoryPrescriptionDialogVisable": function (value) {
      if (!value) {
        this.pages.historyPrescription.page = 1;
      }
    },
  },
  data() {
    return {
      timeOutSaveFlag: "",
      HuizhenLogs: [],
      pid: "",
      API_state: "",
      huizhenState: 0,
      pidState: {
        huizhenState: 0,
        referralState: 0,
      },
      pages: {
        collapse_activeNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9"], //页面中激活的折叠面板
        videoDialogVisible: false, //视频播放框是否可见
        videoDialogSrc: "", //视频播放框中vedio标签的源
        stateOptions: [{ pinyin: "dx", value: "担心" }], //可以选择的病情描述项目，每一项由首字母组成的pinyin和项目名组成
        diagResultCheckReconmendList: [{ pinyin: "aezhmzzq", value: "阿尔兹海默症中期" }], //可以选择的诊断结论描述项目，每一项由首字母组成的pinyin和项目名组成
        treatmentCheckReconmendList: [
          { pinyin: "yjjxsszl", value: "建议到医院进行手术治疗" },
        ], //可以选择的治疗方案描述项目，每一项由首字母组成的pinyin和项目名组成
        diagHistory: [["智能诊断系统显示患有阿尔兹海默症", "神经损伤"], ["神经损伤"]], //可选的历史诊断结论
        HistoryDialogVisable: false, //导入历史诊断结论对话框是否可见
        treatHistory: [], //可选的历史治疗方案
        prescriptionHistory: [
          {
            prescription: [
              {
                API_drugsName: "青霉素",
                API_drugsNumberUnits: "片",
                API_drugsNumber: "10",
                API_drugsSpecification: "0.2g",
                API_drugsUsage: "2",
                API_useFrequency: "一天一次",
                API_useTime: "饭后",
              },
              {
                API_drugsName: "红霉素",
                API_drugsNumberUnits: "",
                API_drugsNumber: "",
                API_drugsUsage: "",
                API_drugsSpecification: "0.2g",
                API_useFrequency: "",
                API_useTime: "",
              },
            ],
          },
          {
            prescription: [
              {
                API_drugsName: "氯霉素",
                API_drugsNumberUnits: "",
                API_drugsNumber: "",
                API_drugsUsage: "",
                API_useFrequency: "",
                API_useTime: "",
                API_isEditable: false,
                API_days: "",
              },
              {
                API_drugsName: "红三",
                API_drugsNumberUnits: "",
                API_drugsNumber: "",
                API_drugsUsage: "",
                API_useFrequency: "",
                API_useTime: "",
                API_isEditable: false,
                API_days: "",
              },
            ],
          },
        ],
        HistoryTreatmentDialogVisable: false, //导入历史治疗方案对话框是否可见
        HistoryPrescriptionDialogVisable: false, //导入处方对话框是否可见
        medicalInfo: [
          {
            orgId: "1",
            orgName: "成都市第三人民医院",
            orgPic: "",
            doctors: [
              { docId: "101002", docPic: "", docName: "李四" },
              { docId: "101003", docPic: "", docName: "王五" },
              { docId: "101004", docPic: "", docName: "赵六" },
            ],
            nurses: [
              { nurId: "1", nurPic: "", nurName: "王三" },
              { nurId: "2", nurPic: "", nurName: "王二" },
              { nurId: "3", nurPic: "", nurName: "王大" },
            ],
          },
        ], //可选的医疗机构、医师、护士信息
        inputBoxVisible: {
          illState: false,
          diagResult: false,
          treatment: false,
        },
        historyPrescription: {
          page: 1,
          maxPage: 0,
        },
      },
      //患者相关信息
      patientInfo: {
        // 患者基本信息
        API_basicInfo: {
          API_pic: "",
          API_name: "",
          API_gender: "",
          API_birthday: "",
          API_address: "",
          API_tel: "",
          API_date: "",
          API_isGroupConsultation: "",
          API_dealState: "",
        },
        // 患者病情描述
        API_illState: {
          API_questionnaire: [],
          API_description: [],
          API_audio: [
            {
              API_date: "",
              API_name: "",
              API_text: "",
              API_time: "",
              API_type: "",
              API_voice: "",
            },
          ],
          API_video: [
            {
              API_date: "",
              API_name: "",
              API_text: "",
              API_time: "",
              API_type: "",
              API_video: "",
            },
          ], //视频的地址，以数组的形式发过来
        },
        API_history: {
          API_allergyHistory: "",
          API_familyHistory: "",
          API_patientHistory: "",
        },
        API_examResult: [],
      },
      API_diagInfo: {
        //诊断结论
        API_diagResult: [],
        //治疗方案
        API_treatment: {
          API_description: [],
          API_prescriptionFlag: true,
          API_prescription: [], //处方
        },
        // 推荐医疗机构/医师/护士
        API_after: [],
      },
      tempDR: [],
      DR: "",
    };
  },
  methods: {
    refusePatientConsultationApply() {
      if (this.pidStateCheck == 1) {
        this.$message.info("当前患者处于转诊过程中，无法进行该操作！");
        return;
      }
      refuseConsultationApply(this.pid).then((res) => {
        if (res) {
          this.patientInfo.API_IsGroupConsultationState = "已拒绝";
          this.$message.info("您已经拒绝患者的会诊申请");
        } else {
          this.$message.error("拒绝失败");
        }
      });
    },

    startConsultation() {
      if (this.pidStateCheck == 1) {
        this.$message.info("当前患者处于转诊过程中，无法发起会诊");
        return;
      }
      if (this.patientInfo.API_IsGroupConsultationState == "已拒绝") {
        this.$message.info("您已拒绝患者的会诊申请，无法再发起会诊");
      } else {
        this.$refs["huizhen"].showFlag = true;
        this.$refs["zhuanzhen"].showFlag = false;
      }
    },
    startZhuanzhen() {
      this.$refs["huizhen"].showFlag = false;
      this.$refs["zhuanzhen"].showFlag = true;
    },

    videoDialogClose() {
      this.pages.videoDialogVisible = false;
      this.pages.videoDialogSrc = "";
    },
    videoPlay(item) {
      this.pages.videoDialogVisible = true;
      this.pages.videoDialogSrc = item;
    },

    successZhuanzhen() {
      this.huizhenState = 1;
      this.pidStateFresh();
    },
    checkHuizhen() {
      return getConsultationLogs(this.pid).then((res) => {
        if (res.length > 0) return true;
        else return false;
      });
    },

    save() {
      if (this.API_state == "未完成") {
        if (this.pidStateCheck == 0) {
          this.confirmSave();
        } else if (this.pidStateCheck == 0) {
          this.$message.warning("患者处于转诊中，无法完成诊断！");
        } else {
          this.$message.warning("患者处于会诊中，无法完成诊断！");
        }
      } else {
        this.$router.push("/patientdiag/todaydiagnosis");
      }
    },

    tempSave() {
      if (this.API_state == "未完成") {
        let saveData = {
          patientInfo: this.patientInfo,
          API_diagInfo: this.API_diagInfo,
          API_state: this.API_state,
        };
        this.$localforage.setItem(window.location.href, saveData);
      }
    },
    afterInfo(info) {
      this.API_diagInfo.API_after = info;
    },

    handleChange(val) {
      if (this.pidStateCheck == 1 || this.pidStateCheck == 2) {
        let tempLength = val.length;
        this.pages.collapse_activeNames = this.pages.collapse_activeNames.filter(
          (item) => ["5", "6", "7"].indexOf(item) == -1
        );
        if (tempLength !== this.pages.collapse_activeNames.length) {
          this.$message.warning("当前患者处于会诊/转诊流程中，尚无法进行诊断操作！");
        }
      }
    },
    pidStateFresh() {
      getPidHuizhenState(this.pid).then((res) => {
        this.pidState = res;
        if (this.pidStateCheck == 1 || this.pidStateCheck == 2) {
          this.handleChange(["1", "2", "3", "4", "8"]);
        }
      });
    },
    fetchData() {
      this.$localforage.getItem(window.location.href).then((res) => {
        if (res) {
          this.patientInfo = res.patientInfo;
          this.API_diagInfo = res.API_diagInfo;
          this.API_state = res.API_state;
          this.$store.commit("endLoading");
        } else {
          getPatientDetails(this.pid).then((res) => {
            this.patientInfo = res.patientInfo;
            this.API_diagInfo = res.API_diagInfo;
            this.API_state = res.API_state;
            if (this.patientInfo.API_illState.API_questionnaire.length > 0) {
              this.patientInfo.API_illState.API_description = this.patientInfo.API_illState.API_questionnaire.map(
                (item) => item.QuestionnaireSymptom
              );
            }
            this.$store.commit("endLoading");
          });
        }
      });
      getMedicalInfo().then((res) => {
        this.pages.medicalInfo = res;
      });
    },
    diagCheck() {
      let flag = true;
      let errList = [];
      // 病情描述未完善
      if (this.patientInfo.API_illState.API_description == 0) {
        errList.push("病情描述");
        flag = false;
      }
      // 诊断结论未填写
      if (this.API_diagInfo.API_diagResult.length == 0) {
        errList.push("诊断结论描述");
        flag = false;
      }
      // 治疗方案描述未填写
      if (this.API_diagInfo.API_treatment.API_description.length == 0) {
        errList.push("治疗方案描述");
        flag = false;
      }
      if (!flag) this.$message.error("请完善以下部分：" + errList.join("、"));
      return flag;
    },
    confirmSave() {
      if (this.diagCheck()) {
        this.$localforage.removeItem(window.location.href);
        savePatientDiagInfo(
          this.pid,
          this.API_state,
          this.patientInfo.API_illState,
          this.API_diagInfo
        );
      }
    },
  },
  directives: {
    drag: {
      // 指令的定义
      bind: function (el) {
        let odiv = el; //获取当前元素
        el.onmousedown = (e) => {
          //算出鼠标相对元素的位置
          let disX = e.clientX - odiv.offsetLeft;
          let disY = e.clientY - odiv.offsetTop;
          let left = "";
          let top = "";
          document.onmousemove = (e) => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            left = e.clientX - disX;
            top = e.clientY - disY;
            //绑定元素位置到positionX和positionY上面
            //移动当前元素
            odiv.style.left = left + "px";
            odiv.style.top = top + "px";
          };
          document.onmouseup = (e) => {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      },
    },
  },
  created() {
    let pid = this.$route.query.pid + "";
    this.$store.commit("startLoading");
    this.pid = pid;
    this.fetchData();
    this.pidStateFresh();
  },
};
</script>

<style scoped lang="scss">
.mainContent {
  width: 95%;
  height: 100%;
  margin: 20px auto;
  .title {
    font-size: 20px;
    color: #1c7e7c;
  }

  .history {
    p {
      font-size: 18px;
      text-indent: 40px;
    }
  }

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

  .btn {
    float: right;
    margin-top: 50px;
    margin-bottom: 50px;
    margin-right: 50px;
    width: 120px;
  }
}

.drag {
  width: 300px;
  background-color: black;
  position: absolute;
  top: 30%;
  left: calc(50% - 150px);
  span {
    z-index: 100;
    position: absolute;
    top: 0px;
    right: 10px;
    color: white;
    cursor: pointer;
  }
}
.inputBox {
  position: fixed;
  bottom: 0px;
  width: calc(89% - 240px);
  z-index: 100;
  transition: 0.5s;
}

.inputBox2 {
  position: fixed;
  bottom: 0px;
  width: calc(89%);
  transition: 0.5s;
}
</style>

<style lang="scss">
.dialog {
  .el-dialog__body {
    padding: 0 20px 30px 20px;
  }
}
</style>
