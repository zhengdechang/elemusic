import Vue from 'vue'
import moment from 'moment'

// 设置本地时区
moment.locale('zh-cn')
Vue.prototype.$moment = moment
