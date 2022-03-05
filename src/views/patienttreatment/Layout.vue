<template>
  <div :key="this.$store.state.patientTreatment.currentPid">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>