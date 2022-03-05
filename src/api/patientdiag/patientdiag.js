import { Get, Post } from '../../http/request.js'
import store from '../../store/index.js';
import { Message } from 'element-ui';
import router from '../../router/index.js'
import { getConsultationLogs } from "@api/groupconsultation/groupconsultation.js"
// 获取今日就诊申请列表
export function getTodayPatients() {
    return Get("/api/patientdiag/todaypatients").then((res) => {
        if (res.data.seekmedicaladvicedata.length > 0) {
            res.data.seekmedicaladvicedata.forEach(item => {
                item.API_pid = item.pid
            })
            return res.data.seekmedicaladvicedata
        }
        else return []
    })
}

// 获取今日待诊列表
export function getTodayDaizhen() {
    return Get("/api/patientdiag/todaydaizhen").then((res) => {
        if (res.data.seekmedicaladvicedata.length > 0) {
            res.data.seekmedicaladvicedata.forEach(item => {
                item.API_pid = item.pid
            })
            return res.data.seekmedicaladvicedata
        }
        else return []
    })
}

// 获取历史者列表
export function getHistoryPatients(pid) {
    return Get("/api/patientdiag/historypatients").then((res) => {
        if (res.data.seekmedicaladvicedata.length > 0) {
            res.data.seekmedicaladvicedata.forEach(item => {
                item.API_pid = item.pid
            })
        }
        return res.data.seekmedicaladvicedata
    })
}


// 获取患者详情信息
export function getPatientDetails(pid) {
    return Get("/api/patientdiag/patient/" + pid).then((res) => {
        if (res.status == 200) {
            let obj = {};
            obj.patientInfo = {};
            obj.API_diagInfo = {};
            obj.patientInfo.API_basicInfo = res.data.API_basicInfo;
            obj.patientInfo.API_basicInfo.API_isGroupConsultation = res.data.API_isGroupConsultation;
            obj.patientInfo.API_illState = res.data.API_illState;
            obj.patientInfo.API_history = res.data.API_history;
            obj.patientInfo.API_examResult = res.data.API_examResult;
            obj.API_diagInfo = res.data.API_diagInfo;
            obj.API_state = res.data.API_state;
            obj.patientInfo.API_IsGroupConsultationState = res.data.API_IsGroupConsultationState
            // 临时做法，问题很大
            if (res.data.API_state == "会诊临时申请") {
                return getConsultationLogs(pid).then(res => {
                    // console.log('res', res)
                    let huizhenLog = res.shift()
                    let dR = (huizhenLog && huizhenLog.consultationResult.conclusion) || "无"
                    let tO = (huizhenLog && huizhenLog.consultationResult.treatOpinion) || "无"
                    let pr = (huizhenLog && huizhenLog.consultationResult.prescription) || []
                    obj.API_diagInfo.API_diagResult = [dR]
                    obj.API_diagInfo.API_treatment.API_description = [tO]
                    obj.API_diagInfo.API_treatment.API_prescription = pr
                    return obj
                })
            }
            // console.log(obj);
            return obj
        } else {
            return new Promise((resolve) => {
                resolve(res)
                router.push("/patientdiag/todaydiagnosis")
            })
        }

    })
}

// 保存患者诊断信息
export function savePatientDiagInfo(pid, API_state, API_illState, API_diagInfo) {
    let obj = {};
    obj.API_state = API_state;
    obj.API_illState = {};
    obj.API_illState.API_description = API_illState.API_description
    obj.API_diagInfo = API_diagInfo
    Post("/api/patientdiag/patient/" + pid, obj).then(res => {
        if (res.data.status != 0) {
            Message.success(res.data.msg)
            router.push("/patientdiag/todaydiagnosis")
        } else {
            Message.error("保存失败")
        }
    })



}

//获取患者状态描述选项
export function getStateOptions() {
    if (localStorage.getItem("stateopt")) {
        return new Promise(resolve => {
            let obj = JSON.parse(localStorage.getItem("stateopt"))
            resolve(obj)
        })
    } else {
        return Get("/api/patientdiag/stateoptions").then(res => {
            localStorage.setItem("stateopt", JSON.stringify(res.data.stateOptions))
            return res.data.stateOptions
        })
    }

}

//获取诊断结论描述选项
export function getResultOptions() {
    if (localStorage.getItem("resultopt")) {
        return new Promise(resolve => {
            let obj = JSON.parse(localStorage.getItem("resultopt"))
            resolve(obj)
        })
    } else {
        return Get("/api/patientdiag/resultoptions").then(res => {
            localStorage.setItem("resultopt", JSON.stringify(res.data.resultoptions1))
            return res.data.resultoptions1
        })
    }
}

//获取治疗方案描述选项
export function getTreatmentOptions() {
    if (localStorage.getItem("treatmentopts")) {
        return new Promise(resolve => {
            let obj = JSON.parse(localStorage.getItem("treatmentopts"))
            resolve(obj)
        })
    } else {
        return Get("/api/patientdiag/treatmentoptions").then(res => {
            localStorage.setItem("treatmentopts", JSON.stringify(res.data.treatmentOptions))
            return res.data.treatmentOptions
        })
        // }
    }
}
//获取历史诊断结论
export function getDiagHistory() {
    // if (localStorage.getItem("diaghistoryopts")) {
    //     return new Promise(resolve => {
    //         console.log(localStorage.getItem("diaghistoryopt"))
    //         let obj = JSON.parse(localStorage.getItem("diaghistoryopt"))
    //         resolve(obj)
    //     })
    // } else {
    return Promise.resolve([
        ["一氧化碳中毒性脑病",
            "三期梅毒性脑膜炎",
            "X-连锁隐性遗传脊髓小脑性共济失调",
        ],
        ["脊髓空洞症",
            "脊柱硬膜外血肿",
            "脊髓血管畸形",],
        ["脑脓肿",
            "脑内寄生虫",
            "脉络丛肿瘤",
            "三期梅毒性脑膜炎"],
        ["一氧化碳中毒性脑病",
            "三期梅毒性脑膜炎",
            "X-连锁隐性遗传脊髓小脑性共济失调",
            "胶质瘤"],
        ["血管母细胞瘤",
            "三期梅毒性脑膜炎",
            "脊髓血管畸形"],
    ])
    // return Get("/api/patientdiag/diaghistory").then(res => {
    //     console.log(res.data.diagHistory)
    //     return res.data.diagHistory
    // })
    // }

}
//获取历史治疗方案
export function getTreatHistory() {
    return Promise.resolve([
        {
            API_description: ['一般治疗', '清淡饮食', '多吃水果蔬菜'],
            API_prescription: [{
                API_drugsName: "盐酸曲马多缓释胶囊",
                API_drugsNumber: "1",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "贵州益康制药有限公司",
                API_useFrequency: "一天一次",
                API_useTime: "三天"
            }]
        },
        {
            API_description: ['规律服药', '作息规律', '心理辅导治疗'],
            API_prescription: [{
                API_drugsName: "二溴甘露醇",
                API_drugsNumber: "2",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "哈药六厂",
                API_useFrequency: "一天一次",
                API_useTime: "五天"
            }]
        },
        {
            API_description: ['清淡饮食，验证消耗期加强高质量蛋白质摄入，避免高油高糖饮食', '清淡饮食', '多吃水果蔬菜'],
            API_prescription: [{
                API_drugsName: "甘露醇烟酸酯片",
                API_drugsNumber: "1",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "沈阳奥吉娜药业有限公司",
                API_useFrequency: "一天三次",
                API_useTime: "三天"
            }, {
                API_drugsName: "呋塞米片",
                API_drugsNumber: "1",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "沈阳奥吉娜药业有限公司",
                API_useFrequency: "一天三次",
                API_useTime: "三天"
            }]
        }
        ,
        {
            API_description: ['避免熬夜、抽烟、酗酒，避免高油高糖饮食', '定期检查血常规，肝功能'],
            API_prescription: [{
                API_drugsName: "甘露醇烟酸酯片",
                API_drugsNumber: "1",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "沈阳奥吉娜药业有限公司",
                API_useFrequency: "一天三次",
                API_useTime: "三天"
            }, {
                API_drugsName: "甘油果糖氯化钠注射",
                API_drugsNumber: "1",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "沈阳奥吉娜药业有限公司",
                API_useFrequency: "一天三次",
                API_useTime: "三天"
            }]
        },
        {
            API_description: ['勤翻身，常按摩骨突部位', '避免剧烈运动'],
            API_prescription: [{
                API_drugsName: "甘露醇烟酸酯片",
                API_drugsNumber: "1",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "沈阳奥吉娜药业有限公司",
                API_useFrequency: "一天三次",
                API_useTime: "三天"
            }, {
                API_drugsName: "呋塞米片",
                API_drugsNumber: "1",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "沈阳奥吉娜药业有限公司",
                API_useFrequency: "一天三次",
                API_useTime: "三天"
            }]
        }

    ])
    if (localStorage.getItem("treathistoryopts")) {
        return new Promise(resolve => {
            let obj = JSON.parse(localStorage.getItem("treathistoryopts"))
            console.log(obj)
            resolve(obj)
        })
    } else {
        return Get("/api/patientdiag/treathistory").then(res => {
            localStorage.setItem("treathistoryopts", JSON.stringify(res.data.treatHistory))
            return res.data.treatHistory
        })
    }
}

//获取医疗机构信息
export function getMedicalInfo() {
    // if (localStorage.getItem("medicalinfoopt")) {
    //     return new Promise(resolve => {
    //         let obj = JSON.parse(localStorage.getItem("medicalinfoopt"))
    //         resolve(obj)
    //     })
    // } else {
    return Get("/api/patientdiag/medicalinfo").then(res => {
        // localStorage.setItem("medicalinfoopt", JSON.stringify(res.data.medicalinfo))
        // console.log(res.data.medicalinfo)
        return res.data.medicalinfo
    })
    // }
}

// 获取药品信息
export function getDurgsInfo(page, name) {
    return Post("/api/patientdiag/durgsearch", {
        name: name,
        page: page + ""
    }).then(res => {
        if (res.data.data.length == 0) {
            Message.error("没有找到相关药品")
        }
        return res.data

    })
}

// 获取历史处方
export function getHistoryPrescription(page) {
    return Post("/api/patientdiag/prescriptionhistory", { page: page + "" }).then(res => {
        return res.data
    })
}

// 发起患者转诊
export function startZhuanzhen(pid, data) {
    return Post("/api/patientdiag/referral", { pid: pid + "", reason: data.reason, person: data.person }).then(res => {
        if (res.data.status == 200) {
            store.commit("patientDiag/patientDiag_zhuanzhenState", "等待患者确认")
            return Promise.resolve(true)
        }
    })
}

// 获取患者的转诊状态 。
// 0 未发起转诊或转诊申请被拒绝  1 发起了转诊患者尚未同意 2 已经转诊
export function getZhuanzhenState(pid) {
    return Promise.resolve({
        huizhenState: 0
    })
    // return Post("/api/patientdiag/prescriptionhistory", { page: page + "" }).then(res => {
    //     return res.data
    // })
}

// 获取团队中患者列表
export function getGroupPatients() {
    return Get("/api/patientdiag/discussionpatients").then((res) => {
        if (res.data && res.data.status == 200) {
            res.data.seekmedicaladvicedata.forEach(item => {
                item.API_pid = item.pid
            })
            return res.data.seekmedicaladvicedata

        } else {
            return []
        }
    })
}



// 获取某次就诊的全部讨论
export function getDiscussionContent(pid) {
    return Get("/api/patientdiag/discussion/" + pid).then((res) => {
        if (res.data && res.data.status == 200) {
            return res.data.discussion

        } else {
            return []
        }
    })
}

// 提交某次就诊的的讨论
export function postDiscussionContent(pid, content) {
    return Post("/api/patientdiag/discussion/" + pid, {
        content: content
    }).then((res) => {
        if (res.data && res.data.status == 200) {
            return true
        } else {
            return false
        }
    })
}


// 拒绝患者的会诊申请
export function refuseConsultationApply(pid) {
    return Get("/api/patientdiag/jujuehuizhen/" + pid).then((res) => {
        if (res.data && res.data.status == 200) {
            return true
        } else {
            return false
        }
    })
}


