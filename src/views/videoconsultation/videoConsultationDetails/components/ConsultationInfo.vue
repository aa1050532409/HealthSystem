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
                <template v-for="p in consultationInfo.person.participants">
                  <div :key="p.id" v-if="p.state == '已同意'" class="infoCard">
                    <img :src="p.userImg" alt="" />
                    <div style="text-align: center">
                      <p>{{ p.userName }}</p>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div v-if="false" style="float: right">
          <template v-if="!consultationInfo.mystate == '已同意'">
            <el-button @click="approve" size="small" type="success">同意会诊</el-button>
            <el-button @click="refuse" size="small" type="danger">拒绝会诊</el-button>
          </template>
          <div style="clear: both; height: 0"></div>
        </div>
        <div v-if="false" style="float: right">
          <!-- <el-button @click="restart" size="small" type="warning"
            >重新发起</el-button
          > -->
          <el-button @click="cancel" size="small" type="danger">取消会诊</el-button>
          <el-button @click="confirm" size="small" type="success">确认会诊</el-button>
          <div style="clear: both; height: 0"></div>
        </div>
      </el-col>
    </el-row>

    <!-- <ConsultationStart
      @commit="confirmRestart($event)"
      ref="ConsultationStart"
    ></ConsultationStart> -->
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
} from "@api/videoConsultation/videoConsultation.js";
// import ConsultationStart from "./ConsultationStart.vue";

export default {
  components: {
    // ConsultationStart,
  },
  data() {
    return {
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
            {
              userImg:
                "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
              userName: "张笑2",
              state: "已接受",
            },
            {
              userImg:
                "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
              userName: "张笑3",
              state: "已接受",
            },
            {
              userImg:
                "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
              userName: "张笑4",
              state: "已接受",
            },
            {
              userImg:
                "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
              userName: "张笑5",
              state: "已接受",
            },
            {
              userImg:
                "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
              userName: "张笑6",
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
      return this.$route.query.cid;
    },
  },
  methods: {
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
        });
    },
    confirm() {
      this.$confirm("您确定要确认此次会诊申请么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger",
      })
        .then(() => {
          confirmConsultation(this.consultationId).then((res) => {
            if (res) {
              this.$message.success("你已取消此次会诊申请");
            } else {
              this.$message.error("取消会诊申请失败，请稍后再试");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "确认失败",
          });
        });
    },
    approve() {
      this.$confirm("您确定要同意此次会诊申请么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger",
      })
        .then(() => {
          approveConsultation(this.consultationId).then((res) => {
            if (res) {
              this.$message.success("你已同意此次会诊申请");
            } else {
              this.$message.error("同意会诊申请失败，请稍后再试");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消同意",
          });
        });
    },
  },
  mounted() {
    let consultationId = this.consultationId;
    getConsultationInfo(consultationId).then((res) => {
      this.consultationInfo = res;

      let sTime = new Date(this.consultationInfo.startTime).getTime();
      if (this.consultationInfo.state == "未开始" && Date.now() > sTime)
        this.consultationInfo.state = "进行中";
      this.$store.commit("videoConsultation/currentConsultationStateChange", res.state);
      this.$store.commit("videoConsultation/endTimeChange", res.endTime);
      this.$store.commit("videoConsultation/startTimeChange", res.startTime);
      this.$store.commit(
        "videoConsultation/currentConsultationIsholderChange",
        res.participateType == "主持" ? "主持人" : "参与者"
      );
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
</style>
