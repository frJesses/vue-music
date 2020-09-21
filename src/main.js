import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 1. 引入基本样式表
import "./common/css/index.scss"

// 2. 引入路由
import router from './router/index'

// 3. 引入vue-lazyload
import VueLazyload from "vue-lazyload";

// 4. 引入vuex
import store from 'store/index.js'

Vue.use(VueLazyload, {
  loading: require('common/image/default.png'),
  error: require('common/image/default.png')
})



new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
