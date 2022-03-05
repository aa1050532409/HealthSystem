<template functional>
  <el-submenu v-on="listeners" :key="data.key" :index="data.attrs.subMenu.FunctionAddress">
    <template slot="title">
      <span class="subTitle" slot="title">{{data.attrs.subMenu.FunctionName}}</span>
    </template>
    <template v-for="item in data.attrs.subMenu.children">
      <el-menu-item v-if="item.children.length==0"  :key="item.FunctionName" :index="item.FunctionAddress">
        <span class="subTitle">{{item.FunctionName}}</span>
      </el-menu-item>
      <the-submenu  v-else :subMenu="item" :key="item.FunctionName"></the-submenu>
    </template>
  </el-submenu>
</template>

<script>
export default {
  methods:{
    
  },
}
</script>