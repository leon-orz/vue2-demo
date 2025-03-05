import Vue from 'vue'
import App from './App.vue'

// 核心配置
Vue.config.productionTip = false

// 路由和状态管理
import router from './router'
import store from './store'

// 第三方库引入
import ElementUI from 'element-ui'
import VueLS from 'vue-ls'
import moment from 'moment'

// UI组件库配置
Vue.use(ElementUI, {
  size: 'normal',
})

// 本地存储插件配置
Vue.use(VueLS, {
  namespace: 'kaibo_ls',
  name: 'ls',
  storage: 'session',
})

// 全局工具方法挂载
Vue.prototype.$moment = moment

// 样式引入
import 'element-ui/lib/theme-chalk/index.css'
import './styles/main.less'

// Vue实例初始化
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
