import { Get, Post, Delete, FileLoad, download, Put } from '../../http/request.js'
import store from '../../store/index.js';
import { Message } from 'element-ui';
import router from '../../router/index.js'
import { key } from 'localforage';
/* 
    住院申请：
        住院申请列表
        住院申请详情
*/


// 获取随访患者列表
export function getPatientList() {
    return Get("/api/followmanage/patientlist").then((res) => {
        return res.data.patientList
    }).catch(() => {
        return []
    })
}



// 获取患者随访记录
export function getFollowLogs(pid) {
    return Get("/api/followmanage/patientdetails/" + pid).then(res => {
        return res.data.API_followLog
    })
}

// 提交患者随访记录
export function postFollowLog(pid, data) {

    let obj = {
        time: data.data.nextdate,
        name: "随访记录表",
        API_questionnaire: data.data
    }
    console.log(obj)
    return Post("/api/followmanage/patientdetails/" + pid, obj).then((res) => {
        console.log(res)
        if (res.data && res.data.status != 0) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}

