import { getIdRoles } from '@api/common/common.js';
import { Get, Post, Delete, FileLoad, download, Put } from '../../http/request.js'
import { Message, Loading } from 'element-ui';
import router from '../../router/index.js'
import store from '../../store/index.js';
import socket from '../../socketio/socketio.js'
//登录
export function login(data) {
    let loading = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    Post('/api/login', data).then(res => {
        if ((res.data.status == 200)) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("UserID", data.UserID);
            localStorage.setItem("function", JSON.stringify(res.data.function));
            localStorage.setItem("name", JSON.stringify(res.data.name));
            store.commit('userInfo', [data.UserID, res.data.name, res.data.role, res.data.function, res.data.portrait])
            getIdRoles(data.UserID).then(res => {
                store.commit("userRoles", res)
                socket.emit("login", data.UserID)
                loading.close()
                router.push('/recommend')
            })
        } else {
            loading.close()
            Message({
                showClose: true,
                message: '用户名或密码错误！',
                type: 'error'
            });
        }

    })
}

//注册
export function register(data) {
    let person = {
        UserID: data.UserID,
        Name: data.Name,
        LoginPassword: data.LoginPassword,
        Research: data.Research
    }
    return Post('/api/hospital_expert/register', person).then(res => {
        if (res.data && res.data.status == 200) {
            return true
        } else {
            return false
        }
    })
}

//获取个人信息
export function getBasicInfo() {
    return Get('/api/personalInfo').then(res => {
        store.commit('basicInfo', [res.data.Info.basicInfo, res.data.Info.exp])
        let obj = store.getters.basicInfo
        obj.isPublic = res.data.isPublic
        return obj
    })
}

//修改个人信息
export function changeBasicInfo(data) {
    return Put('/api/personalInfo', { Info: data, isPublic: data.isPublic }).then(res => {
        console.log(res)
        if (res.status == 200) {
            if (res.data.status == 200) {
                store.commit('basicInfo', [data.basicInfo, data.exp])
                Message({
                    message: "个人信息修改成功",
                    type: "success"
                });
            } else {
                Message.error("信息修改失败");
            }
        } else {
            Message.error("信息修改失败");
        }
    })
        .catch(() => {
            Message.error("网络中断");
        })
}

//获取绑定的账号信息
export function getAccountInfo(flash) {
    let obj = {
        defaultType: "",
        bankAccount: {
            bank: "",
            account: "",
            name: ""
        },
        alipay: {
            account: "",
            name: ""
        },
        wechat: {
            account: "",
            name: ""
        }
    }
    if (store.getters.financeAccount.flag && !flash) {
        return new Promise(resolve => {
            resolve(store.getters.financeAccount)
        })
    } else {
        return Get('/api/personalinfo/account').then(res => {
            console.log(res)
            if (res.status == 200) {
                if (res.data.status == 200) {
                    if (res.data.formdata.bankAccount) obj.bankAccount = res.data.formdata.bankAccount
                    if (res.data.formdata.wechat) obj.wechat = res.data.formdata.wechat
                    if (res.data.formdata.alipay) obj.alipay = res.data.formdata.alipay
                    obj.defaultType = res.data.defaulttype
                    store.commit('financeAccount', obj)
                    return obj
                } else {
                    return obj
                }
            } else {
                return res
            }
        });
    }

}

//绑定新账号
export function addAccountInfo(data) {
    console.log(data)
    let url = "/api/personalinfo/account/" + data.type;
    let obj = {}
    switch (data.type) {
        case "bankaccount":
            obj = { bankAccount: data }
            break;
        case "alipay":
            obj = { alipay: data }
            break;
        case "wechat":
            obj = { wechat: data }
            break;
    }
    console.log(obj)
    return Post(url, obj).then(res => {
        console.log(res)
        if (res.status == 200) {
            if (res.data.status == 200 && res.data.msg == "ok") {
                Message.success("绑定成功！")
                return true
            } else {
                Message.error(res.data.msg)
                return false
            }
        } else {
            Message.error("绑定失败！")
            return false
        }
    }).catch(() => {
        Message.error("绑定失败！")
        return false
    });
}

//修改绑定账号
export function modifyAccountInfo(data) {
    let url = "/api/personalinfo/account/" + data.type;
    return Put(url, data).then(res => {
        if (res.status == 200) {
            if (res.data.status == 200) {
                Message.success("修改成功！")
                return true
            } else {
                Message.error(res.data.msg)
                return false
            }
        } else {
            Message.error("修改失败！")
            return false
        }
    }).catch(() => {
        Message.error("修改失败！")
        return false
    });
}

//获取财务信息
export function getFinanceInfo(data) {
    return Get('/api/personalinfo/finance').then(res => {
        if (res.status == 200) {
            if (res.data.status == 200) {
                res.data.financInfo.forEach(element => {
                    let arr = element.date.split('');
                    arr.splice(4, 0, '-');
                    element.date = arr.join('')
                });
                return res.data.financInfo
            } else {
                Message.success(res.data.msg)
                return [];
            }
        } else {
            Message.error("网络错误！")
        }
        console.log(res)
    });
}
//获取财务月详情信息
export function getMonthDetails(data) {
    let date = data.date.replace('-', '')
    return Post('/api/personalinfo/finance', { date: date }).then(res => {
        if (res.status == 200) {
            if (res.data.status == 200) {
                return res.data.financInfo
            } else {
                Message.success(res.data.msg)
                return [];
            }
        } else {
            Message.error("网络错误！")
            return [];
        }
    });
}

//修改密码
export function modifyPassword(data) {
    // console.log(data)
    return Put('/api/personalinfo/password', data).then(res => {
        if (res.status == 200) {
            if (res.data.status == 200) {
                Message.success(res.data.msg)
            } else {
                Message.error(res.data.msg)
            }
        } else {
            Message.error("修改失败！")
        }
    }).catch(err => {
        Message.error("网络错误！")
    });
}


// 日程管理
// 获取所有接诊日程安排
export function getMyplan() {
    return Get('/api/personalinfo/getDiagTime').then(res => {
        if (res.data.status == 200) {
            return res.data.diagPlan
        } else {
            Message.error("获取时间失败")
            return {
                one: [],
                two: [],
                three: [],
                four: [],
                five: [],
                six: [],
                seven: []
            }
        }
    });
}

// 获取所有日程安排
export function getMyShipinplan() {
    return Get('/api/personalinfo/getVideoDiagTime').then(res => {
        if (res.data.status == 200) {
            return res.data.shipingHuizhenPlan
        } else {
            Message.error("获取时间失败")
            return {
                one: [],
                two: [],
                three: [],
                four: [],
                five: [],
                six: [],
                seven: []
            }
        }
    });
}

// 获取所有日程安排
export function getMyMonthinplan(month) {
    return Post('/api/personalinfo/getTime', {
        Time: month
    }).then(res => {
        if (res.data.status == 200) {
            return res.data.tasks
        } else {
            Message.error("获取时间失败")
            return []
        }
    });
}



// 修改就诊日程安排
export function modifyDiagplan(data) {
    return Post('/api/personalinfo/addDiagTime', data).then(res => {
        if (res.data.status == 200) {
            return true
        } else {
            return false
        }
    });
}


// 修改就诊日程安排
export function modifyShipinplan(data) {
    return Post('/api/personalinfo/addVideoDiagTime', data).then(res => {
        if (res.data.status == 200) {
            return true
        } else {
            return false
        }
    });
}

// 修改就诊日程安排
export function addNewTimeTask(data) {
    return Post('/api/personalinfo/addTime', data).then(res => {
        if (res.data.status == 200) {
            return true
        } else {
            return false
        }
    });
}



// 删除就诊日程安排
export function deleteTask(data) {
    let obj = {
        TimePlanID: data //获取日程的时候带给你
    }
    return Post('/api/personalinfo/deleteTime', obj).then(res => {
        if (res.data.status == 200) {
            return true
        } else {
            return false
        }
    });
}


// 修改日程安排
export function modifyTask(data) {
    let obj = {
        TimePlanID: data.id, //获取日程的时候带给你
        content: data.content,
        startTime: data.startTime,
        endTime: data.endTime

    }
    return Post('/api/personalinfo/updateTime', obj).then(res => {
        if (res.data.status == 200) {
            return true
        } else {
            return false
        }
    });
}



// 更新挂号上限
export function modifyDiagNum(num) {
    let obj = {
        "limitNumber": parseInt(num),
    }
    return Post('/api/patientdiag/guahaonumber', obj).then(res => {
        if (res.data.status == 200) {
            return true
        } else {
            return false
        }
    });
}

// 获取挂号上限
export function getDiagNum() {
    return Get('/api/personalinfo/maxNumber').then(res => {
        if (res.data.status == 200) {
            return res.data.maxNumber
        } else {
            return 0
        }
    });
}