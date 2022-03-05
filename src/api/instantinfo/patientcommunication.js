import { Get, Post, Delete, FileLoad, download, Put } from '../../http/request.js'
import store from '@store/index.js';

//获取聊天信息
export function getMessageRecord(pid, type) {
    Post("/api/chatinfo",
        {
            pid: pid
        }
    ).then(res => {
        let obj = res.data.chat;
        let patientId = "";
        obj.forEach((element, index) => {
            element.messages.forEach(msg => {
                if (msg.fromid != element.id) {
                    msg.self = true
                }
            })
            if (element.user.role == '专家') {
                obj.splice(index, 1)
            } if (element.user.role == '患者') {
                patientId = element.id
            }
        });
        store.commit("patientCommunication/changeCurrentSessionId", patientId);
        if (type == 'suifang') {
            obj = obj.filter(item => {
                return item.user.role == "患者"
            })
        }
        // 剔除了专家用户
        // 区分了收到的还是发送的
        store.commit("patientCommunication/update", obj)
    })
}


//获取会诊聊天信息
export function getConsultationMessageRecord(cid, type) {
     Post("/api/chatinfo/consultation/",
        {
            cid: cid
        }
    ).then(res => {
        console.log(res);
        let obj = res.data.chat;
        let patientId = "";
        obj.forEach((element, index) => {
            element.messages.forEach(msg => {
                if (msg.fromid != element.id) {
                    msg.self = true
                }
            })
            if (element.user.role == '专家') {
                obj.splice(index, 1)
            } if (element.user.role == '患者') {
                patientId = element.id
            }
        });
        store.commit("patientCommunication/changeCurrentSessionId", patientId);
        if (type == 'suifang') {
            obj = obj.filter(item => {
                return item.user.role == "患者"
            })
        }
        // 剔除了专家用户
        // 区分了收到的还是发送的
        store.commit("patientCommunication/update", obj)
    })
}
