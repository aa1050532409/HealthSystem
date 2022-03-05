<template>
  <div>
    <div class="examResult">
      <span v-if="examInfo.length==0" class="textdefault">{{"无"}}</span>
      <el-tabs v-else type="card" value="0">
        <el-tab-pane v-for="(item,index) in examInfo" :key="item.id" :name="index+''">
          <template slot="label">检查{{nums[index+1]}}</template>
          <template v-if="item.API_type=='img'">
            <div class="imgExam">
              <div class="img">
                <el-image
                  style="width: 500px;"
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
                  <p class="text">{{item.API_aiResult||"无"}}</p>
                </div>
              </div>
            </div>
          </template>
          <template v-if="item.API_type=='table'">
            <div class="tableExam">
              <div class="table">
                <el-table
                  size="mini"
                  max-height="350px"
                  :data="item.API_table.API_data"
                  style="width: 100%"
                >
                  <el-table-column prop="API_item" label="项目"></el-table-column>
                  <el-table-column label>
                    <template slot-scope="scope">
                      <i
                        v-if="scope.row.API_result<scope.row.API_rangeBottom"
                        class="el-icon-bottom"
                      ></i>
                      <i v-if="scope.row.API_result>scope.row.API_rangeTop" class="el-icon-top"></i>
                    </template>
                  </el-table-column>
                  <el-table-column prop="API_result" label="结果"></el-table-column>
                  <el-table-column prop="API_unit" label="单位"></el-table-column>
                  <el-table-column label="参考范围">
                    <template slot-scope="scope">
                      <span>{{scope.row.API_rangeBottom+"~"+scope.row.API_rangeTop}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="pic">
                <el-image
                  style="width:100%;"
                  :src="item.API_img"
                  :preview-src-list="[item.API_img]"
                ></el-image>
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
      }
    }
  },
  data() {
    return {
      nums: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]
    };
  }
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
        width: 100%;
        height: 200px;
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
  .tableExam {
    display: flex;
    justify-content: space-between;
    max-height: 350px;
    .table {
      flex-shrink: 0;
      width: 50%;
      min-width: 500px;
    }
    .pic {
      width: 45%;
      margin-top: 30px;
      margin-left: 30px;
      // max-height: 300px;
      overflow-y: auto;
    }
  }
}
</style>