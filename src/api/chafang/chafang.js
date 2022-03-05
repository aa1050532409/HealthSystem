import { Get, Post } from "../../http/request.js";


// 获取今日查房列表
export function getTodayList() {
  return Get("/api/operationmanage/chafangList").then(res => {
    return res.data.chafangList;
  });
}

//获取历史查房列表
export function getHistoryList() {
  return Get("/api/operationmanage/chafangHistoryList").then(res => {
    // console.log(res);
    return res.data.HistoryList;
  });
}

//获取负责患者的医生、护士列表
export function getResponseDocList(pid) {
  return Get("/api/operationmanage/chafangDoctor/" + pid).then(res => {
    return res.data;
  });
}

//提交查房记录
export function commitChafangLog(form, pid) {
  return Post(`/api/operationmanage/chafangRecord/${pid}`, { form }).then(res => {
    if (res.data && res.data.status !== 0) {
      return true
    } else {
      return false
    }
  })

}

//获取患者的查房记录时间
export function getChafangLogs(pid) {
  return Get(`/api/operationmanage/chafangRecordList/${pid}`).then(res => {
    return res.data.chafangRecordListDate;
  });
}

//获取详细查房记录
export function getDetailLog(chafangID) {
  return Get(`/api/operationmanage/chafangOneRecord/${chafangID}`).then(res => {
    return res.data.oneRecord;
  });
}

//护士向医生发起预约
export function toReserve(obj) {
  return Post(`/api/operationmanage/appointment`, { obj }).then(res => {
    console.log(res);
    return res.data;
  });
}
