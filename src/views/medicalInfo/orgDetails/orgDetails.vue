<template>
  <div class="global-container mt20">
    <div>
      <OrgInfo :readonly="true" @refresh="getInfo" :details="orgDetails"></OrgInfo>
    </div>
    <div class="mt20">
      <el-tabs value="introduction">
        <el-tab-pane label="简介" name="introduction">
          <div>
            <el-input
              :readonly="true"
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
      obj: {
        discussion: [
          {
            user: {
              img:
                "http://132.232.18.227:5000/user/userinfo/readfile?url=33e30672b4f2963e93d3b9a53abfd5d2.jpg",
              name: "梁越",
              id: "17780613412",
              type: "主持人",
            },
            content: [{ contentDateTime: "2020-10-28 23:00:24", content: "理由1" }],
          },
        ],
      },
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
            managerId: res.details.ManagerID,
            managerName: res.details.ManagerName,
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
<style scoped lang="scss"></style>
