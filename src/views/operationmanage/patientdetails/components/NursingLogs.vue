<template>
  <!-- 护理日志 -->
  <div>
    <div class="search">
      <span class="formLabel">时间：</span>
      <el-date-picker
        v-model="pages.timeRange"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button
        size="small"
        @click="pages.newLogFlag = !pages.newLogFlag"
        type="success"
        style="float: right"
        >添加护理记录</el-button
      >
    </div>
    <div>
      <div v-if="pages.newLogFlag">
        <Jilubiao @commit="newLogCommit($event)"></Jilubiao>
      </div>
    </div>
    <div class="treatmentLog">
      <div id="treatlogbox">
        <el-table
          :cell-style="{ 'text-align': 'center' }"
          :header-cell-style="{
            background: '#EFF3F4',
            color: '#1c7e7c',
            'text-align': 'center',
            'font-weight': '500',
          }"
          :data="
            showTable.slice(
              (pages.currentPage - 1) * pages.pageSize,
              (pages.currentPage - 1) * pages.pageSize + pages.pageSize
            )
          "
          style="width: 100%"
        >
          <el-table-column fixed label="时间" width="100px">
            <template slot-scope="scope">
              <span>
                <p>
                  {{ scope.row.date.split(" ")[0] }}
                </p>
                <p>
                  {{ scope.row.date.split(" ")[1] }}
                </p>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="yishi"
            width="100px"
            label="意识"
          ></el-table-column>
          <el-table-column label="生命体征">
            <el-table-column
              prop="tizheng.T"
              width="50px"
              label="T(℃)"
            ></el-table-column>
            <el-table-column
              prop="tizheng.P"
              width="50px"
              label="P(次/分)"
            ></el-table-column>
            <el-table-column
              prop="tizheng.HR"
              width="50px"
              label="HR(次/分)"
            ></el-table-column>
            <el-table-column
              prop="tizheng.R"
              width="50px"
              label="R(次/分)"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            prop="SPO2"
            width="60px"
            label="SPO2(%)"
          ></el-table-column>
          <el-table-column label="入量">
            <el-table-column
              prop="ruliang.mingcheng"
              width="50px"
              label="名称"
            ></el-table-column>
            <el-table-column
              prop="ruliang.fenglei"
              width="50px"
              label="分类"
            ></el-table-column>
            <el-table-column
              prop="ruliang.tujing"
              width="50px"
              label="途径"
            ></el-table-column>
            <el-table-column
              prop="ruliang.liang"
              width="50px"
              label="量(ml)"
            ></el-table-column>
          </el-table-column>
          <el-table-column label="出量">
            <el-table-column
              prop="chuliang.mingcheng"
              width="50px"
              label="名称"
            ></el-table-column>
            <el-table-column
              prop="chuliang.liang"
              width="50px"
              label="量(ml)"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            prop="jili"
            width="80px"
            label="肌力"
          ></el-table-column>

          <el-table-column
            prop="fanshenwowei"
            width="50px"
            label="翻身卧位"
            :show-overflow-tooltip="false"
          ></el-table-column>
          <el-table-column
            prop="shifouyueshu"
            width="50px"
            label="是否约束"
          ></el-table-column>
          <el-table-column prop="yijian" label="护理意见"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="page clearfix">
      <div style="float: right; margin: 20px 0" class="block">
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
import Jilubiao from "./components/Jilubiao.vue";
export default {
  name: "NewTreatmentLog",
  props: {
    NursingLogs: {
      type: Array,
      default: () => {
        return [];
      },
    },
    options: {
      type: Object,
      default: () => {
        return {
          type: "newLog",
        };
      },
    },
  },
  computed: {
    showTable() {
      let arr = [];
      this.NursingLogs.forEach((element) => {
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
        timeRange: "",
        currentPage: 1,
        pageSize: 5,
        newLogFlag: false,
      },
      boxwidht: 0,
    };
  },
  components: {
    Jilubiao,
  },
  methods: {
    newLogCommit(data) {
      this.$emit("commit", data);
    },
    handleSizeChange(val) {
      this.pages.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pages.currentPage = val;
    },
  },
  mounted() {
    let el = document.getElementById("main");
    let boxwidht = el.clientWidth;
    document.getElementById("treatlogbox").style.maxWidth =
      parseInt((boxwidht - 240) * 0.9) + "px";
    window.onresize = () => {
      return (() => {
        let boxwidht = document.getElementById("main").clientWidth;
        document.getElementById("treatlogbox").style.maxWidth =
          parseInt((boxwidht - 240) * 0.9) + "px";
      })();
    };
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
  width: 100%;
  .box {
    position: fixed;
    right: 20px;
    top: 50%;
    width: 200px;
    height: 100px;
  }
}
.search {
  margin: 20px 0;
}
</style>
<style lang="scss" >
.treatmentLog {
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    z-index: 0;
  }
  .el-table__fixed-right::before,
  .el-table__fixed::before {
    z-index: 0;
  }
}
</style>