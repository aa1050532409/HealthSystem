<template>
  <div :key="$store.state.patientDiag.currentPid">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>
