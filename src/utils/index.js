// 全局工具函数
import { pageSlice } from "./common.js";
let utils = {
    pageSlice
}

export default (Vue) => {
    // 视频本地缓存组件
    Vue.prototype.$utils = utils
}