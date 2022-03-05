<template>
  <div class="questionnaire">
    <!-- 
    护理记录首页
    -->
    <div class="header">
      <span class="title">护理记录首页</span>
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
      label-width="80px"
    >
      <div @input="formInput">
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
        <div class="item">
          <span class="label">生命体征</span>
          <div>
            <div class="floatItem">
              <el-form-item prop="tizheng.T" :show-message="false" width="200px">
                <template slot="label">
                  <span> T(℃) </span>
                </template>
                <el-input
                  :disabled="readonly"
                  v-model="questionnaire.tizheng.T"
                  class="input"
                ></el-input>
              </el-form-item>
            </div>
            <div class="floatItem">
              <el-form-item prop="tizheng.P" :show-message="false" width="200px">
                <template slot="label">
                  <span> P(次/分) </span>
                </template>
                <el-input
                  :disabled="readonly"
                  v-model="questionnaire.tizheng.P"
                  class="input"
                ></el-input>
              </el-form-item>
            </div>

            <div class="floatItem">
              <el-form-item prop="tizheng.R" :show-message="false" width="200px">
                <template slot="label">
                  <span> R(次/分) </span>
                </template>
                <el-input
                  :disabled="readonly"
                  v-model="questionnaire.tizheng.R"
                  class="input"
                ></el-input>
              </el-form-item>
            </div>
            <div class="floatItem">
              <el-form-item prop="tizheng.BP" :show-message="false" width="200px">
                <template slot="label">
                  <span>BP(mmHg) </span>
                </template>
                <el-input
                  :disabled="readonly"
                  v-model="questionnaire.tizheng.BP"
                  class="input"
                ></el-input>
              </el-form-item>
            </div>
            <div class="floatItem">
              <el-form-item prop="tizheng.SPO2" :show-message="false" width="200px">
                <template slot="label">
                  <span>SPO2(%)</span>
                </template>
                <el-input
                  :disabled="readonly"
                  v-model="questionnaire.tizheng.SPO2"
                  class="input"
                ></el-input>
              </el-form-item>
            </div>
            <div class="floatItem">
              <el-form-item prop="tizheng.BS" :show-message="false" width="200px">
                <template slot="label">
                  <span>血糖(%)</span>
                </template>
                <el-input
                  :disabled="readonly"
                  v-model="questionnaire.tizheng.BS"
                  class="input"
                ></el-input>
              </el-form-item>
            </div>
            <div class="floatItem">
              <el-form-item prop="tizheng.WEIGHT" :show-message="false" width="200px">
                <template slot="label">
                  <span>体重(kg)</span>
                </template>
                <el-input
                  :disabled="readonly"
                  v-model="questionnaire.tizheng.WEIGHT"
                  class="input"
                ></el-input>
              </el-form-item>
            </div>
            <div class="floatItem">
              <el-form-item prop="tizheng.HEIGHT" :show-message="false" width="200px">
                <template slot="label">
                  <span>身高(cm)</span>
                </template>
                <el-input
                  :disabled="readonly"
                  v-model="questionnaire.tizheng.HEIGHT"
                  class="input"
                ></el-input>
              </el-form-item>
            </div>
            <div style="clear: both; height: 0"></div>
          </div>
        </div>
        <div class="item">
          <el-form-item prop="goutong" :show-message="true">
            <template slot="label">
              <span class="label">沟通能力 </span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.goutong">
              <el-radio label="自理"></el-radio>
              <el-radio label="部分自理"></el-radio>
              <el-radio label="不能自理"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="item">
          <el-form-item prop="shuimian" :show-message="true">
            <template slot="label">
              <span class="label">睡眠情况 </span>
            </template>

            <el-radio-group :disabled="readonly" v-model="questionnaire.shuimian">
              <el-radio label="正常"></el-radio>
              <el-radio label="异常"></el-radio>
              <el-radio label="入睡困难"></el-radio>
              <el-radio label="易醒"></el-radio>
              <el-radio label="多梦"></el-radio>
              <el-radio label="服镇静剂"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="item">
          <span class="label">排泄情况</span>
          <div>
            <el-form-item
              prop="paixie.dabian.qingkuang"
              :show-message="true"
              width="400px"
            >
              <template slot="label">
                <span>大便 </span>
              </template>
              <el-radio-group
                :disabled="readonly"
                v-model="questionnaire.paixie.dabian.qingkuang"
              >
                <el-radio label="正常"></el-radio>
                <el-radio label="异常"></el-radio>
              </el-radio-group>
              <div v-show="questionnaire.paixie.dabian.qingkuang == '异常'">
                <el-checkbox-group
                  :disabled="readonly"
                  v-model="questionnaire.paixie.dabian.miaoshu"
                >
                  <el-checkbox label="便秘"></el-checkbox>
                  <el-checkbox label="大便失禁"></el-checkbox>
                  <el-checkbox label="腹泻"></el-checkbox>
                  <el-checkbox label="其他"></el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              prop="paixie.xiaobian.qingkuang"
              :show-message="true"
              width="400px"
            >
              <template slot="label">
                <span>小便 </span>
              </template>
              <el-radio-group
                :disabled="readonly"
                v-model="questionnaire.paixie.xiaobian.qingkuang"
              >
                <el-radio label="正常"></el-radio>
                <el-radio label="异常"></el-radio>
              </el-radio-group>
              <div v-show="questionnaire.paixie.xiaobian.qingkuang == '异常'">
                <el-checkbox-group
                  :disabled="readonly"
                  v-model="questionnaire.paixie.xiaobian.miaoshu"
                >
                  <el-checkbox label="院外带入尿管"></el-checkbox>
                  <el-checkbox label="失禁"></el-checkbox>
                  <el-checkbox label="尿潴留"></el-checkbox>
                  <el-checkbox label="其他"></el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
          </div>
          <div style="clear: both; height: 0"></div>
        </div>

        <div class="item">
          <el-form-item prop="pifu.qingkuang" :show-message="true">
            <template slot="label">
              <span class="label">皮肤情况 </span>
            </template>

            <el-radio-group :disabled="readonly" v-model="questionnaire.pifu.qingkuang">
              <el-radio label="正常"></el-radio>
              <el-radio label="异常"></el-radio>
            </el-radio-group>
            <div v-show="questionnaire.pifu.qingkuang == '异常'">
              <el-checkbox-group
                :disabled="readonly"
                v-model="questionnaire.pifu.miaoshu"
              >
                <el-checkbox label="水肿"></el-checkbox>
                <el-checkbox label="水泡"></el-checkbox>
                <el-checkbox label="破损"></el-checkbox>
                <el-checkbox label="压疮"></el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </div>

        <div class="item">
          <el-form-item prop="guominshi" :show-message="true">
            <template slot="label">
              <span class="label">过敏史 </span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.guominshi">
              <el-radio label="有"></el-radio>
              <el-radio label="无"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="item">
          <el-form-item prop="zhuanke.yishi" :show-message="true">
            <template slot="label">
              <span class="label">意识状态 </span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.zhuanke.yishi">
              <el-radio label="清醒"></el-radio>
              <el-radio label="嗜睡"></el-radio>
              <el-radio label="昏睡"></el-radio>
              <el-radio label="昏迷"></el-radio>
              <el-radio label="意识模糊"></el-radio>
              <el-radio label="谵妄"></el-radio>
              <el-radio label="特殊"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item prop="zhuanke.renzhi" :show-message="true">
            <template slot="label">
              <span class="label">认知功能 </span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.zhuanke.renzhi">
              <el-radio label="查体不配合"></el-radio>
              <el-radio label="正常"></el-radio>
              <el-radio label="下降"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="item">
          <el-form-item prop="zhuanke.milu" :show-message="true">
            <template slot="label">
              <span class="label">迷路走失 </span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.zhuanke.milu">
              <el-radio label="有"></el-radio>
              <el-radio label="无"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="item">
          <el-form-item prop="zhuanke.yundong.qingkuang" :show-message="true">
            <template slot="label">
              <span class="label">运动功能 </span>
            </template>
            <el-radio-group
              :disabled="readonly"
              v-model="questionnaire.zhuanke.yundong.qingkuang"
            >
              <el-radio label="查体不配合"></el-radio>
              <el-radio label="肌力正常"></el-radio>
              <el-radio label="肌力下降"></el-radio>
            </el-radio-group>
            <div v-show="questionnaire.zhuanke.yundong.qingkuang == '肌力下降'">
              <el-checkbox-group
                :disabled="readonly"
                v-model="questionnaire.zhuanke.yundong.buwei"
              >
                <el-checkbox label="左上"></el-checkbox>
                <el-checkbox label="左下"></el-checkbox>
                <el-checkbox label="右上"></el-checkbox>
                <el-checkbox label="右下"></el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </div>

        <div class="item">
          <el-form-item prop="zhuanke.tunyan" :show-message="true">
            <template slot="label">
              <span class="label">吞咽功能 </span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.zhuanke.tunyan">
              <el-radio label="查体不配合"></el-radio>
              <el-radio label="正常"></el-radio>
              <el-radio label="异常"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item prop="zhuanke.ganjue" :show-message="true">
            <template slot="label">
              <span class="label">感觉功能 </span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.zhuanke.ganjue">
              <el-radio label="查体不配合"></el-radio>
              <el-radio label="正常"></el-radio>
              <el-radio label="迟钝"></el-radio>
              <el-radio label="刺激性症状"></el-radio>
              <el-radio label="特殊"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item prop="zhuanke.tengtong.qingkuang" :show-message="true">
            <template slot="label">
              <span class="label">疼痛 </span>
            </template>
            <el-radio-group
              :disabled="readonly"
              v-model="questionnaire.zhuanke.tengtong.qingkuang"
            >
              <el-radio label="有"></el-radio>
              <el-radio label="无"></el-radio>
            </el-radio-group>
            <div v-if="questionnaire.zhuanke.tengtong.qingkuang == '有'">
              <span style="margin-right: 20px">疼痛得分</span>
              <el-input
                :disabled="readonly"
                v-model="questionnaire.zhuanke.yundong.defen"
                class="inputLength"
              ></el-input>
            </div>
          </el-form-item>
        </div>

        <div class="item">
          <el-form-item prop="peihu" :show-message="true" label-width="200px">
            <template slot="label">
              <span class="label">是否需要24小时留陪护 </span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.peihu">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item prop="yachuang" :show-message="true" label-width="200px">
            <template slot="label">
              <span class="label">首次初评有无压疮风险 </span>
            </template>
            <el-radio-group :disabled="readonly" v-model="questionnaire.yachuang">
              <el-radio label="有"></el-radio>
              <el-radio label="无"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="item">
          <el-form-item prop="richangdefen" :show-message="false" label-width="200px">
            <template slot="label">
              <span class="label">日常生活评定得分 </span>
            </template>
            <el-input
              :disabled="readonly"
              v-model="questionnaire.richangdefen"
              class="inputLength"
            ></el-input>
          </el-form-item>
        </div>
        <!--  -->
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
  name: "huli",
  mixins: [tempSave],
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
      radio: "",
      questionnaire: {
        time: Date.now(),
        tizheng: {
          T: "", //温度
          P: "", //血压
          R: "", //呼吸
          BP: "", //血压
          BS: "", //空腹/随机血糖
          SPO2: "", //血氧饱和度
          HEIGHT: "", //身高
          WEIGHT: "", //体重
        },
        goutong: "",
        shuimian: "",
        paixie: {
          xiaobian: {
            qingkuang: "",
            miaoshu: [],
          },
          dabian: {
            qingkuang: "",
            miaoshu: [],
          },
        },
        pifu: {
          qingkuang: "",
          miaoshu: [],
        },
        guominshi: "",
        zhuanke: {
          yishi: "",
          renzhi: "",
          milu: "",
          yundong: {
            qingkuang: "",
            buwei: [],
          },
          tunyan: "",
          ganjue: "",
          tengtong: {
            qingkuang: "",
            defen: "",
          },
        },
        peihu: "",
        yachuang: "",
        diedao: "",
        richangdefen: "",
      },
      rules: {
        "tizheng.T": [{ required: true, message: "请输入", trigger: "blur" }],
        "tizheng.P": [{ required: true, message: "请选择", trigger: "blur" }],
        "tizheng.R": [{ required: true, message: "请选择", trigger: "blur" }],
        "tizheng.BP": [{ required: true, message: "请选择", trigger: "blur" }],
        "tizheng.BS": [{ required: true, message: "请选择", trigger: "blur" }],
        "tizheng.BS": [{ required: true, message: "请选择", trigger: "blur" }],
        "tizheng.SPO2": [{ required: true, message: "请选择", trigger: "blur" }],
        "tizheng.HEIGHT": [{ required: true, message: "请选择", trigger: "blur" }],
        "tizheng.WEIGHT": [{ required: true, message: "请选择", trigger: "blur" }],

        /*  */
        goutong: [{ required: true, message: "请选择", trigger: "blur" }],
        shuimian: [{ required: true, message: "请选择", trigger: "blur" }],

        "paixie.xiaobian.qingkuang": [
          { required: true, message: "请选择", trigger: "blur" },
        ],

        "paixie.dabian.qingkuang": [
          { required: true, message: "请选择", trigger: "blur" },
        ],

        "pifu.qingkuang": [{ required: true, message: "请选择", trigger: "blur" }],

        guominshi: [{ required: true, message: "请选择", trigger: "blur" }],

        "zhuanke.yishi": [{ required: true, message: "请选择", trigger: "blur" }],
        "zhuanke.renzhi": [{ required: true, message: "请选择", trigger: "blur" }],
        "zhuanke.milu": [{ required: true, message: "请选择", trigger: "blur" }],
        "zhuanke.yundong.qingkuang": [
          { required: true, message: "请选择", trigger: "blur" },
        ],

        "zhuanke.tunyan": [{ required: true, message: "请选择", trigger: "blur" }],
        "zhuanke.ganjue": [{ required: true, message: "请选择", trigger: "blur" }],
        "zhuanke.tengtong.qingkuang": [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        //

        peihu: [{ required: true, message: "请选择", trigger: "blur" }],
        yachuang: [{ required: true, message: "请选择", trigger: "blur" }],
        diedao: [{ required: true, message: "请选择", trigger: "blur" }],
        richangdefen: [{ required: true, message: "请选择", trigger: "blur" }],
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
    formInput() {
      this.$emit("input", this.questionnaire);
    },
    saveTp() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          saveTamplate({
            type: "护理记录首页",
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
      getTamplate("护理记录首页").then((res) => {
        if (res) {
          this.questionnaire = res;
          this.questionnaire.time = this.questionnaire.time || Date.now();
          this.$message.success("导入成功");
        } else {
          this.$message.error("尚未保存模板");
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    },
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$emit("commit", {
            data: this.questionnaire,
            name: "护理记录首页",
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
    margin-bottom: 20px;
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
    // margin: 10px 0;
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
  .floatItem {
    float: left;
    width: 150px;
    margin-right: 20px;
    margin-top: 5px;
  }
  .item {
    margin-top: 5px;
  }
  .inputLength {
    width: 200px;
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
  .el-input__inner {
    height: 25px;
    line-height: 25px;
  }
}
</style>
