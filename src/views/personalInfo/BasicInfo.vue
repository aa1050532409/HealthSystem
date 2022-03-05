<template>
  <div class="content">
    <el-checkbox-group v-model="publicList">
      <el-collapse v-model="activeNames">
        <el-form
          size="small "
          label-width="80px"
          :inline="true"
          :model="formData"
          ref="formData"
        >
          <el-collapse-item name="基本信息">
            <template slot="title">
              <h3 class="title">基本信息</h3>
            </template>

            <div class="personalInfoCard">
              <div class="avator">
                <el-upload
                  class="avatar-uploader"
                  action="/api/upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  :headers="uploadToken"
                >
                  <img
                    v-if="this.formData.basicInfo.Portrait"
                    :src="this.formData.basicInfo.Portrait"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
              <div class="info">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                      <el-input
                        v-model="formData.basicInfo.Name"
                        placeholder="请输入姓名"
                        style="width: 200px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="性别" prop="gender">
                      <el-input
                        v-model="formData.basicInfo.Gender"
                        placeholder="请输入性别"
                        style="width: 200px"
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="工作单位" prop="job">
                      <el-input
                        v-model="formData.basicInfo.Job"
                        placeholder="请输入工作单位"
                        style="width: 200px"
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="电话" prop="tel">
                      <el-input
                        v-model="formData.basicInfo.Tel"
                        placeholder="请输入电话"
                        style="width: 200px"
                      ></el-input>
                    </el-form-item>
                    <el-checkbox style="line-height: 32px" label="tel">公开</el-checkbox>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="邮箱" prop="post">
                      <el-input
                        v-model="formData.basicInfo.Post"
                        placeholder="请输入邮箱"
                        style="width: 200px"
                      ></el-input>
                    </el-form-item>
                    <el-checkbox style="line-height: 32px" label="post">公开</el-checkbox>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="家庭住址" prop="address">
                      <el-input
                        v-model="formData.basicInfo.Address"
                        placeholder="请输入家庭住址"
                        style="width: 200px"
                      ></el-input>
                    </el-form-item>
                    <el-checkbox style="line-height: 32px" label="address"
                      >公开</el-checkbox
                    >
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="出生日期" prop="date">
                      <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="formData.basicInfo.Birthday"
                        type="date"
                        style="width: 200px"
                        placeholder="选择日期"
                      ></el-date-picker>
                    </el-form-item>
                    <el-checkbox style="line-height: 32px" label="date">公开</el-checkbox>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item
            v-for="item in formData.exp"
            :key="item.id"
            :name="item.title"
          >
            <template slot="title">
              <h3 class="title">{{ item.title }}</h3>
            </template>

            <div class="clearFloat">
              <el-checkbox style="float: right" :label="item.title">公开</el-checkbox>
            </div>

            <el-input
              type="textarea"
              v-model="item.text"
              :rows="3"
              class="text mt5"
            ></el-input>
          </el-collapse-item>
          <div class="clearFloat">
            <el-button type="primary" class="btn" @click="save">保存</el-button>
          </div>
        </el-form>
      </el-collapse>
    </el-checkbox-group>
  </div>
</template>

<script type="text/javascript">
import { getBasicInfo, changeBasicInfo } from "@api/user/user.js";
export default {
  name: "BasicInfo",
  data() {
    return {
      publicList: [],
      uploadToken: {
        Authorization: localStorage.getItem("token"),
      },
      activeNames: ["基本信息", "学习经历", "工作经历", "科研经历", "教学经历"],
      formData: {
        basicInfo: {
          Portrait: "",
          Name: "",
          Gender: "",
          Birthday: "",
          Address: "",
          Job: "",
          Post: "",
          Tel: "",
        },
        exp: [],
      },
      radio: "",
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.formData.basicInfo.Portrait = res.readloadurl;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    save() {
      let map = {
        post: "Post",
        date: "Birthday",
        address: "Address",
        tel: "Tel",
      };
      this.formData.isPublic = this.publicList.map((item) => {
        return map[item] || item;
      });
      changeBasicInfo(this.formData);
    },
  },
  created() {
    this.$store.commit("startLoading");
    getBasicInfo().then((res) => {
      this.formData.basicInfo = res.basicInfo;
      this.formData.exp = res.exp;
      let map = {
        Post: "post",
        Birthday: "date",
        Address: "address",
        Tel: "tel",
      };
      this.publicList = res.isPublic.map((item) => {
        return map[item] || item;
      });
      this.$store.commit("endLoading");
    });
  },
};
</script>

<style scoped lang="scss">
.content {
  width: 90%;
  margin: 20px auto;
  .title {
    font-size: 20px;
    color: #1c7e7c;
  }
  .text {
    width: 100%;
  }
  .personalInfoCard {
    display: flex;
    width: 100%;
    height: 100%;
    .avator {
      width: 178px;
      height: 178px;
    }
    .info {
      width: calc(100% - 0px);
      height: 100%;

      padding-left: 20px;
    }
  }
}
.btn {
  float: right;
  width: 100px;
  margin-bottom: 50px;
  margin-left: 50px;
}
.card {
  img {
    height: 200px;
  }
}
</style>

<style lang="scss">
.el-collapse-item__wrap {
  border-bottom: 0px;
}
.el-collapse {
  border-bottom: 0px;
}
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 1%;
  display: block;
}
</style>
