export default {
  /* 
      messageList: [
      // 新就诊患者信息
      {
        type: "huanzhe",//类型
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),//时间
        msg: "您有新的就诊请求",//提示类型
        router: "/patientdiag/todaydiagnosis"//提示种类
      },
      // 新住院申请
      {
        type: "hospitalApply",
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),//时间
        msg: "您有新的住院申请（护士）",//提示类型
        //护士：/operationmanage/applylist ;    医生：/treatment/applylist
        router: "/operationmanage/applylist"//提示种类
      },
      {
        type: "hospitalApply",
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),//时间
        msg: "您有新的住院申请（医生）",//提示类型
        //护士：/operationmanage/applylist ;    医生：/treatment/applylist
        router: "/treatment/applylist"//提示种类
      },
      // 新住院患者
      {
        type: "hospitalPatient",
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),//时间
        msg: "您有新的住院患者（护士）",//提示类型
        //护士：/operationmanage/patientlist ;    医生：/treatment/patientlist
        router: "/operationmanage/patientlist"//提示种类
      },
      {
        type: "hospitalPatient",
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),//时间
        msg: "您有新的住院患者（医生）",//提示类型
        //护士：/operationmanage/patientlist ;    医生：/treatment/patientlist
        router: "/treatment/patientlist"//提示种类
      },
      //即时信息
      {
        type: "instant",
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),//时间
        pid: "464",
        msg: `患者发来消息`,//提示类型
      
        护士：/operationmanage/applydetails 、 /operationmanage/patientdetails 
        医生：/treatment/applydetails 、/treatment/patientdetails 
        专家：/patientdiag/details

        router: "/operationmanage/applydetails"//提示种类
      },
      {
        type: "instant",
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),//时间
        pid: "467",
        msg: `患者发来消息`,//提示类型
 
        护士：/operationmanage/applydetails 、 /operationmanage/patientdetails 
        医生：/treatment/applydetails 、/treatment/patientdetails 
        专家：/patientdiag/details
   
        router: "/operationmanage/patientdetails"//提示种类
      },
      {
        type: "instant",
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),//时间
        pid: "467",
        msg: `王二发来消息`,//提示类型
        router: "/treatment/applydetails"//提示种类
      },
      {
        type: "instant",
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),//时间
        pid: "466",
        msg: `李四发来消息`,//提示类型
        router: "/treatment/patientdetails"//提示种类
      },
      {
        type: "instant",
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),//时间
        pid: "465",
        msg: `张三发来消息`,//提示类型
        router: "/patientdiag/details"//提示种类
      },
    ],
  */
  namespaced: true,
  state: {
    messageList: [],
  },
  getters: {},
  mutations: {
    addMessage(state, msg) {
      const whiteList = ["remind", "chuyuanApply"]
      if (msg.type == "instant") {
        state.messageList.forEach((element, index) => {
          if (element.type == "instant" && element.pid == msg.pid) {
            state.messageList.splice(index, 1)
          }
        });
        state.messageList.push(msg)
      } else if (
        whiteList.indexOf(msg.type) != -1
        // msg.type == "remind"
      ) {
        // 提醒类型消息不去重
        state.messageList.push(msg)
      } else {
        state.messageList.forEach((element, index) => {
          if (element.type == msg.type) {
            state.messageList.splice(index, 1)
          }
        });
        state.messageList.push(msg)
      }
    },
    delDessage(state, info = { type, pid: null }) {
      if (info.pid) {
        state.messageList.forEach((element, index) => {
          if (element.type == "instant" && element.pid == info.pid) {
            state.messageList.splice(index, 1)
          }
        });
      } else {
        state.messageList.forEach((element, index) => {
          if (element.type == info.type) {
            state.messageList.splice(index, 1)
          }
        });
      }
    },
  },
  actions: {
  },
  modules: {}
};