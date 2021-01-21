import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import common from '@/store/modules/common'
import getters from '@/store/getters'
import fullScreen from '@/store/modules/fullScreen'
import errorLog from '@/store/modules/errorLog'

import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

// const vuexLocal = new VuexPersistence({
//   storage: window.localStorage,
//   modules: ['user']
// })

const store = new Vuex.Store({
  modules: {
    user,
    common,
    fullScreen,
    errorLog
  },
  getters
  // plugins: [vuexLocal.plugin]
})

export default store
