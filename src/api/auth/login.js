import request from '@/utils/request'

export function login(username, password, captcha, code_key) {
  return request({
    url: '/auth/login',
    method: 'post'  ,
    data: {
      username,
      password,
      captcha,
      code_key,
    }
  })
}

export function initialization() {
  return request({
    url: '/auth/initialization',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function personalUpdate(id, params) {
  return request({
    url:'/auth/personal_update' + '/' + id,
    method:'put',
    data:params
  })
}