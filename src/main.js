import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"

import FastClick from 'fastclick'

import toast from 'components/common/toast'
import VueLazyload from "vue-lazyload";

Vue.config.productionTip = false
// 添加事件总线对象
Vue.prototype.$bus = new Vue()

// 安装toast插件
Vue.use(toast)

// 解决移动端300ms延迟
FastClick.attach(document.body)

const loadImage = require('assets/img/common/placeholder.png')
const errorImage = require('assets/img/common/placeholder.png')

// 使用懒加载的插件
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: loadImage,
  error: errorImage,
  attempt: 1
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
