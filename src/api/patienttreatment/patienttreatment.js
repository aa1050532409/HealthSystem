import { Get, Post, Delete, FileLoad, download, Put } from '../../http/request.js'
import store from '../../store/index.js';
import { Message } from 'element-ui';
import router from '../../router/index.js'


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

// 住院申请列表
export function getApplyList() {
    return Get("/api/patienttreatment/applylist").then((res) => {
        return res.data.patientsList
    })
}
// 住院申请详情
export function getApplyDetails(pid) {
    return Get("/api/patienttreatment/applydetails/" + pid).then((res) => {
        return res.data;
    })
}
// 确认入院申请
export function confirmApply(pid, data) {
    if (data.API_patientState.length == 0 || data.API_treatment.length == 0) {
        return Promise.resolve(false)
    }
    return Post("/api/patienttreatment/applydetails/confirm/" + pid, data).then((res) => {
        if (res.data.status != 0) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }

    })
}


// 获取住院患者列表
export function getPatientsList() {
    return Get("/api/patienttreatment/patientlist").then((res) => {
        return res.data.API_patientsList
    })

}


// 获取患者详情
export function getPatientsDetails(pid) {
    return Get("/api/patienttreatment/patientdetails/" + pid).then((res) => {
        return res.data.API_basicInfo
    })
}


// 获取治疗记录详情
export function getTreatLogs(pid) {
    return Get("/api/patienttreatment/treatmentlog/" + pid).then((res) => {
        return res.data.API_treatmentLog
    })
}

// 提交新的治疗记录
export function postTreatLogs(pid, data) {
    if (data.API_patientState.length == 0 || data.API_treatment.length == 0 || data.API_description.length == 0) {
        return Promise.resolve(false)
    }
    return Post("/api/patienttreatment/treatmentlog/" + pid, data).then((res) => {
        return Promise.resolve(true)
    })
}

// 获取历史治疗记录
export function getHistoryTreatLog(type) {
    return Promise.resolve([
        {
            API_prescription: [{
                API_drugsName: "二溴甘露醇",
                API_drugsNumber: "2",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "哈药六厂",
                API_useFrequency: "一天一次",
                API_useTime: "五天"
            }],
            API_description: ["规律服药",
                "定期随访",
                "作息规律"],
            API_patientState: ["头痛", "恶心", "呕吐"],
        }, {
            API_prescription: [{
                API_drugsName: "二溴甘露醇",
                API_drugsNumber: "2",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "哈药六厂",
                API_useFrequency: "一天一次",
                API_useTime: "五天"
            }],
            API_description: ["避免压力过大",
                "早睡早起", "定时进食", "定时排便"],
            API_patientState: ["走路困难", "行为多变", "具有进攻性", "辨认亲戚朋友存在困难"],
        }, {
            API_prescription: [{
                API_drugsName: "二溴甘露醇",
                API_drugsNumber: "2",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "哈药六厂",
                API_useFrequency: "一天一次",
                API_useTime: "五天"
            }],
            API_description: ["规律服药",
                "定期随访",
                "作息规律"],
            API_patientState: ["沟通困难", "精神恍惚", "反复提问"],
        }, {
            API_prescription: [{
                API_drugsName: "二溴甘露醇",
                API_drugsNumber: "2",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "哈药六厂",
                API_useFrequency: "一天一次",
                API_useTime: "五天"
            }],
            API_description: ["养成良好的饮食习惯",
                "定期随访",
                "持心情舒畅"],
            API_patientState: ["头晕", "去时间感", "在熟悉的地方迷路"],
        }, {
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
            }],
            API_description: ["按时睡觉",
                "饮食清淡",
                "定期到医院复查"],
            API_patientState: ["容易失语", "恶心", "呕吐"],
        },
    ])



    return Get("/api/patienttreatment/historylog",).then((res) => {
        if (res.data.API_treatmentLog) {
            return res.data.API_treatmentLog.reverse().slice(0, 5)
        } else {
            return []
        }

    })

}

// 提交结束患者治疗
export function endPatientTreat(pid, data) {
    return Post("/api/patienttreatment//endtreatment/" + pid, data).then((res) => {
        if (res.data.status != 0) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })

}


// 获取出院记录
export function getChuyuanLog(pid) {
    return Get("/api/patienttreatment/endtreatment/" + pid).then((res) => {
        console.log(res);
        if (res.data) {
            return res.data
        } else {
            return {
                time: Date.now(),
                diagResult: "",
                treatLogs: "",
                notes: "",
                prescription: [],
            }
        }
    })

}

// 获取历史出院记录
export function getHistoryChuyuanLog() {
    return Promise.resolve([
        {
            API_prescription: [{
                API_drugsName: "二溴甘露醇",
                API_drugsNumber: "2",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "哈药六厂",
                API_useFrequency: "一天一次",
                API_useTime: "五天"
            }],
            diagResult: "该患者患有意识清晰,无重大疾病",
            notes: "好好吃药",
            treatLogs: "该患者治疗效果较好"
        },
        {
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
            }],
            diagResult: "该患者神经纤维受损，轻度阿尔茨海默症入院",
            notes: "注意饮食规律，不要熬夜，多多休息",
            treatLogs: "该患者阿尔茨海默症入院，经40天住院治疗后病情好转"
        },
        {
            API_prescription: [{
                API_drugsName: "盐酸曲马多缓释胶囊",
                API_drugsNumber: "1",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "贵州益康制药有限公司",
                API_useFrequency: "一天一次",
                API_useTime: "三天"
            }],
            diagResult: "该患者说话迟钝，疑似神经纤维受损",
            notes: "出院后规律作息，饮食清淡，避免熬夜",
            treatLogs: "该患者神经纤维受损入院，经30天的住院治疗后，症状好转，思维明显清晰，说话逻辑合理后申请出院"
        },
        {
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
            }],
            diagResult: "蛛网膜囊肿",
            notes: "后续要规律吃药，注意患者血压，避免熬夜",
            treatLogs: "患者颅内出血、囊肿破裂、局部压迫症状、局部颅骨膨隆。入院诊断为蛛网膜囊肿，经甘露醇降压后，症状得到好转。"
        },
        {
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
            }],
            diagResult: "脑脓肿",
            notes: "后续要规律吃药，注意患者血压，避免熬夜",
            treatLogs: "患者入园前乳突疼痛、耳道流脓、颅内高压，诊断为脑囊肿，后使用甘露醇进行颅内降压，状态得到好转"
        },
    ])
    return Get("/api/patienttreatment/historychuyuanlog").then((res) => {
        if (res.data) {
            console.log(res.data)
            return res.data.historyPatient
        }
    })

}

// 历史住院患者列表
export function getHistoryPatientList() {
    return Get("/api/patienttreatment/historypatientlist").then((res) => {
        return res.data.patientList
    }).catch(() => {
        return []
    })
}

// 获取患者是否申请出院
export function getChuyuanApplyTag(pid) {
    return Get("/api/patienttreatment/shenqingchuyuan/" + pid).then((res) => {
        console.log(res.data);
        return res.data
    }).catch(() => {
        return []
    })
}

// 拒绝患者出院申请
export function refuseChuyuanApply(pid) {
    return Get("/api/patienttreatment/shenqingchuyuan/" + pid).then((res) => {
        console.log(data);
        return res.data
    }).catch(() => {
        return []
    })
}