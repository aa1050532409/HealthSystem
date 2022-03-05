export default {
    namespaced: true,
    state: {
        currentPid: "",
        consultationId: "",
        consultationState: "待患者确认",//"进行中" "待总结"
        consultationSource: "",//"进行中" "待总结"
        isHolder: "",//"进行中" "待总结"
        endTime: "",
        startTime: ""
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
        endTimeChange(state, endTime) {
            state.endTime = endTime
        },
        startTimeChange(state, startTime) {
            state.startTime = startTime
        },
        currentConsultationIdChange(state, consultationId) {
            state.consultationId = consultationId + ""
        },
        currentConsultationStateChange(state, consultationState) {
            state.consultationState = consultationState + ""
        },
        currentConsultationSourceChange(state, consultationSource) {
            state.consultationSource = consultationSource + ""
        },
        currentConsultationIsholderChange(state, isHolder) {
            state.isHolder = isHolder == '主持人' ? true : false
        }
    },
    actions: {

    },
    modules: {}
};