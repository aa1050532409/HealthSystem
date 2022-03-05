<template>
  <div class="teaminfo">
    <div class="pic">
      <el-upload
        class="avatar-uploader"
        action="/api/upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :headers="uploadToken"
      >
        <img
          style="width: 100%; height: 100%"
          v-if="details.Image"
          :src="details.Image"
          class="avatar"
        />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <div class="info">
      <div class="form">
        <el-form
          ref="introduction"
          :model="details"
          status-icon
          label-width="100px"
          :show-message="false"
          size="small"
          :rules="rules"
        >
          <el-form-item label="名称：" prop="name">
            <el-input v-model="details.name" style="width: 50%"></el-input>
          </el-form-item>

          <el-form-item label="等级：" prop="level">
            <el-input v-model="details.level" style="width: 50%"></el-input>
          </el-form-item>

          <el-form-item label="类型：" prop="type">
            <el-input v-model="details.type" style="width: 50%"></el-input>
          </el-form-item>

          <el-form-item label="管理人：" prop="type">
            <span>{{ details.managerName || "暂无" }}</span
            ><el-link type="primary" @click="setManager" style="margin-left: 20px"
              >设置</el-link
            >
          </el-form-item>

          <el-form-item label="联系方式：" prop="tel">
            <el-input v-model="details.tel" style="width: 100%"></el-input>
          </el-form-item>

          <el-form-item label="医院地址：" prop="address">
            <el-input v-model="details.address" style="width: 100%"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="basicInfo" style="float: right" type="primary"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-dialog title="用户信息" :visible.sync="diglogFlag" width="500px">
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
        <el-button size="small" type="primary" @click="dialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { spaceValidate } from "@utils/validator.js";
import { getUserInfo } from "@api/common/common.js";
import { modifyOrgsInfo, setManager } from "@api/manage/orgManage.js";

export default {
  name: "teaminfo",
  props: {
    details: {
      default: () => {
        return {
          Image: "xxx",
          name: "xxx",
          level: "xxx",
          type: "xxx",
          address: "xxx",
          tel: "xxx",
          introduction: "",
          managerId: "",
          managerName: "",
        };
      },
    },
  },
  data() {
    return {
      diglogFlag: false,
      diglogType: "add", //  add  look
      uploadToken: {
        Authorization: localStorage.getItem("token"),
      },
      rules: {
        name: [{ required: true, message: "请输入名称机构名称", trigger: "blur" }],
        level: [{ required: true, message: "请输入机构等级", trigger: "blur" }],
        type: [{ required: true, message: "请输入机构类别", trigger: "blur" }],
        address: [{ required: true, message: "请输入机构地址", trigger: "blur" }],
        tel: [{ required: true, message: "请输入机构联系方式", trigger: "blur" }],
        introduction: [{ required: true, message: "请输入机构简介", trigger: "blur" }],
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
    };
  },
  methods: {
    dialogConfirm() {
      if (this.diglogType == "look") {
        this.diglogFlag = false;
      } else {
        setManager(this.$route.query.id, { UserID: this.tempPerson.UserID }).then(
          (res) => {
            if (res) {
              this.$emit("refresh");
              this.$message.success("设置成功");
            } else {
              this.$message.error("设置失败");
            }
          }
        );
        this.diglogFlag = false;
      }
    },
    setManager() {
      this.$prompt("请输入待添加用户的账号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /[a-zA-Z0-9]{6,12}/,
        inputErrorMessage: "账号为6-11位数字或字母",
      })
        .then(({ value }) => {
          getUserInfo(value).then((res) => {
            if (res) {
              this.tempPerson = res;
              this.diglogType = "add";
              this.diglogFlag = true;
            } else {
              this.$message.error("查找不到对应用户");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    lookPersoon() {
      getUserInfo(this.details.managerId).then((res) => {
        if (res) {
          this.tempPerson = res;
          this.diglogType = "look";
          this.diglogFlag = true;
        } else {
          this.$message.error("查找不到对应用户");
        }
      });
    },
    handleAvatarSuccess(res) {
      if (res.status == 200) {
        this.details.Image = res.readloadurl;
      } else {
        this.$message.error("上传失败");
      }
    },
    confirmManager() {
      if (dialogType == "add") {
        console.log("add");
      } else {
        this.diglogFlag = false;
      }
    },
    basicInfo() {
      let img = details.Image;
      this.$refs.introduction.validate((valid) => {
        if (valid && img) {
          modifyOrgsInfo(this.$route.query.id, this.details).then((res) => {
            if (res) {
              this.$message.success("修改成功");
            } else {
              this.$message.error("修改失败");
            }
          });
        } else {
          this.$message.error("请完善机构详情");
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.teaminfo {
  width: 95%;
  height: 300px;
  margin: 20px auto 10px;
  display: flex;
  .pic {
    width: 250px;
    height: 100%;
    margin-left: 30px;
    margin-right: 30px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    width: 80%;
    height: 280px;
    margin-right: 30px;
    margin-top: 20px;
  }
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #1c7e7c;
    margin-bottom: 15px;
  }
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
.avatar-uploader {
  width: 250px;
  height: 100%;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 250px;
  height: 100%;
  line-height: 300px;
  text-align: center;
}
.avatar {
  width: 250px;
  height: 100%;
  min-height: 250px;
  display: block;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 5px;
}
</style>
