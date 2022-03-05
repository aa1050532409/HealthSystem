<template>
  <div class="after">
    <div style="display: none">{{ result }}</div>
    <div class="chooseType">专家团队：</div>
    <div class="org">
      <el-row :gutter="5">
        <el-col
          v-for="item in GroupInfo"
          :key="item.id"
          :xs="8"
          :sm="6"
          :md="4"
          :lg="4"
        >
          <div @click="groupSelect(item)" class="orgCard">
            <div class="pic">
              <img :src="item.groupPic" alt />
            </div>
            <div
              :class="
                currentExpertGroup.groupName &&
                currentExpertGroup.groupName == item.groupName
                  ? ' check choosed'
                  : 'check'
              "
            >
              {{ item.groupName }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <template v-if="currentExpertGroup.groupName">
      <div>专家：</div>
      <div class="doc">
        <el-checkbox-group v-model="choosedExpert">
          <el-row :gutter="5">
            <el-col
              v-for="exp in currentExpertGroup.experts.slice(
                0,
                this.expShowNum
              )"
              :key="exp.id"
              :xs="8"
              :sm="6"
              :md="4"
              :lg="4"
            >
              <div class="docCard">
                <div class="pic">
                  <img :src="exp.expPic" alt />
                </div>
                <div class="check">
                  <el-checkbox :label="exp">{{ exp.expName }}</el-checkbox>
                </div>
              </div>
            </el-col>
            <el-col
              v-if="this.expShowNum < currentExpertGroup.experts.length"
              :xs="8"
              :sm="6"
              :md="4"
              :lg="4"
            >
              <div @click="moreExp" class="docCard">
                <div class="more">
                  <i class="iconfont icon-more icon"></i>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </div>
    </template>

    <div class="chooseType">医疗机构：</div>
    <div class="org">
      <el-row :gutter="5">
        <el-col
          v-for="item in info"
          :key="item.id"
          :xs="8"
          :sm="6"
          :md="4"
          :lg="4"
        >
          <div @click="orgSelect(item)" class="orgCard">
            <div class="pic">
              <img :src="item.orgPic" alt />
            </div>
            <div
              :class="
                currentOrg.orgId && currentOrg.orgId == item.orgId
                  ? ' check choosed'
                  : 'check'
              "
            >
              {{ item.orgName }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <template v-if="currentOrg.orgId">
      <div>医生：</div>
      <div class="doc">
        <el-checkbox-group v-model="choosedDoc">
          <el-row :gutter="5">
            <el-col
              v-for="doc in currentOrg.doctors.slice(0, this.docShowNum)"
              :key="doc.id"
              :xs="8"
              :sm="6"
              :md="4"
              :lg="4"
            >
              <div class="docCard">
                <div class="pic">
                  <img :src="doc.docPic" alt />
                </div>
                <div class="check">
                  <el-checkbox :label="doc">{{ doc.docName }}</el-checkbox>
                </div>
              </div>
            </el-col>
            <el-col
              v-if="this.docShowNum < currentOrg.doctors.length"
              :xs="8"
              :sm="6"
              :md="4"
              :lg="4"
            >
              <div @click="moreDoc" class="docCard">
                <div class="more">
                  <i class="iconfont icon-more icon"></i>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </div>
    </template>
  </div>
</template>

<script>
import { getMedicalInfo, getExpertGroupInfo } from "@api/common/common.js";

export default {
  props: {
    state: {
      type: String,
      default: () => {
        return "";
      },
    },
    preInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    info: function () {
      let obj = this.medicalInfo;
      obj.forEach((item) => {
        item.doctors.forEach((doc, index) => {
          if (doc.docId == this.$store.state.user.userInfo.userId) {
            if (item.doctors) {
              item.doctors.splice(index, 1);
            }
          } else {
            doc.orgId = item.orgId;
            doc.orgName = item.orgName;
            doc.orgPic = item.orgPic;
          }
        });
      });
      return obj;
    },
    GroupInfo: function () {
      let obj = this.expertGroupInfo;
      obj.forEach((item) => {
        item.experts.forEach((exp, index) => {
          if (exp.expId == this.$store.state.user.userInfo.userId) {
            if (item.experts) {
              item.experts.splice(index, 1);
            }
          } else {
            exp.groupName = item.groupName;
            exp.groupPic = item.groupPic;
            exp.groupName = item.groupName;
          }
        });
      });
      return obj;
    },
    result: function () {
      let orgs = [];
      let groups = [];
      this.choosedDoc.forEach((doc) => {
        let flag = true;
        orgs.forEach((org) => {
          if (org.orgId == doc.orgId) {
            org.doctors.push({
              docName: doc.docName,
              docId: doc.docId,
              docPic: doc.docPic,
            });
            flag = false;
          }
        });
        if (flag) {
          orgs.push({
            orgName: doc.orgName,
            orgId: doc.orgId,
            orgPic: doc.orgPic,
            doctors: [
              {
                docName: doc.docName,
                docId: doc.docId,
                docPic: doc.docPic,
              },
            ],
          });
        }
      });
      this.choosedExpert.forEach((exp) => {
        let flag = true;
        groups.forEach((group) => {
          if (group.groupName == exp.groupName) {
            group.experts.push({
              expName: exp.expName,
              expId: exp.expId,
              expPic: exp.expPic,
            });
            flag = false;
          }
        });
        if (flag) {
          groups.push({
            groupName: exp.groupName,
            groupName: exp.groupName,
            groupPic: exp.groupPic,
            experts: [
              {
                expName: exp.expName,
                expId: exp.expId,
                expPic: exp.expPic,
              },
            ],
          });
        }
      });
      console.log("object");
      this.$emit("chose", { orgs, groups });
      return { orgs, groups };
    },
  },
  data() {
    return {
      docShowNum: 5,
      expShowNum: 5,
      choosed: [],
      currentOrg: {},
      choosedDoc: [],
      currentExpertGroup: {},
      choosedExpert: [],
      expertGroupInfo: [],
      medicalInfo: [],
    };
  },
  watch: {
    currentOrg() {
      this.docShowNum = 5;
      this.expShowNum = 5;
    },
  },
  methods: {
    moreDoc() {
      this.docShowNum += 5;
    },
    moreExp() {
      this.expShowNum += 5;
    },
    orgSelect(org) {
      if (this.currentOrg.orgId == org.orgId) {
        this.currentOrg = {};
      } else {
        this.currentOrg = org;
      }
    },
    groupSelect(group) {
      if (this.currentExpertGroup.groupName == group.groupName) {
        this.currentExpertGroup = {};
      } else {
        this.currentExpertGroup = group;
      }
    },
  },
  mounted() {
    getMedicalInfo().then((res) => {
      this.medicalInfo = res;
    });
    getExpertGroupInfo().then((res) => {
      this.expertGroupInfo = res;
    });
  },
};
</script>

<style lang="scss" scoped>
.after {
  font-size: 16px;
  width: 100%;
  .chooseType {
    font-weight: bold;
  }
  .org {
    .orgCard {
      cursor: pointer;
      width: 100%;
      height: 170px;
      display: flex;
      flex-direction: column;
      .pic {
        margin: auto;
        img {
          width: 100px;
          height: 120px;
        }
      }
      .check {
        margin: auto;
      }
    }
  }
  .doc {
    .docCard {
      width: 100%;
      height: 170px;
      display: flex;
      flex-direction: column;
      .pic {
        margin: auto;
        img {
          width: 100px;
          height: 120px;
        }
      }
      .check {
        margin: auto;
      }
      .more {
        text-align: center;
        .icon {
          font-size: 80px;
          color: #c0c4cc;
          line-height: 170px;
          cursor: pointer;
        }
      }
    }
  }
  .nur {
    .nurCard {
      width: 100%;
      height: 170px;
      display: flex;
      flex-direction: column;
      .pic {
        margin: auto;
        img {
          width: 100px;
          height: 120px;
        }
      }
      .check {
        margin: auto;
      }
      .more {
        text-align: center;
        .icon {
          font-size: 80px;
          color: #c0c4cc;
          line-height: 170px;
          cursor: pointer;
        }
      }
    }
  }
  .choosed {
    padding: 1px;
    border-radius: 3px;
    background-color: #409eff;
  }
  .result {
    font-size: 16px;
    .org {
      color: #1c7e7c;
    }
  }
}
</style>