

const now = new Date();
export default {
    namespaced: true,
    state: {
        sessions: [
            {
                id: "101001",
                user: {
                    name: '示例介绍',
                    img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
                },
                messages: [
                    {
                        fromid: "1",
                        toid: "101001",
                        message: 'http://132.232.18.227:8081/download?url=upload/2f0f54f336734c0708225ed54cae54f9.mp4',
                        msgtime: now,
                        type: 'video'
                    },
                ]
            },
            {
                id: "101002",
                user: {
                    name: '101002',
                    img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
                },
                messages: [
                    {
                        fromid: "101002",
                        toid: "101001",
                        message: '上面代码的第一个例子之所以得到true，是因为false对应的包装对象实例是一个对象，进行逻辑运算时，被自动转化成布尔值true（因为所有对象对应的布尔值都是true）。而实例的valueOf方法，则返回实例对应的原始值，本例为false。',
                        msgtime: now,
                        type: 'text'
                    }, {
                        fromid: "101002",
                        toid: "101001",
                        message: '上面代码的第一个例子之所以得到true，是因为false对应的包装对象实例是一个对象，进行逻辑运算时，被自动转化成布尔值true（因为所有对象对应的布尔值都是true）。而实例的valueOf方法，则返回实例对应的原始值，本例为false。',
                        msgtime: now,
                        type: 'text',
                        self: true
                    },
                ]
            },
            {
                id: "103001",
                user: {
                    name: '103001',
                    img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
                },
                messages: [
                    {
                        fromid: "101002",
                        toid: "101001",
                        message: '上面代码的第一个例子之所以得到true，是因为false对应的包装对象实例是一个对象，进行逻辑运算时，被自动转化成布尔值true（因为所有对象对应的布尔值都是true）。而实例的valueOf方法，则返回实例对应的原始值，本例为false。',
                        msgtime: now,
                        type: 'text'
                    }, {
                        fromid: "101002",
                        toid: "101001",
                        message: '上面代码的第一个例子之所以得到true，是因为false对应的包装对象实例是一个对象，进行逻辑运算时，被自动转化成布尔值true（因为所有对象对应的布尔值都是true）。而实例的valueOf方法，则返回实例对应的原始值，本例为false。',
                        msgtime: now,
                        type: 'text',
                        self: true
                    },
                ]
            },
        ],
        currentSessionId: '101001',
        filterKey: ''
    },
    getters: {

    },
    mutations: {
        changeCurrentSessionId(state, id) {
            state.currentSessionId = id;
        },
        addMessage(state, msg) {
            state.sessions.forEach(item => {
                if (item.id == state.currentSessionId) {
                    item.messages.push({
                        fromid: msg.fromid,
                        toid: msg.toid,
                        message: msg.message,
                        msgtime: msg.msgtime,
                        type: msg.type,
                        self: true,
                    })
                }
            });
        },
        receiveMessage(state, msg) {
            state.sessions.forEach(item => {
                //第一次收到消息的情况没做，因为当前只存在专家向患者发起消息
                if (item.id == msg.fromid) {
                    item.messages.push({
                        fromid: msg.fromid,
                        toid: msg.toid,
                        message: msg.message,
                        msgtime: msg.msgtime,
                        type: msg.type
                    })
                }
            });
        },
        addPerson(state, person) {
            state.sessions.unshift({
                id: person.id,
                user: {
                    name: person.name,
                    img: person.img
                },
                messages: []
            })
            state.currentSessionId = person.id
        },
        update(state, data) {
            state.sessions = data
        }

    },
    actions: {

    }


};