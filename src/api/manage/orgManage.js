import { Get, Post } from '../../http/request.js'
import { Message } from 'element-ui';

/**
 * 获取医疗机构列表
 *  @HospitalOrgInfo:[{
 *      Address
 *      HospitalID
 *      HospitalType
 *      HospitalLeve
 *      HospitalIntroduction
 *      HospitalName
 *      Image
 * }]
 * */
export function getOrgsInfo() {
    return Get('/api/hospital_expert/orglist').then(res => {
        if (res.data && res.data.status == 200) {
            return res.data.HospitalOrgInfo
        } else {
            Message.error("网络错误，稍后再试")
            return []
        }
    })
}

/**
 * 新建医疗机构
 *  @orgInfo:{
 *      HospitalName
 *      HospitalLeve
 *      HospitalType
 *      HospitalIntroduction
 *      Address
 *      Image
 * }
 * */
export function addOrgsInfo(data) {
    let orgInfo = {
        HospitalName: data.HospitalName,
        HospitalLeve: data.HospitalLeve,
        HospitalType: data.HospitalType,
        HospitalIntroduction: data.HospitalIntroduction,
        Address: data.Address,
        Image: data.Image
    }
    return Post('/api/hospital_expert/addorgmanage', orgInfo).then(res => {
        if (res.data && res.data.status == 200) {
            return true
        } else {
            return false
        }
    })
}

/**
 * 修改医疗机构信息
 *  @orgInfo:{
 *      HospitalName
 *      HospitalLeve
 *      HospitalType
 *      HospitalIntroduction
 *      Address
 *      Image
 * }
 * */
export function modifyOrgsInfo(orgId, data) {
    let orgInfo = {
        HospitalName: data.name,
        HospitalLeve: data.level,
        HospitalType: data.type,
        HospitalIntroduction: data.introduction,
        Address: data.address,
        Tel: data.tel,
        Image: data.Image
    }
    return Post('/api/hospital_expert/updateorgmanage/' + orgId, orgInfo).then(res => {
        if (res.data && res.data.status == 200) {
            return true
        } else {
            return false
        }
    })
}

/**
 * 删除一个医疗机构
 *  @orgId
 * */
export function delOrgsInfo(orgId) {
    return Get('/api/hospital_expert/deleteorgmanage/' + orgId).then(res => {
        if (res.data && res.data.status == 200) {
            return true
        } else {
            return false
        }
    })
}

/**
 * 查询医疗机构详情
 *  @orgId
 * */
export function getOrgsDetails(orgId) {
    return Get('/api/hospital_expert/orgdetails/' + orgId).then(res => {
        if (res.data && res.data.status == 200) {
            return {
                details: res.data.HospitalOrgDetails[0],
                doctors: res.data.HospitalDoctor.Doctor,
                nurses: res.data.HospitalDoctor.Nurse,
            }
        } else {
            return null
        }
    })
}


/**
 * 医疗机构添加医生或护士
 *  @person:{
 *      UserID
 *      role
 * }
*  @orgId
 * */
export function addPerson(orgId, person) {
    let newPerson = {
        UserID: person.UserID,
        role: person.role
    }
    return Post('/api/hospital_expert/orgdetails/adduser/' + orgId, newPerson).then(res => {
        if (res.data && res.data.status == 200) {
            return true
        } else {
            return false
        }
    })
}

export function setManager(orgId, person) {
    let newPerson = {
        UserID: person.UserID,
    }
    console.log(person);
    return Post('/api/hospital_expert/updateorgmanager/' + orgId, newPerson).then(res => {
        if (res.data && res.data.status == 200) {
            return true
        } else {
            return false
        }
    })
}

/**
 * 删除医疗机构的医生和护士
 *  @person:{
 *      UserID
 * }
*  @orgId
 * */
export function delPerson(orgId, person) {
    console.log("xxcva")
    let newPerson = {
        role: person.role,
        UserID: person.UserID,
    }
    return Post('/api/hospital_expert/orgdetails/deleteuser/' + orgId, newPerson).then(res => {
        if (res.data && res.data.status == 200) {
            return true
        } else {
            return false
        }
    })
}


/**
 * 新建医疗机构
 *  @groupInfo:{
 *      groupName
 *      groupShanchang
 *      groupIntroduction
 *      groupImage
 *      groupTel
 * }
 * */
export function addExpertGroupsInfo(data) {
    let groupInfo = {
        groupName: data.groupName,
        groupShanchang: data.groupShanchang,
        groupIntroduction: data.groupIntroduction,
        groupImage: data.groupImage,
        groupTel: data.groupTel,
    }
    return Post('/api/hospital_expert/expertmanage', groupInfo).then(res => {
        if (res.data && res.data.status == 200) {
            return true
        } else {
            return false
        }
    })
}





