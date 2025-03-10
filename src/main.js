// 核心依赖与第三方库
import Vue from 'vue'

// UI框架与工具库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import VueLs from 'vue-ls'

// 应用模块
import router from './router'
import store from './store'
import api from './api/index'
import '@/styles/index.less'
import App from './App.vue'

// 插件配置
const configurePlugins = () => {
  // UI组件库
  Vue.use(ElementUI)

  // 本地存储管理
  Vue.use(VueLs, {
    namespace: 'kaibo_ls_',
    name: 'ls',
    storage: 'session',
  })

  // API实例
  Vue.use(api)
}

// 全局配置
const setGlobalConfig = () => {
  Vue.prototype.$moment = moment
  Vue.config.productionTip = process.env.NODE_ENV !== 'production'
}

// 初始化应用
const initVueApp = () => {
  new Vue({
    router,
    store,
    render: (h) => h(App),
    el: '#app',
  })
}

// 启动流程
configurePlugins()
setGlobalConfig()
initVueApp()
store.dispatch('user/loadUserData')
