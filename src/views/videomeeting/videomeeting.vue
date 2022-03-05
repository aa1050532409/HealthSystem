<template>
  <div>
    <videoMeeting :name="name" :id="id" :pwd="pwd"></videoMeeting>
  </div>
</template>

<script>
import videoMeeting from "@components/videoMeeting/Meeting.vue";
export default {
  components: {
    videoMeeting,
  },
  data() {
    return {
      name: "",
      id: "96900243177",
      pwd: "",
    };
  },
  created() {
    this.name = this.$route.query.name || "";
    this.pwd = this.$route.query.pwd || "";
    this.id = this.$route.query.id || "96900243177";
  },
  methods: {},
};
</script>

<style lang="scss"></style>
