<template>
  <!-- 
个人信息
  -->
  <div class="personalInfo">
    <div class="img">
      <img :src="prsonalInfo.API_pic" alt />
    </div>
    <div class="info">
      <el-row>
        <el-col :span="8">姓名：{{ prsonalInfo.API_name || "无" }}</el-col>
        <el-col :span="8">性别：{{ prsonalInfo.API_gender || "无" }}</el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8"
          >出生日期：{{
            new Date(prsonalInfo.API_birthday).toLocaleDateString() || "无"
          }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="24">家庭住址：{{ prsonalInfo.API_address || "无" }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="10">联系方式：{{ prsonalInfo.API_tel || "无" }}</el-col>
        <el-col :span="10">住院号：{{ prsonalInfo.API_toHospitalID || "无" }}</el-col>
        <!-- <el-col :span="8"
          ><el-button type="success" size="small">视频记录</el-button>
        </el-col> -->
      </el-row>
    </div>
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
          API_toHospitalID: "202009188426",
        };
      },
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.personalInfo {
  width: 100%;
  display: flex;
  .img {
    width: 170px;
    height: 150px;
    padding-left: 30px;
    padding-right: 20px;
    flex-shrink: 0;
    border-right: 1px solid #d9d9d9;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    margin-left: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 18px;
  }
}
</style>
