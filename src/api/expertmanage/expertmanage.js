import { Get, Post, Delete, FileLoad, download, Put } from '../../http/request.js'
import { Message } from 'element-ui';
import router from '../../router/index.js'
import store from '../../store/index.js';
//获取专家团队列表信息
export function getExpertGroupInfo() {
    if (store.state.expertManage == false) {
        return Get('/api/expertmanage/expert').then(res => {
            store.commit('expertManage', res.data.ExpertInfo)
            return res.data.ExpertInfo
        })
    } else {
        return new Promise(resolve => {
            let obj = store.state.expertManage
            resolve(obj)
        })
    }
}


//添加专家团队机构
export function addExpertInfo(data) {
    console.log(data)
    return Post('/api/expertmanage/expert').then(res => {
        console.log(res)
        return res
    })
}
// 获得专家团队详细信息
export function getExpertDetails(ExpertID) {
    console.log(ExpertID)
    return Get('/api/expertmanage/expertdetails/' + ExpertID).then(res => {
        let obj = {};
        console.log("res")
        obj.TeamDoctor = res.data.TeamDoctor;
        obj.expertdetails = res.data.expertdetails[0];
        return obj
    })
}
//修改专家团队基本信息
export function modifyBadicInfo(ExpertID, data) {
    Put('/api/expertmanage/expertdetails/' + ExpertID, data).then(res => {
        if (res.status == 200) {
            if (res.data.status == 200) {
                Message.success("修改成功")
            } else {
                Message.error("修改成功")
            }
        } else {
            Message.error("修改成功")
        }
    })
}
// 添加成员
export function addMember(HospitalID, data) {
    return Post("/api/expertmanage/expertdetails/member/" + HospitalID, data).then(res => {
        console.log(res)
        if (res.status == 200) {
            if (res.data.status == 200) {
                Message.success("添加成功")
                return true
            } else {
                Message.error(res.data.msg)
                return false
            }
        } else {
            Message.error("添加失败")
            return false;
        }
    }).catch(() => {
        Message.error("添加失败")
    })
}

// 删除成员
export function delMember(HospitalID, UserID) {
    return Delete("/api/expertmanage/expertdetails/member/" + UserID, { UserID, UserID }).then(res => {
        console.log(res)
        if (res.status == 200) {
            if (res.data.status == 200) {
                Message.success("删除成功")
                return true
            } else {
                Message.error(res.data.msg)
                return false
            }
        } else {
            Message.error("删除失败")
            return false;
        }
    }).catch(() => {
        Message.error("删除失败")
    })

}

// 修改成员密码
export function modifyMember(data) {
    let obj = {}
    obj.UserID = data.UserID
    obj.Password = data.Password
    console.log(obj)
    Put("/api/expertmanage/userinfomodify", obj).then(res => {
        console.log(res)
        if (res.status == 200) {
            if (res.data.status == 200) {
                Message.success("修改成功")
            } else {
                Message.error(res.data.msg)
            }
        } else {
            Message.error("修改失败")
        }
    }).catch(() => {
        Message.error("修改失败")
    })
}



export function addGroupInfo(data) {
    let obj = {
        Image: data.Image,
        groupName: data.groupName,
        groupTel: data.groupTel,
        groupShanchang: data.groupShanchang,
        groupIntroduction: data.groupIntroduction || "无",
    }
    // return Promise.resolve(true)
    return Post('/api/expertmanage/expert', obj).then(res => {
        console.log(res);
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}