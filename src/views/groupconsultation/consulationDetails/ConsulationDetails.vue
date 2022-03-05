<template>
  <div>
    <div class="pageContent">
      <el-collapse v-model="pages.collapse_activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <h3 class="title">基本信息</h3>
          </template>
          <PersonalInfo :prsonalInfo="patientInfo.API_basicInfo"></PersonalInfo>
        </el-collapse-item>

        <el-collapse-item ref="info" :key="infoKey" name="4">
          <template slot="title">
            <h3 class="title">会诊信息</h3>
          </template>
          <div class="container">
            <div>
              <ConsultationStart
                v-if="consultationState == '患者已发起'"
                :pid="pid"
                ref="huizhen"
                :startType="1"
                :huizhenId="consultationId"
                @successStart="successStart"
              ></ConsultationStart>
              <ConsultationInfo
                :cid="cid"
                :pid="pid"
                v-if="consultationState != '患者已发起'"
              ></ConsultationInfo>
            </div>
          </div>
        </el-collapse-item>

        <el-collapse-item
          v-if="consultationState != '患者已发起'"
          ref="opinion"
          :key="optionKey"
          v-show="$store.state.groupConsultation.consultationState != '等待患者确认'"
          name="2"
        >
          <template slot="title">
            <h3 class="title">会诊意见</h3>
          </template>
          <div class="container">
            <div>
              <DiscussArea
                :readonly="consultationState == '进行中' ? false : true"
                @fresh="freshKey"
                :key="discussKey"
                :cid="cid"
                :pid="pid"
              ></DiscussArea>
            </div>
          </div>
        </el-collapse-item>

        <el-collapse-item v-if="detailShowFlag" ref="PidDetails" name="3">
          <template slot="title">
            <h3 class="title">患者病情</h3>
          </template>
          {{ items }}
          <div :key="pid" class="container">
            <Reference :pid="pid" :items="items" :readonly="false"></Reference>
          </div>
        </el-collapse-item>
        <chatBox :pid="pid"></chatBox>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import ConsultationStart from "@components/consultation/ConsultationStart.vue";

import Reference from "@components/reference/Reference.vue";

import PersonalInfo from "./components/PersonalInfo.vue";
import DiscussArea from "./components/DiscussArea.vue";
import ConsultationInfo from "./components/ConsultationInfo.vue";
import chatBox from "./components/chatBox/chatBox.vue";

import { getPatientsDetails } from "@api/operationmanage/operationmanage.js";

export default {
  components: {
    Reference,
    PersonalInfo,
    DiscussArea,
    ConsultationInfo,
    ConsultationStart,
    chatBox,
  },
  computed: {
    consultationState() {
      return this.$store.state.groupConsultation.consultationState;
    },
    consultationId() {
      return this.cid;
    },
  },
  sockets: {
    endGroupConsultation(data) {
      if (data.gid == this.cid) {
        this.freshKey();
      }
    },
  },
  data() {
    return {
      cid: "",
      pid: "",
      infoKey: 0,
      discussKey: 10,
      optionKey: 100,
      detailShowFlag: true,
      // items: ["就诊记录", "护理记录", "评估记录", "入院记录", "治疗记录"],
      items: [],
      pages: {
        detailPid: "",
        pageSize: 5,
        currentPage: 1,
        collapse_activeNames: ["1", "2", "3", "4"],
      },
      patientInfo: {
        API_basicInfo: {},
      },
    };
  },
  methods: {
    successStart() {
      this.$store.commit("groupConsultation/currentConsultationStateChange", "进行中");
    },
    freshKey() {
      this.infoKey++;
      this.discussKey++;
      this.optionKey++;
    },
  },
  created() {
    this.cid = this.$route.query.cid + "";
    this.pid = this.$route.query.pid + "";
  },
  mounted() {
    let pid = this.pid;
    getPatientsDetails(pid).then((res) => {
      this.patientInfo.API_basicInfo = res;
      console.log("object", this.$store.state.groupConsultation);
    });
    switch (this.$store.state.groupConsultation.consultationSource) {
      case "jiuzhen":
        this.items = ["就诊记录"];
        break;
      case "zhuyuan":
        this.items = ["就诊记录", "护理记录", "评估记录", "入院记录", "治疗记录"];
        break;
      case "huanzhe":
        this.items = ["就诊记录"];
        break;
    }
    // this.$refs["huizhen"].showFlag = true;
  },
};
</script>

<style scoped lang="scss">
.pageContent {
  width: 95%;
  height: 100%;
  margin: 20px auto;
  .title {
    font-size: 20px;
    color: #1c7e7c;
  }
  .btn {
    float: right;
    margin-top: 50px;
    margin-bottom: 50px;
    margin-right: 50px;
    width: 120px;
  }
}
.clearfix:after {
  content: ""; /*设置内容为空*/
  height: 0; /*高度为0*/
  line-height: 0; /*行高为0*/
  display: block; /*将文本转为块级元素*/
  visibility: hidden; /*将元素隐藏*/
  clear: both; /*清除浮动*/
}
.drag {
  width: 300px;
  position: absolute;
  top: 30%;
  left: calc(50% - 150px);
  span {
    z-index: 100;
    position: absolute;
    top: 0px;
    right: 10px;
    color: white;
    cursor: pointer;
  }
}
.container {
  width: 95%;
  margin: auto;
  .search {
    .formLabel {
      font-size: 20px;
      color: #1c7e7c;
    }
    .addbtn {
      margin-left: 20px;
      width: 90px;
    }
  }
  .page {
    width: 95%;
    .block {
      float: right;
    }
  }
  .pinggu {
    margin-right: 20px;
    font-size: 18px;
    .pinggubiao {
      transition: 1s;
    }
  }
}
.addprescription {
  margin-top: 20px;
  font-size: 18px;
}

.inputBox {
  position: fixed;
  left: 240px;
  bottom: 0px;
  width: calc(95% - 240px);
  z-index: 3000;
  transition: 0.5s;
}
.page {
  float: right;
  margin: 10px 5% 10px 0px;
}
.tips {
  margin-top: 20px;
  font-size: 18px;
}
.reference {
  max-height: 500px;
  overflow: auto;
}
</style>
