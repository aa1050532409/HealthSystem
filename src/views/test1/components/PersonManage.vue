<template>
  <div>
    <div class="filter">
      <span class="mainLabel mr20"> 姓名 </span>
      <el-input class="mr20" v-model="searchName" style="width: 200px"></el-input>
      <el-button @click="newMember.diglogFlag = true" type="success">添加成员</el-button>
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
    <el-dialog title="新增成员" :visible.sync="newMember.diglogFlag" width="500px">
      <div class="addBox">
        <el-form label-width="80px" size="small">
          <el-form-item label="用户账号">
            <el-input v-model="newMember.userId" placeholder="默认为无"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addMember">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addExpertGroupPersonInfo,
  delExpertGroupPersonInfo,
} from "@api/manage/expertManage.js";
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
  },
  data() {
    return {
      searchName: "",
      showCount: 5,
      newMember: {
        diglogFlag: false,
        userId: "",
      },
    };
  },
  methods: {
    addMember() {
      if (!this.newMember.userId) {
        this.$message.error("请输入用户id");
      } else {
        addExpertGroupPersonInfo(this.$route.query.id, {
          UserID: this.newMember.userId,
          role: "专家",
        }).then((res) => {
          if (res) {
            this.$message.success("添加成功");
            this.newMember.diglogFlag = false;
            this.refresh();
          } else {
            this.$message.error("添加失败");
          }
        });
      }
    },
    removeMember(UserID) {
      this.$confirm("此操作将成员移出团队，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delExpertGroupPersonInfo(this.$route.query.id, {
            UserID: UserID,
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
</style>
