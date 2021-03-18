import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/index.scss'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import '@/assets/js/iconfont.js'
import '@/assets/js/iconfont1.js'
import '@/assets/js/iconfont2.js'
import '@/assets/js/iconfont3.js'

import '../src/assets/fonts/font.css'

import '../src/assets/js/directive'




Vue.config.productionTip = false




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
