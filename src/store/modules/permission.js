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
    SET_ROUTERS: (state, routers) => {
      state.routers = routers;
    },
    SET_ASYNCROUTER: (state, asyncRouter) => {
      state.asyncRouter = asyncRouter;
    }
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
    //    commit('SET_ASYNCROUTER', asyncRouter);
    // }
  },

};

export default permission;
