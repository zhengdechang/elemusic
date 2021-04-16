import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/index.scss'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import '../src/assets/fonts/font.css'
import '../src/assets/fonts/iconfont.css'

//自定义指令
import '../src/assets/js/directive'

//时间格式处理库
import '../src/plugins/moment'



Vue.config.productionTip = false




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
