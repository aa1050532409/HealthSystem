<template>
  <div>
    <div>
      <el-row>
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
        <span class="label">申请时间： </span>
        <span class="text-font">
          {{ consultationInfo.applyTime }}
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
    <el-row style="margin-top: 10px">
      <el-col :span="7">
        <span class="label"> 会诊开始时间： </span>
        <span class="text-font">
          {{ consultationInfo.startTime }}
        </span>
      </el-col>
      <el-col :span="7">
        <span class="label"> 会诊结束时间： </span>
        <span class="text-font">
          {{ consultationInfo.endTime }}
        </span>
      </el-col>

      <el-col v-if="consultationInfo.mystate == '未处理'" :span="7">
        <span :class="timeAvailableFlag ? 'availableTip' : 'unavailableTip'">{{
          timeAvailableFlag ? "当前时间段空闲" : "当前时间段已被占用"
        }}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col>
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
            <div style="margin-top: 10px">
              <span class="typeName">{{ "会诊参与人" }}</span>
              <div>
                <div
                  v-for="p in consultationInfo.person.participants"
                  :key="p.id"
                  class="infoCard"
                >
                  <img :src="p.userImg" alt="" />
                  <div style="text-align: center">
                    <p>{{ p.userName }}</p>
                    <p>{{ p.state }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div v-if="consultationInfo.participateType == '参与'" style="float: right">
          <template v-if="consultationInfo.mystate == '未处理'">
            <el-button @click="approve" size="small" type="success">同意会诊</el-button>
            <el-button @click="refuse" size="small" type="danger">拒绝会诊</el-button>
          </template>
          <div style="clear: both; height: 0"></div>
        </div>
        <div v-else style="float: right">
          <template v-if="consultationInfo.state == '待确认'">
            <!-- <el-button @click="restart" size="small" type="warning"
              >重新发起</el-button
            > -->
            <el-button @click="cancel" size="small" type="danger">取消会诊</el-button>
            <el-button @click="confirm" size="small" type="success">确认会诊</el-button>
          </template>
          <div style="clear: both; height: 0"></div>
        </div>
      </el-col>
    </el-row>

    <ConsultationStart
      @commit="confirmRestart($event)"
      ref="ConsultationStart"
    ></ConsultationStart>
  </div>
</template>

<script>
import {
  getConsultationInfo,
  approveConsultation,
  refuseConsultation,
  restartConsultation,
  cancelConsultation,
  confirmConsultation,
  getAvailableTime,
} from "@api/videoConsultation/videoConsultation.js";
import ConsultationStart from "./ConsultationStart.vue";

export default {
  components: {
    ConsultationStart,
  },
  data() {
    return {
      timeAvailableFlag: false,
      consultationInfo: {
        reason: "",
        startTime: "",
        endTime: "",
        type: "",
        applyTime: "",
        participateType: "参与",
        state: "",
        person: {
          groups: [],
          orgs: [],
          participants: [
            {
              userImg:
                "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
              userName: "张笑1",
              state: "已接受",
            },
          ],
          holderInfo: {
            userImg:
              "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            userName: "张笑",
          },
        },
      },
    };
  },
  computed: {
    consultationId: function () {
      return this.$store.state.videoConsultation.consultationId;
    },
  },
  methods: {
    restart() {
      console.log(this.$refs["ConsultationStart"]);
      this.$refs["ConsultationStart"].showFlag = true;
      this.$refs["ConsultationStart"].huizhenStart.reason = this.consultationInfo.reason;
      this.$refs["ConsultationStart"].huizhenStart.type = this.consultationInfo.type;
      this.$refs["ConsultationStart"].huizhenStart.startTime = new Date(
        this.consultationInfo.startTime
      ).getTime();
      this.$refs["ConsultationStart"].huizhenStart.endTime = new Date(
        this.consultationInfo.endTime
      ).getTime();
    },
    confirmRestart(data) {
      restartConsultation(this.consultationId, data).then((res) => {
        if (res) {
          this.$message.success("重新发起成功");
        } else {
          this.$message.error("重新发起失败");
        }
      });
    },
    refuse() {
      this.$confirm("您确定要拒绝此次会诊申请么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger",
      })
        .then(() => {
          refuseConsultation(this.consultationId).then((res) => {
            if (res) {
              this.$message.success("你已拒绝此次会诊申请");
              getConsultationInfo(this.consultationId).then((res) => {
                this.consultationInfo = res;
                this.$store.commit(
                  "videoConsultation/currentConsultationStateChange",
                  res.state
                );
              });
            } else {
              this.$message.error("拒绝会诊申请失败，请稍后再试");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消拒绝",
          });
        });
    },
    cancel() {
      this.$confirm("您确定要取消此次会诊申请么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger",
      })
        .then(() => {
          cancelConsultation(this.consultationId).then((res) => {
            if (res) {
              this.$message.success("你已取消此次会诊申请");
              getConsultationInfo(this.consultationId).then((res) => {
                this.consultationInfo = res;
                this.$store.commit(
                  "videoConsultation/currentConsultationStateChange",
                  res.state
                );
              });
            } else {
              this.$message.error("取消会诊申请失败，请稍后再试");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消拒绝",
          });
          getConsultationInfo(this.consultationId).then((res) => {
            this.consultationInfo = res;
            this.$store.commit(
              "videoConsultation/currentConsultationStateChange",
              res.state
            );
          });
        });
    },
    confirm() {
      if (this.getAcceptNum() > 0) {
        this.$confirm("您要确认此次会诊申请么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "danger",
        })
          .then(() => {
            confirmConsultation(this.consultationId).then((res) => {
              if (res) {
                this.$message.success("此次会诊已确认!");
                getConsultationInfo(this.consultationId).then((res) => {
                  this.consultationInfo = res;
                  this.$store.commit(
                    "videoConsultation/currentConsultationStateChange",
                    res.state
                  );
                });
              } else {
                this.$message.error("确认会诊失败!");
              }
            });
          })
          .catch(() => {});
      } else {
        this.$message.error("当前接受人数少于一人，无法确认视频会诊");
      }
    },
    approve() {
      let msg = "您确定要同意此次会诊申请么?";
      if (!this.timeAvailableFlag) {
        msg = "当前时间段有冲突，您仍然要同意此次会诊申请么？";
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger",
      })
        .then(() => {
          approveConsultation(this.consultationId).then((res) => {
            if (res) {
              this.$message.success("您已同意此次视频会诊申请");
              getConsultationInfo(this.consultationId).then((res) => {
                this.consultationInfo = res;
                this.$store.commit(
                  "videoConsultation/currentConsultationStateChange",
                  res.state
                );
              });
            } else {
              this.$message.error("同意会诊申请失败，请稍后再试");
            }
          });
        })
        .catch(() => {});
    },
    getAcceptNum() {
      let count = 0;
      this.consultationInfo.person.participants.forEach((element) => {
        if (element.state == "已同意") {
          count++;
        }
      });
      return count;
    },
  },
  mounted() {
    let consultationId = this.consultationId;
    getConsultationInfo(consultationId)
      .then((res) => {
        this.consultationInfo = res;
        this.$store.commit("videoConsultation/currentConsultationStateChange", res.state);
        return getAvailableTime({
          startTime: this.consultationInfo.startTime,
          endTime: this.consultationInfo.endTime,
        });
      })
      .then((res) => {
        this.timeAvailableFlag = res;
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
  padding: 5px;
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
.availableTip {
  font-size: $font_large;
  color: $successColor;
}
.unavailableTip {
  font-size: $font_large;
  color: $dangerColor;
}
</style>
