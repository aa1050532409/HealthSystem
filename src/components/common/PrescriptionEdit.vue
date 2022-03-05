<template>
  <div class="medicalEdit">
    <!-- 
处方的字段：
        API_drugsName: "",            药品名称
        API_drugsNumber: "",          药品总数
        API_drugsNumberUnits: "",     药品单位
        API_drugsSpecification: "",   药品规格
        API_drugsUsage: "",           药品单次用量
        API_manufacturer: "",         药品厂商
        API_useFrequency: "",         药品使用频率
        API_useTime: ""               药品使用时长
emit:
  input事件:处方发生改变
    -->
    <div v-show="prescription.length > 0">
      <el-table size="mini" :data="prescription" style="width: 100%">
        <el-table-column fixed label="名称">
          <template slot-scope="scope">
            <span>{{ scope.row.API_drugsName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生产厂家">
          <template slot-scope="scope">
            <span>{{ scope.row.API_manufacturer }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格">
          <template slot-scope="scope">
            <span>{{ scope.row.API_drugsSpecification }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.API_drugsNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.API_drugsNumberUnits }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单次用量">
          <template slot-scope="scope">
            <span>{{ scope.row.API_drugsUsage }}</span>
          </template>
        </el-table-column>
        <el-table-column label="频率">
          <template slot-scope="scope">
            <span>{{ scope.row.API_useFrequency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用时间">
          <template slot-scope="scope">
            <span>{{ scope.row.API_useTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!readonly"
          fixed="right"
          label="操作"
          width="150px"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="editaleChange(scope.$index, scope.row)"
              >{{ !scope.row.isEditable ? "编辑" : "确定" }}</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="delMedical(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="!readonly" class="addMedcal">
      <div class="margin">
        <el-link @click="addMedical" class="btn" type="success">{{
          "+添加药品"
        }}</el-link>
      </div>
    </div>
    <!-- 选择药品对话框 -->
    <el-dialog
      :modal="false"
      class="addmeidicaldialog"
      title="添加药品"
      :visible.sync="diglogVisible"
      width="800px"
    >
      <div class="recommendList">
        {{ "【为您推荐】" }}
        <span
          class="recommendItem"
          v-for="item in recommendList[prescription.length]"
          :key="item.id"
          @click="medicalSelect(item)"
          >{{ item.name }}</span
        >
      </div>
      <div class="search">
        <el-input
          placeholder="请输入药品名称或名称首字母"
          v-model="searchName"
          size="mini"
          style="width:50%;margin-right:10px"
        ></el-input>
        <el-button size="mini" @click="medicalSearch" type="primary"
          >查询</el-button
        >
      </div>
      <div class="medicalCard" v-for="item in medicalData" :key="item.id">
        <div class="pic">
          <img
            src="//image.jianke.com/suo/upload/prodimage/201602/2016218164512603!320x320.jpg"
            alt
          />
        </div>
        <div class="info">
          <div>
            <el-row>
              <el-col :span="8">名称：{{ item.name }}</el-col>
              <el-col :span="5">剂型：{{ item.type }}</el-col>
              <el-col :span="11">规格:{{ item.specification }}</el-col>
            </el-row>
          </div>
          <div>
            <el-row>
              <el-col :span="8">厂商：{{ item.manufacturer }}</el-col>
              <el-col :span="11">批准文号：{{ item.approvalNumber }}</el-col>
            </el-row>
          </div>
          <div>
            <el-row>
              <el-col :span="11">药品本位码：{{ item.standardCode }}</el-col>
              <el-button
                @click="medicalSelect(item)"
                class="select"
                type="success"
                size="mini"
                >选择</el-button
              >
            </el-row>
          </div>
        </div>
      </div>
      <div class="pageSwitch">
        <div class="btn">
          <el-link
            @click="prePage"
            v-show="page.current > 1"
            style="margin-right:20px"
            >上一页</el-link
          >
          <el-link @click="nextPage" v-show="page.current < page.maxPage"
            >下一页</el-link
          >
        </div>
      </div>
    </el-dialog>
    <!-- 添加药品对话框 -->
    <el-dialog
      :modal="false"
      class="addmeidicaldialog"
      title="添加药品"
      :visible.sync="medicalDialog"
      width="800px"
    >
      <div class="medicalCard">
        <div class="pic">
          <img
            src="//image.jianke.com/suo/upload/prodimage/201602/2016218164512603!320x320.jpg"
            alt
          />
        </div>
        <div class="info">
          <div>
            <el-row>
              <el-col :span="8">名称：{{ tempDrug.name }}</el-col>
              <el-col :span="5">剂型：{{ tempDrug.type }}</el-col>
              <el-col :span="11">规格:{{ tempDrug.specification }}</el-col>
            </el-row>
          </div>
          <div>
            <el-row>
              <el-col :span="8">厂商：{{ tempDrug.manufacturer }}</el-col>
              <el-col :span="11"
                >批准文号：{{ tempDrug.approvalNumber }}</el-col
              >
            </el-row>
          </div>
          <div>
            <el-row>
              <el-col :span="12"
                >药品本位码：{{ tempDrug.standardCode }}</el-col
              >
            </el-row>
          </div>
        </div>
      </div>
      <div class="drugPrescription">
        <el-form size="mini" :inline="true" label-width="80px">
          <el-form-item label="药品数量">
            <el-input
              v-model="durgsDetails.number"
              style="width:200px"
            ></el-input>
          </el-form-item>

          <el-form-item label="药品单位">
            <el-select style="width:200px" v-model="durgsDetails.unit">
              <el-option value="粒"></el-option>
              <el-option value="g"></el-option>
              <el-option value="mg"></el-option>
              <el-option value="包"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单次用量">
            <el-input
              v-model="durgsDetails.consumption"
              style="width:200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="用药频次">
            <el-select v-model="durgsDetails.frequency" style="width:200px">
              <el-option value="一天一次"></el-option>
              <el-option value="一天两次"></el-option>
              <el-option value="一天三次"></el-option>
              <el-option value="两天一次"></el-option>
              <el-option value="一周一次"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用药时间">
            <el-select v-model="durgsDetails.useDays" style="width:200px">
              <el-option value="三天"></el-option>
              <el-option value="一周"></el-option>
              <el-option value="半个月"></el-option>
              <el-option value="一个月"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="drugConfirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 修改处方中的药品 -->
    <el-dialog
      :modal="false"
      class="addmeidicaldialog"
      title="添加药品"
      :visible.sync="medicalModifyDialog"
      width="800px"
    >
      <div class="drugPrescription">
        <el-form size="mini" :inline="true" label-width="80px">
          <el-form-item label="药品名称">
            <el-input
              disabled
              v-model="medicalModify.API_drugsName"
              style="width:200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="生产厂家">
            <el-input
              disabled
              v-model="medicalModify.API_manufacturer"
              style="width:200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="规格">
            <el-input
              disabled
              v-model="medicalModify.API_drugsSpecification"
              style="width:200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="药品数量">
            <el-input
              v-model="medicalModify.API_drugsNumber"
              style="width:200px"
            ></el-input>
          </el-form-item>

          <el-form-item label="药品单位">
            <el-select
              style="width:200px"
              v-model="medicalModify.API_drugsNumberUnits"
            >
              <el-option value="粒"></el-option>
              <el-option value="g"></el-option>
              <el-option value="mg"></el-option>
              <el-option value="包"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单次用量">
            <el-input
              v-model="medicalModify.API_drugsUsage"
              style="width:200px"
            ></el-input>
          </el-form-item>

          <el-form-item label="用药频次">
            <el-select
              v-model="medicalModify.API_useFrequency"
              style="width:200px"
            >
              <el-option value="一天一次"></el-option>
              <el-option value="一天两次"></el-option>
              <el-option value="一天三次"></el-option>
              <el-option value="两天一次"></el-option>
              <el-option value="一周一次"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用药时间">
            <el-select v-model="medicalModify.API_useTime" style="width:200px">
              <el-option value="三天"></el-option>
              <el-option value="一周"></el-option>
              <el-option value="半个月"></el-option>
              <el-option value="一个月"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="drugModifyConfirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 处方、表格展示表格组件
import { getDurgsInfo } from "@api/patientdiag/patientdiag.js";
export default {
  name: "CheckBox",
  props: {
    prescription: {
      type: Array,
      default: () => {
        return [];
      }
    },
    readonly: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },

  watch: {
    diglogVisible() {
      this.searchName = "";
      this.data = [];
      this.page.maxPage = 0;
    }
  },
  data() {
    return {
      searchName: "",
      diglogVisible: false, //药品搜索对话框
      medicalDialog: false, //添加药品填写信息对话框
      medicalModifyDialog: false, //修改药品对话框
      medicalData: [],
      page: {
        current: 1,
        maxPage: 0
      },
      tempDrug: {},
      durgsDetails: {
        number: "",
        unit: "",
        useage: "",
        useWay: "",
        frequency: "",
        useTime: ""
      },
      medicalModify: {
        API_drugsName: "",
        API_drugsNumber: "",
        API_drugsNumberUnits: "",
        API_drugsSpecification: "",
        API_drugsUsage: "",
        API_manufacturer: "",
        API_useFrequency: "",
        API_useTime: ""
      },
      recommendList: [
        [
          {
            approvalNumber: "国药准字H10980122",
            manufacturer: "贵州益康制药有限公司",
            name: "盐酸曲马多缓释胶囊",
            specification: "0.1g",
            standardCode: "86905551000090",
            type: "缓释胶囊"
          },
          {
            approvalNumber: "国药准字H20040426",
            manufacturer: "南京长澳制药有限公司",
            name: "阿莫西林克拉维酸钾咀嚼片（7:1）",
            specification: "0.2285g（C16H19N3O5S 0.2g与C8H9NO5 0.0285g）",
            standardCode: "86901555000012",
            type: "咀嚼片"
          },
          {
            approvalNumber: "国药准字H33021391",
            manufacturer: "海正辉瑞制药有限公司",
            name: "琥乙红霉素咀嚼片",
            specification: "0.1g",
            standardCode: "86904641001191",
            type: "咀嚼片"
          }
        ],
        [
          {
            approvalNumber: "国药准字H20103788",
            manufacturer: "陕西立众制药有限公司",
            name: "羟丙甲纤维素滴眼液",
            specification: "0.5％",
            standardCode: "86902509000515",
            type: "滴眼液"
          },
          {
            approvalNumber: "国药准字H51023532",
            manufacturer: "四川峨嵋山药业有限公司",
            name: "盐酸洛美沙星胶囊",
            specification: "0.1g",
            standardCode: "86902046000313",
            type: "硬胶囊"
          },
          {
            approvalNumber: "国药准字H20041245",
            manufacturer: "瑞阳制药有限公司",
            name: "注射用曲克芦丁",
            specification: "0.1g",
            standardCode: "86904152002533",
            type: "冻干粉针"
          }
        ],
        [
          {
            approvalNumber: "国药准字H65020349",
            manufacturer: "新疆生化药业有限公司",
            name: "曲克芦丁片",
            specification: "0.1g",
            standardCode: "86905981000110",
            type: "片剂"
          },
          {
            approvalNumber: "国药准字H61022729",
            manufacturer: "陕西省康乐制药厂",
            name: "曲克芦丁片",
            specification: "0.1g",
            standardCode: "86902414000211",
            type: "片剂"
          },
          {
            approvalNumber: "国药准字H44024594",
            manufacturer: "东莞市亚洲制药有限公司",
            name: "曲克芦丁片",
            specification: "0.1g",
            standardCode: "86900252000738",
            type: "片剂"
          }
        ]
      ]
    };
  },
  methods: {
    // 搜索药品
    medicalSearch() {
      this.page.current = 1;
      getDurgsInfo(this.page.current, this.searchName).then(res => {
        this.medicalData = res.data;
        this.page.maxPage = res.maxNum;
        console.log(res);
      });
    },
    // 选择药品
    medicalSelect(medical) {
      this.diglogVisible = false;
      this.tempDrug = medical;
      this.medicalDialog = true;
      // 设置了一个默认
      this.durgsDetails = {
        number: "10",
        unit: "粒",
        useage: "2",
        useWay: "一天一次",
        frequency: "一天一次",
        useTime: "三天",
        consumption: "2",
        useDays: "三天"
      };
    },
    // 点击添加药品
    addMedical() {
      this.diglogVisible = true;
    },
    // 确定添加的药品
    drugConfirm() {
      let obj = {
        API_drugsName: this.tempDrug.name,
        API_manufacturer: this.tempDrug.manufacturer,
        API_drugsNumberUnits: this.durgsDetails.unit,
        API_drugsNumber: this.durgsDetails.number,
        API_drugsUsage: this.durgsDetails.consumption,
        API_useFrequency: this.durgsDetails.frequency,
        API_drugsSpecification: this.tempDrug.specification,
        API_useTime: this.durgsDetails.useDays
      };
      if (
        obj.API_drugsName != "" &&
        obj.API_manufacturer != "" &&
        obj.API_drugsNumberUnits != "" &&
        obj.API_drugsNumber != "" &&
        obj.API_drugsUsage != "" &&
        obj.API_useFrequency != "" &&
        obj.API_drugsSpecification != "" &&
        obj.API_useTime != ""
      ) {
        this.prescription.push(obj);
        this.$emit("input", this.prescription);

        this.medicalDialog = false;
        this.durgsDetails = {
          number: "",
          unit: "",
          useage: "",
          useWay: "",
          frequency: "",
          useTime: ""
        };
      } else {
        this.$message.error("请完善药品信息");
      }
    },

    // 确定药品修改
    drugModifyConfirm() {
      this.prescription.forEach((item, index) => {
        if (item.API_drugsName == this.medicalModify.API_drugsName) {
          this.prescription.splice(index, 1, this.medicalModify);
        }
      });
      this.$emit("input", this.prescription);
      this.medicalModifyDialog = false;
    },

    // 点击修改
    editaleChange(index, item) {
      this.medicalModify = JSON.parse(JSON.stringify(item));
      this.medicalModifyDialog = true;
    },

    // 点击删除药品
    delMedical(index, item) {
      this.prescription.splice(index, 1);
      this.$emit("input", this.prescription);
    },

    // 药品翻页
    nextPage() {
      this.page.current += 1;
      getDurgsInfo(this.page.current, this.searchName).then(res => {
        console.log(res);
        this.medicalData = res.data;
        this.page.maxPage = res.maxNum;
      });
    },
    prePage() {
      this.page.current -= 1;
      getDurgsInfo(this.page.current, this.searchName).then(res => {
        this.medicalData = res.data;
        this.page.maxPage = res.maxNum;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.addMedcal {
  width: 100%;
  margin: 0 auto;
  .margin {
    width: 80px;
    margin: auto;
    .btn {
      width: 100px;
      font-size: 16px;
      margin: 10px auto;
    }
  }
}

.medicalCard {
  display: flex;
  min-height: 100px;
  background-color: rgb(236, 231, 231);
  overflow: hidden;
  margin-top: 10px;
  padding: 5px;
  border-radius: 3px;
  .pic {
    max-width: 95px;
    max-height: 95px;
    flex-shrink: 0;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    div {
      display: flex;
      flex-direction: row;
      width: 100%;
      .select {
        float: right;
      }
    }
  }
}
.pageSwitch {
  height: 20px;
  .btn {
    float: right;
  }
}
.drugPrescription {
  margin-top: 20px;
}
.recommendList {
  .recommendItem {
    margin-right: 20px;
    cursor: pointer;
  }
  .recommendItem:hover {
    text-decoration: underline;
    color: blue;
  }
}
</style>
<style lang="scss">
.medicalEdit {
  .el-dialog__body {
    padding: 0 20px 30px;
  }
}
</style>