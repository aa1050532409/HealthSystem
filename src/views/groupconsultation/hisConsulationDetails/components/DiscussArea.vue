<template>
  <div class="discussArea">
    <div style="margin: 30px" v-if="discussContent.length == 0">暂无人发表会诊意见</div>
    <div class="msgArea">
      <div v-for="item in discussContent" :key="item.id" class="msgCard">
        <div class="info">
          <img :src="item.user.img" alt="" />

          <div class="username">
            <span>{{ item.user.name }}</span>
          </div>
        </div>
        <div class="content">
          <p>
            {{ item.content }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="!readAble" class="textArea clearfix">
      <span class="subTitle">我的意见</span>
      <div style="float: right">
        <el-link type="success">+导入历史意见</el-link>
      </div>
      <el-input v-model="discussionOpinion" type="textarea" :min-rows="2"></el-input>
      <div>
        <el-button @click="postOpinion" class="btn" type="primary" size="small"
          >保存</el-button
        >
        <el-button
          class="btn"
          type="danger"
          v-if="isHolder"
          @click="endDialog"
          style="margin-right: 20px"
          size="small"
          >结束会诊</el-button
        >
      </div>
    </div>
    <div v-if="endDialogVisible" class="endDialog">
      <div class="header">
        <span>结束会诊</span>
      </div>

      <div>
        <span class="subTitle">会诊结论：</span>
        <el-input type="textarea" v-model="discussResult.conclusion"></el-input>
        <span class="subTitle">治疗建议：</span>
        <el-input type="textarea" v-model="discussResult.treatOpinion"></el-input>
        <div>
          <PrescriptionEdit v-model="discussResult.prescription"></PrescriptionEdit>
        </div>

        <div v-if="$store.state.groupConsultation.consultationSource == 'huanzhe'">
          <span class="subTitle">后续治疗：</span>
          <After @after="afterInfo($event)" state="未完成"></After>
        </div>
      </div>
      <div class="clearfix">
        <el-button size="small" @click="stopConsulation" type="success" class="btn"
          >确定
        </el-button>
        <el-button
          size="small"
          @click="endDialogVisible = false"
          type="danger"
          class="btn"
          style="margin-right: 20px"
          >取消
        </el-button>
      </div>
    </div>
    <div
      v-if="$store.state.groupConsultation.consultationState == '会诊已结束'"
      class="textArea clearfix"
    >
      <div>
        <span class="subTitle">会诊结论：</span>
        <el-input
          :readonly="true"
          type="textarea"
          v-model="discussResult.conclusion"
        ></el-input>
        <span class="subTitle">治疗建议：</span>
        <el-input
          :readonly="true"
          type="textarea"
          v-model="discussResult.treatOpinion"
        ></el-input>
        <div>
          <Prescription :prescription="this.discussResult.prescription"></Prescription>
        </div>
        <div>
          <span class="subTitle">后续治疗：</span>
          <After
            :preInfo="discussResult.after"
            @after="afterInfo($event)"
            state="已完成"
          ></After>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDiscussDetails,
  postDiscussOpinion,
  stopGroupConsultation,
  getConsultationConclusion,
} from "@api/groupconsultation/groupconsultation.js";
import PrescriptionEdit from "@components/common/PrescriptionEdit.vue";
import Prescription from "@components/common/Prescription.vue";
import After from "./components/After.vue";

export default {
  props: {
    readonly: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    cid: String,
    pid: String,
  },
  computed: {
    readAble: function () {
      return (
        this.readonly ||
        this.$store.state.groupConsultation.consultationState == "会诊已结束"
      );
    },
  },
  components: {
    PrescriptionEdit,
    Prescription,
    After,
  },
  sockets: {
    newGroupConsultation_content() {
      let consultationId = this.cid;
      getDiscussDetails(consultationId).then((res) => {
        this.discussContent = res.discussion;
      });
    },
  },
  data() {
    return {
      isHolder: true,
      endDialogVisible: false,
      discussionOpinion: "",
      discussContent: [
        {
          user: {
            id: "101001",
            img:
              "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            name: "张三",
          },
          content: "该患者病情较为稳定，建议保守治疗",
        },
        {
          user: {
            id: "102001",
            img:
              "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            name: "李四",
          },
          content: "改患者病情波动剧烈，建议住院",
        },
      ],
      discussResult: {
        conclusion: "",
        treatOpinion: "",
        prescription: [],
        after: [],
      },
    };
  },
  methods: {
    afterInfo(info) {
      this.discussResult.after = info;
    },
    endDialog() {
      this.endDialogVisible = true;
    },
    stopConsulation() {
      if (this.discussResult.conclusion != "" && this.discussResult.treatOpinion != "") {
        this.$confirm("是否确认结束会诊?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let consultationId = this.$store.state.groupConsultation.consultationId;

            stopGroupConsultation(consultationId, this.discussResult).then((res) => {
              if (res) {
                this.$message({
                  type: "success",
                  message: "结束会诊成功",
                });
                this.$router.push("/groupconsultation/todayconsultation");
              } else {
                this.$message({
                  type: "error",
                  message: "结束会诊失败",
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
        this.$message.error("请输入会诊结论及治疗意见");
      }
    },
    postOpinion() {
      if (this.discussionOpinion != "") {
        let consultationId = this.cid;
        postDiscussOpinion(consultationId, this.discussionOpinion).then((res) => {
          if (res) {
            this.$message.success("提交成功");
            this.discussionOpinion = "";
            getDiscussDetails(consultationId).then((res) => {
              this.discussContent = res.discussion;
            });
          } else {
            this.$message.error("提交失败，请稍后再试");
          }
        });
      } else {
        this.$message.error("请输入会诊意见");
      }
    },
  },
  mounted() {
    let consultationId = this.cid;
    getDiscussDetails(consultationId).then((res) => {
      this.discussContent = res.discussion;
      this.isHolder = res.isHolder;
    });
    getConsultationConclusion(consultationId).then((res) => {
      console.log(res);
      res = {
        conclusion: res.conclusion || "",
        prescription: res.prescription || [],
        status: res.status || "",
        treatOpinion: res.treatOpinion || "",
      };
      this.discussResult = res;
    });
  },
};
</script>

<style lang="scss" scoped>
.discussArea {
  width: 100%;
  .msgArea {
    max-height: 380px;
    width: 100%;
    overflow-y: auto;
    .msgCard {
      width: 95%;
      margin: 10px auto;
      background-color: #eff3f4;
      border-radius: 5px;
      padding: 10px;
      display: flex;
      .info {
        width: 100px;
        height: 100px;
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        img {
          width: 90%;
          margin: auto;
        }
        .username {
          width: 100%;
          text-align: center;
        }
      }
      .content {
        padding: 5px 5px 5px 20px;
        font-size: 16px;
      }
    }
  }

  .textArea {
    width: 95%;
    margin: 0 auto;
    padding: 3px;
    .subTitle {
      font-size: 15px;
      font-weight: bolder;
    }
    .btn {
      float: right;
      margin: 10px 0;
      width: 100px;
    }
  }
  .endDialog {
    margin-top: 20px;
    width: 100%;
    padding: 10px;
    box-shadow: 2px 2px 2px 2px gray;
    .header {
      width: 100%;
      text-align: center;
      font-size: 18px;
      font-weight: bolder;
      color: #1e7c7e;
    }
    .subTitle {
      font-size: 16px;
      font-weight: bold;
      color: #1e7c7e;
    }
    .btn {
      margin: 10px 0;
      float: right;
      width: 100px;
    }
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
</style>
