import { asyncRouterMap, constantRouterMap } from '@/router';
import { arrayChildrenFlatten } from '@/utils/functions.js';

function hasPermission(permission, route) {
  if (route.name) {
    return permission.indexOf(route.name) >= 0
  } else {
    return true
  }
}

const permission = {
  state: {
    routers: '',
    addRouters: []
  },
  mutations: {
    //路由
    SET_ROUTERS: (state, routers) => {
      state.routers = routers;
    },
    //同步的路由
    SET_ASYNCROUTER: (state, asyncRouter) => {
      state.asyncRouter = asyncRouter;
    },
    //当前模块（指顶部的菜单栏）
    SET_CURRENT_MODULE: (state, currentModule) => {
      state.currentModule = currentModule
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_MENU_HEADER: (state, menuHeader) => {
      state.menuHeader = menuHeader
    },
    SET_MENU_LIST: (state, menuList) => {
      state.menuList = menuList
    },
  },
  actions: {
    GenerateRoutes({ commit, rootState }, data) {
      return new Promise(resolve => {
        const menuList = data.data.menu_list
        const menuHeader = data.data.menu_header
        const role = data.data.role_info;
        const superAdmin = role.indexOf('super_admin') >= 0 ? true : false;
        const moduleMenuList = '';

        //初始化默认选中模块
        commit('SET_CURRENT_MODULE', 'Api:home');
        //头部菜单导航
        commit('SET_MENU_HEADER', menuHeader);
        //菜单列表
        commit('SET_MENU_LIST', menuList);

        for (var i = 0; i < menuList.length; i++) {
          if (rootState.user.currentModule == menuList[i].name) {
            commit('SET_ROUTERS', menuList[i].child)
          }

          //循环头部菜单栏中的左侧子菜单栏      
          if (menuList[i].child != undefined) {
            for (var j = 0; j < menuList[i].child.length; j++) {
              for (var k = 0; k < menuList[i].child[j].child.length; k++) {
                if (data.data.path == menuList[i].child[j].child[k].url) {
                  commit('SET_CURRENT_MODULE', menuList[i].name);
                }
              }
            }
          }
        }
        resolve();
      })
    },
    // SetRouters({ commit }) {
    //   let allRoute = arrayChildrenFlatten(asyncRouterMap);
    //   let asyncRouter = [];
    //   for (var i = allRoute.length - 1; i >= 0; i--) {
    //     asyncRouter.push({ 'name': allRoute[i].name, 'isEdit': allRoute[i].isEdit })
    //   }
    //   commit('SET_ASYNCROUTER', asyncRouter);
    // }
  },

};

export default permission;
