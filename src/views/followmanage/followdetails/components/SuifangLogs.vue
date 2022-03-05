<template>
  <!-- 评估日志 -->
  <div>
    <div class="search">
      <span class="formLabel">时间：</span>
      <el-date-picker
        v-model="pages.timeRange"
        type="daterange"
        size="small"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>

      <div style="float: right">
        <el-button
          @click="dialogVisible = !dialogVisible"
          size="small"
          style="margin-left: 30px"
          type="success"
          >添加随访记录</el-button
        >
      </div>
    </div>
    <div>
      <div v-if="dialogVisible">
        <SUIFANG
          @commit="commitSuifang($event)"
          @cancel="dialogVisible = false"
        ></SUIFANG>
      </div>
    </div>
    <div class="treatmentLog">
      <div>
        <div v-show="showTable && showTable.length == 0" class="tips">暂无随访记录</div>
        <div
          v-for="item in showTable.slice(
            (pages.currentPage - 1) * pages.pageSize,
            (pages.currentPage - 1) * pages.pageSize + pages.pageSize
          )"
          :key="item.id"
          class="card"
        >
          <div class="date">
            <p>
              {{ item.API_date.split(" ")[0] }}
            </p>
          </div>
          <div class="treatmentLog">
            <span>随访记录表</span>
            <el-link
              @click="lookSuifangLog(item)"
              type="success"
              style="margin-left: 20px; font-size: 18px"
              >{{ item.showFlag ? "收起" : "查看" }}</el-link
            >
            <div style="margin-bottom: 50px" v-if="item.showFlag">
              <SUIFANG :readonly="true" :preData="item.API_questionnaire"></SUIFANG>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page clearfix">
      <div class="block" style="float: right; margin: 20px 0px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pages.currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pages.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="showTable.length"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import questionnaire from "@components/questionnaires/mixin.js";
import { getFollowLogs, postFollowLog } from "@api/followmanage/followmanage.js";

export default {
  mixins: [questionnaire],
  name: "NewTreatmentLog",
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          type: "newLog",
        };
      },
    },
    pid: String,
  },
  computed: {
    showTable() {
      return this.PingguLogs.filter((item) => {
        if (this.pages.timeRange) {
          let time1 = new Date(this.pages.timeRange[0]).getTime();
          let time2 = new Date(this.pages.timeRange[1]).getTime();
          let time = new Date(item.API_date).getTime();
          if (time > time1 && time < time2) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
      // this.PingguLogs.forEach((element) => {
      //   if (this.pages.timeRange) {
      //     let time1 = new Date(this.pages.timeRange[0]).getTime();
      //     let time2 = new Date(this.pages.timeRange[1]).getTime();
      //     let time = new Date(element.date).getTime();
      //     if (time > time1 && time < time2) {
      //       arr.push(element);
      //     }
      //   } else {
      //     arr.push(element);
      //   }
      // });
      // return arr;
    },
  },
  data() {
    return {
      dialogVisible: false,
      pages: {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
          shortcuts: [
            {
              text: "三天后",
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 3);
                picker.$emit("pick", date);
              },
            },
            {
              text: "一周后",
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                picker.$emit("pick", date);
              },
            },
            {
              text: "半月后",
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 15);
                picker.$emit("pick", date);
              },
            },
          ],
        },
        timeRange: "",
        currentPage: 1,
        pageSize: 5,
        newLogFlag: false,
        questionnaire: {
          temptarget: "",
          target: "",
          questionnaireOptions: [
            { label: "吞咽功能评定", value: "TUNYAN" },
            { label: "跌倒风险评定", value: "DIEDAO" },
          ],
        },
      },
      nextPingguTime: "",
      PingguLogs: [],
    };
  },
  components: {},
  methods: {
    lookSuifangLog(item) {
      (item.showFlag = !item.showFlag), this.PingguLogs.splice(0, 0);
    },
    handleSizeChange(val) {
      this.pages.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pages.currentPage = val;
    },
    confirmQuestionnaireType() {
      this.dialogVisible = false;
      this.pages.questionnaire.target = this.pages.questionnaire.temptarget;
      this.pages.newLogFlag = true;
    },
    lookQuestionnaire(log) {
      if (log.show) {
        log.show = false;
      } else {
        log.show = true;
        switch (log.name) {
          case "吞咽功能评定":
            log.type = "TUNYAN";
            break;
          case "跌倒风险评定":
            log.type = "DIEDAO";
            break;
        }
      }
      this.PingguLogs.push({});
      this.PingguLogs.pop();
    },
    commitSuifang(data) {
      let pid = this.pid;
      postFollowLog(pid, data).then((res) => {
        if (res) {
          this.pages.newLogFlag = false;
          this.$message.success("提交成功");
          this.$router.push("/followmanage/followlist");
        } else {
          this.$message.error("提交失败");
        }
      });
    },
  },
  mounted() {
    let pid = this.pid;
    getFollowLogs(pid).then((res) => {
      this.PingguLogs = res;
    });
  },
};
</script>

<style lang="scss" scoped>
.newLog {
  .label {
    font-size: 16px;
    color: #1c7e7c;
  }
  .box {
    width: 100%;
    min-height: 60px;
    margin-top: 5px;
    border: 1px solid #e4e7ed;
    p {
      margin-top: 5px;
      font-size: 16px;
      text-indent: 20px;
    }
  }
}
.treatmentLog {
  .card {
    width: 95%;
    margin: auto;
    display: flex;
    margin-top: 20px;
    background-color: #eff3f4;
    border-radius: 5px;
    padding: 15px;
    .date {
      font-size: 18px;
      color: #1c7e7c;
    }
    .treatmentLog {
      margin-left: 30px;
      font-size: 18px;
    }
  }
}
.search {
  margin: 20px 0;
  .formLabel {
    font-size: 16px;
    color: #1c7e7c;
  }
}
</style>
