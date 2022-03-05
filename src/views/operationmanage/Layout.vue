<template>
  <div :key="this.$store.state.operationManage.currentPid">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>
