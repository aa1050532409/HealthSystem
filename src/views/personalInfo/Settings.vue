<template>
  <div>
    <el-row class="title">
      <el-col :span="8" :offset="1">
        <span>就诊设置</span>
      </el-col>
    </el-row>

    <el-row class="password">
      <div style="margin-left: 150px">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item
            :rules="[
              { required: true, message: '请输入挂号上限', trigger: 'blur' },
              {
                type: 'number',
                message: '请输入数字',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <template slot="label">
              <span class="sublabel">每日挂号上限:</span>
            </template>
            <el-input
              oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
              v-model="diagNumber"
              placeholder="请输入每日挂号上限"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveDiagNum">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-row>

    <el-row class="title">
      <el-col :span="8" :offset="1">
        <span>密码设置</span>
      </el-col>
    </el-row>

    <el-row class="password">
      <el-form :model="formData" :rules="rules" label-width="100px" ref="passwordModigy">
        <el-col :span="7" :offset="7">
          <el-form-item label="用户名" prop="username">
            <span>{{ formData.username }}</span>
          </el-form-item>
          <el-form-item label="原密码" prop="prepass">
            <el-input
              type="password"
              v-model="formData.prepass"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newpass">
            <el-input
              type="password"
              v-model="formData.newpass"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="check">
            <el-input
              type="password"
              v-model="formData.check"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="2" :offset="10">
        <el-button class="btn" @click="password">提交</el-button>
      </el-col>
    </el-row>
    <el-divider type="primary" class="line"></el-divider>
  </div>
</template>

<script type="text/javascript">
import { modifyPassword, getDiagNum, modifyDiagNum } from "../../api/user/user.js";
import { validateAccount, validatePass, validateName } from "../../utils/validator.js";
export default {
  name: "Setting",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formData.newpass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      diagNumber: "",

      formData: {
        username: "",
        prepass: "",
        newpass: "",
        check: "",
      },
      notice: false,
      rules: {
        username: [{ validator: validateAccount, trigger: "blur" }],
        prepass: [{ validator: validatePass, trigger: "blur" }],
        check: [{ validator: validatePass2, trigger: "blur" }],
        newpass: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  methods: {
    password() {
      this.$refs.passwordModigy.validate((valid) => {
        if (valid) {
          modifyPassword(this.formData);
        } else {
          this.$message.error("请按格式输入！");
          return false;
        }
      });
    },
    saveDiagNum() {
      modifyDiagNum(this.diagNumber).then((res) => {
        if (res) {
          this.$message.success("修改成功");
        } else {
          this.$message.error("修改失败");
        }
      });
    },
    fetchData() {
      getDiagNum().then((res) => {
        this.diagNumber = res;
      });
    },
  },
  created() {
    this.formData.username = this.$store.state.user.userInfo.userId;
    this.fetchData();
  },
};
</script>

<style scoped lang="scss">
.title {
  font-size: 20px;
  font-weight: bold;
  color: $mainColor;
  margin: 20px 0px 0px 0px;
}
.sublabel {
  font-size: $font_large;
  color: $mainColor;
}

.message {
  margin-top: 30px;
  margin-bottom: 40px;
  font-size: 18px;
}
.password {
  margin-top: 30px;
  margin-bottom: 10px;
}
.line {
  width: 85%;
  margin: auto;
  margin-top: 20px;
}
.btn {
  width: 100%;
  height: 40px;
  color: white;
  background-color: #409eff;
}
</style>
