<template>
  <div class="global-container mt20">
    <div>
      <SearchTool
        :tableData="tableData"
        :rules="searchRule1"
        v-model="shpwTest"
        title="患者查询"
      >
      </SearchTool>
    </div>
    <div class="mt20">
      <el-table
        :data="
          shpwTest.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        style="width: 100%"
        :row-class-name="tableRowClassName"
        border
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{
          background: '#EFF3F4',
          color: '#1c7e7c',
          'text-align': 'center',
          'font-size': '16px',
        }"
      >
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.PatientName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号">
          <template slot-scope="scope">
            <span>{{ scope.row.PatientID }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <span>{{ scope.row.Gender || "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="年龄">
          <template slot-scope="scope">
            <span>{{ scope.row.Age || "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式">
          <template slot-scope="scope">
            <span>{{ scope.row.Phone || "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="家庭住址">
          <template slot-scope="scope">
            <span>{{ scope.row.Address || "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="patientDetails(scope.$index, scope.row)"
              >查看</el-button
            >
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
          :total="shpwTest.length"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="新增患者" :visible.sync="addDialogVisible" width="500px">
      <div class="addBox">
        <el-form
          :model="newPatient"
          :show-message="false"
          :rules="rules"
          label-width="80px"
          size="small"
        >
          <el-form-item prop="name" label="患者姓名">
            <el-input v-model="newPatient.name"></el-input>
          </el-form-item>
          <el-form-item prop="gender" label="患者性别">
            <el-radio-group v-model="newPatient.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="birthday" label="出生日期">
            <el-date-picker
              value-format="timestamp"
              v-model="newPatient.birthday"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="tel" label="联系方式">
            <el-input
              v-model="newPatient.tel"
              placeholder="默认为无"
            ></el-input>
          </el-form-item>
          <el-form-item prop="address" label="家庭住址">
            <el-input
              v-model="newPatient.address"
              placeholder="默认为无"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addPatient"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPatientList, addNewPatient } from "@api/patientInfo/patientinfo.js";
import { searchTool } from "@utils/common.js";
export default {
  data() {
    return {
      searchRule1: [
        {
          label: "姓名",
          value: "PatientName",
          type: "input",
        },
        {
          label: "账号",
          value: "PatientID",
          type: "input",
        },
        {
          label: "性别",
          value: "Gender",
          type: "selection",
        },
      ],
      searchRule: {
        rule: "name",
        value: "",
      },
      shpwTest: [],
      formInline: {
        name: "",
        account: "",
        gender: "",
      },
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      addDialogVisible: false,
      newPatient: {
        name: "",
        gender: "",
        birthday: "",
        tel: "",
        address: "",
      },
      rules: {
        name: [{ required: true, message: "请输入患者姓名", trigger: "blur" }],
        gender: [{ required: true }],
        birthday: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
      },
      newBingliVisible: false,
    };
  },
  methods: {
    bingliVisibeChange(type) {
      this.newBingliVisible = type;
    },
    reSet() {
      (this.formInline.name = ""),
        (this.formInline.account = ""),
        (this.formInline.gender = ""),
        (this.formInline.age = "");
    },
    patientDetails(index, row) {
      this.$store.commit(
        "patientInfo/currentPatientAccountChange",
        row.PatientID
      );
      this.$store.commit(
        "patientInfo/currentPatientNameChange",
        row.PatientName
      );
      this.$router.push("/patientinfo/patientdetails");
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.gender == "未处理" || row.age == "是") {
        return "highlight";
      } else {
        return "";
      }
    },
    searchRuleChange() {
      this.searchRule.value = "";
      this.reSet();
    },
    addPatient() {
      this.addDialogVisible = false;
      addNewPatient(this.newPatient).then((res) => {
        if (res) {
          this.$message.success("添加成功");
          getPatientList().then((res) => {
            this.tableData = res;
          });
        } else {
          this.$message.error("添加失败");
        }
      });
    },
  },

  mounted() {
    getPatientList().then((res) => {
      this.tableData = res;
    });
  },
};
</script>

<style scoped lang="scss">
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
  font-size: 16px;
  // font-weight: bold;
  color: #1c7e7c;
  margin-left: 5px;
}
.btn {
  background-color: #1c7e7c;
  margin-left: 30px;
}
// .addPatient {
//   width: 50px;
//   height: 50px;
//   float: left;
//   background-color: red;
// }
</style>


<style lang="scss">
.el-table .highlight {
  background: oldlace;
}
.searchRule {
  .el-input__inner {
    border: 0px;
    color: #1c7e7c;
    font-size: 16px;
  }
  :hover {
    background-color: #eff3f4;
  }
}
</style>