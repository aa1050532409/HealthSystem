<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <template slot="label">
            <span class="searchLabel">团队名称：</span>
          </template>
          <el-input v-model="search.ExpertName" placeholder="请输入团队名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="reset">重置</el-button>
          <!-- <el-button type="success" @click="addExpertGroupDialogVisible=true">添加</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <el-divider type="primary" class="searchLine"></el-divider>
    <manage :showTable="showTable" :details="details"></manage>
    <div class="footer">
      <el-pagination
        :hide-on-single-page="false"
        :total="showTable.length"
        layout="prev, pager, next"
      ></el-pagination>
      <div class="clear"></div>
    </div>
    <!-- 添加专家团队对话框 -->
    <el-dialog
      title="添加专家团队"
      :visible.sync="addExpertGroupDialogVisible"
      width="30%"
    >
      <el-form label-position="left">
        <el-form-item label="专家团队名称：">
          <el-input v-model="ExpertGroupDialog.ExpertName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addExpertGroupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addExpGroup">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getExpertGroupInfo, addExperGroupInfo } from "@api/expertmanage/expertmanage.js";
import manage from "./components/manage";
export default {
  name: "ExpManage",
  components: { manage },
  computed: {
    showTable: function () {
      let list = [];
      this.listInfo.forEach((element) => {
        if (
          !this.search.ExpertName ||
          element.ExpertName.includes(this.search.ExpertName)
        ) {
          list.push(element);
        }
      });
      return list;
    },
  },
  data() {
    return {
      search: {
        ExpertName: "",
      },
      listInfo: [
        {
          ExpertImage: "",
          ExpertName: "",
          ExpertSpecialty: "",
          ExpertIntroduction: "",
          ExpertID: "",
        },
      ],
      addExpertGroupDialogVisible: false,
      ExpertGroupDialog: {
        ExpertName: "",
      },
    };
  },
  methods: {
    reset() {
      this.search.ExpertName = "";
    },
    details(data) {
      console.log(data);
      // localStorage.setItem("ExpertID", data.ExpertID);
      // this.$router.push("/medicalinfo/expertdetails");
      this.$router.push({
        path: "/medicalinfo/expertdetails",
        query: {
          id: data.ExpertID,
        },
      });
    },
    addExpGroup() {},
  },
  mounted() {
    this.$store.commit("startLoading");
    getExpertGroupInfo().then((res) => {
      this.listInfo = res;
      this.$store.commit("endLoading");
    });
  },
};
</script>
<style scoped lang="scss">
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
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  .pic {
    width: 100%;
    height: 250px;
    margin-left: 10px;
    img {
      width: 100%;
      height: 250px;
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
</style>
