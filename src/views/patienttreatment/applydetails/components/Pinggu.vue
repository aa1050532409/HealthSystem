<template>
  <div>
    <div v-for="(item, index) in pinggu" :key="item.id" class="pinggu">
      <div class="pingguTitle">
        <span style="margin-right:40px"
          >{{ item.name }}{{ "(" + item.state + ")" }}</span
        >
        <el-link
          @click="jinxingpinggu(item, index)"
          :type="item.state == '已完成' ? 'primary' : 'success'"
          >{{ item.state == "已完成" ? "查看" : "进行评估" }}</el-link
        >
      </div>
      <div v-show="item.isOpen" class="pinggubiao">
        <div style="margin:20px 0;">
          <components
            @cancel="pingguCancel(item, index)"
            :preData="item.data"
            :readonly="true"
            :is="item.type"
          ></components>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getApplyDetails } from "@api/patienttreatment/patienttreatment.js";
import questionnaire from "../../questionnaires/mixin.js";

export default {
  mixins: [questionnaire],
  data() {
    return {
      pinggu: []
    };
  },
  methods: {
    jinxingpinggu(item, index) {
      let obj = JSON.parse(JSON.stringify(item));
      if (item.isOpen) {
        obj.isOpen = false;
      } else {
        obj.isOpen = true;
      }
      this.pinggu.splice(index, 1, obj);
      this.pinggu.splice(index, 1, obj);
    },
    pingguCancel(item, index) {
      let obj = JSON.parse(JSON.stringify(item));
      if (item.isOpen) {
        obj.isOpen = false;
      } else {
        obj.isOpen = false;
      }
      this.pinggu.splice(index, 1, obj);
    }
  },
  mounted() {
    let pid = this.$store.state.patientTreatment.currentPid;
    getApplyDetails(pid).then(res => {
      this.pinggu = res.API_questionnaire;
      this.pinggu.forEach(item => {
        item.state = "已完成";
        switch (item.name) {
          case "吞咽功能评定":
            item.type = "TUNYAN";
            break;
          case "跌倒风险评定":
            item.type = "DIEDAO";
            break;
        }
      });
    });
  }
};
</script>

<style lang="scss" scoped>
.pinggu {
  margin-right: 20px;
  font-size: 18px;
  .pingguTitle {
    margin: 20px 20px;
  }
  .pinggubiao {
    transition: 1s;
  }
}
.quesComponent {
  margin: 20px 0px;
}
</style>