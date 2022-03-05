<template>
  <!-- 
个人信息
  -->
  <div>
    <PatientInfo :patient="patient">
      <template slot="btn">
        <el-button
          v-show="state == '未完成'"
          :disabled="pidStateCheck == 2 || pidStateCheck == 1"
          size="mini"
          @click="startConsultation"
          type="primary"
          >{{ pidStateCheck == 2 ? "会诊中" : "发起会诊" }}</el-button
        >
        <el-button
          v-show="state == '未完成'"
          size="mini"
          :disabled="pidStateCheck == 1 || pidStateCheck == 2"
          @click="startZhuanzhen"
          type="warning"
          >{{ pidStateCheck == 1 ? "转诊中" : "发起转诊" }}</el-button
        >
      </template>
    </PatientInfo>
  </div>
</template>

<script>
import { getZhuanzhenState } from "@api/patientdiag/patientdiag.js";
export default {
  props: {
    state: {
      type: String,
      default: () => {
        return "申请中";
      },
    },
    prsonalInfo: {
      type: Object,
      default: () => {
        return {
          API_pic: "",
          API_name: "",
          API_gender: "",
          API_birthday: "",
          API_address: "",
          API_tel: "",
          API_date: "",
          others: "",
        };
      },
    },
    huizhenState: {
      type: Number,
      default: () => {
        return 0;
      },
    },
    pidState: {
      type: Object,
      default: () => {
        return {
          huizhenState: 0,
          referralState: 0,
        };
      },
    },
  },
  computed: {
    patient() {
      let others = "";
      if (this.pidState.referralState) {
        others = "患者转诊中";
      } else {
        switch (this.prsonalInfo.API_isGroupConsultation) {
          case "putong":
            others = "患者申请普通会诊";
            break;
          case "shipin":
            others = "患者申请视频会诊";
            break;
          default:
            others = "";
            break;
        }

        switch (this.pidState.huizhenState) {
          case 0:
            // others = "";
            break;
          case 1:
            others = "普通会诊等待患者同意中";
            break;
          case 2:
            others = "普通会诊进行中";
            break;
          case 3:
            others = "普通会诊待总结";
            break;
          case 4:
            others = "普通会诊已完成";
            break;
          case 5:
            others = "等待患者同意视频会诊申请";
            break;
          case 6:
            others = "患者已同意视频会诊，等待视频会诊确认";
            break;
          case 7:
            others = "视频会诊尚未开始";
            break;
          case 8:
            others = "视频会诊进行中";
            break;
          case 9:
            others = "视频会诊待总结";
            break;
          case 10:
            others = "视频会诊已完成";
            break;
        }
      }

      return {
        address: this.prsonalInfo.API_address || "无",
        age: this.ageCompute(this.prsonalInfo.API_birthday) || "无",
        gender: this.prsonalInfo.API_gender || "无",
        name: this.prsonalInfo.API_name || "无",
        diagTime: this.prsonalInfo.API_date
          ? this.$timeFormat(this.prsonalInfo.API_date).format("MM-DD HH:mm")
          : "无",
        pic: this.prsonalInfo.API_pic || "无",
        tel: this.prsonalInfo.API_tel || "无",
        others: others || "无",
      };
    },

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
  },

  methods: {
    startConsultation() {
      this.$emit("startConsultation");
    },
    startZhuanzhen() {
      this.$emit("startZhuanzhen");
    },
    ageCompute(birthday) {
      if (!birthday) {
        return "未知";
      } else {
        let str = this.$timeFormat(new Date(birthday)).format("yyyy-MM-DD");
        return this.jsGetAge(str);
      }
    },
    //根据出生日期计算年龄

    jsGetAge(strBirthday) {
      var returnAge;
      var strBirthdayArr = strBirthday.split("-");
      var birthYear = strBirthdayArr[0];
      var birthMonth = strBirthdayArr[1];
      var birthDay = strBirthdayArr[2];
      var d = new Date();
      var nowYear = d.getFullYear();
      var nowMonth = d.getMonth() + 1;
      var nowDay = d.getDate();
      if (nowYear == birthYear) {
        returnAge = 0; //同年 则为0岁
      } else {
        var ageDiff = nowYear - birthYear; //年之差
        if (ageDiff > 0) {
          if (nowMonth == birthMonth) {
            var dayDiff = nowDay - birthDay; //日之差
            if (dayDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          } else {
            var monthDiff = nowMonth - birthMonth; //月之差
            if (monthDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          }
        } else {
          returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
        }
      }
      return returnAge + ""; //返回周岁年龄
    },
  },
};
</script>
