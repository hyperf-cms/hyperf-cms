import request from '@/utils/request'
export function getRoleList(params) {
  return request({
    url: '/setting/user_module/role/list',
    method: 'get',
    params: params
  })
}

export function getRoleByTree(params) {
  return request({
    url: '/setting/user_module/role/tree',
    method: 'get',
    params: params
  })
}

export function createRole(params) {
  return request({
    url: '/setting/user_module/role/store',
    method: 'post',
    data: params
  })
}

export function updateRole(id, params) {
  return request({
    url: '/setting/user_module/role/update' + '/' + id,
    method: 'put',
    data: params
  })
}

export function deleteUser(id) {
  return request({
    url: '/setting/user_module/role/destroy' + '/' + id,
    method: 'delete',
    data: id,
  })
}



