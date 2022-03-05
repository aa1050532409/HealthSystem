<template>
  <div class="questionnaire">
    <!-- 
    跌倒风险评定
    -->
    <div class="header">
      <span class="title">跌倒风险评定</span>
    </div>
    <div></div>
    <el-form
      size="mini"
      ref="form"
      label-position="left"
      :model="questionnaire"
      :rules="rules"
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
        <div>
          <span class="label">一、评估</span>
          <div class="selectItem">
            <div>
              <span class="subLabel">{{ "近3月有无跌倒/视觉障碍" + "：" }}</span>
            </div>
            <el-form-item prop="youwudiedao" :inline-message="true">
              <el-radio-group
                :disabled="readonly"
                disable
                v-model="questionnaire.youwudiedao"
              >
                <el-radio disable class="radioItem" label="无=0"></el-radio>
                <el-radio class="radioItem" label="有=25"></el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="selectItem">
            <div>
              <span class="subLabel">{{ "多于一个疾病判断" + "：" }}</span>
            </div>
            <el-form-item prop="duobing" :inline-message="true">
              <el-radio-group :disabled="readonly" v-model="questionnaire.duobing">
                <el-radio class="radioItem" label="无=0"></el-radio>
                <el-radio class="radioItem" label="有=15"></el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="selectItem">
            <div>
              <span class="subLabel">{{ "使用行走辅助用具" + "：" }}</span>
            </div>
            <el-form-item prop="xingzou" :inline-message="true">
              <el-radio-group :disabled="readonly" v-model="questionnaire.xingzou">
                <el-radio class="radioItem" label="不需要/卧床休息/护士辅助=0"></el-radio>
                <el-radio class="radioItem" label="拐杖、助步器、手杖=15"></el-radio>
                <el-radio class="radioItem" label="依扶家具行走=30"></el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="selectItem">
            <div>
              <span class="subLabel">{{ "静脉输液/使用药物治疗" + "：" }}</span>
            </div>
            <el-form-item prop="yongyao" :inline-message="true">
              <el-radio-group :disabled="readonly" v-model="questionnaire.yongyao">
                <el-radio class="radioItem" label="否=0"></el-radio>
                <el-radio class="radioItem" label="是=25"></el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="selectItem">
            <div>
              <span class="subLabel">{{ "步态/移动" + "：" }}</span>
            </div>
            <el-form-item prop="yidong" :inline-message="true">
              <el-radio-group :disabled="readonly" v-model="questionnaire.yidong">
                <el-radio
                  class="radioItem"
                  label="正常、卧床不能移动、轮椅代步=0"
                ></el-radio>
                <el-radio
                  class="radioItem"
                  label="虚弱乏力/≥65岁/体位性低血压=10"
                ></el-radio>
                <el-radio class="radioItem" label="失调不平衡=20"></el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="selectItem">
            <div>
              <span class="subLabel">{{ "精神状态" + "：" }}</span>
            </div>
            <el-form-item prop="jingshen" :inline-message="true">
              <el-radio-group :disabled="readonly" v-model="questionnaire.jingshen">
                <el-radio class="radioItem" label="了解自己能力=0"></el-radio>
                <el-radio
                  class="radioItem"
                  label="忘记自己受限制/意识障碍/躁动不安/沟通障碍/睡眠障碍=15"
                ></el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>

        <div>
          <span class="label">二、评估总分</span>
          <p>总得分：{{ totalScore }}</p>
        </div>
        <div>
          <span class="label">三、常规预防措施</span>

          <p v-for="(item, index) in preventionNormal" :key="item.id">
            （{{ index + 1 }}）{{ item }}
          </p>
        </div>
        <div>
          <span class="label">四、选择预防措施</span>
          <el-form-item label-width="0px" prop="region">
            <el-checkbox-group :disabled="readonly" v-model="questionnaire.xuanzeyufang">
              <div v-for="item in selectableoptions" :key="item.od">
                <el-checkbox :label="item"></el-checkbox>
              </div>
            </el-checkbox-group>
          </el-form-item>
        </div>
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
  name: "diedao",
  mixins: [tempSave],
  props: {
    /* 
    readonly：是否只读
    preData：传入的数据
    */
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
          youwudiedao: "",
          duobing: "",
          xingzou: "",
          yongyao: "",
          yidong: "",
          jingshen: "",
          xuanzeyufang: [],
        };
      },
    },
    newAdd: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {
      preventionNormal: [
        "安全指导:预防跌倒健康教育",
        "润历床旁走道障碍清除",
        "保持病房地面清洁干燥，告知卫生间防滑措施（沐浴时有人陪伴）",
        "将常用物品放置在便于患者拿取处",
        "指导呼叫器的使用",
      ],
      selectableoptions: [
        "指导患者渐进活动，必要时使用辅助工具",
        "要求家属需陪伴在旁，离开时需告知值班护士",
        "注意轮椅及便盆座椅的固定",
        "指导床上使用便器",
        "床档保护",
        "使用约束带保护",
        "高风险患者床头卡挂警示标识",
        // "其它措施"
      ],
      // 问卷内容
      questionnaire: {
        totalScore: "",
        time: Date.now(),
        youwudiedao: "",
        duobing: "",
        xingzou: "",
        yongyao: "",
        yidong: "",
        jingshen: "",
        xuanzeyufang: [],
      },
      // 校验规则
      rules: {
        youwudiedao: [{ required: true, message: "请选择", trigger: "blur" }],
        duobing: [{ required: true, message: "请选择", trigger: "blur" }],
        xingzou: [{ required: true, message: "请选择", trigger: "blur" }],
        yongyao: [{ required: true, message: "请选择", trigger: "blur" }],
        yidong: [{ required: true, message: "请选择", trigger: "blur" }],
        jingshen: [{ required: true, message: "请选择", trigger: "blur" }],
        xuanzeyufang: [
          {
            type: "array",
            required: false,
            message: "请选择",
            trigger: "change",
          },
        ],
      },
    };
  },

  computed: {
    totalScore() {
      let sum = 0;
      sum += this.getScore(this.questionnaire.youwudiedao);
      sum += this.getScore(this.questionnaire.duobing);
      sum += this.getScore(this.questionnaire.xingzou);
      sum += this.getScore(this.questionnaire.yongyao);
      sum += this.getScore(this.questionnaire.yidong);
      sum += this.getScore(this.questionnaire.jingshen);
      this.questionnaire.totalScore = sum;
      return sum;
    },
  },
  methods: {
    saveTp() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          saveTamplate({
            type: "跌倒风险评定",
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
      getTamplate("跌倒风险评定").then((res) => {
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
    formInput() {
      this.$emit("input", this.questionnaire);
    },
    cancel() {
      this.$emit("cancel");
    },
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$emit("commit", {
            data: this.questionnaire,
            name: "跌倒风险评定",
          });
        } else {
          this.$message.error("请完善评估表");
          return false;
        }
      });
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
  .selectItem {
    width: 90%;
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
}
</style>

<style lang="scss">
.questionnaire {
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-form-item__content {
    line-height: 25px;
  }
  .el-form-item__label {
    line-height: 25px;
  }
}
</style>
