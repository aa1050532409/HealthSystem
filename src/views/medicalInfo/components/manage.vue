<template>
  <div class="manage">
    <el-row v-for="item in showTable" :key="item.key">
      <el-col :span="22" :offset="1">
        <div class="card leftLine">
          <el-col :span="5">
            <div class="pic">
              <img v-if="item.ExpertImage" :src="item.ExpertImage" alt />
              <img v-else src="@assets/img/default/null.png" alt />
            </div>
          </el-col>
          <el-col :span="18">
            <div class="info">
                <span @click="details(item)">
                  <p class="name">{{item.ExpertName}}</p>
                  <p>擅长：{{item.ExpertSpecialty}}</p>
                  <p>简介：{{item.ExpertIntroduction}}</p>
                </span>
            </div>
          </el-col>
        </div>
      </el-col>
      <el-divider type="primary" class="underline"></el-divider>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "manage",
    props: {
      showTable: Array,
      details: Function,
    }
  };
</script>

<style scoped lang="scss">
  .manage {
    width: 95%;
    max-height: 700px;
    overflow: auto;
    margin: auto;
    .pic {
      width: 100%;
      height: 250px;
      margin-left: 10px;
      img {
        width: 100%;
        height: 250px;
      }
    }
    .info {
      margin-left: 30px;
      span {
        .name {
          font-size: 20px;
          font-weight: bold;
          color: #1c7e7c;
        }
        p {
          margin-top: 15px;
          font-size: 18px;
        }
      }
      :hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .underline {
      width: 90%;
      margin: 20px auto;
      clear: both;
    }
  }
</style>