import { Get, Post, Delete, FileLoad, download, Put } from '../../http/request.js'
import store from '../../store/index.js';
import { Message } from 'element-ui';
import router from '../../router/index.js'
import patientCommunication from '../../store/instantInfo/patientCommunication.js';
/* 
    住院申请：
        住院申请列表
        住院申请详情
*/

// 发起视频会诊
export function starVideoConsultation(pid, data) {
    let obj = {
        reason: data.reason || "",
        type: '视频会诊',
        startTime: data.startTime || Date.now(),
        endTime: data.endTime || Date.now(),
        person: {
            groups: data.person.groups || [],
            orgs: data.person.orgs || []
        }
    }
    return Post("/api/video_groupconsultation/startconsultation/" + pid, obj).then(res => {
        console.log(res);
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            console.log(res);
            return Promise.resolve(false)
        }
    })
    // console.log(obj);
    // return Promise.resolve(true)
}

export function displayChange(id) {
    return Post("/api/video_groupconsultation/layout", {
        "nid": id
    }).then(res => {
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}


// 发起视频会诊
export function starVideoConsultation_patient(pid, data) {
    let obj = {
        gid: data.gid,
        reason: data.reason || "",
        type: '视频会诊',
        startTime: data.startTime || Date.now(),
        endTime: data.endTime || Date.now(),
        person: {
            groups: data.person.groups || [],
            orgs: data.person.orgs || []
        }
    }
    return Post("/api/video_groupconsultation/startconsultation/" + pid, obj).then(res => {
        console.log(res);
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            console.log(res);
            return Promise.resolve(false)
        }
    })
    // console.log(obj);
    // return Promise.resolve(true)
}

// 会诊申请列表 
export function getVideoConsultationApplyList() {
    return Get("/api/video_groupconsultation/consultationApplyList").then(res => {
        if (res.data.consultationApplyList) {
            let temp = res.data.consultationApplyList.map(item => {
                return {
                    API_consulationId: item.GroupConsultationID,
                    API_pid: item.pid,
                    API_Name: item.PatientName,
                    API_type: item.DoctorType,
                    API_source: item.API_source || 'jiuzhen',
                    API_holder: item.HolderName,
                    API_state: item.DoctorState,
                    API_applyTime: item.GroupConsultationApplicationDateTime,
                }
            })
            return Promise.resolve(temp)
        } else {
            return Promise.resolve([])
        }
    })
}

// 获取会诊患者列表 
export function getMyVideoConsultationList() {

    return Get("/api/video_groupconsultation/myConsultationList").then(res => {
        if (res.data.consultationlist) {
            let temp = res.data.consultationlist.map(item => {
                return {
                    API_consulationId: item.API_consulationId,
                    API_pid: item.pid,
                    API_Name: item.API_Name,
                    API_type: item.API_type,
                    API_holder: item.API_holder,
                    API_source: item.API_source || 'jiuzhen',
                    API_state: item.API_state,
                    API_startTime: item.API_startTime,
                    API_endTime: item.API_endTime,
                }
            })
            return temp
        } else {
            return []
        }
    })
}


//根据会诊id获取患者信息
export function getPatientDetails(consultationId) {
    return Get("/api/groupconsultation/patientinfo/" + consultationId).then(res => {
        console.log(res);
    })
    let obj = {
        API_address: "",
        API_gender: "",
        API_birthday: "",
        API_UserId: "",
        API_date: "",
        API_tel: "",
        API_name: "",
        API_pic: "",
    }
    return Promise.resolve({
        API_basicInfo: {
            API_address: "四川省成都市",
            API_gender: "男",
            API_birthday: "1996-07-23",
            API_UserId: "101001",
            API_date: "2020-06-24",
            API_tel: "19999999999",
            API_name: "王小虎",
            API_pic: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
        },
    })
}

// 获得会诊信息
export function getConsultationInfo(consultationId) {
    return Get("/api/video_groupconsultation/groupconsultation_detail/" + consultationId).then(res => {
        let participants = res.data.person.map(item => {
            return {
                userImg: item.DoctorImage,
                userName: item.DoctorName,
                state: item.DoctorState,
            }
        })
        let obj = {
            reason: res.data.GroupConsutation_info.reason,
            startTime: res.data.GroupConsutation_info.startTime,
            endTime: res.data.GroupConsutation_info.endTime,
            type: res.data.GroupConsutation_info.type,
            mystate: res.data.userState,
            applyTime: res.data.GroupConsutation_info.startTime,
            participateType: res.data.GroupConsutation_info.participateType,
            state: res.data.GroupConsutation_info.state,
            person: {
                participants: participants,
                holderInfo: {
                    userImg: res.data.GroupConsutation_info.holderImage,
                    userName: res.data.GroupConsutation_info.holderName,
                },
            },
        }
        return Promise.resolve(obj)
    })
}

// 获得参与会诊信息
export function canyuHuizhenInfo(consultationId) {
    return Get("/api/video_groupconsultation/groupConsultationInfo/" + consultationId).then(res => {
        console.log("2222222222222222", res)
        let obj = {
            huiyiId: "13123",
            huiyiMima: "xxxxxx",
            huiyiSrc: "https://118.31.2.16:7087/?NTc3OTc1NTk1Mjc~#/",
        }
        if (res.data.status == 200) {
            obj.huiyiSrc = res.data.groupConsultationInfo.huiyiSrc || "https://118.31.2.16:7087/?NTc3OTc1NTk1Mjc~#/"
            obj.huiyiMima = res.data.groupConsultationInfo.huiyiMima
            obj.huiyiId = res.data.groupConsultationInfo.huiyiId
        }
        return obj
    })
}

// 接受会诊
export function approveConsultation(consultationId) {
    let obj = {
        "state": "1"
    }
    return Post("/api//video_groupconsultation/agree_consultation/" + consultationId, obj).then(res => {
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
    // return Promise.resolve(true)
}
// 拒绝会诊
export function refuseConsultation(consultationId) {
    let obj = {
        "state": "0"
    }
    return Post("/api//video_groupconsultation/agree_consultation/" + consultationId, obj).then(res => {
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
    // return Promise.resolve(true)
}
// 取消会诊
export function cancelConsultation(consultationId) {
    let obj = {
        "state": "0"
    }
    return Post("/api/video_groupconsultation/confirm_consultation/" + consultationId, obj).then(res => {
        console.log(res);
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}
// 重新发起会诊
export function restartConsultation(consultationId, pid, data) {
    // cancelConsultation(consultationId).then(res => {
    //     if (res) {
    //         return Post("/api/video_groupconsultation/confirm_consultation/" + consultationId, obj).then(res => {
    //             console.log(res);
    //             if (res.data.status == 200) {
    //                 return Promise.resolve(true)
    //             } else {
    //                 return Promise.resolve(false)
    //             }
    //         })
    //     }
    // })
    // console.log(consultationId);
    return Promise.resolve(true)
}



// 确认会诊
export function confirmConsultation(consultationId) {
    let obj = {
        "state": "1"
    }
    return Post("/api/video_groupconsultation/confirm_consultation/" + consultationId, obj).then(res => {
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
    return Promise.resolve(true)
}


// 结束会诊
export function stopVideoConsultation(consultationId, data) {
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

// 获得会诊结论
export function getVideoConsultationConclusion(consultationId) {
    console.log(data)
    data.after = data.after || []
    data.prescription = data.prescription || []
    return Promise.resolve({
        conclusion: "xxxxxxxxxxxxxxxxxx",
        treatOpinion: "xxxxxxxxxxxxxxxxxxxx",
        prescription: []
    })

}
export function postDiscussOpinion(consultationId, content, type) {
    return Post("/api/groupconsultation/consultationopinion/" + consultationId, { content: content, type: type }).then(res => {
        if (res.data && res.data.status != 0) {
            return true
        } else {
            return false
        }
    })
}

// 获得消息记录
export function getVideoConsultationMsgRecord(consultationId) {
    // 获取会诊意见
    return Get("/api/groupconsultation/discussion/" + consultationId).then(res => {
        let temp = res.data.discussion.map(item => {
            return {
                username: item.user.name,
                userimg: item.user.img,
                fromid: item.user.id,
                toid: store.state.user.userInfo.userId,
                message: item.content,
                type: item.type || "text",
                consultationId: "123123",
            }
        })
        return temp
    })
}

// 获取历史会诊列表
export function getHisVideoConsultationList() {
    return Get("/api/video_groupconsultation/historyConsultationList").then(res => {
        if (res.data.historyConsultationList) {
            let temp = res.data.historyConsultationList.map(item => {
                return {
                    API_consulationId: item.API_consulationId,
                    API_pid: item.pid,
                    API_Name: item.API_Name,
                    API_type: item.API_type,
                    API_holder: item.API_holder,
                    API_source: item.API_source || 'jiuzhen',
                    API_state: item.API_state,
                    API_startTime: item.API_startTime,
                    API_endTime: item.API_endTime,
                }
            })
            return temp
        } else {
            return []
        }
    })
}


/**
 * @function:判断时间段能否进行开会
 * timeRange:时间范围 
 *  {
 *      startTime:123123123,
 *      endTime:123123123,
 *  }
 * 
 * return :
 * {
 * res:true||false         
 * }
 */

export function getAvailableTime(timeRange) {
    let obj = {
        startTime: new Date(timeRange.startTime).getTime(),
        endTime: new Date(timeRange.endTime).getTime()
    }
    return Post("/api/video_groupconsultation/timeConfirm", obj).then(res => {
        console.log(res.data.state);
        if (res.data && res.data.state == 1) {

            return true
        } else return false
    })
}