<template>
  <div class="discussArea">
    <div style="margin: 30px" v-if="discussContent && discussContent.length == 0">
      暂无人发表探讨意见
    </div>
    <div v-scroll-bottom="discussContent" id="discussionArea" class="msgArea">
      <div v-for="item in discussContent" :key="item.id" class="msgCard">
        <div class="info">
          <img :src="item.user.img" alt="" />

          <div class="username">
            <span>{{ item.user.name }}</span>
          </div>
        </div>
        <div class="content">
          <p style="word-wrap: break-word; word-break: break-all">
            {{ item.content }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="!readAble" class="textArea clearfix">
      <span class="subTitle">我的意见</span>
      <div style="float: right">
        <el-link @click="importFlag = true" type="success">+导入历史意见</el-link>
      </div>
      <el-input v-model="discussionOpinion" type="textarea" :min-rows="2"></el-input>
      <div>
        <el-button @click="postOpinion" class="btn" type="primary" size="small"
          >发送</el-button
        >
      </div>
    </div>
    <DiscusstionOpinionImport
      v-model="importFlag"
      @import="discussionOpinion = $event"
    ></DiscusstionOpinionImport>
  </div>
</template>

<script>
import {
  postDiscussionContent,
  getDiscussionContent,
} from "@api/patientdiag/patientdiag.js";
import PrescriptionEdit from "@components/common/PrescriptionEdit.vue";
import Prescription from "@components/common/Prescription.vue";
import SpecialInputBox from "@components/common/SpecialInputBox.vue";
import { getResultOptions, getTreatmentOptions } from "@api/patientdiag/patientdiag.js";
export default {
  props: {
    readonly: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  computed: {
    readAble() {
      return this.readonly;
    },
    pid() {
      return this.$route.query.pid;
    },
  },
  components: {
    PrescriptionEdit,
    Prescription,
    SpecialInputBox,
  },
  // sockets: {
  //   newGroupConsultation_content() {
  //     let consultationId = this.$store.state.groupConsultation.consultationId;
  //     getDiscussionContent(this.pid).then((res) => {
  //       this.discussContent = res.discussion;
  //     });
  //   },
  // },
  data() {
    return {
      key1: "1",
      key2: "10",
      // cResult: "asdfasdfa",
      importFlag: false,
      historyResultImport: false,
      historyOpinion: [],
      historyResult: [],
      isHolder: true,
      discussionOpinion: "",
      discussContent: [],
      discussResult: {
        conclusion: "",
        treatOpinion: "",
        prescription: [],
        after: [],
      },
      resultOptions: [],
      treatOptions: [],
    };
  },
  methods: {
    postOpinion() {
      if (this.discussionOpinion != "") {
        let consultationId = this.$store.state.groupConsultation.consultationId;
        postDiscussionContent(this.pid, this.discussionOpinion).then((res) => {
          if (res) {
            this.$message.success("提交成功");
            this.discussionOpinion = "";
            this.getOpinion();
          } else {
            this.$message.error("提交失败，请稍后再试");
          }
        });
      } else {
        this.$message.error("请输入讨论意见");
      }
    },
    getOpinion() {
      getDiscussionContent(this.pid).then((res) => {
        res = res.map((item) => {
          return {
            user: {
              name: item.Name,
              img: item.Image,
            },
            content: item.Content,
          };
        });
        this.discussContent = res;
      });
    },
  },
  mounted() {
    this.getOpinion();
  },
  directives: {
    /*这个是vue的自定义指令,官方文档有详细说明*/
    // 发送消息后滚动到底部,这里无法使用原作者的方法，也未找到合理的方法解决，暂用setTimeout的方法模拟
    "scroll-bottom"(el) {
      setTimeout(function () {
        el.scrollTop += 9999;
      }, 20);
    },
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
        height: 50px;
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        img {
          height: 40px;
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
.box {
  width: 100%;
  min-height: 100px;
  margin-top: 5px;
  padding: 10px;
  border: 1px solid #e4e7ed;
  p {
    margin-top: 5px;
    font-size: 18px;
    text-indent: 20px;
  }
}
</style>
