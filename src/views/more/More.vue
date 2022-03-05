<template>
  <div>
    <div class="rollpic">
      <el-carousel :interval="5000" type="card" height="200px">
        <el-carousel-item
          v-for="item in this.$store.getters.recommend.imgList"
          :key="item.id"
        >
          <a href="http://www.baidu.com" target="_blank">
            <h3 class="medium">
              <img :src="item.AdvertisingImage" />
            </h3>
          </a>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="adContent">
      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="(item, index) in this.$store.getters.recommend.collapseDate"
          :key="item.id"
          :name="index"
        >
          <template slot="title">
            <h3 class="title">{{ item.title }}</h3>
          </template>
          <div class="cardContainer">
            <div class="cardInfo" v-for="card in item.content" :key="card.id">
              <img :src="card.AdvertisingImage" alt />
              <span>
                <a href="/">{{ card.AdvertisingContent }}</a>
              </span>
            </div>
            <div></div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script type="text/javascript">
import { getAdvertisement } from "../../api/more/more.js";
export default {
  name: "More",
  data() {
    return {
      activeNames: [0, 1],
    };
  },
  methods: {},
  created() {
    getAdvertisement();
  },
};
</script >

<style scoped lang="scss">
.rollpic {
  width: 90%;
  margin: 20px auto;
}
.adContent {
  width: 90%;
  margin: 10px auto;
  a {
    color: #1c7e7c;
    white-space: no-wrap;
  }
  .title {
    font-size: 20px;
    color: #1c7e7c;
  }
  .cardContainer {
    width: 95%;
    margin-top: 10px;
    .cardInfo {
      margin-bottom: 10px;
      float: left;
      width: 50%;
      border-left: 5px solid #eff3f4;
      padding-left: 20px;
      img {
        float: left;
        width: 20%;
        height: 100px;
      }
      span {
        float: left;
        height: 100px;
        width: 60%;
        margin-left: 20px;
        font-size: 18px;
        overflow: hidden;
      }
    }
  }
}
</style>

