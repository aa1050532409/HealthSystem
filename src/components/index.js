import LocalVideo from './common/LocalVideo.vue'
import DiagResultBox from './common/DiagResultBox.vue'
import PrescriptionEdit from './common/PrescriptionEdit.vue'
import MyInput from './common/MyInput.vue'
import DropSelect from './common/DropSelect.vue'

import SearchTool from './searchTool/searchTool.vue'
import TablePage from './tablePage/TablePage.vue'

import stateImport from './importComponent/stateImport.vue'
import treattextImport from './importComponent/treattextImport.vue'
import diagResultImport from './importComponent/diagResultImport.vue'
import treatPlanImport from './importComponent/treatPlanImport.vue'
import PrescriptionImport from './importComponent/prescriptionImport.vue'
import diagResultAreatypeImport from './importComponent/diagResultAreatypeImport.vue'
import consultationPurposeImport from './importComponent/consultationPurposeImport.vue'
import discusstionOpinionImport from './importComponent/discusstionOpinionImport.vue'
import patientInfo from './patientInfo/patientInfo.vue'

// 这里是重点
export default (Vue) => {
    // 视频本地缓存组件
    Vue.component("LocalVideo", LocalVideo)
    // 处方编辑组件
    Vue.component("PrescriptionEdit", PrescriptionEdit)

    // 诊断区域选择组件
    Vue.component("DiagResultBox", DiagResultBox)

    // 自定义条件查询组件
    Vue.component("SearchTool", SearchTool)

    // 自定义输入组件
    Vue.component("MyInput", MyInput)

    // 自定义下拉组件，选择组件
    Vue.component("DropSelect", DropSelect)

    // 处方编辑组件
    Vue.component("TablePage", TablePage)

    // 导入模块组件
    Vue.component("StateImport", stateImport)
    Vue.component("TreattextImport", treattextImport)
    Vue.component("DiagResultImport", diagResultImport)
    Vue.component("TreatPlanImport", treatPlanImport)
    Vue.component("PrescriptionImport", PrescriptionImport)
    Vue.component("DiagResultAreatypeImport", diagResultAreatypeImport)
    Vue.component("ConsultationPurposeImport", consultationPurposeImport)
    Vue.component("DiscusstionOpinionImport", discusstionOpinionImport)

    // 患者信息组件
    Vue.component("PatientInfo", patientInfo)


}
