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

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */
export const constantRouterMap = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/register",
    component: () => import("@/views/login/register"),
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
        path: "profile",
        component: () => import("@/views/setting/user_module/user/profile/index"),
        name: "Profile",
        meta: { title: "个人中心", icon: "user" }
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
  // mode: "history", //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
