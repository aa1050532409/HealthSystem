<template>
  <div class="newNursingLog clearfix">
    <!-- 
   每日护理记录
    -->
    <div class="header">
      <span class="title">新增护理记录</span>
    </div>
    <el-form size="mini" ref="form" label-position="right" :model="form" label-width="85px">
      <div @input="formInput">
        <div>
          <el-form-item label-position="left">
            <template slot="label">
              <span class="label">意识：</span>
            </template>
            <el-radio-group :disabled="readonly" disable v-model="questionnaire.youwudiedao">
              <el-radio disable class="radioItem" label="无=0"></el-radio>
              <el-radio class="radioItem" label="有=25"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label-position="left">
            <template slot="label">
              <span class="label">生命体征：</span>
            </template>
          </el-form-item>
          <div>
            <el-row>
              <el-col :span="4">
                <el-form-item>
                  <template slot="label">
                    <span class="subLabel">T(℃)</span>
                  </template>
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <template slot="label">
                    <span class="subLabel">P(次/分))</span>
                  </template>
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <template slot="label">
                    <span class="subLabel">HR(次/分)</span>
                  </template>
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <template slot="label">
                    <span class="subLabel">R(次/分)</span>
                  </template>
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <template slot="label">
                    <span class="subLabel">HR(次/分)</span>
                  </template>
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <template slot="label">
                    <span class="subLabel">BP(mmHg)</span>
                  </template>
                  <el-input></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-form-item label-position="left">
            <template slot="label">
              <span class="label">入量：</span>
            </template>
          </el-form-item>
          <div>
            <el-row>
              <el-col :span="4">
                <el-form-item>
                  <template slot="label">
                    <span class="subLabel">名称</span>
                  </template>
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <template slot="label">
                    <span class="subLabel">分类</span>
                  </template>
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <template slot="label">
                    <span class="subLabel">途径</span>
                  </template>
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <template slot="label">
                    <span class="subLabel">量(ml)</span>
                  </template>
                  <el-input></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-form-item label-position="left">
            <template slot="label">
              <span class="label">出量：</span>
            </template>
          </el-form-item>
          <div>
            <el-row>
              <el-col :span="4">
                <el-form-item>
                  <template slot="label">
                    <span class="subLabel">名称</span>
                  </template>
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <template slot="label">
                    <span class="subLabel">量(ml)</span>
                  </template>
                  <el-input></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-form-item label-position="left">
            <template slot="label">
              <span class="label">肌力：</span>
            </template>
            <el-radio-group :disabled="readonly" disable v-model="questionnaire.youwudiedao">
              <el-radio disable class="radioItem" label="无=0"></el-radio>
              <el-radio class="radioItem" label="有=25"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label-position="left">
            <template slot="label">
              <span class="label">翻身卧位：</span>
            </template>
            <el-radio-group :disabled="readonly" disable v-model="questionnaire.youwudiedao">
              <el-radio disable class="radioItem" label="无=0"></el-radio>
              <el-radio class="radioItem" label="有=25"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label-position="left">
            <template slot="label">
              <span class="label">是否约束：</span>
            </template>
            <el-radio-group :disabled="readonly" disable v-model="questionnaire.youwudiedao">
              <el-radio disable class="radioItem" label="无=0"></el-radio>
              <el-radio class="radioItem" label="有=25"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
      <el-button @click="save" size="medium" type="primary" class="btn">确认</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    readonly: {
      type: Boolean,
      default: () => {
        return false;
      }
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
          xuanzeyufang: []
        };
      }
    },
    lastData: {},
    importFlag: false
  },
  data() {
    return {
      form: {
        feiyan: "",
        huxi: "",
        xitan: "",
        koushui: "",
        yishi: false,
        type: [],
        hezuo: "",
        xiyang: "",
        zuoqi: "",
        jieguo: "",
        jianyi: ""
      },
      table: {
        title: "Morsed跌倒危险因素评估及护理措施表",
        time: "",
        partOne: [
          {
            text: "近3月有无跌倒/视觉障碍",
            options: [
              {
                text: "无",
                socre: 0
              },
              {
                text: "有",
                socre: 15
              }
            ],
            selected: ""
          },
          {
            text: "多于一个疾病诊断",
            options: [
              {
                text: "无",
                socre: 0
              },
              {
                text: "有",
                socre: 15
              }
            ],
            selected: ""
          },
          {
            text: "使用行走辅助用具",
            options: [
              {
                text: "不需要/卧床休息/护士辅助",
                socre: 0
              },
              {
                text: "拐杖、助步器、手杖",
                socre: 15
              },
              {
                text: "依扶家具行走",
                socre: 30
              }
            ],
            selected: ""
          },
          {
            text: "静脉输液/使用药物治疗",
            options: [
              {
                text: "否",
                socre: 0
              },
              {
                text: "是",
                socre: 20
              }
            ],
            selected: ""
          },
          {
            text: "步态/移动",
            options: [
              {
                text: "正常、卧床不能移动、轮椅代步",
                socre: 0
              },
              {
                text: "虚弱乏力/≥65岁/体位性低血压",
                socre: 10
              },
              {
                text: "失调不平衡",
                socre: 20
              }
            ],
            selected: ""
          },
          {
            text: "精神状态",
            options: [
              {
                text: "了解自己能力",
                socre: 0
              },
              {
                text: "忘记自己受限制/意识障碍/躁动不安/沟通障碍/睡眠障碍",
                socre: 15
              }
            ],
            selected: ""
          }
        ],
        totalScore: "",
        prevention: {
          normal: [
            "安全指导:预防跌倒健康教育",
            "润历床旁走道障碍清除",
            "保持病房地面清洁干燥，告知卫生间防滑措施（沐浴时有人陪伴）",
            "将常用物品放置在便于患者拿取处",
            "指导呼叫器的使用"
          ],
          selectable: {
            options: [
              "指导患者渐进活动，必要时使用辅助工具",
              "要求家属需陪伴在旁，离开时需告知值班护士",
              "注意轮椅及便盆座椅的固定",
              "指导床上使用便器",
              "床档保护",
              "使用约束带保护",
              "高风险患者床头卡挂警示标识",
              "其它措施"
            ],
            // 多选
            selected: []
          }
        },
        isFall: "",
        notes: [
          "常规预防措施适合与对所有患者跌倒的预防。",
          "评估总分>45分为高危，护士应在常规预防措施的基础上，选择相应的预防措施。",
          "评估时请在评估日期栏注明具体时间。"
        ]
      },
      questionnaire: {
        totalScore: "",
        youwudiedao: "",
        duobing: "",
        xingzou: "",
        yongyao: "",
        yidong: "",
        jingshen: "",
        xuanzeyufang: []
      },
      form2: {
        date: new Date(),
        tizheng: {
          T: "",
          P: "",
          HR: "",
          R: "",
          BP: ""
        },
        SPO2: "",
        ruliang: {
          mingcheng: "",
          fenglei: "",
          tujing: "",
          liang: ""
        },
        chuliang: {
          mingcheng: "",
          liang: ""
        },
        jili: "",
        fanshenwowei: "",
        shifouyueshu: "",
        yijian: ""
      }
    };
  },
  watch: {
    importFlag(newValue) {
      if (newValue) {
        this.questionnaire = this.lastData;
        this.$emit("successImport");
      }
    }
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
    }
  },
  methods: {
    onSubmit() {
      console.log("submit!");
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
    }
  },
  mounted() {
    this.questionnaire = this.preData;
  }
};
</script>

<style lang="scss" scoped>
.newNursingLog {
  padding: 10px;
  margin-bottom: 20px;
  box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.3);
  .header {
    text-align: center;
    .title {
      font-size: 18px;
      color: #1e7e7c;
      font-weight: bold;
    }
  }

  .label {
    font-weight: bold;
    color: #1e7e7c;
  }
  .subLabel {
    color: #1e7e7c;
  }
  .selectItem {
    width: 90%;
  }
  .selectItem {
    .subLabel {
      font-size: 15px;
      margin-bottom: 5px;
    }
    .radioItem {
      margin: 5px;
    }
  }
  .btn {
    float: right;
  }
}
.clearfix:after {
  content: ""; /*设置内容为空*/
  height: 0; /*高度为0*/
  line-height: 0; /*行高为0*/
  display: block; /*将文本转为块级元素*/
  visibility: hidden; /*将元素隐藏*/
  clear: both; /*清除浮动*/
}
</style>

<style lang="scss">
.newNursingLog {
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