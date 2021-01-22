import store from "@/store";
import router from "@/router";
import { arrayLookup } from "@/utils/functions";
import { MessageBox } from "element-ui";

const tagsViews = {
  state: {
    allViews: [],
    cachedViews: []
  },

  mutations: {
    ADD_CACHED_VIEW: (state, view) => {
      if (state.cachedViews.includes(view.name)) return;
      //判断如果是导航页面则不增加tag
      if (view.name == "navigation") return;
      if (!view.meta.noCache) {
        state.cachedViews.push(view.name);
      }
    },
    DEL_CACHED_VIEW: (state, name) => {
      const index = state.cachedViews.indexOf(name.routeName);
      index > -1 && state.cachedViews.splice(index, 1);
    },
    SET_VIEWS: (state, route) => {
      // 判断如果是导航页面则不增加tag
      if (route.name == "navigation") return;
      let addViews = true;
      for (var i = 0; i < state.allViews.length; i++) {
        if (state.allViews[i].path == route.path) {
          addViews = false;
        }
      }
      if (addViews == true) {
        state.allViews.push({
          name: route.meta.title,
          path: route.path,
          routeName: route.name
        });
      }
    },
    DEL_VIEWS: state => {
      state.allViews = [];
      state.cachedViews = [];
    },
    REMOVE_VIEWS: (state, name) => {
      let allViews = state.allViews;
      let allViewsNames = state.allViewsNames;
      let routers = store.getters.routers;

      for (var i = 0; i < state.allViews.length; i++) {
        if (allViews[i].path == name.name) {
          let index = i;

          if (allViews[i].path != name.nowPath) {
            if (allViews[index].path != name.nowPath) {
              allViews.splice(index, 1);
            } else {
              if (allViews[index - 1] != undefined) {
                router.push({ path: allViews[index - 1].path });
                allViews.splice(index, 1);
              } else if (allViews[index + 1] != undefined) {
                router.push({ path: allViews[index + 1].path });
                allViews.splice(index, 1);
              }
            }
          } else {
            if (allViews[i - 1] != undefined) {
              router.push({ path: allViews[i - 1].path });
              allViews.splice(i, 1);
            } else if (allViews[index + 1] != undefined) {
              router.push({ path: allViews[index + 1].path });
              allViews.splice(index, 1);
            }
          }
        }
      }
      state.allViews = allViews;
      state.getters.allViews = allViews;
    }
  },

  actions: {
    async addViews({ commit }, route) {
      try {
        return new Promise((resolve, reject) => {
          commit("SET_VIEWS", route);
          commit("ADD_CACHED_VIEW", route);
          resolve(true);
        });
      } catch (error) {
        reject(error);
      }
    },
    async delAllViews({ commit }) {
      try {
        return new Promise((resolve, reject) => {
          commit("DEL_VIEWS");
          resolve(true);
        });
      } catch (error) {
        reject(error);
      }
    },
    async removeView({ commit }, name) {
      try {
        return new Promise((resolve, reject) => {
          commit("DEL_CACHED_VIEW", name);
          commit("REMOVE_VIEWS", name);
          resolve(true);
        });
      } catch (error) {
        reject(error);
      }
    }
  }
};

export default tagsViews;
