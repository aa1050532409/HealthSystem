<template>
  <div>
    <div class="testbtn">
      <el-button plain @click="open1">新转诊</el-button>
      <el-button plain @click="open2">新患者</el-button>
      <el-button plain @click="open3">新会诊</el-button>
      <el-button plain @click="open4">新消息</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: [0, 0, 0, 0],
      notifyObj: []
    };
  },
  methods: {
    open1() {
      if (this.notifyObj[0]) this.notifyObj[0].close();
      this.count[0]++;
      this.notifyObj[0] = this.$notify({
        title:"会诊信息",
        message: "您有" + this.count[0] + "条新会诊消息",
        position: "bottom-right",
        type: "success",
        duration: 0,
        iconClass:"iconfont icon-zhuanzhenguanli ",
        onClick: () => {
          this.notifyObj[0].close();
          this.$router.push('./recommend')
        }
      });
    },
    open2() {
      if (this.notifyObj[1]) this.notifyObj[1].close();
      this.count[1]++;
      this.notifyObj[1] = this.$notify({
        message: "您有" + this.count[1] + "个新患者",
        title:"新患者",
        position: "bottom-right",
        type: "warning",
        duration: 0,
        iconClass:"iconfont icon-huanzhezhenduan ",
        onClick: () => {
          this.notifyObj[1].close();
          this.$router.push('./recommend')
        }
      });
    },
    open3() {
      if (this.notifyObj[2]) this.notifyObj[2].close();
      this.count[2]++;
      this.notifyObj[2] = this.$notify({
        title:"会诊信息",
        message: "您有" + this.count[2] + "个新会诊",
        position: "bottom-right",
        duration: 0,
        iconClass:"iconfont icon-putonghuizhen",
        onClick: () => {
          this.notifyObj[2].close();
          this.$router.push('./recommend')
        }
      });
    },
    open4() {
      if (this.notifyObj[3]) this.notifyObj[3].close();
      this.count[3]++;
      this.notifyObj[3] = this.$notify({
        title: "消息",
        message: "您有" + this.count[3] + "条新消息",
        position: "bottom-right",
        duration: 0,
        iconClass:"iconfont icon-message ",
        onClick: () => {
          this.notifyObj[3].close();
          this.$router.push('./recommend')
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.testbtn {
  margin: 20px;
}


</style>