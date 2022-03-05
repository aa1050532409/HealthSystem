import Mock from 'mockjs'
Mock.mock('/api/personalfinance', 'get', {
  status: 200,
  message: 'chenggonghuoqushangping',
  data: {
    name: 'huotuichang'
  }
})
// 机构信息列表
Mock.mock('/api/medicalinfo/organization', 'get', {
  status: 200,
  data: {
    listInfo: [
      {
        pic: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
        name: "北京协和医院",
        class: "三级甲等",
        address: "北京市东城区帅府园1号（东院）;西城区大木仓胡同41号（西院）",
        introduction:
          "北京协和医123院是集医疗、教学、科研于一体的大型三级甲等综合医院......",
        orgId: "1"
      },
      {
        pic: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
        name: "北京协和医院",
        class: "三级甲等",
        address: "北京市东城区帅府园1号（东院）;西城区大木仓胡同41号（西院）",
        introduction:
          "北京协和医123院是集医疗、教学、科研于一体的大型三级甲等综合医院......",
        orgId: "1"
      },
      {
        pic: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
        name: "北京协和医院",
        class: "三级甲等",
        address: "北京市东城区帅府园1号（东院）;西城区大木仓胡同41号（西院）",
        introduction:
          "北京协和医123院是集医疗、教学、科研于一体的大型三级甲等综合医院......",
        orgId: "1"
      },
      {
        pic: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
        name: "北京协和医院",
        class: "三级甲等",
        address: "北京市东城区帅府园1号（东院）;西城区大木仓胡同41号（西院）",
        introduction:
          "北京协和医院是集医疗、教学、科研于一体的大型三级甲等综合医院......",
        orgId: "2"
      },
      {
        pic: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
        name: "北京协和医院",
        class: "三级甲等",
        address: "北京市东城区帅府园1号（东院）;西城区大木仓胡同41号（西院）",
        introduction:
          "北京协和医院是集医疗、教学、科研于一体的大型三级甲等综合医院......",
        orgId: "3"
      },
      {
        pic: "",
        name: "北京协和医院",
        class: "三级甲等",
        address: "",
        introduction: "",
        orgId: "3"
      }
    ]
  }
})

// 机构信息详情
Mock.mock('/api/medicalinfo/orgdetail', 'get', {
  status: 200,
  data: {
    orgInfo: {
      basicInfo: {
        name: "北京协和医院",
        class: "三级甲等",
        type: "综合医院",
        address: "北京市东城区帅府园1号（东院）;西城区大木仓胡同41号（西院）",
        tel: "010-67096611(总机)",
        pic: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg"
      },
      introduction: `首都医科大学附属北京天坛医院始建于1956年8月23日，首都医科大学附属北京天坛医院始建于1956年8月23日，首都医科大学附属北京天坛医院始建于1956年8月23日，首都医科大学附属北京天坛医院始建于1956年8月23日，首都医科大学附属北京天坛医院始建于1956年8月23日，`,
      doctors: [
        {
          name: "张三",
          account: "19984333897",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
          department: "支付宝",
          nurId: "1"
        },
        {
          name: "张三",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
          account: "19984333897",
          department: "支付宝",
          nurId: "1"
        },
        {
          name: "张三",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
          account: "19984333897",
          department: "支付宝",
          nurId: "1"
        },
        {
          name: "张三",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
          account: "19984333897",
          department: "支付宝",
          nurId: "1"
        },
        {
          name: "张三",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
          account: "19984333897",
          department: "支付宝",
          nurId: "1"
        },
        {
          name: "张三",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
          account: "19984333897",
          department: "银行卡",
          nurId: "1"
        },
        {
          name: "张三",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
          account: "19984333897",
          department: "微信",
          nurId: "1"
        }
      ],
      nurses: [
        {
          name: "王五",
          account: "19984333897",
          department: "肝胆外科",
          nurId: "1",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg"
        },
        {
          name: "王五",
          account: "19984333897",
          department: "肝胆外科",
          nurId: "1",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg"
        },
        {
          name: "王五",
          account: "19984333897",
          department: "肝胆外科",
          nurId: "1",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg"
        },
        {
          name: "王五",
          account: "19984333897",
          department: "肝胆外科",
          nurId: "1",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg"
        },
        {
          name: "王五",
          account: "19984333897",
          department: "肝胆外科",
          nurId: "1",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg"
        },
        {
          name: "王五",
          account: "19984333897",
          department: "肝胆外科",
          nurId: "1",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg"
        },
        {
          name: "王五",
          account: "19984333897",
          department: "肝胆外科",
          nurId: "1",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg"
        },
        {
          name: "王五",
          account: "19984333897",
          department: "肝胆外科",
          nurId: "1",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg"
        }
      ]
    }
  }
})

// 医师详情
Mock.mock('/api/medicalinfo/docdetail', 'get', {
  status: 200,
  data: {
    docDetail: {
      name: "医师",
      department: "医疗器械/医用敷料及卫生材料",
      specialty:
        "鄂食药监械(准)字2013第2641767号 (湖北华中医用材料有限公司生产)",
      introduction:
        "产品与伤口渗液相接触时，其中具有生物活性的生活活性玻璃(BG) 即可与组织发生一系列反应， 形成一个羟基磷灰 HAP网络又作为新生组织的支架，使新生组织得以顺利爬移。而透明质酸钠(HA) 具有促进创面愈合组织中表皮生长因子含量增加， 调控胶原合成、调节纤维活性和抗炎等作用; HA还能抑制胶原纤维组织挛缩，直至组织得到再生性修复。石"
    }
  }
})

// 专家团队列表
Mock.mock('/api/medicalinfo/expertgroup', 'get', {
  status: 200,
  data: {
    listInfo: [
      {
        pic: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
        name: "李杜军专家团队",
        count: 10,
        specialty:
          "视神经萎缩 玻璃体混浊 病毒性角膜炎 视网膜血管炎 视神经血管炎 视神经病变 眼底血管性疾病",
        introduction:
          "湖北省中医院眼科专家团队，以李杜军为首席专家组成。眼科为湖北省重点专科，湖北省中医院眼科专家团队，以李杜军为首席专家组成。眼科为湖北省重点专科，",
        expertGroupId: "1"
      }
    ],
  }
})

// 专家团队详情
Mock.mock('/api/medicalinfo/expertgroupdetail', 'get', {
  status: 200,
  data: {
    expertGroupInfo: {
      basicInfo: {
        pic: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
        name: "李杜军专家团队",
        specialty: "视神经萎缩 玻璃体混浊 病毒性角膜炎 ",
        introduction:
          "湖北省中医院眼科专家团队，以李杜军为首席专家组成。眼科为湖北省重点专科，湖北省中医院眼科专家团队，以李杜军为首席专家组成。眼科为湖北省重点专科，",
        expertGroupId: "1",
        tel: "11191919212"
      },
      introduction: `首都医科大学附属北京天坛医院始建于1956年8月23日，首都医科大学附属北京天坛医院始建于1956年8月23日，首都医科大学附属北京天坛医院始建于1956年8月23日，首都医科大学附属北京天坛医院始建于1956年8月23日，首都医科大学附属北京天坛医院始建于1956年8月23日，`,
      experts: [
        {
          name: "张三",
          account: "19984333897",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
          department: "支付宝",
          expId: "1"
        },
        {
          name: "张三",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
          account: "19984333897",
          department: "支付宝",
          expId: "1"
        },
        {
          name: "张三",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
          account: "19984333897",
          department: "支付宝",
          expId: "1"
        },
        {
          name: "张三",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
          account: "19984333897",
          department: "支付宝",
          expId: "1"
        },
        {
          name: "张三",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
          account: "19984333897",
          department: "支付宝",
          expId: "1"
        },
        {
          name: "张三",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
          account: "19984333897",
          department: "银行卡",
          expId: "1"
        },
        {
          name: "张三",
          portrait: "http://132.232.18.227:8087/downloadfile?url=upload/f2a9a49d6d688694cd0a411618a33931.jpg",
          account: "19984333897",
          department: "微信",
          expId: "1"
        }
      ]
    },
  }
})
// mock(url,method,data)

