import LoginApi from '@/api/base'
import { TOKEN_KEY, USER_INFO_KEY } from '@/constants'

const storageHelper = {
  getItem(key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch (e) {
      return localStorage.getItem(key)
    }
  },
  setItem(key, value) {
    typeof value === 'string' 
      ? localStorage.setItem(key, value)
      : localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem(key) {
    localStorage.removeItem(key)
  }
}

export default {
  namespaced: true,
  state: () => ({
    token: storageHelper.getItem(TOKEN_KEY) || '',
    userInfo: storageHelper.getItem(USER_INFO_KEY) || null,
    error: null,
  }),
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      storageHelper.setItem(TOKEN_KEY, token)
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      storageHelper.setItem(USER_INFO_KEY, userInfo)
    },
    LOGOUT(state) {
      state.token = ''
      state.userInfo = null
      storageHelper.removeItem(TOKEN_KEY)
      storageHelper.removeItem(USER_INFO_KEY)
    },
  },
  actions: {
    /**
     * 用户登录
     * @async
     * @param {Object} context - Vuex上下文
     * @param {Object} credentials - 登录凭证
     * @throws {Error} 登录失败时抛出错误
     */
    async login({ commit }, credentials) {
      commit('SET_ERROR', null)
      try {
        const res = await LoginApi(credentials)
        commit('SET_TOKEN', res.data.token)
        commit('SET_USER_INFO', res.data.user)
      } catch (error) {
        commit('SET_TOKEN', '')
        commit('SET_USER_INFO', null)
        commit('SET_ERROR', {
          message: '登录失败',
          details: error.response?.data?.message || error.message,
          timestamp: new Date().toISOString()
        })
        throw error
      }
    },
    /**
     * 清除认证错误信息
     * @param {Object} context - Vuex上下文
     */
    clearError({ commit }) {
      commit('SET_ERROR', null)
    },
    logout({ commit }) {
      commit('LOGOUT')
    },
  },
}
