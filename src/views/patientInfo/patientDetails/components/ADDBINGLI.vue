<template>
  <div class="addBingliBox">
    <div>
      <h2 class="title">新增患者病历</h2>
    </div>
    <el-form size="small" label-width="0px">
      <div>
        <el-row>
          <el-col :span="10">
            <div>
              <el-form-item>
                <span class="label">诊断专家</span>
                <el-input v-model="BingLi.expert" style="width:200px">
                </el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div>
              <el-form-item>
                <span class="label">就诊时间</span>
                <el-date-picker
                  v-model="BingLi.date"
                  value-format="timestamp"
                  style="width:200px"
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <span class="label">
          病情概况
        </span>
        <el-link type="success" class="import">导入病情概况</el-link>
        <div>
          <MyInput v-model="BingLi.state"></MyInput>
        </div>
      </div>
      <div>
        <span class="label">
          患者病史
        </span>
        <el-link type="success" class="import">导入患者病史</el-link>
        <div>
          <div>
            <span class="sublabel">
              过敏史
            </span>
            <div>
              <el-input
                v-model="BingLi.history.guoming"
                type="textarea"
              ></el-input>
            </div>
          </div>
          <div>
            <span class="sublabel">
              家族史
            </span>
            <div>
              <el-input
                v-model="BingLi.history.jiazu"
                type="textarea"
              ></el-input>
            </div>
          </div>
          <div>
            <span class="sublabel">
              既往史
            </span>
            <div>
              <el-input
                v-model="BingLi.history.jiwang"
                type="textarea"
              ></el-input>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span class="label">检查结果</span>
        <el-upload
          list-type="picture-card"
          action="/api/upload"
          :before-upload="beforeImgUpload"
          :on-success="imgSuccess"
          :headers="uploadToken"
          :auto-upload="true"
          :show-file-list="true"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div>
        <span class="label">
          诊断结论
        </span>
        <el-link type="success" class="import">导入病情概况</el-link>
        <MyInput type="diag" v-model="BingLi.zhenduanjielun"></MyInput>
      </div>
      <div>
        <span class="label">
          治疗方案
        </span>
        <el-link type="success" class="import">导入治疗方案</el-link>
        <div>
          <MyInput type="treat" v-model="BingLi.zhiliaofangan.text"></MyInput>
        </div>
        <div>
          <PrescriptionEdit
            v-model="BingLi.zhiliaofangan.chufang"
          ></PrescriptionEdit>
        </div>
      </div>
      <div>
        <span class="label">
          是否住院
        </span>
        <div>
          <el-radio-group v-model="BingLi.shifouzhuyuan">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </div>
      </div>
    </el-form>
    <div>
      <el-button
        @click="confirm"
        type="primary"
        size="small"
        style="float:right;width:80px;"
      >
        确定
      </el-button>
      <el-button
        @click="cancel"
        type="danger"
        size="small"
        style="float:right;width:80px;margin-right:20px"
      >
        取消
      </el-button>
      <div style="clear:both;height:0"></div>
    </div>
  </div>
</template>

<script>
import PrescriptionEdit from "@components/common/PrescriptionEdit.vue";

export default {
  components: {
    PrescriptionEdit
  },
  data() {
    return {
      uploadToken: {
        Authorization: localStorage.getItem("token")
      },
      stateOpthions: [],
      resultOptions: [],
      treatmentOptions: [],
      BingLi: {
        expert: "",
        date: "",
        state: [],
        history: {
          guoming: "",
          jiazu: "",
          jiwang: ""
        },
        jianchajieguo: [],
        zhenduanjielun: [],
        shifouzhuyuan: "",
        zhiliaofangan: {
          text: [],
          chufang: []
        }
      }
    };
  },
  methods: {
    confirm() {
      this.BingLi.name=this.$store.state.patientInfo.currentPatientName
      this.$emit("confirm", this.BingLi);
    },
    cancel() {
      this.$emit("hidden");
    },
    imgSuccess(res, files, fileList) {
      console.log(res);
      this.BingLi.jianchajieguo.push(res.downloadurl);
    },
    beforeImgUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg";
      if (!isJPG) {
        this.$message.error("只能发送png或jpg图片");
      }
      return isJPG;
    }
  }
};
</script>

<style scoped lang="scss">
.addBingliBox {
  width: 95%;
  padding: 20px;

  box-shadow: 5px 5px 5px 3px gray;
  margin: 20px auto;
  .title {
    text-align: center;
    color: #1c7e7c;
    margin: 0 0 20px 0;
  }
  .label {
    margin-right: 20px;
    font-size: 16px;
    color: #1c7e7c;
  }
  .sublabel {
    margin-right: 20px;
    font-size: 14px;
  }
  .textBox {
    width: 100%;
    min-height: 60px;
    padding: 10px;
    border: 1px solid lightgray;
    border-radius: 5px;
  }
}
.clearfloat ::after {
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
}
.import ::before {
  content: "+";
}
.import {
  float: right;
}
</style>