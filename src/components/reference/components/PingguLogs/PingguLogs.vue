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
      <el-button
        v-if="!readonly"
        @click="dialogVisible = true"
        size="small"
        style="float: right; margin-right: 30px"
        type="success"
        >进行评估</el-button
      >
    </div>

    <div>
      <div v-if="pages.newLogFlag">
        <component
          :newAdd="true"
          @commit="commitNewPinggu($event)"
          @cancel="pages.newLogFlag = false"
          :is="pages.questionnaire.target"
        ></component>
      </div>
    </div>
    <div class="treatmentLog">
      <div>
        <div v-show="showTable && showTable.length == 0" class="tips">
          暂无评估记录
        </div>
        <div
          v-for="(item, index) in showTable.slice(
            (pages.currentPage - 1) * pages.pageSize,
            (pages.currentPage - 1) * pages.pageSize + pages.pageSize
          )"
          :key="item.id"
          class="card"
        >
          <div class="date">
            <p>{{ new Date(item.API_date).toLocaleDateString() }}</p>
          </div>
          <div class="treatmentLog">
            <div v-for="log in item.API_questionnaire" :key="log.id">
              {{ log.name }}
              <el-link
                @click="lookQuestionnaire(log, index)"
                style="font-size: 18px; margin-left: 30px"
                type="success"
                >{{ log.show ? "收起" : "查看" }}</el-link
              >
              <div v-if="log.show == true">
                <component
                  :preData="log.data"
                  :readonly="true"
                  :is="log.type"
                ></component>
              </div>
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

    <el-dialog
      title="请选择量表类型"
      :modal="false"
      :visible.sync="dialogVisible"
      width="300px"
    >
      <el-select v-model="pages.questionnaire.temptarget" placeholder="请选择">
        <el-option
          v-for="item in pages.questionnaire.questionnaireOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="confirmQuestionnaireType"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import questionnaire from "@components/questionnaires/mixin.js";
import { getPingguLogs } from "@api/operationmanage/operationmanage.js";
import { postPingguLogs } from "@api/patientInfo/patientinfo.js";

export default {
  mixins: [questionnaire],
  name: "PingguLogs",
  props: {
    pid: {
      type: String,
      default: () => {
        return "";
      },
    },
    readonly: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  computed: {
    showTable() {
      let arr = [];
      this.PingguLogs.forEach((element) => {
        if (this.pages.timeRange) {
          let time1 = new Date(this.pages.timeRange[0]).getTime();
          let time2 = new Date(this.pages.timeRange[1]).getTime();
          let time = new Date(element.date).getTime();
          if (time > time1 && time < time2) {
            arr.push(element);
          }
        } else {
          arr.push(element);
        }
      });

      return arr;
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
            { label: "Barthle指数评定", value: "HUXI" },
          ],
        },
      },
      PingguLogs: [
        {
          API_questionnaire: [
            {
              data: {
                asuidj: 123,

                abvc: "123",
              },
              name: "跌倒风险评定",
            },
          ],
          API_date: "2020-09-17",
        },
      ],
    };
  },
  components: {},
  methods: {
    commitNewPinggu(data) {
      let pid = this.pid;
      postPingguLogs(pid, data).then((res) => {
        if (res) {
          this.pages.newLogFlag = false;
          this.$message.success("提交成功");
          getPingguLogs(pid).then((res) => {
            this.PingguLogs = res;
          });
        }
      });
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
          case "Barthle指数评定":
            log.type = "HUXI";
            break;
        }
      }
      this.PingguLogs.splice(0, 0);
    },
  },
  mounted() {
    let pid = this.pid;
    this.$emit("startLoading");
    getPingguLogs(pid).then((res) => {
      this.$emit("endLoading");
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