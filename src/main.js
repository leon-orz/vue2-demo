// Vue核心库
import Vue from 'vue'
import * as echarts from 'echarts'

// UI框架
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 工具库
import moment from 'moment'
import VueLs from 'vue-ls'

// 本地模块
import router from '@/router'
import store from '@/store'
import api from '@/api'
import components from '@/components'
import '@/styles/index.less' // 此处的@别名已正确保留
import App from '@/App.vue'

// 插件配置
const setupPlugins = () => {
  Vue.use(ElementUI)
  Vue.use(VueLs, { namespace: 'kaibo_ls_', name: 'ls', storage: 'session' })
  Vue.use(api)
  Vue.use(components)
}

// 全局属性
const setupGlobals = () => {
  Vue.prototype.$moment = moment
  Vue.prototype.$echarts = echarts
  Vue.config.productionTip = process.env.NODE_ENV !== 'production'
}

// 创建应用实例
const createApp = () => {
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app')
}

// 初始化流程
const bootstrap = () => {
  setupPlugins()
  setupGlobals()
  createApp()
  store.dispatch('user/loadUserData')
}

// 启动应用
bootstrap()
