<template>
  <div :key="this.$store.state.followManage.currentPid">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>