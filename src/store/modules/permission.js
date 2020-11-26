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
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    },
    SET_ASYNCROUTER: (state, asyncRouter) => {
      state.asyncRouter = asyncRouter;
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const permission = data.data.permission;
        const role = data.data.role;
        const superAdmin = role.indexOf('super_admin') >= 0 ? true : false;
        const accessedRouters = asyncRouterMap.filter(v => {
          if (superAdmin || hasPermission(permission, v)) {
            if (v.children && v.children.length > 0) {
              let pArr = [];
              for (let i in v.children) {
                if ((superAdmin || hasPermission(permission, v.children[i])) && v.children[i].pid == 0) {
                  pArr[v.children[i].name] = v.children[i];
                }
              }

              
              for (let i in v.children) {
                let pid = v.children[i].pid ? v.children[i].pid : 0;
                if ((superAdmin || hasPermission(permission, v.children[i])) && pid != 0) {
                  pArr[v.children[i].pid]['children'].push(v.children[i]);
                }
              }

              v.children = [];
              for (let i in pArr) {
                v.children.push(pArr[i]);
              }

              return v;
            }
          }
          // if (role.indexOf('super_admin') >= 0) return true;
          // if (hasPermission(permission, v)) {
          //   if (v.children && v.children.length > 0) {
          //     v.children = v.children.filter(child => {
          //       if (hasPermission(permission, child)) {
          //         return child
          //       }
          //       return false;
          //     });
          //     return v
          //   } else {
          //     return v
          //   }
          // }
          // return false;
        });
        commit('SET_ROUTERS', accessedRouters);
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
