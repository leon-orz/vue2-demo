import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import time from './modules/time'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    time,
  },
})
