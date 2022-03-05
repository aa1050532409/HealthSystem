import axios from './axios.js'

//增：Post  删：Delet   改：Put   查：Get
export function Get(url, data = {}, params = {}) {
  return axios({
    url: url,
    data: data,
    params: params,
    method: 'get'
  })
}


export function Post(url, data = {}) {
  return axios({
    url: url,
    data: data,
    method: 'post'
  })
}

export function Put(url, data = {}) {
  return axios({
    url: url,
    data: data,
    method: 'put'
  })
}

export function Delete(url, data = {}) {
  return axios({
    url: url,
    data: data,
    method: 'delete'
  })
}

export function FileLoad(data) {
  return axios({
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: "/api/upload",
    data: data,
    method: 'post'
  })
}

export function download(url, data) {
  return axios({
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: url,
    data: data,
    method: 'get'
  })
}


export function blobDownload(url) {
  return axios({
    url: url,
    method: 'get',
    responseType: 'blob'
  })
}
