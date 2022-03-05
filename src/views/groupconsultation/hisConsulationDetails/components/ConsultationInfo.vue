<template>
  <div>
    <div>
      <div>
        <el-row style="width: 100%">
          <el-col :span="24">
            <span class="label"> 会诊目的： </span>
            <div class="textBox" style="margin-left: 80px">
              <span class="text-font" style="padding: 10px">
                {{ consultationInfo.reason }}
              </span>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-row style="margin-top: 10px">
        <el-col :span="7">
          <span class="label"> 截止时间： </span>
          <span class="text-font">
            {{ consultationInfo.endTime }}
          </span>
        </el-col>
        <el-col :span="7">
          <span class="label"> 会诊类型： </span>
          <span class="text-font">
            {{ consultationInfo.type }}
          </span>
        </el-col>
        <el-col :span="7">
          <span class="label"> 会诊状态： </span>
          <span class="text-font">
            {{ consultationInfo.state }}
          </span>
        </el-col>
      </el-row>

      <div>
        <span class="label"> 会诊人员： </span>
        <div style="margin-left: 80px">
          <div style="margin-top: 10px">
            <span class="typeName">{{ "会诊主持人" }}</span>
            <div>
              <div class="infoCard">
                <img :src="consultationInfo.person.holderInfo.userImg" alt="" />
                <div class="username">
                  {{ consultationInfo.person.holderInfo.userName }}
                </div>
              </div>
            </div>
          </div>

          <div
            style="margin-top: 10px"
            v-for="group in consultationInfo.person.groups"
            :key="group.id"
          >
            <span class="typeName">{{ group.groupName }}</span>
            <div>
              <div class="infoCard" v-for="exp in group.experts" :key="exp.id">
                <img :src="exp.expPic" alt="" />
                <div class="username">
                  {{ exp.expName }}
                </div>
              </div>
            </div>
          </div>
          <div
            style="margin-top: 10px"
            v-for="org in consultationInfo.person.orgs"
            :key="org.id"
          >
            <span class="typeName">{{ org.orgName }}</span>
            <div>
              <div class="infoCard" v-for="doc in org.doctors" :key="doc.id">
                <img :src="doc.docPic" alt="" />
                <div class="username">
                  {{ doc.docName }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SpecialInputBox></SpecialInputBox>
    </div>
  </div>
</template>

<script>
import { getConsultationInfo } from "@api/groupconsultation/groupconsultation.js";

import SpecialInputBox from "@components/common/SpecialInputBox.vue";
export default {
  components: {
    SpecialInputBox,
  },
  props: {
    cid: String,
    pid: String,
  },
  data() {
    return {
      consultationInfo: {
        person: {
          groups: [],
          orgs: [],
          holderInfo: {},
        },
      },
    };
  },
  mounted() {
    let consultationId = this.cid;
    getConsultationInfo(consultationId).then((res) => {
      this.consultationInfo = res;
      console.log(res, "wwwwwwwwwwwwwwwwwwwwww", this.cid);
      this.$store.commit("groupConsultation/currentConsultationStateChange", res.state);
    });
  },
};
</script>

<style lang="scss" scoped>
.infoCard {
  width: 100px;
  height: 80px;
  display: inline-flex;
  flex-direction: column;
  margin: 5px 10px;
  img {
    // width: 90%;
    height: 50px;
    margin: auto;
  }
  .username {
    width: 100%;
    text-align: center;
  }
}
.label {
  font-size: 16px;
  font-weight: bolder;
  color: #1c7c7e;
}
.textBox {
  width: 90%;
  min-height: 60px;
  border: 1px solid lightgray;
}
.text-font {
  font-size: 15px;
}
.typeName {
  font-size: 16px;
  color: #1c7c7e;
  margin: 10px 0;
}
</style>
