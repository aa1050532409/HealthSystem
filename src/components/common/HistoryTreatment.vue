<template>
  <div class="checkbox"></div>
</template>

<script>
// 患者诊断中填写诊断结论、病情、治疗方案描述时候的复选组件
export default {
  name: "CheckBox",
  props: {
    options: Array,
    checked: Array
  },
  computed: {},

  data() {
    return {
      currentPage=1,
      history: []
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
</style>