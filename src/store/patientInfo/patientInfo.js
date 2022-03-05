export default {
    namespaced: true,
    state: {
        currentPid: "",
        currentPatientAccount: "",
        currentPatientName: "",
    },
    getters: {
        currentPid: (state) => {
            return state.currentPid;
        }
    },
    mutations: {
        currentPidChange(state, pid) {
            state.currentPid = pid + ""
        },
        currentPatientAccountChange(state, account) {
            state.currentPatientAccount = account + ""
        },
        currentPatientNameChange(state, name) {
            state.currentPatientName = name + ""
        }
    },
    actions: {

    },
    modules: {}
};