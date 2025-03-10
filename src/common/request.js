import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'
import { showLoading, hideLoading } from './loading-mask'
import store from '@/store'

// 后端接收token
const TOKEN_KEY = 'X-Auth-Token'
// 状态码属性名
const STATUS_KEY = 'status'
// 状态信息属性名
const MESSAGE_KEY = 'message'
// 状态码成功标识
const SUCCESS_STATUS = 100

class HttpRequest {
  constructor(options) {
    const config = {
      withToken: true, //是否添加请求头TOKEN
      showLoading: false, //是否显示加载弹框
      alertError: true, //是否显示错误提示
      alertSuccess: false, //是否显示错误提示
      timeout: 60000, //Ajax超时时间
      skip: false, //是否跳过校验直接返回结果
      disassemble: true, //是否返回深层的data
      redirectLogin: true, //遇到401错误是否跳转到登录页
      loginRoute: '/Login', //登录页路由
      statusKey: '', //状态键名
      successStatus: SUCCESS_STATUS, //状态成功键名
    }
    this.config = Object.assign(config, options)
  }

  // 默认配置
  getDefaultOption() {
    const option = Object.assign({}, this.config)
    if (option.withToken === true) {
      option.headers = {
        [TOKEN_KEY]: store.state.user.token,
      }
    }
    return option
  }

  // 登录页跳转
  redirectLogin() {
    store.commit('CLEAR_USER_DATA')
    router.push({
      path: '/',
    })
  }

  // 拦截器设置
  interceptors(instance, options) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        // 显示遮罩层
        if (options.showLoading) showLoading()
        return config
      },
      (error) => {
        return error
      },
    )

    // 响应拦截
    instance.interceptors.response.use(
      (res) => {
        const { data } = res
        if (options.showLoading) hideLoading()
        if (options.skip) return data
        //接口内部处理
        const key = options.statusKey || STATUS_KEY // 状态码键名
        const value = options.successStatus || SUCCESS_STATUS // 成功状态标识
        if (data[key] == value) {
          //成功提示
          if (options.alertSuccess) {
            if (typeof options.alertSuccess === 'string') {
              Message.success(options.alertSuccess)
            } else {
              // Message.success(data[MESSAGE_KEY] || '操作成功！')
            }
          }
          //返回深层data
          if (options.disassemble) {
            return data.data
          } else {
            return data
          }
        } else {
          //接口状态码配置
          if (data[key] == 'A0230') {
            Message.error('token已过期,请重新登陆!')
            setTimeout(() => {
              if (options.redirectLogin) this.redirectLogin()
            }, 2000)
          } else {
            if (options.alertError) {
              this.alertErrorMsg(-1, data[MESSAGE_KEY])
            }
          }
          throw data
        }
      },
      (error) => {
        /***** 接收到异常响应的处理开始 *****/
        let errCode = 0
        let errMessage = ''
        if (error && error.response) {
          console.log('error.response.data', error.response.data, MESSAGE_KEY)
          if (error.response.data) {
            errMessage = error.response.data[MESSAGE_KEY]
          }
          errCode = error.response.status
          switch (errCode) {
            case 401:
              // 未经授权处理
              Message.error('token已过期,请重新登陆!')
              if (options.redirectLogin) this.redirectLogin()
              break
            default:
              break
          }
        } else {
          // 超时处理
          if (JSON.stringify(error).includes('timeout')) {
            errCode = 601
          } else {
            errCode = 602
          }
        }
        if (options.showLoading) hideLoading()
        if (options.alertError) this.alertErrorMsg(errCode, errMessage)
        return Promise.reject(error.response)
      },
    )
  }

  // 错误提示
  alertErrorMsg(errCode, errMessage) {
    Message.closeAll()
    //请求错误
    switch (errCode) {
      case -1:
        Message.error(errMessage || '操作处理失败,请联系管理员！')
        break
      case 400:
        Message.error(errMessage || '400:错误请求')
        break
      case 401:
        Message.error(errMessage || '401:未授权，请重新登录')
        break
      case 403:
        Message.error(errMessage || '403:拒绝访问')
        break
      case 404:
        Message.error(errMessage || '404:请求错误,未找到该资源')
        break
      case 405:
        Message.error(errMessage || '405:请求方法未允许')
        break
      case 408:
        Message.error(errMessage || '408:请求超时')
        break
      case 500:
        Message.error(errMessage || '500:服务器端出错')
        break
      case 501:
        Message.error(errMessage || '501:网络未实现')
        break
      case 502:
        Message.error(errMessage || '502:网络错误')
        break
      case 503:
        Message.error(errMessage || '503:服务不可用')
        break
      case 504:
        Message.error(errMessage || '504:网络超时')
        break
      case 505:
        Message.error(errMessage || '505:http版本不支持该请求')
        break
      case 601:
        Message.error(errMessage || '连接服务器失败')
        break
      case 602:
        Message.error(errMessage || '服务器响应超时，请刷新当前页')
        break
      default:
        Message.error(errMessage || `连接错误${errCode}`)
    }
  }

  // 执行请求
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getDefaultOption(), options)
    this.interceptors(instance, options)
    return instance(options)
  }
}

const request = (options) => {
  const http = new HttpRequest(options)
  return http.request(options)
}
export default request
