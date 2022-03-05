import { Get, Post, Delete, FileLoad, download, Put } from '../../http/request.js'
import store from '../../store/index.js';
import { Message } from 'element-ui';
import router from '../../router/index.js'

// 获取相关患者列表
export function getPatientList() {
    return Get("/api/patientinfo/patientlist").then(res => {
        return res.data.Patient_info
    })
}

// 获取添加的患者列表
export function getAddPatientList() {
    return Get("/api/patientinfo/addPatientList").then(res => {
        return res.data.Patient_info
    })
}


// 获取患者历史病历信息
export function getPatientHistory(account) {
    return Get("/api/patientinfo/patienthistory/" + account).then(res => {
        res.data.patient_info.sort((a, b) => {
            let t1 = new Date(a.date)
            let t2 = new Date(b.date)
            return t2 - t1
        })
        console.log(res)
        return res.data.patient_info
    })
}


// 获取患者历史病历信息
export function getPatientHistoryInfo(account) {
    return Get("/api/patientinfo/addPatientList/DiagRecord/" + account).then(res => {
        // console.log(res)
        return res.data
    })
}




// 添加新患者
export function addNewPatient(data) {
    let newPatient = {
        Name: data.name,
        Gender: data.gender,
        Birthday: data.birthday,
        Phone: data.tel || "无",
        Address: data.address || "无",
        Job: data.job || "无",
    }
    return Post("/api/patientinfo/addPatient", newPatient).then(res => {
        console.log(res);
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })


}

// 创建新的病历
export function addBingli(data, patient) {
    let newBingli = {
        diagTime: data.date, //就诊时间
        date: data.date, //就诊时间
        API_illState: {
            API_description: data.state
        },
        API_history: { //患者历史（家族史，过敏史，过往史）
            API_familyHistory: data.history.jiazu,
            API_allergyHistory: data.history.guoming,
            API_patientistory: data.history.jiwang
        },
        API_examination: data.jianchajieguo,
        expertName: data.expert, //专家的名字
        patientName: patient.name, //患者的名字
        patientUserID: patient.userID, //患者的ID

        isToHospital: data.shifouzhuyuan, //是否需要住院 1表示需要，0表示不需要
        API_diagInfo: {
            API_diagResult: data.zhenduanjielun, //诊断结果
            API_treatment: {
                API_description: data.zhiliaofangan.text, //治疗方案
                API_prescription: data.zhiliaofangan.chufang
            }
        }
    }
    return Post("/api/patientinfo/addPatientList/addDiagRecord", newBingli).then(res => {
        if (res.data) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}




//提交每日护理记录
export function postNursingLogs(pid, data, time) {
    let nursingLog = {
        API_newNursingLog: data,
        nursingTime: time || data.date
    }
    console.log(nursingLog)
    return Post("/api/patientinfo/newnursinglog/" + pid, nursingLog).then((res) => {
        return Promise.resolve(true)
    })
}

//提交评估记录
export function postPingguLogs(pid, data, time) {
    data.assessmentTime = time || data.data.time || Date.now()
    return Post("/api/patientinfo/pinggu/" + pid, data).then((res) => {
        return Promise.resolve(true)
    })
}



// 提交新的治疗记录
// 入院和日常的尚未分开
export function postTreatLogs(pid, data, time) {
    if (data.API_patientState.length == 0 || data.API_treatment.length == 0 || data.API_description.length == 0) {
        return Promise.resolve(false)
    }
    let newTreatLog = {
        API_date: time || data.time || Date.now(),
        API_patientState: data.API_patientState || [],
        API_treatment: data.API_treatment || [],
        API_prescription: data.API_prescription || []
    }
    return Post("/api/patientinfo/treatmentlog/" + pid, newTreatLog).then((res) => {
        return Promise.resolve(true)
    })
}

// 提交患者出院记录
export function endPatientTreat(pid, data, time) {
    let newChuyuan = {
        diagResult: data.diagResult,
        treatLogs: data.treatLogs,
        notes: data.notes,
        endtreatmentDate: time || data.time || Date.now(),
        prescription: data.prescription || []
    }

    return Post("/api/patientinfo/endtreatment/" + pid, newChuyuan).then((res) => {
        console.log(res)
        if (res.data.status != 0) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}

// 提交患者随访记录
export function postFollowLog(pid, data) {
    let obj = {
        time: data.data.nextdate,
        name: "随访记录表",
        API_questionnaire: data.data
    }
    return Post("/api/followmanage/patientdetails/" + pid, obj).then((res) => {
        console.log(res)
        if (res.data && res.data.status != 0) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}


// 还没有的部分
// 添加会诊记录结论
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

// 提交入院治疗方案
export function confirmApply(pid, data, time) {
    if (data.API_patientState.length == 0 || data.API_treatment.length == 0) {
        return Promise.resolve(false)
    }
    let newTreatLog = {
        API_date: time || data.time || Date.now(),
        API_patientState: data.API_patientState || [],
        API_treatment: data.API_treatment || [],
        API_prescription: data.API_prescription || [],
        API_description: data.API_treatment || []
    }
    return Post("/api//patientinfo/before_treatmentlog/" + pid, newTreatLog).then((res) => {
        console.log(res);
        return Promise.resolve(true)
    })
}



// 提交入院评估
export function postRuyuanPinggu(pid, data, time) {
    data.assessmentTime = time || data.data.time || Date.now()
    console.log(data);
    return Post("/api/patientinfo/before_pinggu/" + pid, data).then((res) => {
        console.log(res);
        return Promise.resolve(true)
    })
}


// 查询相似患者
export function possiblePatientSearch(data) {
    // console.log(data);
    let obj = {
        Name: data.name,
        Phone: data.tel
    }
    return Post("/api/patientinfo/addPatient_exist", obj).then((res) => {
        if (res.data.status == 200) {
            return res.data.userList.map(item => {
                return {
                    PatientName: item.Name || "无",
                    PatientID: item.UserID || "无",
                    Gender: item.Gender || "无",
                    Age: item.Age || "无",
                    Phone: item.UserID || "无",
                    Address: item.Address || "无",
                    IdCard: item.IdentityID || "无",
                    Image: item.Image || "无",
                }
            })
        } else {
            return []
        }
        console.log(res);
        return []
    })
}