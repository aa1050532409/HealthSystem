<template>
  <el-dropdown @command="select">
    <span class="el-dropdown-link secondLabel">
      {{ value.label }}
      <i
        v-show="Options && Options.length > 0"
        style="float: right; line-height: 26px"
        class="el-icon-arrow-down el-icon--right"
      ></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <template v-for="item in Options">
        <el-dropdown-item
          v-if="item.label != value.label"
          :command="item"
          :key="item.id"
          >{{ item.label }}</el-dropdown-item
        >
      </template>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
    Options: {
      type: Array,
      default: () => {
        return [
          {
            label: "姓名",
            value: "name",
          },
        ];
      },
    },
  },
  data() {
    return {
      currentLabel: "",
    };
  },
  methods: {
    select(item) {
      // this.currentLabel = item.label;
      this.$emit("input", item);
    },
  },
};
</script>

<style lang="scss">
.el-dropdown-link {
  display: inline-block;
  width: 200px;
  height: 30px;

  padding: 2px;

  // background-color: pink;
  background-color: $mainBackgroundColor;
  border-radius: 5px;
  line-height: 26px;
  text-align: center;
  cursor: pointer;
}
// .el-dropdown-link::after {
//   content: "";
//   width: 12px;
//   height: 12px;
//   border: solid $mainColor;
//   border-width: 2px 2px 0 0;
//   transform: translate(-50%, -50%) rotate(-45deg);
// }
.el-icon-arrow-down {
  font-size: 12px;
}
</style>