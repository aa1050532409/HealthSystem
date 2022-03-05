<template>
  <div @click="areaClick" v-show="flag" class="container">
    <div class="showArea">
      <div v-if="(preValue.length==0)">暂无</div>
      <div>
        <el-tag
          class="tagItem"
          v-for="(tag,index) in preValue"
          @close="tagRemove(index,preValue)"
          :key="tag.id"
          closable
        >{{tag}}</el-tag>
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
          v-for="(item,index) in options.slice(currentPage*5,currentPage*5+5)"
          :key="item.id"
        >{{index +1}}、{{item}}</span>
      </template>
      <span v-if="options.length==0">无</span>
      <span v-if="currentPage*5+5<options.length">
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
        return [];
      }
    },
    flag: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    preValue: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  watch: {
    choosed: function(newValue) {
      if (this.choosed && this.choosed != "") {
        this.$emit("select", newValue);
        this.choosed = "";
      }
    },
    flag: function(newflag) {
      if (newflag) {
        setTimeout(() => {
          this.$refs.input.focus();
        }, 100);
      }
    },
    value: function() {
      this.currentPage = 0;
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
    }
  },
  data() {
    return {
      value: "",
      choosed: "",
      currentPage: 0,
      timer: 0
    };
  },
  methods: {
    choose(e) {
      this.value = this.value.replace(/[\W]/g, "");
      this.value = this.value.replace(/[0-9]+$/, "");
    },
    inputBlur() {
      this.timer = setTimeout(() => {
        this.$emit("blur");
      }, 200);
    },
    select(e) {
      console.log(e);
      if (e.keyCode == 187 && this.currentPage * 5 + 5 < this.options.length) {
        console.log("+");
        console.log(this.currentPage);
        console.log(this.options.length);
        this.currentPage++;
      }
      if (e.keyCode == 189 && this.currentPage > 0) {
        console.log("-");
        this.currentPage--;
      }
      if (e.keyCode == 13 || e.keyCode == 27) {
        this.inputBlur();
      }
      let index = e.keyCode - 49;
      if (index < 5 && index >= 0) {
        if (this.options[index]) {
          this.choosed = this.options[index];
          this.value = "";
        }
      }
    },
    tagRemove(index) {
      this.$emit("delete", index);
      clearTimeout(this.timer);
      this.$refs.input.focus();
    },
    areaClick() {
      clearTimeout(this.timer);
      this.$refs.input.focus();
    }
  }
};
</script>

<style lang="scss"  scoped>
.container {
  width: 100%;
  display: fixed;
  bottom: 0px;
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