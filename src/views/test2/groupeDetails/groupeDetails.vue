<template>
  <div class="global-container mt20">
    <div><OrgInfo :details="orgDetails"></OrgInfo></div>
    <div class="mt20">
      <el-tabs value="introduction">
        <el-tab-pane label="简介" name="introduction">
          <div>
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入医院简介"
              v-model="orgDetails.introduction"
            ></el-input>
          </div>
        </el-tab-pane>
        <el-tab-pane label="医生管理" name="dco">
          <div>
            <PersonManage
              @refresh="getInfo"
              :showTable="doctors"
              type="医生"
            ></PersonManage>
          </div>
        </el-tab-pane>
        <el-tab-pane label="护士管理" name="nur">
          <div>
            <PersonManage
              type="护士"
              @refresh="getInfo"
              :showTable="nurses"
            ></PersonManage>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getExpertDetails,
  modifyBadicInfo,
  addMember,
  delMember,
  modifyMember,
} from "@api/expertmanage/expertmanage.js";

import { getExpertGroupInfo } from "@api/manage/expertManage.js";
import { getOrgsDetails } from "@api/manage/orgManage.js";

import OrgInfo from "../components/OrgInfo";
import PersonManage from "../components/PersonManage";
export default {
  components: {
    OrgInfo,
    PersonManage,
  },
  data() {
    return {
      orgId: "",
      orgDetails: {
        Image: "xxx",
        name: "xxx",
        level: "xxx1",
        type: "xxx",
        address: "xxx",
        tel: "xxx",
        introduction: "",
      },
      doctors: [],
      nurses: [],
    };
  },
  methods: {
    getInfo() {
      this.orgId = this.$route.query.id;
      getOrgsDetails(this.orgId).then((res) => {
        console.log(res);
        if (res) {
          this.orgDetails = {
            Image: res.details.Image,
            name: res.details.HospitalName,
            level: res.details.HospitalLeve,
            type: res.details.HospitalType,
            address: res.details.Address,
            tel: res.details.ContactPhone,
            introduction: res.details.HospitalIntroduction,
          };
          this.doctors = res.doctors.map((item) => {
            return {
              Image: item.Image,
              Name: item.Name,
              Research: item.ResearchExperienceInfo,
              UserID: item.UserID,
            };
          });
          this.nurses = res.nurses.map((item) => {
            return {
              Image: item.Image,
              Name: item.Name,
              Research: item.ResearchExperienceInfo,
              UserID: item.UserID,
            };
          });
        } else {
          this.$message.error("网络错误，稍后再试");
        }
      });
    },
  },
  created() {
    this.getInfo();
  },
};
</script>
<style scoped lang="scss">
</style>