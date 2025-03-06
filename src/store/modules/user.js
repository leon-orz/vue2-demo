import Vue from 'vue'
import { LoginApi } from '@/api/base.js'

export default {
  namespaced: true,
  state: {
    userInfo: null,
    token: null,
  },
  mutations: {
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      Vue.ls.set('user_info', userInfo)
    },
    SET_TOKEN(state, token) {
      state.token = token
      Vue.ls.set('access_token', token)
    },
  },
  actions: {
    async login({ commit }, { account, password }) {
      try {
        const res = await LoginApi({ account, password })
        if (res?.status === 100) {
          if (!res.data?.token) {
            throw new Error('登录凭证缺失')
          }
          const { token, ...userInfo } = res.data
          commit('SET_USER_INFO', userInfo)
          commit('SET_TOKEN', token)
        } else {
          throw new Error(res?.message || '登录失败')
        }

        return Promise.resolve(res)
      } catch (error) {
        commit('SET_USER_INFO', null)
        commit('SET_TOKEN', null)

        return Promise.reject(new Error(error.message || '登录异常'))
      }
    },
    logout({ commit }) {
      commit('SET_USER_INFO', null)
      commit('SET_TOKEN', null)
      Vue.ls.remove('user_info')
      Vue.ls.remove('access_token')
    },
  },
  getters: {},
}
