<template>
  <div>
    <div class="filter">
      <SearchTool :tableData="tableData" :rules="formInline" v-model="showTable">
        <el-button size="small" type="success" @click="addDialogVisible = true"
          >添加</el-button
        >
      </SearchTool>
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
        <el-table-column label="标准表述">
          <template slot-scope="scope">
            <span class="tableCell"
              >{{ scope.row.content }}
              <i
                v-if="scope.row.voice"
                @click="playVoice(scope.row.voice)"
                class="el-icon-video-play playIcon"
              ></i
            ></span>
          </template>
        </el-table-column>

        <el-table-column label="地方俚语">
          <template slot-scope="scope">
            <p class="tableCell" v-for="item in scope.row.liyu" :key="item.id">
              {{ `${item.label}:${item.value}` }}
              <i
                style="font-size: 20px"
                v-if="item.voice"
                @click="playVoice(item.voice)"
                class="el-icon-video-play playIcon"
              ></i>
            </p>
            <p v-if="scope.row.liyu.length == 0">暂无</p>
          </template>
        </el-table-column>

        <el-table-column label="描述图片">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.img"
              style="width: 100px; height: 100px"
              :src="scope.row.img"
              fit="contain"
              :preview-src-list="[scope.row.img]"
            ></el-image>
            <span v-else>暂无相关图片</span>
          </template>
        </el-table-column>
        <el-table-column width="220" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="modify(scope.row)"
              >修改</el-button
            >
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
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="showTable.length"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="新增描述" :visible.sync="addDialogVisible" width="550px">
      <newDescription @play="playVoice($event)" v-model="newStateDes"></newDescription>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addStateDes">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :destroy-on-close="true"
      title="修改描述"
      :visible.sync="modifyDialogVisible"
      width="550px"
    >
      <newDescription
        @play="playVoice($event)"
        v-model="currentState.state"
      ></newDescription>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="confirmModify">确 定</el-button>
      </span>
    </el-dialog>

    <audio ref="audio" v-show="true" src=""></audio>
  </div>
</template>

<script>
import {
  getDescription,
  addDescription,
  delDescription,
  getStateDescription,
  deleteStateDescription,
  modifyStateDescription,
  addStateDescription,
} from "@api/medicalInfo/medicalInfo.js";
import { searchTool } from "@utils/common.js";
import newDescription from "@views/medicalInfo/components/newDescription.vue";
export default {
  components: {
    newDescription,
  },
  data() {
    return {
      searchRule: {
        rule: "content",
        value: "",
      },
      formInline: [
        {
          label: "标准表述",
          value: "content",
          type: "input",
        },
      ],
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      addDialogVisible: false,
      modifyDialogVisible: false,
      audioSrc: "",
      showTable: [],
      currentState: {
        id: "",
        state: {},
      },
      newStateDes: {
        content: "",
        liyu: [],
        img: "",
        voice: "",
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
    addStateDes() {
      addStateDescription(this.newStateDes).then((res) => {
        if (res) {
          this.addDialogVisible = false;
          getStateDescription().then((res) => {
            this.tableData = res;
          });
        } else {
          this.$message.error("添加失败");
        }
      });
    },
    confirmModify() {
      this.currentState.state.id = this.currentState.id;
      modifyStateDescription(this.currentState.state).then((res) => {
        if (res) {
          getStateDescription().then((res) => {
            this.tableData = res;
          });
          this.modifyDialogVisible = false;
        } else {
          this.$message.error("修改失败");
        }
      });
    },
    deleteDes(item) {
      this.$confirm(`您确定要删除-${item.content}-吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger",
      })
        .then(() => {
          deleteStateDescription(item.id).then((res) => {
            if (res) {
              this.$message.success("删除成功");
              getStateDescription().then((res) => {
                this.tableData = res;
              });
            } else {
              this.$message.error("删除失败，请稍后再试");
            }
          });
        })
        .catch((err) => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      // .then(() => {
      //   deleteStateDescription(item.id).then((res) => {
      //     if (res) {
      //       this.$message.success("删除成功");
      //       getDescription().then((res) => {
      //         this.tableData = res;
      //       });
      //     } else {
      //       this.$message.error("删除失败，请稍后再试");
      //     }
      //   });
      // })
      // .catch(() => {
      //   this.$message({
      //     type: "info",
      //     message: "已取消删除",
      //   });
      // });
    },
    playVoice(voice) {
      this.$refs.audio.src = voice;
      this.$refs.audio.play();
    },
    modify(item) {
      this.currentState.state = item;
      this.currentState.id = item.id;
      this.modifyDialogVisible = true;
    },
  },
  computed: {
    // showTable: function () {
    //   let rules = [
    //     {
    //       rule: "content",
    //       value: this.formInline.content || "",
    //     },
    //   ];
    //   let arr = searchTool(this.tableData, rules);
    //   return this.tableData;
    // },
  },
  created() {
    this.$store.commit("startLoading");
    getStateDescription().then((res) => {
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
  .searchLabel {
    font-size: 20px;
    font-weight: bold;
    color: #1c7e7c;
    margin-top: 20px;
  }
}
.tableCell {
  line-height: 20px;
  .playIcon {
    font-size: 20px;
    cursor: pointer;
    color: $primaryColor;
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
<style>
.el-image-viewer__btn el-image-viewer__close {
  color: #ffffff;
}
</style>
