<template>
  <div class="newChafangLog clearfix">
    <!--
   每日护理记录
    -->
    <div class="header">
      <span class="title">查房记录表</span>
    </div>
    <el-form
      :hide-required-asterisk="true"
      status-icon
      size="small"
      ref="form"
      :inline-message="true"
      :rules="rules"
      label-position="right"
      :model="form"
      label-width="120px"
    >
      <div>
        <div>
          <!--意识-->
          <el-form-item label-position="left" prop="yishi" :inline-message="true">
            <template slot="label">
              <span class="label">意识：</span>
            </template>
            <el-radio-group :disabled="readonly" disable v-model="form.yishi">
              <el-radio class="radioItem" label="清醒"></el-radio>
              <el-radio class="radioItem" label="嗜睡"></el-radio>
              <el-radio class="radioItem" label="昏睡"></el-radio>
              <el-radio class="radioItem" label="昏迷"></el-radio>
              <el-radio class="radioItem" label="意识模糊"></el-radio>
              <el-radio class="radioItem" label="谵妄"></el-radio>
            </el-radio-group>
          </el-form-item>
          <!--生命体征-->
          <el-form-item label-position="left" style="margin-bottom: 2px" :inline-message="true">
            <template slot="label">
              <span class="label">生命体征：</span>
            </template>
          </el-form-item>
          <div>
            <el-row>
              <el-col :span="7">
                <el-form-item :show-message="false" prop="T" :inline-message="true">
                  <template slot="label">
                    <span class="subLabel">T(℃)</span>
                  </template>
                  <el-input :disabled="readonly" v-model="form.T"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item :show-message="false" prop="P" :inline-message="true">
                  <template slot="label">
                    <span class="subLabel">P(次/分)</span>
                  </template>
                  <el-input :disabled="readonly" v-model="form.P"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item :show-message="false" prop="HR" :inline-message="true">
                  <template slot="label">
                    <span class="subLabel">HR(次/分)</span>
                  </template>
                  <el-input :disabled="readonly" v-model="form.HR"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="margin-top: 10px">
              <el-col :span="7">
                <el-form-item :show-message="false" prop="R" :inline-message="true">
                  <template slot="label">
                    <span class="subLabel">R(次/分)</span>
                  </template>
                  <el-input :disabled="readonly" v-model="form.R"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item :show-message="false" prop="BP" :inline-message="true">
                  <template slot="label">
                    <span class="subLabel">BP(mmHg)</span>
                  </template>
                  <el-input :disabled="readonly" v-model="form.BP"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item :show-message="false" prop="spo2" :inline-message="true">
                  <template slot="label">
                    <span class="subLabel">spo2(%)</span>
                  </template>
                  <el-input :disabled="readonly" v-model="form.spo2"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--瞳孔光反射-->
          <el-form-item label-position="left" style="margin-bottom: 2px">
            <template slot="label">
              <span class="label">瞳孔光反射：</span>
            </template>
          </el-form-item>
          <div>
            <el-row>
              <el-col :span="7">
                <el-form-item :show-message="false" prop="myleft" :inline-message="true">
                  <template slot="label">
                    <span class="subLabel">左(mm)：</span>
                  </template>
                  <el-input :disabled="readonly" v-model="form.myleft"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item :show-message="false" prop="myright" :inline-message="true">
                  <template slot="label">
                    <span class="subLabel">右(mm)：</span>
                  </template>
                  <el-input :disabled="readonly" v-model="form.myright"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--入量-->
          <div>
            <el-row>
              <el-col :span="7">
                <el-form-item :show-message="false" label-position="left" prop="ruliang" :inline-message="true">
                  <template slot="label">
                    <span class="label">入量：</span>
                  </template>
                  <el-input :disabled="readonly" v-model="form.ruliang"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--出量-->
          <el-form-item label-position="left" style="margin-bottom: 2px">
            <template slot="label">
              <span class="label">出量：</span>
            </template>
          </el-form-item>
          <div>
            <el-row>
              <el-col :span="7">
                <el-form-item :show-message="false" prop="xiaobian" :inline-message="true">
                  <template slot="label">
                    <span class="subLabel">小便(ml)：</span>
                  </template>
                  <el-input :disabled="readonly" v-model="form.xiaobian"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item :show-message="false" prop="dabian" :inline-message="true">
                  <template slot="label">
                    <span class="subLabel">大便(g)：</span>
                  </template>
                  <el-input :disabled="readonly" v-model="form.dabian"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
<!--          床挡保护-->
          <div>
            <el-row>
              <el-col :span="7">
                <el-form-item :show-message="false" label-position="left" prop="bed" :inline-message="true">
                  <template slot="label">
                    <span class="label">床挡保护：</span>
                  </template>
                  <el-input :disabled="readonly" v-model="form.bed"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
<!--          皮肤情况-->
          <div>
            <el-row>
              <el-col :span="7">
                <el-form-item :show-message="false" label-position="left" prop="skin" :inline-message="true">
                  <template slot="label">
                    <span class="label">皮肤情况：</span>
                  </template>
                  <el-input :disabled="readonly" v-model="form.skin"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
<!--          肌力-->
          <el-form-item label-position="left" prop="jili" :inline-message="true">
            <template slot="label">
              <span class="label">肌力：</span>
            </template>
            <el-radio-group v-model="form.jili" :disabled="readonly" disable>
              <el-radio class="radioItem" label="正常"></el-radio>
              <el-radio class="radioItem" label="下降"></el-radio>
              <el-radio class="radioItem" label="查体不配合"></el-radio>
            </el-radio-group>
          </el-form-item>
<!--          翻身卧位-->
          <el-form-item label-position="left" prop="fanshenwowei" :inline-message="true">
            <template slot="label">
              <span class="label">翻身卧位：</span>
            </template>
            <el-radio-group :disabled="readonly" disable v-model="form.fanshenwowei">
              <el-radio disable class="radioItem" label="需要辅助"></el-radio>
              <el-radio class="radioItem" label="自主"></el-radio>
            </el-radio-group>
          </el-form-item>
<!--          是否约束-->
          <el-form-item label-position="left" prop="shifouyueshu" :inline-message="true">
            <template slot="label">
              <span class="label">是否约束：</span>
            </template>
            <el-radio-group :disabled="readonly" v-model="form.shifouyueshu">
              <el-radio disable class="radioItem" label="是"></el-radio>
              <el-radio class="radioItem" label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
<!--          护理意见-->
          <el-form-item :show-message="false" label-position="left" prop="yijian" style="margin-top: 10px" :inline-message="true">
            <template slot="label">
              <span class="label">护理意见：</span>
            </template>
            <el-input
              :disabled="readonly"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="form.yijian"
            ></el-input>
          </el-form-item>
<!--          下次查房时间-->
          <el-form-item label-position="left" prop="nextChafangTime" style="margin-top: 10px" :inline-message="true">
            <template slot="label">
              <span class="label">请选择下次查房时间：</span>
            </template>
            <el-date-picker
              v-model="form.nextChafangTime"
              :disabled="readonly"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </div>
      </div>
      <div class="btn" v-show="!readonly">
        <el-link type="success" style="margin-right: 20px"
        >导入上次记录</el-link
        >
        <el-button size="medium" type="primary" @click="save">确认</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { commitChafangLog } from "@api/chafang/chafang.js";

export default {
  name: "chafangLog",
  props: {
    pid: {
      type: String
    },
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
          BP: "",
          HR: "",
          P: "",
          R: "",
          T: "",
          bed: "",
          dabian: "",
          date: "",
          fanshenwowei: "",
          jili: "",
          myleft: "",
          myright: "",
          nextChafangTime: "",
          ruliang: "",
          shifouyueshu: "",
          skin: "",
          spo2: "",
          xiaobian: "",
          yijian: ""
        };
      }
    }
  },
  data() {
    return {
      form: {
        date: new Date(),
        yishi: "",
        T: "",
        P: "",
        HR: "",
        R: "",
        BP: "",
        spo2: "",
        myleft: "",
        myright: "",
        bed: "",
        skin:"",
        ruliang: "",
        xiaobian: "",
        dabian: "",
        jili: "",
        fanshenwowei: "",
        shifouyueshu: "",
        yijian: "",
        nextChafangTime: ""
      },
      rules: {
        yishi: [{ required: true, message: "请选择", trigger: "blur" }],
        "T": [{ required: true, message: "请选择", trigger: "blur" }],
        "P": [{ required: true, message: "请选择", trigger: "blur" }],
        "HR": [{ required: true, message: "请选择", trigger: "blur" }],
        "R": [{ required: true, message: "请选择", trigger: "blur" }],
        "BP": [{ required: true, message: "请选择", trigger: "blur" }],
        spo2: [
          {
            required: true,
            message: "请选择",
            trigger: "blur",
          },
        ],
        ruliang: [{ required: true, message: "请选择", trigger: "blur" }],

        "myeft": [{ required: true, message: "请选择", trigger: "blur" }],
        "myright": [{ required: true, message: "请填写", trigger: "blur" }],

        "xiaobian": [{ required: true, message: "请填写", trigger: "blur" }],
        "dabian": [{ required: true, message: "请填写", trigger: "blur" }],

        bed: [{ required: true, message: "请填写", trigger: "blur" }],
        skin: [{ required: true, message: "请填写", trigger: "blur" }],

        jili: [{ required: true, message: "请选择", trigger: "blur" }],
        fanshenwowei: [{ required: true, message: "请选择", trigger: "blur" }],
        shifouyueshu: [{ required: true, message: "请选择", trigger: "blur" }],

        nextChafangTime: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        shortcuts: [{
          text: '明天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '三天后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 3);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
    }
  },
  watch: {
    readonly(newValue) {
      if (newValue) {
        this.readonly = newValue;
      }
    },
    preData(newValue) {
      this.form = newValue;
    }
  },
  mounted() {
    this.getPreData();
  },
  methods: {
    getPreData() {
      if (Object.keys(this.preData).length > 0) {
        this.form = this.preData;
      }
    },
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          commitChafangLog(this.form, this.pid).then((res) => {
            if (res) {
              this.form = {};
              this.$emit("closeDiag");
              this.$message.success("新增查房记录成功！");
            } else {
              this.$message.error("提交查房信息失败，请重新提交！");
            }
          });
        } else {
          this.$message.error("请完善查房记录表");
          return false;
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.newChafangLog {
  margin-top: -30px;
  padding: 10px;
  //margin-bottom: 20px;
  //box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.3);
  .header {
    text-align: center;
    .title {
      font-size: 18px;
      color: #1e7e7c;
      font-weight: bold;
    }
  }

  .label {
    font-size: 15px;
    font-weight: bold;
    color: #1e7e7c;
  }
  .subLabel {
    color: #1e7e7c;
  }
  .selectItem {
    width: 100%;
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
    margin-top: 20px;
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
.newChafangLog {
  //.el-form-item__content {
  //  line-height: 25px;
  //}
  //.el-form-item__label {
  //  line-height: 25px;
  //}
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
}
</style>