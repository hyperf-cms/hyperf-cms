const getters = {
  //应用相关状态
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  maintain_switch: state => state.app.maintain_switch,
  simple_maintain_switch: state => state.app.simple_maintain_switch,
  register_switch: state => state.app.register_switch,

  //用户相关状态
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  userId: state => state.user.userId,

  //菜单权限相关状态
  routers: state => state.permission.routers,
  asyncRouter: state => state.permission.asyncRouter,
  addRouters: state => state.permission.addRouters,
  currentModule: state => state.permission.currentModule,
  menuHeader: state => state.permission.menuHeader,
  menuList: state => state.permission.menuList,
  menuLeft: state => state.permission.menuLeft,
  permissions: state => state.permission.permission,
  permissionInfo: state => state.permission.permissionInfo,

  //菜单窗口相关状态
  allViews: state => state.tagsViews.allViews,
  cachedViews: state => state.tagsView.cachedViews,
  allViewsNames: state => state.tagsViews.allViewsNames,
  
  //主体相关状态
  theme: state => state.theme.theme,
  
  
}
export default getters
