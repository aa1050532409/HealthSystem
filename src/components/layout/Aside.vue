<template>
  <aside class="sidebar">
    <el-menu
      class="sidebar-menu"
      :router="true"
      background-color="transparent"
      text-color="white"
      :default-active="this.activeItem"
      :unique-opened="true"
    >
      <template v-for="menu in user.accessMenu">
        <el-menu-item
          v-if="menu.children.length == 0"
          :key="menu.FunctionName"
          :index="menu.FunctionAddress"
        >
          <i :class="menu.icon" class="iconfont" v-if="menu.icon"></i>
          <span slot="title" class="mainTitle">{{ menu.FunctionName }}</span>
        </el-menu-item>
        <el-submenu v-else :key="menu.FunctionID" :index="menu.FunctionAddress">
          <template slot="title">
            <i :class="menu.icon" class="iconfont" v-if="menu.icon"></i>
            <span slot="title" class="mainTitle">{{ menu.FunctionName }}</span>
          </template>
          <template v-for="item in menu.children">
            <el-menu-item
              v-if="item.children.length == 0"
              :key="item.FunctionID"
              :index="item.FunctionAddress"
            >
              <span class="subTitle">{{ item.FunctionName }}</span>
            </el-menu-item>
            <the-submenu
              :key="item.FunctionID"
              :subMenu="item"
              v-else
            ></the-submenu>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </aside>
</template>

<script>
import SubAside from "./SubAside.vue";
export default {
  name: "Aside",
  components: {
    "the-submenu": SubAside,
  },
  data() {
    return {
      activeItem: "",
      openNav: true,
      user: {
        accessMenu: [],
      },
      indexList: [],
    };
  },

  watch: {
    $route(to, from) {
      console.log(this.$route.meta);
      this.activeItem = this.$route.meta.activeRoute;
      // if (this.indexList.indexOf(this.$route.path) != -1) {
      //   console.log("to");
      //   this.activeItem = this.$route.path;
      // }
    },
  },
  methods: {},
  mounted() {
    let indexList = [];
    function indexScan(functionList, indexList) {
      functionList.forEach((element) => {
        if (element.children.length == 0) {
          indexList.push(element.FunctionAddress);
        } else {
          indexScan(element.children, indexList);
        }
      });
    }

    this.user.accessMenu = JSON.parse(localStorage.getItem("function"));
    indexScan(this.user.accessMenu, indexList);
    this.indexList = indexList;
  },
};
</script>

<style scoped lang="scss">
.sidebar {
  // position: absolute;
  float: left;
  width: 240px;
  height: 100%;
  overflow: auto;
  background-image: linear-gradient(to bottom, #1c7e7c, #9adfbf);
  .sidebar-menu {
    border: none;
    height: 100%;
    .mainTitle {
      font-size: 24px;
    }
    .subTitle {
      font-size: 20px;
    }
    i {
      font-size: 24px;
      color: white;
      margin-right: 20px;
    }
  }
}
</style>
<style lang="scss">
.el-menu-item.is-active {
  color: #ffd79d;
}
.el-submenu__title i {
  color: white;
}
</style>