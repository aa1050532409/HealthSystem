<template>
  <div>
    <div v-if="!readonly" class="container">
      <div class="leftBox">
        <div class="clearFloat">
          <el-link style="float: right" @click="importFlag = true" type="success"
            >导入诊断结论</el-link
          >
        </div>
        <div style="font-size: 16px; font-weight: bolder" v-if="tempDR.length == 0">
          暂无
        </div>

        <div v-for="(item, index) in tempDR" :key="index">
          <div>
            <h3 style="float: left">{{ item.head + "：" }}</h3>
            <span @click="descriptionClose(index)" class="closeBtn" style="float: right"
              >X</span
            >
            <div style="clear: both; height: 0"></div>
          </div>

          <div>
            <MyInput
              :value="item.content.split('，')"
              @input="input($event, item)"
              type="diag"
            ></MyInput>
          </div>
        </div>
      </div>

      <div class="rightBox">
        <DiagResultBox @select="areaSelect($event)"></DiagResultBox>
      </div>
    </div>
    <div v-else class="box">
      <p>
        {{ preData.join("；") }}
      </p>
    </div>
    <DiagResultAreatypeImport
      @import="importDiagResult($event)"
      v-model="importFlag"
    ></DiagResultAreatypeImport>
  </div>
</template>

<script>
// 患者诊断中填写诊断结论的组件
export default {
  data() {
    return {
      tempDR: [],
      DR: "",
      importFlag: false,
    };
  },
  props: {
    preData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    finalDiagResult: function (value) {
      if (value == "") {
        this.$emit("input", []);
      } else {
        this.$emit("input", this.finalDiagResult.split("；"));
      }
    },
  },
  computed: {
    finalDiagResult: function () {
      let arr = [];
      this.tempDR.forEach((item) => {
        if (item.content) {
          arr.push(item.head + "：" + item.content);
        }
      });
      return arr.join("；");
    },
  },
  methods: {
    areaSelect(data) {
      let tempStr = data.side + "-" + data.area;
      let flag = true;
      this.tempDR.forEach((item) => {
        if (item.head == tempStr) {
          // this.$refs[data.id][0].focus();
          flag = false;
        }
      });
      if (flag) {
        this.tempDR.push({ head: tempStr, content: "", id: data.id });
        setTimeout(() => {
          // this.$refs[data.id][0].focus();
        });
      }
    },
    descriptionClose(target) {
      this.tempDR.splice(target, 1);
    },
    input(data, target) {
      target.content = data.join("，");
    },
    importDiagResult(data) {
      let importDR = data.map((item) => {
        let obj = {
          head: "",
          content: "",
        };
        obj.head = item.split("：")[0];
        obj.content = item.split("：")[1];
        return obj;
      });
      this.tempDR = importDR;
    },
  },
  mounted() {
    setTimeout(() => {
      if (!this.readonly) {
        this.importDiagResult(this.preData);
      }
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  .leftBox {
    margin-left: 2.5%;
    width: 100%;
    padding-right: 50px;
  }
  .rightBox {
    margin-right: 50px;
    flex-shrink: 0;
  }
}
.box {
  width: 95%;
  min-height: 100px;
  margin: 5px auto 0px;
  border: 1px solid #e4e7ed;
  p {
    word-wrap: break-word;
    font-size: 18px;
    text-indent: 20px;
  }
}
.closeBtn {
  cursor: pointer;
}
</style>
