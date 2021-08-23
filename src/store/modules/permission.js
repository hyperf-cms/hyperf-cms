import { asyncRouterMap } from "@/router";
import { arrayLookup } from "@/utils/functions";
import { getRouters } from "@/api/auth/login";
import Layout from "@/views/layout/Layout";
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
        commit("SET_CURRENT_MODULE", "home");
        //头部菜单导航
        commit("SET_MENU_HEADER", menuHeader);
        //菜单列表
        commit("SET_MENU_LIST", menuList);
        //权限列表
        commit("SET_PERMISSIONS", permission);
        //权限信息
        commit("SET_PERMISSIONS_INFO", permission_info);
        //左侧菜单列表

        //判断如果，没有开启顶部导航栏，则使用默认菜单
        if (!this.state.setting.topNav) {
          commit("SET_MENU_LEFT", menuList);
        }

        //循环头部菜单栏中的左侧子菜单栏
        for (let i = 0; i < permission_info.length; i++) {
          if (permission_info[i].url == data.data.path) {
            var string = permission_info[i].name.indexOf("/");
            commit(
              "SET_CURRENT_MODULE",
              permission_info[i].name.substring(0, string)
            );
          }
        }

        // 向后端请求路由数据
        getRouters().then(res => {
          const rdata = JSON.parse(JSON.stringify(res.data));
          const rewriteRoutes = filterAsyncRouter(rdata, true);
          rewriteRoutes.push({ path: "*", redirect: "/404", hidden: true });
          resolve(rewriteRoutes);
        });
      });
    }
  }
};

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, isRewrite = false) {
  return asyncRouterMap.filter(route => {
    if (isRewrite && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === "Layout") {
        route.component = Layout;
      } else if (route.component === "ParentView") {
        route.component = ParentView;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.path[0] != "/") {
      route.path = "/" + route.path;
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, isRewrite);
    }
    return true;
  });
}

function filterChildren(childrenMap) {
  var children = [];
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === "ParentView") {
        el.children.forEach(c => {
          c.path = el.path + "/" + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    children = children.concat(el);
  });
  return children;
}

export const loadView = view => {
  // 路由懒加载
  return resolve => require([`@/views/${view}`], resolve);
};

export default permission;
