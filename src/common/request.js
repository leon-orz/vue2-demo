import axios from 'axios'
import ElementUI from 'element-ui'
import { startLoading, closeLoading } from './loading-mask'

/**
 * 创建axios实例
 * @property {number} timeout - 请求超时时间(毫秒)，默认10秒
 */
const instance = axios.create({
  timeout: 10000,
})

// 请求拦截器
instance.interceptors.request.use(config => {
  /** 是否显示加载动画 */
  if (config.showLoading) {
    startLoading()
  }

  /** 是否需要携带token */
  if (config.withToken) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})
// 响应拦截器
instance.interceptors.response.use(
  response => {
    closeLoading()
    return response.data
  },
  error => {
    closeLoading()

    if (error.response) {
      // 业务错误：服务器响应异常（4xx/5xx状态码）
      ElementUI.Message.error(error.response.data.message || '请求处理失败')
    } else if (error.request) {
      // 网络错误：请求已发出但无响应
      ElementUI.Message.error('网络连接异常，请检查网络后重试')
    } else {
      // 其他错误：请求配置错误或异常
      ElementUI.Message.error('请求配置错误：' + error.message)
    }

    return Promise.reject(error)
  },
)

// 封装axios请求函数
/**
 * 封装axios请求函数
 * @param {Object} config - 请求配置
 * @param {boolean} [config.withToken=true] - 是否自动携带token
 * @param {boolean} [config.showLoading=false] - 是否显示全局加载动画
 * @param {number} [config.timeout] - 单独设置本次请求超时时间
 */
const request = config => {
  const defaultConfig = {
    withToken: true,
    showLoading: false,
  }
  return instance({
    ...defaultConfig,
    ...config,
  })
}

export default request
