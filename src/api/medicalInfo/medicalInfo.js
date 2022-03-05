import { Get, Post, Delete, FileLoad, download, Put } from '../../http/request.js'
import { Message } from 'element-ui';
import router from '../../router/index.js'
import store from '../../store/index.js';

//获取机构列表信息
export function getOrgInfo() {
    return Get('/api/medicalinfo/organization').then(res => {
        let arr = res.data.HospitalOrgInfo.map(item => {
            return {
                name: item.HospitalName,
                orgId: item.HospitalID,
                class: item.HospitalLeve,
                address: item.Address,
                introduction: item.HospitalIntroduction,
                pic: item.Image
            }
        })
        return arr
    })

}
//获取机构详情
export function getOrgDetail(orgId) {
    return Get('/api/organizationmanage/orgdetails/' + orgId).then(res => {
        // return res.data.data.orgInfo
    }).catch(() => {
        Message.error("网络错误！")
    })

}
//获取医生详情
export function getDoctorDetail(docId) {
    return Get('/api/medicalinfo/docdetail', docId).then(res => {
        return res.data.data.docDetail
    }).catch(() => {
        Message.error("网络错误！")
    })

}
//获取护士详情
export function getNurseDetail(nurId) {
    Get('/api/medicalinfo/docdetail', nurId).then(res => {
        return res.data.data.docDetail
    }).catch(() => {
        Message.error("网络错误！")
    })

}
//获取专家团队列表
export function getExpertGroupInfo() {
    if (store.state.medicalInfo.expertGroup == false) {
        return Get('/api/medicalinfo/expertgroup').then(res => {
            store.commit('expertGroupList', res.data.data.listInfo)
            return res.data.data.listInfo
        })
    } else {
        return new Promise(resolve => {
            let obj = store.state.medicalInfo.expertGroup
            resolve(obj)
        })
    }
}
//获取专家团队详情
export function getExpertGroupDetail(experGroupId) {
    return Get('/api/medicalinfo/expertgroupdetail', experGroupId).then(res => {
        return res.data.data.expertGroupInfo
    }).catch(() => {
        Message.error("网络错误！")
    })

}
// 获取专家详情
export function getExpertDetail(experId) {
    Get('/api/medicalinfo/expertdetail', experId).then(res => {
        return res.data.data.expertGroupDetail
    }).catch(() => {
        Message.error("网络错误！")
    })

}

//获取所有描述语句
export function getDescription() {
    return Promise.all([Get("/api/patientdiag/treatmentoptions"), Get("/api/patientdiag/resultoptions")]).then(res => {
        let result = []
        // result = res[0].data.stateOptions.map(item => {
        //     return {
        //         content: item.value,
        //         type: "症状用语"
        //     }
        // })
        result = result.concat(res[0].data.treatmentOptions.map(item => {
            return {
                content: item.value,
                type: "治疗用语"
            }
        }))
        result = result.concat(res[1].data.resultoptions1.map(item => {
            return {
                content: item.value,
                type: "诊断用语"
            }
        }))

        return result
    })
}

//添加描述语句
export function addDescription(data) {
    let obj = {
        content: data.content,
        type: data.type
    }
    return Post("/api/medicalinfo_manage/addDescription", obj).then(res => {
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}

//删除描述语句
export function delDescription(data) {
    let obj = {
        content: data.content,
        type: data.type
    }
    return Post("/api/medicalinfo_manage/deleteDescription", obj).then(res => {
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}


//获取药品信息
export function getDrugsInfo(data) {
    // return Promise.resolve({
    //     durgsInfo: [
    //         {
    //             id: "xxxxxxx",
    //             img: "http://m.360buyimg.com/pop/jfs/t23233/286/1763319067/86282/44e85bf7/5b696163N15369a1c.png",
    //             name: "阿莫西林胶囊",
    //             classfication: "医疗药品",
    //             type: "盒状",
    //             specification: "0.1g",
    //             manufacturer: "哈药六厂",
    //             approvalNumber: "批准文号",
    //             standardCode: "标准码",
    //             use: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    //             introduction: "你哈加但事发时法你哈加但事发时法你哈加但事发时法你哈加但事发时法你哈加但事发时法你哈加但事发时法",
    //         }
    //     ],
    //     totalNumber: 999
    // })
    return Post("/api/medicalinfo_manage/getDrug", {
        name: data.name || "", //名称
        classfication: data.classfication || "",
        approvalNumber: data.approvalNumber || "",
        standardCode: data.standardCode || "",
        page: data.page || 1, //第几页
    }).then(res => {
        let arr = res.data.durgsInfo.map(item => {
            return {
                img: item.img || "",
                name: item.name || "",
                classfication: item.classfication || "医疗药品",
                type: item.type || "",
                specification: item.specification || "",
                manufacturer: item.manufacturer || "",
                approvalNumber: item.approvalNumber || "",
                standardCode: item.standardCode || "",
                use: item.drugUse || "",
                introduction: item.introduction || "",
                drugsID: item.drugsID || "",
            }
        })
        let obj = {
            durgsInfo: arr,
            totalNumber: res.data.totalNumber
        }
        return obj
    })
}

//删除信息
export function delDrug(item) {
    let obj = {
        drugsID: item.drugsID
    }
    return Post("/api/medicalinfo_manage/deleteDrug", obj).then(res => {
        console.log(res);
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}

//添加药品信息
export function addDrug(data) {
    let newDrug = {
        img: data.img || "",
        name: data.name || "",
        classfication: data.classfication || "",
        type: data.type || "",
        specification: data.specification || "",
        manufacturer: data.manufacturer || "",
        approvalNumber: data.approvalNumber || "",
        standardCode: data.standardCode || "",
        drugUse: data.use || "",
        introduction: data.introduction || "",
    }
    return Post("/api/medicalinfo_manage/addDrug", newDrug).then(res => {
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}


// 添加症状描述信息
export function addStateDescription(data) {
    let newState = {
        content: data.content || "",
        voice: "",
        liyu: data.liyu || [],
        img: data.img || "",
    }
    return Post("/api/medicalinfo_manage/addSymptom", newState).then(res => {
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}

// 修改症状描述信息
export function modifyStateDescription(data) {
    let state = {
        id: data.id,
        newState: {
            content: data.content,
            voice: data.voice,
            liyu: data.liyu,
            img: data.img
        }
    }

    return Post("/api/medicalinfo_manage/updateSymptom", state).then(res => {
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}

// 获取症状描述信息
export function getStateDescription() {
    /* 
    liyu:[
        {
        label:"成都话",
        value:"瓜娃子",
        voice:"xxxxxxx"
        }
    ]
    */
    return Get("/api/medicalinfo_manage/getSymptom").then(res => {
        // console.log(res);
        // return []
        if (res.data.status == 200) {
            return res.data.stateDescription
        } else {
            return []
        }
    })
}


// 删除症状描述信息
export function deleteStateDescription(id) {
    let obj = {
        id: id
    }
    return Post("/api/medicalinfo_manage/deleteSymptom", obj).then(res => {
        if (res.data.status == 200) {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    })
}