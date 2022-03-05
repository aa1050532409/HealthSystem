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
          size="small"
        >
          <el-form-item label="名称：" prop="name">
            <el-input v-model="details.name" style="width: 50%"></el-input>
          </el-form-item>

          <el-form-item label="等级：" prop="ExpertName">
            <el-input v-model="details.level" style="width: 50%"></el-input>
          </el-form-item>

          <el-form-item label="类型：" prop="ExpertName">
            <el-input v-model="details.type" style="width: 50%"></el-input>
          </el-form-item>

          <el-form-item label="联系方式：" prop="ExpertTel">
            <el-input v-model="details.tel" style="width: 100%"></el-input>
          </el-form-item>

          <el-form-item label="医院地址：" prop="ExpertName">
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
  </div>
</template>

<script>
import { spaceValidate } from "@utils/validator.js";

import { modifyOrgsInfo } from "@api/manage/orgManage.js";

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
        };
      },
    },
  },
  data() {
    return {
      uploadToken: {
        Authorization: localStorage.getItem("token"),
      },
      // rules3: {
      //   ExpertName: [{ validator: spaceValidate, trigger: "blur" }],
      //   ExpertTel: [{ validator: spaceValidate, trigger: "blur" }],
      //   ExpertSpecialty: [{ validator: spaceValidate, trigger: "blur" }],
      // },
    };
  },
  methods: {
    handleAvatarSuccess(res) {
      if (res.status == 200) {
        this.details.Image = res.readloadurl;
      } else {
        this.$message.error("上传失败");
      }
    },
    basicInfo() {
      this.$refs.introduction.validate((valid) => {
        if (valid) {
          modifyOrgsInfo(this.$route.query.id, this.details).then((res) => {
            if (res) {
              this.$message.success("修改成功");
            } else {
              this.$message.error("修改失败");
            }
          });
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
</style>