import { find, assign } from 'lodash'

export default ({ service, request, faker, tools }) => ({
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  SYS_USER_LOGIN(data = {}) {
   return  request({
      url: 'auth/login',
      method: 'post',
      data: data
    })
  }
})
