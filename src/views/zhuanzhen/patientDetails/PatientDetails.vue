<template>
  <div>
    <div class="pageContent">
      <el-collapse v-model="pages.collapse_activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <h3 class="title">基本信息</h3>
          </template>
          <PersonalInfo
            @addBingli="bingliVisibeChange(true)"
            :prsonalInfo="patientInfo.API_basicInfo"
          ></PersonalInfo>
          <ADDBINGLI
            @confirm="addNewBingli($event)"
            @hidden="bingliVisibeChange(false)"
            v-if="newBingliVisible"
          ></ADDBINGLI>
        </el-collapse-item>

        <el-collapse-item name="2">
          <template slot="title">
            <h3 class="title">历史病历</h3>
          </template>
          <div>
            <el-table
              :data="
                showTable.slice(
                  (pages.currentPage - 1) * pages.pageSize,
                  pages.currentPage * pages.pageSize
                )
              "
              style="width: 95%; margin: 0 auto"
              :header-cell-style="{
                background: '#EFF3F4',
                color: '#1c7e7c',
                'text-align': 'center',
                'font-size': '16px',
              }"
              :cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column width="150px" label="就诊时间">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.date.split(" ").shift() || "无" }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column width="150px" label="主诊专家">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.expert || "无" }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" label="诊断结论">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.diagResult || "无" }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                width="150px"
                prop="isInHospital"
                label="是否住院"
              >
              </el-table-column>
              <el-table-column width="150px" label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" @click="getDetails(scope.row)"
                    >查看</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div>
            <div class="page">
              <div class="block">
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
        </el-collapse-item>
        <el-collapse-item
          v-if="detailShowFlag"
          :key="pages.detailPid"
          ref="PidDetails"
          name="3"
        >
          <template slot="title">
            <h3 class="title">病历详情</h3>
          </template>

          <div :key="$store.state.patientInfo.currentPid">
            <Reference
              :pid="$store.state.patientInfo.currentPid"
              :items="items"
              :readonly="true"
            ></Reference>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import Prescription from "@components/common/Prescription.vue";
import chatBox from "@components/chatBox/chatBox.vue";
import Reference from "@components/reference/Reference.vue";

import PersonalInfo from "./components/PersonalInfo.vue";
import ADDBINGLI from "./components/ADDBINGLI.vue";

import {
  getPatientHistoryInfo,
  addBingli,
} from "@api/patientInfo/patientinfo.js";
import { getUserInfo } from "@api/common/common.js";
export default {
  components: {
    Reference,
    PersonalInfo,
    ADDBINGLI,
  },
  computed: {
    showTable: function () {
      this.tableData.forEach((item) => {
        if (item.diagResult && typeof item.diagResult != typeof "string") {
          item.diagResult = item.diagResult.join("，");
        }
      });
      return this.tableData;
    },
  },
  data() {
    return {
      detailShowFlag: false,
      items: [],
      tableData: [],
      pages: {
        detailPid: "",
        pageSize: 5,
        currentPage: 1,
        collapse_activeNames: ["1", "2", "3"],
      },
      patientInfo: {
        API_basicInfo: {},
      },
      newBingliVisible: false,
    };
  },
  methods: {
    bingliVisibeChange(type) {
      this.newBingliVisible = type;
    },
    handleSizeChange(val) {
      this.pages.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pages.currentPage = val;
    },
    getDetails(item) {
      if (this.pages.collapse_activeNames.indexOf("3") == -1)
        this.pages.collapse_activeNames.push("3");
      if (item.isInHospital == "是") {
        this.items = [
          "就诊记录",
          "护理记录",
          "评估记录",
          "入院记录",
          "治疗记录",
          "出院记录",
          "随访记录",
        ];
      } else {
        this.items = ["就诊记录"];
      }
      this.detailShowFlag = true;
      this.$store.commit("patientInfo/currentPidChange", item.pid);
    },
    addNewBingli(data) {
      let patient = {
        name: this.$store.state.patientInfo.currentPatientName,
        userID: this.$store.state.patientInfo.currentPatientAccount,
      };
      addBingli(data, patient).then((res) => {
        if (res) {
          this.$message.success("添加成功");
          this.newBingliVisible = false;
        } else {
          this.$message.error("添加失败");
        }
      });
    },
  },
  mounted() {
    let account = this.$store.state.patientInfo.currentPatientAccount;
    console.log("object");
    getPatientHistoryInfo(account).then((res) => {
      this.tableData = res.historyDiagInfo;
      this.patientInfo.API_basicInfo = {
        API_UserID: res.patientinfo.API_UserID,
        API_address: res.patientinfo.API_address,
        API_birthday: res.patientinfo.API_birthday,
        API_gender: res.patientinfo.API_gender,
        API_name: res.patientinfo.API_name,
        API_pic: res.patientinfo.API_pic,
        API_tel: res.patientinfo.API_tel,
      };
    });
  },
};
</script>

<style scoped lang="scss">
.pageContent {
  width: 95%;
  height: 100%;
  margin: 20px auto;
  .title {
    font-size: 20px;
    color: #1c7e7c;
  }
  .btn {
    float: right;
    margin-top: 50px;
    margin-bottom: 50px;
    margin-right: 50px;
    width: 120px;
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
.drag {
  width: 300px;
  position: absolute;
  top: 30%;
  left: calc(50% - 150px);
  span {
    z-index: 100;
    position: absolute;
    top: 0px;
    right: 10px;
    color: white;
    cursor: pointer;
  }
}
.container {
  width: 95%;
  margin: auto;
  .search {
    .formLabel {
      font-size: 20px;
      color: #1c7e7c;
    }
    .addbtn {
      margin-left: 20px;
      width: 90px;
    }
  }
  .page {
    width: 95%;
    .block {
      float: right;
    }
  }
  .pinggu {
    margin-right: 20px;
    font-size: 18px;
    .pinggubiao {
      transition: 1s;
    }
  }
}
.addprescription {
  margin-top: 20px;
  font-size: 18px;
}

.inputBox {
  position: fixed;
  left: 240px;
  bottom: 0px;
  width: calc(95% - 240px);
  z-index: 3000;
  transition: 0.5s;
}
.page {
  float: right;
  margin: 10px 5% 10px 0px;
}
.tips {
  margin-top: 20px;
  font-size: 18px;
}
</style>
