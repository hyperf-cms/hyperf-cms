import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import tagsViews from './modules/tagsViews'
import theme from './modules/theme'
import getters from './getters'
import chat from './modules/chat'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    tagsViews,
    theme,
    chat,
  },
  getters
})

export default store
