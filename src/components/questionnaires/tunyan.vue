<template>
  <div class="questionnaire">
    <!-- 
    吞咽功能评定

                <components
                    @commit="pingguCommit(index,$event)"
                    @cancel="pingguCancel(item,index)"
                    :preData="item.data"
                    :readonly="item.state=='已完成'?true:false"
                    :is="item.type"
                    :newAdd="false"   在患者信息中新添加的评估传入true
                  ></components>
    -->
    <div class="header">
      <span class="title">吞咽功能评定</span>
    </div>
    <el-form
      :hide-required-asterisk="true"
      :model="questionnaire"
      size="small"
      ref="form"
      :rules="rules"
      label-position="left"
      label-width="80%"
    >
      <div v-if="newAdd" style="margin: 20px 0px">
        <span style="float: left; font-size: 16px; color: #1c7e7c">评定时间:</span>
        <el-date-picker
          v-model="questionnaire.time"
          :readonly="readonly"
          size="small"
          value-format="timestamp"
          style="float:left;margin-left:20px;vertical-align-center"
        ></el-date-picker>
        <div style="clear:both;height=0"></div>
      </div>

      <div @input="formInput">
        <div>
          <span class="label">一、初评</span>
          <el-form-item
            label="病人已经或怀疑患有吸入性肺炎"
            prop="feiyan"
            :inline-message="true"
          >
            <el-radio-group :disabled="readonly" v-model="questionnaire.feiyan">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="靠气管造口呼吸" prop="huxi" :inline-message="true">
            <el-radio-group :disabled="readonly" v-model="questionnaire.huxi">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="需要经常性吸痰" prop="xitan" :inline-message="true">
            <el-radio-group :disabled="readonly" v-model="questionnaire.xitan">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="有困难处理口水及分泌物"
            prop="fenmiwu"
            :inline-message="true"
          >
            <el-radio-group :disabled="readonly" v-model="questionnaire.fenmiwu">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="意识水平波动" prop="yishi" :inline-message="true">
            <el-radio-group :disabled="readonly" v-model="questionnaire.yishi">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="不合作" prop="buhezuo" :inline-message="true">
            <el-radio-group :disabled="readonly" v-model="questionnaire.buhezuo">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="有不正常等口部反射动作例如:咬紧牙关"
            prop="fanshedongzuo"
            :inline-message="true"
          >
            <el-radio-group :disabled="readonly" v-model="questionnaire.fanshedongzuo">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="不能脱离面罩吸氧30分钟"
            prop="xiyang"
            :inline-message="true"
          >
            <el-radio-group :disabled="readonly" v-model="questionnaire.xiyang">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="不能坐起" prop="bunengzuoqi" :inline-message="true">
            <el-radio-group :disabled="readonly" v-model="questionnaire.bunengzuoqi">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <span style="font-weight: bold; margin: 30px 20px">排除标准</span>
          <span>如上述任何答案为“是”都不要尝试以下饮水试验</span>
        </div>
        <div>
          <span class="label">二、操作方法</span>
          <p v-for="(item, index) in table.partTwo" :key="item.id">
            {{ "（" + (index + 1) + "）" + item }}
          </p>
        </div>

        <div>
          <span class="label">三、吞咽情况结果判定</span>
          <el-form-item label-width="0px" prop="jieguo" :inline-message="true">
            <el-select
              :disabled="readonly"
              style="width: 90%"
              v-model="questionnaire.jieguo"
              placeholder="请选择吞咽情况结果判定"
            >
              <el-option
                v-for="item in table.result.options"
                :key="item.id"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <span class="label">四、建议指导</span>
          <el-form-item label-width="0px" prop="jianyi" :inline-message="true">
            <el-select
              :disabled="readonly"
              style="width: 90%"
              v-model="questionnaire.jianyi"
              placeholder="请选择建议指导"
            >
              <el-option
                v-for="item in table.advice.options"
                :key="item.id"
                :value="item"
              ></el-option>
            </el-select>
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
  name: "tunyan",
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
          time: Date.now(),
          feiyan: "",
          huxi: "",
          xitan: "",
          fenmiwu: "",
          yishi: "",
          buhezuo: "",
          fanshedongzuo: "",
          xiyang: "",
          bunengzuoqi: "",
          jieguo: "",
          jianyi: "",
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
      table: {
        title: "吞咽功能评定",
        time: "",
        partOne: [
          {
            text: "病人已经或怀疑患有吸入性肺炎",
            result: "",
          },
          {
            text: "靠气管造口呼吸",
            result: "",
          },
          {
            text: "需要经常性吸痰",
            result: "",
          },
          {
            text: "有困难处理口水及分泌物",
            result: "",
          },
          {
            text: "意识水平波动",
            result: "",
          },
          {
            text: "不合作",
            result: "",
          },
          {
            text: "有不正常等口部反射动作例如:咬紧牙关",
            result: "",
          },
          {
            text: "不能脱离面罩吸氧30分钟",
            result: "",
          },
          {
            text: "不能坐起",
            result: "",
          },
        ],
        partTwo: [
          "使病人正坐位，卧床患者至少抬高床头大于60",
          "清患者自行咳嗽一次，检查有无咳嗽反射",
          "指导患者整个试验过程不能说话，勿紧张",
          "准备一杯40ml的温开水，一小茶匙",
          "以每次5ml喂给患者，共2次，共计10ml温开水",
          "请患者张口，用手电筒检查患者口腔有无残留水（必要时测量氧饱和度）",
          "余下的30ml请患者用药杯一次喝完，观察记录饮水情况",
          "再次请患者张口，用手电筒检查患者口腔有无残留水（必要时测量氧饱和度）",
        ],
        result: {
          options: [
            "Ⅰ：可一口喝完，无呛咳",
            "Ⅱ：分两次喝完，无呛咳",
            "Ⅲ：能一口喝完，但是有呛咳",
            "Ⅳ：分两次喝完，有呛咳",
            "Ⅴ：常常呛住，难以全部喝完",
          ],
          selected: "",
        },
        advice: {
          options: [
            "Ⅲ级：给予指导自行吞咽训练",
            "Ⅳ级：给予吞咽训练及指导自行吞咽训练",
            "V级：建议给予留置胃管",
          ],
          selected: "",
        },
      },
      questionnaire: {
        time: "123",
        feiyan: "",
        huxi: "",
        xitan: "",
        fenmiwu: "",
        yishi: "",
        buhezuo: "",
        fanshedongzuo: "",
        xiyang: "",
        bunengzuoqi: "",
        jieguo: "",
        jianyi: "",
      },
      rules: {
        feiyan: [{ required: true, message: "请选择", trigger: "blur" }],
        huxi: [{ required: true, message: "请选择", trigger: "blur" }],
        xitan: [{ required: true, message: "请选择", trigger: "blur" }],
        fenmiwu: [{ required: true, message: "请选择", trigger: "blur" }],
        yishi: [{ required: true, message: "请选择", trigger: "blur" }],
        buhezuo: [{ required: true, message: "请选择", trigger: "blur" }],
        fanshedongzuo: [{ required: true, message: "请选择", trigger: "blur" }],
        xiyang: [{ required: true, message: "请选择", trigger: "blur" }],
        bunengzuoqi: [{ required: true, message: "请选择", trigger: "blur" }],
        jieguo: [{ required: true, message: "请选择", trigger: "blur" }],
        jianyi: [{ required: true, message: "请选择", trigger: "blur" }],
      },
    };
  },
  watch: {
    importFlag(newValue) {
      if (newValue) {
        this.questionnaire = this.lastData;
        this.$emit("successImport");
      }
    },
  },
  methods: {
    saveTp() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          saveTamplate({
            type: "吞咽功能评定",
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
      getTamplate("吞咽功能评定").then((res) => {
        if (res) {
          this.questionnaire = res;
          this.questionnaire.time = this.questionnaire.time || Date.now();
          this.$message.success("导入成功");
        } else {
          this.$message.error("尚未保存模板");
        }
      });
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
            name: "吞咽功能评定",
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
  .btn {
    .link {
      margin-right: 20px;
    }
    float: right;
    margin: 20px 10% 20px 20px;
  }
  .timebox {
    display: flex;
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
  .el-radio__input.is-disabled + span.el-radio__label {
    color: #606266;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #409eff;
    background: #409eff;
  }
  .el-radio__input.is-disabled.is-checked .el-radio__inner::after {
    background-color: #fff;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: #606266;
  }
  .el-select .el-input.is-disabled .el-input__inner {
    cursor: auto;
  }
  .el-radio__input.is-disabled .el-radio__inner {
    cursor: auto;
  }
  .el-radio__input.is-disabled + span.el-radio__label {
    cursor: auto;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #606266;
    cursor: auto;
  }
}
</style>
