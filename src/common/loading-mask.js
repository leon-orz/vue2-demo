import ElementUI from 'element-ui'

// 全局loading实例和请求计数器
let loadingInstance = null
let loadingCount = 0

// 启动加载效果
export const startLoading = (options = {}) => {
  if (loadingCount === 0) {
    loadingInstance = ElementUI.Loading.service({
      lock: true,
      text: '加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      ...options,
    })
  }
  loadingCount++
}

// 关闭加载效果
export const closeLoading = () => {
  if (loadingCount > 0) {
    loadingCount--
    if (loadingCount === 0 && loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
  }
}
