import { Get, Post, Delete, FileLoad, download, Put } from '../../http/request.js'
import { Message } from 'element-ui';
import router from '../../router/index.js'
import store from '../../store/index.js';
//获取机构列表信息
export function getOrgInfo() {
    if (store.state.orgManage == false) {
        return Get('/api/organizationmanage').then(res => {
            store.commit('orgManage', res.data.HospitalOrgInfo)
            return res.data.HospitalOrgInfo
        })

    } else {
        return new Promise(resolve => {
            let obj = store.state.orgManage
            resolve(obj)
        })
    }
}
//添加机构
export function addOrgInfo(data) {
    let obj = {
        HospitalName: data.HospitalName,
        HospitalLeve: data.HospitalLeve,
        HospitalType: data.HospitalType,
        HospitalIntroduction: data.HospitalIntroduction || "无",
        ContactPhone: data.ContactPhone,
        Address: data.Address,
        Image: data.Image
    }
    return Post('/api/organizationmanage/orgmanage', obj).then(res => {
        console.log(res);
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}
// 获得机构详细信息
export function getOrgDetails(HospitalID) {
    return Get('/api/organizationmanage/orgdetails/' + HospitalID).then(res => {
        let obj = {};
        obj.HospitalOrgDetails = res.data.HospitalOrgDetails[0]
        obj.Doctor = res.data.HospitalDoctor.Doctor || []
        obj.Nurse = res.data.HospitalDoctor.Nurse || []
        obj.HospitalIntroduction = obj.HospitalOrgDetails.HospitalIntroduction
        return obj
    })
}
//修改机构基本信息
export function modifyBadicInfo(HospitalID, data) {
    Put('/api/organizationmanage/orgdetails/' + HospitalID, data).then(res => {
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
    data.DepartmentIName = "脑科"
    return Post("/api/organizationmanage/orgdetails/" + HospitalID, data).then(res => {
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
    return Delete("/api/organizationmanage/orgdetails/" + HospitalID, { UserID: UserID }).then(res => {
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
    Put("/api/organizationmanage/userinfomodify", obj).then(res => {
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

