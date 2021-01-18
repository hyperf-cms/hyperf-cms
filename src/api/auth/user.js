import request from '@/utils/request'
export function userList(params) {
  return request({
    url:'/setting/user/list',
    method:'get',
    params:params
  })
}

export function createUser(params) {
  return request({
    url:'/setting/user',
    method:'post',
    data:params
  })
}

export function getUserOne(id) {
  return request({
    url:'/setting/user/' + id + '/edit',
    method:'get',
    params:id
  })
}

export function updateUser(id, params) {
  return request({
    url:'/setting/user' + '/' + id,
    method:'put',
    data:params
  })
}

export function deleteUser(id) {
  return request({
    url:'/setting/user' + '/' + id,
    method:'delete',
    data:id,
  })
}

export function resetPassword(params) {
  return request({
    url:'/setting/reset_password',
    method:'post',
    data:params,
  })
}

