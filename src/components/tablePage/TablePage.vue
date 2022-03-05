<template>
  <!-- 

  props: {
    tableData: {
      type: Array,
      default: () => {
        return [
          {
            PatientID: "13568479726",
            PatientName: "张某人",
            Gender: "男",
            Age: 0,
            Phone: null,
            Address: "西南交通大学",
          }
        ];
      },
    },
    headers: {
      type: Array,
      default: () => {
        return [
          { label: "姓名", value: "PatientName" ,sortfunc},
          { label: "账号", value: "PatientID" },
          { label: "性别", value: "Gender" },
          { label: "年龄", value: "Age", width: "100px" },
          { label: "联系方式", value: "Phone" },
          { label: "家庭住址", value: "Address" },
        ];
      },
    },
    widthOptions: {
      type: Object,
      default: () => {
        return {};
      },
    },
    btns: {
      type: Array,
      default: () => {
        return [
          {
            label: "查看",
            // type: "success",
            func: function (item, index) {
              console.log("查看", item);
            },
          },
          {
            label: "删除",
            type: "danger",
            func: function (item, index) {
              console.log("删除", item);
            },
          },
        ];
      },
    },
    tableRowClassName: {
      type: Function,
      default: () => {
        let func = function ({ row, rowIndex }) {
          // if (row.Gender == "男") {
          //   return "highlight";
          // } else {
          //   return "";
          // }
          return "";
        };
        return func;
      },
    },
  },
  btnControl: {
    type: Function,
    default: () => {
      let func = function (btn, row) {
        // if (row.Gender == "男") {
        //   return "highlight";
        // } else {
        //   return "";
        // }
        return true;
      };
      return func;
    },
  },
  
 -->
  <div class="tablepage">
    <div class="eltable">
      <el-table
        :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        style="width: 100%"
        border
        @sort-change="sortmethod"
        :row-class-name="tableRowClassName"
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{
          background: '#EFF3F4',
          color: '#1c7e7c',
          'text-align': 'center',
          'font-size': '16px',
        }"
      >
        <el-table-column
          v-for="item in headers"
          :prop="item.value"
          :key="item.id"
          :label="item.label"
          :width="item.width ? item.width : ''"
          :sortable="item.sortable ? 'custom' : false"
        >
          <template slot-scope="scope">
            <span>{{ scope.row[item.value] || "无" }}</span>
          </template>
        </el-table-column>

        <el-table-column width="200px" label="操作">
          <template slot-scope="scope">
            <template v-for="btn in btns">
              <el-button
                v-if="btnControl(btn, scope.row)"
                :key="btn.id"
                :type="btn.type || 'primary'"
                size="mini"
                @click="btn.func(scope.row, scope.index)"
                >{{ btn.label }}</el-button
              >
            </template>
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
          :total="tableData.length"
        ></el-pagination>
      </div>
      <div style="clear: both; height: 0"></div>
    </div>
  </div>
</template>

<script>
import { getPatientList, addNewPatient } from "@api/patientInfo/patientinfo.js";
import { searchTool } from "@utils/common.js";
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    headers: {
      type: Array,
      default: () => {
        return [];
      },
    },
    widthOptions: {
      type: Object,
      default: () => {
        return {};
      },
    },
    btns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tableRowClassName: {
      type: Function,
      default: () => {
        let func = function (data) {
          // console.log("xxxxxxxxxx", data);
          // if (row.Gender == "男") {
          //   return "highlight";
          // } else {
          //   return "";
          // }
          return "";
        };
        return func;
      },
    },
    btnControl: {
      type: Function,
      default: () => {
        let func = function (btn, row) {
          // if (row.Gender == "男") {
          //   return "highlight";
          // } else {
          //   return "";
          // }
          return true;
        };
        return func;
      },
    },
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    sortmethod(e) {
      if (e.order == "ascending") {
        this.tableData.sort((a, b) => {
          if (isNaN(parseInt(a[e.prop]))) {
            if (a[e.prop] < b[e.prop]) return -1;
            else return 1;
          } else {
            if (parseInt(a[e.prop]) < parseInt(b[e.prop])) return -1;
            else return 1;
          }
        });
      } else {
        this.tableData.sort((a, b) => {
          if (isNaN(parseInt(a[e.prop]))) {
            if (a[e.prop] < b[e.prop]) return 1;
            else return -1;
          } else {
            if (parseInt(a[e.prop]) < parseInt(b[e.prop])) return 1;
            else return -1;
          }
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.page {
  float: right;
  margin: 10px 5% 10px 0px;
}
</style>

<style lang="scss">
.el-table .highlight {
  background: oldlace;
}

.tablepage {
  .el-table td,
  .el-table th {
    padding: 8px 0;
  }
}
.el-table th > .cell {
  padding-left: 3px;
  padding-right: 3px;
}
</style>
