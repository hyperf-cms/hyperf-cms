import {
  getStore,
} from '@/utils/store'
import defaultSettings from '@/settings'
import store from '..'

const {prompt, sideTheme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo, dynamicTitle, menuColor } = defaultSettings
const storageSetting = getStore({ name: 'layout-setting'}) || ''
const setting = {
state: {
  menuColor:  storageSetting.menuColor === undefined ? menuColor : storageSetting.menuColor,
  prompt:  storageSetting.prompt === undefined ? prompt : storageSetting.prompt,
  topNav:  storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
  tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
  fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
  sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
  dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle
},

mutations: {
  SET_MENU_COLOR: (state, color) => {
    state.menuColor = color
  },
  SET_FIXED_HEADER: (state, fixedHeader) => {
    state.fixedHeader = fixedHeader
  },
  SET_TOP_NAV: (state, topNav) => {
    state.topNav = topNav
  },
  SET_TAGS_VIEW: (state, tagsView) => {
    state.tagsView = tagsView
  },
  SET_SIDEBAR_LOGO: (state, sidebarLogo) => {
    state.sidebarLogo = sidebarLogo
  },
  SET_DYNAMIC_TITLE: (state, dynamicTitle) => {
    state.dynamicTitle = dynamicTitle
  },
  SET_PROMPT: (state, prompt) => {
    state.prompt = prompt
  },
},
}
export default setting