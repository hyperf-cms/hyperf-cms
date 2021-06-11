import request from '@/utils/request'

export function login(username, password, captcha, code_key) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: {
      username,
      password,
      captcha,
      code_key,
    }
  })
}

export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data: data
  })
}


export function initialization() {
  return request({
    url: '/auth/initialization',
    method: 'get',
  })
}


export function getRouters() {
  return request({
    url: '/auth/routers',
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
    url: '/auth/personal_update' + '/' + id,
    method: 'put',
    data: params
  })
}