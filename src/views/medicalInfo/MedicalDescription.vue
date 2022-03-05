<template>
  <div>
    <div class="filter">
      <div class="search">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <template slot="label">
              <span class="searchLabel">用语名称：</span>
            </template>
            <el-input
              v-model="formInline.content"
              placeholder="请输入用品名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <span class="searchLabel">类别：</span>
            </template>
            <el-select v-model="formInline.type" placeholder="请选择物品类别" clearable>
              <el-option label="诊断用语" value="诊断用语"></el-option>
              <el-option label="治疗用语" value="治疗用语"></el-option>
              <!-- <el-option label="症状用语" value="症状用语"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="addDialogVisible = true">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="eltable">
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
        <el-table-column label="内容">
          <template slot-scope="scope">
            <span>{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column width="220" label="类别">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>

        <el-table-column width="220" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="deleteDes(scope.row)"
              >删除</el-button
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
    <el-dialog title="新增术语" :visible.sync="addDialogVisible" width="500px">
      <div class="addBox">
        <el-form
          :model="newDescription"
          :show-message="false"
          :rules="rules"
          label-width="80px"
          size="small"
        >
          <el-form-item prop="content" label="所属类别">
            <el-select
              style="width: 300px"
              v-model="newDescription.type"
              placeholder="请选择类别"
              clearable
            >
              <el-option label="诊断用语" value="诊断用语"></el-option>
              <el-option label="治疗用语" value="治疗用语"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="content" label="标准表述">
            <el-input style="width: 300px" v-model="newDescription.content"></el-input>
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
  getDescription,
  addDescription,
  delDescription,
} from "@api/medicalInfo/medicalInfo.js";
import { searchTool } from "@utils/common.js";
export default {
  data() {
    return {
      searchRule: {
        rule: "content",
        value: "",
      },
      formInline: {
        content: "",
        type: "",
      },
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      addDialogVisible: false,
      newDescription: {
        content: "",
        type: "",
      },
      rules: {
        content: [{ required: true }],
        type: [{ required: true }],
      },
    };
  },

  methods: {
    reSet() {
      this.formInline.type = "";
      this.formInline.content = "";
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
    addPatient() {
      let flag = false;
      this.tableData.forEach((item) => {
        if (
          item.type == this.newDescription.type &&
          item.content == this.newDescription.content
        ) {
          flag = true;
        }
      });
      if (!flag) {
        addDescription(this.newDescription).then((res) => {
          if (res) {
            this.$message.success("添加成功");
            this.addDialogVisible = false;
            getDescription().then((res) => {
              this.tableData = res;
            });
          } else {
            this.$message.error("添加失败");
          }
        });
      } else {
        this.$message.error("已存在相同内容，请勿重复添加");
      }
    },
    deleteDes(item) {
      this.$confirm(`您确定要删除-${item.content}-吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger",
      })
        .then(() => {
          delDescription(item).then((res) => {
            if (res) {
              this.$message.success("删除成功");
              getDescription().then((res) => {
                this.tableData = res;
              });
            } else {
              this.$message.error("删除失败，请稍后再试");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  computed: {
    showTable: function () {
      let rules = [
        {
          rule: "content",
          value: this.formInline.content || "",
        },
        {
          rule: "type",
          value: this.formInline.type || "",
        },
      ];
      let arr = searchTool(this.tableData, rules);
      return arr;
    },
  },
  created() {
    this.$store.commit("startLoading");
    getDescription().then((res) => {
      this.$store.commit("endLoading");
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
.search {
  // margin: 30px 0 0 5%;
  .searchLabel {
    font-size: 20px;
    font-weight: bold;
    color: #1c7e7c;
    margin-top: 20px;
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
