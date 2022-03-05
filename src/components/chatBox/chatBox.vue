<template>
  <div class="allchatbox">
    <div v-if="isFold" @click="foldChatBox" class="fold">
      <span class="fold-text"><i class="el-icon-chat-dot-round"></i></span>
      <span v-show="newMsg" class="red-dot"></span>
    </div>
    <div v-drag v-else class="unfold">
      <div class="header">
        <div @click="foldChatBox" class="closeBtn">X</div>
        <div class="target" @click="foldChatBox">
          <el-select
            size="mini"
            style="width: 150px"
            v-model="$store.state.patientCommunication.currentSessionId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in targets"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="container">
        <div class="msgArea">
          <message></message>
        </div>
        <div v-if="!readonly" class="inputArea">
          <usertext :pid="pid"></usertext>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import message from "./components/message.vue";
import usertext from "./components/usertext.vue";
import { mapState } from "vuex";
import { getMessageRecord } from "@api/instantinfo/patientcommunication.js";

export default {
  props: {
    pid: {
      type: String,
      default: () => {
        return -1;
      },
    },
    readonly: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  sockets: {
    instantMsg(msg) {
      if (msg.pid == this.pid) {
        this.$store.commit("patientCommunication/receiveMessage", msg);
        if (this.isFold) {
          this.newMsg = true;
        }
      }
    },
  },
  components: {
    message,
    usertext,
  },
  watch: {
    currentSessionId: function (value) {
      this.$store.commit("patientCommunication/changeCurrentSessionId", value);
    },
  },
  computed: {
    ...mapState({
      sessions: (state) => state.patientCommunication.sessions,
    }),
    targets: function () {
      let arr = [];
      this.sessions.forEach((item) => {
        arr.push({
          label: item.user.name,
          value: item.id,
        });
      });
      // this.currentSessionId = arr[0].value;
      return arr;
    },
  },
  directives: {
    drag: {
      // 指令的定义
      bind: function (el) {
        console.log(el);
        let odiv = el; //获取当前元素
        el.onmousedown = (e) => {
          //算出鼠标相对元素的位置
          let disX = e.clientX - odiv.offsetLeft;
          let disY = e.clientY - odiv.offsetTop;
          let left = "";
          let top = "";
          document.onmousemove = (e) => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            left = e.clientX - disX;
            top = e.clientY - disY;
            //绑定元素位置到positionX和positionY上面
            //移动当前元素
            odiv.style.left = left + "px";
            odiv.style.top = top + "px";
          };
          document.onmouseup = (e) => {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      },
    },
  },
  data() {
    return {
      isFold: true,
      newMsg: false,
      // currentSessionId: this.$store.state.patientCommunication.currentSessionId,
    };
  },
  methods: {
    foldChatBox() {
      this.isFold = !this.isFold;
      if (this.isFold) {
        this.newMsg = false;
      }
    },
  },
  mounted() {
    getMessageRecord(this.pid + "");
  },
};
</script>

<style lang="scss" scoped>
.fold {
  // z-index: 10000;
  position: fixed;
  right: 5%;
  top: 50%;
  width: 40px;
  height: 50px;
  background-color: #b3d8ef;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  .fold-text {
    color: white;
    font-size: 25px;
    writing-mode: tb-rl;
    margin-top: 10px;
  }
  .red-dot {
    display: block;
    width: 10px;
    height: 10px;

    margin-top: 5px;
    background-color: red;
    border-radius: 5px;
    margin: auto;
  }
}
.unfold {
  // z-index: 10000;
  position: fixed;
  right: 5%;
  bottom: 0px;
  width: 350px;
  height: 400px;
  //   background-color: red;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.3s;
  box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.3);
  .header {
    width: 100%;
    height: 30px;
    background-color: #c6e2ff;
    .closeBtn {
      float: right;
      margin-top: 5px;
      margin-right: 5px;
      cursor: pointer;
    }
    .target {
      width: 100px;
    }
  }

  .container {
    width: 100%;
    height: 370px;
    .msgArea {
      height: 250px;
      width: 100%;
      background-color: #fff;
      overflow-y: auto;
    }
    .inputArea {
      height: 120px;
      background-color: pink;
      overflow-y: auto;
    }
  }
}
</style>
<style lang="scss">
.unfold {
  .header {
    .el-input__inner {
      border: 0px;
      background-color: #c6e2ff;
    }
  }
}
</style>
