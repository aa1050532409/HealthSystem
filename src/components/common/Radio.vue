<template>
  <div class="checkbox clearfix">
    <div>
      <el-radio-group v-model="radio">
        <template v-if="type=='doc'">
          <el-radio
            class="radio"
            v-for="item in options.slice((currentPage-1)*num,(currentPage-1)*num+10)"
            :key="item.id"
            :label="JSON.stringify(item)"
          >{{item.docName}}</el-radio>
        </template>
        <template v-if="type=='nur'">
          <el-radio
            class="radio"
            v-for="item in options.slice((currentPage-1)*num,(currentPage-1)*num+10)"
            :key="item.id"
            :label="JSON.stringify(item)"
          >{{item.nurName}}</el-radio>
        </template>
        <template v-if="type=='org'">
          <el-radio
            class="radio"
            v-for="item in options.slice((currentPage-1)*num,(currentPage-1)*num+10)"
            :key="item.id"
            :label="JSON.stringify(item)"
          >{{item.orgName}}</el-radio>
        </template>
      </el-radio-group>
    </div>
    <div class="page">
      <el-link v-show="currentPage>1" @click="prePage">上一页</el-link>
      <el-link type="primary" v-show="(currentPage)*num<options.length" @click="nextPage">下一页</el-link>
    </div>
  </div>
</template>

<script>
// 患者诊断中选择医疗机构信息的单选组件
export default {
  name: "CheckBox",
  props: {
    options: Array || [],
    type: String || ""
  },
  watch: {
    radio: function(newRadio) {
      if (newRadio) {
        this.checked = JSON.parse(newRadio);
      }
      if (this.type == "doc") {
        let obj = {};
        obj.API_docId = this.checked.docId;
        obj.API_docName = this.checked.docName;
        this.$emit("input", obj);
      } else if (this.type == "nur") {
        let obj = {};
        obj.API_nurId = this.checked.nurId;
        obj.API_nurName = this.checked.nurName;
        this.$emit("input", obj);
      } else {
        this.$emit("input", this.checked);
      }
    },
    options: function() {
      this.radio = "";
    }
  },
  data() {
    return {
      str: "",
      checked: "",
      currentPage: 1,
      num: 10,
      radio: ""
    };
  },
  methods: {
    prePage() {
      this.currentPage = this.currentPage - 1;
    },
    nextPage() {
      this.currentPage = this.currentPage + 1;
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.page {
  float: right;
  margin-right: 50px;
}
.clearfix:after {
  content: ""; /*设置内容为空*/
  height: 0; /*高度为0*/
  line-height: 0; /*行高为0*/
  display: block; /*将文本转为块级元素*/
  visibility: hidden; /*将元素隐藏*/
  clear: both; /*清除浮动*/
}
.radio {
  margin: 20px;
}
</style>