import { Get, Post, Delete, FileLoad, download, Put } from '../../http/request.js'
import store from '../../store/index.js';
import { Message } from 'element-ui';
import router from '../../router/index.js'
/* 
    住院申请：
        住院申请列表
        住院申请详情
*/

// 住院申请列表 
export function getApplyList() {
    return Get("/api/operationmanage/applylist").then((res) => {
        if (res.data.status !== 200) {
            return []
        } else {
            return res.data.patientsList;
        }
    })
}

// 住院申请详情
export function getApplyDetails(pid) {
    return Get("/api/operationmanage/applydetails/" + pid).then((res) => {
        let arr = [
            {
                data: {},
                name: "吞咽功能评定",
                state: "未完成"
            }, {
                data: {},
                name: "跌倒风险评定",
                state: "未完成"
            },
            {
                data: {},
                name: "护理记录首页",
                state: "未完成"
            },
            {
                data: {},
                name: "Barthle指数评定",
                state: "未完成"
            },
        ]
        res.data.API_questionnaire.forEach(element => {
            arr.forEach(item => {
                if (element.name == item.name) {
                    item.state = '已完成'
                    item.data = element.data
                }
            })
        });

        res.data.API_questionnaire = arr
        res.data.API_questionnaire.forEach(item => {
            switch (item.name) {
                case '吞咽功能评定':
                    item.type = 'TUNYAN'
                    break;
                case '跌倒风险评定':
                    item.type = 'DIEDAO'
                    break;
                case '护理记录首页':
                    item.type = 'HULI'
                    break;
                case 'Barthle指数评定':
                    item.type = 'HUXI'
                    break;
            }
        })
        return res.data;
    })
}

// 提交入院评估
export function postRuyuanPinggu(pid, data) {
    return Post("/api/operationmanage/applydetails/pinggu/" + pid, data).then((res) => {
        return Promise.resolve(true)
    })
}

// 提交新的护理记录
export function newQuestionnaire(pid, name, data) {
    let obj = {
        time: new Date(),
        name: name,
        data: data
    }
    return Post("/api/operationmanage/newquestionnaire/" + pid, obj).then((res) => {
        Message.success("成功")
        return true
    })
}


// 确认入院评估
export function pingguConfirm(pid) {
    return Post("/api/operationmanage/applydetails/confirm/" + pid).then((res) => {
        console.log(pid)
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}

// 住院患者列表
export function getPatientsList() {
    return Get("/api/operationmanage/patientlist").then((res) => {
        console.log(res)
        if (res.data.status != 0) {
            return res.data.patientsList;
        } else {
            return []
        }
    })
}

// 住院患者详情
export function getPatientsDetails(pid) {
    return Get("/api/operationmanage/applydetails/" + pid).then((res) => {
        return res.data.API_basicInfo
    })
}

// 获取每日护理记录
export function getNursingLogs(pid) {
    return Get("/api/operationmanage/patientdetails/nursinglogs/" + pid).then((res) => {
        let arr = [];
        res.data.API_nursingLogs.forEach(item => {
            arr.push({
                ...item.NursingRecord,
                date: item.NursingDate
            })
        })
        return arr
    })
}

//提交每日护理记录
export function postNursingLogs(pid, data) {
    return Post("/api/operationmanage/patientdetails/newnursinglog/" + pid, { API_newNursingLog: data }).then((res) => {
        Message.success("提交成功")
        return Promise.resolve(true)
    })
}

// 获取每日评估记录
export function getPingguLogs(pid) {
    return Get("/api/operationmanage/pinggulogs/" + pid).then((res) => {
        return res.data.API_nursingLog
    })
}

//提交评估记录
export function postPingguLogs(pid, data) {
    return Post("/api/operationmanage/newpinggulog/" + pid, data).then((res) => {
        return Promise.resolve(true)
    })
}


//设置评估时间
export function setPingguTime(pid, data) {
    return Post("/api/operationmanage/pinggutixing/" + pid, data).then(() => {
        return new Promise(resolve => {
            resolve(true)
        })
    })
}

// 获取入院记录
export function getRuyuanLogs(pid) {
    return Get("/api/operationmanage/ruyuanlog/" + pid).then((res) => {
        console.log("weeeee", res);
        res.data.API_questionnaire.forEach(item => {
            item.state = "已完成"
            switch (item.name) {
                case "跌倒风险评定":
                    item.type = "DIEDAO"
                    break;
                case "吞咽功能评定":
                    item.type = "TUNYAN"
                    break;
            }
        })
        let obj = {
            pinggu: res.data.API_questionnaire,
            treat: res.data.ruyuanLog.length >= 1 ? res.data.ruyuanLog[0] : {}
        }
        return obj
    })
}

// 获取历史患者
export function getHistoryPatient(pid) {
    return Promise.resolve([
        {
            API_toHospitalID: "202009188426",
            API_expert: "专家2",
            API_date: "2020-09-18 10:06:28",//出院时间
            API_pid: 426,
            API_name: "zhangxiao"
        }
    ])
}


// 存储评估模板
export function saveTamplate(template) {
    console.log(template)
    return Post("/api/operationmanage/savetemplate", template).then((res) => {
        return res
    })
}


// 获取评估模板
export function getTamplate(type) {

    return Post("/api/operationmanage/gettemplate", {
        type: type
    }).then((res) => {
        if (res.data.status == 0) {
            return false
        } else {
            return res.data.form.data
        }

    })

}


// 获取评估上次护理记录表内容
export function getLastNursingLog(pid) {
    return Post("/api/operationmanage/historylog/" + pid).then((res) => {
        console.log(res)
        if (res.data.status != 0) {
            return res.data.API_nursingLog
        } else {
            return false
        }

        // return Promise.resolve("hahaha")
    })

}


// 历史住院患者列表
export function getHistoryPatientList() {
    return Get("/api/operationmanage/historypatientlist").then((res) => {
        console.log(res)
        res.data.patientList.reverse()
        return res.data.patientList
    }).catch(() => {
        return []
    })
}