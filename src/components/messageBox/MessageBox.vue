<template>
  <div class="msgbox">
    <p v-show="!this.$store.state.msg.messageList.length > 0">暂无新消息</p>
    <el-tree
      v-show="this.$store.state.msg.messageList.length > 0"
      :data="boxData"
      :props="defaultProps"
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>

<script>
import { blobDownload } from "../../http/request.js";

export default {
  name: "MessageBox",
  computed: {
    msgtest() {
      return this.$store.state.msg.messageList;
    },
    boxData() {
      let arr = this.$store.state.msg.messageList;
      let result = [];
      let map = new Map();
      arr.forEach((item) => {
        if (map.has(item.type)) {
          if (item.type === "instant") {
            map.get("instant").children.push({
              label: item.msg,
              value: item,
            });
          } else if (item.type === "remind") {
            let obj = {
              label: item.msg,
              value: item,
            };
            result.push(obj);
            map.set(item.type, obj);
          }
        } else {
          if (item.type === "instant") {
            let msg = {
              label: item.msg,
              value: item,
            };
            let obj = {
              label: "您有新的消息",
              children: [msg],
            };
            map.set(item.type, obj);
            result.push(obj);
          } else {
            let obj = {
              label: item.msg,
              value: item,
            };
            result.push(obj);
            map.set(item.type, obj);
          }
        }
      });
      return result;
    },
    taskList() {
      let taskList = this.$store.state.task.taskList;
      return taskList;
    },
    taskFlag() {
      let taskFlag = this.$store.state.task.taskFlag;
      return taskFlag;
    },
    myPlan() {
      return this.$store.state.personalInfo.myPlan;
    },
  },
  watch: {
    taskList: function (value) {
      this.$localforage.setItem("taskList", value);
      if (!this.taskFlag && value.length > 0) {
        this.download(this.taskList[0]);
      }
    },
  },
  data() {
    return {
      data: [
        {
          label: "您有新的患者",
          value: {
            type: "newPatient", //类型
            time: new Date().toLocaleTimeString("zh-CN", { hour12: false }), //时间
            msg: "您有新的消息", //提示类型
            router: "/instantinfo/message", //提示种类
          },
        },
        {
          label: "您有新的消息",
          children: [
            {
              label: "张三",
              value: {
                type: "instantMsg", //类型
                time: new Date().toLocaleTimeString("zh-CN", { hour12: false }), //时间
                msg: "您有新的消息", //提示类型
                router: "/instantinfo/message", //提示种类
              },
            },
            {
              label: "李四",
              value: {
                type: "instantMsg", //类型
                time: new Date().toLocaleTimeString("zh-CN", { hour12: false }), //时间
                msg: "您有新的消息", //提示类型
                router: "/instantinfo/message", //提示种类
              },
            },
          ],
        },
        {
          label: "您有新的住院患者",
          value: {
            type: "newPatient", //类型
            time: new Date().toLocaleTimeString("zh-CN", { hour12: false }), //时间
            msg: "您有新的消息", //提示类型
            router: "/instantinfo/message", //提示种类
          },
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
        value: "value",
      },
    };
  },
  methods: {
    download(url) {
      this.$store.commit("task/startLoading");
      let fileName = url.split("/").pop();
      blobDownload(url, { responseType: "blob" }).then((res) => {
        this.$localforage.setItem(fileName, res.data).then(() => {
          this.$store.commit("task/popTask");
          this.$store.commit("task/endLoading");
        });
      });
    },
    noticeRoute(route, index) {
      if (route) this.$router.push(route);
      this.$store.commit("delDessage", index);
    },
    handleNodeClick(data) {
      if (data.value) {
        if (data.value.pid) {
          this.$store.commit("operationManage/currentPidChange", data.value.pid);
          this.$store.commit("patientTreatment/currentPidChange", data.value.pid);
          this.$store.commit("followManage/currentPidChange", data.value.pid);
          this.$store.commit("patientDiag/patientDiag_PidChange", data.value.pid);
        }
        this.$router.push(data.value.router);
        this.$store.commit("msg/delDessage", {
          type: data.value.type,
          pid: data.value.pid,
        });
      }
    },
  },
  sockets: {
    relogin(val) {
      console.log(val);
    },
  },
  mounted() {
    this.$localforage.getItem("taskList").then((res) => {
      if (res) {
        this.$store.commit("task/updataTaskList", res);
      } else {
        this.$store.commit("task/updataTaskList", []);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.msgbox {
  width: 350px;
  height: 300px;
  background-color: #ededed;
  overflow: auto;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 10px 10px 20px 10px rgba(0, 0, 0, 0.5);
}
</style>
<style lang="scss">
.msgbox {
  .el-tree {
    background-color: transparent;
  }
  .el-tree-node__label {
    color: #d2691e;
    margin-top: 15px;
    font-size: 18px;
  }
  .el-tree-node__expand-icon {
    font-size: 18px;
  }
  .el-tree-node__content {
    display: inline-block;
    margin-top: 5px;
    width: 100%;
    :hover {
      background-color: transparent;
    }
  }
  .el-tree-node:focus > .el-tree-node__content {
    background-color: transparent;
  }
  .msgbox .el-tree-node__label {
    text-decoration: underline;
  }
}
</style>
