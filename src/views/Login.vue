<template>
  <div class="page">
    <div class="login-box">
      <el-form
        label-position="left"
        label-width="0px"
        class="demo-ruleForm login-container"
        ref="loginform"
        :rules="rules"
        status-icon
        :model="loginInfo"
      >
        <h3 class="title">系统登录</h3>
        <el-form-item prop="UserID">
          <el-input
            type="text"
            v-model="loginInfo.UserID"
            auto-complete="off"
            placeholder="用户名"
            id="loginEmail"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginInfo.password"
            auto-complete="off"
            placeholder="密码"
            id="loginPassword"
          ></el-input>
          <label id="showPasswordToggle"> </label>
        </el-form-item>
        <el-form-item style="width: 100%">
          <div>
            <el-button
              type="primary"
              style="width: 100%; background-color: #1c7e7c"
              @click="userLogin"
              >登录</el-button
            >
          </div>
          <div class="mt5">
            <el-button style="width: 100%" @click="registerData.registerFlag = true"
              >注册</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="用户注册" :visible.sync="registerData.registerFlag" width="500px">
      <el-form
        :model="registerData.registerInfo"
        :show-message="false"
        :rules="rules"
        ref="register"
        label-width="80px"
        size="small"
      >
        <el-form-item prop="UserID" label="账号">
          <el-input v-model="registerData.registerInfo.UserID"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="registerData.registerInfo.password"></el-input>
        </el-form-item>
        <el-form-item prop="Name" label="用户名">
          <el-input v-model="registerData.registerInfo.Name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userRegister">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { login, register } from "../api/user/user.js";
export default {
  name: "app-login",
  data() {
    return {
      loginInfo: {
        UserID: "101001",
        password: "123",
      },
      registerData: {
        registerFlag: false,
        registerInfo: {
          UserID: "",
          Name: "",
          password: "",
        },
      },
      rules: {
        UserID: [{ required: true, trigger: "blur" }],
        Name: [{ required: true, trigger: "blur" }],
        password: [{ required: true, trigger: "blur" }],
      },
    };
  },
  methods: {
    userLogin() {
      this.$refs["loginform"].validate((v) => {
        if (v) {
          login(this.loginInfo);
        } else {
          this.$message.error("请输入用户名或密码");
        }
      });
    },
    userRegister() {
      this.registerData.registerFlag = false;
      this.registerData.registerInfo.LoginPassword = this.registerData.registerInfo.password;
      register(this.registerData.registerInfo).then((res) => {
        if (res) {
          this.$message.success("注册成功");
        } else {
          this.$message.error("注册失败");
        }
      });
    },
  },
  mounted() {
    localStorage.clear();
    this.$localforage.clear();
  },
};
</script>

<style scoped>
.title {
  text-align: center;
  margin-bottom: 15px;
  font-size: 24px;
  color: #1c7e7c;
}

.page {
  background-color: #eff3f4;
  position: absolute;
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  display: block;
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  margin: 0;
  padding: 2.25em;
  box-sizing: border-box;
  border: solid 1px #ddd;
  border-radius: 0.5em;
  font-family: "Source Sans Pro", sans-serif;
}
</style>
