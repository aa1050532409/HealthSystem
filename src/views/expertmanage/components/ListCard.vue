<template>
  <div class="cardBox">
    <div @click="getDetails" class="img">
      <img v-if="cardInfo.img" :src="cardInfo.img" alt="" />
      <img v-else src="../../../assets/img/default/null.png" alt="" />
    </div>
    <div class="info">
      <div class="name mainLabel">
        <span @click="getDetails">
          {{ this.cardInfo.name }}
        </span>
        <el-button
          size="mini"
          style="float: right"
          @click="$emit('discard', cardInfo.id)"
          type="danger"
          >解散</el-button
        >
      </div>
      <div class="introduction mt10">
        <span @click="getDetails">
          {{ this.cardInfo.introduction }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    cardInfo: {
      default: () => {
        return {
          id: "id",
          img: "http://upload.cd3120.com/2019/0221/20190221103152258.jpg",
          name: "xxx2",
          introduction: "xxx3",
        };
      },
    },
  },
  methods: {
    getDetails() {
      this.$emit("details", this.cardInfo.id);
    },
  },
};
</script>

<style scoped lang="scss">
.cardBox {
  height: 200px;
  width: 100%;
  border-radius: 10px;
  padding-left: 10px;
  border-left: 10px solid #eff3f4;
  border-top: 10px solid white;
  border-bottom: 10px solid white;
  display: flex;
  .img {
    flex-shrink: 0;
    width: 200px;
    cursor: pointer;
    img {
      width: 200px;
      height: 100%;
    }
  }
  .info {
    width: 80%;
    margin-left: 20px;
    text-overflow: ellipsis;
    span {
      cursor: pointer;
    }
    span:hover {
      text-decoration: underline;
    }
  }
}
</style>
