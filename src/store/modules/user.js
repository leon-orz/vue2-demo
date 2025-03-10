import Vue from 'vue'

const state = () => ({
  token: '',
  userInfo: null,
})

const mutations = {
  SET_USER_DATA(state, { token, ...userInfo }) {
    state.token = token
    state.userInfo = userInfo
    Vue.ls.set('token', token)
    Vue.ls.set('userInfo', userInfo)
  },
  CLEAR_USER_DATA(state) {
    state.token = ''
    state.userInfo = null
    Vue.ls.remove('token')
    Vue.ls.remove('userInfo')
  },
}

const actions = {
  login({ commit }, payload) {
    commit('SET_USER_DATA', payload)
  },
  logout({ commit }) {
    commit('CLEAR_USER_DATA')
  },
  loadUserData({ commit }) {
    const token = Vue.ls.get('token')
    const userInfo = Vue.ls.get('userInfo')
    if (token) {
      commit('SET_USER_DATA', { token, userInfo })
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
