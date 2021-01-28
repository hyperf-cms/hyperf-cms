import request from '@/utils/request'
export function getPermission(params) {
  return request({
    url:'/setting/user_module/permission',
    method:'get',
    params:params
  })
}

export function getPermissionTreeByUser(params) {
  return request({
    url:'/setting/user_module/permission/tree_by_user',
    method:'get',
    params:params
  })
}

export function getPermissionTreeByRole(params) {
  return request({
    url:'/setting/user_module/permission/tree_by_role',
    method:'get',
    params:params
  })
}

export function createPermission(params) {
  return request({
    url:'/setting/user_module/permission/store',
    method:'post',
    data:params
  })
}

export function deletePermission(id) {
  return request({
    url:'/setting/user_module/permission/destroy' + '/' + id,
    method:'delete',
    data:id,
  })
}

export function updatePermission(id, params) {
  return request({
    url:'/setting/user_module/permission/update' + '/' + id,
    method:'put',
    data:params
  })
}

export function accordRolePermission(data) {
  return request({
    url:'setting/user_module/permission/accord_role_permission',
    method:'post',
    data:data,
  })
}

export function accordUserPermission(data) {
  return request({
    url:'setting/user_module/permission/accord_user_permission',
    method:'post',
    data:data,
  })
}


