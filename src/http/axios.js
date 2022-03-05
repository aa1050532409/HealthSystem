import axios from 'axios'
import { Message, Loading } from 'element-ui';

// let Myloading = null
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.retry = 0;
  config.retryDelay = 5000;
  if (localStorage.getItem('token')) {
    config.headers.Authorization = localStorage.getItem('token');
  }
  // Myloading = Loading.service({
  //   lock: true,
  //   text: 'Loading',
  //   spinner: 'el-icon-loading',
  //   background: 'rgba(0, 0, 0, 0.7)'
  // });
  return config;
}, function (error) {
  // 对请求错误做些什么
  Message.error("网络错误")
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // Myloading.close();
  return response;

}, function (err) {
  //失败重传
  let config = err.config;
  // 检查是否需要重传
  if (!config || !config.retry) return Promise.reject(err);
  // 设置当前重传次数
  config.__retryCount = config.__retryCount || 0;
  console.log(config.__retryCount)
  //检查是否达到最大重传次数
  if (config.__retryCount >= config.retry) {
    //返回错误
    return Promise.reject(err);
  }

  // 重传次数增加
  config.__retryCount += 1;

  // 建立重传定时器
  var backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, config.retryDelay || 1);
  });
  // 返回重传结果
  return backoff.then(function () {
    return axios(config);
  });
});

export default axios