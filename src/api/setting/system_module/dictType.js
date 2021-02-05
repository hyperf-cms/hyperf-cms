import request from '@/utils/request'
export function dict_typeList(params) {
  return request({
    url: '/setting/system_module/dict_type/list',
    method: 'get',
    params: params
  })
}

export function createUser(params) {
  return request({
    url: '/setting/system_module/dict_type/store',
    method: 'post',
    data: params
  })
}

export function editUser(id) {
  return request({
    url: '/setting/system_module/dict_type/edit/' + id,
    method: 'get',
    params: ''
  })
}

export function updateUser(id, params) {
  return request({
    url: '/setting/system_module/dict_type/update' + '/' + id,
    method: 'put',
    data: params
  })
}

export function deleteUser(id) {
  return request({
    url: '/setting/system_module/dict_type/destroy' + '/' + id,
    method: 'delete',
    data: id,
  })
}