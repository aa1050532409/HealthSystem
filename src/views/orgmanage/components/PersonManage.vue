<template>
  <div>
    <div class="filter">
      <span class="mainLabel mr20"> 姓名 </span>
      <el-input class="mr20" v-model="searchName" style="width: 200px"></el-input>
      <el-button @click="findMember" type="success">添加成员</el-button>
    </div>
    <div v-if="showList.length == 0" class="mt20">
      <span>暂无相关成员</span>
    </div>
    <div style="width: 100%" class="clearFloat mt20">
      <div v-for="item in showList.slice(0, showCount)" :key="item.id" class="card">
        <el-card :body-style="{ padding: '0px' }">
          <img v-if="item.Image" :src="item.Image" class="image" />
          <img v-else src="../../../assets/img/default/null.png" class="image" />
          <div style="padding: 14px">
            <span>{{ item.Name }}</span>
            <div class="bottom clearFloat">
              <el-button @click="removeMember(item.UserID)" type="text" class="button"
                >移除</el-button
              >
              <el-button
                @click="lookMember(item.UserID)"
                type="text"
                style="color: #67c23a"
                class="button mr5"
                >查看</el-button
              >
            </div>
          </div>
        </el-card>
      </div>
      <div
        v-if="showList.length > showCount"
        @click="showCount += 5"
        class="card"
        style="height: 300px; text-align: center; padding-top: 80px"
      >
        <i class="iconfont icon-more icon"></i>
      </div>
    </div>
    <div></div>
    <el-dialog title="用户信息" :visible.sync="newMember.diglogFlag" width="500px">
      <div class="addBox">
        <div class="img">
          <img
            v-if="tempPerson.Image"
            width="140px"
            height="150px"
            :src="tempPerson.Image"
            alt=""
          />
          <img
            v-else
            width="140px"
            height="150px"
            src="../../../assets/img/default/person.png"
            alt=""
          />
        </div>
        <div class="info">
          <div class="info-item">姓名：{{ tempPerson.Name || "暂无" }}</div>
          <el-divider></el-divider>
          <div class="info-item">账号：{{ tempPerson.UserID || "暂无" }}</div>
          <el-divider></el-divider>
          <div class="info-item">性别：{{ tempPerson.Gender || "暂无" }}</div>
          <el-divider></el-divider>
          <div class="info-item">
            简介：{{ tempPerson.ResearchExperienceInfo || "暂无" }}
          </div>
          <el-divider></el-divider>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addMember">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addPerson, delPerson } from "@api/manage/orgManage.js";
import { getUserInfo } from "@api/common/common.js";
export default {
  name: "manage",
  computed: {
    showList() {
      return this.showTable.filter((item) => {
        item.Name = item.Name || "暂无";
        return item.Name.includes(this.searchName);
      });
    },
  },
  props: {
    showTable: {
      default: () => {
        return [];
      },
    },
    type: "",
  },
  data() {
    return {
      searchName: "",
      showCount: 5,
      newMember: {
        diglogFlag: false,
        userId: "",
      },
      tempPerson: {
        Address: "四川省成都市郫都区",
        Birthday: "1986-01-03 00:00:00",
        Gender: "男",
        HospitalName: "成都市第三医院",
        Image:
          "https://182.92.234.28:3000/readload?url=chatfile/23a2b8e3ed8e6e9cb1dde7e58bac174c.jpg",
        Name: "专家2",
        Phone: "1234567897",
        ResearchExperienceInfo: "痴呆,脑出血脑出血脑出血脑出血脑出血脑出血脑出血",
        UserID: "101001",
      },
      dialogTypeFlag: "add", // "add"  "look"
    };
  },
  methods: {
    findMember() {
      this.dialogTypeFlag = "add";
      this.$prompt("请输入待添加用户的账号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /[a-zA-Z0-9]{6,12}/,
        inputErrorMessage: "账号为6-11位数字或字母",
      })
        .then(({ value }) => {
          let flag = this.showTable.some((item) => {
            return item.UserID == value;
          });
          if (!flag) {
            getUserInfo(value).then((res) => {
              if (res) {
                this.tempPerson = res;
                this.newMember.diglogFlag = true;
              } else {
                this.$message.error("查找不到对应用户");
              }
            });
          } else {
            this.$message.info("该成员已在当前机构中");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    lookMember(value) {
      this.dialogTypeFlag = "look";
      getUserInfo(value).then((res) => {
        if (res) {
          this.tempPerson = res;
          this.newMember.diglogFlag = true;
        } else {
          this.$message.error("查找不到对应用户");
        }
      });
    },
    addMember() {
      if (this.dialogTypeFlag == "add") {
        addPerson(this.$route.query.id, {
          UserID: this.tempPerson.UserID,
          role: this.type,
        }).then((res) => {
          if (res) {
            this.$message.success("添加成功");
            this.newMember.diglogFlag = false;
            this.refresh();
          } else {
            this.$message.error("添加失败");
          }
        });
      } else {
        this.newMember.diglogFlag = false;
      }
    },
    removeMember(UserID) {
      this.$confirm("此操作将成员移出团队，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delPerson(this.$route.query.id, {
            UserID: UserID,
            role: this.type,
          }).then((res) => {
            if (res) {
              this.$message.success("移除成功");
              this.refresh();
            } else {
              this.$message.error("移除失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    refresh() {
      this.$emit("refresh");
    },
  },
};
</script>

<style scoped lang="scss">
.card {
  margin-right: 10px;
  float: left;
  width: 23%;
  max-width: 200px;
  height: 300px;
  i {
    color: gray;
    font-size: 100px;
    cursor: pointer;
  }
}
.image {
  margin: 20px auto;
  width: 80%;
  height: 150px;
  display: block;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}
.addBox {
  width: 100%;
  height: 150px;
  overflow: hidden;
  display: flex;
  .img {
    width: 140px;
    height: 150px;
    overflow: hidden;
    flex-shrink: 0;
    border-radius: 10px;
  }
  .info {
    width: 100%;
    padding: 5px;
    .info-item {
      margin-bottom: 10px;
      margin-left: 10px;
    }
  }
}
</style>
<style>
.el-divider--horizontal {
  margin: 5px;
}
</style>
