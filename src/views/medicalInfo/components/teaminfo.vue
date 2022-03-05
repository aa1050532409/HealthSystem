<template>
  <div class="teaminfo">
    <div class="pic">
      <!-- <el-upload
              class="avatar-uploader"
              action="/api/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :headers="uploadToken"
      > -->
        <img
                v-if="expertGroupInfo.expertdetails.ExpertImage"
                :src="expertGroupInfo.expertdetails.ExpertImage"
                class="avatar"
        />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <!-- </el-upload> -->
    </div>
    <div class="info">
      <div class="form">
        <el-form
                ref="introduction"
                :model="expertGroupInfo.expertdetails"
                :rules="rules3"
                status-icon
                label-width="100px"
                size="small"
        >
          <el-form-item label="名称：" prop="ExpertName">
            <el-input :readonly="true" v-model="expertGroupInfo.expertdetails.ExpertName" style="width:50%"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：" prop="ExpertTel">
            <el-input :readonly="true" v-model="expertGroupInfo.expertdetails.ExpertTel" style="width:50%"></el-input>
          </el-form-item>
          <el-form-item label="团队特长：" prop="ExpertSpecialty">
            <el-input :readonly="true" v-model="expertGroupInfo.expertdetails.ExpertSpecialty"></el-input>
          </el-form-item>
          <el-form-item   label="团队简介：" prop="ExpertIntroduction">
            <el-input
            :readonly="true"
                    type="textarea"
                    v-model="expertGroupInfo.expertdetails.ExpertIntroduction"
                    :autosize="{minRows:4,maxRows: 6}"
                    style="max-height:200px"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item>
            <el-button @click="basicInfo" style="float:right" type="primary">保存</el-button>
          </el-form-item> -->
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    spaceValidate,
  } from "@utils/validator.js"

  import {
    modifyBadicInfo,
  } from "@api/expertmanage/expertmanage.js";

  export default {
    name: "teaminfo",
    props: {
      handleAvatarSuccess: Function,
      uploadToken: Object,
      expertGroupInfo:Object,
      //basicInfo:Function,
      ExpertID:String,
    },
    data (){
      return {
        rules3: {
          ExpertName: [{ validator: spaceValidate, trigger: "blur" }],
          ExpertTel: [{ validator: spaceValidate, trigger: "blur" }],
          ExpertSpecialty: [{ validator: spaceValidate, trigger: "blur" }],
        }
      }
    },
    methods: {
      basicInfo() {
        this.$refs.introduction.validate((valid) => {
          if (valid) {
            modifyBadicInfo(this.ExpertID, this.expertGroupInfo.expertdetails);
          }
        });
      },
    }
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
    display: block;
  }
</style>