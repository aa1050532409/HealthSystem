<template>
  <div>
    <div class="examResult">
      <span v-if="examInfo && examInfo.length == 0" class="textdefault">{{ "无" }}</span>
      <el-tabs v-else type="card" value="0">
        <el-tab-pane v-for="(item, index) in examInfo" :key="item.id" :name="index + ''">
          <template slot="label">检查{{ nums[index + 1] }}</template>
          <template>
            <div class="imgExam">
              <div class="img">
                <el-image
                  style="width: 500px; height: 500px"
                  fit="scale-down"
                  :src="item.API_img"
                  :preview-src-list="[item.API_img]"
                >
                  <div slot="placeholder" class="image-slot">
                    <i class="el-icon-loading"></i>
                  </div>
                </el-image>
              </div>
              <div class="info">
                <div>
                  <span class="label">智能诊断</span>
                </div>
                <div>
                  <p class="text">{{ item.API_aiResult || "无" }}</p>
                </div>
              </div>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// 患者诊断中填写诊断结论、病情、治疗方案描述时候的复选组件
export default {
  props: {
    examInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      nums: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
    };
  },
};
</script>

<style lang="scss" scoped>
.examResult {
  width: 95%;
  margin: auto;
  .textdefault {
    text-indent: 40px;
    font-size: 18px;
    word-wrap: break-word;
    word-break: break-all;
  }
  .imgExam {
    display: flex;
    justify-content: space-between;
    .info {
      width: 300px;
      padding-left: 30px;
      border-left: 2px solid #d9d9d9;
      .label {
        font-weight: bold;
        font-size: 20px;
      }
      .text {
        text-indent: 20px;
        font-size: 18px;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
    .img {
      flex-shrink: 0;
      .image-slot {
        text-align: center;
        line-height: 200px;
        i {
          font-size: 50px;
        }
      }
      .pic {
        width: 500px;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
