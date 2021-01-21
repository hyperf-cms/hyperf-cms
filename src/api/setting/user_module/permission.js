import request from '@/utils/request'
export function getPermission(params) {
  return request({
    url:'/setting/user_module/permission',
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

export function giveRolePermission(data) {
  return request({
    url:'/setting/user_module/give_role_permission',
    method:'post',
    data:data,
  })
}

export function giveUserPermission(data) {
  return request({
    url:'/setting/user_module/give_user_permission',
    method:'post',
    data:data,
  })
}


