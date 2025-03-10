const state = {
  currentTime: null,
}

const mutations = {
  SET_CURRENT_TIME(state, time) {
    state.currentTime = time
  },
}

const actions = {
  updateTime({ commit }) {
    commit('SET_CURRENT_TIME', new Date().toISOString())
  },
  startTimeSync({ commit, dispatch }) {
    setInterval(() => {
      dispatch('updateTime')
    }, 1000)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
