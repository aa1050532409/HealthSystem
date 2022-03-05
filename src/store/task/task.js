export default {
    namespaced: true,
    state: {
        taskList: [],
        taskFlag: false,
    },
    getters: {
    },
    mutations: {
        addTask(state, targetUrl) {
            state.taskList.push(targetUrl)
        },
        popTask(state, targetUrl) {
            state.taskList.pop(targetUrl)
        },
        flagChange(state) {
            state.taskFlag = !state.taskFlag
        },
        startLoading(state) {
            state.taskFlag = true
        },
        endLoading(state) {
            state.taskFlag = true
        },
        updataTaskList(state, arr) {
            state.taskList = arr;
            state.taskFlag = false
        }
    },
    actions: {
    },
    modules: {}
};