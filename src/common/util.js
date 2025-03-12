import { MessageBox } from 'element-ui'
import router from '@/router'
import Vue from 'vue'
import moment from 'moment'

export const utils = {
  random(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min
  },

  ifNullObject(obj) {
    return Object.keys(obj).length !== 0
  },

  randomID(randomLength) {
    let idStr = Date.now().toString(36)
    idStr += Math.random().toString(36).substr(3, randomLength)
    return idStr
  },

  mockFilter(list, search) {
    return list.reduce((res, item) => {
      for (let key in search) {
        if (search[key] && item[key] != search[key]) {
          return res
        }
      }
      res.push(item)
      return res
    }, [])
  },

  guid(len = 12, radix = 16) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    return Array.from({ length: len }, () => chars[Math.floor(Math.random() * radix)]).join('')
  },

  dateFormater() {
    let time = ''
    if (arguments.length > 1) {
      time = arguments[2]
    } else {
      time = arguments[0]
    }
    var date = time ? new Date(time) : new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  },

  clearObject(obj, asObj) {
    for (let key in obj) {
      if (asObj && typeof asObj[key] != 'undefined') {
        obj[key] = asObj[key]
      } else if (typeof obj[key] == 'string') {
        obj[key] = ''
      } else if (typeof obj[key] == 'boolean') {
        obj[key] = false
      } else if (typeof obj[key] == 'number') {
        obj[key] = 0
      }
    }
  },

  deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
  },

  delComfrim(fn) {
    MessageBox.confirm('是否确定删除？', '提示', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'danger',
    })
      .then(() => {
        fn()
      })
      .catch(() => {})
  },

  globalClick(callback) {
    if (callback) {
      document.getElementById('app').onclick = function () {
        callback()
      }
    }
  },

  getFileName(path, suffix) {
    var pos1 = path.lastIndexOf('/')
    var pos2 = path.lastIndexOf('\\')
    var pos = Math.max(pos1, pos2)
    if (pos < 0) {
      return path
    } else {
      if (suffix) {
        return path.substring(pos + 1)
      } else {
        let tempPath = path.substring(pos + 1)
        return tempPath.substring(0, tempPath.lastIndexOf('.'))
      }
    }
  },

  buildUrl() {
    let url = ''
    url = 'https://tms.sabs.com/api/upload/files'
    return url
  },

  buildFcAbb(fcCode) {
    let fcAbb = ''
    if (fcCode) {
      if ('ASSY' == fcCode) {
        fcAbb = '新厂'
      }
      if ('MACH' == fcCode) {
        fcAbb = '老厂'
      }
    }
    return fcAbb
  },

  buildDateValue(dateStr) {
    return moment(dateStr).format('HH:mm')
  },
}

export default {
  install(Vue) {
    for (let i in utils) {
      Vue.prototype[`$${i}`] = utils[i]
    }
  },
}
