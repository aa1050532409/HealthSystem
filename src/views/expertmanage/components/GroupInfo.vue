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
          v-if="expertGroupInfo.ExpertImage"
          :src="expertGroupInfo.ExpertImage"
          class="avatar"
        />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <div class="info">
      <div class="form">
        <el-form
          ref="introduction"
          :model="expertGroupInfo"
          :rules="rules"
          status-icon
          label-width="100px"
          size="small"
        >
          <el-form-item label="名称：" prop="ExpertName">
            <el-input v-model="expertGroupInfo.ExpertName" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：" prop="ExpertTel">
            <el-input v-model="expertGroupInfo.ExpertTel" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="团队特长：" prop="ExpertSpecialty">
            <el-input v-model="expertGroupInfo.ExpertSpecialty"></el-input>
          </el-form-item>
          <el-form-item label="团队简介：" prop="ExpertIntroduction">
            <el-input
              type="textarea"
              v-model="expertGroupInfo.ExpertIntroduction"
              :autosize="{ minRows: 4, maxRows: 6 }"
              style="max-height: 200px"
            ></el-input>
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

import { modifyBadicInfo } from "@api/expertmanage/expertmanage.js";
import { modifyExpertGroupsInfo } from "@api/manage/expertManage.js";
export default {
  name: "teaminfo",
  props: {
    expertGroupInfo: Object,
  },
  data() {
    return {
      uploadToken: {
        Authorization: localStorage.getItem("token"),
      },
      rules: {
        ExpertName: [{ required: true, message: "请输入团队名称", trigger: "blur" }],
        ExpertTel: [{ required: true, message: "请输入团队联系方式", trigger: "blur" }],
        ExpertSpecialty: [
          { required: true, message: "请输入团队擅长方向", trigger: "blur" },
        ],
        ExpertIntroduction: [
          { required: true, message: "请输入团队简介", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleAvatarSuccess(res) {
      if (res.status == 200) {
        this.expertGroupInfo.ExpertImage = res.readloadurl;
      } else {
        this.$message.error("上传失败");
      }
    },
    basicInfo() {
      this.$refs.introduction.validate((valid) => {
        if (valid) {
          modifyExpertGroupsInfo(this.$route.query.id, {
            groupName: this.expertGroupInfo.ExpertName,
            groupShanchang: this.expertGroupInfo.ExpertSpecialty,
            groupIntroduction: this.expertGroupInfo.ExpertIntroduction,
            groupImage: this.expertGroupInfo.ExpertImage,
            groupTel: this.expertGroupInfo.ExpertTel,
          }).then((res) => {
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
