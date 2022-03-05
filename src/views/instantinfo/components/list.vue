<template>
  <div id="list">
    <ul>
      <li
        v-for="item in sessions"
        :key="item.id"
        :class="{ active: item.id === currentSessionId }"
        v-on:click="changeCurrentSessionId(item.id)"
      >
        <!--   :class="[item.id === currentSessionId ? 'active':'']" -->
        <img class="avatar" :src="item.user.img" :alt="item.user.name" />
        <p class="name">{{item.user.name}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "list",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      sessions: state => state.instantInfo.sessions,
      currentSessionId: state => state.instantInfo.currentSessionId
    })
  },
  methods: {
    changeCurrentSessionId: function(id) {
      this.$store.commit("instantInfo/changeCurrentSessionId", id);
    }
  }
};
</script>

<style lang="scss" scoped>
#list {
  li {
    padding: 12px 15px;
    // border-bottom: 1px solid #fff;
    cursor: pointer;
    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
  li.active {
    /*注意这个是.不是冒号:*/
    background-color: rgba(255, 255, 255, 0.3);
  }
  .avatar {
    border-radius: 2px;
    width: 30px;
    height: 30px;
    vertical-align: middle;
  }
  .name {
    display: inline-block;
    margin-left: 15px;
  }
}
</style>
