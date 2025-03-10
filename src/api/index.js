import request from '@/common/request.js'
import { utils } from '@/common/util.js'
const apiPathToFunction = (mApis) => {
  let result = {}
  for (let item in mApis) {
    if (typeof mApis[item] == 'string') {
      const strArray = mApis[item].split(' ')
      if (strArray.length >= 2) {
        const url = strArray[1] //请求路径
        const method = strArray[0] //请求方式
        if (strArray[1].includes(':')) {
          //包含 path 参数
          result[item] = (id, data) => {
            return request({
              url: `${url.split(':')[0]}/${id}`,
              method: method,
              data: data,
            })
          }
        } else {
          //无 path 参数
          result[item] = (data) => {
            return request({
              url: `${url.split(':')[0]}`,
              method: method,
              // get使用params参数 其他使用body
              params: method == 'GET' && data,
              data: method != 'GET' && data,
            })
          }
        }
      }
    } else if (typeof mApis[item] == 'function') {
      result[item] = mApis[item]
    }
  }
  return result
}

export default {
  install(Vue) {
    const modules = require.context('./modules', false, /\.js/)
    Vue.prototype.$api = {}
    Vue.prototype.$request = request
    modules.keys().forEach((key) => {
      const name = utils.getFileName(key)
      if (modules(key).default) {
        Vue.prototype.$api[name] = apiPathToFunction(modules(key).default)
      }
    })
  },
}
