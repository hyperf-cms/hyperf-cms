import request from '@/utils/request'
export function adviceList(params) {
  return request({
    url: '/setting/system_module/advice/list',
    method: 'get',
    params: params
  })
}

export function createAdvice(params) {
  return request({
    url: '/setting/system_module/advice/store',
    method: 'post',
    data: params
  })
}

export function editAdvice(id) {
  return request({
    url: '/setting/system_module/advice/edit/' + id,
    method: 'get',
    params: ''
  })
}

export function updateAdvice(id, params) {
  return request({
    url: '/setting/system_module/advice/update' + '/' + id,
    method: 'put',
    data: params
  })
}

export function deleteAdvice(id) {
  return request({
    url: '/setting/system_module/advice/destroy' + '/' + id,
    method: 'delete',
    data: id,
  })
}