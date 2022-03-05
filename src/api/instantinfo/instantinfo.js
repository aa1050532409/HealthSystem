import { Get, Post, Delete, FileLoad, download, Put } from '../../http/request.js'
import { Message } from 'element-ui';
import router from '../../router/index.js'
import store from '../../store/index.js';
import socket from '../../socketio/socketio.js  '

//获取聊天记录
export function getMessageRecord() {
    return Post("xxxxxxxxxxxxxxxxxxxx", { UserID1, UserID2 }).then(res => {
        return res
    })
}
//获取聊天列表
export function getMessageRecord() {
    return Post("xxxxxxxxxxxxxxxxxxxx", { UserID1, UserID2 }).then(res => {
        return res
    })
}


//获取聊天列表
export function getConstationMessageRecord() {
    return Post("xxxxxxxxxxxxxxxxxxxx", { UserID1, UserID2 }).then(res => {
        return res
    })
}


