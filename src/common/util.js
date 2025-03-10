import { MessageBox } from 'element-ui'
import router from '@/router'
import Vue from 'vue'
import moment from 'moment'

export const utils = {
  //生成随机数
  random(min, max) {
    return Math.floor(Math.random() * (max + 1 - min))
  },
  //判断对象是否为空
  ifNullObject(obj) {
    return Object.keys(obj).length != 0
  },
  //时间戳生成id
  randomID(randomLength) {
    let idStr = Date.now().toString(36)
    idStr += Math.random().toString(36).substr(3, randomLength)
    return idStr
  },
  //过滤
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
  //生成guid
  guid(len, radix) {
    len = len || 12
    radix = radix || 12
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    var guid = [],
      i
    radix = radix || chars.length
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) guid[i] = chars[0 | (Math.random() * radix)]
    } else {
      // rfc4122, version 4 form
      var r
      // rfc4122 requires these characters
      guid[8] = guid[13] = guid[18] = guid[23] = '-'
      guid[14] = '4'

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!guid[i]) {
          r = 0 | (Math.random() * 16)
          guid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
        }
      }
    }
    return guid.join('')
  },
  //日期转换
  dateFormater() {
    let time = ''
    if (arguments.length > 1) {
      //来自el-table formatter
      time = arguments[2]
    } else {
      //来自普通传参
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
  //清空对象
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
  logout(path) {
    let self = this
    console.log('logout')
    Vue.ls.clear()
  },
  // 深拷贝 array & object
  deepCopy(obj) {
    var result = Array.isArray(obj) ? [] : {}
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          result[key] = utils.deepCopy(obj[key]) //递归复制
        } else {
          result[key] = obj[key]
        }
      }
    }
    return result
  },
  // 确认删除
  delComfrim(fn) {
    MessageBox.confirm('是否确定删除？', '提示', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'danger',
    })
      .then(() => {
        fn()
      })
      .catch(() => { })
  },
  //全局点击事件
  globalClick(callback) {
    if (callback) {
      document.getElementById('app').onclick = function () {
        callback()
      }
    }
  },
  //路径中 获取文件名
  getFileName(path, suffix) {
    var pos1 = path.lastIndexOf('/')
    var pos2 = path.lastIndexOf('\\')
    var pos = Math.max(pos1, pos2)
    if (pos < 0) {
      return path
    } else {
      if (suffix) {
        //带后缀名
        return path.substring(pos + 1)
      } else {
        let tempPath = path.substring(pos + 1)
        return tempPath.substring(0, tempPath.lastIndexOf('.'))
      }
    }
  },
  //上传地址
  buildUrl() {
    let url = ''
    // url = 'http://47.103.130.217:8082/api/upload/files'
    // url = 'http://172.21.134.125:8080/api/upload/files'
    url = 'https://tms.sabs.com/api/upload/files'
    return url
  },
  //处理简称
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
  //处理日期格式
  buildDateValue(dateStr) {
    let pattern = 'HH:mm'
    return moment(dateStr).format(pattern)
  },
}
export default {
  install(Vue) {
    for (let i in utils) {
      Vue.prototype[`$${i}`] = utils[i]
    }
  },
}
