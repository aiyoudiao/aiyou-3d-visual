
import {
  setStore,
  getStore,
  removeStore
} from '@/utils/store'
const user = {
  namespaced: true,
  state: {
    browserHeaderTitle: getStore({
      name: 'browserHeaderTitle'
    }) || 'aiyou-3d-visual'
  },

  mutations: {
    SET_BROWSERHEADERTITLE: (state, action) => {
      state.browserHeaderTitle = action.browserHeaderTitle
    }

  },

  actions: {
  }
}

export default user
