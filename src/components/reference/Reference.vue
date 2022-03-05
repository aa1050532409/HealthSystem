<template>
  <!-- 
参考信息

传入的值:

    readonly：  是否只读
    items:      ["入院记录"，"护理记录"，"评估记录"，"治疗记录"，"出院记录"，"随访记录"]
    pid:        病历pid
  -->

  <div class="reference">
    <el-tabs tab-position="left" v-model="editableTabsValue">
      <template v-for="item in tabComponents">
        <el-tab-pane
          :lazy="true"
          v-loading="loadingFlag"
          v-if="items.indexOf(item.title) != -1"
          :key="item.name"
          :name="item.name"
        >
          <template slot="label">
            <span class="title">{{ item.title }}</span>
          </template>
          <div class="content">
            <component
              @startLoading="loadingFlag = true"
              @endLoading="loadingFlag = false"
              :readonly="readonly"
              :pid="pid"
              :is="item.type"
            ></component>
          </div>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import DiagResult from "./components/DiagLogs/PatientDiagResult.vue";
import ApplyDetails from "./components/RuyuanLogs/ApplyDetails.vue";
import NursingLogs from "./components/NursingLogs/NursingLogs.vue";
import PingguLogs from "./components/PingguLogs/PingguLogs.vue";
import TreatLogs from "./components/TreatLogs/TreatLogs.vue";
import Chuyuan from "./components/ChuyuanLogs/Chuyuan.vue";
import SuifangLogs from "./components/SuifangLogs/SuifangLogs.vue";
export default {
  components: {
    DiagResult,
    ApplyDetails,
    NursingLogs,
    PingguLogs,
    TreatLogs,
    Chuyuan,
    SuifangLogs,
  },
  props: {
    //需要传入的
    readonly: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    items: {
      type: Array,
      default: () => {
        return ["就诊记录", "出院记录"];
      },
    },
    pid: {
      type: String,
      default: () => {
        return "456";
      },
    },
  },
  data() {
    return {
      loadingFlag: false,
      editableTabsValue: "1",
      tabComponents: [
        {
          title: "就诊记录",
          name: "1",
          type: "DiagResult",
        },
        {
          title: "入院记录",
          name: "2",
          type: "ApplyDetails",
        },
        {
          title: "护理记录",
          name: "3",
          type: "NursingLogs",
        },
        {
          title: "评估记录",
          name: "4",
          type: "PingguLogs",
        },
        {
          title: "治疗记录",
          name: "5",
          type: "TreatLogs",
        },
        {
          title: "出院记录",
          name: "6",
          type: "Chuyuan",
        },
        {
          title: "随访记录",
          name: "7",
          type: "SuifangLogs",
        },
      ],
      tabIndex: 1,
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.reference {
  margin-top: 30px;
  padding: 0 20px;
  .content {
    height: 450px;
    margin: 20px;
    overflow: auto;
  }
  .title {
    font-size: 20px;
    color: #1c7e7c;
    font-weight: bold;
  }
}
</style>

<style lang="scss">
.reference {
  .el-tabs__item .el-icon-close {
    font-size: 18px;
    margin-left: 10px;
  }
  .el-collapse {
    border-bottom: 0px solid white;
  }
  .el-tabs__item {
    padding: 0px 20px 0 0;
  }
  .el-tabs__active-bar {
    background-color: #1c7e7c;
  }
}
</style>