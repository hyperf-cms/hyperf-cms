import Vue from "vue";
import Router from "vue-router";
/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};
import Layout from "../views/layout/Layout";

Vue.use(Router);

import settingRouter from "./modules/settingRouter";

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "Api:home",
        component: () => import("@/views/home/index"),
        meta: { title: "仪表盘", icon: "home" }
      },
      {
        path: "navigation",
        name: "navigation",
        component: () => import("@/views/common/navigation"),
        meta: { title: "路由导航", icon: "home" }
      },
      {
        path: "401",
        name: "401",
        meta: { title: "404 Not Found", icon: "home" },
        component: () => import("@/views/error/401"),
        hidden: true
      },
      {
        path: "404",
        name: "404",
        meta: { title: "404 Not Found", icon: "home" },
        component: () => import("@/views/error/404"),
        hidden: true
      }
    ]
  }
];

export default new Router({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

/**
 * 需要过滤动态加载的路由
 **/
export const asyncRouterMap = [
  //设置模块路由
  settingRouter,

  { path: "*", redirect: "/401", hidden: true }
];
