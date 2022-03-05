<template>
  <!-- 
传入数据

rule   Array
[
 {
    label: "年龄",
    value: "PatientID",
    type: "input",
  },
  {
    label: "家庭住址",
    value: "PatientName",
    type: "input",
  },
  {
    label: "性别",
    value: "Gender",
    type: "selection",
  }
]

table   Array 传入的数据
[

]
v-model :绑定展示的数据

 -->
  <div>
    <div class="header">
      <span class="mainLabel">{{ title }}</span>
    </div>
    <div class="searchTool">
      <div class="left">
        <div class="rule">
          <drop-select :Options="rules" v-model="currentRule"></drop-select>
        </div>
        <div class="value">
          <!-- <el-input
            v-if="currentRule.type == 'input'"
            style="height: '30px'"
            size="small"
            v-model="currentValue"
          ></el-input> -->
          <el-autocomplete
            class="inline-input"
            v-if="currentRule.type == 'input'"
            style="height: '30px'"
            size="small"
            v-model="currentValue"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
          ></el-autocomplete>
          <el-select
            v-if="currentRule.type == 'selection'"
            style="height: '30px'; width: 200px"
            size="small"
            clearable
            v-model="currentValue"
          >
            <el-option
              v-for="(item, index) in selectOptions"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="otherBtn">
        <slot></slot>
      </div>
    </div>

    <div v-show="false">
      <div>{{ result }}</div>
    </div>
  </div>
</template>

<script>
import { searchTool } from "@utils/common.js";
export default {
  props: {
    title: {
      type: String,
      default: () => {
        return "查询";
      },
    },
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    rules: {
      type: Array,
      default: () => {
        return [];
      },
    },
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    selectOptions() {
      let arr = [];
      let temp = JSON.parse(JSON.stringify(this.tableData));
      temp.forEach((item) => {
        if (
          item[this.currentRule.value] &&
          arr.indexOf(item[this.currentRule.value]) == -1
        ) {
          arr.push(item[this.currentRule.value] + "");
        }
      });
      return arr;
    },
    result() {
      let arr = [];
      let temp = JSON.parse(JSON.stringify(this.tableData));
      arr = temp.filter((item) => {
        if (!this.currentValue) return true;
        if (!item[this.currentRule.value]) {
          return false;
        }
        if (
          !this.currentRule.value ||
          (item[this.currentRule.value] + "").includes(this.currentValue)
        ) {
          return true;
        } else {
          return false;
        }
      });
      this.$emit("input", arr);
      return arr;
    },
  },
  watch: {
    currentRule: function (value) {
      this.currentValue = "";
    },
  },
  data() {
    return {
      currentValue: "",
      currentRule: this.rules[0],
    };
  },
  methods: {
    querySearch(queryString, cb) {
      var allData = this.tableData;
      var results = queryString
        ? allData.filter(this.createFilter(queryString))
        : allData;
      // 调用 callback 返回建议列表的数据
      results = results.map((item) => {
        return item[this.currentRule.value];
      });
      results = Array.from(new Set(results));
      results = results.map((item) => {
        return { value: item };
      });
      cb(results);
    },
    createFilter(queryString) {
      return (item) => {
        let str1 = item[this.currentRule.value] + "";
        let str2 = queryString + "";
        if (str1.indexOf(str2) != -1) return true;
        else return false;
        return (
          item[this.currentRule.value]
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    loadAll() {
      return [
        { value: "三全鲜食（北新泾店）", address: "长宁区新渔路144号" },
        { value: "Hot honey 首尔炸鸡（仙霞路）", address: "上海市长宁区淞虹路661号" },
        { value: "新旺角茶餐厅", address: "上海市普陀区真北路988号创邑金沙谷6号楼113" },
        { value: "泷千家(天山西路店)", address: "天山西路438号" },
        {
          value: "胖仙女纸杯蛋糕（上海凌空店）",
          address: "上海市长宁区金钟路968号1幢18号楼一层商铺18-101",
        },
        { value: "贡茶", address: "上海市长宁区金钟路633号" },
        { value: "豪大大香鸡排超级奶爸", address: "上海市嘉定区曹安公路曹安路1685号" },
        { value: "茶芝兰（奶茶，手抓饼）", address: "上海市普陀区同普路1435号" },
        { value: "十二泷町", address: "上海市北翟路1444弄81号B幢-107" },
        { value: "星移浓缩咖啡", address: "上海市嘉定区新郁路817号" },
        { value: "阿姨奶茶/豪大大", address: "嘉定区曹安路1611号" },
        { value: "新麦甜四季甜品炸鸡", address: "嘉定区曹安公路2383弄55号" },
        {
          value: "Monica摩托主题咖啡店",
          address: "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F",
        },
        {
          value: "浮生若茶（凌空soho店）",
          address: "上海长宁区金钟路968号9号楼地下一层",
        },
        { value: "NONO JUICE  鲜榨果汁", address: "上海市长宁区天山西路119号" },
        { value: "CoCo都可(北新泾店）", address: "上海市长宁区仙霞西路" },
        {
          value: "快乐柠檬（神州智慧店）",
          address: "上海市长宁区天山西路567号1层R117号店铺",
        },
        { value: "Merci Paul cafe", address: "上海市普陀区光复西路丹巴路28弄6号楼819" },
        {
          value: "猫山王（西郊百联店）",
          address: "上海市长宁区仙霞西路88号第一层G05-F01-1-306",
        },
        { value: "枪会山", address: "上海市普陀区棕榈路" },
        { value: "纵食", address: "元丰天山花园(东门) 双流路267号" },
        { value: "钱记", address: "上海市长宁区天山西路" },
        { value: "壹杯加", address: "上海市长宁区通协路" },
        {
          value: "唦哇嘀咖",
          address: "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元",
        },
        { value: "爱茜茜里(西郊百联)", address: "长宁区仙霞西路88号1305室" },
        {
          value: "爱茜茜里(近铁广场)",
          address: "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺",
        },
        {
          value: "鲜果榨汁（金沙江路和美广店）",
          address: "普陀区金沙江路2239号金沙和美广场B1-10-6",
        },
        { value: "开心丽果（缤谷店）", address: "上海市长宁区威宁路天山路341号" },
        { value: "超级鸡车（丰庄路店）", address: "上海市嘉定区丰庄路240号" },
        { value: "妙生活果园（北新泾店）", address: "长宁区新渔路144号" },
        { value: "香宜度麻辣香锅", address: "长宁区淞虹路148号" },
        { value: "凡仔汉堡（老真北路店）", address: "上海市普陀区老真北路160号" },
        { value: "港式小铺", address: "上海市长宁区金钟路968号15楼15-105室" },
        { value: "蜀香源麻辣香锅（剑河路店）", address: "剑河路443-1" },
        { value: "北京饺子馆", address: "长宁区北新泾街道天山西路490-1号" },
        {
          value: "饭典*新简餐（凌空SOHO店）",
          address: "上海市长宁区金钟路968号9号楼地下一层9-83室",
        },
        { value: "焦耳·川式快餐（金钟路店）", address: "上海市金钟路633号地下一层甲部" },
        { value: "动力鸡车", address: "长宁区仙霞西路299弄3号101B" },
        { value: "浏阳蒸菜", address: "天山西路430号" },
        { value: "四海游龙（天山西路店）", address: "上海市长宁区天山西路" },
        { value: "樱花食堂（凌空店）", address: "上海市长宁区金钟路968号15楼15-105室" },
        { value: "壹分米客家传统调制米粉(天山店)", address: "天山西路428号" },
        {
          value: "福荣祥烧腊（平溪路店）",
          address: "上海市长宁区协和路福泉路255弄57-73号",
        },
        {
          value: "速记黄焖鸡米饭",
          address: "上海市长宁区北新泾街道金钟路180号1层01号摊位",
        },
        { value: "红辣椒麻辣烫", address: "上海市长宁区天山西路492号" },
        { value: "(小杨生煎)西郊百联餐厅", address: "长宁区仙霞西路88号百联2楼" },
        { value: "阳阳麻辣烫", address: "天山西路389号" },
        { value: "南拳妈妈龙虾盖浇饭", address: "普陀区金沙江路1699号鑫乐惠美食广场A13" },
      ];
    },
  },
  created() {},
};
</script>

<style scoped lang="scss">
.header {
  margin: 10px 0;
}
.searchTool {
  width: 100%;
  height: 35px;
  display: flex;
  // background-color: red;
  align-items: center;
  justify-content: space-between;
  .left{
    display: flex;
  }
  .rule {
    flex-shrink: 0;
  }
  .value {
    width: 200px;
    height: 30px;
    margin-left: 20px;
  }
  .otherBtn {
    height: 30px;
    //margin-left: 20px;
    margin-right: 50px;
  }
}
</style>
