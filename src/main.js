import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import axios from "./http/axios.js"
import components from '@components/index.js'
import utils from '@utils/index.js'
import localforage from 'localforage'
import moment from 'moment'
import "./assets/css/common.scss"


import 'default-passive-events'
import './socketio/socketio.js'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/icon/iconfont/iconfont.css'

import "./assets/css/elementUIReset.scss"


if (window.location.hash == "#/login") {
  localStorage.clear()
}
// el-table的默认属性配置，超出一行默认显示...
ElementUI.TableColumn.props.showOverflowTooltip = {
  type: Boolean,
  default: () => {
    return true
  }
}
Vue.prototype.$axios = axios;
Vue.prototype.$localforage = localforage;
Vue.prototype.$timeFormat = moment;
Vue.prototype.$loading = ElementUI.Loading;
Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(components);
Vue.use(utils);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
