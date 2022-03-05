<template>
  <div @click="areaClick" v-if="boxFlag" class="container">
    <div class="showArea">
      <div v-if="choosedData.length == 0">暂无</div>
      <div>
        <el-tag
          class="tagItem"
          v-for="(tag, index) in choosedData"
          @close="tagRemove(index, choosedData)"
          :key="tag.id"
          closable
          >{{ tag }}</el-tag
        >
      </div>
    </div>
    <div class="inputArea">
      <el-input
        ref="input"
        @keydown.native="select($event)"
        @input="choose($event)"
        @blur="inputBlur"
        v-model="value"
        class="input"
        placeholder="请输入首字母"
      ></el-input>
    </div>
    <div class="selectArea">
      <template>
        <span
          v-for="(item, index) in options.slice(
            currentPage * 5,
            currentPage * 5 + 5
          )"
          :key="item.id"
          >{{ index + 1 }}、{{ item }}</span
        >
      </template>
      <span v-if="options.length == 0">无</span>
      <span v-if="currentPage * 5 + 5 < options.length">
        <i class="el-icon-more"></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [
          {
            value: "123",
            pinyin: "x"
          },
          {
            value: "123",
            pinyin: "x"
          },
          {
            value: "123",
            pinyin: "x"
          },
          {
            value: "123",
            pinyin: "x"
          },
          {
            value: "123",
            pinyin: "x"
          }
        ];
      }
    },
    flag: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    preValue: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  watch: {
    choosed: function(newValue) {
      if (this.choosed && this.choosed != "") {
        this.$emit("select", newValue);
        this.choosed = "";
        this.$refs.input.focus();
      }
    },
    value: function() {
      this.currentPage = 0;
    },
    result: function() {
      this.$emit("result", this.result);
    },
    boxFlag: function(value) {
      if (value) {
        setTimeout(() => {
          this.$refs["input"].focus();
        });

        if (this.preValue) {
          this.choosedData = this.preValue.split("，");
        } else {
          this.choosedData = [];
        }
      }
    }
  },
  computed: {
    options: function() {
      let opt = [];
      this.data.forEach(e => {
        if (e.pinyin.toUpperCase().includes(this.value.toUpperCase())) {
          opt.push(e.value);
        }
      });
      return opt;
    },
    result: function() {
      return this.choosedData.join("，");
    }
  },
  data() {
    return {
      boxFlag: false,
      value: "",
      choosed: "",
      currentPage: 0,
      timer: 0,
      choosedData: []
    };
  },
  methods: {
    choose(e) {
      this.value = this.value.replace(/[\W]/g, "");
      this.value = this.value.replace(/[0-9]+$/, "");
    },
    inputBlur() {
      this.timer = setTimeout(() => {
        this.boxFlag = false;
      }, 200);
    },
    select(e) {
      if (e.keyCode == 187 && this.currentPage * 5 + 5 < this.options.length) {
        this.currentPage++;
      }
      if (e.keyCode == 189 && this.currentPage > 0) {
        this.currentPage--;
      }
      if (e.keyCode == 13 || e.keyCode == 27) {
        this.inputBlur();
      }
      let index = e.keyCode - 49;
      if (index < 5 && index >= 0) {
        if (this.options[index]) {
          this.choosedData.push(this.options[index]);
          this.value = "";
        }
      }
    },
    tagRemove(index) {
      this.choosedData.splice(index, 1);
      clearTimeout(this.timer);
      this.$refs.input.focus();
    },
    areaClick() {
      clearTimeout(this.timer);
      this.$refs.input.focus();
    }
  },
  mounted() {
    if (this.preValue) {
      this.choosedData = this.preValue.split("，");
    } else {
      this.choosedData = [];
    }
  }
};
</script>

<style lang="scss"  scoped>
.container {
  z-index: 10000;
  right: 5%;
  position: fixed !important;
  bottom: 0px;
  width: calc(90% - 240px);
  box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.2);
  padding: 5px 5px 20px 5px;
  background-color: #fff;
}
.showArea {
  .tagItem {
    margin: 10px;
  }
}
.inputArea {
  height: 50px;
  width: 100%;
}
.input {
  height: 100%;
}
.selectArea > span {
  margin-right: 20px;
}
</style>