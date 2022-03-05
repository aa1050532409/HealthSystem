

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
                    // {
                    //     fromid: "1",
                    //     toid: "101001",
                    //     message: 'http://132.232.18.227:8081/download?url=upload/2f0f54f336734c0708225ed54cae54f9.mp4',
                    //     msgtime: now,
                    //     type: 'video'
                    // },
                ]
            },
            {
                id: "101002",
                user: {
                    name: '101002',
                    img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
                },
                messages: []
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

    },
    actions: {

    }


};