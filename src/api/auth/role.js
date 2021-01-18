import request from '@/utils/request'
export function getRoleList(params) {
  return request({
    url: '/setting/role/list',
    method: 'get',
    params: params
  })
}

export function getRoleByTree(params) {
  return request({
    url: '/setting/role/tree',
    method: 'get',
    params: params
  })
}

export function createRole(params) {
  return request({
    url: '/setting/role',
    method: 'post',
    data: params
  })
}

export function updateRole(id, params) {
  return request({
    url: '/setting/role' + '/' + id,
    method: 'put',
    data: params
  })
}

export function deleteUser(id) {
  return request({
    url: '/setting/role' + '/' + id,
    method: 'delete',
    data: id,
  })
}



