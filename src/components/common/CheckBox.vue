<template>
  <div class="checkbox">
    <div>
      <div class="tag">
        <div v-if="(checkedList.length==0)">暂无</div>
        <div>
          <el-tag
            class="tagItem"
            v-for="(tag,index) in checkedList"
            @close="tagRemove(index,checkedList)"
            :key="tag.id"
            closable
          >{{tag}}</el-tag>
        </div>
      </div>
      <span>搜索：</span>
      <el-input v-model="str" class="search" size="mini"></el-input>
    </div>
    <el-checkbox-group v-model="checkedList">
      <el-checkbox
        v-for="item in pages.slice((currentPage-1)*num,(currentPage-1)*num+10)"
        :key="item.id"
        :label="item"
        @change="$emit('input',checkedList)"
      ></el-checkbox>
    </el-checkbox-group>
    <div class="page">
      <el-link v-show="currentPage>1" @click="prePage">上一页</el-link>
      <el-link type="primary" v-show="(currentPage)*num<pages.length" @click="nextPage">下一页</el-link>
    </div>
  </div>
</template>

<script>
// 患者诊断中填写诊断结论、病情、治疗方案描述时候的复选组件
export default {
  name: "CheckBox",
  props: {
    options: Array,
    checked: Array
  },
  computed: {
    pages: function() {
      let target = [];
      this.options.forEach(element => {
        if (element.pinyin.toUpperCase().includes(this.str.toUpperCase())) {
          target.push(element.value);
        }
      });
      return target;
    }
  },
  watch: {
    pages: function() {
      this.currentPage = 1;
    },
    checked: function(newChecked) {
      this.checkedList = JSON.parse(JSON.stringify(this.checked));
    }
  },
  data() {
    return {
      str: "",
      checkedList: [],
      currentPage: 1,
      num: 10
    };
  },
  methods: {
    prePage() {
      this.currentPage = this.currentPage - 1;
    },
    nextPage() {
      this.currentPage = this.currentPage + 1;
    },
    tagRemove(index, array) {
      array.splice(index, 1);
      this.$emit("input", this.checkedList);
    }
  },
  mounted() {
    this.checkedList = JSON.parse(JSON.stringify(this.checked));
  }
};
</script>

<style lang="scss" scoped>
.search {
  width: 150px;
  margin-bottom: 5px;
  margin-top: 5px;
}
.page {
  float: right;
  margin-right: 50px;
}
.tag {
  margin-bottom: 5px;
  .tagItem {
    margin-right: 10px;
  }
}
</style>