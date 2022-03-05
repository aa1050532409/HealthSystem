<template>
  <div class="message">
    <div class="sidebar">
      <card></card>
      <list></list>
    </div>
    <div class="main">
      <message></message>
      <usertext></usertext>
    </div>
  </div>
</template>

<script>
import card from "./components/card.vue";
import list from "./components/list.vue";
import message from "./components/message.vue";
import usertext from "./components/usertext.vue";

export default {
  name: "app",
  data() {
    return {};
  },
  mounted: function() {},
  components: {
    card,
    list,
    message,
    usertext
  }
};
</script>

<style lang="scss" scoped>
.message {
  margin: auto;
  width: 100%;
  height: calc(100vh - 130px);
  overflow: hidden;
  border-radius: 5px;
  .sidebar,
  .main {
    height: 100%;
  }
  .sidebar {
    float: right;
    color: #f4f4f4;
    background-image: linear-gradient(75deg, #409eff, #67c23a);
    width: 250px;
  }
  .main {
    position: relative;
    overflow: hidden;
    background-color: #eee;
  }
}
</style>