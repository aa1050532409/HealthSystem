import { Get, Post, Delete, FileLoad, download, Put } from '../../http/request.js'
import store from '../../store/index.js';
import { Message } from 'element-ui';
import router from '../../router/index.js'
import localforage from 'localforage'
// 获取用户信息
export function getUserInfo(userID) {
    return Post("/api/personalinfo/userinfo", { UsersID: [userID] }).then(res => {
        if (res.data && res.data.status == 200) {
            return res.data.users_info[0]
        } else {
            return null
        }
    })
}
// 获取用户角色信息
export function getIdRoles(userID) {
    return Post("/api/personalinfo/role", { UserID: userID }).then(res => {
        if (res.data && res.data.status == 200) {
            return res.data.roles
        } else {
            return []
        }
    })
}
// 通过pid获取患者就诊状态
export function getPidState(pid) {
    return Get("/api/chatinfo/seekmedicalstate/" + pid).then(res => {
        return res.data.seekmedseeicalstate
    })
}

// 通过pid获取患者会诊状态
export function getPidHuizhenState(pid) {
    return Get("/api/patientdiag/getputonghuizhenstate/" + pid).then(res => {
        return res.data
    })
}


//获取医疗机构信息
export function getMedicalInfo() {
    return localforage.getItem("MedicalInfo").then(res => {
        if (res) {
            return res
        } else {
            return Get("/api/patientdiag/medicalinfo").then(res => {
                localforage.setItem("MedicalInfo", res.data.medicalinfo)
                console.log(res.data.medicalinfo)
                return res.data.medicalinfo
            })
        }
    })
}



// 获得专家团队信息
export function getExpertGroupInfo() {
    return localforage.getItem("GroupInfo").then(res => {
        if (res) {
            return res
        } else {
            return Get("/api/medicalinfo/expert_hospital").then(res => {
                localforage.setItem("GroupInfo", res.data.groupInfo)
                return res.data.groupInfo
            })
        }
    })
}


export function getPatientInfo(pid) {
    return Get("/api/patientinfo/diagInfo/" + pid).then(res => {
        return res.data.patientinfo
    })
}