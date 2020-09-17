import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 1. 引入基本样式表
import "./common/css/index.scss"

// 2. 引入路由
import router from './router/index'

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
