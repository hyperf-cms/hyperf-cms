import { asyncRouterMap, constantRouterMap } from "@/router";
import { setStore, getStore, removeStore } from "@/utils/store";
import { arrayChildrenFlatten } from "@/utils/functions.js";
import { arrayLookup } from "@/utils/functions";
import router from "@/router";
import Vue from "vue";

function hasPermission(permission, route) {
  if (route.name) {
    return permission.indexOf(route.name) >= 0;
  } else {
    return true;
  }
}

const permission = {
  state: {
    routers: [],
    currentModule: "",
    menuHeader: [],
    permission: [],
    permissionInfo: [],
    menuList: [],
    menuLeft: []
  },
  mutations: {
    //路由
    SET_ROUTERS: (state, routers) => {
      state.routers = routers;
    },
    //当前模块（指顶部的菜单栏）
    SET_CURRENT_MODULE: (state, currentModule) => {
      state.currentModule = currentModule;
    },
    //用户权限
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    },
    //用户权限信息
    SET_PERMISSIONS_INFO: (state, permissionInfo) => {
      state.permissionInfo = permissionInfo;
    },
    //顶部菜单栏
    SET_MENU_HEADER: (state, menuHeader) => {
      state.menuHeader = menuHeader;
    },
    //所有菜单列表
    SET_MENU_LIST: (state, menuList) => {
      state.menuList = menuList;
    },
    //左侧菜单列表
    SET_MENU_LEFT: (state, menuLeft) => {
      state.menuLeft = menuLeft;
    }
  },
  actions: {
    GenerateRoutes({ commit, rootState }, data) {
      return new Promise(resolve => {
        const menuList = data.data.menu_list;
        const menuHeader = data.data.menu_header;
        const permission = data.data.permission;
        const permission_info = data.data.permission_info;
        const role = data.data.role_info;
        const superAdmin = role.indexOf("super_admin") >= 0 ? true : false;
        const moduleMenuList = "";

        //初始化默认选中模块
        commit("SET_CURRENT_MODULE", "Api:home");
        //头部菜单导航
        commit("SET_MENU_HEADER", menuHeader);
        //菜单列表
        commit("SET_MENU_LIST", menuList);
        //权限列表
        commit("SET_PERMISSIONS", permission);
        //权限信息
        commit("SET_PERMISSIONS_INFO", permission_info);
        //左侧菜单列表

        //循环头部菜单栏中的左侧子菜单栏
        for (var i = 0; i < menuList.length; i++) {
          if (menuList[i].child != undefined) {
            for (var j = 0; j < menuList[i].child.length; j++) {
              for (var k = 0; k < menuList[i].child[j].child.length; k++) {
                if (data.data.path == menuList[i].child[j].child[k].url) {
                  commit("SET_CURRENT_MODULE", menuList[i].name);
                }
              }
            }
          }
        }

        //根据后台传过来的权限列表进行路由过滤，过滤掉不被允许的路由
        const accessedRouters = asyncRouterMap.filter(v => {
          if (role.indexOf("super_admin") >= 0) return true;
          if (hasPermission(permission, v)) {
            //设置父级的meta
            let permissionInfo = arrayLookup(permission_info, "name", v.name);
            v.meta = {};
            if (permissionInfo.length != 0) {
              Vue.set(v.meta, "title", permissionInfo.display_name);
              Vue.set(v.meta, "icon", permissionInfo.icon);
            }

            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                //设置子级meta
                if (hasPermission(permission, child)) {
                  let permissionInfo = arrayLookup(
                    permission_info,
                    "name",
                    child.name
                  );
                  child.meta = {};
                  if (permissionInfo.length != 0) {
                    Vue.set(child.meta, "title", permissionInfo.display_name);
                    Vue.set(child.meta, "icon", permissionInfo.icon);
                  }
                  return child;
                }
                return false;
              });
              return v;
            } else {
              return v;
            }
          }
          return false;
        });

        commit("SET_ROUTERS", accessedRouters);
        resolve();
      });
    }
  }
};

export default permission;
