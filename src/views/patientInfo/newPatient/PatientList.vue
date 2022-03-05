<template>
  <div class="global-container mt20">
    <div>
      <SearchTool
        :tableData="tableData"
        :rules="searchRule1"
        v-model="showTable"
        title="患者查询"
      >
        <el-button @click="addDialogVisible = true" type="success" size="small"
          >添加患者</el-button
        >
      </SearchTool>
    </div>

    <div class="mt20">
      <el-table
        :data="showTable.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        style="width: 100%"
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
            <el-button @click="patientDetails(scope.$index, scope.row)" size="mini"
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
          :total="showTable.length"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="新增患者" :visible.sync="addDialogVisible" width="500px">
      <div class="addBox">
        <div v-if="possiblePatients.length > 0" class="similarBox">
          <div><span class="secondLabel">发现相似患者</span></div>
          <SimilarInfo
            class="mt5"
            v-for="patient in possiblePatients"
            @select="possiblePatientSelect(patient)"
            :key="patient.id"
            :patient="patient"
          ></SimilarInfo>
        </div>
        <el-form
          :model="newPatient"
          :show-message="false"
          :rules="rules"
          ref="newPatientForm"
          label-width="80px"
          size="small"
        >
          <el-form-item prop="name" label="患者姓名">
            <el-input @blur="searchPatient" v-model="newPatient.name"></el-input>
          </el-form-item>
          <el-form-item prop="gender" label="患者性别">
            <el-radio-group v-model="newPatient.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="IdCard" label="身份证号">
            <el-input
              @blur="searchPatient"
              v-model="newPatient.IdCard"
              placeholder="请输入身份证号码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="birthday" label="出生日期">
            <el-date-picker
              value-format="timestamp"
              v-model="newPatient.birthday"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="tel" label="联系方式">
            <el-input v-model="newPatient.tel" placeholder="默认为无"></el-input>
          </el-form-item>
          <el-form-item prop="address" label="家庭住址">
            <el-input v-model="newPatient.address" placeholder="默认为无"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addPatient">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAddPatientList,
  addNewPatient,
  possiblePatientSearch,
} from "@api/patientInfo/patientinfo.js";
import { searchTool } from "@utils/common.js";
import similarInfo from "./components/similarInfo.vue";
export default {
  data() {
    return {
      searchRule: {
        rule: "name",
        value: "",
      },
      formInline: {
        name: "",
        account: "",
        gender: "",
      },
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
      showTable: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      addDialogVisible: false,
      newPatient: {
        name: "",
        gender: "",
        birthday: "",
        tel: "",
        IdCard: "",
        address: "",
      },
      rules: {
        name: [{ required: true, message: "请输入患者姓名", trigger: "blur" }],
        gender: [{ required: true }],
        IdCard: [{ required: true }],
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
      possiblePatientsDialogVisible: false,
      possiblePatients: [],
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
      this.$store.commit("patientInfo/currentPatientAccountChange", row.PatientID);
      this.$store.commit("patientInfo/currentPatientNameChange", row.PatientName);
      this.$router.push("/patientinfo/newpatientdetails");
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },

    searchRuleChange() {
      this.searchRule.value = "";
      this.reSet();
    },
    searchPatient() {
      if (this.newPatient.name || this.newPatient.IdCard) {
        possiblePatientSearch(this.newPatient).then((res) => {
          this.possiblePatients = res.map((item) => {
            return {
              userId: item.PatientID,
              identity: item.IdCard,
              address: item.Address,
              age: item.Age,
              gender: item.Gender,
              name: item.PatientName,
              pic: item.Image,
              tel: item.Phone,
            };
          });
          console.log(res);

          this.possiblePatientsDialogVisible = true;
        });
      }
    },
    addPatient() {
      addNewPatient(this.newPatient).then((res) => {
        if (res) {
          this.$message.success("添加成功");
          this.addDialogVisible = false;
          getAddPatientList().then((res) => {
            this.tableData = res;
          });
        } else {
          this.$message.error("添加失败");
        }
      });
    },
    possiblePatientSelect(item) {
      this.$store.commit("patientInfo/currentPatientAccountChange", item.userId);
      this.$store.commit("patientInfo/currentPatientNameChange", item.name);
      this.$router.push("/patientinfo/newpatientdetails");
    },
  },
  components: {
    SimilarInfo: similarInfo,
  },

  mounted() {
    getAddPatientList().then((res) => {
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
  margin: 10px 2.5% 10px 0px;
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
.addBox {
  position: relative;
  .similarBox {
    width: 350px;
    border-radius: 5px;
    padding: 10px;
    background-color: #fff;
    right: -370px;
    top: -80px;
    position: absolute;
  }
}
.medicalCard {
  display: flex;
  min-height: 100px;
  background-color: rgb(236, 231, 231);
  overflow: hidden;
  margin-top: 10px;
  padding: 5px;
  border-radius: 3px;
  .pic {
    max-width: 95px;
    max-height: 95px;
    flex-shrink: 0;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    div {
      display: flex;
      flex-direction: row;
      width: 100%;
      .select {
        float: right;
      }
    }
  }
}
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
