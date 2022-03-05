<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <template slot="label">
            <span class="searchLabel">医院名称：</span>
          </template>
          <el-input v-model="search.HospitalName" placeholder="请输入医院名称"></el-input>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span class="searchLabel">医院等级：</span>
          </template>
          <el-select v-model="search.HospitalLeve" placeholder="请选择医院等级">
            <el-option
              :label="item"
              :value="item"
              v-for="item in showList.classList"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="reset">重置</el-button>
          <!-- <el-button type="success" @click="addOrgDialogVisible=true">添加</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <el-divider type="primary" class="searchLine"></el-divider>
    <div class="content">
      <el-row v-for="item in showList.list" :key="item.key">
        <el-col :span="22" :offset="1">
          <div class="card leftLine">
            <el-col :span="5">
              <div class="pic">
                <img v-if="item.Image" :src="item.Image" alt />
                <img v-else src="../../assets/img/default/null.png" alt />
              </div>
            </el-col>
            <el-col :span="18">
              <div class="info">
                <span @click="details(item.HospitalID)">
                  <p class="name">{{ item.HospitalName }}</p>
                  <p>等级：{{ item.HospitalLeve }}</p>
                  <p>地址：{{ item.Address }}</p>
                  <p>简介：{{ item.HospitalIntroduction }}</p>
                </span>
              </div>
            </el-col>
          </div>
        </el-col>
        <el-divider type="primary" class="underline"></el-divider>
      </el-row>
    </div>
    <div class="footer">
      <el-pagination
        :hide-on-single-page="false"
        :total="showList.list.length"
        layout="prev, pager, next"
      ></el-pagination>
      <div class="clear"></div>
    </div>

    <!-- 添加医疗机构对话框 -->
    <el-dialog title="添加医疗机构" :visible.sync="addOrgDialogVisible" width="30%">
      <el-form label-position="left">
        <el-form-item label="医疗机构名称：">
          <el-input v-model="newOrganization.HospitalName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrgDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrgGroup">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrgInfo, addOrgInfo } from "@api/orgmanage/orgmanage.js";
export default {
  computed: {
    showList: function () {
      let list = [];
      let classList = [];
      this.listInfo.forEach((element) => {
        if (classList.indexOf(element.HospitalLeve) == -1) {
          classList.push(element.HospitalLeve);
        }
        if (
          (!this.search.HospitalName ||
            element.HospitalName == this.search.HospitalName) &&
          (!this.search.HospitalLeve || element.HospitalLeve == this.search.HospitalLeve)
        ) {
          list.push(element);
        }
      });
      return { list: list, classList: classList };
    },
  },
  data() {
    return {
      addOrgDialogVisible: false,
      search: {
        HospitalName: "",
        HospitalLeve: "",
      },
      listInfo: [],
      newOrganization: {
        HospitalName: "",
        HospitalLeve: "",
        HospitalType: "",
        HospitalIntroduction: "",
        ContactPhone: "",
        Address: "",
        Image: "",
      },
    };
  },

  methods: {
    reset() {
      this.search.HospitalName = "";
      this.search.HospitalLeve = "";
    },
    details(HospitalID) {
      localStorage.setItem("HospitalID", HospitalID);
      // this.$router.push("/medicalinfo/orgdetails");
      this.$router.push({
        path: "/medicalinfo/orgdetails",
        query: {
          id: HospitalID,
        },
      });
    },
    addOrgGroup() {
      addOrgInfo(this.newOrganization);
      this.addOrgDialogVisible = false;
    },
  },
  mounted() {
    this.$store.commit("startLoading");
    getOrgInfo().then((res) => {
      this.listInfo = res;
      this.$store.commit("endLoading");
    });
  },
};
</script>
<style scoped lang="scss">
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
