<template>
  <div class="cardContainer">
    <div class="flexBox">
      <div class="pic">
        <el-image
          style="width: 50px; height: 50px; margin-top: calc(50% - 25px)"
          :src="patient.pic"
          fit="fill"
        ></el-image>
      </div>
      <div class="info">
        <div>
          <span>姓名:{{ patient.name }}</span>
          <span style="margin-left: 10px">性别:{{ patient.gender }}</span>
          <span style="margin-left: 10px">年龄:{{ patient.age }}</span>
        </div>
        <div>身份号码:{{ patient.identity }}</div>
        <div>患者账号:{{ patient.userId }}</div>
        <div>联系方式:{{ patient.tel }}</div>
        <div
          style="
            width: 150px;
            word-break: keep-all;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          "
        >
          家庭住址:{{ patient.address }}
        </div>
        <div class="btn">
          <el-button @click="select" size="mini" type="success">查看</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    patient: {
      type: Object,
      default: () => {
        return {
          userId: "18280327592",
          identity: "511922111111111111",
          address: "王阿兰王阿王阿兰王阿王阿兰王阿王阿兰王阿",
          age: "null",
          gender: "null",
          name: "王阿兰",
          pic:
            "https://182.92.234.28:3000/readload?url=chatfile/d3e6d7f98e54794ed784460567eb36bd.png",
          tel: "null",
        };
      },
    },
  },

  methods: {
    select() {
      this.$emit("select");
    },
  },
};
</script>

<style lang="scss" scoped>
.cardContainer {
  width: 100%;
  height: 100px;
  background-color: $mainBackgroundColor;

  .flexBox {
    display: flex;
    .pic {
      width: 80px;
      height: 80px;
      text-align: center;
      flex-shrink: 0;
    }
    .info {
      width: 100%;
      padding: 5px;
      display: flex;
      flex-direction: column;
      font-size: 13px;
      position: relative;
      .btn {
        position: absolute;
        right: 10px;
        bottom: 5px;
      }
    }
  }
}
</style>
