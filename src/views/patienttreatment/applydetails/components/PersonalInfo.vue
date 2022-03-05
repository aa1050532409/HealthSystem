<template>
  <!-- 
个人信息
  -->
  <div>
    <PatientInfo :patient="patient"> </PatientInfo>
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
        };
      },
    },
  },
  methods: {
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
  computed: {
    patient() {
      return {
        address: this.prsonalInfo.API_address || "无",
        age: this.ageCompute(this.prsonalInfo.API_birthday) || "无",
        gender: this.prsonalInfo.API_gender || "无",
        name: this.prsonalInfo.API_name || "无",
        userId: this.prsonalInfo.API_UserID || "无",

        pic: this.prsonalInfo.API_pic || "无",
        tel: this.prsonalInfo.API_tel || "无",
      };
    },
  },
};
</script>
