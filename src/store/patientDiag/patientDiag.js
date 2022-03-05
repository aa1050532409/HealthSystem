export default {
    namespaced: true,
    state: {
        // todayPatientsList: [],
        currentPid: "",
        zhuanzhenState: "xxxxxxxxxxxxxx"
    },
    getters: {
    },
    mutations: {
        patientDiag_PidChange(state, pid) {
            state.currentPid = pid + ""
        },
        patientDiag_zhuanzhenState(state, zhuanzhenState) {
            state.zhuanzhenState = zhuanzhenState + ""
        }

    },
    actions: {

    },
    modules: {}
};