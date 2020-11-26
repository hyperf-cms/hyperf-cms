import { login, logout, getInfo } from '@/api/auth/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import store from '@/store'


const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    // phoneCode: false,
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
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_PID: (state, pid) => {
      state.pid = pid
    },
    // SET_PHONECODE: (state, phoneCode) => {
    //   state.phoneCode = phoneCode
    // },
    REFRESH_TOEKN(state, token) {
      state.token = token
    },
    SET_DOWNLOAD_URL(state,download_url) {
      state.downLoadUrl = download_url
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.captcha, userInfo.code_key).then(response => {
          if (response.errorCode == '201' || response.errorCode == '400') {
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

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.role)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.desc)
          commit('SET_AVATAR', data.avatar)
          commit('SET_USERID', data.id)
          commit('SET_PERMISSIONS', data.permission)
          commit('SET_PID', data.pid)
          commit('SET_DOWNLOAD_URL', data.download_url)
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
