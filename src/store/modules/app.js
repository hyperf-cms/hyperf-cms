import Cookies from "js-cookie";
import { getSysConfig } from "@/api/common/common";

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get("sidebarStatus"),
      withoutAnimation: false
    },
    device: "desktop",
    maintain_switch: false,
    register_switch: false,
    simple_maintain_switch: false
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set("sidebarStatus", 1);
      } else {
        Cookies.set("sidebarStatus", 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set("sidebarStatus", 1);
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },
    MAINTAIN_SWITCH: (state, maintain_switch) => {
      state.maintain_switch = maintain_switch;
    },
    REGISTER_SWITCH: (state, register_switch) => {
      state.register_switch = register_switch;
    },
    SIMPLE_MAINTAIN_SWITCH: (state, simple_maintain_switch) => {
      state.simple_maintain_switch = simple_maintain_switch;
    }
  },
  actions: {
    InitialConfig({ commit, rootState }) {
      return new Promise(resolve => {
        //向后端请求路由数据
        getSysConfig().then(res => {
          commit("MAINTAIN_SWITCH", res.data.maintain_switch);
          commit("REGISTER_SWITCH", res.data.register_switch);
          commit("SIMPLE_MAINTAIN_SWITCH", res.data.simple_maintain_switch);
        });
      });
    },
    ToggleSideBar: ({ commit }) => {
      commit("TOGGLE_SIDEBAR");
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit("CLOSE_SIDEBAR", withoutAnimation);
    },
    ToggleDevice({ commit }, device) {
      commit("TOGGLE_DEVICE", device);
    }
  }
};

export default app;
