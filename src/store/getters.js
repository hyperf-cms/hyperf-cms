const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  userId: state => state.user.userId,
  permissions: state => state.user.permissions,
  routers: state => state.permission.routers,
  asyncRouter: state => state.permission.asyncRouter,
  addRouters: state => state.permission.addRouters,
  currentModule: state => state.permission.currentModule,
  allViews: state => state.tagsViews.allViews,
  cachedViews: state => state.tagsView.cachedViews,
  allViewsNames: state => state.tagsViews.allViewsNames,
  theme: state => state.theme.theme,
  menuHeader: state => state.user.menuHeader,
  menuList: state => state.user.menuList,
}
export default getters
