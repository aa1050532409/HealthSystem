import { Get, Post, Delete, FileLoad, download, Put } from '../../http/request.js'
import store from '../../store/index.js';
import { Message } from 'element-ui';
import router from '../../router/index.js'
/* 
    住院申请：
        住院申请列表
        住院申请详情
*/

//获取患者信息

export function getPatientDetails(consultationId) {
    return Promise.resolve({
        "API_basicInfo": {
            "API_address": "四川省成都市",
            "API_gender": "男",
            "API_birthday": "1996-07-23",
            "API_UserId": "101001",
            "API_date": "2020-06-24",
            "API_tel": "19999999999",
            "API_name": "王小虎",
            "API_pic": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
        },
    })
}

// 会诊列表 
export function getGroupConsultationList() {
    return Get("/api/groupconsultation/consultationlist").then(res => {
        return res.data.consultationlist
    })
}

// 会诊列表 
export function getHisGroupConsultationList() {
    return Get("/api/groupconsultation/historyconsultationlist").then(res => {
        return res.data.consultationlist
    })
}


// 发起会诊
export function startGroupConsultation(pid, data) {
    return Post("/api/groupconsultation/startconsultation/" + pid, data).then(res => {
        if (res.data && res.data.status != 0) {
            return true
        } else {
            return false
        }
    })

}
// 发起会诊(患者)
export function startGroupConsultation_patient(pid, data) {
    return Post("/api/groupconsultation/startconsultation_patient/" + pid, data).then(res => {
        if (res.data && res.data.status != 0) {
            return true
        } else {
            return false
        }
    })

}

// 获取会诊意见
export function getDiscussDetails(consultationId) {
    return Get("/api/groupconsultation/discussion/" + consultationId).then(res => {
        res.data.discussion.reverse()
        return res.data
    })
}

// 提交会诊意见
export function postDiscussOpinion(consultationId, content) {
    return Post("/api/groupconsultation/consultationopinion/" + consultationId, { content: content }).then(res => {
        if (res.data && res.data.status != 0) {
            return true
        } else {
            return false
        }
    })
}

// 结束会诊
export function stopGroupConsultation(consultationId, data) {
    data.after = data.after || []
    data.prescription = data.prescription || []
    return Post("/api/groupconsultation/endconsultation/" + consultationId, data).then(res => {
        console.log(res)
        if (res.data && res.data.status != 0) {
            return true
        } else {
            return false
        }
    })
}

// 获得会诊信息
export function getConsultationInfo(consultationId) {
    return Get("/api/groupconsultation/consultationinfo/" + consultationId).then(res => {
        return res.data.consultationinfo
    })
}



// 获得会诊结论
export function getConsultationConclusion(consultationId) {
    return Get("/api/groupconsultation/conclusion/" + consultationId).then(res => {
        return res.data
    })

}


// 获得会诊结论
export function getConsultationResult() {
    return Promise.resolve([{
        conclusion: "该患者疑似阿尔茨海默症中期",
        treatOpinion: "建议住院治疗",
        prescription: [{
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
        after: []
    },
    {
        conclusion: "该患者神经纤维受损，考虑轻度阿尔茨海默症",
        treatOpinion: "建议使用甘露醇进行颅内降压",
        prescription: [
            {
                API_drugsName: "甘露醇烟酸酯片",
                API_drugsNumber: "1",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "沈阳奥吉娜药业有限公司",
                API_useFrequency: "一天三次",
                API_useTime: "三天"
            },
            {
                API_drugsName: "盐酸曲马多缓释胶囊",
                API_drugsNumber: "1",
                API_drugsNumberUnits: "粒",
                API_drugsSpecification: "0.1g",
                API_drugsUsage: "1",
                API_manufacturer: "贵州益康制药有限公司",
                API_useFrequency: "一天一次",
                API_useTime: "三天"
            }
        ],
        after: []
    },
    {
        conclusion: "该患者重度失语言，行走颠簸，疑似脑神经受损，考虑中度阿尔茨海默症",
        treatOpinion: "在远程医疗平台中长期住院",
        prescription: [{
            API_drugsName: "甘油果糖氯化钠注射",
            API_drugsNumber: "1",
            API_drugsNumberUnits: "粒",
            API_drugsSpecification: "0.1g",
            API_drugsUsage: "1",
            API_manufacturer: "沈阳奥吉娜药业有限公司",
            API_useFrequency: "一天三次",
            API_useTime: "三天"
        }],
        after: []
    },
    {
        conclusion: "该患者患有意识清晰，无重大疾病",
        treatOpinion: "建议出院",
        prescription: [{
            API_drugsName: "呋塞米片",
            API_drugsNumber: "1",
            API_drugsNumberUnits: "粒",
            API_drugsSpecification: "0.1g",
            API_drugsUsage: "1",
            API_manufacturer: "沈阳奥吉娜药业有限公司",
            API_useFrequency: "一天三次",
            API_useTime: "三天"
        },],
        after: []
    },
    {
        conclusion: "该患者患有意识清晰，无重大疾病",
        treatOpinion: "建议出院",
        prescription: [{
            API_drugsName: "呋塞米片",
            API_drugsNumber: "1",
            API_drugsNumberUnits: "粒",
            API_drugsSpecification: "0.1g",
            API_drugsUsage: "1",
            API_manufacturer: "沈阳奥吉娜药业有限公司",
            API_useFrequency: "一天三次",
            API_useTime: "三天"
        }],
        after: []
    }])
    return Get("/api/groupconsultation/historyconsultationresult").then(res => {
        res.data.historyResult.reverse()
        return res.data.historyResult
    })

}

// 获得会诊意见
export function getConsultationOpinion() {
    return Promise.resolve([
        { opinion: "该患者海马萎缩，生活不能自理，建议住院长期治疗" },
        {
            opinion:
                "该患者精神萎靡，目光呆滞，有严重的神经性创伤，需要长期看护治疗"
        },
        { opinion: "该患者精神长期头晕失眠，需要给予安眠治疗药物" },
        { opinion: "患者长期失语，思维能力低下，建议到医院进一步检查" },
        { opinion: "患者目光呆滞，怀疑失去思考能力" }
    ])
    return Get("/api/groupconsultation/historyconsultationopinion").then(res => {
        res.data.historyOpinion.reverse()
        let arr = res.data.historyOpinion.slice(0, 5).map(item => {
            return {
                opinion: item.Opinion
            }
        })
        return arr
    })

}


// 获得根据pid获取会诊记录
export function getConsultationLogs(pid) {
    return Get("/api/groupconsultation/grouplogs/" + pid).then(res => {
        let arr = res.data.huizhenLogs.filter(item => {
            return item.consultationInfo.state == "会诊已结束"
        })
        return arr
    })

}

