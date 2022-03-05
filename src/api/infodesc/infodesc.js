import { Get } from '../../http/request.js'


// 获得医生详细信息
export function getUserDetails(id) {
  return Get(`/api/infodesc/user/${id}`).then(res => res.data)
}


