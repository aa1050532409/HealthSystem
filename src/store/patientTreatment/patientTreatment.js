export default {
    namespaced: true,
    state: {
        currentPid: "",
    },
    getters: {
        currentPid: (state) => {
            return state.currentPid;
        }
    },
    mutations: {
        currentPidChange(state, pid) {
            state.currentPid = pid + ""
        }
    },
    actions: {

    },
    modules: {}
};