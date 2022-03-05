<template>
  <div class="global-container mt20">
    <div><GroupInfo :expertGroupInfo="groupDetails"></GroupInfo></div>
    <div class="mt20">
      <el-tabs value="exp">
        <el-tab-pane label="专家管理" name="exp">
          <div>
            <PersonManage
              @refresh="getInfo"
              :showTable="experts"
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

import GroupInfo from "../components/GroupInfo";
import PersonManage from "../components/PersonManage";
export default {
  components: {
    GroupInfo,
    PersonManage,
  },
  data() {
    return {
      groupId: "",
      groupDetails: {
        ExpertImage: "",
        ExpertIntroduction: "",
        ExpertName: "",
        ExpertSpecialty: "",
        ExpertTel: "",
      },
      experts: [],
    };
  },
  methods: {
    getInfo() {
      this.groupId = this.$route.query.id;
      getExpertGroupInfo(this.groupId).then((res) => {
        if (res) {
          this.groupDetails = res.expertdetails[0];
          this.experts = res.TeamDoctor;
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