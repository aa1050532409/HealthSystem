<template>
  <div>
    <div class="filter">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <template slot="label">
            <span class="formLabel">账户：</span>
          </template>
          <el-input v-model="formInline.account" placeholder="请输入账户" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span class="formLabel">类型：</span>
          </template>
          <el-select v-model="formInline.type" placeholder="请选择" style="width:100px">
            <el-option label="银行卡" value="bank"></el-option>
            <el-option label="支付宝" value="alipay"></el-option>
            <el-option label="微信" value="wechat"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span class="formLabel">时间：</span>
          </template>
          <el-select v-model="formInline.recentRange" placeholder="请选择" style="width:300px">
            <el-option label="近一个月" value="2592000000"></el-option>
            <el-option label="近三个月" value="7776000000"></el-option>
            <el-option label="近六个月" value="15552000000"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <template slot="label">
            <span class="formLabel">时间：</span>
          </template>
          <el-date-picker
            v-model="formInline.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="reSet" class="btn">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="eltable">
      <el-table
        :data="showTable.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width: 100%"
        border
        :cell-style="{'text-align':'center'}"
        :header-cell-style="{background:'#EFF3F4',color:'#1c7e7c','text-align':'center',  'font-size': '18px','font-weight': 'bold',}"
      >
        <el-table-column label="序号" width="80" type="index"></el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            <span>{{ scope.row.date }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="账户">
          <template slot-scope="scope">
            <span>{{ scope.row.account }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="类别">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额">
          <template slot-scope="scope">
            <span>{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="monthDetails(scope.row)">明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="showTable.length"
        ></el-pagination>
      </div>
    </div>

    <!-- 明细对话框 -->
    <el-dialog title="收入" :visible.sync="detailVisible">
      <el-table :data="tableData2">
        <el-table-column label="序号" width="80" type="index"></el-table-column>
        <el-table-column property="date" label="日期" width="250"></el-table-column>
        <!-- <el-table-column property="account" label="单号"></el-table-column> -->
        <el-table-column property="description" label="描述"></el-table-column>
        <el-table-column property="amount" label="金额" width="200"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import { getFinanceInfo,getMonthDetails } from "../../api/user/user.js";
export default {
  name: "More",
  data() {
    return {
      formInline: {
        account: "",
        type: "",
        dateRange: "",
        recentRange: ""
      },
      tableData: [],
      tableData2: [],
      detailVisible: false,
      currentPage: 1,
      pageSize: 10
    };
  },
  methods: {
    reSet() {
      (this.formInline.account = ""),
        (this.formInline.type = ""),
        (this.formInline.recentRange = ""),
        (this.formInline.dateRange = "");
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    monthDetails(item) {
      getMonthDetails(item).then(res=>{
        this.tableData2=res;
        this.detailVisible=true
      })
    }
  },
  mounted() {
    getFinanceInfo().then(res => {
      this.tableData = res;
    });
  },
  computed: {
    showTable: function() {
      let result = [];
      let now = parseInt(new Date().getTime());
      console.log(now);
      let targetTime = 0;
      this.tableData.forEach(data => {
        targetTime = Date.parse(data.date);
        if (
          (!this.formInline.account ||
            data.account == this.formInline.account) &&
          (!this.formInline.type || data.type == this.formInline.type) &&
          (!this.formInline.recentRange ||
            targetTime > now - parseInt(this.formInline.recentRange))
        ) {
          result.push(data);
        }
        // if (
        //   (!this.formInline.account ||
        //     data.account == this.formInline.account) &&
        //   (!this.formInline.type || data.type == this.formInline.type)
        // ) {
        //   if (
        //     !this.formInline.dateRange ||
        //     (time > this.formInline.dateRange[0].getTime() &&
        //       time < this.formInline.dateRange[1].getTime())
        //   ) {
        //     result.push(data);
        //   }
        // }
      });
      return result;
    },
    monthTable: function() {
      let result = [];
      this.tableData.forEach(data => {
        targetTime = Date.parse(data.date);
      });
    }
  }
};
</script >

<style scoped lang="scss">
.title {
  font-size: 20px;
  font-weight: bold;
  color: #1c7e7c;
  margin-top: 20px;
}
.eltable {
  width: 90%;
  margin: 10px 5%;
}

.filter {
  margin: 20px 0px 0px 5%;
}
.page {
  float: right;
  margin: 10px 5% 10px 0px;
}
.formLabel {
  font-size: 18px;
  font-weight: bold;
  color: #1c7e7c;
  margin-left: 5px;
}
.btn {
  // background-color: #1c7e7c;
  margin-left: 30px;
}
</style>
