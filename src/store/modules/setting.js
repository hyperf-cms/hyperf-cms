import {
  setStore,
  getStore,
  removeStore
} from '@/utils/store'


const setting = {

state: {
  menuColor:  getStore({name:'layout-setting-menuColor'}) || "theme-dark",
  fixedHeader:  getStore({name:'layout-setting-fixedHeader'}) || "theme-dark",
  topNav:  getStore({name:'layout-setting-topNav'}) || "theme-dark",
  tagsView:  getStore({name:'layout-setting-tagsView'}) || "theme-dark",
  sidebarLogo:  getStore({name:'layout-setting-sidebarLogo'}) || "theme-dark",
  dynamicTitle:  getStore({name:'layout-setting-dynamicTitle'}) || "theme-dark",
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
},
}
export default setting