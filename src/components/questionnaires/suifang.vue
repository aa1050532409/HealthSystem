<template>
  <div class="questionnaire">
    <div class="header">
      <span class="title">随访记录表</span>
    </div>

    <el-form
      size="mini"
      ref="form"
      label-position="left"
      :model="questionnaire"
      :rules="rules"
    >
      <div v-if="newAdd" style="margin: 20px 0px">
        <span style="float: left; font-size: 16px; color: #1c7e7c">随访时间:</span>
        <el-date-picker
          v-model="questionnaire.time"
          :readonly="readonly"
          size="small"
          value-format="timestamp"
          style="float:left;margin-left:20px;vertical-align-center"
        ></el-date-picker>
        <div style="clear:both;height=0"></div>
      </div>
      <div>
        <span class="label">一、患者基本信息</span>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <div>
                <span class="subLabel">{{ "随访方式" + "：" }}</span>
              </div></el-col
            >
            <el-col :span="18">
              <el-form-item prop="followstyle" :inline-message="true">
                <el-radio-group :disabled="readonly" v-model="questionnaire.followstyle">
                  <el-radio disable class="radioItem" label="面访"></el-radio>
                  <el-radio class="radioItem" label="电访"></el-radio>
                  <el-radio class="radioItem" label="微信"></el-radio>
                  <el-radio class="radioItem" label="其他"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row :gutter="10">
            <el-col :span="4">
              <div>
                <span class="subLabel">{{ "体重(Kg)" + "：" }}</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-form-item prop="weight" :inline-message="true">
                  <el-input v-model="questionnaire.weight" clearable></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <span class="subLabel">{{ "血压(mmHg)" + "：" }}</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-form-item prop="pressure" :inline-message="true">
                  <el-input v-model="questionnaire.pressure" clearable></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <span class="subLabel">{{ "心率(次/分)" + "：" }}</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-form-item prop="rate" :inline-message="true">
                  <el-input v-model="questionnaire.rate" clearable></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "血管事件再发" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="again" :inline-message="true">
                <el-radio-group :disabled="readonly" v-model="questionnaire.again">
                  <el-radio disable class="radioItem" label="否"></el-radio>
                  <el-radio class="radioItem" label="是"></el-radio>
                </el-radio-group>
                <div v-if="questionnaire.again === '是'">
                  <el-date-picker
                    v-model="questionnaire.againdate"
                    type="date"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>

      <div>
        <span class="label">二、目前用药情况</span>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "抗血小板聚集药" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="kxxb" :inline-message="true">
                <el-checkbox-group :disabled="readonly" v-model="questionnaire.kxxb">
                  <el-checkbox label="阿司匹林"></el-checkbox>
                  <el-checkbox label="波立维"></el-checkbox>
                  <el-checkbox label="泰嘉"></el-checkbox>
                  <el-checkbox label="其他"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "抗凝药" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="kny" :inline-message="true">
                <el-checkbox-group :disabled="readonly" v-model="questionnaire.kny">
                  <el-checkbox label="华法林"></el-checkbox>
                  <el-checkbox label="利伐沙班"></el-checkbox>
                  <el-checkbox label="达比加群酯"></el-checkbox>
                  <el-checkbox label="阿哌沙班"></el-checkbox>
                  <el-checkbox label="依度沙班"></el-checkbox>
                  <el-checkbox label="其他"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "降脂药" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="jzy" :inline-message="true">
                <el-checkbox-group :disabled="readonly" v-model="questionnaire.jzy">
                  <el-checkbox label="阿托伐他汀"></el-checkbox>
                  <el-checkbox label="瑞舒伐他汀"></el-checkbox>
                  <el-checkbox label="辛伐他汀"></el-checkbox>
                  <el-checkbox label="匹伐他汀"></el-checkbox>
                  <el-checkbox label="普罗布考"></el-checkbox>
                  <el-checkbox label="其他"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "降压药" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="jyy" :inline-message="true">
                <el-checkbox-group :disabled="readonly" v-model="questionnaire.jyy">
                  <el-checkbox label="硝苯地平缓释片"></el-checkbox>
                  <el-checkbox label="苯磺酸氨氯地平"></el-checkbox>
                  <el-checkbox label="卡托普利片"></el-checkbox>
                  <el-checkbox label="马来酸依那普利"></el-checkbox>
                  <el-checkbox label="缬沙坦"></el-checkbox>
                  <el-checkbox label="吲达帕胺"></el-checkbox>
                  <el-checkbox label="贝那普利"></el-checkbox>
                  <el-checkbox label="其他"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "降糖药" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="jty" :inline-message="true">
                <el-checkbox-group :disabled="readonly" v-model="questionnaire.jty">
                  <el-checkbox label="二甲双胍"></el-checkbox>
                  <el-checkbox label="格列齐特"></el-checkbox>
                  <el-checkbox label="格列吡嗪"></el-checkbox>
                  <el-checkbox label="格列本脲"></el-checkbox>
                  <el-checkbox label="格列美脲"></el-checkbox>
                  <el-checkbox label="瑞格列奈"></el-checkbox>
                  <el-checkbox label="吡格列酮"></el-checkbox>
                  <el-checkbox label="消渴丸"></el-checkbox>
                  <el-checkbox label="胰岛素"></el-checkbox>
                  <el-checkbox label="其他"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "服药依从性" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="fyycx" :inline-message="true">
                <el-radio-group :disabled="readonly" v-model="questionnaire.fyycx">
                  <el-radio disable class="radioItem" label="规律"></el-radio>
                  <el-radio class="radioItem" label="间断"></el-radio>
                  <el-radio class="radioItem" label="不服药"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "药物不良反应" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="blfy" :inline-message="true">
                <el-radio-group :disabled="readonly" v-model="questionnaire.blfy">
                  <el-radio disable class="radioItem" label="无"></el-radio>
                  <el-radio class="radioItem" label="有"></el-radio>
                </el-radio-group>
                <div v-if="questionnaire.blfy === '有'">
                  <el-input
                    size="mini"
                    v-model="questionnaire.response"
                    style="width: 200px"
                    clearable
                  ></el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "目前症状" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="symptom" :inline-message="true">
                <el-checkbox-group :disabled="readonly" v-model="questionnaire.symptom">
                  <el-checkbox label="无"></el-checkbox>
                  <el-checkbox label="口眼歪斜"></el-checkbox>
                  <el-checkbox label="言语不清"></el-checkbox>
                  <el-checkbox label="偏瘫"></el-checkbox>
                  <el-checkbox label="智力障碍"></el-checkbox>
                  <el-checkbox label="乏力"></el-checkbox>
                  <el-checkbox label="其他"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "并发症" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="bingfa" :inline-message="true">
                <el-checkbox-group :disabled="readonly" v-model="questionnaire.bingfa">
                  <el-checkbox label="无"></el-checkbox>
                  <el-checkbox label="呼吸道感染"></el-checkbox>
                  <el-checkbox label="泌尿系统感染"></el-checkbox>
                  <el-checkbox label="压疮"></el-checkbox>
                  <el-checkbox label="深静脉血栓"></el-checkbox>
                  <el-checkbox label="其他"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "肢体功能恢复" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="recovery" :inline-message="true">
                <el-radio-group :disabled="readonly" v-model="questionnaire.recovery">
                  <el-radio disable class="radioItem" label="好"></el-radio>
                  <el-radio class="radioItem" label="一般"></el-radio>
                  <el-radio class="radioItem" label="差"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "康复治疗的方式" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="style" :inline-message="true">
                <el-checkbox-group :disabled="readonly" v-model="questionnaire.style">
                  <el-checkbox label="无"></el-checkbox>
                  <el-checkbox label="按摩"></el-checkbox>
                  <el-checkbox label="针灸"></el-checkbox>
                  <el-checkbox label="运动训练"></el-checkbox>
                  <el-checkbox label="其他"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "生活能否自理" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="zili" :inline-message="true">
                <el-radio-group :disabled="readonly" v-model="questionnaire.zili">
                  <el-radio disable class="radioItem" label="完全自理"></el-radio>
                  <el-radio class="radioItem" label="部分自理"></el-radio>
                  <el-radio class="radioItem" label="不能自理"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>

      <div>
        <span class="label">三、生活方式改变</span>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "吸烟" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="smoke" :inline-message="true">
                <el-radio-group :disabled="readonly" v-model="questionnaire.smoke">
                  <el-radio disable class="radioItem" label="否"></el-radio>
                  <el-radio class="radioItem" label="是"></el-radio>
                  <el-radio class="radioItem" label="已戒烟"></el-radio>
                </el-radio-group>
                <div v-if="questionnaire.smoke === '是'">
                  <el-input
                    size="mini"
                    v-model="questionnaire.smokenum"
                    style="width: 200px"
                    clearable
                  ></el-input
                  >(支/天)
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "饮酒" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="drink" :inline-message="true">
                <el-radio-group :disabled="readonly" v-model="questionnaire.drink">
                  <el-radio disable class="radioItem" label="否"></el-radio>
                  <el-radio class="radioItem" label="是"></el-radio>
                  <el-radio class="radioItem" label="已戒酒"></el-radio>
                </el-radio-group>
                <div v-if="questionnaire.drink === '是'">
                  <el-radio-group
                    :disabled="readonly"
                    v-model="questionnaire.drinkfrequency"
                  >
                    <el-radio disable class="radioItem" label="偶尔"></el-radio>
                    <el-radio class="radioItem" label="经常"></el-radio>
                  </el-radio-group>
                  <div v-if="questionnaire.drinkfrequency === '经常'">
                    <el-input
                      size="mini"
                      v-model="questionnaire.drinknum"
                      style="width: 200px"
                      clearable
                    ></el-input
                    >(两/天)
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "运动" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="exercise" :inline-message="true">
                <el-radio-group :disabled="readonly" v-model="questionnaire.exercise">
                  <el-radio disable class="radioItem" label="否"></el-radio>
                  <el-radio class="radioItem" label="是"></el-radio>
                </el-radio-group>
                <div v-if="questionnaire.exercise === '是'">
                  <el-input
                    size="mini"
                    v-model="questionnaire.exerciseweek"
                    style="width: 200px"
                    clearable
                  ></el-input
                  >(次/周)
                  <el-input
                    size="mini"
                    v-model="questionnaire.exerciseminute"
                    style="width: 200px"
                    clearable
                  ></el-input
                  >(分钟/次)
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>

      <div>
        <span class="label">四、其他</span>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "本次教育计划" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="plan" :inline-message="true">
                <el-checkbox-group :disabled="readonly" v-model="questionnaire.plan">
                  <el-checkbox label="用药指导"></el-checkbox>
                  <el-checkbox label="饮食指导"></el-checkbox>
                  <el-checkbox label="康复/运动指导"></el-checkbox>
                  <el-checkbox label="心理指导"></el-checkbox>
                  <el-checkbox label="血压/血糖监测"></el-checkbox>
                  <el-checkbox label="戒烟限酒指导"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="selectItem">
          <el-row>
            <el-col :span="4">
              <span class="subLabel">{{ "特殊嘱托" + "：" }}</span>
            </el-col>
            <el-col :span="19">
              <el-form-item prop="special" :inline-message="true">
                <el-input
                  :disabled="readonly"
                  type="textarea"
                  :min-rows="2"
                  v-model="questionnaire.special"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- {{ readonly }}
        {{ newAdd }} -->
        <!-- {{ !readonly && !newAdd }} -->
        <div v-if="!newAdd">
          <div v-if="!readonly" class="selectItem" style="margin-top: 20px">
            <el-row>
              <el-col :span="4">
                <span class="subLabel">{{ "下次随访时间" + "：" }}</span>
              </el-col>
              <el-col :span="19">
                <el-form-item prop="nextdate" :inline-message="true">
                  <el-select v-model="questionnaire.nextdate" placeholder="请选择">
                    <el-option
                      v-for="item in timeOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
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
    <div style="clear: both; height: 0"></div>
  </div>
</template>

<script>
import { saveTamplate, getTamplate } from "@api/operationmanage/operationmanage.js";
import tempSave from "./tempSave.js";
export default {
  name: "suifang",
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
          followdate: "",
          followstyle: "",
          name: "",
          follownum: "",
          sex: "",
          age: "",
          phone: "",
          weight: "",
          pressure: "",
          rate: "",
          again: "",
          againdate: "",
          kxxb: [],
          kny: [],
          jzy: [],
          jyy: [],
          jty: [],
          fyycx: "",
          blfy: "",
          response: "",
          symptom: [],
          bingfa: [],
          recovery: "",
          style: [],
          zili: "",
          smoke: "",
          smokenum: "",
          drink: "",
          drinkfrequency: "",
          drinknum: "",
          exercise: "",
          exerciseweek: "",
          exerciseminute: "",
          plan: [],
          special: "",
          nextdate: "",
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
      currentDate: new Date().getTime(),
      questionnaire: {
        time: Date.now(),
        followdate: "",
        followstyle: "",
        name: "",
        follownum: "",
        sex: "",
        age: "",
        phone: "",
        weight: "",
        pressure: "",
        rate: "",
        again: "",
        againdate: "",
        kxxb: [],
        kny: [],
        jzy: [],
        jyy: [],
        jty: [],
        fyycx: "",
        blfy: "",
        response: "",
        symptom: [],
        bingfa: [],
        recovery: "",
        style: [],
        zili: "",
        smoke: "",
        smokenum: "",
        drink: "",
        drinkfrequency: "",
        drinknum: "",
        exercise: "",
        exerciseweek: "",
        exerciseminute: "",
        plan: [],
        special: "",
        nextdate: "",
      },
      rules: {
        followdate: [{ required: true, message: "请选择", trigger: "blur" }],
        followstyle: [{ required: true, message: "请选择", trigger: "blur" }],
        name: [{ required: true, message: "请填写", trigger: "blur" }],
        follownum: [{ required: true, message: "请填写", trigger: "blur" }],
        sex: [{ required: true, message: "请选择", trigger: "blur" }],
        age: [{ required: true, message: "请填写", trigger: "blur" }],
        phone: [{ required: true, message: "请填写", trigger: "blur" }],
        weight: [{ required: true, message: "请填写", trigger: "blur" }],
        pressure: [{ required: true, message: "请填写", trigger: "blur" }],
        rate: [{ required: true, message: "请填写", trigger: "blur" }],
        again: [{ required: true, message: "请选择", trigger: "blur" }],
        kxxb: [{ required: true, message: "请选择", trigger: "blur" }],
        kny: [{ required: true, message: "请选择", trigger: "blur" }],
        jzy: [{ required: true, message: "请选择", trigger: "blur" }],
        jyy: [{ required: true, message: "请选择", trigger: "blur" }],
        jty: [{ required: true, message: "请选择", trigger: "blur" }],
        fyycx: [{ required: true, message: "请选择", trigger: "blur" }],
        blfy: [{ required: true, message: "请选择", trigger: "blur" }],
        symptom: [{ required: true, message: "请选择", trigger: "blur" }],
        bingfa: [{ required: true, message: "请选择", trigger: "blur" }],
        recovery: [{ required: true, message: "请选择", trigger: "blur" }],
        style: [{ required: true, message: "请选择", trigger: "blur" }],
        zili: [{ required: true, message: "请选择", trigger: "blur" }],
        smoke: [{ required: true, message: "请选择", trigger: "blur" }],
        drink: [{ required: true, message: "请选择", trigger: "blur" }],
        exercise: [{ required: true, message: "请选择", trigger: "blur" }],
        plan: [{ required: true, message: "请选择", trigger: "blur" }],
        special: [{ required: true, message: "请填写", trigger: "blur" }],
        nextdate: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      options: [
        {
          value: "男",
          label: "男",
        },
        {
          value: "女",
          label: "女",
        },
      ],
      timeOptions: [
        {
          label: "半月后",
          value: new Date().getTime(),
        },
        {
          label: "一月后",
          value: new Date().getTime() + 86400000 * 30,
        },
        {
          label: "三月后",
          value: new Date().getTime() + 86400000 * 90,
        },
        {
          label: "半年后",
          value: new Date().getTime() + 86400000 * 180,
        },
      ],
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.removeTempSave();
          this.$emit("commit", {
            data: this.questionnaire,
            name: "随访记录表",
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
            type: "随访记录表",
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
      getTamplate("随访记录表").then((res) => {
        if (res) {
          this.questionnaire = res;
          this.questionnaire.time = this.questionnaire.time || Date.now();
          this.questionnaire.nextdate = "";
          this.$message.success("导入成功");
        } else {
          this.$message.error("尚未保存模板");
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
}
</style>
