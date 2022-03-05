<template>
  <div class="after">
    <div v-if="state == '已完成'">
      <p>已选择：{{ preInfo.length > 0 ? "" : "无" }}</p>
      <div
        style="margin-left:20px;margin-bottom:10px"
        v-for="item in preInfo"
        :key="item.id"
      >
        <span class="org" style="margin-right:20px">{{ item.orgName }}</span>
        <template v-if="item.doctors.length > 0">
          <span>医生：</span>
          <span
            style="margin-right:10px"
            v-for="doc in item.doctors"
            :key="doc.id"
            >{{ doc.docName }}</span
          >
        </template>
        <template v-if="item.nurses.length > 0">
          <span style="margin-left:30px">护士：</span>
          <span
            style="margin-right:10px"
            v-for="doc in item.nurses"
            :key="doc.id"
            >{{ doc.nurName }}</span
          >
        </template>
      </div>
    </div>
    <div v-else class="result">
      <p>已选择：{{ result.length > 0 ? "" : "无" }}</p>
      <div
        style="margin-left:20px;margin-bottom:10px"
        v-for="item in result"
        :key="item.id"
      >
        <span class="org" style="margin-right:20px">{{ item.orgName }}</span>
        <template v-if="item.doctors.length > 0">
          <span>医生：</span>
          <span
            style="margin-right:10px"
            v-for="doc in item.doctors"
            :key="doc.id"
            >{{ doc.docName }}</span
          >
        </template>
        <template v-if="item.nurses.length > 0">
          <span style="margin-left:30px">护士：</span>
          <span
            style="margin-right:10px"
            v-for="doc in item.nurses"
            :key="doc.id"
            >{{ doc.nurName }}</span
          >
        </template>
      </div>
    </div>
    <template v-if="state == '未完成'">
      <div>医疗机构：</div>
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
      <template v-if="currentOrg.orgId">
        <div>护士：</div>
        <div class="nur">
          <el-checkbox-group v-model="choosedNur">
            <el-row :gutter="5">
              <el-col
                v-for="nur in currentOrg.nurses"
                :key="nur.id"
                :xs="8"
                :sm="6"
                :md="4"
                :lg="4"
              >
                <div class="nurCard">
                  <div class="pic">
                    <img :src="nur.nurPic" alt />
                  </div>
                  <div class="check">
                    <el-checkbox :label="nur">{{ nur.nurName }}</el-checkbox>
                  </div>
                </div>
              </el-col>

              <el-col
                v-if="this.nurShowNum < currentOrg.nurses.length"
                :xs="8"
                :sm="6"
                :md="4"
                :lg="4"
              >
                <div @click="moreNur" class="docCard">
                  <div class="more">
                    <i class="iconfont icon-more icon"></i>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { getMedicalInfo } from "@api/patientdiag/patientdiag.js";
export default {
  props: {
    state: {
      type: String,
      default: () => {
        return "";
      }
    },
    preInfo: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    info: function() {
      let obj = this.medicalInfo;
      obj.forEach(item => {
        item.doctors.forEach(doc => {
          doc.orgId = item.orgId;
          doc.orgName = item.orgName;
        });
        item.nurses.forEach(nur => {
          nur.orgId = item.orgId;
          nur.orgName = item.orgName;
        });
      });
      return obj;
    },
    result: function() {
      let orgs = [];
      this.choosedDoc.forEach(doc => {
        let flag = true;
        orgs.forEach(org => {
          if (org.orgId == doc.orgId) {
            org.doctors.push({
              docName: doc.docName,
              docId: doc.docId
            });
            flag = false;
          }
        });
        if (flag) {
          orgs.push({
            orgName: doc.orgName,
            orgId: doc.orgId,
            doctors: [
              {
                docName: doc.docName,
                docId: doc.docId
              }
            ],
            nurses: []
          });
        }
      });

      this.choosedNur.forEach(nur => {
        let flag = true;
        orgs.forEach(org => {
          if (org.orgId == nur.orgId) {
            org.nurses.push({
              nurName: nur.nurName,
              nurId: nur.nurId
            });
            flag = false;
          }
        });
        if (flag) {
          orgs.push({
            orgName: nur.orgName,
            orgId: nur.orgId,
            doctors: [],
            nurses: [
              {
                nurName: nur.nurName,
                nurId: nur.nurId
              }
            ]
          });
        }
      });
      this.$emit("after", orgs);
      return orgs;
    }
  },
  data() {
    return {
      docShowNum: 5,
      nurShowNum: 5,
      choosed: [],
      currentOrg: {},
      choosedDoc: [],
      choosedNur: [],
      medicalInfo: []
    };
  },
  watch: {
    currentOrg() {
      this.docShowNum = 5;
      this.nurShowNum = 5;
    }
  },
  methods: {
    moreDoc() {
      this.docShowNum += 5;
    },
    moreNur() {
      this.nurShowNum += 5;
    },
    docChanged(docs) {
      this.choosed.forEach(item => {
        item.doctors = [];
        docs.forEach(doc => {
          if (doc.orgId == item.orgId) {
            item.doctors.push(doc);
          }
        });
      });
    },
    nurChanged(nurs) {
      this.choosed.forEach(item => {
        item.nurses = [];
        nurs.forEach(nur => {
          if (nur.orgId == item.orgId) {
            item.nurses.push(nur);
          }
        });
      });
    },
    orgSelect(org) {
      if (this.currentOrg.orgId == org.orgId) {
        this.currentOrg = {};
      } else {
        this.currentOrg = org;
      }
    }
  },
  mounted() {
    getMedicalInfo().then(res => {
      this.medicalInfo = res;
    });
  }
};
</script>

<style lang="scss" scoped>
.after {
  font-size: 16px;
  width: 100%;
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