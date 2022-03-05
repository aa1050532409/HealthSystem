import { Get, Post } from '../../http/request.js'
import { Message } from 'element-ui';
/**
 * 获取专家团队列表
 *  @ExpertInfo:[{
 *      ExpertIntroduction
 *      ExpertSpecialty
 *      ExpertID
 *      ExpertImage
 *      ExpertName
 * }]
 * */
export function getExpertGroupsInfo() {
    return Get('/api/hospital_expert/expertlist').then(res => {
        return res.data.ExpertInfo
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


/**
 * 修改专家团队信息
 *  @groupInfo:{
 *      groupName
 *      groupShanchang
 *      groupIntroduction
 *      groupImage
 *      groupTel
 * }
 * */
export function modifyExpertGroupsInfo(expertGroupId, data) {
    let groupInfo = {
        groupName: data.groupName,
        groupShanchang: data.groupShanchang,
        groupIntroduction: data.groupIntroduction,
        groupImage: data.groupImage,
        groupTel: data.groupTel,
    }
    return Post('/api/hospital_expert/updateexpertmanage/' + expertGroupId, groupInfo).then(res => {
        if (res.data && res.data.status == 200) {
            return true
        } else {
            return false
        }
    })
}


/**
 * 删除专家团队信息
 *  @expertGroupId
 * 
 * */
export function delExpertGroupsInfo(expertGroupId) {
    return Get('/api/hospital_expert/deleteexpertmanage/' + expertGroupId).then(res => {
        if (res.data && res.data.status == 200) {
            return true
        } else {
            return false
        }
    })
}



/**
 * 查询专家团队详情
 *  @expertGroupId
 * */
export function getExpertGroupInfo(expertGroupId) {
    return Get('/api/hospital_expert/expertmanage/expertdetails/' + expertGroupId).then(res => {
        if (res.data && res.data.status == 200) {
            let details = {
                expertdetails: res.data.expertdetails,
                TeamDoctor: res.data.TeamDoctor
            }
            return details
        } else {
            return null
        }
    })
}


/**
 * 添加专家或医疗机构管理员
 *  @expertID
 *  @person
 * */
export function addExpertGroupPersonInfo(expertID, person) {
    let newPerson = {
        UserID: person.UserID,
        role: person.role
    }
    return Post('/api/hospital_expert/expertmanage/addexpert/' + expertID, newPerson).then(res => {
        if (res.data && res.data.status == 200) {
            return true
        } else {
            return false
        }
    })
}


/**
 * 删除专家或者机构管理员
 *  @expertID
 *  @person
 * */
export function delExpertGroupPersonInfo(expertID, person) {
    let delPerson = {
        UserID: person.UserID,
        role: person.role
    }
    return Post('/api/hospital_expert/expertmanage/deleteexpert/' + expertID, delPerson).then(res => {
        if (res.data && res.data.status == 200) {
            return true
        } else {
            return false
        }
    })
}