import { login, logout, initialization } from '@/api/auth/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router from '@/router'
import store from '@/store'


const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    userId: '',
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USERID: (state, id) => {
      state.userId = id
    },
    REFRESH_TOEKN(state, token) {
      state.token = token
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.captcha, userInfo.code_key).then(response => {
          //如果登陆返回数据为空则直接return false
          if (response.data.length == 0) {
              resolve(false)
              return false;
          }
          const data = response.data
          const tokenStr = data.access_token
          setToken(tokenStr)
          commit('SET_TOKEN', tokenStr)
          resolve(response)
        }).catch(error => {         
          reject(error)
        })
      })
    },

    // 初始化用户信息
    Initialization({ commit, state }) {
      return new Promise((resolve, reject) => {
        initialization().then(response => {
          const data = response.data
          if (data.role_info && data.role_info.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.role_info)
          } else {
            reject('getInfo: role_info must be a non-null array !')
          }
          commit('SET_NAME', data.user_info.desc)
          commit('SET_AVATAR', data.user_info.avatar)
          commit('SET_USERID', data.user_info.id)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    // 将刷新的 token 保存至本地
     refreshToken({commit},token) {
         return new Promise(function (resolve, reject) {
             setToken(token)
             commit('REFRESH_TOEKN', token)
         })
    },
  }
}

export default user
