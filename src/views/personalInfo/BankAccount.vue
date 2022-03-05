<template>
  <div class="content">
    <el-row class="title">
      <el-col :span="6" :offset="1">
        <span>银行卡账户</span>
      </el-col>
    </el-row>
    <div class="card">
      <div class="icon">
        <i class="iconfont icon-bank"></i>
      </div>
      <div class="info">
        <template v-if="formData.bankAccount.account">
          <span>银行名：{{formData.bankAccount.bank}}</span>
          <span>银行卡号：{{formData.bankAccount.account}}</span>
          <span>持卡人姓名：{{formData.bankAccount.name}}</span>
          <div class="btn">
            <span v-if="formData.defaultType=='bank'">默认收款方式</span>
            <el-button v-else type="warning" class="btn-right" @click="setDefault('bank')">设为默认</el-button>

            <el-button
              type="primary"
              class="btn-left"
              @click="modifyBankDialogVisible=!modifyBankDialogVisible"
            >修改</el-button>
            <el-button type="danger" class="btn-right" @click="bankUntie">解绑</el-button>
          </div>
        </template>
        <template v-else>
          <span>尚未绑定银行卡账户...</span>
          <div class="btn">
            <el-button type="success" @click="bankDialogVisible=!bankDialogVisible">绑定</el-button>
          </div>
        </template>
      </div>
      <div></div>
    </div>
    <el-row class="title">
      <el-col :span="6" :offset="1">
        <span>支付宝账户</span>
      </el-col>
    </el-row>
    <div class="card">
      <div class="icon">
        <i class="iconfont icon-zhifubao"></i>
      </div>
      <div class="info">
        <template v-if="formData.alipay.account">
          <span>账户名：{{formData.alipay.account}}</span>
          <span>姓名：{{formData.alipay.name}}</span>
          <div class="btn">
            <span v-if="formData.defaultType=='alipay'">默认收款方式</span>
            <el-button v-else type="warning" class="btn-right" @click="setDefault('alipay')">设为默认</el-button>

            <el-button
              type="primary"
              class="btn-left"
              @click="modifyAlipayDialogVisible=!modifyAlipayDialogVisible"
            >修改</el-button>
            <el-button type="danger" class="btn-right" @click="alipayUntie">解绑</el-button>
          </div>
        </template>
        <template v-else>
          <span>尚未绑定支付宝账户...</span>
          <div class="btn">
            <el-button type="success" @click="alipayDialogVisible=!alipayDialogVisible">绑定</el-button>
          </div>
        </template>
      </div>
      <div></div>
    </div>
    <el-row class="title">
      <el-col :span="6" :offset="1">
        <span>微信账户</span>
      </el-col>
    </el-row>
    <div class="card">
      <div class="icon">
        <i class="iconfont icon-weixin"></i>
      </div>
      <div class="info">
        <template v-if="formData.wechat.account">
          <span>账户名：{{formData.wechat.account}}</span>
          <span>姓名：{{formData.wechat.name}}</span>

          <div class="btn">
            <span v-if="formData.defaultType=='wechat'">默认收款方式</span>
            <el-button v-else type="warning" class="btn-right" @click="setDefault('wechat')">设为默认</el-button>

            <el-button
              type="primary"
              class="btn-left"
              @click="modifyWechatDialogVisible=!modifyWechatDialogVisible"
            >修改</el-button>
            <el-button type="danger" class="btn-right" @click="wechatUntie">解绑</el-button>
          </div>
        </template>
        <template v-else>
          <span>尚未绑定微信账户...</span>
          <div class="btn">
            <el-button type="success" @click="wechatDialogVisible=!wechatDialogVisible">绑定</el-button>
          </div>
        </template>
      </div>
      <div></div>
    </div>

    <!-- 银行卡绑定对话框 -->
    <el-dialog title="银行卡绑定" :visible.sync="bankDialogVisible">
      <el-form>
        <el-form-item label="银行" :label-width="formLabelWidth">
          <el-input v-model="newBankAccount.bank"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" :label-width="formLabelWidth">
          <el-input v-model="newBankAccount.account"></el-input>
        </el-form-item>
        <el-form-item label="持卡人姓名" :label-width="formLabelWidth">
          <el-input v-model="newBankAccount.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="身份证号码" :label-width="formLabelWidth">
          <el-input v-model="newBankAccount.cardId"></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bankDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBankAccount">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 支付宝绑定对话框 -->
    <el-dialog title="支付宝绑定" :visible.sync="alipayDialogVisible">
      <el-form>
        <el-form-item label="支付宝账户" :label-width="formLabelWidth">
          <el-input v-model="newAlipayAccount.bank"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="newAlipayAccount.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="身份证号码" :label-width="formLabelWidth">
          <el-input v-model="newAlipayAccount.cardId"></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="alipayDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAlipayAccount">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 微信绑定对话框 -->
    <el-dialog title="微信绑定" :visible.sync="wechatDialogVisible">
      <el-form>
        <el-form-item label="微信账户" :label-width="formLabelWidth">
          <el-input v-model="newWechatAccount.account"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="newWechatAccount.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="身份证号码" :label-width="formLabelWidth">
          <el-input v-model="newWechatAccount.cardId"></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="wechatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addWechatAccount">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 银行卡修改对话框 -->
    <el-dialog title="银行卡账号修改" :visible.sync="modifyBankDialogVisible">
      <el-form>
        <el-form-item label="原银行卡号" :label-width="formLabelWidth">
          <el-input v-model="modifyDialog.preaccount"></el-input>
        </el-form-item>
        <el-form-item label="新银行卡号" :label-width="formLabelWidth">
          <el-input v-model="modifyDialog.account"></el-input>
        </el-form-item>
        <el-form-item label="持卡人姓名" :label-width="formLabelWidth">
          <el-input v-model="modifyDialog.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bankDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyAccount('bankaccount')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 支付宝修改对话框 -->
    <el-dialog title="支付宝账号修改" :visible.sync="modifyAlipayDialogVisible">
      <el-form>
        <el-form-item label="原支付宝账户" :label-width="formLabelWidth">
          <el-input v-model="modifyDialog.preaccount"></el-input>
        </el-form-item>
        <el-form-item label="新支付宝账户" :label-width="formLabelWidth">
          <el-input v-model="modifyDialog.account"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="modifyDialog.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="alipayDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyAccount('alipay')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 微信修改对话框 -->
    <el-dialog title="微信账号修改" :visible.sync="modifyWechatDialogVisible">
      <el-form>
        <el-form-item label="原微信账户" :label-width="formLabelWidth">
          <el-input v-model="modifyDialog.preaccount"></el-input>
        </el-form-item>
        <el-form-item label="新微信账户" :label-width="formLabelWidth">
          <el-input v-model="modifyDialog.account"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="modifyDialog.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="wechatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyAccount('wechat')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="untieDialogVisible" width="30%">
      <span>确定解除绑定？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="untieDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="untie">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import {
  getAccountInfo,
  addAccountInfo,
  modifyAccountInfo
} from "../../api/user/user.js";
export default {
  name: "BankAccount",
  data() {
    return {
      untieDialogVisible: false,
      untieFlag: "",
      formLabelWidth: "120px",
      bankDialogVisible: false,
      alipayDialogVisible: false,
      wechatDialogVisible: false,
      modifyBankDialogVisible: false,
      modifyAlipayDialogVisible: false,
      modifyWechatDialogVisible: false,
      newBankAccount: {
        bank: "",
        account: "",
        name: "",
        cardId: ""
      },
      newAlipayAccount: {
        account: "",
        name: "",
        cardId: ""
      },
      newWechatAccount: {
        account: "",
        name: "",
        cardId: ""
      },
      formData: {
        defaultType: "",
        bankAccount: {
          bank: "",
          account: "",
          name: ""
        },
        alipay: {
          account: "",
          name: ""
        },
        wechat: {
          account: "",
          name: ""
        }
      },
      modifyDialog: {
        name: "",
        preaccount: "",
        account: ""
      }
    };
  },
  methods: {
    addBankAccount() {
      this.newBankAccount.type = "bankaccount";
      addAccountInfo(this.newBankAccount).then(res => {
        if (res) {
          getAccountInfo(true).then(res => {
            if (res) {
              this.formData = res;
            }
          });
        }
      });
      this.bankDialogVisible = !this.bankDialogVisible;
    },
    addAlipayAccount() {
      this.newAlipayAccount.type = "alipay";
      addAccountInfo(this.newAlipayAccount).then(res => {
        if (res) {
          getAccountInfo(true).then(res => {
            if (res) {
              this.formData = res;
            }
          });
        }
      });
      this.alipayDialogVisible = !this.alipayDialogVisible;
    },
    addWechatAccount() {
      this.newWechatAccount.type = "wechat";
      addAccountInfo(this.newWechatAccount).then(res => {
        if (res) {
          getAccountInfo(true).then(res => {
            if (res) {
              this.formData = res;
            }
          });
        }
      });
      this.wechatDialogVisible = !this.wechatDialogVisible;
    },
    modifyAccount(type) {
      let obj = {};
      switch (type) {
        case "bankaccount":
          obj = this.modifyDialog;
          this.modifyBankDialogVisible = false;
          break;
        case "alipay":
          obj = this.modifyDialog;
          this.modifyAlipayDialogVisible = false;
          break;
        case "wechat":
          obj = this.modifyDialog;
          this.modifyWechatDialogVisible = false;
          break;
        default:
          console.log("err");
      }
      obj.type = type;
      modifyAccountInfo(obj).then(res => {
        if (res) {
          getAccountInfo(true).then(res => {
            if (res) {
              this.formData = res;
            }
          });
        }
      });
    },
    bankUntie() {
      this.untieDialogVisible = true;
      this.untieFlag = "bank";
    },
    alipayUntie() {
      this.untieDialogVisible = true;
      this.untieFlag = "alipay";
    },
    wechatUntie() {
      this.untieDialogVisible = true;
      this.untieFlag = "wechat";
    },
    untie() {
      switch (this.untieFlag) {
        case "bank":
          console.log(this.formData.bankAccount);
          break;
        case "alipay":
          console.log(this.formData.alipay);
          break;
        case "wechat":
          console.log(this.formData.wechat);
          break;
        default:
          console.log("err");
      }
      this.untieDialogVisible = false;
    },
    setDefault(type) {
      switch (type) {
        case "bank":
          this.formData.defaultType = "bank";
          break;
        case "alipay":
          this.formData.defaultType = "alipay";
          break;
        case "wechat":
          this.formData.defaultType = "wechat";
          break;
        default:
          console.log("err");
      }
    }
  },
  mounted() {
    getAccountInfo(false).then(res => {
      console.log(res);
      if (res) {
        this.formData = res;
      }
    });
  }
};
</script >

<style scoped lang="scss">
.content {
  .title {
    font-size: 20px;
    font-weight: bold;
    color: #1c7e7c;
    margin-top: 20px;
  }
  .card {
    width: 90%;
    height: 100px;
    margin: 20px auto;
    background-color: #f2f2f2;
    border-radius: 15px;
    .icon {
      width: 10%;
      height: 100px;
      float: left;
      margin-left: 3%;
      i {
        font-size: 90px;
        color: #8a8a8a;
      }
    }
    .info {
      width: 85%;
      height: 100px;
      float: left;
      line-height: 100px;
      color: #1c7e7c;
      span {
        margin-left: 20px;
        font-size: 100%;
      }
      .btn {
        float: right;
      }
      .btn-left {
        margin-left: 20px;
        margin-right: 10px;
      }
    }
  }
}
</style>
