
import store from "../store/index.js"
import router from "../router/index.js"
import { getUserInfo, getPidState } from '@api/common/common.js';

const socketMsgDeal = {
    login: function (data) {
        // 返回状态代为0，说明当前账号被其他用户登录了
        if (data.status == 0) {
            localStorage.removeItem("token");
            localStorage.clear();
            router.push("/login")
            alert("您的账号已在别处登录")
            window.location.reload();
        }
    },
    // 接收到问诊请求，在通知栏中加通知
    seekMedical: function (data) {
        store.commit("msg/addMessage", {
            type: "huanzhe",
            time: new Date().toLocaleTimeString("zh-CN", { hour12: false }), //时间
            msg: `您有新的就诊请求`, //提示类型
            router: "/diagApply"
        });
    },
    apply_outhospital: function (data) {
        store.commit("msg/addMessage", {
            type: "chuyuanApply",
            time: new Date().toLocaleTimeString("zh-CN", { hour12: false }), //时间
            msg: `就诊号${data.pid}发起出院请求`, //提示类型
            router: `/treatment/patientdetails?pid=${data.pid}`
        });
    },
    // 新的住院申请(护士)
    after_treatment_request: function (data) {
        store.commit("msg/addMessage", {
            type: "hospitalApply",
            time: new Date().toLocaleTimeString("zh-CN", { hour12: false }), //时间
            msg: `您有新的住院申请`, //提示类型
            router: store.state.user.userInfo.role == "医生" ? "/treatment/applylist" : "/operationmanage/applylist"
        });
    },
    // 新的住院申请(医生)
    doctor_confirm_tohospital: function (data) {
        store.commit("msg/addMessage", {
            type: "hospitalApply",
            time: new Date().toLocaleTimeString("zh-CN", { hour12: false }), //时间
            msg: `您有新的住院申请`, //提示类型
            router: store.state.user.userInfo.role == "医生" ? "/treatment/applylist" : "/operationmanage/applylist"
        });
    },
    // 新的住院患者(医护)
    confirm_tohospital: function (data) {
        store.commit("msg/addMessage", {
            type: "hospitalPatient",
            time: new Date().toLocaleTimeString("zh-CN", { hour12: false }), //时间
            msg: `您有新的住院患者`, //提示类型
            router: store.state.user.userInfo.role == "医生" ? "/treatment/patientlist" : "/operationmanage/patientlist"
        });
    },
    // 新的下载任务
    seekMedical_file_download: function (data) {
        store.commit("task/addTask", data);
    },
    seekmedicalreply: function (data) {
        // getTodayPatients()
        // store.commit("changeTodayPatient", { pid: data.pid, newState: data.API_state },)
    },
    instantMsg: function (data) {
        if (data !== "对方暂时不在线") {
            Promise.all([getUserInfo(data.fromid), getPidState(data.pid)]).then(res => {
                let roles = store.state.user.roles
                let name = res[0].Name
                let state = res[1]
                let route = "";
                let msg = "";
                switch (state) {
                    case "0":
                        route = `/patientdiag/details?pid=${data.pid}`;
                        break;
                    case "1":
                        route = `/patientdiag/details?pid=${data.pid}`
                        break;
                    case "2":
                        if (roles.indexOf("医生") != -1) {
                            route = `/treatment/applydetails?pid=${data.pid}`
                        } else {
                            route = `/operationmanage/applydetails?pid=${data.pid}`
                        }
                        // route = store.state.user.userInfo.role == "医生" ? `/treatment/applydetails?pid=${data.pid}` : `/operationmanage/applydetails?pid=${data.pid}`
                        break;
                    case "3":
                        if (roles.indexOf("医生") != -1) {
                            route = `/treatment/applydetails?pid=${data.pid}`
                        } else {
                            route = `/operationmanage/applydetails?pid=${data.pid}`
                        }
                        // route = store.state.user.userInfo.role == "医生" ? `/treatment/applydetails?pid=${data.pid}` : `/operationmanage/applydetails?pid=${data.pid}`
                        break;
                    case "4":
                        if (roles.indexOf("医生") != -1) {
                            route = `/treatment/patientdetails?pid=${data.pid}`
                        } else {
                            route = `/operationmanage/patientdetails?pid=${data.pid}`
                        }
                        break;
                    case "5":
                        if (roles.indexOf("护士") != -1) {
                            route == `/followmanage/followdetails?pid=${data.pid}`
                        } else {
                            return
                        }
                        break;
                }
                if (data.consultationType == "普通会诊") {
                    route = `/groupconsultation/consulationdetails?cid=${data.GroupConsultationID}&pid=${data.pid}`
                } else if (data.consultationType == "视频会诊") {
                    route = `/videoconsultation/consulationdetails?pid=${data.pid}&cid=${data.GroupConsultationID}`
                }
                console.log(route);
                msg = `${name}发来新信息`
                store.commit("msg/addMessage", {
                    type: "instant",
                    time: new Date().toLocaleTimeString("zh-CN", { hour12: false }), //时间
                    msg: msg, //提示类型
                    pid: data.pid,
                    router: route
                });

            })
        }

    },
    newGroupConsultation: function (data) {
        // store.commit("msg/addMessage", {
        //     type: "huizhenPatient",
        //     time: new Date().toLocaleTimeString("zh-CN", { hour12: false }), //时间
        //     msg: `您有新的会诊`, //提示类型
        //     router: "/groupconsultation/todayconsultation"
        // });
    },
    schedule_message: function (data) {
        console.log("xxxxxxxxxxx", data)
        store.commit("msg/addMessage", {
            type: "remind",
            time: new Date().toLocaleTimeString("zh-CN", { hour12: false }), //时间
            msg: `日程提醒：${data.content}`, //提示类型
            router: "/personalinfo/mange"
        });
    },
    temp_message: function (data) {
        console.log("离线消息", data)
        data.forEach(item => {
            if (item.request_head !== "login" && socketMsgDeal[item.request_head]) {
                socketMsgDeal[item.request_head](item)
            }
        });
    },

}

export default socketMsgDeal