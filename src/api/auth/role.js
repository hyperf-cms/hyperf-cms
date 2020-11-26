import request from '@/utils/request'
export function getRole(params) {
  return request({
    url:'/setting/auth/role',
    method:'get',
    params:params
  })
}

export function createRole(params) {
  return request({
    url:'/setting/auth/role',
    method:'post',
    data:params
  })
}

export function updateRole(id, params) {
  return request({
    url:'/setting/auth/role' + '/' + id,
    method:'put',
    data:params
  })
}

export function deleteUser(id) {
  return request({
    url:'/setting/auth/role' + '/' + id,
    method:'delete',
    data:id,
  })
}



