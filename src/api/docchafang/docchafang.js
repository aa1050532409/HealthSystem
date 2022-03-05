import { Get, Post } from "../../http/request.js";

//获取预约查房列表
export function getReserveList() {
  return Get("/api/operationmanage/myAppointment").then(res => {
    return res.data.appointmentList;
  });
}