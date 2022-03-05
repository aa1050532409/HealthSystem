<template>
  <!-- 
个人信息
  -->
  <div>
    <PatientInfo :patient="patient"> </PatientInfo>
    <!-- <div class="img">
      <img :src="prsonalInfo.API_pic" alt />
    </div>
    <div class="info">
      <el-row>
        <el-col :span="8">姓名：{{ prsonalInfo.API_name || "无" }}</el-col>
        <el-col :span="8">性别：{{ prsonalInfo.API_gender || "无" }}</el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8"
          >出生日期：{{
            (prsonalInfo.API_birthday && prsonalInfo.API_birthday.split(" ")[0]) || "无"
          }}</el-col
        >
      </el-row>

      <el-row>
        <el-col :span="10">联系方式：{{ prsonalInfo.API_tel || "无" }}</el-col>
        <el-col :span="10">患者来源：{{ patientSource || "无" }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="15">家庭住址：{{ prsonalInfo.API_address || "无" }}</el-col>
      </el-row>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    prsonalInfo: {
      type: Object,
      default: () => {
        return {
          API_pic:
            "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          API_name: "张三",
          API_gender: "男",
          API_birthday: "1999-0",
          API_address: "四川省成都市",
          API_tel: "19999999999",
          API_date: "2020/7/8",
          API_toHospitalID: "",
        };
      },
    },
  },
  computed: {
    patient() {
      let type = this.$store.state.videoConsultation.consultationSource;
      let origin;
      switch (type) {
        case "huanzhe":
          origin = "患者自己申请";
          break;
        case "jiuzhen":
          origin = "门诊患者";
          break;
        case "zhuyuan":
          origin = "住院患者";
          break;
      }
      return {
        address: this.prsonalInfo.API_address || "无",
        age: this.ageCompute(this.prsonalInfo.API_birthday) || "无",
        gender: this.prsonalInfo.API_gender || "无",
        name: this.prsonalInfo.API_name || "无",

        pic: this.prsonalInfo.API_pic || "无",
        tel: this.prsonalInfo.API_tel || "无",
        origin: origin || "无",
      };
    },
  },
  methods: {
    startConsultation() {
      this.$emit("startConsultation");
    },
    ageCompute(birthday) {
      if (!birthday) {
        return "暂无";
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
