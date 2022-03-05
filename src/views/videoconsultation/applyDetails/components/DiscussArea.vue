<template>
  <div class="discussArea">
    <div style="margin: 30px" v-if="discussContent.length == 0">暂无人发表会诊意见</div>
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
        <el-link @click="historyOpinionImport = true" type="success"
          >+导入历史意见</el-link
        >
      </div>
      <el-input v-model="discussionOpinion" type="textarea" :min-rows="2"></el-input>
      <div>
        <el-button @click="postOpinion" class="btn" type="primary" size="small"
          >发送</el-button
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
      <div style="float: right">
        <el-link @click="historyResultImport = true" type="success"
          >+导入历史方案</el-link
        >
      </div>
      <div>
        <span class="subTitle">会诊结论：</span>
        <div @click="inputBoxShow" class="box">
          <p>
            {{ discussResult.conclusion }}
          </p>
        </div>
        <!-- <el-input type="textarea" v-model="discussResult.conclusion"></el-input> -->
        <span class="subTitle">治疗建议：</span>
        <div @click="inputBoxShow2" class="box">
          <p>
            {{ discussResult.treatOpinion }}
          </p>
        </div>
        <!-- <el-input
          type="textarea"
          v-model="discussResult.treatOpinion"
        ></el-input> -->
        <div>
          <PrescriptionEdit v-model="discussResult.prescription"></PrescriptionEdit>
        </div>

        <div v-if="$store.state.videoConsultation.consultationSource == 'huanzhe'">
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
      v-if="$store.state.videoConsultation.consultationState == '会诊已结束'"
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
    <el-dialog title="历史会诊意见" :visible.sync="historyOpinionImport" width="700px">
      <el-table
        :data="historyOpinion"
        :cell-style="{ 'text-align': 'center' }"
        style="width: 100%"
        max-height="500px"
        :header-cell-style="{
          textAlign: 'center',
        }"
      >
        <el-table-column prop="opinion" label="会诊意见"> </el-table-column>
        <el-table-column width="90" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="importHistoryOpinion(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>

    <el-dialog title="历史会诊方案" :visible.sync="historyResultImport" width="800px">
      <el-table
        ref="historyTreatment"
        max-height="500px"
        :data="historyResult.slice(0, 5)"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <Prescription :prescription="scope.row.prescription"></Prescription>
          </template>
        </el-table-column>
        <el-table-column label="会诊结论">
          <template slot-scope="scope">
            <span>{{ scope.row.conclusion }}</span>
          </template>
        </el-table-column>
        <el-table-column label="治疗建议">
          <template slot-scope="scope">
            <span>{{ scope.row.treatOpinion }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处方">
          <template slot-scope="scope">
            <el-button type="text" @click="toogleExpand(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" width="100" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="confirmImporrt(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <SpecialInputBox
      :key="key1"
      :data="resultOptions"
      :preValue="discussResult.conclusion"
      ref="InputBox1"
      @result="cons($event)"
    ></SpecialInputBox>

    <SpecialInputBox
      :key="key2"
      :data="treatOptions"
      :preValue="discussResult.treatOpinion"
      ref="InputBox2"
      @result="cons2($event)"
    ></SpecialInputBox>
    <!-- <SpecialInputBox :data="resultOptions" ref="InputBox1" @result="cons($event)"></SpecialInputBox> -->
  </div>
</template>

<script>
import {
  getDiscussDetails,
  postDiscussOpinion,
  stopGroupConsultation,
  getConsultationConclusion,
  getConsultationResult,
  getConsultationOpinion,
} from "@api/groupconsultation/groupconsultation.js";
import PrescriptionEdit from "@components/common/PrescriptionEdit.vue";
import Prescription from "@components/common/Prescription.vue";
import After from "./components/After.vue";
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
    readAble: function () {
      return (
        this.readonly ||
        this.$store.state.videoConsultation.consultationState == "会诊已结束"
      );
    },
    consultationId: function () {
      return this.$store.state.videoConsultation.consultationId;
    },
    pid: function () {
      return this.$store.state.videoConsultation.currentPid;
    },
  },
  components: {
    PrescriptionEdit,
    Prescription,
    After,
    SpecialInputBox,
  },
  sockets: {
    newGroupConsultation_content() {
      let consultationId = this.consultationId;
      getDiscussDetails(consultationId).then((res) => {
        this.discussContent = res.discussion;
      });
    },
  },
  data() {
    return {
      key1: "1",
      key2: "10",
      // cResult: "asdfasdfa",
      historyOpinionImport: false,
      historyResultImport: false,
      historyOpinion: [],
      historyResult: [],
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
      resultOptions: [],
      treatOptions: [],
    };
  },
  methods: {
    inputBoxShow() {
      // this.key1 = this.key1 == 1 ? 2 : 1;
      this.$refs["InputBox1"].boxFlag = true;
    },
    inputBoxShow2() {
      // this.key2 = this.key2 == 10 ? 11 : 10;
      this.$refs["InputBox2"].boxFlag = true;
    },
    cons(data) {
      this.discussResult.conclusion = data;
    },
    cons2(data) {
      this.discussResult.treatOpinion = data;
    },
    toogleExpand(row) {
      let $table = this.$refs.historyTreatment;
      $table.toggleRowExpansion(row);
    },
    confirmImporrt(data) {
      this.discussResult.conclusion = data.conclusion;
      this.discussResult.treatOpinion = data.treatOpinion;
      this.discussResult.prescription = data.prescription;
      this.historyResultImport = false;
    },
    importHistoryOpinion(data) {
      this.discussionOpinion = data.opinion;
      this.historyOpinionImport = false;
    },
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
            let consultationId = this.$store.state.videoConsultation.consultationId;

            stopGroupConsultation(consultationId, this.discussResult).then((res) => {
              if (res) {
                this.$message({
                  type: "success",
                  message: "结束会诊成功",
                });
                // this.$router.push("/groupconsultation/todayconsultation");
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
        let consultationId = this.consultationId;
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
    let consultationId = this.consultationId;
    getDiscussDetails(consultationId).then((res) => {
      this.discussContent = res.discussion;
      this.isHolder = res.isHolder;
    });
    getConsultationConclusion(consultationId).then((res) => {
      this.discussResult = res;
    });
    getConsultationResult().then((res) => {
      console.log(res);
      this.historyResult = res;
    });
    getConsultationOpinion().then((res) => {
      this.historyOpinion = res;
    });
    getResultOptions().then((res) => {
      this.resultOptions = res;
    });
    getTreatmentOptions().then((res) => {
      this.treatOptions = res;
    });
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
