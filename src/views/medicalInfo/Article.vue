<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <template slot="label">
            <span class="searchLabel">用品名称：</span>
          </template>
          <el-input
            v-model="search.name"
            placeholder="请输入用品名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span class="searchLabel">物品类别：</span>
          </template>
          <el-select
            v-model="search.classfication"
            placeholder="请选择物品类别"
            clearable
          >
            <el-option label="医疗药品" value="医疗药品"></el-option>
            <el-option label="医疗器械" value="医疗器械"></el-option>
            <el-option label="保健品" value="保健品"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="addDialogVisible = true"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="eltable">
      <el-table
        :data="listInfo"
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
        <el-table-column label="名称" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类">
          <template slot-scope="scope">
            <span>{{ scope.row.classfication }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格">
          <template slot-scope="scope">
            <span>{{ scope.row.specification }}</span>
          </template>
        </el-table-column>
        <el-table-column label="厂商">
          <template slot-scope="scope">
            <span>{{ scope.row.manufacturer }}</span>
          </template>
        </el-table-column>
        <el-table-column label="批准文号">
          <template slot-scope="scope">
            <p>{{ scope.row.approvalNumber }}</p>
          </template>
        </el-table-column>
        <el-table-column label="标准码">
          <template slot-scope="scope">
            <p>{{ scope.row.standardCode }}</p>
          </template>
        </el-table-column>
        <el-table-column width="200px" label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="details(scope.row)">查看</el-button>
            <el-button type="danger" size="small" @click="deleteDrug(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="page">
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="search.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="20"
          layout="total, prev, pager, next, jumper"
          :total="maxNum"
        ></el-pagination>
      </div>
    </div>

    <!-- 医疗用品详情对话框 -->
    <el-dialog title="药品详情" :visible.sync="dialogVisible" width="700px">
      <div class="dialog">
        <div class="basicInfo">
          <div class="pic">
            <img v-if="articleDetail.img" :src="articleDetail.img" alt />
            <img v-else src="../../assets/img/default/null.png" alt />
          </div>
          <div class="info">
            <span>
              <p>
                <span class="lable">产品名称：</span>
                {{ articleDetail.name || "无" }}
              </p>
              <p>
                <span class="lable">产品类型：</span>
                {{ articleDetail.type || "无" }}
              </p>

              <p>
                {{
                  `剂型：${articleDetail.type || "无"}、规格：${
                    articleDetail.specification || "无"
                  }、厂商：${articleDetail.manufacturer || "无"}、批准文号：${
                    articleDetail.approvalNumber || "无"
                  }、药品本位码：${articleDetail.standardCode || "无"}`
                }}
              </p>
            </span>
          </div>
        </div>
        <div class="introduction">
          <span>
            <p>
              <span class="lable">产品用途：</span>
              {{ articleDetail.use || "无" }}
            </p>
            <p>
              <span class="lable">产品说明：</span>
              {{ articleDetail.introduction || "无" }}
            </p>
          </span>
        </div>
      </div>
    </el-dialog>

    <!-- 添加药品对话框 -->
    <el-dialog title="添加药品" :visible.sync="addDialogVisible" width="700px">
      <div class="dialog">
        <div class="basicInfo">
          <div class="pic">
            <el-upload
              class="avatar-uploader"
              action="/api/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :headers="uploadToken"
            >
              <img
                style="width: 190px; height: 190px"
                v-if="newDrug.img"
                :src="newDrug.img"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="info">
            <el-form
              ref="addForm"
              :show-message="false"
              :rules="rules"
              label-width="100px"
              :inline="true"
              size="small"
              :model="newDrug"
            >
              <el-form-item prop="name" style="width: 200px" label="产品名称">
                <el-input
                  style="width: 100px"
                  v-model="newDrug.name"
                ></el-input>
              </el-form-item>
              <el-form-item
                prop="classfication"
                style="width: 200px"
                label="产品类型"
              >
                <el-select
                  clearable
                  style="width: 100px"
                  v-model="newDrug.classfication"
                >
                  <el-option label="医疗药品" value="医疗药品"></el-option>
                  <el-option label="医疗器械" value="医疗器械"></el-option>
                  <el-option label="保健品" value="保健品"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                prop="specification"
                style="width: 200px"
                label="规格"
              >
                <el-input
                  style="width: 100px"
                  v-model="newDrug.specification"
                ></el-input>
              </el-form-item>
              <el-form-item prop="type" style="width: 200px" label="剂型">
                <el-input
                  style="width: 100px"
                  v-model="newDrug.type"
                ></el-input>
              </el-form-item>
              <el-form-item
                prop="manufacturer"
                style="width: 200px"
                label="厂商"
              >
                <el-input
                  style="width: 100px"
                  v-model="newDrug.manufacturer"
                ></el-input>
              </el-form-item>
              <el-form-item
                prop="approvalNumber"
                style="width: 200px"
                label="批准文号"
              >
                <el-input
                  style="width: 100px"
                  v-model="newDrug.approvalNumber"
                ></el-input>
              </el-form-item>
              <el-form-item
                prop="standardCode"
                style="width: 200px"
                label="药品本位码"
              >
                <el-input
                  style="width: 100px"
                  v-model="newDrug.standardCode"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="introduction">
          <div>
            <span class="lable">产品用途：</span>
            <el-input
              :rows="3"
              v-model="newDrug.use"
              type="textarea"
            ></el-input>
          </div>

          <div>
            <span class="lable">产品说明：</span>
            <el-input
              :rows="3"
              v-model="newDrug.introduction"
              type="textarea"
            ></el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer clearFloat">
          <el-button
            size="small"
            style="margin-top: 20px; float: right"
            type="primary"
            @click="confirmAddDrug"
            >确 定</el-button
          >
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDrugsInfo,
  addDrug,
  delDrug,
} from "@api/medicalInfo/medicalInfo.js";
export default {
  computed: {
    ruleChange() {
      return (
        this.search.name +
        this.search.classfication +
        this.search.approvalNumber +
        this.search.standardCode
      );
    },
  },
  watch: {
    ruleChange: function (value) {
      this.search.page = 1;
      getDrugsInfo(this.search).then((res) => {
        this.listInfo = res.durgsInfo;
        this.maxNum = res.totalNumber;
      });
    },
  },
  data() {
    return {
      uploadToken: {
        Authorization: localStorage.getItem("token"),
      },
      imageUrl: "",
      addDialogVisible: false,
      dialogVisible: false,
      search: {
        name: "", //名称
        classfication: "",
        approvalNumber: "",
        standardCode: "",
        page: 1, //第几页
      },
      listInfo: [],
      articleDetail: {
        img: "",
        name: "",
        classfication: "",
        type: "",
        specification: "",
        manufacturer: "",
        approvalNumber: "",
        standardCode: "",
        use: "",
        introduction: "",
      },
      newDrug: {
        img: "",
        name: "",
        classfication: "",
        type: "",
        specification: "",
        manufacturer: "",
        approvalNumber: "",
        standardCode: "",
        use: "",
        introduction: "",
      },
      currentPage: 1,
      pageSize: 10,
      maxNum: 0,
      rules: {
        name: [{ required: true, trigger: "blur" }],
        classfication: [{ required: true, trigger: "blur" }],
        specification: [{ required: true, trigger: "blur" }],
        manufacturer: [{ required: true, trigger: "blur" }],
        approvalNumber: [{ required: true, trigger: "blur" }],
        standardCode: [{ required: true, trigger: "blur" }],
      },
    };
  },

  methods: {
    details(item) {
      this.articleDetail = item;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file) {
      this.newDrug.img = res.readloadurl;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    confirmAddDrug() {
      this.$refs["addForm"].validate((valid) => {
        if (valid && this.newDrug.img) {
          addDrug(this.newDrug).then((res) => {
            if (res) {
              this.addDialogVisible = false;
              this.$message.success("添加成功");
            } else {
              this.$message.error("添加失败，稍后再试");
            }
          });
        } else {
          this.$message("请完善物品信息");
        }
      });
    },
    handleCurrentChange(val) {
      this.search.page = val;
      getDrugsInfo(this.search).then((res) => {
        this.listInfo = res.durgsInfo;
        this.maxNum = res.totalNumber;
      });
    },
    deleteDrug(item) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delDrug(item).then((res) => {
            if (res) {
              this.$message.success("删除成功");
              this.listInfo.forEach((drug, index) => {
                drug.drugsID == item.drugsID;
                this.listInfo.splice(index, 1);
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
  created() {
    this.$store.commit("startLoading");
    getDrugsInfo(this.search).then((res) => {
      this.$store.commit("endLoading");
      this.listInfo = res.durgsInfo;
      this.maxNum = res.totalNumber;
    });
  },
};
</script>
<style scoped lang="scss">
.dialog {
  width: 100%;
  .basicInfo {
    height: 200px;
    padding-left: 20px;
    display: flex;
    .pic {
      width: 200px;
      flex-shrink: 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      padding-left: 20px;
      width: 100%;
      p {
        font-size: 18px;
        margin-bottom: 10px;
        .lable {
          font-weight: bolder;
          color: #1c7e7c;
        }
      }
    }
  }
  .introduction {
    padding-left: 20px;
    padding-top: 20px;
    width: 100%;

    .lable {
      font-size: 18px;
      font-weight: bolder;
      color: #1c7e7c;
    }
  }
}
.eltable {
  width: 90%;
  margin: 10px 5%;
}

.content {
  width: 95%;
  max-height: 700px;
  overflow: auto;
  margin: auto;
}

.search {
  margin: 30px 0 0 5%;
  .searchLabel {
    font-size: 20px;
    font-weight: bold;
    color: #1c7e7c;
    margin-top: 20px;
  }
}
.card {
  width: 90%;
  height: 150px;
  overflow: hidden;
  display: flex;
  margin: auto;
  .pic {
    width: 150px;
    height: 150px;
    margin-left: 10px;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    margin-left: 30px;
    span {
      .name {
        font-size: 20px;
        font-weight: bold;
        color: #1c7e7c;
      }
      p {
        margin-top: 15px;
        font-size: 18px;
      }
    }
    :hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
.leftLine {
  border-left: 10px solid #eff3f4;
  border-top: 10px solid white;
  border-bottom: 10px solid white;
}
.underline {
  width: 90%;
  margin: 20px auto;
  clear: both;
}
.searchLine {
  width: 95%;
  margin: 5px auto 20px;
}
.footer {
  float: right;
  margin-right: 5%;
  .clear {
    height: 30px;
    clear: both;
  }
}
.page {
  float: right;
  margin: 10px 5% 10px 0px;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 190px;
  height: 190px;
  line-height: 190px;
  text-align: center;
}
.avatar {
  width: 190px;
  height: 190px;
  display: block;
}
</style>