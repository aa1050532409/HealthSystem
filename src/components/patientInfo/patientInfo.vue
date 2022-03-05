<template>
  <div>
    <div class="personInfo clearFloat">
      <div class="pic">
        <!-- <el-image
         
          :src="patient.pic"
          fit="fill"
          >加载中</el-image
        > -->
        <img
          style="width: 150px; height: 150px; margin-top: calc(50% - 75px)"
          :src="patient.pic"
          alt=""
        />
      </div>
      <div class="info clearFloat">
        <!-- <div v-if="patient.name" class="info-column3">姓名：{{ patient.name }}</div>
        <div v-if="patient.gender" class="info-column3">性别：{{ patient.gender }}</div>
        <div v-if="patient.age" class="info-column3">年龄：{{ patient.age }}</div> -->
        <div v-if="patient.name" class="info-column3">{{ patient.name }}</div>
        <div v-if="patient.gender" class="info-column3">{{ patient.gender }}</div>
        <div v-if="patient.age" class="info-column3">
          {{ patient.age + " 岁" }}
        </div>
        <div v-if="patient.hospitalId" class="info-column2">
          住院号：{{ patient.hospitalId }}
        </div>
        <div v-if="patient.userId" class="info-column2">
          患者账号：{{ patient.userId }}
        </div>

        <div v-if="patient.pid" class="info-column2">就诊号：{{ patient.pid }}</div>

        <div v-if="patient.tel" class="info-column2">联系方式：{{ patient.tel }}</div>
        <div v-if="patient.origin" class="info-column2">
          患者来源：{{ patient.origin }}
        </div>
        <div v-if="patient.address" class="info-column2">
          家庭住址：{{ patient.address }}
        </div>
        <div v-if="patient.diagTime" class="info-column2">
          问诊时间：{{ patient.diagTime }}
        </div>
        <div v-if="patient.hospitalTime" class="info-column2">
          入院时间：{{ patient.hospitalTime }}
        </div>
        <div v-if="patient.others" class="info-column2">其他：{{ patient.others }}</div>
        <div class="info-column2">
          <slot name="btn"></slot>
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
          address: "null",
          age: "null",
          gender: "null",
          name: "王阿兰",
          diagTime: "xxxxxxxxx",
          pic: "",
          tel: "null",
          origin: "门诊患者",
          others: "患者申请普通会诊",
        };
      },
    },
  },
};
</script>

<style scoped lang="scss">
.personInfo {
  width: 100%;
  min-height: 200px;
  padding: 0 5%;
  .pic {
    width: 200px;
    height: 200px;
    float: left;
    text-align: center;
  }
  .info {
    width: calc(100% - 200px);
    min-height: 200px;
    float: left;
    padding: 30px 20px 40px 80px;
    font-size: 18px;
    position: relative;
    border-left: 5px solid $mainBackgroundColor;
    .info-column3 {
      width: 25%;
      float: left;
    }
    .info-column2 {
      width: 50%;
      float: left;
      margin-top: 25px;
    }
    .method {
      position: absolute;
      right: 20%;
      bottom: 30px;
    }
  }
}
</style>
