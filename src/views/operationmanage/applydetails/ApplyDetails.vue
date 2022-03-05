<template>
  <div>
    <div class="mainContent">
      <el-collapse v-model="pages.collapse_activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <h3 class="title">基本信息</h3>
          </template>
          <PersonalInfo :prsonalInfo="patientInfo.API_basicInfo"></PersonalInfo>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <h3 class="title">患者评估</h3>
          </template>
          <div class="container">
            <div v-for="(item, index) in pinggu" :key="item.id" class="pinggu">
              <div>
                <span style="margin-right: 40px"
                  >{{ item.name }}{{ "(" + item.state + ")" }}</span
                >
                <el-link
                  @click="jinxingpinggu(item, index)"
                  :type="item.state == '已完成' ? 'primary' : 'success'"
                  >{{ item.state == "已完成" ? "查看" : "进行评估" }}</el-link
                >
              </div>
              <div v-show="item.isOpen" class="pinggubiao">
                <div style="margin: 20px 0">
                  <components
                    class="quesComponent"
                    @commit="pingguCommit(index, $event)"
                    :preData="item.data"
                    :readonly="item.state == '已完成' ? true : false"
                    :is="item.type"
                  ></components>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <div>
          <Reference :pid="pid" :items="['就诊记录']" :readonly="true"></Reference>
        </div>
        <!-- <el-button @click="save" size="medium" type="primary" class="btn">确认</el-button> -->
        <el-button v-if="isFinished" @click="back" size="medium" class="btn"
          >返回</el-button
        >
      </el-collapse>

      <!-- 聊天 -->
      <chatBox :pid="pid"></chatBox>
    </div>
  </div>
</template>

<script>
import chatBox from "@components/chatBox/chatBox.vue";

import PersonalInfo from "./components/PersonalInfo.vue";
import Reference from "@components/reference/Reference.vue";

import questionnaire from "@components/questionnaires/mixin.js";

import {
  getApplyDetails,
  postRuyuanPinggu,
  pingguConfirm,
} from "@api/operationmanage/operationmanage.js";
export default {
  mixins: [questionnaire],
  components: {
    PersonalInfo: PersonalInfo,
    chatBox,
    Reference,
  },
  computed: {
    isFinished() {
      return this.pinggu.every((item) => item.state == "已完成");
    },
  },
  data() {
    return {
      pid: "",
      pages: {
        collapse_activeNames: ["1", "3"],
        questionnaire: {
          chooseDialogVisible: false,
          questionnaireDialogVisible: false,
          target: "",
          data: {},
          readOnlyDialoguVisible: false,
          readOnlyDialoguTarget: {},
          lastData: {}, //用于导入的数据
          importFlag: false,
        },
      },
      patientInfo: {
        API_basicInfo: {},
      },
      pinggu: [],
      newPinggu: [], //用一个数组来存储新录入的评估表，
    };
  },
  methods: {
    save() {
      let flag = true;
      this.pinggu.forEach((item, index) => {
        if (item.state == "未完成") {
          flag = false;
        }
      });

      if (flag) {
        let pid = this.pid;
        pingguConfirm(pid).then((res) => {
          if (res) {
            this.$message.success("入院评估完成");
            this.$router.push("/operationmanage/applylist");
          }
        });
      } else {
        this.$message.error("请完善入院评估");
      }
    },
    back() {
      this.$router.push("/operationmanage/applylist");
    },
    jinxingpinggu(item, index) {
      let obj = JSON.parse(JSON.stringify(item));
      if (item.isOpen) {
        obj.isOpen = false;
      } else {
        obj.isOpen = true;
      }
      this.pinggu.splice(index, 1, obj);
    },
    async pingguCommit(index, data) {
      let pid = this.pid;
      let res = await postRuyuanPinggu(pid, data);
      if (res) {
        this.fetchData(true);
        this.$message.success("评估成功");
      }
    },
    fetchData(isFinal) {
      getApplyDetails(this.pid).then((res) => {
        this.patientInfo.API_basicInfo = res.API_basicInfo;
        this.pinggu = res.API_questionnaire;
        if (isFinal && this.isFinished) {
          this.save();
        }
        this.$store.commit("endLoading");
      });
    },
  },
  created() {
    this.pid = this.$route.query.pid + "";
    this.$store.commit("startLoading");
    this.fetchData();
  },
};
</script>

<style scoped lang="scss">
.mainContent {
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
  .pinggu {
    margin-right: 20px;
    font-size: 18px;
    .pinggubiao {
      transition: 1s;
    }
  }
  .quesComponent {
    margin: 20px 0px;
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

.tips {
  margin-top: 20px;
  font-size: 18px;
}
</style>
