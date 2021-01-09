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
  },
  actions: {
    GenerateRoutes({ commit, rootState }, data) {
      return new Promise(resolve => {
        const menuList = data.data.menu_list
        const role = data.data.role_info;
        const superAdmin = role.indexOf('super_admin') >= 0 ? true : false;       
        const moduleMenuList = '';
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
    SetRouters({ commit }) {
      let allRoute = arrayChildrenFlatten(asyncRouterMap);
      let asyncRouter = [];
      for (var i = allRoute.length - 1; i >= 0; i--) {
        asyncRouter.push({ 'name': allRoute[i].name, 'isEdit': allRoute[i].isEdit })
      }
       commit('SET_ASYNCROUTER', asyncRouter);
    }
  },

};

export default permission;
