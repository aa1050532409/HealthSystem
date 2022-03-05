<template>
  <div class="timePlan">
    <el-collapse v-model="activeNames">
      <el-collapse-item ref="myplan" name="myplan">
        <template slot="title">
          <h3 class="mainLabel">我的日程</h3>
        </template>
        <div v-show="newTaskFlag" class="addBox">
          <el-form
            :show-message="false"
            ref="newTask"
            :rules="rules"
            size="small"
            :model="newTask"
          >
            <el-form-item>
              <h3 class="title">{{ newTask.id ? "日程修改" : "日程添加" }}</h3>
            </el-form-item>
            <el-form-item prop="taskDate" label="日期">
              <el-date-picker
                style="width: 100%"
                v-model="newTask.taskDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="timeRange" label="时间">
              <el-time-picker
                style="width: 100%"
                is-range
                v-model="newTask.timeRange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                format="HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-time-picker>
            </el-form-item>

            <el-form-item prop="content" label="内容">
              <el-input
                type="textarea"
                :maxlength="150"
                v-model="newTask.content"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <div class="btncontrol">
                <el-button @click="confirmNewTask" type="success">确定</el-button>
                <el-button @click="newTaskFlag = false">取消</el-button>
              </div>
            </el-form-item>
          </el-form>
          <div class="info">
            <h3>当日日程</h3>
            <div>
              <div v-for="item in planInfo" :key="item.id" class="hasTask">
                <div>
                  {{ item.text }}
                </div>
                <div style="text-align: right">
                  <el-link
                    @click="
                      confrimodify({ ...item, id: newTask.taskDate.id }, newTask.taskDate)
                    "
                    >选择</el-link
                  >
                  <!-- <i @click="delTask(item.id)" class="el-icon-close iconBtn"></i> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style="float: right">
            <el-button size="mini" @click="preWeek">上一周</el-button>
            <el-button type="primary" size="mini" @click="today">今日</el-button>
            <el-button size="mini" @click="nextWeek">下一周</el-button>
          </div>
          <div style="clear: both; height: 0"></div>
        </div>
        <el-calendar :range="showTimeRange">
          <template slot="dateCell" slot-scope="{ date, data }">
            <div>
              <div @dblclick="addNewTask(date)" class="content">
                <p>{{ data.day.split("-").slice(1).join("-") }}<br /></p>
                <div style="height: 450px; overflow: auto">
                  <div
                    class="hasTask"
                    v-for="item in dealMyDate(data.day)"
                    :key="item.id"
                  >
                    <div>
                      {{ item.text }}
                    </div>
                    <div style="text-align: right">
                      <i
                        @click="confrimodify(item, data.day)"
                        class="el-icon-edit iconBtn"
                      ></i>
                      <i @click="delTask(item.id)" class="el-icon-close iconBtn"></i>
                    </div>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </template>
        </el-calendar>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import {
  getMyplan,
  getMyMonthinplan,
  getMyShipinplan,
  modifyShipinplan,
  modifyDiagplan,
  addNewTimeTask,
  deleteTask,
  modifyTask,
} from "@api/user/user.js";
export default {
  name: "Home",
  methods: {
    preWeek() {
      this.currentMouth = new Date(this.currentMouth.getTime() - 1000 * 60 * 60 * 24 * 7);
    },
    nextWeek() {
      this.currentMouth = new Date(this.currentMouth.getTime() + 1000 * 60 * 60 * 24 * 7);
    },
    today() {
      this.currentMouth = new Date();
    },
    dealMyDate(v) {
      let len = this.tasks.length;
      let res = [];

      for (let i = 0; i < len; i++) {
        if (
          new Date(this.tasks[i].date + " 00:00:00").getTime() ==
          new Date(v + " 00:00:00").getTime()
        ) {
          res = this.tasks[i].items.map((item) => {
            return {
              text: `${item.startTime}-${item.endTime}：${item.content}`,
              id: item.TimePlanID,
            };
          });
          break;
        }
      }
      console.log(res, "qqqqqqqqqqqqq");
      return res;
    },
    confirmNewTask() {
      this.$refs["newTask"].validate((valid) => {
        if (valid) {
          let obj = {
            date: this.newTask.taskDate,
            startTime: this.newTask.timeRange[0],
            endTime: this.newTask.timeRange[1],
            content: this.newTask.content,
            id: this.newTask.id || "",
          };

          if (!obj.id) {
            addNewTimeTask(obj).then((res) => {
              if (res) {
                let str = this.$timeFormat(new Date(this.currentMouth)).format("yyyy-MM");
                this.getData(str);
                this.newTaskFlag = false;
                this.$message.success(obj.id ? "修改成功" : "添加成功");
              } else {
                this.$message.error(obj.id ? "修改失败" : "添加失败");
              }
            });
          } else {
            modifyTask(obj).then((res) => {
              if (res) {
                let str = this.$timeFormat(new Date(this.currentMouth)).format("yyyy-MM");
                this.getData(str);
                this.newTaskFlag = false;
                this.$message.success(obj.id ? "修改成功" : "添加成功");
              } else {
                this.$message.error(obj.id ? "修改失败" : "添加失败");
              }
            });
          }
        }
      });
    },
    addNewTask(date) {
      this.newTask = {
        taskDate: this.$timeFormat(date).format("yyyy-MM-DD"),
        timeRange: "",
        content: "",
        id: "",
      };
      this.newTaskFlag = true;
    },

    delTask(id) {
      this.$confirm("删除该日程后将不会被提醒, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteTask(id).then((res) => {
            if (res) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.tasks.forEach((date) => {
                date.items = date.items.filter((item) => {
                  if (item.TimePlanID == id) {
                    return false;
                  } else {
                    return true;
                  }
                });
              });
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    confrimodify(predata, day) {
      let stime = predata.text.split("：")[0].split("-")[0];
      let etime = predata.text.split("：")[0].split("-")[1];
      this.newTask = {
        taskDate: day,
        timeRange: [`${day} ${stime}:00`, `${day} ${etime}:00`],
        content: predata.text.split("：")[1],
        id: predata.id,
      };
      this.newTaskFlag = true;
      /* 
      
      */
    },

    getDiagPlan() {
      return getMyplan().then((res) => {
        this.diagPlan = res;
      });
    },
    getData(month) {
      let str = month || this.$timeFormat().format("yyyy-MM");
      return getMyMonthinplan(str).then((res) => {
        let arr = res.map((item) => {
          item.items.forEach((element) => {
            element.startTime = this.$timeFormat(new Date(element.startTime)).format(
              "HH:mm"
            );
            element.endTime = this.$timeFormat(new Date(element.endTime)).format("HH:mm");
          });
          return item;
        });
        this.tasks = arr;
      });
    },
    getShipinPlan() {
      return getMyShipinplan().then((res) => {
        console.log("object", res);
        this.shipingHuizhenPlan = res;
      });
    },
  },
  computed: {
    shipinPlan() {
      return JSON.stringify(this.shipingHuizhenPlan);
    },
    patientDiagPlan() {
      return JSON.stringify(this.diagPlan);
    },
    showTimeRange() {
      let now = this.currentMouth.getTime();
      let day = this.currentMouth.getDay() || 7;
      let startTime = now - 1000 * 60 * 60 * 24 * (day - 1);
      let endTime = now + 1000 * 60 * 60 * 24 * (7 - day);
      let s = this.$timeFormat(startTime).format("yyyy-MM-DD");
      let e = this.$timeFormat(endTime).format("yyyy-MM-DD");
      return [s, e];
    },
    planInfo() {
      return this.dealMyDate(this.newTask.taskDate);
    },
  },
  watch: {
    shipinPlan: function (value, old) {
      if (!JSON.parse(old).flag) {
        modifyShipinplan(JSON.parse(value)).then((res) => {
          if (res) {
            this.$message.success("修改成功");
          } else {
            this.$message.error("修改失败");
          }
        });
      }
    },
    patientDiagPlan: function (value, old) {
      if (!JSON.parse(old).flag) {
        modifyDiagplan(JSON.parse(value)).then((res) => {
          if (res) {
            this.$message.success("修改成功");
          } else {
            this.$message.error("修改失败");
          }
        });
      }
    },
    currentMouth: function (value, oldvalue) {
      let str = this.$timeFormat(new Date(value)).format("yyyy-MM");
      this.getData(str);
    },
  },
  data() {
    return {
      importTarget: "",
      importFlag: false,
      activeNames: ["myplan"],
      plan: [
        { label: "星期一", value: "one" },
        { label: "星期二", value: "two" },
        { label: "星期三", value: "three" },
        { label: "星期四", value: "four" },
        { label: "星期五", value: "five" },
        { label: "星期六", value: "six" },
        { label: "星期天", value: "seven" },
      ],
      currentMouth: new Date(),
      count: 0,
      newTaskFlag: false,
      taskSetFlag: false,
      newPlan: {
        type: "",
        day: "",
        timeRange: "",
        id: "",
      },
      diagPlan: {
        flag: true,
        one: [],
        two: [],
        three: [],
        four: [],
        five: [],
        six: [],
        seven: [],
      },
      shipingHuizhenPlan: {
        flag: true,
        one: [],
        two: [],
        three: [],
        four: [],
        five: [],
        six: [],
        seven: [],
      },
      newTask: {
        taskDate: "",
        timeRange: "",
        content: "",
        id: "",
      },
      rules: {
        taskDate: [{ required: true, trigger: "blur" }],
        timeRange: [{ required: true, trigger: "blur" }],
        content: [{ required: true, trigger: "blur" }],
      },
      tasks: [],
      settings: [
        {
          type: "", //视频会诊接诊
          startTime: "",
          endTime: "",
        },
      ],
    };
  },
  created() {
    this.$store.commit("startLoading");
    Promise.all([this.getData(), this.getShipinPlan(), this.getDiagPlan()]).then(
      (res) => {
        this.$store.commit("endLoading");
      }
    );
  },
};
</script>
<style lang="scss" scoped>
.addBox {
  width: 500px;
  margin: 0 auto 30px;
  padding: 20px;
  box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  position: relative;
  .info {
    position: absolute;
    display: block;
    right: -250px;
    top: 0;
    bottom: 0;
    width: 200px;
    overflow-y: auto;
  }
  h3 {
    text-align: center;
    color: $mainColor;
  }
  .btncontrol {
    text-align: center;
  }
}
.timePlan {
  font-size: $font_base;
  margin: 20px 5%;
}
.iconBtn {
  cursor: pointer;
  font-size: 16px;
  margin-left: 20px;
}
</style>
<style lang="scss">
.is-selected {
  color: #1989fa !important;
}
.content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: $font_extra_small;
  .el-backtop,
  .el-calendar-table td.is-today {
    color: black;
  }
}
.hasTask {
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 0 5px;

  background-color: $dangerColor;
}
.timePlan {
  .el-calendar-table .el-calendar-day {
    height: 500px;
  }
}
</style>
