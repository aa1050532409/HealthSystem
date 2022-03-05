<template>
  <div class="questionnaire">
    <div class="header">
      <span class="title">Barthle指数评定</span>
    </div>

    <el-form
      :hide-required-asterisk="true"
      :show-message="true"
      size="mini"
      ref="form"
      label-position="left"
      :model="questionnaire"
      :rules="rules"
      :inline-message="true"
      label-width="130px"
    >
      <div v-if="newAdd" style="margin: 20px 0px">
        <span style="float: left; font-size: 16px; color: #1c7e7c">评定时间:</span>
        <el-date-picker
          v-model="questionnaire.time"
          size="small"
          :readonly="readonly"
          value-format="timestamp"
          style="float:left;margin-left:20px;vertical-align-center"
        ></el-date-picker>
        <div style="clear:both;height=0"></div>
      </div>
      <div>
        <span class="label">一、评估</span>
        <div class="selectItem">
          <el-form-item prop="eat" :inline-message="true">
            <template slot="label">
              <span class="subLabel">{{ "进食情况" + "：" }}</span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.eat">
              <el-radio disable class="radioItem" label="完全独立=10"></el-radio>
              <el-radio class="radioItem" label="需部分帮助=5"></el-radio>
              <el-radio class="radioItem" label="需很大帮助=0"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="selectItem">
          <el-form-item prop="shower" :inline-message="true">
            <template slot="label">
              <span class="subLabel">{{ "洗澡情况" + "：" }}</span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.shower">
              <el-radio disable class="radioItem" label="完全独立=5"></el-radio>
              <el-radio class="radioItem" label="需部分帮助=0"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="selectItem">
          <el-form-item prop="decorate" :inline-message="true">
            <template slot="label">
              <span class="subLabel">{{ "修饰情况" + "：" }}</span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.decorate">
              <el-radio disable class="radioItem" label="完全独立=5"></el-radio>
              <el-radio class="radioItem" label="需部分帮助=0"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="selectItem">
          <el-form-item prop="wear" :inline-message="true">
            <template slot="label">
              <span class="subLabel">{{ "穿衣情况" + "：" }}</span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.wear">
              <el-radio disable class="radioItem" label="完全独立=10"></el-radio>
              <el-radio class="radioItem" label="需部分帮助=5"></el-radio>
              <el-radio class="radioItem" label="需极大帮助=0"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="selectItem">
          <el-form-item prop="poo" :inline-message="true">
            <template slot="label">
              <span class="subLabel">{{ "控制大便情况" + "：" }}</span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.poo">
              <el-radio disable class="radioItem" label="完全独立=10"></el-radio>
              <el-radio class="radioItem" label="需部分帮助=5"></el-radio>
              <el-radio class="radioItem" label="需极大帮助=0"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="selectItem">
          <el-form-item prop="xiaobian" :inline-message="true">
            <template slot="label">
              <span class="subLabel">{{ "控制小便情况" + "：" }}</span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.xiaobian">
              <el-radio disable class="radioItem" label="完全独立=10"></el-radio>
              <el-radio class="radioItem" label="需部分帮助=5"></el-radio>
              <el-radio class="radioItem" label="需极大帮助=0"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="selectItem">
          <el-form-item prop="ruce" :inline-message="true">
            <template slot="label">
              <span class="subLabel">{{ "如厕情况" + "：" }}</span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.ruce">
              <el-radio disable class="radioItem" label="完全独立=10"></el-radio>
              <el-radio class="radioItem" label="需部分帮助=5"></el-radio>
              <el-radio class="radioItem" label="需极大帮助=0"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="selectItem">
          <el-form-item prop="remove" :inline-message="true">
            <template slot="label">
              <span class="subLabel">{{ "床椅转移情况" + "：" }}</span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.remove">
              <el-radio disable class="radioItem" label="完全独立=15"></el-radio>
              <el-radio class="radioItem" label="需部分帮助=10"></el-radio>
              <el-radio class="radioItem" label="需极大帮助=5"></el-radio>
              <el-radio class="radioItem" label="完全依赖=0"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="selectItem">
          <el-form-item prop="walk" :inline-message="true">
            <template slot="label">
              <span class="subLabel">{{ "平地行走情况" + "：" }}</span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.walk">
              <el-radio disable class="radioItem" label="完全独立=15"></el-radio>
              <el-radio class="radioItem" label="需部分帮助=10"></el-radio>
              <el-radio class="radioItem" label="需极大帮助=5"></el-radio>
              <el-radio class="radioItem" label="完全依赖=0"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="selectItem">
          <el-form-item prop="stairs" :inline-message="true">
            <template slot="label">
              <span class="subLabel">{{ "上下楼梯情况" + "：" }}</span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.stairs">
              <el-radio disable class="radioItem" label="完全独立=10"></el-radio>
              <el-radio class="radioItem" label="需部分帮助=5"></el-radio>
              <el-radio class="radioItem" label="需极大帮助=0"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
      <div>
        <span class="label">二、评估总分</span>
        <p class="score">总得分：{{ totalScore }}</p>
      </div>
      <div v-show="!readonly" class="btn">
        <el-link @click="saveTp" class="link">保存模板</el-link>
        <el-link @click="importTp" class="link" type="success">导入模板</el-link>
        <el-button @click="save" size="small " type="primary">确认</el-button>
        <el-button @click="cancel" size="small " type="danger">{{
          readonly ? "关闭" : "取消"
        }}</el-button>
        <div style="clear: both; height: 0"></div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { saveTamplate, getTamplate } from "@api/operationmanage/operationmanage.js";
import tempSave from "./tempSave.js";
export default {
  name: "Barthle",
  props: {
    readonly: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    preData: {
      type: Object,
      default: () => {
        return {
          totalScore: "",
          eat: "",
          shower: "",
          decorate: "",
          wear: "",
          poo: "",
          xiaobian: "",
          ruce: "",
          remove: "",
          walk: "",
          stairs: "",
        };
      },
    },
    newAdd: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    lastData: {},
    importFlag: false,
  },
  mixins: [tempSave],
  data() {
    return {
      questionnaire: {
        totalScore: "",
        time: Date.now(),
        eat: "",
        shower: "",
        decorate: "",
        wear: "",
        poo: "",
        xiaobian: "",
        ruce: "",
        remove: "",
        walk: "",
        stairs: "",
      },
      rules: {
        eat: [{ required: true, message: "请选择", trigger: "blur" }],
        shower: [{ required: true, message: "请选择", trigger: "blur" }],
        decorate: [{ required: true, message: "请选择", trigger: "blur" }],
        wear: [{ required: true, message: "请选择", trigger: "blur" }],
        poo: [{ required: true, message: "请选择", trigger: "blur" }],
        xiaobian: [{ required: true, message: "请选择", trigger: "blur" }],
        ruce: [{ required: true, message: "请选择", trigger: "blur" }],
        remove: [{ required: true, message: "请选择", trigger: "blur" }],
        walk: [{ required: true, message: "请选择", trigger: "blur" }],
        stairs: [{ required: true, message: "请选择", trigger: "blur" }],
      },
    };
  },
  computed: {
    totalScore() {
      let sum = 0;
      sum += this.getScore(this.questionnaire.eat);
      sum += this.getScore(this.questionnaire.shower);
      sum += this.getScore(this.questionnaire.decorate);
      sum += this.getScore(this.questionnaire.wear);
      sum += this.getScore(this.questionnaire.poo);
      sum += this.getScore(this.questionnaire.xiaobian);
      sum += this.getScore(this.questionnaire.ruce);
      sum += this.getScore(this.questionnaire.remove);
      sum += this.getScore(this.questionnaire.walk);
      sum += this.getScore(this.questionnaire.stairs);
      this.questionnaire.totalScore = sum;
      return sum;
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$emit("commit", {
            data: this.questionnaire,
            name: "Barthle指数评定",
          });
        } else {
          this.$message.error("请完善评估表");
          return false;
        }
      });
    },
    saveTp() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          saveTamplate({
            type: "Barthle指数评定",
            data: this.questionnaire,
          }).then((res) => {
            this.$message.success("保存成功");
          });
        } else {
          this.$message.error("请完善评估表");
          return false;
        }
      });
    },
    importTp() {
      getTamplate("Barthle指数评定").then((res) => {
        if (res) {
          this.questionnaire = res;
          this.questionnaire.time = this.questionnaire.time || Date.now();
          this.$message.success("导入成功");
        } else {
          this.$message.error("尚未保存模板");
        }
      });
    },
    getScore(str) {
      if (!str) return 0;
      else {
        let reg = /[0-9]+$/;
        if (reg.exec(str)) {
          return parseInt(reg.exec(str)[0]);
        } else {
          return 0;
        }
      }
    },
  },
  mounted() {
    if (Object.keys(this.preData).length > 0) this.questionnaire = this.preData;
    this.questionnaire.time = this.questionnaire.time || Date.now();
  },
};
</script>

<style lang="scss" scoped>
.questionnaire {
  padding: 10px;
  background-color: #fff;
  .header {
    .title {
      font-size: 18px;
      color: #1e7e7c;
      font-weight: bold;
    }
  }
  .label {
    font-size: 16px;
    color: #1e7e7c;
    display: block;
    margin: 10px 0;
  }
  .score {
    font-size: 18px;
    margin-left: 10px;
  }
  .selectItem {
    width: 90%;
    margin-left: 10px;
  }
  .selectItem {
    .subLabel {
      font-size: 15px;
      margin-bottom: 5px;
      display: block;
    }
    .radioItem {
      margin: 5px;
    }
  }
  .btn {
    .link {
      margin-right: 20px;
    }
    float: right;
    margin: 20px 10% 20px 20px;
  }
  .subLabel {
    font-size: 15px;
    margin-bottom: 5px;
    display: block;
  }
}
</style>
